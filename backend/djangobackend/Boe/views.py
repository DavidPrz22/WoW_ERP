from rest_framework import generics, status
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from Boe.serializers import BoeDataQuerySerializer
from Boe.services.boe_calculations_service import BoeCalculationsService


class GetBoeDataView(generics.GenericAPIView):
    serializer_class = BoeDataQuerySerializer
    @extend_schema(
        tags=['Boe'],
        summary='Get BOE item data',
        description='Return grouped Bind-on-Equip item data with reagent costs and auction pricing.',
        request=BoeDataQuerySerializer,
        responses={
            200: {
                'type': 'object',
                'properties': {
                    'data': {
                        'type': 'object',
                        'properties': {
                            'by_profession': {
                                'type': 'array',
                                'items': {
                                    'type': 'object',
                                    'properties': {
                                        'profession': {'type': 'string'},
                                        'items': {'type': 'array', 'items': {'type': 'object'}},
                                    },
                                },
                            },
                            'by_category': {
                                'type': 'array',
                                'items': {
                                    'type': 'object',
                                    'properties': {
                                        'category': {'type': 'string'},
                                        'items': {'type': 'array', 'items': {'type': 'object'}},
                                    },
                                },
                            },
                            'total_reagents_used': {'type': 'object'},
                        },
                    },
                },
            },
        },
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        faction = serializer.validated_data.get('faction')
        realm = serializer.validated_data.get('realm')
        record_id = serializer.validated_data.get('record_id')

        grouped_data = BoeCalculationsService.get_grouped_boe_data(
            faction=faction,
            realm=realm,
            record_id=record_id
        )

        return Response({'data': grouped_data}, status=status.HTTP_200_OK)
