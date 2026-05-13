# Implementation Plan: Backend Records Integration

## Objective
Implement data retrieval for historical records from the backend and populate the frontend UI components.

## Backend Tasks
1. **Create API Endpoint:** Develop a new endpoint to retrieve all ingestion records.
2. **Query Database:** Fetch data from the `Records` table (`backend/djangobackend/Registros/models.py`).
3. **Format Response:** Ensure the returned data includes:
   - Record ID (`id`).
   - Realm Name (from the related `AuctionHouse` model).
   - Faction (from the related `AuctionHouse` model).
   - Number of items in the record (count of related `item_records`).
   - Timestamp formatted as `DD/MM/YYYY, HH:MM:SS AM/PM`.
4. **Pagination:** Add server-side pagination to limit the payload to a maximum of 50 records per page.
5. **Filtering:** Implement filtering query parameters based on `realm` and `faction`.

## Frontend Tasks
1. **Define Types:** Create appropriate TypeScript interfaces in the `features/Records` folder to match the expected backend response.
2. **API Hooks:** Utilize `react-query` to create custom hooks that manage API requests, caching, and loading/error states.
3. **Update UI Components:** Refactor the UI to consume data from the new endpoint instead of using mock data. Display Realm and Faction as two distinct columns.
4. **Table Integration:** Ensure the table implements the pagination and filtering controls matching the backend capabilities.
\\wsl.localhost\Ubuntu\home\davidprz\projects\WowTBC_ERP\frontend\WowTBC\src\features\Records\components\SystemRecordsHeader.tsx
