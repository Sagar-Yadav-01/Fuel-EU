This document outlines the development process followed to build the FuelEU Maritime Compliance Platform, as assisted by an AI agent.

1. Deconstruction and Planning

Goal: Build a full-stack (React/Node) application for FuelEU compliance.

Core Constraints: Must follow a strict Clean/Hexagonal Architecture folder structure. Must use the specified tech stack (TypeScript, Prisma, Tailwind). Must include all features from the brief (4 tabs, specific formulas).

Strategy:

Backend First: Establish the data foundation. This is critical for a data-driven application.

Frontend Second: Build the UI on top of the stable API.

Documentation Last: Generate README, REFLECTION, and this file.

2. Backend Domain Modeling

Database Schema: Translated the user's requested tables directly into a prisma/schema.prisma file. Used SQLite (provider = "sqlite") as requested for the demo.

Formulas: Isolated the core formulas (CB = (Target - Actual) * Energy) into a shared/constants.ts file and a core/application/ComplianceService.ts to ensure they are central, testable, and reusable.

Seed Data: Created prisma/seed.ts to populate the Route table with the exact data from the brief, plus a few extra entries (S002, S003) to make the Pooling feature functional.

3. Backend - Core & Ports (The "Hexagon")

Ports (Interfaces): Defined interfaces in src/core/ports/ (e.g., IRouteRepository, IComplianceRepository). These define the contract of what the application needs from the outside world (e.g., "I need to find all routes").

Application (Use Cases): Created services in src/core/application/ (e.g., RouteService, PoolingService). These services contain all the business logic and orchestrate data. They depend only on the port interfaces, not on any specific database or framework.

Pooling Logic: The PoolingService was the most complex, implementing a greedy allocation algorithm to satisfy the pool validation rules (∑CB ≥ 0, no ship exits worse off).

4. Backend - Adapters (In & Out)

Outbound (Database): Created src/adapters/outbound/postgres/ (named postgres for convention, but implements for Prisma/SQLite). PrismaRouteRepository.ts implements the IRouteRepository port using Prisma client calls. This isolates all database logic.

Inbound (API): Created src/adapters/inbound/http/ controllers. These are simple Express routers that take HTTP requests, parse them, call the appropriate application service, and return the result as JSON. They contain no business logic.

Server: Tied everything together in src/infrastructure/server/server.ts, which sets up Express, mounts the routers, and starts listening.

5. Frontend - Architecture

Parallel Structure: Mirrored the backend's Clean Architecture in the frontend.

Ports (Interfaces): src/core/ports/IApiService.ts defines the contract for all API interactions.

Application (Services): src/core/application/ services (e.g., RouteService) wrap the IApiService port, providing a clean API for the UI.

Adapters (Infrastructure): src/adapters/infrastructure/ApiService.ts is the implementation of the IApiService port, using axios to make real HTTP calls.

Adapters (UI): This is all the React code.

useDashboard.ts: A single, comprehensive hook that acts as the "controller" for the entire UI. It manages all application state, calls the frontend application services, and provides state and actions to the components.

pages/ & components/: "Dumb" React components that simply render the state provided by the useDashboard hook and call the actions it exposes.

6. Frontend - UI/UX

Layout: Created a Layout.tsx component for the consistent header and footer.

Tabs: Used simple React state in App.tsx to manage the active tab and render the correct page component.

Components: Built reusable components like KpiCard.tsx (for dashboards) and ComparisonChart.tsx (using recharts) to visualize data as requested.

Styling: Used TailwindCSS utility classes directly in the JSX for all styling, following the tailwind.config.cjs theme colors (e.g., bg-navy, text-sky).

7. Final Assembly

README.md: Assembled all setup and run commands into a single, clear, step-by-step guide to ensure the user can run the project from scratch.

curl Commands: Added curl commands to the README for quick API verification without the frontend.
