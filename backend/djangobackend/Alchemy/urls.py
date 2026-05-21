from django.urls import path
from .views import CreateAlchemyItemView, GetAlchemyGroupsDataView

urlpatterns = [
    path('items/create/', CreateAlchemyItemView.as_view(), name='alchemy-item-create'),
    path('groups/data/', GetAlchemyGroupsDataView.as_view(), name='alchemy-groups-data'),
]

