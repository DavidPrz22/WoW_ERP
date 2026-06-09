from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from .models import( 
    Item, 
    Faction, 
    Records, 
    ItemRecord, 
    ItemClass, 
    Quality, 
    AuctionHouse, 
    Userdata
    )
from .serializers import (
    PricingHistoryQuerySerializer, 
    ItemClassSerializer, 
    ItemSearchSerializer,
    PricingFormattedSerializer, 
    RecordsSerializer, 
    OverridePriceSerializer
    )

from django.utils import timezone
from datetime import datetime
from rest_framework.pagination import PageNumberPagination
from django.db.models import Count, Q
from django.core.management import call_command

class PricingHistoryView(GenericAPIView):
    @extend_schema(
        tags=['Registros'],
        summary='Get item pricing history',
        description='Return time-series pricing data for a specific item on a given realm/faction.',
        parameters=[
            OpenApiParameter(name='item_id', description='Item ID (id_ingame)', required=True, type=str),
            OpenApiParameter(name='faction', description='Faction (Horde or Alliance)', required=True, type=str),
            OpenApiParameter(name='realm', description='Realm name', required=True, type=str),
            OpenApiParameter(name='from_date', description='Start date (ISO format)', required=False, type=str),
            OpenApiParameter(name='to_date', description='End date (ISO format)', required=False, type=str),
        ],
        responses={
            200: {
                'type': 'object',
                'properties': {
                    'id': {'type': 'string'},
                    'quality': {'type': 'string'},
                    'name': {'type': 'string'},
                    'icon': {'type': 'string'},
                    'chartData': {
                        'type': 'array',
                        'items': {'$ref': '#/components/schemas/PricingFormatted'},
                    },
                },
            },
            400: {'type': 'object', 'properties': {'detail': {'type': 'string'}}},
        },
    )
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
    @extend_schema(
        tags=['Registros'],
        summary='Get item class and subclass filters',
        description='Returns a structured mapping of item classes and their associated subclasses.',
        responses={200: ItemClassSerializer(many=True)},
    )
    def get(self, request):
        classes = ItemClass.objects.prefetch_related('subclasses').all()
        serializer = ItemClassSerializer(classes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class FilterQualityView(GenericAPIView):
    @extend_schema(
        tags=['Registros'],
        summary='Get quality filter options',
        description='Returns available item quality options (Common, Uncommon, Rare, Epic, Legendary).',
        responses={200: {'type': 'array', 'items': {'type': 'string'}}},
    )
    def get(self, request):
        qualities = [choice[0] for choice in Quality.choices]
        return Response(qualities, status=status.HTTP_200_OK)


class FilterFactionView(GenericAPIView):
    @extend_schema(
        tags=['Registros'],
        summary='Get faction filter options',
        description='Returns available faction options (Horde, Alliance).',
        responses={200: {'type': 'array', 'items': {'type': 'string'}}},
    )
    def get(self, request):
        factions = [choice[0] for choice in Faction.choices]
        return Response(factions, status=status.HTTP_200_OK)


class FilterRealmView(GenericAPIView):
    @extend_schema(
        tags=['Registros'],
        summary='Get realm filter options',
        description='Returns available realm options from the AuctionHouse model.',
        responses={200: {'type': 'array', 'items': {'type': 'object', 'properties': {'realm_name': {'type': 'string'}}}}},
    )
    def get(self, request):
        realms = AuctionHouse.objects.values('realm_name').distinct()
        return Response(list(realms), status=status.HTTP_200_OK)


class ItemSearchView(GenericAPIView):
    @extend_schema(
        tags=['Registros'],
        summary='Search items',
        description='Returns a list of items matching the case-insensitive search and applied filters. Limited to 50 results.',
        parameters=[
            OpenApiParameter(name='searchTerm', description='Case-insensitive search term', required=False, type=str),
            OpenApiParameter(name='class', description='Item class filter', required=False, type=str),
            OpenApiParameter(name='subclass', description='Item subclass filter', required=False, type=str),
            OpenApiParameter(name='quality', description='Item quality filter', required=False, type=str),
        ],
        responses={200: ItemSearchSerializer(many=True)},
    )
    def get(self, request):

        searchterm = request.query_params.get('searchTerm', '').strip()
        item_class = request.query_params.get('class', '').strip()
        item_subclass = request.query_params.get('subclass', '').strip()
        quality = request.query_params.get('quality', '').strip()

        queryset = Item.objects.select_related('item_subclass', 'item_subclass__item_class').all()

        if searchterm:
            queryset = queryset.filter(name__icontains=searchterm)

        if item_class and item_class != 'all':
            queryset = queryset.filter(item_subclass__item_class__name__iexact=item_class)

        if item_subclass and item_subclass != 'all':
            queryset = queryset.filter(item_subclass__name__iexact=item_subclass)

        if quality and quality != 'all':
            queryset = queryset.filter(quality=quality)

        # Limit to 50 results to prevent massive responses
        queryset = queryset.order_by('name')[:50]

        serializer = ItemSearchSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RecordsPagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 50


class RecordsView(GenericAPIView):
    @extend_schema(
        tags=['Registros'],
        summary='List auction scan snapshots',
        description='List paginated auction house scan snapshots with optional realm, faction, and search filters.',
        parameters=[
            OpenApiParameter(name='realm', description='Filter by realm name', required=False, type=str),
            OpenApiParameter(name='faction', description='Filter by faction', required=False, type=str),
            OpenApiParameter(name='search', description='Search by ID or realm name', required=False, type=str),
            OpenApiParameter(name='page', description='Page number', required=False, type=int),
            OpenApiParameter(name='page_size', description='Items per page (max 50)', required=False, type=int),
        ],
        responses={200: RecordsSerializer(many=True)},
    )
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
        return Response({
            'count': queryset.count(),
            'next': None,
            'previous': None,
            'results': serializer.data
        }, status=status.HTTP_200_OK)


class GenerateRecordView(GenericAPIView):
    @extend_schema(
        tags=['Registros'],
        summary='Generate auction record',
        description='Trigger the get_pricing_data management command to fetch a new auction house pricing snapshot.',
        request=None,
        responses={
            200: {'type': 'object', 'properties': {'message': {'type': 'string'}}},
            500: {'type': 'object', 'properties': {'error': {'type': 'string'}}},
        },
    )
    def post(self, request):
        try:
            call_command('get_pricing_data')
            return Response({'message': 'Record generated successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GenerateRecordsDataView(GenericAPIView):
    @extend_schema(
        tags=['Registros'],
        summary='Get material pricing data',
        description='Return pricing data for predefined material categories (herbs, ores, cloth, etc.) for a selected auction record.',
        parameters=[
            OpenApiParameter(name='realm', description='Realm name', required=True, type=str),
            OpenApiParameter(name='faction', description='Faction (Horde or Alliance)', required=True, type=str),
            OpenApiParameter(name='selected_record', description='Auction record ID', required=True, type=str),
        ],
        responses={
            200: {
                'type': 'object',
                'properties': {
                    'groups': {
                        'type': 'array',
                        'items': {
                            'type': 'object',
                            'properties': {
                                'title': {'type': 'string'},
                                'entries': {
                                    'type': 'array',
                                    'items': {
                                        'type': 'object',
                                        'properties': {
                                            'recordId': {'type': 'string'},
                                            'itemId': {'type': 'string'},
                                            'name': {'type': 'string'},
                                            'price': {'type': 'number'},
                                            'icon': {'type': 'string'},
                                            'marketValuePercent': {'type': 'integer'},
                                            'overridenPrice': {'type': 'number', 'nullable': True},
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            400: {'type': 'object', 'properties': {'error': {'type': 'string'}}},
            500: {'type': 'object', 'properties': {'error': {'type': 'string'}}},
        },
    )
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

                        market_value_percent = round((record.min_buyout / record.market_value) * 100) if record.market_value > 0 else 0
                        price_entries.append({
                            'recordId': str(record.id),
                            'itemId': str(record.item.id_ingame) if hasattr(record.item, 'id_ingame') else str(record.item.id),
                            'name': record.item.name,
                            'price': record.min_buyout,
                            'icon': record.item.icon,
                            'marketValuePercent': market_value_percent,
                            'overridenPrice': record.overriden_min_buyout,
                        })
                
                price_group['entries'] = price_entries
                PRICE_GROUPS.append(price_group)

            user_data = Userdata.objects.filter(id_user=request.user.id or 'davidprz').first()

            if user_data:
                user_data.dynamic_data ['last_record_selected'] = selected_record_id
                user_data.save()

            return Response({'groups':PRICE_GROUPS}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        

class OverridePriceView(GenericAPIView):
    @extend_schema(
        tags=['Registros'],
        summary='Override item price',
        description='Set or clear a custom price override for a specific ItemRecord.',
        request=OverridePriceSerializer,
        responses={
            200: {'type': 'object', 'properties': {'message': {'type': 'string'}}},
            404: {'type': 'object', 'properties': {'error': {'type': 'string'}}},
            500: {'type': 'object', 'properties': {'error': {'type': 'string'}}},
        },
    )
    def post(self, request):
        try:
            serializer = OverridePriceSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)


            record_id = serializer.validated_data.get('record_id')
            item_id = serializer.validated_data.get('item_id')
            new_price = serializer.validated_data.get('new_price')

            item_record = ItemRecord.objects.get(id=record_id, item__id_ingame=item_id)
            item_record.overriden_min_buyout = new_price
            item_record.save()

            return Response({'message': 'Price overridden successfully'}, status=status.HTTP_200_OK)
        except ItemRecord.DoesNotExist:
            return Response({'error': 'ItemRecord not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            


class UserDataRecordView(GenericAPIView):
    @extend_schema(
        tags=['Registros'],
        summary='Get user last selected record',
        description="Return the authenticated user's last selected auction record details.",
        responses={
            200: {
                'type': 'object',
                'properties': {
                    'recordDetails': {
                        'type': 'object',
                        'properties': {
                            'recordId': {'type': 'integer'},
                            'realm': {'type': 'string'},
                            'faction': {'type': 'string'},
                        },
                    },
                },
            },
            404: {'type': 'object', 'properties': {'error': {'type': 'string'}}},
        },
    )
    def get(self, request):
        user_data = Userdata.objects.filter(id_user=request.user.id or 'davidprz').first()
        return_data = {}

        if user_data and user_data.dynamic_data['last_record_selected']:

            last_record_id = user_data.dynamic_data['last_record_selected']
            last_record = Records.objects.filter(id=last_record_id).first()

            if last_record:
                return_data['recordDetails'] = {
                    'recordId': last_record.id,
                    'realm': last_record.auction_house.realm_name,
                    'faction': last_record.auction_house.faction
                }

        if user_data:
            return Response(return_data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'User data not found'}, status=status.HTTP_404_NOT_FOUND)


class DeleteRecordView(GenericAPIView):
    @extend_schema(
        tags=['Registros'],
        summary='Delete auction record',
        description="Delete an auction house scan snapshot and all its cascading ItemRecord entries.",
        parameters=[
            OpenApiParameter(name='record_id', description='Record ID to delete', required=True, type=int, location=OpenApiParameter.PATH),
        ],
        responses={
            200: {'type': 'object', 'properties': {'message': {'type': 'string'}}},
            404: {'type': 'object', 'properties': {'error': {'type': 'string'}}},
            500: {'type': 'object', 'properties': {'error': {'type': 'string'}}},
        },
    )
    def delete(self, request, record_id):
        try:
            record = Records.objects.get(id=record_id)
            record.delete()
            return Response({'message': 'Record deleted successfully'}, status=status.HTTP_200_OK)
        except Records.DoesNotExist:
            return Response({'error': 'Record not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)