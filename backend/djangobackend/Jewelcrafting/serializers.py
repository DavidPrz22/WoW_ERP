from rest_framework import serializers


class JewelcraftingItemsQuerySerializer(serializers.Serializer):
    faction = serializers.CharField()
    realm = serializers.CharField()
    record_id = serializers.IntegerField()