# AI Development Rules for BlueWarriors Project

This document provides guidelines for the AI assistant to follow when developing and modifying this application. The goal is to maintain code quality, consistency, and adherence to the established technology stack.

## Tech Stack Overview

This project is built with a modern, component-based architecture. Key technologies include:

- **Framework**: React with Vite for a fast development experience.
- **Language**: TypeScript for type safety and improved developer experience.
- **UI Components**: A comprehensive set of pre-built, accessible components from `shadcn/ui`.
- **Styling**: Tailwind CSS for a utility-first styling approach.
- **Routing**: `react-router-dom` for client-side navigation.
- **Data Fetching**: TanStack Query (`@tanstack/react-query`) for managing server state, caching, and asynchronous data.
- **Icons**: `lucide-react` for a consistent and clean set of icons.
- **Forms**: `react-hook-form` and `zod` for robust and type-safe form handling and validation.
- **Theming**: `next-themes` for seamless light and dark mode support.

## Library Usage and Coding Rules

To ensure consistency across the codebase, please adhere to the following rules:

### 1. UI and Components

- **Primary Component Library**: **ALWAYS** use components from `shadcn/ui` (`@/components/ui/...`) whenever possible. Do not create custom components for UI elements like buttons, dialogs, cards, etc., if a `shadcn/ui` version exists.
- **Component Structure**: Create small, focused components. New components should be placed in `src/components/`. Page-specific larger components can be placed in `src/components/sections/`.
- **Styling**: **ALWAYS** use Tailwind CSS utility classes for styling. Do not write custom CSS in `.css` files or use inline `style` objects, except for dynamic values that cannot be handled by Tailwind classes.

### 2. Icons

- **Icon Library**: **ALWAYS** use icons from the `lucide-react` package. Do not introduce other icon libraries or use inline SVGs.

### 3. Routing

- **Router**: All client-side routing **MUST** be managed using `react-router-dom`.
- **Route Definitions**: All routes should be defined within the `<Routes>` component in `src/App.tsx`.

### 4. State Management

- **Server State**: For any data fetched from an API, **ALWAYS** use TanStack Query (`@tanstack/react-query`). This includes caching, refetching, and mutation logic.
- **Client State**: For simple, local component state, use React's built-in hooks like `useState` and `useReducer`. Avoid complex global state management libraries unless absolutely necessary.

### 5. Forms

- **Form Logic**: **ALWAYS** use `react-hook-form` to manage form state, validation, and submissions.
- **Schema Validation**: **ALWAYS** use `zod` to define validation schemas for forms.
- **Form Components**: Integrate `react-hook-form` with the `shadcn/ui` `<Form>` component and its associated fields for a seamless user experience.

### 6. Notifications

- **User Feedback**: Use the pre-configured `Toaster` (from `@/components/ui/toaster`) and `Sonner` components for displaying toast notifications. The `useToast` hook is available for the standard toaster.

### 7. File Structure

- **Pages**: All page components must reside in `src/pages/`.
- **Reusable Components**: All general-purpose components must reside in `src/components/`.
- **Custom Hooks**: Custom hooks should be placed in `src/hooks/`.
- **Utility Functions**: General utility functions should be placed in `src/lib/`.