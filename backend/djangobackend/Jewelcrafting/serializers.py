from rest_framework import serializers


class JewelcraftingItemsQuerySerializer(serializers.Serializer):
    faction = serializers.CharField()
    realm = serializers.CharField()
    selected_record = serializers.IntegerField()