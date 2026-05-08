Migrate the use of the base react context state into a zustand state management.

Implement this for the feature Records at ```frontend\WowTBC\src\features\Records``` 

1. Any reusable state logic across a feature should be grouped together and placed inside a zustand store at ```\wsl.localhost\Ubuntu\home\davidprz\projects\WowTBC_ERP\frontend\WowTBC\src\ZustandStores```
2. The base react context state implementation should be removed and replaced with the zustand implementation.
3. Use `Zustand` for global state and `React useState` for local state. That’s the cleanest and most efficient architecture.
4. Prevent stores from becoming cluttered and components from being difficult to reuse.
5. Create necesarry types for the stores at ```frontend/WowTBC/src/features/Records/types```