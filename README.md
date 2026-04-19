# User Management React App

A Single Page Application built with React, TypeScript and Vite that integrates with the [GoRest](https://gorest.co.in/) REST API. The app allows users to register, manage their posts and comments, update their profile, and includes an admin panel for user management.

---

## Features

- **User registration** with form validation
- **Login** for both regular users and admin
- **Posts management** — view, create, and interact with posts and comments
- **User settings** — update profile or delete account
- **Admin dashboard** — manage all users (edit, block/unblock, delete) with filtering and pagination
- **Multilanguage support** — Italian and English
- **Toast notifications** for real-time feedback
- **Responsive UI** built with shadcn/ui and Tailwind CSS

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS v4 |
| Component Library | shadcn/ui (Radix UI) |
| Routing | React Router v6 |
| State Management | Zustand (with persistence) |
| Form Management | React Hook Form |
| Validation | Zod |
| Internationalization | i18next + react-i18next |
| Notifications | Sonner |
| Icons | Lucide React |
| REST API | GoRest API |

---

## Project Structure

```
src/
├── api/              # API clients (users, posts)
├── components/       # Reusable UI components
│   ├── admin/        # Admin-specific components (modals)
│   ├── custom-ui/    # Custom components (LanguageSwitcher)
│   └── ui/           # shadcn/ui components
├── context/          # React Context (LoaderContext)
├── i18n/             # i18next config and locale files
│   └── locales/      # en.json, it.json
├── layout/           # MainLayout, PublicLayout
├── pages/            # Page components
│   └── admin/        # Admin pages
├── router/           # AppRouter, ProtectedRoute
├── store/            # Zustand auth store
├── types/            # TypeScript interfaces
├── utils/            # Utility functions
└── validations/      # Zod schemas
```

---

## Architecture

The project follows a three-level separation of concerns:

- **Pages** — orchestrate logic, API calls and state. No complex UI.
- **Layouts** — define the global structure (navbar, main container). Unaware of business logic.
- **Components** — reusable, agnostic UI building blocks (forms, cards, modals).

---

## Getting Started

### Prerequisites

- Node.js 18+
- A free [GoRest](https://gorest.co.in/) account to get an API token

### Installation

```bash
git clone https://github.com/vin96spa/user-management-react-app.git
cd user-management-react-app
npm install
```

### Environment Variables

Create a `.env` file in the root of the project:

```env
VITE_API_TOKEN=your_gorest_token_here
VITE_ADMIN_EMAIL=your_admin_email_here
```

- `VITE_API_TOKEN` — your personal GoRest API token
- `VITE_ADMIN_EMAIL` — the email address that grants admin access on login

### Run

```bash
npm run dev
```

---

## Key Implementation Details

### Authentication

There is no real authentication API on GoRest. Login is simulated by searching for a user by email. If the email matches `VITE_ADMIN_EMAIL`, the user is granted admin access. Session state is persisted in `localStorage` via Zustand's `persist` middleware.

### Protected Routes

`ProtectedRoute` wraps all authenticated pages. It reads `userId` and `isAdmin` from the store and redirects accordingly:

- Pages requiring admin → redirect to `/login` if not admin
- User pages → redirect to `/register` if not logged in

### Form Management

All forms use **React Hook Form** with **Zod** schemas for validation. The `UserForm` component is shared across registration, settings and the admin edit modal using `FormProvider` and `useFormContext` to avoid prop drilling. Components from shadcn/ui (like `RadioGroup`) that don't use native inputs are integrated via `Controller`.

### Multilanguage

Language switching is handled by `i18next` with `i18next-browser-languagedetector`. Translations are split by feature section in `en.json` and `it.json`. A `LanguageSwitcher` component toggles between Italian and English with a loading indicator.

---

## Commit Convention

```
feat:      new feature
fix:       bug fix
refactor:  code change without behavior change
style:     UI / CSS only
chore:     config, setup, tooling
docs:      README or documentation
```

---

## License

[MIT](LICENSE)
