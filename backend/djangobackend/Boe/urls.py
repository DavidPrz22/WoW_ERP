from django.urls import path
from Boe.views import GetBoeDataView

urlpatterns = [
    path('data/', GetBoeDataView.as_view(), name='boe-data'),
]
