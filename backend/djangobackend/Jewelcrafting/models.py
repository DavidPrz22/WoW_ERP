from django.db import models
from Registros.models import Item   
# Create your models here.

class GEM_COLORS(models.TextChoices):
    RED = 'Red', 'Red'
    BLUE = 'Blue', 'Blue'
    YELLOW = 'Yellow', 'Yellow'
    GREEN = 'Green', 'Green'
    ORANGE = 'Orange', 'Orange'
    PURPLE = 'Purple', 'Purple'


class JewelcraftingItems(models.Model):
    item = models.OneToOneField(Item, on_delete=models.CASCADE, unique=True)
    proc_chance = models.FloatField()
    vendor_price = models.IntegerField()

    def __str__(self):
        return self.item.name
    

class GemCuts(models.Model):
    gem_cut = models.OneToOneField(Item, on_delete=models.CASCADE, unique=True)
    gem = models.ForeignKey(JewelcraftingItems, on_delete=models.CASCADE)
    color = models.CharField(max_length=50, choices=GEM_COLORS.choices)

    def __str__(self):
        return self.gem_cut.name



