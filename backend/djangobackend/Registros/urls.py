from django.urls import path
from .views import (
    OverridePriceView,
    PricingHistoryView,
    FilterClassSubclassView,
    FilterQualityView,
    FilterFactionView,
    FilterRealmView,
    ItemSearchView,
    RecordsView,
    GenerateRecordView,
    GenerateRecordsDataView
)

urlpatterns = [
    path('pricing-history/', PricingHistoryView.as_view(), name='pricing-history'),
    path('filters/class-subclass/', FilterClassSubclassView.as_view(), name='filter-class-subclass'),
    path('filters/quality/', FilterQualityView.as_view(), name='filter-quality'),
    path('filters/faction/', FilterFactionView.as_view(), name='filter-faction'),
    path('filters/realm/', FilterRealmView.as_view(), name='filter-realm'),
    path('items/search/', ItemSearchView.as_view(), name='item-search'),
    path('records/', RecordsView.as_view(), name='records'),
    path('records/generate/', GenerateRecordView.as_view(), name='generate-record'),
    path('records/data/', GenerateRecordsDataView.as_view(), name='records-data'),
    path('records/override_price/', OverridePriceView.as_view(), name='override-price'),
]
