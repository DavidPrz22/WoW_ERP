from django.urls import path
from .views import GetJewelcraftingItemsView

urlpatterns = [
    path('items/', GetJewelcraftingItemsView.as_view(), name='jewelcrafting-items'),
]