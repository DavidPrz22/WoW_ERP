# WowTBC ERP - Frontend Implementation Plan

## Overview
A web application interface for managing and displaying World of Warcraft (TBC) item pricing data. The layout will include a foldable sidebar with icons for easy navigation across different modules.

## Main Navigation (Sidebar)
1. **Home**
2. **Records**
3. **Pricing History**
4. **Professions** (Dropdown)
    - Alchemy, Gemcutting, Enchanting, Engineering, Cooking, BOEs

---

## Page Specifications

### 1. Home
The landing page providing a high-level overview of the application state.
- **Hero Section:** App title and a brief description.
- **Latest Records:** A summary section displaying the most recent data ingestion snapshots (maps to the `Records` model).
- **Latest Pricing:** A summary section displaying recent pricing updates.

### 2. Records Management
Interface for viewing and generating data ingestion snapshots.
- **Records Table:** A paginated data table displaying all ingestion records (`Records` model), including timestamps and associated Auction Houses.
- **Generate Record Action:** A button to trigger a backend task that fetches the latest data from the TSM API, creating a new `Record` and populating its `ItemRecord` entries.
- **Search Bar:** Functionality to search for specific records (e.g., by date or realm).
- **Button that open a panel for a Price Table:** A table to display the price of the selected item in each realm and AH faction.
- **Filters:**
    - A select for AH factions.

### 3. Pricing History
A comprehensive view for exploring item pricing data and trends.
- **Search & Filtering:**
    - **Item Search:** A predictive, autocomplete search bar. As the user types, it displays a dropdown of matching items (`Item` model).
    - **Dynamic Class Filters:** A primary select dropdown for `ItemClass`. Selecting a class dynamically enables and populates a secondary select dropdown for the related `ItemSubclass`.
    - **Quality Filter:** A select dropdown to filter items by `Quality` (Common, Uncommon, Rare, Epic, Legendary).
    - **Faction Filter:** A select dropdown to filter pricing data by the Auction House `Faction` (Horde, Alliance).
    - **Time Range Filter:** An optional date range picker to filter historical data points.
- **Item Details & Trends:**
    - **Pricing History:** Displays historical metrics (`market_value`, `min_buyout`, `num_auctions`, `historical` from `ItemRecord`) for the selected item over the chosen timeframe.
    - **Trend Graph:** A placeholder section for a chart visualizing the item's price history.

### 4. Professions
Simple, browseable pages categorized by profession or item type.
- Plain pages serving as placeholders for basic browsing, without extensive details for now.
- Categories: Alchemy, Gemcutting, Enchanting, Engineering, Cooking, BOEs.
