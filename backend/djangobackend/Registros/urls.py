from rest_framework.routers import DefaultRouter
router = DefaultRouter()

# Pricing History
router.register('pricinghistory', PricingHistoryViewSet, basename='pricinghistory')

urlpatterns = router.urls
