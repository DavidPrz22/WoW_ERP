from rest_framework import generics, status
from rest_framework.response import Response
from .models import EngItem
from .serializers import EngineeringDataQuerySerializer, EngItemSerializer
from Registros.models import ItemRecord


class GetEngineeringDataView(generics.GenericAPIView):
    serializer_class = EngineeringDataQuerySerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        faction = serializer.validated_data.get('faction')
        realm = serializer.validated_data.get('realm')
        record_id = serializer.validated_data.get('record_id')

        parts = EngItem.objects.filter(type='Enhancement').prefetch_related(
            'recipes__reagents__reagent'
        ).select_related('item')

        explosives = EngItem.objects.filter(type='Explosive').prefetch_related(
            'recipes__reagents__reagent'
        ).select_related('item')

        records_map = {}
        records_data = ItemRecord.objects.select_related('item').filter(
            record__id=record_id,
            record__auction_house__faction__iexact=faction,
            record__auction_house__realm_name__iexact=realm
        )

        for record in records_data:
            records_map[record.item.id_ingame] = {
                'min_buyout': record.min_buyout,
                'overriden_min_buyout': record.overriden_min_buyout,
            }

        parts_serializer = EngItemSerializer(parts, many=True, context={'records_map': records_map})
        explosives_serializer = EngItemSerializer(explosives, many=True, context={'records_map': records_map})

        total_reagents_used = {
            'Parts': self._build_reagent_map(parts),
            'Explosives': self._build_reagent_map(explosives),
        }

        return Response({
            'parts': parts_serializer.data,
            'explosives': explosives_serializer.data,
            'total_reagents_used': total_reagents_used,
        }, status=status.HTTP_200_OK)

    @staticmethod
    def _build_reagent_map(items):
        result = {}
        for item in items:
            recipe = item.recipes.first()
            if not recipe:
                continue
            item_name = item.item.name
            reagents = []
            for eng_reagent in recipe.reagents.all():
                reagents.append({
                    'name': eng_reagent.reagent.name,
                    'id': eng_reagent.reagent.id_ingame,
                    'qty': eng_reagent.quantity,
                })
            result[item_name] = reagents
        return result
