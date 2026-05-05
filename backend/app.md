Create command to populate models in database

1.Create a command to be run by django
2.Create objects for the class ItemClass in ```\\wsl.localhost\Ubuntu\home\davidprz\projects\WowTBC_ERP\backend\djangobackend\Registros\models.py``` 
    - The classes are
    ```
        [
            'Armor',         'Weapon',
            'Quest',         'Consumable',
            'Miscellaneous', 'Trade Goods',
            'Recipe',        'Gem',
            'Container',     'Quiver',
            'Projectile',    'Key',
            'Reagent',       'Glyph'
        ]
    ```
3. Create objects for the class ItemSubclass in ```\wsl.localhost\Ubuntu\home\davidprz\projects\WowTBC_ERP\backend\djangobackend\Registros\models.py``` 
    - The subclasses are
    ```
        [
            'Miscellaneous',      'Mace',            'Cloth',
            'Sword',              'Axe',             'Quest',
            'Leather',            'Staff',           'Food & Drink',
            'Potion',             'Mail',            'Junk',
            'Meat',               'Cooking',         'Herb',
            'Simple',             'Dagger',          'Bag',
            'Parts',              'Consumable',      'Other',
            'Shield',             'Scroll',          'Mount',
            'Book',               'Bandage',         'Polearm',
            'Gun',                'Ammo Pouch',      'Quiver',
            'Item Enhancement',   'Leatherworking',  'Elixir',
            'Bow',                'Arrow',           'Bullet',
            'Alchemy',            'Tailoring',       'Key',
            'Metal & Stone',      'Blacksmithing',   'Reagent',
            'Fist Weapon',        'Explosives',      'Devices',
            'Pet',                'Engineering',     'Wand',
            'Enchanting',         'Fishing Pole',    'Crossbow',
            'First Aid',          'Elemental',       'Plate',
            'Flask',              'Fishing',         'Holiday',
            'Jewelcrafting',   'Soul Bag',
            'Enchanting Bag',     'Orange',          'Herb Bag',
            'Totem',              'Idol',            'Libram',
            'Prismatic',          'Red',             'Green',
            'Purple',             'Yellow',          'Blue',
            'Materials',          'Engineering Bag', 'Gem Bag',
            'Thrown',             'Meta',            'Mining Bag',
            'Exotic',             'Leatherworking Bag', 
            'Armor Enchantment',  'Inscription Bag', 'Sigil',
            'Weapon Enchantment', 'Druid',           'Paladin',
            'Shaman',             'Priest',          'Warlock',
            'Mage',               'Hunter',          'Rogue',
            'Warrior',            'Death Knight'
        ]
    ```
4. When creating the class and subclass, keep the following relationships between the two:
    ```
        {
    Armor: [
        'Miscellaneous',
        'Cloth',
        'Leather',
        'Mail',
        'Shield',
        'Plate',
        'Totem',
        'Idol',
        'Libram',
        'Sigil'
    ],
    Weapon: [
        'Mace',          'Sword',
        'Axe',           'Staff',
        'Dagger',        'Polearm',
        'Gun',           'Bow',
        'Miscellaneous', 'Fist Weapon',
        'Wand',          'Fishing Pole',
        'Crossbow',      'Thrown',
        'Exotic'
    ],
    Quest: [ 'Quest' ],
    Consumable: [
        'Food & Drink',
        'Potion',
        'Consumable',
        'Scroll',
        'Other',
        'Bandage',
        'Item Enhancement',
        'Elixir',
        'Flask'
    ],
    Miscellaneous: [
    'Junk',    'Mount',
    'Reagent', 'Pet',
    'Other',   'Holiday',
    undefined
  ],
  'Trade Goods': [
    'Meat',               'Herb',
    'Leather',            'Parts',
    'Other',              'Cloth',
    'Metal & Stone',      'Explosives',
    'Devices',            'Enchanting',
    'Elemental',          'Jewelcrafting',
    'Materials',          'Armor Enchantment',
    'Weapon Enchantment'
  ],
  Recipe: [
    'Cooking',
    'Book',
    'Leatherworking',
    'Alchemy',
    'Tailoring',
    'Blacksmithing',
    'Engineering',
    'Enchanting',
    'First Aid',
    'Fishing',
    'Jewelcrafting'
  ],
  Gem: [
    'Simple',    'Orange',
    'Prismatic', 'Red',
    'Green',     'Purple',
    'Yellow',    'Blue',
    'Meta'
  ],
  Container: [
    'Bag',
    'Soul Bag',
    'Enchanting Bag',
    'Herb Bag',
    'Engineering Bag',
    'Gem Bag',
    'Mining Bag',
    'Leatherworking Bag',
    'Inscription Bag'
  ],
  Quiver: [ 'Ammo Pouch', 'Quiver' ],
  Projectile: [ 'Arrow', 'Bullet' ],
  Key: [ 'Key' ],
  Reagent: [ 'Reagent' ],
  Glyph: [
    'Druid',   'Paladin',
    'Shaman',  'Priest',
    'Warlock', 'Mage',
    'Hunter',  'Rogue',
    'Warrior', 'Death Knight'
  ]
}
    ```
    5. - The key is the class and within the value there are the subclasses that belong to that class