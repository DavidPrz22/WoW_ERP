from rest_framework import serializers
from .models import Item, ItemClass, ItemSubclass, AuctionHouse

class ItemSubclassSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemSubclass
        fields = ['id', 'name']

class ItemClassSerializer(serializers.ModelSerializer):
    subclasses = ItemSubclassSerializer(many=True, read_only=True)
    
    class Meta:
        model = ItemClass
        fields = ['id', 'name', 'subclasses']

class ItemSerializer(serializers.ModelSerializer):
    itemClass = serializers.CharField(source='item_subclass.item_class.name', read_only=True)
    subClass = serializers.CharField(source='item_subclass.name', read_only=True)
    
    class Meta:
        model = Item
        fields = ['id', 'id_ingame', 'name', 'quality', 'vendor_sell_price', 'icon', 'itemClass', 'subClass']

class AuctionHouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuctionHouse
        fields = ['id', 'realm_id', 'realm_name', 'faction']


class PricingHistorySerializer(serializers.Serializer):
    item_id = serializers.CharField()
    faction_id = serializers.CharField()
    realm_id = serializers.IntegerField()
    from_date = serializers.CharField(required=False)
    to_date = serializers.CharField(required=False)

    def validate(self, attrs):
        from_date = attrs.get('from_date')
        to_date = attrs.get('to_date')
        
        if from_date and to_date and from_date > to_date:
            raise serializers.ValidationError({
                'from_date': 'from_date must be before to_date',
                'to_date': 'to_date must be after from_date'
            })
        return attrs


class PricingFormattedSerializer(serializers.Serializer):
    date = serializers.DateField()
    market_value = serializers.FloatField()
    min_buyout = serializers.FloatField()
    num_auctions = serializers.IntegerField()
    historical = serializers.BooleanField()

    def to_representation(self, instance):
        return {
            'date': instance['record__timestamp'],
            'marketValue': instance['market_value'],
            'minBuyout': instance['min_buyout'],
            'numAuctions': instance['num_auctions'],
            'historical': instance['historical'],
        }