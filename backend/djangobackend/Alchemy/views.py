from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from .models import AlchemyItem, AlchemyGroup
from .serializers import AlchemyItemSerializer
from Registros.models import Item
class CreateAlchemyItemView(generics.CreateAPIView):
    queryset = AlchemyItem.objects.all()
    serializer_class = AlchemyItemSerializer

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        group_name = data.get('group')
        id_ingame = data.get('item_id')

        if isinstance(group_name, str):
            try:
                group = AlchemyGroup.objects.get(name__iexact=group_name)
                data['group'] = group.id
            except AlchemyGroup.DoesNotExist:
                return Response({'error': f"Group '{group_name}' not found."}, status=status.HTTP_404_NOT_FOUND)

        if not id_ingame:
            return Response({'error': f"Item id_ingame not provided."}, status=status.HTTP_400_BAD_REQUEST)

        item = Item.objects.filter(id_ingame=id_ingame).first()
        if not item:
            return Response({'error': f"Item with id_ingame '{id_ingame}' not found."}, status=status.HTTP_404_NOT_FOUND)
        
        data['item_id'] = item.id

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
