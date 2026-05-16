## Implementation Plan: Record Selectors for System Records Table

### Objective
Implement a tiered selection system (Faction -> Realm -> Record) that allows users to fetch and display specific auction house records in the `SystemRecordsTable`.

### Data Models Reference
Backend models in `backend/djangobackend/Registros/models.py`:
- `Faction` (Choices: Horde, Alliance)
- `AuctionHouse` (Contains `realm_id`, `realm_name`, `faction`)
- `Records` (Contains `timestamp`, linked to `AuctionHouse`)

### Implementation Steps

#### 1. UI Components (Selectors)
- **Faction Selector:** Create a select dropdown for Faction (Horde/Alliance).
- **Realm Selector:** Create a select dropdown for Realms. This should be disabled until a Faction is selected. The options should be filtered based on the selected Faction.
- **Record Selector:** Create a select dropdown for specific Records (timestamps). This should be disabled until a Realm is selected. The options should show the available `Records` for the selected `AuctionHouse`.

#### 2. Data Fetching & State Management (React Query)
- **Queries:**
  - `useRealms(faction)`: Fetch `AuctionHouse` entries filtered by `faction`. Cache with React Query using keys like `['realms', faction]`.
  - `useRecords(realmId)`: Fetch available `Records` for a specific `realmId`. Cache with React Query using keys like `['records', realmId]`.
  - `useRecordData(recordId)`: Fetch the actual pricing data for the selected `recordId`. Cache using `['recordData', recordId]`.

#### 3. Interaction Flow
- User selects a **Faction**.
- The **Realm** selector becomes active and populates with realms for that faction via React Query.
- User selects a **Realm**.
- The **Record** selector becomes active and populates with timestamps for that realm.
- User selects a **Record**.
- This selection triggers the `useRecordData` query to fetch the actual record data.

#### 4. Form and Mutations
- Wrap the selectors in a form to handle submission, or trigger the data fetch automatically when a record is selected.
- Create a `useMutation` (or lazy `useQuery`) to fetch the requested Record Data. Ensure the fetched data is cached by React Query.

#### 5. Integration
- Store the selected filters and the resulting `recordId` in the `useRecordsStore` (Zustand) so it can be accessed globally by the `SystemRecordsTable`.
- Update the table to consume the dynamically fetched data instead of mock data.
