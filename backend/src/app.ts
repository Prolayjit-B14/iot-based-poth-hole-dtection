import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.routes';

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Status
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    system: 'SmartRoad AI - IoT Pothole & Road Bump Detection Server',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes mount
app.use('/api', apiRoutes);

export default app;
