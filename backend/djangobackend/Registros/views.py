from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework.views import APIView
from django.db import connection
from django.conf import settings
from django.db.models import Prefetch
from .models import Item, Faction, Records, ItemRecord, ItemClass, Quality, AuctionHouse
from .serializers import PricingHistorySerializer, ItemClassSerializer, ItemSerializer, AuctionHouseSerializer, PricingFormattedSerializer, RecordsSerializer
from django.utils import timezone
from datetime import datetime
from rest_framework.pagination import PageNumberPagination
from django.db.models import Count, Q

class PricingHistoryView(GenericAPIView):
    def get(self, request):
        serializer = PricingHistorySerializer(data=request.query_params)
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
        return Response(serializer.data, status=status.HTTP_200_OK)

class FilterClassSubclassView(APIView):
    """
    Returns a structured mapping of classes and their associated subclasses.
    """
    def get(self, request):
        classes = ItemClass.objects.prefetch_related('subclasses').all()
        serializer = ItemClassSerializer(classes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class FilterQualityView(APIView):
    """
    Returns available options for Quality.
    """
    def get(self, request):
        qualities = [choice[0] for choice in Quality.choices]
        return Response(qualities, status=status.HTTP_200_OK)

class FilterFactionView(APIView):
    """
    Returns available options for Faction.
    """
    def get(self, request):
        factions = [choice[0] for choice in Faction.choices]
        return Response(factions, status=status.HTTP_200_OK)

class FilterRealmView(APIView):
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
        
        serializer = ItemSerializer(queryset, many=True)
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