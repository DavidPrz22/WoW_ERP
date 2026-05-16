Configure the current project to use the following frontend folder structure.

src/
├── api/                # API communication layer
│   ├── api.ts          # Centralized API endpoints
│   └── client.ts       # Axios/Fetch client configuration
├── assets/             # Static files (images, SVGs, etc.)
├── components/         # Reusable global UI components
│   ├── Layout/         # App layout wrappers (Sidebar, Navbar, etc.)
│   ├── shared/         # Shared complex components
│   ├── ui/             # Base UI elements (likely Shadcn or similar)
│   └── ...             # (Modals, Buttons, Pagination, Spinners)
├── context/            # React Context providers for global state
│   ├── AuthContext.tsx # Authentication state
│   └── ...             # (Domain-specific contexts: Compras, MateriaPrima, etc.)
├── data/               # Static data, constants, and translations
├── features/           # 🌟 Core domain logic grouped by feature
│   ├── Home/
│   ├── Records/
│   ├── PricingHistory/
│   ├── Professions/
│       └── ...             # (Alchemy, Gemcutting, Enchanting, Engineering, Cooking, BOEs)
├── hooks/              # Custom React Hooks
│   ├── useDebounce.ts
│   ├── useQueryHooks.ts
│   └── usePageHook.ts
├── lib/                # External library configurations
│   └── queryOptions.ts # React Query setups
├── pages/              # Top-level Page components (Route entry points)
│   ├── LoginPage.tsx
│   ├── MateriaPrimaPage.tsx
│   └── ...
├── styles/             # Global stylesheets
│   ├── animations.css
│   └── validationStyles.css
├── types/              # TypeScript interfaces and Zod schemas
│   ├── types.ts
│   └── zod-types.ts
├── utils/              # Helper functions
│   ├── use-toast.ts
│   └── utils.ts
├── App.tsx             # Main App component (Routing setup)
├── index.css           # Global Tailwind/Base CSS

Feature map

features/[FeatureName]/
├── api/             # Domain-specific API calls
├── components/      # Domain-specific UI elements
├── hooks/           # Domain-specific React logic
│   ├── mutations/   # Hooks for POST/PUT/DELETE
│   └── queries/     # Hooks for GET
├── schemas/         # Validation logic (Zod)
├── types/           # Domain TypeScript interfaces
├── utils/           # Domain-specific helpers
└── Plan.md / .md    # Local documentation


api/: Contains the global Axios or Fetch client (client.ts) that handles base URLs, interceptors, and authentication tokens for outgoing requests.
components/: Houses "dumb", highly reusable UI components that are not tied to any business logic. Examples include generic layout wrappers (Layout/), modal shells, customized buttons, and generic loaders.
context/: Contains React Context Providers used to hold global state that multiple disparate parts of the app need access to (e.g., AuthContext.tsx, POSContext.tsx).
pages/: These are the top-level route endpoints (e.g., MateriaPrimaPage.tsx, LoginPage.tsx). They act as "shells" that assemble the complex components exported from the features/ directory and inject them into a Layout.
hooks/ & lib/: Global custom React hooks (like useDebounce) and configuration setups for external libraries (like React Query configurations in queryOptions.ts).
types/: Global TypeScript interfaces and Zod validation schemas that are used application-wide.