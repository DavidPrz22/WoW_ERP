from typing import Dict, List, Any
from collections import defaultdict

from Boe.models import BoeItem
from Boe.serializers import BoeItemSerializer
from Registros.models import ItemRecord


class BoeCalculationsService:
    @classmethod
    def get_grouped_boe_data(cls, faction: str, realm: str, record_id: int) -> List[Dict[str, Any]]:
        boe_items = BoeItem.objects.select_related('item').prefetch_related(
            'recipes__reagents__reagent'
        ).all()

        records_data = ItemRecord.objects.select_related('item').filter(
            record__id=record_id,
            record__auction_house__faction__iexact=faction,
            record__auction_house__realm_name__iexact=realm
        )

        records_map = {}
        for record in records_data:
            records_map[record.item.id_ingame] = {
                'min_buyout': record.min_buyout,
                'overriden_min_buyout': record.overriden_min_buyout,
            }

        serializer_context = {'records_map': records_map}

        profession_map: Dict[str, Dict[str, List]] = defaultdict(lambda: defaultdict(list))

        for boe_item in boe_items:
            serialized = BoeItemSerializer(boe_item, context=serializer_context).data
            profession = boe_item.profession
            category = boe_item.category

            if profession and category:
                profession_map[profession][category].append(serialized)

        result = []
        for profession, categories in profession_map.items():
            profession_entry = {
                'profession': profession,
                'items': []
            }
            for category, items in categories.items():
                profession_entry['items'].append({
                    'category': category,
                    'items': items
                })
            result.append(profession_entry)

        return result
