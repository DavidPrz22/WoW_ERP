import json
import os
from django.core.management.base import BaseCommand
from django.conf import settings
from Registros.models import Item
from Cooking.models import CookingItem, CookingRecipe, CookingReagent, Type

class Command(BaseCommand):
    help = 'Registers cooking items and recipes from food_reagents.json'

    def handle(self, *args, **options):
        base_dir = settings.BASE_DIR
        json_path = os.path.join(base_dir, 'food_reagents.json')

        if not os.path.exists(json_path):
            self.stdout.write(self.style.ERROR(f'File not found: {json_path}'))
            return

        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        for item_data in data:
            name = item_data['name']
            item_id = str(item_data['itemId'])
            yield_qty = item_data.get('yieldQty', 1)
            category_str = item_data.get('category', '')

            # Map category string to choices
            category_lower = category_str.lower()
            if category_lower == 'agility':
                cooking_type = Type.AGILITY
            elif category_lower == 'spell power':
                cooking_type = Type.SPELLPOWER
            elif category_lower == 'stamina':
                cooking_type = Type.STAMINA
            elif category_lower == 'strength':
                cooking_type = Type.STRENGTH
            elif category_lower == 'healing':
                cooking_type = Type.HEALING
            elif category_lower == 'hit rating':
                cooking_type = Type.HIT
            elif category_lower == 'pet buff':
                cooking_type = Type.PET
            else:
                cooking_type = Type.OTHER

            # Get base Item
            try:
                base_item = Item.objects.get(id_ingame=item_id)
            except Item.DoesNotExist:
                self.stdout.write(self.style.WARNING(f'Item {name} (ID: {item_id}) not found in DB. Skipping.'))
                continue

            # Get or create CookingItem
            cooking_item, created = CookingItem.objects.get_or_create(
                item=base_item,
                defaults={'type': cooking_type}
            )
            
            # If the item existed but type was wrong, update it
            if not created and cooking_item.type != cooking_type:
                cooking_item.type = cooking_type
                cooking_item.save()

            # Get or create CookingRecipe
            cooking_recipe, created = CookingRecipe.objects.get_or_create(
                cook_item=cooking_item,
                defaults={'yield_quantity': yield_qty}
            )
            
            if not created and cooking_recipe.yield_quantity != yield_qty:
                cooking_recipe.yield_quantity = yield_qty
                cooking_recipe.save()

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

                # Get or create CookingReagent
                CookingReagent.objects.update_or_create(
                    recipe=cooking_recipe,
                    reagent=base_reagent_item,
                    defaults={'quantity': reagent_quantity}
                )

            self.stdout.write(self.style.SUCCESS(f'Successfully registered recipe for {name}'))

        self.stdout.write(self.style.SUCCESS('Finished registering all cooking recipes.'))
