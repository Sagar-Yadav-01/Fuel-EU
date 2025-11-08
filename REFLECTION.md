This document reflects on the design choices, trade-offs, and potential improvements for the FuelEU Maritime Compliance Platform.

1. Adherence to Clean Architecture

The primary goal was to strictly follow the Clean/Hexagonal Architecture pattern.

Benefits Achieved:

Decoupling: The core business logic (/core/application) has zero knowledge of Express, React, or Prisma. It only knows about its own domain models and the port interfaces.

Testability: The ComplianceService or PoolingService can be unit-tested in isolation by providing mock repositories (ports).

Swapability: The database is abstracted behind the IRouteRepository interface. We used a PrismaRouteRepository, but we could (with minimal effort) create a MongoRouteRepository or InMemoryRouteRepository without changing a single line of business logic. The same applies to the frontend's API service.

Clarity: The folder structure makes it very clear where different types of logic belong. inbound adapters talk to the application, outbound adapters are called by the application.

Challenges & Trade-offs:

Boilerplate: This architecture is not concise. It requires more files (interfaces, implementations, services) to achieve a simple task. For a small POC, it can feel like overkill. However, for an enterprise system, this separation is invaluable.

Frontend Complexity: Applying Clean Architecture to a React frontend is less common. The use of a central useDashboard hook was a pragmatic choice to bridge the "service layer" (core/application) with React's state-driven world.

2. Technology Choices

Backend: Node.js, Express, Prisma

Prisma: This was an excellent choice. It made schema definition, migration, and data access (via the generated client) incredibly simple and type-safe.

SQLite: Perfect for a local demo. It's file-based, requires zero setup, and is fully supported by Prisma. Migrating to PostgreSQL would only require changing two lines: the provider in schema.prisma and the DATABASE_URL in .env.

Express: A minimal, standard choice for the API layer. It stayed in its "adapter" lane and did not leak into the core logic.

Frontend: React, Vite, Tailwind

Vite: Fast, simple, and standard for modern React development.

TailwindCSS: Allowed for rapid, consistent styling without writing any custom CSS files. The tailwind.config.cjs provided a central place for the "navy" and "sky" theme colors.

Recharts: A good, lightweight choice for the bar chart on the "Compare" tab.

3. Potential Improvements & Next Steps

Authentication & Multi-Tenancy: The entire app currently operates on a hardcoded DEMO_SHIP_ID (S001). The next logical step would be to add user authentication (e.g., JWT) and link all data (routes, compliance) to a userId or companyId. The schema is partially ready for this with the shipId field.

Robust Error Handling: The current error handling is basic (try/catch blocks in controllers returning 500s). A more robust solution would involve custom error classes (e.g., ValidationError, NotFoundError) that can be thrown from the services and interpreted by a dedicated error middleware in Express.

Complex Banking Logic: The BankingService currently allows applying a deficit assuming the user has banked surplus. A real implementation would need to query BankEntry records from previous years to validate if a sufficient "bank" exists to draw from.

State Management (Frontend): The useDashboard hook is effective, but for a larger app, this state could become unwieldy. A dedicated state management library (like Zustand or React Query) would be a good next step. React Query, in particular, would simplify the data fetching, caching, and mutation logic (like handleSetBaseline).

Transactions: The pooling logic in PoolingService updates multiple ships' compliance balances. This entire operation should be wrapped in a database transaction (prisma.$transaction([...])) to ensure that if one update fails, all updates are rolled back, maintaining data integrity.
