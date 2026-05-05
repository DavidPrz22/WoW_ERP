from django.core.management.base import BaseCommand
from Registros.models import ItemClass, ItemSubclass, Item
import json

class Command(BaseCommand):
    help = 'Populate ItemClass and ItemSubclass models'

    def handle(self, *args, **kwargs):
        with open('items_data.json', 'r') as file:
            items = json.load(file)

            all_items = []
            for item in items:
                subclass_name = item.get('item_subclass')
                class_name = item.get('item_class')
                id_ingame = item.get('id_ingame')
                
                if not subclass_name or not class_name or not id_ingame:
                    continue

                subclass = ItemSubclass.objects.filter(
                    name=subclass_name,
                    item_class__name=class_name
                ).first()
                
                if subclass:
                    all_items.append(
                        Item(
                            id_ingame=id_ingame,
                            name=item.get('name', 'Unknown'),
                            quality=item.get('quality', 'Common'),
                            vendor_sell_price=item.get('vendor_sell_price', 0),
                            item_subclass=subclass,
                            icon=item.get('icon', '')
                        )
                    )
            
            Item.objects.bulk_create(all_items, ignore_conflicts=True)

            self.stdout.write(self.style.SUCCESS(f'Successfully populated {len(all_items)} items.'))
            
                



