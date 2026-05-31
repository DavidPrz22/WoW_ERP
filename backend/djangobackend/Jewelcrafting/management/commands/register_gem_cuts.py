import json
import os
from django.core.management.base import BaseCommand
from Jewelcrafting.models import JewelcraftingItems, GemCuts
from Registros.models import Item
from django.conf import settings

class Command(BaseCommand):
    help = 'Register Gem Cuts from gems_data.json'

    GEM_COLORS_MAPPING = {
        "Living Ruby": "Red",
        "Dawnstone": "Yellow",
        "Star of Elune": "Blue",
        "Noble Topaz": "Orange",
        "Talasite": "Green",
        "Nightseye": "Purple"
    }

    def handle(self, *args, **options):
        base_dir = settings.BASE_DIR
        json_path = os.path.join(base_dir, 'Jewelcrafting', 'gems_data.json')
        
        try:
            with open(json_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f'File not found: {json_path}'))
            return

        for gem_data in data:
            parent_gem_name = gem_data.get('gem_name')
            parent_id_ingame = str(gem_data.get('Id_ingame'))
            cuts = gem_data.get('cuts', [])

            color = self.GEM_COLORS_MAPPING.get(parent_gem_name)
            if not color:
                self.stdout.write(self.style.WARNING(f'Unknown color for gem: {parent_gem_name}. Skipping.'))
                continue

            try:
                parent_gem = JewelcraftingItems.objects.get(item__id_ingame=parent_id_ingame)
            except JewelcraftingItems.DoesNotExist:
                self.stdout.write(self.style.WARNING(f'JewelcraftingItem {parent_gem_name} (ID: {parent_id_ingame}) does not exist. Please run register_jewelcrafting_items first. Skipping.'))
                continue

            for cut_data in cuts:
                cut_name = cut_data.get('gem_name')
                cut_id_ingame = str(cut_data.get('id_ingame'))

                try:
                    cut_item = Item.objects.get(id_ingame=cut_id_ingame)
                except Item.DoesNotExist:
                    self.stdout.write(self.style.WARNING(f'Item {cut_name} (ID: {cut_id_ingame}) does not exist in Registros. Skipping.'))
                    continue

                gem_cut_obj, created = GemCuts.objects.update_or_create(
                    gem_cut=cut_item,
                    defaults={
                        'gem': parent_gem,
                        'color': color,
                    }
                )

                if created:
                    self.stdout.write(self.style.SUCCESS(f'Created GemCut: {cut_name}'))
                else:
                    self.stdout.write(self.style.SUCCESS(f'Updated GemCut: {cut_name}'))

        self.stdout.write(self.style.SUCCESS('Successfully registered all gem cuts.'))
