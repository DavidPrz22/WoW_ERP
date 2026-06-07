import json
import os
from django.core.management.base import BaseCommand
from django.conf import settings
from Registros.models import Item
from Engineering.models import EngItem, EngRecipe, EngReagent, Type

class Command(BaseCommand):
    help = 'Registers engineering items and recipes from wowhead_reagents.json'

    def handle(self, *args, **options):
        base_dir = settings.BASE_DIR
        json_path = os.path.join(base_dir, 'wowhead_reagents.json')

        if not os.path.exists(json_path):
            self.stdout.write(self.style.ERROR(f'File not found: {json_path}'))
            return

        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        for item_data in data:
            name = item_data['name']
            item_id = str(item_data['itemId'])
            yield_qty = item_data.get('yieldQty', 1)
            item_type_str = item_data.get('type', '')

            # Map type string to choices
            if item_type_str.lower() == 'part':
                eng_type = Type.PART
            elif item_type_str.lower() == 'explosive':
                eng_type = Type.EXPLOSIVE
            else:
                eng_type = Type.MISC

            # Get base Item
            try:
                base_item = Item.objects.get(id_ingame=item_id)
            except Item.DoesNotExist:
                self.stdout.write(self.style.WARNING(f'Item {name} (ID: {item_id}) not found in DB. Skipping.'))
                continue

            # Get or create EngItem
            eng_item, created = EngItem.objects.get_or_create(
                item=base_item,
                defaults={'type': eng_type}
            )
            
            # If the item existed but type was wrong, update it
            if not created and eng_item.type != eng_type:
                eng_item.type = eng_type
                eng_item.save()

            # Get or create EngRecipe
            eng_recipe, created = EngRecipe.objects.get_or_create(
                eng_item=eng_item,
                defaults={'yield_quantity': yield_qty}
            )
            
            if not created and eng_recipe.yield_quantity != yield_qty:
                eng_recipe.yield_quantity = yield_qty
                eng_recipe.save()

            # Handle Reagents
            reagents = item_data.get('reagents', [])
            for reagent_data in reagents:
                reagent_name = reagent_data['name']
                reagent_item_id = str(reagent_data['itemId'])
                reagent_quantity = reagent_data['quantity']

                # Get base Item for reagent
                try:
                    base_reagent_item = Item.objects.get(id_ingame=reagent_item_id)
                except Item.DoesNotExist:
                    self.stdout.write(self.style.WARNING(f'Reagent {reagent_name} (ID: {reagent_item_id}) for recipe {name} not found in DB. Skipping reagent.'))
                    continue

                # Get or create EngReagent
                EngReagent.objects.update_or_create(
                    recipe=eng_recipe,
                    reagent=base_reagent_item,
                    defaults={'quantity': reagent_quantity}
                )

            self.stdout.write(self.style.SUCCESS(f'Successfully registered recipe for {name}'))

        self.stdout.write(self.style.SUCCESS('Finished registering all engineering recipes.'))
