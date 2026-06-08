from django.urls import path
from .views import GetEngineeringDataView

urlpatterns = [
    path('data/', GetEngineeringDataView.as_view(), name='engineering-data'),
]
