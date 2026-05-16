from django.contrib import admin
from .models import Userdata

@admin.register(Userdata)
class UserdataAdmin(admin.ModelAdmin):
    list_display = ('id_user', 'dynamic_data_summary')
    search_fields = ('id_user',)

    def dynamic_data_summary(self, obj):
        """Returns a truncated string representation of the JSON data for the list view."""
        data_str = str(obj.dynamic_data)
        return (data_str[:75] + '...') if len(data_str) > 75 else data_str
    
    dynamic_data_summary.short_description = 'Dynamic Data'
