from django.db import models

# Create your models here.

class Quality(models.TextChoices):
    COMMON = 'Common'
    UNCOMMON = 'Uncommon'
    RARE = 'Rare'
    EPIC = 'Epic'
    LEGENDARY = 'Legendary'

class Faction(models.TextChoices):
    HORDE = 'Horde'
    ALLIANCE = 'Alliance'


## ITEMS
class ItemClass(models.Model):
    name = models.CharField(max_length=50, unique=True)

class ItemSubclass(models.Model):
    name = models.CharField(max_length=50)
    item_class = models.ForeignKey(ItemClass, on_delete=models.CASCADE, related_name='subclasses')
    
    class Meta:
        unique_together = ('name', 'item_class')

class Item(models.Model):
    id_ingame = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=200)
    quality = models.CharField(max_length=20,choices=Quality.choices, default=Quality.COMMON)
    vendor_sell_price = models.IntegerField(default=0)   
    item_subclass = models.ForeignKey(ItemSubclass, on_delete=models.CASCADE)
    icon = models.CharField(max_length=100, blank=True, null=True) 
    
    def __str__(self):
        return f"{self.id_ingame} - {self.name}"


####AUCTION HOUSE
class AuctionHouse(models.Model):
    realm_id = models.IntegerField(unique=True)
    realm_name = models.CharField(max_length=50)
    faction = models.CharField(max_length=50,choices=Faction.choices)
    
    def __str__(self):
        return f"{self.realm_id} - {self.faction} - {self.realm_name}"


#####RECORDS AND PRICING DATA


class Records(models.Model):
    """Represents a single data ingestion event (a snapshot) for an AH."""
    timestamp = models.DateTimeField(auto_now_add=True)
    auction_house = models.ForeignKey(AuctionHouse, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        # A specific AH can only have one scan at a specific exact timestamp
        unique_together = ('auction_house', 'timestamp')

    def __str__(self):
        ah_name = self.auction_house.name if self.auction_house else "All"
        return f"{ah_name} Record - {self.timestamp.strftime('%Y-%m-%d %H:%M')}"


class ItemRecord(models.Model):
    """The specific pricing data for an item during a specific scan."""
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    record = models.ForeignKey(Records, on_delete=models.CASCADE, related_name='item_records')
    market_value = models.IntegerField(default=0)
    min_buyout = models.IntegerField(default=0)
    num_auctions = models.IntegerField(default=0)
    historical = models.IntegerField(default=0)
    overriden_min_buyout = models.IntegerField(null=True,blank=True)

    class Meta:
        unique_together = ('item', 'record')

    def __str__(self):
        return f"{self.item.name} - {self.record.timestamp.strftime('%Y-%m-%d')} - Mkt:{self.market_value} - Buyout:{self.min_buyout}"


class Userdata(models.Model):
    id_user = models.CharField(max_length=50, unique=True, null=True, blank=True)
    dynamic_data = models.JSONField(null=False, blank=False)

    def __str__(self):
        return f"{self.id_user} - {self.dynamic_data}"

    