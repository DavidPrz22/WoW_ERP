from rest_framework import generics, status
from rest_framework.response import Response

from Boe.serializers import BoeDataQuerySerializer
from Boe.services.boe_calculations_service import BoeCalculationsService


class GetBoeDataView(generics.GenericAPIView):
    serializer_class = BoeDataQuerySerializer

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
