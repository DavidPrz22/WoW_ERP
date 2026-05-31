# Agents

## Repository Structure

- `backend/djangobackend/` — Django 6 + DRF + PostgreSQL API
  - `djangoApp/` — project settings (settings.py, urls.py)
  - `Registros/` — items/records app
  - `Alchemy/` — professions app with services, views, serializers
- `frontend/WowTBC/` — React 19 + TypeScript + Vite + Tailwind
- `reusableMds/` — project notes and documentation (do not modify)

## Backend

```bash
cd backend/djangobackend
python manage.py <command>
```

Common commands: `migrate`, `runserver`, `createsuperuser`, `shell`

Apps register models via `INSTALLED_APPS` in `djangoApp/settings.py`. Custom management commands live in each app's `management/commands/` directory.

Database config in `.env` (PostgreSQL). Do not commit `.env` changes.

## Frontend

```bash
cd frontend/WowTBC
pnpm dev     # dev server
pnpm build   # production build (runs tsc -b first)
pnpm lint    # eslint
```

Uses `@` alias for `src/`, configured in `vite.config.ts`.

## Testing

No test framework found in either backend or frontend. Do not add tests unless the project specifically sets them up.

## Code Style

- Frontend: ESLint + Tailwind, React 19 hooks
- Backend: Django conventions, DRF serializers
- No pre-commit hooks configured