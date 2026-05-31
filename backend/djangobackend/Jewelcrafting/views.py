from rest_framework import generics
from rest_framework.response import Response

from .models import GemCuts, JewelcraftingItems
from .serializers import JewelcraftingItemsQuerySerializer
from Registros.models import ItemRecord


class GetJewelcraftingItemsView(generics.ListAPIView):
    serializer_class = JewelcraftingItemsQuerySerializer

    def get_queryset(self):
        return JewelcraftingItems.objects.none()

    def get(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)

        faction = serializer.validated_data['faction']
        realm = serializer.validated_data['realm']
        record_id = serializer.validated_data['selected_record']

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

        gem_cuts = []
        gem_cuts_qs = GemCuts.objects.select_related('gem_cut', 'gem__item').all()
        for gc in gem_cuts_qs:
            cut_price_data = price_map.get(gc.gem_cut.id_ingame)
            base_price_data = price_map.get(gc.gem.item.id_ingame)

            if cut_price_data is not None:
                cut_ah_price = cut_price_data['overriden_min_buyout'] or cut_price_data['min_buyout']
            else:
                cut_ah_price = None

            if base_price_data is not None:
                crafting_cost = base_price_data['overriden_min_buyout'] or base_price_data['min_buyout']
            else:
                crafting_cost = None

            gem_cuts.append({
                'name': gc.gem_cut.name,
                'color': gc.color,
                'ahPrice': cut_ah_price,
                'craftingCost': crafting_cost,
            })

        prospecting = []
        jewel_items = JewelcraftingItems.objects.select_related('item').all()
        for ji in jewel_items:
            price_data = price_map.get(ji.item.id_ingame)

            if price_data is not None:
                ah_price = price_data['overriden_min_buyout'] or price_data['min_buyout']
            else:
                ah_price = None

            prospecting.append({
                'name': ji.item.name,
                'procChance': ji.proc_chance,
                'vendorPrice': ji.vendor_price,
                'ahPrice': ah_price,
            })

        return Response({'Prospecting': prospecting, 'GemCutting': gem_cuts}, status=200)
