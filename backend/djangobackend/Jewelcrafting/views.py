from rest_framework import generics
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter

from .models import GemCuts, JewelcraftingItems
from .serializers import JewelcraftingItemsQuerySerializer
from Registros.models import ItemRecord


class GetJewelcraftingItemsView(generics.ListAPIView):
    @extend_schema(
        tags=['Jewelcrafting'],
        summary='Get jewelcrafting items',
        description='Return raw gems for prospecting and cut gems for gemcutting, enriched with auction house prices.',
        parameters=[
            OpenApiParameter(name='faction', description='Faction (Horde or Alliance)', required=True, type=str),
            OpenApiParameter(name='realm', description='Realm name', required=True, type=str),
            OpenApiParameter(name='record_id', description='Auction record ID', required=True, type=int),
        ],
        responses={
            200: {
                'type': 'object',
                'properties': {
                    'raw_gems': {
                        'type': 'array',
                        'items': {
                            'type': 'object',
                            'properties': {
                                'name': {'type': 'string'},
                                'procChance': {'type': 'string'},
                                'vendorPrice': {'type': 'integer'},
                                'ahPrice': {'type': 'number', 'nullable': True},
                            },
                        },
                    },
                    'cut_gems': {
                        'type': 'array',
                        'items': {
                            'type': 'object',
                            'properties': {
                                'name': {'type': 'string'},
                                'color': {'type': 'string'},
                                'rawGem': {'type': 'string'},
                                'craftingCost': {'type': 'number', 'nullable': True},
                                'ahPrice': {'type': 'number', 'nullable': True},
                            },
                        },
                    },
                },
            },
        },
    )
    def get(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)

        faction = serializer.validated_data['faction']
        realm = serializer.validated_data['realm']
        record_id = serializer.validated_data['record_id']

        price_map = {}
        records_qs = ItemRecord.objects.select_related('item').filter(
            record__id=record_id,
            record__auction_house__faction__iexact=faction,
            record__auction_house__realm_name__iexact=realm
        )
        for rec in records_qs:
            price_map[rec.item.id_ingame] = {
                'min_buyout': rec.min_buyout,
                'overriden_min_buyout': rec.overriden_min_buyout,
            }

        # Raw gems for Prospecting tab
        raw_gems = []
        jewel_items = JewelcraftingItems.objects.select_related('item').all()
        for ji in jewel_items:
            price_data = price_map.get(ji.item.id_ingame)
            ah_price = (price_data['overriden_min_buyout'] or price_data['min_buyout']) if price_data else None
            raw_gems.append({
                'name': ji.item.name,
                'procChance': ji.proc_chance,
                'vendorPrice': ji.vendor_price,
                'ahPrice': ah_price,
            })

        # Cut gems for Gemcutting tab
        cut_gems = []
        gem_cuts_qs = GemCuts.objects.select_related('gem_cut', 'gem__item').all()
        for gc in gem_cuts_qs:
            cut_price_data = price_map.get(gc.gem_cut.id_ingame)
            cut_ah_price = (cut_price_data['overriden_min_buyout'] or cut_price_data['min_buyout']) if cut_price_data else None
            raw_gem_price_data = price_map.get(gc.gem.item.id_ingame)
            crafting_cost = (raw_gem_price_data['overriden_min_buyout'] or raw_gem_price_data['min_buyout']) if raw_gem_price_data else None
            cut_gems.append({
                'name': gc.gem_cut.name,
                'color': gc.color,
                'rawGem': gc.gem.item.name,
                'craftingCost': crafting_cost,
                'ahPrice': cut_ah_price,
            })

        return Response({'raw_gems': raw_gems, 'cut_gems': cut_gems}, status=200)