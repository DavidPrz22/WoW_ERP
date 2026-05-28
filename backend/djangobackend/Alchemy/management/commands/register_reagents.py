import json
import os
from django.core.management.base import BaseCommand
from Alchemy.models import Recipe, ItemReagent
from Registros.models import Item

class Command(BaseCommand):
    help = 'Register crafting reagents from data.json'

    def handle(self, *args, **options):
        app_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        json_path = os.path.join(app_dir, 'data.json')
        
        try:
            with open(json_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f'File not found: {json_path}'))
            return

        for group_name, items in data.items():
            for item_data in items:
                item_name = item_data.get('name')
                
                try:
                    item = Item.objects.get(name=item_name)
                except Item.DoesNotExist:
                    self.stdout.write(self.style.WARNING(f"Item '{item_name}' not found in database. Skipping."))
                    continue
                except Item.MultipleObjectsReturned:
                    self.stdout.write(self.style.WARNING(f"Multiple Items found for '{item_name}'. Skipping."))
                    continue

                recipe, recipe_created = Recipe.objects.get_or_create(item=item)

                reagents = item_data.get('reagents', [])
                for reagent_data in reagents:
                    reagent_name = reagent_data.get('name')
                    quantity = reagent_data.get('quantity', 1)
                    
                    try:
                        reagent_item = Item.objects.get(name=reagent_name)
                    except Item.DoesNotExist:
                        self.stdout.write(self.style.WARNING(f"Reagent Item '{reagent_name}' not found. Skipping for '{item_name}'."))
                        continue
                    except Item.MultipleObjectsReturned:
                        self.stdout.write(self.style.WARNING(f"Multiple Reagent Items found for '{reagent_name}'. Skipping."))
                        continue
                    
                    item_reagent, created = ItemReagent.objects.update_or_create(
                        recipe=recipe,
                        reagent=reagent_item,
                        defaults={'quantity': quantity}
                    )
                    
                    if created:
                        self.stdout.write(self.style.SUCCESS(f"Added {reagent_name} x{quantity} to {item_name}"))
                    else:
                        self.stdout.write(self.style.SUCCESS(f"Updated {reagent_name} to x{quantity} for {item_name}"))
                        
        self.stdout.write(self.style.SUCCESS('Successfully processed reagents from data.json!'))
