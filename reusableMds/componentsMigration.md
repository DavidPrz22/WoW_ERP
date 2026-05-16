### Migrate the page to a feature based architecture.

1. Migrate the page html and all of its components at frontend\WowTBC\src\pages\SystemRecords.tsx into frontend\WowTBC\src\features\SystemRecords\components
2. Create smaller and reusable components present in the page
3. The page will ony have a single component that groups all the components
4. If reasable types can be created, place it at frontend\WowTBC\src\features\SystemRecords\types

The point is to use a feature based architecture for this page.