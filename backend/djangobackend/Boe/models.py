from django.db import models
from Registros.models import Item, AuctionHouse, Records, ItemRecord

class Category(models.TextChoices):
    ENHANCEMENT = 'Enhancement'
    CONSUMABLE = 'Consumable'
    GEAR = 'Gear'
    MISC = 'Misc'


class Profession(models.TextChoices):
    BLACKSMITHING = 'Blacksmithing'
    ENGINEERING = 'Engineering'
    LEATHERWORKING = 'Leatherworking'
    TAILORING = 'Tailoring'


class BoeItem(models.Model):
    item = models.OneToOneField(Item, on_delete=models.CASCADE, unique=True)
    category = models.CharField(max_length=100, choices=Category.choices, blank=True, null=True)
    profession = models.CharField(max_length=100, choices=Profession.choices, blank=True, null=True)

    def __str__(self):
        return self.item.name


class BoeRecipe(models.Model):
    boe_item = models.ForeignKey(BoeItem, on_delete=models.CASCADE, related_name='recipes')
    yield_quantity = models.IntegerField(default=1)

    def __str__(self):
        return f"Recipe for {self.boe_item.item.name} (Yields {self.yield_quantity})"


class BoeReagent(models.Model):
    recipe = models.ForeignKey(BoeRecipe, on_delete=models.CASCADE, related_name='reagents')
    reagent = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

    def __str__(self):
        return f"Reagent: {self.reagent.name} x{self.quantity} for {self.recipe}"