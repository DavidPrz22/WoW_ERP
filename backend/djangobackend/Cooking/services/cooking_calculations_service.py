from typing import Dict, List, Tuple, Any


class CookingCalculationsService:
    AH_CUT_MULTIPLIER = 0.95

    @classmethod
    def calculate_groups_data(cls, groups_data: List[Dict], records_map: Dict) -> Tuple[Dict, Dict]:
        """Calculates profitability metrics for all cooking groups grouped by type."""
        type_calculations = []
        total_reagents_used = {}

        for group in groups_data:
            type_name = group.get('type')
            items_data = []

            if type_name not in total_reagents_used:
                total_reagents_used[type_name] = {}

            for item in group['items']:
                item_name = item.get('name', 'Unknown Item')
                item_reagents = []
                item_data = cls._process_item(item, records_map, item_reagents)
                items_data.append(item_data)
                total_reagents_used[type_name][item_name] = item_reagents

            type_calc = {
                "type": type_name,
                "items": items_data
            }
            type_calculations.append(type_calc)

        return type_calculations, total_reagents_used

    @classmethod
    def _process_item(cls, item: Dict, records_map: Dict, item_reagents: List) -> Dict:
        """Processes a single cooking item, computing its crafting cost and AH price."""
        item_id = item.get('id_ingame')
        ah_price = cls._get_ah_price(item_id, records_map)
        yield_quantity = item.get('yield_quantity', 1)

        crafting_cost = cls._calculate_reagents_cost(
            item.get('reagents', []),
            records_map,
            item_reagents
        )

        crafting_cost_per_unit = crafting_cost / yield_quantity if yield_quantity > 0 else crafting_cost

        return {
            'name': item.get('name', 'Unknown Item'),
            'id_ingame': item_id,
            'type': item.get('type'),
            'yield_quantity': yield_quantity,
            'AHPrice': ah_price,
            'craftingCost': crafting_cost_per_unit
        }

    @staticmethod
    def _get_ah_price(item_id: str, records_map: Dict) -> float:
        """Retrieves the minimum buyout price for a given item, defaulting to 0."""
        return records_map.get(item_id, {}).get('min_buyout') or 0

    @staticmethod
    def _calculate_reagents_cost(reagents: List[Dict], records_map: Dict, item_reagents: List) -> float:
        """Calculates total cost of reagents using overridden price if available."""
        total_cost = 0.0

        for reagent in reagents:
            reagent_id = reagent.get('id_ingame')
            quantity = reagent.get('quantity', 0)
            reagent_name = reagent.get('name', 'Unknown Reagent')

            reagent_data = records_map.get(reagent_id, {})
            overriden_buyout = reagent_data.get('overriden_min_buyout')
            min_buyout = reagent_data.get('min_buyout')

            buyout = overriden_buyout if overriden_buyout is not None else (min_buyout or 0)
            total_cost += buyout * quantity

            item_reagents.append({
                "name": reagent_name,
                "id_ingame": reagent_id,
                "qty": quantity,
                "min_buyout": min_buyout,
                "overriden_min_buyout": overriden_buyout
            })

        return total_cost
