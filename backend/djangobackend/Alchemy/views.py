from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes
from .models import AlchemyItem, AlchemyGroup, Recipe, VIALS_PRICES
from .serializers import AlchemyGroupDataResponseSerializer, AlchemyGroupDataSerializer, AlchemyItemSerializer
from Registros.models import Item, ItemRecord
from .services.alchemy_calculations_service import AlchemyCalculationsService


class CreateAlchemyItemView(generics.CreateAPIView):
    @extend_schema(
        tags=['Alchemy'],
        summary='Create alchemy item',
        description='Create a new AlchemyItem by resolving the group, validating the item, and linking its recipe.',
        request={
            'application/json': {
                'type': 'object',
                'required': ['group', 'item_id'],
                'properties': {
                    'group': {'type': 'string', 'description': 'Alchemy group name (Flasks, Elixirs, Potions)'},
                    'item_id': {'type': 'string', 'description': 'Item id_ingame'},
                    'yield_quantity': {'type': 'integer', 'description': 'Recipe yield quantity'},
                },
            },
        },
        responses={
            201: AlchemyItemSerializer,
            400: {'type': 'object', 'properties': {'error': {'type': 'string'}}},
            404: {'type': 'object', 'properties': {'error': {'type': 'string'}}},
        },
    )
    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        group_name = data.get('group')
        id_ingame = data.get('item_id')

        if isinstance(group_name, str):
            try:
                group = AlchemyGroup.objects.get(name__iexact=group_name)
            except AlchemyGroup.DoesNotExist:
                return Response({'error': f"Group '{group_name}' not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            group = None

        if not id_ingame:
            return Response({'error': f"Item id_ingame not provided."}, status=status.HTTP_400_BAD_REQUEST)

        item = Item.objects.filter(id_ingame=id_ingame).first()
        if not item:
            return Response({'error': f"Item with id_ingame '{id_ingame}' not found."}, status=status.HTTP_404_NOT_FOUND)

        recipe = Recipe.objects.filter(item=item).first()
        if not recipe:
            return Response({'error': f"No recipe found for '{item.name}'. Run register_reagents first."}, status=status.HTTP_404_NOT_FOUND)

        alchemy_item = AlchemyItem.objects.create(
            group=group,
            item_id=item,
            recipe=recipe,
            yield_quantity=data.get('yield_quantity', 1)
        )

        serializer = self.get_serializer(alchemy_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class GetAlchemyGroupsDataView(generics.ListAPIView):
    serializer_class = AlchemyGroupDataSerializer

    @extend_schema(
        tags=['Alchemy'],
        summary='Get alchemy groups data',
        description='GET lists all alchemy groups; POST calculates profit/cost data for each group using auction prices.',
        responses=AlchemyGroupDataResponseSerializer(many=True),
    )
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def get_queryset(self):
        return AlchemyGroup.objects.all()

    @extend_schema(
        tags=['Alchemy'],
        summary='Calculate alchemy profitability',
        description='Calculate profit/cost data for each alchemy group using auction house prices.',
        request=AlchemyGroupDataSerializer,
        responses={
            200: {
                'type': 'object',
                'properties': {
                    'groups_data': {'type': 'array', 'items': {'type': 'object'}},
                    'total_reagents_used': {'type': 'object'},
                },
            },
            404: {'type': 'object', 'properties': {'error': {'type': 'string'}}},
        },
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        faction = serializer.validated_data.get('faction')
        realm = serializer.validated_data.get('realm')
        selected_record = serializer.validated_data.get('selected_record')

        groups = AlchemyGroup.objects.prefetch_related('items__item_id', 'items__recipe__reagents__reagent').all()
        groups_data = AlchemyGroupDataResponseSerializer(groups, many=True).data

        records_data = ItemRecord.objects.select_related('item').filter(record__id=selected_record, record__auction_house__faction__iexact=faction, record__auction_house__realm_name__iexact=realm)
        if not records_data:
            return Response({'error': f"Record with id_ingame '{selected_record}' not found for faction '{faction}' and realm '{realm}'."}, status=status.HTTP_404_NOT_FOUND)
        records_map = {}

        for data in records_data:
            if data.item.id_ingame == "18256" or data.item.id_ingame == "8925":  # --- IGNORE ---
                item_key = data.item.name.upper().replace(" ", "_")
                market_data = {
                    "market_value": VIALS_PRICES.get(item_key),
                    "min_buyout": VIALS_PRICES.get(item_key),
                }
            else:
                market_data = {
                    "market_value": data.market_value,
                    "min_buyout": data.min_buyout,
                    "overriden_min_buyout": data.overriden_min_buyout,
                }
            records_map[data.item.id_ingame] = market_data
        
        GROUP_CALCULATIONS, TOTAL_REAGENTS_USED = AlchemyCalculationsService.calculate_groups_data(groups_data, records_map)
        return Response({
            "groups_data": GROUP_CALCULATIONS,
            "total_reagents_used": TOTAL_REAGENTS_USED
        }, status=status.HTTP_200_OK)