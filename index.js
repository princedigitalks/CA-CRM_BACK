const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());

app.use((req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  if (contentType.startsWith('multipart/form-data')) {
    return next();
  }
  return express.json({ limit: '1mb' })(req, res, next);
});

app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use((req, res, next) => {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000;

    console.log("-- response time --")
    console.log(
      `${req.method} ${req.originalUrl} → ${res.statusCode} | ${durationMs.toFixed(2)} ms`
    );
  });

  next();
});

app.use('/api', require('./routes/adminRoutes'));
app.use('/api', require('./routes/userRoutes'));
app.use('/api', require('./routes/generalSettingRoutes'));
app.use('/api', require('./routes/clientRoutes'));
app.use('/api', require('./routes/itrYearRoutes'));
app.use('/api', require('./routes/staffRoutes'));
app.use('/api/masters', require('./routes/masterRoutes'));
app.use('/api/whatsapp', require('./routes/whatsapp/api'))
app.use('/automation', require('./routes/automationRoutes/api'));

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server started on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to connect DB', err);
    process.exit(1);
  }
}

startServer();
