import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routeController from '@/adapters/inbound/http/routeController';
import complianceController from '@/adapters/inbound/http/complianceController';
import bankingController from '@/adapters/inbound/http/bankingController';
import poolController from '@/adapters/inbound/http/poolController';

dotenv.config();

const app = express(); // Create the app instance

// Middleware
app.use(cors()); // Allow all origins for demo
  app.use(express.json()); // Parse JSON bodies

  // API Routes
  app.use('/api/routes', routeController);
  app.use('/api/compliance', complianceController);
  app.use('/api/banking', bankingController);
  app.use('/api/pools', poolController);

  // Health check
  app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

export default app; // Export the configured app instance