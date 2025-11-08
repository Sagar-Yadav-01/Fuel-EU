import app from './infrastructure/server/server'; // Import the default app instance

const port = process.env.PORT || 5000;

app.listen(port, () => { // Now 'app' is the defined express() instance
  console.log(`[SERVER] Backend server running at http://localhost:${port}`);
});