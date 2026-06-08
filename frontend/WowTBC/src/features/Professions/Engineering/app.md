# Implement the engineering feature

## Backend:

1. Create Endpoints to retrive data for engineering items and records.
2. Create serializera and views for that goal, validate incoming data from the client. There must be serializer for record data incomming like faction, realm and record id.
3. Register the url
4. One of the endpoints needs to bring data for Engineering models based on types "Parts" or "Explosives."
5. The backend should provide info based on types with item name, yield qty per craft, along with reagents with record data like min_buyout, overriden_min_buyout
6. Consider that prices come in copper values as 6 digits

## FRONTEND:

1. Create api requests with error handling, schemas with zod validation, types and constants for engineering features based on the endpoints created to bring data from the backend.
2. Use tanstack query for caching
3. Update local state with zustand context when needed and suitable
4. Update constant local data with backend incoming data to populate parts and explosives tables.
5. Implement a select component to start the request for engineering data to the backend similar to other professions like alchemy.
6. Calculate crafting cost, breakeven, profit/item and roi%, use helper functions and display data in gold format
7. For Explosives table, there's a toggle feature for calculating crafting cost.
    - If items in the group have reagents that are within the parts group and the toggle is active, then the crafting value will be the crafting cost the part in the parts group, if its off, then it'll use the ah data from the request.
    - Updating the crafting cost will reflect changes in breaken, profit/item and roi%


When calculating crafting cost, consider the yield value of some items like parts
profit/item should be per item, if the yield value is 5, then calculate the single value



# Implement the cooking feature

## Backend:

1. Create Endpoints to retrive data for Cooking items and records.
2. Create serializera and views for that goal, validate incoming data from the client. There must be serializer for record data incomming like faction, realm and record id.
3. Register the url
4. One of the endpoints needs to bring data for Cooking models based on types
5. The backend should provide info based on types with item name, yield qty per craft, along with reagents with record data like min_buyout, overriden_min_buyout
6. Consider that prices come in copper values as 6 digits

## FRONTEND:

1. Create api requests with error handling, schemas with zod validation, types and constants for engineering features based on the endpoints created to bring data from the backend.
2. Use tanstack query for caching
3. Update local state with zustand context when needed and suitable
4. Update constant local data with backend incoming data to populate cooking table.
5. Implement a select component to start the request for cooking data to the backend similar to other professions like alchemy.
6. Calculate crafting cost, breakeven, profit/item and roi%, use helper functions and display data in gold format
7. Make the Qty to make input data to be persistent after changing routes through the app, use zustand global context for it.
8. Calculate total profit.

