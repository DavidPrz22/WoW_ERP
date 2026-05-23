from rest_framework import serializers
from .models import AlchemyGroup, AlchemyItem


class AlchemyItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlchemyItem
        fields = ['group', 'item_id']

class AlchemyGroupDataSerializer(serializers.Serializer):
    faction = serializers.CharField()
    realm = serializers.CharField()
    selected_record = serializers.IntegerField()


class AlchemyItemSerializer(serializers.ModelSerializer):
    group = serializers.CharField(source='group.name')
    item_id = serializers.CharField(source='item_id.id_ingame')

    class Meta:
        model = AlchemyItem
        fields = ['group', 'item_id', 'yield_quantity']

    def to_representation(self, instance):

        return {
            'item_id_ingame': instance.item_id.id_ingame,
            'name': instance.item_id.name,
            'reagents': [
                {
                    'id_ingame': item.reagent.id_ingame,
                    'name': item.reagent.name,
                    'quantity': item.quantity
                }
                for item in instance.reagent_for.all()
            ],
            'yield_quantity': instance.yield_quantity
        }
    

class AlchemyGroupDataResponseSerializer(serializers.ModelSerializer):
    group = serializers.CharField(source='name')
    items = AlchemyItemSerializer(many=True)

    class Meta:
        model = AlchemyGroup
        fields = ['group', 'items']
