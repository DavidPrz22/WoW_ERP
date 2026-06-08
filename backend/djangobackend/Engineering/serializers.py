from rest_framework import serializers
from .models import EngItem, EngRecipe, EngReagent


class EngineeringDataQuerySerializer(serializers.Serializer):
    faction = serializers.CharField()
    realm = serializers.CharField()
    record_id = serializers.IntegerField()


class EngReagentSerializer(serializers.Serializer):
    id = serializers.IntegerField(source='reagent.id_ingame', read_only=True)
    name = serializers.CharField(source='reagent.name', read_only=True)
    quantity = serializers.IntegerField()
    min_buyout = serializers.SerializerMethodField()
    overriden_min_buyout = serializers.SerializerMethodField()

    def get_min_buyout(self, obj):
        records_map = self.context.get('records_map', {})
        return records_map.get(obj.reagent.id_ingame, {}).get('min_buyout')

    def get_overriden_min_buyout(self, obj):
        records_map = self.context.get('records_map', {})
        return records_map.get(obj.reagent.id_ingame, {}).get('overriden_min_buyout')


class EngItemSerializer(serializers.ModelSerializer):
    type = serializers.CharField(source='get_type_display', read_only=True)
    name = serializers.CharField(source='item.name', read_only=True)
    id_ingame = serializers.IntegerField(source='item.id_ingame', read_only=True)
    yield_quantity = serializers.SerializerMethodField()
    reagents = serializers.SerializerMethodField()
    min_buyout = serializers.SerializerMethodField()
    overriden_min_buyout = serializers.SerializerMethodField()

    class Meta:
        model = EngItem
        fields = ['name', 'id_ingame', 'type', 'yield_quantity', 'reagents', 'min_buyout', 'overriden_min_buyout']

    def get_yield_quantity(self, obj):
        recipe = obj.recipes.first()
        return recipe.yield_quantity if recipe else 1

    def get_reagents(self, obj):
        recipe = obj.recipes.first()
        if not recipe:
            return []
        reagents = recipe.reagents.all()
        serializer = EngReagentSerializer(reagents, many=True, context=self.context)
        return serializer.data

    def get_min_buyout(self, obj):
        records_map = self.context.get('records_map', {})
        return records_map.get(obj.item.id_ingame, {}).get('min_buyout')

    def get_overriden_min_buyout(self, obj):
        records_map = self.context.get('records_map', {})
        return records_map.get(obj.item.id_ingame, {}).get('overriden_min_buyout')
