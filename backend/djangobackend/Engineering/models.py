from django.db import models
from Registros.models import Item, AuctionHouse, Records, ItemRecord

class Type(models.TextChoices):
    PART = 'Enhancement'
    EXPLOSIVE = 'Explosive'
    MISC = 'Misc'


class EngItem(models.Model):
    item = models.OneToOneField(Item, on_delete=models.CASCADE, unique=True)
    type = models.CharField(max_length=100, choices=Type.choices, blank=True, null=True)

    def __str__(self):
        return self.item.name


class EngRecipe(models.Model):
    eng_item = models.ForeignKey(EngItem, on_delete=models.CASCADE, related_name='recipes')
    yield_quantity = models.IntegerField(default=1)

    def __str__(self):
        return f"Recipe for {self.eng_item.item.name} (Yields {self.yield_quantity})"


class EngReagent(models.Model):
    recipe = models.ForeignKey(EngRecipe, on_delete=models.CASCADE, related_name='reagents')
    reagent = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

    def __str__(self):
        return f"Reagent: {self.reagent.name} x{self.quantity} for {self.recipe}"