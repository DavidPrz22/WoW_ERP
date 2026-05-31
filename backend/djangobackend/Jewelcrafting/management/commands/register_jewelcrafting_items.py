import json
import os
from django.core.management.base import BaseCommand
from Jewelcrafting.models import JewelcraftingItems
from Registros.models import Item
from django.conf import settings

class Command(BaseCommand):
    help = 'Register Jewelcrafting Items from uncut_gems.json'

    def handle(self, *args, **options):
        base_dir = settings.BASE_DIR
        json_path = os.path.join(base_dir, 'Jewelcrafting', 'uncut_gems.json')
        
        try:
            with open(json_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f'File not found: {json_path}'))
            return

        for entry in data:
            name = entry.get('name')
            id_ingame = str(entry.get('id_ingame'))
            proc_chance = entry.get('proc_change')
            vendor_price = entry.get('vendor_price')

            try:
                item = Item.objects.get(id_ingame=id_ingame)
            except Item.DoesNotExist:
                self.stdout.write(self.style.WARNING(f'Item {name} (ID: {id_ingame}) does not exist in Registros. Skipping.'))
                continue

            jc_item, created = JewelcraftingItems.objects.update_or_create(
                item=item,
                defaults={
                    'proc_chance': proc_chance,
                    'vendor_price': vendor_price,
                }
            )

            if created:
                self.stdout.write(self.style.SUCCESS(f'Created JewelcraftingItem: {name}'))
            else:
                self.stdout.write(self.style.SUCCESS(f'Updated JewelcraftingItem: {name}'))

        self.stdout.write(self.style.SUCCESS('Successfully registered all jewelcrafting items.'))
