from rest_framework import serializers
from .models import AlchemyGroup, AlchemyItem, Recipe, ItemReagent


class AlchemyGroupDataSerializer(serializers.Serializer):
    faction = serializers.CharField()
    realm = serializers.CharField()
    selected_record = serializers.CharField()


class AlchemyItemSerializer(serializers.ModelSerializer):
    group = serializers.CharField(source='group.name', read_only=True)

    class Meta:
        model = AlchemyItem
        fields = ['group', 'item_id', 'yield_quantity']

    def to_representation(self, instance):
        recipe = getattr(instance, 'recipe', None)
        reagents = []
        if recipe:
            reagents = [
                {
                    'id_ingame': item.reagent.id_ingame,
                    'name': item.reagent.name,
                    'quantity': item.quantity
                }
                for item in recipe.reagents.all()
            ]
        
        return {
            'item_id_ingame': instance.item_id.id_ingame,
            'name': instance.item_id.name,
            'reagents': reagents,
            'yield_quantity': instance.yield_quantity
        }


class AlchemyGroupDataResponseSerializer(serializers.ModelSerializer):
    group = serializers.CharField(source='name')
    items = AlchemyItemSerializer(many=True)

    class Meta:
        model = AlchemyGroup
        fields = ['group', 'search_group', 'items']
