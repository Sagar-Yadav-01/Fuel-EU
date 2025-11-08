import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Your provided seed data
const routeData = [
  {
    routeId: 'R001',
    vesselType: 'Container',
    fuelType: 'HFO',
    year: 2024,
    ghgIntensity: 91.0,
    fuelConsumption: 5000,
    distance: 12000,
    totalEmissions: 4500,
    shipId: 'S001',
  },
  {
    routeId: 'R002',
    vesselType: 'BulkCarrier',
    fuelType: 'LNG',
    year: 2024,
    ghgIntensity: 88.0,
    fuelConsumption: 4800,
    distance: 11500,
    totalEmissions: 4200,
    shipId: 'S001',
  },
  {
    routeId: 'R003',
    vesselType: 'Tanker',
    fuelType: 'MGO',
    year: 2024,
    ghgIntensity: 93.5,
    fuelConsumption: 5100,
    distance: 12500,
    totalEmissions: 4700,
    shipId: 'S001',
  },
  {
    routeId: 'R004',
    vesselType: 'RoRo',
    fuelType: 'HFO',
    year: 2025,
    ghgIntensity: 89.2,
    fuelConsumption: 4900,
    distance: 11800,
    totalEmissions: 4300,
    shipId: 'S001',
  },
  {
    routeId: 'R005',
    vesselType: 'Container',
    fuelType: 'LNG',
    year: 2025,
    ghgIntensity: 90.5,
    fuelConsumption: 4950,
    distance: 11900,
    totalEmissions: 4400,
    shipId: 'S001',
  },
  {
    routeId: 'R006',
    vesselType: 'Tanker',
    fuelType: 'MGO',
    year: 2025,
    ghgIntensity: 92.0,
    fuelConsumption: 5200,
    distance: 12800,
    totalEmissions: 4800,
    shipId: 'S002', // A different ship for pooling
  },
  {
    routeId: 'R007',
    vesselType: 'Container',
    fuelType: 'HFO',
    year: 2025,
    ghgIntensity: 88.5,
    fuelConsumption: 4700,
    distance: 11000,
    totalEmissions: 4100,
    shipId: 'S003', // A third ship for pooling
  },
];

async function main() {
  console.log('Start seeding ...');

  // Clear existing data
  await prisma.poolMember.deleteMany();
  await prisma.pool.deleteMany();
  await prisma.bankEntry.deleteMany();
  await prisma.shipCompliance.deleteMany();
  await prisma.route.deleteMany();

  // Seed routes
  for (const data of routeData) {
    const route = await prisma.route.create({
      data: data,
    });
    console.log(`Created route with id: ${route.id} (${route.routeId})`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });