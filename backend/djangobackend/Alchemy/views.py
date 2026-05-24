from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from .models import AlchemyItem, AlchemyGroup
from .serializers import AlchemyGroupDataResponseSerializer, AlchemyGroupDataSerializer, AlchemyItemSerializer
from Registros.models import Item, ItemRecord
from .services.alchemy_calculations_service import AlchemyCalculationsService

# [
#   {
#     "group": "Flasks",
#     "items": [
#       {
#         "name": "Flask of Pure Death",
#         "craftingCost": 100,
#         "breakeven": 150,
#         "ahPrice": 120,
#         "profitPerItem": 20,
#         "ROI": 0.2,
#       }
#     ]
#   }
# ]

class CreateAlchemyItemView(generics.CreateAPIView):
    queryset = AlchemyItem.objects.all()
    serializer_class = AlchemyItemSerializer

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        group_name = data.get('group')
        id_ingame = data.get('item_id')

        if isinstance(group_name, str):
            try:
                group = AlchemyGroup.objects.get(name__iexact=group_name)
                data['group'] = group.id
            except AlchemyGroup.DoesNotExist:
                return Response({'error': f"Group '{group_name}' not found."}, status=status.HTTP_404_NOT_FOUND)

        if not id_ingame:
            return Response({'error': f"Item id_ingame not provided."}, status=status.HTTP_400_BAD_REQUEST)

        item = Item.objects.filter(id_ingame=id_ingame).first()
        if not item:
            return Response({'error': f"Item with id_ingame '{id_ingame}' not found."}, status=status.HTTP_404_NOT_FOUND)
        
        data['item_id'] = item.id

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class GetAlchemyGroupsDataView(generics.ListAPIView):
    serializer_class = AlchemyGroupDataSerializer

    def get_queryset(self):
        queryset = AlchemyGroup.objects.all()
        return queryset
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        faction = serializer.validated_data.get('faction')
        realm = serializer.validated_data.get('realm')
        selected_record = serializer.validated_data.get('selected_record')

        groups = AlchemyGroup.objects.prefetch_related('items__item_id', 'items__reagent_for__reagent').all()
        groups_data = AlchemyGroupDataResponseSerializer(groups, many=True).data

        records_data = ItemRecord.objects.select_related('item').filter(record__id=selected_record, record__auction_house__faction__iexact=faction, record__auction_house__realm_name__iexact=realm)
        if not records_data:
            return Response({'error': f"Record with id_ingame '{selected_record}' not found for faction '{faction}' and realm '{realm}'."}, status=status.HTTP_404_NOT_FOUND)
        records_map = {}

        for data in records_data:
            records_map[data.item.id_ingame] = {
                "market_value": data.market_value,
                "min_buyout": data.min_buyout,
                "overriden_min_buyout": data.overriden_min_buyout,
            }
        
        GROUP_CALCULATIONS, TOTAL_REAGENTS_USED = AlchemyCalculationsService.calculate_groups_data(groups_data, records_map)
        return Response({
            "groups_data": GROUP_CALCULATIONS,
            "total_reagents_used": TOTAL_REAGENTS_USED
        }, status=status.HTTP_200_OK)