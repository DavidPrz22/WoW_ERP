from rest_framework import generics, status
from rest_framework.response import Response
from .models import CookingItem, CookingRecipe
from .serializers import CookingGroupDataSerializer, CookingItemSerializer
from .services.cooking_calculations_service import CookingCalculationsService
from Registros.models import ItemRecord


class GetCookingGroupsDataView(generics.ListAPIView):
    serializer_class = CookingGroupDataSerializer

    def get_queryset(self):
        return CookingItem.objects.all()

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        faction = serializer.validated_data.get('faction')
        realm = serializer.validated_data.get('realm')
        selected_record = serializer.validated_data.get('selected_record')

        cooking_items = CookingItem.objects.select_related('item').prefetch_related(
            'recipes__reagents__reagent'
        ).all()

        items_data = CookingItemSerializer(cooking_items, many=True).data

        records_data = ItemRecord.objects.select_related('item').filter(
            record__id=selected_record,
            record__auction_house__faction__iexact=faction,
            record__auction_house__realm_name__iexact=realm
        )

        if not records_data:
            return Response(
                {'error': f"No records found for record ID '{selected_record}', faction '{faction}', and realm '{realm}'."},
                status=status.HTTP_404_NOT_FOUND
            )

        records_map = {}
        for data in records_data:
            market_data = {
                "market_value": data.market_value,
                "min_buyout": data.min_buyout,
                "overriden_min_buyout": data.overriden_min_buyout,
            }
            records_map[data.item.id_ingame] = market_data

        grouped_by_type = {}
        for item in items_data:
            item_type = item.get('type', 'Other')
            if item_type not in grouped_by_type:
                grouped_by_type[item_type] = {'type': item_type, 'items': []}
            grouped_by_type[item_type]['items'].append(item)

        groups_data = list(grouped_by_type.values())

        GROUP_CALCULATIONS, TOTAL_REAGENTS_USED = CookingCalculationsService.calculate_groups_data(
            groups_data, records_map
        )

        return Response({
            "groups_data": GROUP_CALCULATIONS,
            "total_reagents_used": TOTAL_REAGENTS_USED
        }, status=status.HTTP_200_OK)
