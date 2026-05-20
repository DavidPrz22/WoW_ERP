from django.urls import path
from .views import CreateAlchemyItemView

urlpatterns = [
    path('items/create/', CreateAlchemyItemView.as_view(), name='alchemy-item-create'),
]
