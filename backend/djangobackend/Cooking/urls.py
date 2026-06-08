from django.urls import path
from .views import GetCookingGroupsDataView

urlpatterns = [
    path('groups/data/', GetCookingGroupsDataView.as_view(), name='cooking-groups-data'),
]
