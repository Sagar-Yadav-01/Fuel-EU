import { Router } from 'express';
import { PoolingService } from '@/core/application/PoolingService';
import { ComplianceService } from '@/core/application/ComplianceService';
import { PrismaComplianceRepository } from '@/adapters/outbound/postgres/PrismaComplianceRepository';
import { PrismaRouteRepository } from '@/adapters/outbound/postgres/PrismaRouteRepository';
import { PrismaPoolRepository } from '@/adapters/outbound/postgres/PrismaPoolRepository';

const router = Router();

// Instantiate repositories and services
const complianceRepository = new PrismaComplianceRepository();
const routeRepository = new PrismaRouteRepository();
const poolRepository = new PrismaPoolRepository();
const complianceService = new ComplianceService(complianceRepository, routeRepository);
const poolingService = new PoolingService(poolRepository, complianceService);

// POST /api/pools
router.post('/', async (req, res) => {
  try {
    const { year, shipIds } = req.body;
    if (!year || !shipIds || !Array.isArray(shipIds)) {
      return res.status(400).json({ message: 'year and shipIds array are required' });
    }
    const result = await poolingService.createPool({ year, shipIds });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error creating pool', error: (error as Error).message });
  }
});

export default router;