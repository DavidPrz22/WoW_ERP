from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field
from .models import CookingItem, CookingRecipe, CookingReagent


class CookingGroupDataSerializer(serializers.Serializer):
    faction = serializers.CharField()
    realm = serializers.CharField()
    selected_record = serializers.CharField()


class CookingReagentSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='reagent.name', read_only=True)
    id_ingame = serializers.CharField(source='reagent.id_ingame', read_only=True)

    class Meta:
        model = CookingReagent
        fields = ['id_ingame', 'name', 'quantity']


class CookingItemSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='item.name', read_only=True)
    id_ingame = serializers.CharField(source='item.id_ingame', read_only=True)
    type = serializers.CharField(read_only=True)
    yield_quantity = serializers.SerializerMethodField()

    class Meta:
        model = CookingItem
        fields = ['id_ingame', 'name', 'type', 'yield_quantity']

    @extend_schema_field(int)
    def get_yield_quantity(self, obj):
        recipe = getattr(obj, 'recipes', None)
        if recipe:
            recipe_instance = recipe.first() if hasattr(recipe, 'first') else recipe
            if recipe_instance:
                return recipe_instance.yield_quantity
        return 1

    def to_representation(self, instance):
        recipe = getattr(instance, 'recipes', None)
        reagents = []
        yield_quantity = 1

        if recipe:
            recipe_instance = recipe.first() if hasattr(recipe, 'first') else recipe
            if recipe_instance:
                yield_quantity = recipe_instance.yield_quantity
                reagent_queryset = recipe_instance.reagents.all()
                reagents = [
                    {
                        'id_ingame': r.reagent.id_ingame,
                        'name': r.reagent.name,
                        'quantity': r.quantity
                    }
                    for r in reagent_queryset
                ]

        return {
            'id_ingame': instance.item.id_ingame,
            'name': instance.item.name,
            'type': instance.type,
            'yield_quantity': yield_quantity,
            'reagents': reagents
        }


class CookingTypeGroupSerializer(serializers.Serializer):
    type = serializers.CharField()
    items = serializers.ListField()
