import * as fs from 'fs';
import { Items } from 'wow-classic-items';

const items = new Items()

const OAUTH_URL_ENDPOINT = 'https://auth.tradeskillmaster.com/oauth2/token';
const PRICING_URL_ENDPOINT = 'https://pricing-api.tradeskillmaster.com';
const AUCTION_HOUSE_NS_ALLY = 555

const getAccessToken = async () => {
    const response = await fetch(OAUTH_URL_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "client_id": "c260f00d-1071-409a-992f-dda2e5498536",
            "grant_type": "api_token",
            "scope": "app:realm-api app:pricing-api",
            "token": "KExtHgEPTRDJJYMJQAjyHV_xNXmopBGN"
        })
    });
    const data = await response.json();
    return data.access_token;
}

const getPricingData = async () => {
    const token = await getAccessToken();
    const response = await fetch(`${PRICING_URL_ENDPOINT}/ah/${AUCTION_HOUSE_NS_ALLY}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
}

const printCSV = async () => {
    const data = await getPricingData();

    const formattedData = [];

    data.forEach((item) => {
        const itemName = items.find((i) => i.itemId === item.itemId)?.name

        const objectFormatted = {
            itemId: item.itemId,
            name: itemName,
            minBuyout: item.minBuyout / 10000
        }
        formattedData.push(objectFormatted);
    })

    const csvRows = [
        ['itemId', 'name', 'minBuyout'].join(','),
        ...formattedData.map(item => [
            item.itemId,
            `"${(item.name || '').replace(/"/g, '""')}"`,
            item.minBuyout
        ].join(','))
    ].join('\n');

    fs.writeFileSync('LISTA_PRECIOS.csv', csvRows);
}

printCSV();
