from rest_framework import serializers
from Boe.models import BoeItem, BoeRecipe, BoeReagent, Profession, Category

PRIMAL_NETHER_ID = "23572"
NETHER_VORTEX_ID = "30183"


class BoeReagentSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='reagent.id_ingame', read_only=True)
    name = serializers.CharField(source='reagent.name', read_only=True)
    min_buyout = serializers.SerializerMethodField()
    overriden_min_buyout = serializers.SerializerMethodField()
    is_nether_input = serializers.SerializerMethodField()

    class Meta:
        model = BoeReagent
        fields = ['id', 'name', 'quantity', 'min_buyout', 'overriden_min_buyout', 'is_nether_input']

    def get_min_buyout(self, obj):
        records_map = self.context.get('records_map', {})
        item_id = obj.reagent.id_ingame
        return records_map.get(item_id, {}).get('min_buyout')

    def get_overriden_min_buyout(self, obj):
        records_map = self.context.get('records_map', {})
        item_id = obj.reagent.id_ingame
        return records_map.get(item_id, {}).get('overriden_min_buyout')

    def get_is_nether_input(self, obj):
        item_id = obj.reagent.id_ingame
        if item_id == PRIMAL_NETHER_ID:
            return "primal"
        if item_id == NETHER_VORTEX_ID:
            return "vortex"
        return None


class BoeItemSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='item.name', read_only=True)
    yield_quantity = serializers.IntegerField(source='recipes.yield_quantity', read_only=True)
    min_buyout = serializers.SerializerMethodField()
    overriden_min_buyout = serializers.SerializerMethodField()
    reagents = BoeReagentSerializer(many=True, read_only=True)

    class Meta:
        model = BoeItem
        fields = ['name', 'min_buyout', 'overriden_min_buyout', 'yield_quantity', 'reagents']

    def get_min_buyout(self, obj):
        records_map = self.context.get('records_map', {})
        item_id = obj.item.id_ingame
        return records_map.get(item_id, {}).get('min_buyout')

    def get_overriden_min_buyout(self, obj):
        records_map = self.context.get('records_map', {})
        item_id = obj.item.id_ingame
        return records_map.get(item_id, {}).get('overriden_min_buyout')

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        recipes = instance.recipes.all()
        if recipes.exists():
            recipe = recipes.first()
            rep['yield_quantity'] = recipe.yield_quantity
            rep['reagents'] = BoeReagentSerializer(
                recipe.reagents.all(),
                many=True,
                context=self.context
            ).data
        else:
            rep['yield_quantity'] = 1
            rep['reagents'] = []
        return rep


class BoeCategorySerializer(serializers.Serializer):
    category = serializers.CharField()
    items = serializers.ListField(child=serializers.DictField())


class BoeProfessionSerializer(serializers.Serializer):
    profession = serializers.CharField()
    items = serializers.ListField(child=serializers.DictField())


class BoeDataQuerySerializer(serializers.Serializer):
    realm = serializers.CharField()
    faction = serializers.CharField()
    record_id = serializers.IntegerField()
