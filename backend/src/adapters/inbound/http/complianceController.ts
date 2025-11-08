import { Router } from 'express';
import { ComplianceService } from '@/core/application/ComplianceService';
import { PrismaComplianceRepository } from '@/adapters/outbound/postgres/PrismaComplianceRepository';
import { PrismaRouteRepository } from '@/adapters/outbound/postgres/PrismaRouteRepository';

const router = Router();

// Instantiate repositories and service (Dependency Injection)
const complianceRepository = new PrismaComplianceRepository();
const routeRepository = new PrismaRouteRepository();
const complianceService = new ComplianceService(complianceRepository, routeRepository);

// GET /api/compliance/cb?shipId=...&year=...
router.get('/cb', async (req, res) => {
  try {
    const { shipId, year } = req.query;
    if (!shipId || !year) {
      return res.status(400).json({ message: 'shipId and year queries are required' });
    }
    const compliance = await complianceService.getOrComputeComplianceBalance(shipId as string, parseInt(year as string));
    res.json(compliance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching compliance balance', error });
  }
});

// GET /api/compliance/adjusted-cb?shipId=...&year=...
router.get('/adjusted-cb', async (req, res) => {
  try {
    const { shipId, year } = req.query;
    if (!shipId || !year) {
      return res.status(400).json({ message: 'shipId and year queries are required' });
    }
    const compliance = await complianceService.getAdjustedComplianceBalance(shipId as string, parseInt(year as string));
    res.json(compliance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching adjusted compliance balance', error });
  }
});

export default router;