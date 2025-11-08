import { Router } from 'express';
import { BankingService } from '@/core/application/BankingService';
import { ComplianceService } from '@/core/application/ComplianceService';
import { PrismaComplianceRepository } from '@/adapters/outbound/postgres/PrismaComplianceRepository';
import { PrismaRouteRepository } from '@/adapters/outbound/postgres/PrismaRouteRepository';

const router = Router();

// Instantiate repositories and services (Dependency Injection)
const complianceRepository = new PrismaComplianceRepository();
const routeRepository = new PrismaRouteRepository();
const complianceService = new ComplianceService(complianceRepository, routeRepository);
const bankingService = new BankingService(complianceRepository, complianceService);

// GET /api/banking/records?shipId=...&year=...
router.get('/records', async (req, res) => {
  try {
    const { shipId, year } = req.query;
    if (!shipId || !year) {
      return res.status(400).json({ message: 'shipId and year queries are required' });
    }
    const records = await bankingService.getBankingRecords(shipId as string, parseInt(year as string));
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching banking records', error });
  }
});

// POST /api/banking/bank
router.post('/bank', async (req, res) => {
  try {
    const { shipId, year, amount } = req.body;
    if (!shipId || !year || !amount) {
      return res.status(400).json({ message: 'shipId, year, and amount are required' });
    }
    const compliance = await bankingService.bankSurplus(shipId, year, amount);
    res.json(compliance);
  } catch (error) {
    res.status(500).json({ message: 'Error banking surplus', error: (error as Error).message });
  }
});

// POST /api/banking/apply
router.post('/apply', async (req, res) => {
  try {
    const { shipId, year, amount } = req.body;
    if (!shipId || !year || !amount) {
      return res.status(400).json({ message: 'shipId, year, and amount are required' });
    }
    const compliance = await bankingService.applyDeficit(shipId, year, amount);
    res.json(compliance);
  } catch (error) {
    res.status(500).json({ message: 'Error applying deficit', error: (error as Error).message });
  }
});

export default router;