-- CreateTable
CREATE TABLE "Route" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "routeId" TEXT NOT NULL,
    "vesselType" TEXT NOT NULL,
    "fuelType" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "ghgIntensity" REAL NOT NULL,
    "fuelConsumption" REAL NOT NULL,
    "distance" REAL NOT NULL,
    "totalEmissions" REAL NOT NULL,
    "isBaseline" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shipId" TEXT NOT NULL DEFAULT 'S001'
);

-- CreateTable
CREATE TABLE "ShipCompliance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shipId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "cb_gco2eq" REAL NOT NULL,
    "cb_adjusted" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BankEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shipId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "amount_gco2eq" REAL NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Pool" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "year" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PoolMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "poolId" TEXT NOT NULL,
    "shipId" TEXT NOT NULL,
    "cb_before" REAL NOT NULL,
    "cb_after" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PoolMember_poolId_fkey" FOREIGN KEY ("poolId") REFERENCES "Pool" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Route_routeId_key" ON "Route"("routeId");

-- CreateIndex
CREATE UNIQUE INDEX "ShipCompliance_shipId_year_key" ON "ShipCompliance"("shipId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "Pool_year_key" ON "Pool"("year");

-- CreateIndex
CREATE UNIQUE INDEX "PoolMember_poolId_shipId_key" ON "PoolMember"("poolId", "shipId");
