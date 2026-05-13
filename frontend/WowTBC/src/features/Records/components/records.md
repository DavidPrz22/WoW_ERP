### Implement data retrieval for records from the backend data

#### 1. Backend Implementation (Django)
1. **Serializers:** Create serializers in `backend/djangobackend/Registros/serializers.py` for `ItemRecord`, including nested details from the related `Records` and `AuctionHouse` models (e.g., to expose `timestamp`, `realm_name`, and `faction`).
2. **Endpoints:** Create a ViewSet or API view for `ItemRecord` to retrieve pricing data.
3. **Filtering & Pagination:** Configure the endpoint to support pagination (max 50 records per page) and allow filtering by `item_id`, `realm_name`, and `faction`.

#### 2. Frontend Implementation (React / TypeScript)
1. **Data Types:** Create appropriate TypeScript interfaces in the feature folder (`src/features/Records/types/index.ts` or similar) to accurately represent the API response (e.g., `ItemRecord`, `PaginatedResponse<ItemRecord>`).
2. **React Query Hooks:** Create custom hooks (e.g., `useItemRecords`) leveraging `@tanstack/react-query` to fetch, cache, and manage loading/error states for the endpoints.
3. **Component Updates:** 
   - Update `PriceTablePanel.tsx` to consume data from the new hook instead of relying on the local mock data (`generateHistory`, `realms`, `factions`).
   - Add UI controls for Pagination (Next/Previous pages).
   - Add UI Dropdowns/Toggles to filter the table by `Realm` and `Faction`.
