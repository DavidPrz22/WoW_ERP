import requests
from django.core.management.base import BaseCommand
from Registros.models import Item, Records, ItemRecord, AuctionHouse

class Command(BaseCommand):
    help = 'Fetches pricing data from TSM and saves it to the database'

    OAUTH_URL_ENDPOINT = 'https://auth.tradeskillmaster.com/oauth2/token'
    PRICING_URL_ENDPOINT = 'https://pricing-api.tradeskillmaster.com'
    AUCTION_HOUSE_NS_ALLY = 555
    
    CLIENT_ID = "c260f00d-1071-409a-992f-dda2e5498536"
    CLIENT_TOKEN = "KExtHgEPTRDJJYMJQAjyHV_xNXmopBGN" 

    def get_access_token(self):
        response = requests.post(self.OAUTH_URL_ENDPOINT, json={
            "client_id": self.CLIENT_ID,
            "grant_type": "api_token",
            "scope": "app:realm-api app:pricing-api",
            "token": self.CLIENT_TOKEN
        })
        response.raise_for_status()
        return response.json().get('access_token')

    def pricing_data(self, token):
        ah = AuctionHouse.objects.get(realm_name="Nightslayer", faction="Alliance")
        url = f"{self.PRICING_URL_ENDPOINT}/ah/{ah.realm_id}"
        response = requests.get(url, headers={'Authorization': f'Bearer {token}'})
        response.raise_for_status()
        return response.json()

    def handle(self, *args, **options):
        self.stdout.write("Fetching access token...")
        try:
            token = self.get_access_token()
        except requests.exceptions.RequestException as e:
            self.stderr.write(f"Failed to get token: {e}")
            return

        self.stdout.write("Fetching pricing data...")
        try:
            data = self.pricing_data(token)
        except requests.exceptions.RequestException as e:
            self.stderr.write(f"Failed to get pricing data: {e}")
            return

        self.stdout.write("Saving data to database...")
        

        existing_items = {item.id_ingame: item for item in Item.objects.all()}
        
        items_records = []

        ah = AuctionHouse.objects.get(realm_name="Nightslayer", faction="Alliance")

        record = Records.objects.create(auction_house = ah)
        
        for item_data in data:
            item_id_str = str(item_data.get('itemId'))
            
            if item_id_str in existing_items:
                item_obj = existing_items[item_id_str]
                
                items_records.append(
                    ItemRecord(
                        item=item_obj,
                        record=record,
                        market_value=item_data.get('marketValue', 0),
                        min_buyout=item_data.get('minBuyout', 0),
                        num_auctions=item_data.get('numAuctions', 0),
                        historical=item_data.get('historical', 0)
                    )
                )

        if items_records:
            ItemRecord.objects.bulk_create(items_records, batch_size=1000)
            
        self.stdout.write(self.style.SUCCESS(f'Successfully updated pricing for {len(items_records)} items.'))

