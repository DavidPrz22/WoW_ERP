from django.core.management.base import BaseCommand
from Registros.models import Item
from Jewelcrafting.models import JewelcraftingItems, GemCuts, GEM_COLORS, GEM_RARITY

class Command(BaseCommand):
    help = 'Register phase 3 epic gems (raw and cut)'

    def handle(self, *args, **options):
        # Base gems info
        raw_gems_data = [
            {"id_ingame": 32227, "name": "Crimson Spinel", "vendor_price": 50000, "color": GEM_COLORS.RED},
            {"id_ingame": 32231, "name": "Pyrestone", "vendor_price": 50000, "color": GEM_COLORS.ORANGE},
            {"id_ingame": 32229, "name": "Lionseye", "vendor_price": 50000, "color": GEM_COLORS.YELLOW},
            {"id_ingame": 32249, "name": "Seaspray Emerald", "vendor_price": 50000, "color": GEM_COLORS.GREEN},
            {"id_ingame": 32228, "name": "Empyrean Sapphire", "vendor_price": 50000, "color": GEM_COLORS.BLUE},
            {"id_ingame": 32230, "name": "Shadowsong Amethyst", "vendor_price": 50000, "color": GEM_COLORS.PURPLE}
        ]

        # Mappings of base gem id_ingame to list of cut id_ingames
        cuts_data = {
            32227: [32193, 32194, 32195, 32196, 32197, 32198, 32199],
            32231: [32217, 32221, 32219, 32222, 32220, 32218, 35760],
            32229: [32204, 32205, 32206, 32207, 32208, 32209, 32210, 35761],
            32249: [32225, 32224, 32226, 32223, 35759, 35758],
            32228: [32202, 32203, 32201, 32200],
            32230: [32213, 32211, 32212, 32214, 32215, 32216, 37503]
        }

        # Be sure the management directory structure is: management/commands/__init__.py
        # It needs __init__.py files to be recognized as a module.
        
        for gem in raw_gems_data:
            try:
                base_item = Item.objects.get(id_ingame=gem["id_ingame"])
                jc_item, created = JewelcraftingItems.objects.get_or_create(
                    item=base_item,
                    defaults={
                        'proc_chance': 1.0,
                        'vendor_price': gem["vendor_price"],
                        'rarity': GEM_RARITY.EPIC
                    }
                )
                
                # Update if already exists just in case
                if not created:
                    jc_item.rarity = GEM_RARITY.EPIC
                    jc_item.vendor_price = gem["vendor_price"]
                    jc_item.save()
                    
                self.stdout.write(self.style.SUCCESS(f"Registered raw gem: {gem['name']}"))

                for cut_id in cuts_data.get(gem["id_ingame"], []):
                    try:
                        cut_item = Item.objects.get(id_ingame=cut_id)
                        GemCuts.objects.get_or_create(
                            gem_cut=cut_item,
                            defaults={
                                'gem': jc_item,
                                'color': gem["color"]
                            }
                        )
                        self.stdout.write(self.style.SUCCESS(f"  Registered cut gem ID: {cut_id}"))
                    except Item.DoesNotExist:
                        self.stdout.write(self.style.WARNING(f"  Cut gem ID {cut_id} not found in Item table"))

            except Item.DoesNotExist:
                self.stdout.write(self.style.ERROR(f"Raw gem {gem['name']} not found in Item table"))
