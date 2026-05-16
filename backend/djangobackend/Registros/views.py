from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from .models import Item, Faction, Records, ItemRecord, ItemClass, Quality, AuctionHouse
from .serializers import PricingHistoryQuerySerializer, ItemClassSerializer, ItemSearchSerializer, PricingFormattedSerializer, RecordsSerializer
from django.utils import timezone
from datetime import datetime
from rest_framework.pagination import PageNumberPagination
from django.db.models import Count, Q
from django.core.management import call_command

class PricingHistoryView(GenericAPIView):
    def get(self, request):
        serializer = PricingHistoryQuerySerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        
        item_id = serializer.validated_data.get('item_id')
        from_date_str = serializer.validated_data.get('from_date')
        to_date_str = serializer.validated_data.get('to_date')
        faction = serializer.validated_data.get('faction')
        realm = serializer.validated_data.get('realm')
        
        # Parse from_date
        if from_date_str:
            from_date = datetime.fromisoformat(from_date_str)
        else:
            from_date = timezone.make_aware(datetime(2000, 1, 1))
            
        # Parse to_date
        if to_date_str:
            to_date = datetime.fromisoformat(to_date_str)
        else:
            to_date = timezone.now()

        if timezone.is_naive(from_date):
            from_date = timezone.make_aware(from_date)
        if timezone.is_naive(to_date):
            to_date = timezone.make_aware(to_date)
        
        item_record_queryset = ItemRecord.objects.filter(
            item__id_ingame=item_id,
            record__auction_house__realm_name=realm,
            record__auction_house__faction=faction,
            record__timestamp__gte=from_date,
            record__timestamp__lte=to_date,
        ).values(
            'record__timestamp', 
            'market_value', 
            'min_buyout', 
            'num_auctions', 
            'historical'
        ).order_by('record__timestamp')

        
        serializer = PricingFormattedSerializer(item_record_queryset, many=True)

        item_details = Item.objects.get(id_ingame=item_id)
        quality = item_details.quality
        name = item_details.name
        icon = item_details.icon

        return Response({
            'id': item_id,
            'quality': quality,
            'name': name,
            'icon': icon,
            'chartData': serializer.data
            }, status=status.HTTP_200_OK)


