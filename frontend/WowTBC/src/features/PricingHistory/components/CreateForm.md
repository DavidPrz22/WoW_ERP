# Pricing History Implementation Plan

## USE SKILLS ON AGENTS FILES!

## 1. Overview
This plan outlines the steps to build a robust Pricing History feature. The goal is to allow users to search for items, apply specific filters, and retrieve historical pricing data from the backend. The feature will be powered by Django (backend) and React (frontend) using modern data fetching and form management tools.

## 2. Frontend Data Management & Form Validation
- **Form Management:** Implement `react-hook-form` to manage user inputs efficiently.
- **Validation:** Use `zod` alongside `react-hook-form` (via `@hookform/resolvers/zod`) to enforce strict type-checking and validation rules for the search fields and filters.
- **State & Caching:** Utilize `@tanstack/react-query` to fetch, cache, and synchronize server data (filter options, item lists, and price history) with the UI components.

## 3. Search & Filter Requirements
The search functionality will allow querying the `Item.name` field (case-insensitive) combined with several optional filters.

### Dependent Filters
- **Class & Subclass:**
  - Create a backend endpoint to fetch available classes and their corresponding subclasses.
  - The subclass `<Select>` component options should dynamically update based on the selected class. If no class is selected, the subclass dropdown should reflect this dependency.

### Independent Filters
- **Quality:** Select component for item rarity (e.g., Common, Rare, Epic).
- **Faction:** Select component for in-game faction (e.g., Horde, Alliance).
- **Realm:** Select component for server realm.
- **Date Range:** 
  - `FromDate` and `ToDate` fields implemented using date picker components.
  - The form should store these as formatted strings (e.g., `YYYY-MM-DD`) representing the selected range.
  USE THE EXISTRING COMPONENT FOR THE DATE RANGE, DO NOT MODIFY OR BREAK IT. FromDate and ToDate are selected on the same component.

*Note: All filter dropdown options (Class, Subclass, Quality, Faction, Realm) should be fetched from the backend on page mount and cached via React Query.*

## 4. Backend Endpoints (Django)
Create the following REST API endpoints in the `Registros` app. Every endpoint must include detailed docstrings explaining its purpose and usage.

1. **GET `/api/filters/class-subclass/`**
   - Returns a structured mapping of classes and their associated subclasses.
2. **GET `/api/filters/quality/`**
  GI - Returns available options for Quality.
3. **GET `/api/filters/faction/`**
   - Returns available options for Faction.
4. **GET `/api/filters/realm/`**
   - Returns available options for Realm.
5. **GET `/api/items/search/`**
   - **Query Params:** `searchterm`, `class`, `subclass`, `quality`.
   - Returns a list of items matching the case-insensitive search and applied filters.
   - CREATE queryOptions for each individual filter option.
6. **GET `/api/pricing-history/`**
   - **Query Params:** `item_id` (required), `faction_id`, `realm_id`, `from_date`, `to_date`.
   - Returns the pricing records for the selected item over the specified date range.

## 5. User Workflow & Data Fetching
1. **Mounting:** When the page loads, React Query fetches the filter options.
2. **Searching:** As the user types the search term and selects filters, a request is made to `/api/items/search/` to display item results.
3. **Selecting:** Once an item is clicked from the search results, the form submits with the selected item ID, faction, realm, and date range.
4. **Fetching History:** A query to `/api/pricing-history/` is triggered. The returned pricing data is cached via React Query and rendered on the UI.

## 6. Architecture & File Structure
Ensure code follows a strict feature-based architecture within `src/features/PricingHistory/`:
- `components/`: UI components like filters, charts, and cards.
- `api/`: API request functions (axios/fetch).
- `queries/`: React Query custom hooks (e.g., `useItemSearch`, `usePricingData`).
- `hooks/`: Local component logic.
- `types/`: Zod schemas and TypeScript interfaces.