from django.db import models
from Registros.models import Item, AuctionHouse, Records
# Create your models here.


class AlchemyGroupsList(models.TextChoices):
    FLASKS = 'Flasks'
    ELIXIRS = 'Elixirs'
    POTIONS = 'Potions'

class AlchemyGroupsListSearch(models.TextChoices):
    FLASKS = 'Flask'
    ELIXIRS = 'Elixir'
    POTIONS = 'Potion'

class AlchemyGroup(models.Model):
    name = models.CharField(max_length=50, choices=AlchemyGroupsList.choices, unique=True)
    search_group = models.CharField(max_length=50, choices=AlchemyGroupsListSearch.choices, default=AlchemyGroupsListSearch.FLASKS)
    
    def __str__(self):
        return self.name + " (" + self.search_group + ")"

class AlchemyItem(models.Model):
    group = models.ForeignKey(AlchemyGroup, on_delete=models.CASCADE, related_name='items')
    item_id = models.OneToOneField(Item, on_delete=models.CASCADE, related_name='alchemy_item')
    yield_quantity = models.IntegerField(default=1) 

    def __str__(self):
        return f"{self.item_id.name} ({self.group.name}) x{self.yield_quantity}"
    

class ItemReagent(models.Model):
    alchemy_item = models.ForeignKey(AlchemyItem, on_delete=models.CASCADE, related_name='reagent_for')
    reagent = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='used_as_reagent_in')
    quantity = models.IntegerField(default=1)

    class Meta:
        unique_together = ('alchemy_item', 'reagent')

    def __str__(self):
        return f"{self.quantity} x {self.reagent.name} for {self.alchemy_item.name}"
