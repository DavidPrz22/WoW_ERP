from typing import Dict, List, Tuple, Any

class AlchemyCalculationsService:
    # Constants for Alchemy specifics (e.g., Elixir Master procs, AH cut)
    PROC_MULTIPLIER = 1.2
    AH_CUT_MULTIPLIER = 0.95
    
    @classmethod
    def calculate_groups_data(cls, groups_data: List[Dict], records_map: Dict) -> Tuple[Dict, Dict]:
        """Calculates profitability metrics for all alchemy groups."""
        group_calculations = []
        total_reagents_used = {}

        for group in groups_data:
            group_name = group.get('group')
            search_group = group.get('search_group')
            items_data = []
            
            if group_name not in total_reagents_used:
                total_reagents_used[group_name] = {}
            
            for item in group['items']:
                item_name = item.get('name', 'Unknown Item')
                item_reagents = []
                item_data = cls._process_item(item, records_map, item_reagents)
                items_data.append(item_data)
                total_reagents_used[group_name][item_name] = item_reagents

            group_calc = {
                "group": group_name,
                "search_group": search_group,
                "items": items_data
            }
            group_calculations.append(group_calc)
            
        return group_calculations, total_reagents_used

    @classmethod
    def _process_item(cls, item: Dict, records_map: Dict, item_reagents: List) -> Dict:
        """Processes a single item, computing its crafting cost and profit margins."""
        item_id = item.get('item_id_ingame')
        ah_price = cls._get_ah_price(item_id, records_map)
        
        crafting_cost = cls._calculate_reagents_cost(item.get('reagents', []), records_map, item_reagents)
        
        return {
            'name': item.get('name', 'Unknown Item'),
            'AHPrice': ah_price,
            'craftingCost': crafting_cost
        }

    @staticmethod
    def _get_ah_price(item_id: int, records_map: Dict) -> float:
        """Retrieves the minimum buyout price for a given item, defaulting to 0."""
        return records_map.get(item_id, {}).get('min_buyout') or 0

    @staticmethod
    def _calculate_reagents_cost(reagents: List[Dict], records_map: Dict, item_reagents: List) -> float:
        """Calculates total cost of reagents and updates the total reagents tracker."""
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
                "id": reagent_id,
                "qty": quantity
            })
        
        total_cost_with_proc = total_cost / AlchemyCalculationsService.PROC_MULTIPLIER
        return total_cost_with_proc