from django.core.management.base import BaseCommand
from Registros.models import ItemClass, ItemSubclass

class Command(BaseCommand):
    help = 'Populate ItemClass and ItemSubclass models'

    def handle(self, *args, **kwargs):
        data = {
            'Armor': [
                'Miscellaneous', 'Cloth', 'Leather', 'Mail', 'Shield',
                'Plate', 'Totem', 'Idol', 'Libram', 'Sigil'
            ],
            'Weapon': [
                'Mace', 'Sword', 'Axe', 'Staff', 'Dagger', 'Polearm',
                'Gun', 'Bow', 'Miscellaneous', 'Fist Weapon', 'Wand',
                'Fishing Pole', 'Crossbow', 'Thrown', 'Exotic'
            ],
            'Quest': ['Quest'],
            'Consumable': [
                'Food & Drink', 'Potion', 'Consumable', 'Scroll', 'Other',
                'Bandage', 'Item Enhancement', 'Elixir', 'Flask'
            ],
            'Miscellaneous': [
                'Junk', 'Mount', 'Reagent', 'Pet', 'Other', 'Holiday'
            ],
            'Trade Goods': [
                'Meat', 'Herb', 'Leather', 'Parts', 'Other', 'Cloth',
                'Metal & Stone', 'Explosives', 'Devices', 'Enchanting',
                'Elemental', 'Jewelcrafting', 'Materials', 'Armor Enchantment',
                'Weapon Enchantment'
            ],
            'Recipe': [
                'Cooking', 'Book', 'Leatherworking', 'Alchemy', 'Tailoring',
                'Blacksmithing', 'Engineering', 'Enchanting', 'First Aid',
                'Fishing', 'Jewelcrafting'
            ],
            'Gem': [
                'Simple', 'Orange', 'Prismatic', 'Red', 'Green', 'Purple',
                'Yellow', 'Blue', 'Meta'
            ],
            'Container': [
                'Bag', 'Soul Bag', 'Enchanting Bag', 'Herb Bag', 'Engineering Bag',
                'Gem Bag', 'Mining Bag', 'Leatherworking Bag', 'Inscription Bag'
            ],
            'Quiver': ['Ammo Pouch', 'Quiver'],
            'Projectile': ['Arrow', 'Bullet'],
            'Key': ['Key'],
            'Reagent': ['Reagent'],
            'Glyph': [
                'Druid', 'Paladin', 'Shaman', 'Priest', 'Warlock', 'Mage',
                'Hunter', 'Rogue', 'Warrior', 'Death Knight'
            ]
        }

        self.stdout.write("Starting population of ItemClass and ItemSubclass...")

        for class_name, subclasses in data.items():
            item_class, created = ItemClass.objects.get_or_create(name=class_name)
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created ItemClass: {class_name}"))
            
            for subclass_name in subclasses:
                # 'undefined' was filtered out from Miscellaneous manually above
                item_subclass, created = ItemSubclass.objects.get_or_create(
                    name=subclass_name,
                    item_class=item_class
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f"  Created ItemSubclass: {subclass_name} for {class_name}"))

        self.stdout.write(self.style.SUCCESS('Successfully populated Item classes and subclasses.'))
