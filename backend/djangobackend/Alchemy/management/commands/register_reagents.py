import json
import os
from django.core.management.base import BaseCommand
from Alchemy.models import AlchemyItem, ItemReagent
from Registros.models import Item

class Command(BaseCommand):
    help = 'Register crafting reagents from data.json'

    def handle(self, *args, **options):
        # The file is in the Alchemy app directory
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
                alchemy_item_name = item_data.get('name')
                
                try:
                    # Get the base Item first
                    base_item = Item.objects.get(name=alchemy_item_name)
                    # Get the AlchemyItem associated with the base Item
                    alchemy_item = AlchemyItem.objects.get(item_id=base_item)
                except Item.DoesNotExist:
                    self.stdout.write(self.style.WARNING(f"Item '{alchemy_item_name}' not found in database. Skipping reagents."))
                    continue
                except AlchemyItem.DoesNotExist:
                    self.stdout.write(self.style.WARNING(f"AlchemyItem for '{alchemy_item_name}' not found in database. Skipping reagents."))
                    continue
                except Item.MultipleObjectsReturned:
                    self.stdout.write(self.style.WARNING(f"Multiple Items found for '{alchemy_item_name}'. Skipping reagents."))
                    continue

                reagents = item_data.get('reagents', [])
                for reagent_data in reagents:
                    reagent_name = reagent_data.get('name')
                    quantity = reagent_data.get('quantity', 1)
                    
                    try:
                        reagent_item = Item.objects.get(name=reagent_name)
                    except Item.DoesNotExist:
                        self.stdout.write(self.style.WARNING(f"Reagent Item '{reagent_name}' not found. Cannot add to '{alchemy_item_name}'."))
                        continue
                    except Item.MultipleObjectsReturned:
                        self.stdout.write(self.style.WARNING(f"Multiple Reagent Items found for '{reagent_name}'. Cannot add to '{alchemy_item_name}'."))
                        continue
                    
                    # Create or update the ItemReagent object
                    item_reagent, created = ItemReagent.objects.update_or_create(
                        alchemy_item=alchemy_item,
                        reagent=reagent_item,
                        defaults={'quantity': quantity}
                    )
                    
                    if created:
                        self.stdout.write(self.style.SUCCESS(f"Added reagent {reagent_name} x{quantity} to {alchemy_item_name}"))
                    else:
                        self.stdout.write(self.style.SUCCESS(f"Updated reagent {reagent_name} to x{quantity} for {alchemy_item_name}"))
                        
        self.stdout.write(self.style.SUCCESS('Successfully processed reagents from data.json!'))
