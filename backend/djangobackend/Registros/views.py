from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework.views import APIView
from django.db import connection
from django.conf import settings
from django.db.models import Prefetch
from .models import Item, Faction, Records, ItemRecord, ItemClass, Quality, AuctionHouse
from .serializers import PricingHistorySerializer, ItemClassSerializer, ItemSerializer, AuctionHouseSerializer, PricingFormattedSerializer
from datetime import datetime

class PricingHistoryView(GenericAPIView):
    def get(self, request):
        serializer = PricingHistorySerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        
        item_id = serializer.validated_data.get('item_id')
        faction_id = serializer.validated_data.get('faction_id')
        realm_id = serializer.validated_data.get('realm_id')
        from_date = serializer.validated_data.get('from_date')
        to_date = serializer.validated_data.get('to_date')

        # Default dates if not provided
        if not from_date:
            from_date = "2000-01-01T00:00:00"
        if not to_date:
            to_date = datetime.now().isoformat()
        
        records_queryset = Records.objects.filter(
            auction_house__realm_id=realm_id,
            auction_house__faction=faction_id,
            timestamp__range=(datetime.fromisoformat(from_date), datetime.fromisoformat(to_date)),
        )

        item_record_queryset = ItemRecord.objects.filter(
            record__in=records_queryset,
            item__id_ingame=item_id,
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
        realms = AuctionHouse.objects.values('realm_id', 'realm_name').distinct()
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