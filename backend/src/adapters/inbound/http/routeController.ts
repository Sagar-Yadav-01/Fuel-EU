import { Router } from 'express';
import { RouteService } from '@/core/application/RouteService';
import { PrismaRouteRepository } from '@/adapters/outbound/postgres/PrismaRouteRepository';

const router = Router();

// Instantiate repository and service (Dependency Injection)
const routeRepository = new PrismaRouteRepository();
const routeService = new RouteService(routeRepository);

// GET /api/routes
router.get('/', async (req, res) => {
  try {
    const routes = await routeService.getAllRoutes();
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching routes', error });
  }
});

// POST /api/routes/:routeId/baseline
router.post('/:routeId/baseline', async (req, res) => {
  try {
    const { routeId } = req.params;
    const baselineRoute = await routeService.setBaseline(routeId);
    res.json(baselineRoute);
  } catch (error) {
    res.status(500).json({ message: 'Error setting baseline', error });
  }
});

// GET /api/routes/comparison
router.get('/comparison', async (req, res) => {
  try {
    // Using default ship/year for demo
    const shipId = (req.query.shipId as string) || 'S001';
    const year = req.query.year ? parseInt(req.query.year as string) : 2025;
    
    const comparisonData = await routeService.getComparisonData(shipId, year);
    res.json(comparisonData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comparison data', error });
  }
});

export default router;