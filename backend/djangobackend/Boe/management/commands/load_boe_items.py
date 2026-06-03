import json
import os
from django.core.management.base import BaseCommand
from django.conf import settings
from Boe.models import BoeItem, BoeRecipe, BoeReagent
from Registros.models import Item, ItemClass, ItemSubclass

class Command(BaseCommand):
    help = 'Load BoE items from final_items.json into the database'

    def handle(self, *args, **kwargs):
        file_path = os.path.join(settings.BASE_DIR, 'Boe', 'final_items.json')
        
        if not os.path.exists(file_path):
            self.stderr.write(self.style.ERROR(f"File not found: {file_path}"))
            return

        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # Ensure a fallback ItemSubclass exists just in case new items are encountered
        item_class, _ = ItemClass.objects.get_or_create(name='Miscellaneous')
        item_subclass, _ = ItemSubclass.objects.get_or_create(name='Other', item_class=item_class)

        for item_data in data:
            # 1. Ensure the main Item exists in Registros
            main_item, _ = Item.objects.get_or_create(
                id_ingame=item_data['itemId'],
                defaults={'name': item_data['name'], 'item_subclass': item_subclass}
            )

            # 2. Create or Update the BoeItem
            boe_item, created = BoeItem.objects.get_or_create(
                item=main_item,
                defaults={
                    'category': item_data.get('category'),
                    'profession': item_data.get('profession')
                }
            )

            if not created:
                boe_item.category = item_data.get('category')
                boe_item.profession = item_data.get('profession')
                boe_item.save()

            # 3. Create or Get the BoeRecipe
            boe_recipe, _ = BoeRecipe.objects.get_or_create(
                boe_item=boe_item,
                defaults={'yield_quantity': 1}
            )

            # 4. Create Reagents for the Recipe
            for reagent_data in item_data.get('reagents', []):
                reagent_item, _ = Item.objects.get_or_create(
                    id_ingame=reagent_data['id'],
                    defaults={'name': reagent_data['name'], 'item_subclass': item_subclass}
                )

                BoeReagent.objects.update_or_create(
                    recipe=boe_recipe,
                    reagent=reagent_item,
                    defaults={'quantity': reagent_data['quantity']}
                )
                
        self.stdout.write(self.style.SUCCESS(f'Successfully loaded {len(data)} BoE items with their recipes and reagents.'))
