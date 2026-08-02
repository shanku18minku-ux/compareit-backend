const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

const searchRoutes = require('./routes/search');
const dbRoutes = require('./routes/database');
const authRoutes = require('./routes/auth');
const app = express();
const PORT = process.env.PORT || 5000;

// Trust the first proxy hop (required for correct IP detection on Render/Heroku/Nginx)
// Without this, rate limiting uses the proxy IP and will block ALL traffic when limit is hit
app.set('trust proxy', 1);

// 1. Security Headers
app.use(helmet());

// 2. Response Compression (Gzip)
app.use(compression());

// 3. Request Logging
// In production, log only standard combined format. In dev, use shorter format.
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// 4. Rate Limiting (Protects against DDoS and brute force)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
});

// Apply rate limiter to all /api/ routes
app.use('/api/', apiLimiter);

// 5. CORS Configuration for Production
const allowedOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())  // trim() prevents whitespace CORS failures
  : ['http://localhost:5173', 'http://localhost:3000', 'capacitor://localhost', 'http://localhost'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parser
app.use(express.json({ limit: '1mb' })); // Prevent huge JSON payload attacks

// Routes
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/db', dbRoutes);
app.use('/api/v1/auth', authRoutes);

// Enhanced Health Check Endpoint
app.get('/health', (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    memoryUsage: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development'
  };
  try {
    res.status(200).json(healthCheck);
  } catch (error) {
    healthCheck.message = error;
    res.status(503).json(healthCheck);
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error]', err.stack);
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.status(err.status || 500).json({
    error: isProduction ? 'Internal Server Error' : err.message,
    ...(isProduction ? {} : { stack: err.stack })
  });
});

app.listen(PORT, () => {
  console.log(`Backend Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