class FilterClassSubclassView(GenericAPIView):
    """
    Returns a structured mapping of classes and their associated subclasses.
    """
    def get(self, request):
        classes = ItemClass.objects.prefetch_related('subclasses').all()
        serializer = ItemClassSerializer(classes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class FilterQualityView(GenericAPIView):
    """
    Returns available options for Quality.
    """
    def get(self, request):
        qualities = [choice[0] for choice in Quality.choices]
        return Response(qualities, status=status.HTTP_200_OK)


class FilterFactionView(GenericAPIView):
    """
    Returns available options for Faction.
    """
    def get(self, request):
        factions = [choice[0] for choice in Faction.choices]
        return Response(factions, status=status.HTTP_200_OK)


class FilterRealmView(GenericAPIView):
    """
    Returns available options for Realm from the AuctionHouse model.
    """
    def get(self, request):
        realms = AuctionHouse.objects.values('realm_name').distinct()
        return Response(list(realms), status=status.HTTP_200_OK)


class ItemSearchView(GenericAPIView):
    """
    Returns a list of items matching the case-insensitive search and applied filters.
    Query Params: searchterm, class, subclass, quality
    """
    def get(self, request):
        searchterm = request.query_params.get('searchTerm', '')
        item_class = request.query_params.get('class', '')
        item_subclass = request.query_params.get('subclass', '')
        quality = request.query_params.get('quality', '')

        queryset = Item.objects.select_related('item_subclass', 'item_subclass__item_class').all()

        if searchterm:
            queryset = queryset.filter(name__icontains=searchterm)
        
        if item_class and item_class != 'all':
            queryset = queryset.filter(item_subclass__item_class__name=item_class)
            
        if item_subclass and item_subclass != 'all':
            queryset = queryset.filter(item_subclass__name=item_subclass)
            
        if quality and quality != 'all':
            queryset = queryset.filter(quality=quality)
            
        # Limit to 50 results to prevent massive responses
        queryset = queryset[:50]
        
        serializer = ItemSearchSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RecordsPagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 50


class RecordsView(GenericAPIView):
    pagination_class = RecordsPagination

    def get(self, request):
        queryset = Records.objects.select_related('auction_house').annotate(
            item_count=Count('item_records')
        ).order_by('-timestamp')
        
        realm = request.query_params.get('realm')
        faction = request.query_params.get('faction')
        search = request.query_params.get('search')
        
        if realm:
            queryset = queryset.filter(auction_house__realm_name__iexact=realm)
        if faction:
            queryset = queryset.filter(auction_house__faction__iexact=faction)
        if search:
            if search.isdigit():
                queryset = queryset.filter(Q(id=search) | Q(auction_house__realm_name__icontains=search))
            else:
                queryset = queryset.filter(auction_house__realm_name__icontains=search)
            
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = RecordsSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = RecordsSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GenerateRecordView(GenericAPIView):
    def post(self, request):
        try:
            call_command('get_pricing_data')
            return Response({'message': 'Record generated successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GenerateRecordsDataView(GenericAPIView):
    def get(self, request):
        
        HERBS_GROUP = ["Felweed", "Dreaming Glory", "Nightmare Vine", "Terocone", "Ancient Lichen", "Netherbloom", "Mana Thistle", "Ragveil", "Fel Lotus", "Dreamfoil", "Mountain Silversage", "Plaguebloom", "Icecap", "Black Lotus", "Arthas' Tears", "Blindweed", "Gromsblood", "Firebloom", "Golden Sansam"]
        ORE_BARS_GROUP = ["Fel Iron Ore", "Fel Iron Bar", "Adamantite Ore", "Adamantite Bar", "Khorium Ore", "Khorium Bar", "Eternium Ore", "Eternium Bar", "Felsteel Bar", "Hardened Adamantite Bar"]
        CLOTH_GROUP = ["Netherweave Cloth", "Netherweb Spider Silk", "Spellcloth", "Shadowcloth", "Primal Mooncloth", "Bolt of Netherweave", "Bolt of Imbued Netherweave"]
        LEATHER_GROUP = ["Knothide Leather", "Knothide Leather Scraps", "Heavy Knothide Leather", "Wind Scales", "Fel Hide", "Nether Dragonscales", "Thick Clefthoof Leather", "Fel Scales", "Cobra Scales"]
        ENCHANTING_GROUP = ["Arcane Dust", "Greater Planar Essence", "Large Prismatic Shard", "Void Crystal", "Large Brilliant Shard"]
        JEWELCRAFTING_GROUP = ["Living Ruby", "Dawnstone", "Star of Elune", "Noble Topaz", "Talasite", "Nightseye", "Adamantite Powder"]
        COOKING_GROUP = ["Warped Flesh", "Figluster's Mudfish", "Clefthoof Meat", "Chunk o' Basilisk", "Icefin Bluefish", "Serpent Flesh", "Golden Darter", "Furious Crawdad", "Talbuk Venison", "Buzzard Meat", "Huge Spotted Feltail"]
        ELEMENTALS_GROUP = ["Primal Mana", "Primal Earth", "Primal Life", "Primal Fire", "Primal Air", "Primal Shadow", "Primal Water", "Mote of Mana", "Mote of Earth", "Mote of Life", "Mote of Fire", "Mote of Air", "Mote of Shadow", "Mote of Water", "Primal Might"]
        VIALS_GROUP = ["Imbued Vial", "Crystal Vial"]
        
        DATA_RECORDS = {
            'HERB PRICES': HERBS_GROUP,
            'ORE AND BAR PRICES': ORE_BARS_GROUP,
            'CLOTH PRICES': CLOTH_GROUP,
            'LEATHER PRICES': LEATHER_GROUP,
            'ENCHANTING PRICES': ENCHANTING_GROUP,
            'JEWELCRAFTING PRICES': JEWELCRAFTING_GROUP,
            'COOKING PRICES': COOKING_GROUP,
            'ELEMENTALS PRICES': ELEMENTALS_GROUP,
            'VIALS PRICES': VIALS_GROUP
        }

        realm = request.query_params.get('realm')
        faction = request.query_params.get('faction')
        selected_record_id = request.query_params.get('selected_record')

        if not realm or not faction or not selected_record_id:
            return Response({'error': 'Realm, faction and selected record are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            items_map = {}
            
            for (title, items) in DATA_RECORDS.items():
                items_map[title] = ItemRecord.objects.filter(
                    item__name__in=items, 
                    record_id=selected_record_id,
                    record__auction_house__realm_name__iexact=realm,
                    record__auction_house__faction__iexact=faction,
                )
            
            PRICE_GROUPS = []

            for (title, items) in items_map.items():
                price_group = {
                    'title': title
                }

                price_entries = []
                for record in items:
                    if record.item:
                        price_entries.append({
                            'recordId': str(record.id),
                            'itemId': str(record.item.id_ingame) if hasattr(record.item, 'id_ingame') else str(record.item.id),
                            'name': record.item.name,
                            'price': record.min_buyout,
                            'icon': record.item.icon,
                            'overridenPrice': record.overriden_min_buyout,
                        })
                
                price_group['entries'] = price_entries
                PRICE_GROUPS.append(price_group)
            
            return Response({'groups':PRICE_GROUPS}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        
            