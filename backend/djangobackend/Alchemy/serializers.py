from rest_framework import serializers
from .models import AlchemyItem


class AlchemyItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlchemyItem
        fields = ['group', 'item_id']

