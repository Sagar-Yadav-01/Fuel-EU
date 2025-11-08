FuelEU Maritime Compliance Platform

This is a full-stack proof-of-concept (POC) application for monitoring, comparing, and managing FuelEU Maritime compliance. It is built with React/TypeScript on the frontend and Node.js/TypeScript on the backend, following a Clean Architecture (Hexagonal) pattern.

The application allows users to:

View and manage vessel routes and set baselines.

Compare route performance against the 2025 FuelEU target.

Manage a Compliance Balance (CB) through banking (surplus) and applying (deficit).

Simulate a compliance pool with other vessels.

Project Structure

/fueleu-compliance
├─ /frontend         # React + Vite + Tailwind UI
└─ /backend          # Node.js + Express + Prisma API
└─ README.md         # This file
└─ AGENT_WORKFLOW.md
└─ REFLECTION.md


1. Backend Setup (Run this first)

The backend server provides the API and manages the SQLite database.

Navigate to the backend folder:

cd fueleu-compliance/backend


Install dependencies:

npm install


Create and migrate the database:
This command will:

Create the SQLite database file (/prisma/dev.db).

Apply the schema defined in prisma/schema.prisma.

Generate the Prisma Client.

npx prisma migrate dev --name init


Seed the database:
This command will run prisma/seed.ts to populate the database with the sample routes provided in the brief.

npx prisma db seed


Run the backend server:

npm run dev


The backend server will now be running at http://localhost:5000.

2. Frontend Setup

The frontend is a React application built with Vite.

Open a new terminal window.

Navigate to the frontend folder:

cd fueleu-compliance/frontend


Install dependencies:

npm install


Run the frontend development server:

npm run dev


The frontend application will now be running and will open in your browser, typically at http://localhost:5173.

You can now interact with the full application.

3. Testing API Endpoints (Optional)

You can use curl in a terminal to test the backend API endpoints directly.

Get all routes:

curl http://localhost:5000/api/routes


Set R004 as baseline (for 2025):

curl -X POST http://localhost:5000/api/routes/R004/baseline


Get comparison data (for S001 in 2025):

curl "http://localhost:5000/api/routes/comparison?shipId=S001&year=2025"


Get Compliance Balance (for S001 in 2025):
(This will compute and save the CB if it doesn't exist)

curl "http://localhost:5000/api/compliance/cb?shipId=S001&year=2025"


Create a pool (for 2025):

curl -X POST -H "Content-Type: application/json" \
-d '{"year": 2025, "shipIds": ["S001", "S002", "S003"]}' \
http://localhost:5000/api/pools
