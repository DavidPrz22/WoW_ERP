from rest_framework import serializers

class PricingHistorySerializer(serializers.Serializer):
    item_id = serializers.IntegerField()
    faction_id = serializers.IntegerField()
    realm_id = serializers.IntegerField()
    from_date = serializers.DateField(required=False)
    to_date = serializers.DateField(required=False)

    def validate(self, attrs):
        from_date = attrs.get('from_date')
        to_date = attrs.get('to_date')
        
        if from_date and to_date and from_date > to_date:
            raise serializers.ValidationError({
                'from_date': 'from_date must be before to_date',
                'to_date': 'to_date must be after from_date'
            })
        return attrs

    
