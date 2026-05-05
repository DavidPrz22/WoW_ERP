import { Items } from 'wow-classic-items';
import fs from 'fs';

const items = new Items();

const items_info = [];

for (const item of items) {
    if (!item.itemId || !item.class || !item.subclass || !item.icon) {
        continue;
    }

    const newItem = {
        'id_ingame': item.itemId,
        'name': item.name,
        'quality': item.quality || 'Common',
        'vendor_sell_price': item.sellPrice || 0,
        'item_class': item.class,
        'item_subclass': item.subclass,
        'icon': item.icon.split('/').pop(),
    }

    items_info.push(newItem);
}

fs.writeFileSync('items_data.json', JSON.stringify(items_info, null, 2));
console.log(`Successfully generated items_data.json with ${items_info.length} items.`);