from django.db import models
from Registros.models import Item

class Type(models.TextChoices):
    AGILITY = 'Agility'
    SPELLPOWER = 'Spell power'
    STAMINA = 'Stamina'
    STRENGTH = 'Strength'
    HEALING = 'Healing'
    HIT = 'Hit Rating'
    PET = 'Pet Buff'
    OTHER = 'Other'


class CookingItem(models.Model):
    item = models.OneToOneField(Item, on_delete=models.CASCADE, unique=True)
    type = models.CharField(max_length=100, choices=Type.choices, blank=True, null=True)

    def __str__(self):
        return self.item.name


class CookingRecipe(models.Model):
    cook_item = models.ForeignKey(CookingItem, on_delete=models.CASCADE, related_name='recipes')
    yield_quantity = models.IntegerField(default=1)

    def __str__(self):
        return f"Recipe for {self.cook_item.item.name} (Yields {self.yield_quantity})"


class CookingReagent(models.Model):
    recipe = models.ForeignKey(CookingRecipe, on_delete=models.CASCADE, related_name='reagents')
    reagent = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

    def __str__(self):
        return f"Reagent: {self.reagent.name} x{self.quantity} for {self.recipe}"