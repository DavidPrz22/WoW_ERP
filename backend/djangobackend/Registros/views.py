from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from django.db import connection
from django.conf import settings
from .models import Item, Faction, Realm, Records
from .serializers import PricingHistorySerializer
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

        
        records_queryset = Records.objects.filter(
            auction_house__realm_id=realm_id,
            auction_house__faction=faction_id,
            timestamp__range=(datetime.fromisoformat(from_date), datetime.fromisoformat(to_date)),
        )

        item_record_queryset = ItemRecord.objects.filter(
            record__in=records_queryset,
            item_id=item_id,
        ).values(
            'record__timestamp', 
            'market_value', 
            'min_buyout', 
            'num_auctions', 
            'historical'
        ).order_by('record__timestamp')
        
        return Response(item_record_queryset, status=status.HTTP_200_OK)

        