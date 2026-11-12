require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const seed = require('./seed');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 4000;

// the frontend origin - set this in .env when the app is deployed
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: corsOrigin }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/tasks', taskRoutes);

connectDB()
  .then(seed)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start the API:', err.message);
    process.exit(1);
  });
