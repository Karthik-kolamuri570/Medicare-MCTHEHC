# Medicare-MC: Critical Production Fixes (Code Examples)

## 🔴 PRIORITY 1: Security Headers & Hardening

### File: backend/app.js
Add this after CORS configuration:

```javascript
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

// Security Headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https:", "https://medicare-k.s3.ap-south-1.amazonaws.com"],
      connectSrc: ["'self'", "https://api.stripe.com", "https://stream-io.com"],
      fontSrc: ["'self'", "https://fonts.googleapis.com"],
      frameSrc: ["'self'", "https://js.stripe.com"],
      mediaSrc: ["'self'"],
      objectSrc: ["'none'"]
    }
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  frameguard: { action: 'deny' }
}));

// Data Sanitization
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(hpp()); // Prevent HTTP Parameter Pollution

// HTTPS Redirect (for production)
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      return res.redirect(`https://${req.header('host')}${req.url}`);
    }
    next();
  });
}
```

**Install packages**:
```bash
npm install helmet express-mongo-sanitize hpp
```

---

## 🔴 PRIORITY 2: Rate Limiting on Auth Routes

### File: backend/routes/patientRoutes.js
```javascript
const { authLimiter } = require('../middleware/rateLimit');

// Apply rate limiter to sensitive endpoints
router.post('/register', authLimiter, patientUploadProfile, patientController.registerPatient);
router.post('/login', authLimiter, patientController.loginPatient);
router.post('/forgot-password', authLimiter, patientController.forgotPassword);
router.post('/reset-password', authLimiter, patientController.resetPassword);
```

### File: backend/routes/doctorRoutes.js
```javascript
const { authLimiter } = require('../middleware/rateLimit');

router.post('/register', authLimiter, doctorController.uploadProfile, doctorController.registerDoctor);
router.post('/login', authLimiter, doctorController.loginDoctor);
router.post('/forgot-password', authLimiter, doctorController.forgotPassword);
router.post('/reset-password', authLimiter, doctorController.resetPassword);
```

### File: backend/routes/adminRoutes.js
```javascript
const { authLimiter } = require('../middleware/rateLimit');

router.post('/auth/login', authLimiter, adminController.login);
router.post('/auth/forgot-password', authLimiter, adminController.forgotPassword);
router.post('/auth/reset-password', authLimiter, adminController.resetPassword);
```

---

## 🔴 PRIORITY 3: Socket.io JWT Authentication

### File: backend/app.js
Replace the Socket.io connection handler:

```javascript
const { verifyToken, extractToken } = require('./utils/jwt');

// Socket.io Authentication Middleware
io.use(async (socket, next) => {
  try {
    // Get token from auth or query
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    // Verify token
    const decoded = verifyToken(token);
    
    // Attach user info to socket
    socket.userId = decoded.id;
    socket.userRole = decoded.role;
    
    next();
  } catch (err) {
    console.error('Socket authentication error:', err.message);
    next(new Error('Authentication error: Invalid token'));
  }
});

// Socket.io Connection Handler
io.on('connection', (socket) => {
  console.log(`User ${socket.userId} connected with role ${socket.userRole}`);

  // Join user's personal room (for notifications)
  socket.on('join', (userId) => {
    // Verify that the userId matches the authenticated socket user
    if (userId !== socket.userId.toString()) {
      console.warn(`Unauthorized join attempt: ${userId} vs ${socket.userId}`);
      socket.disconnect();
      return;
    }
    
    socket.join(userId);
    console.log(`User ${userId} joined their notification room`);
  });

  socket.on('disconnect', () => {
    console.log(`User ${socket.userId} disconnected`);
  });
});
```

### File: frontend/src/utils/socket.js
Update to pass token:

```javascript
import { io } from 'socket.io-client';

const SOCKET_URL = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
  ? 'http://127.0.0.1:1600'
  : window.location.origin;

const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
});

export const connectSocket = (userId) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.warn('No token available for socket connection');
    return;
  }

  if (!socket.connected) {
    // Pass token in auth
    socket.auth = { token };
    socket.connect();
    
    socket.on('connect', () => {
      console.log('Connected to socket server');
      if (userId) {
        socket.emit('join', userId);
      }
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  } else if (userId) {
    socket.emit('join', userId);
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;
```

---

## 🔴 PRIORITY 4: Input Validation with Joi

### File: backend/routes/patientRoutes.js
```javascript
const { celebrate, Joi, errors } = require('celebrate');

// Validation schemas
const registerSchema = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(100).trim(),
    email: Joi.string().email().required().lowercase(),
    password: Joi.string().required().min(8).max(50),
    contact: Joi.string().regex(/^\d{10}$/).required(),
    age: Joi.number().integer().min(1).max(150).required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    address: Joi.string().required().min(5).max(500).trim()
  })
});

const loginSchema = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().lowercase(),
    password: Joi.string().required()
  })
});

const bookAppointmentSchema = celebrate({
  body: Joi.object().keys({
    doctorId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
    problem: Joi.string().required().min(5).max(500).trim(),
    date: Joi.string().required().regex(/^\d{4}-\d{2}-\d{2}$/),
    time: Joi.string().required().regex(/^\d{2}:\d{2}$/)
  })
});

// Apply validation to routes
router.post('/register', registerSchema, patientUploadProfile, patientController.registerPatient);
router.post('/login', loginSchema, patientController.loginPatient);
router.post('/book-appointment', bookAppointmentSchema, auth.patientAuth, patientController.bookAppointment);

// Error handling middleware (add at end of app.js)
app.use(errors());
```

**Install**:
```bash
npm install joi celebrate
```

---

## 🔴 PRIORITY 5: Structured Logging

### File: backend/utils/logger.js (Create new file)
```javascript
const winston = require('winston');
const path = require('path');

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'medicare-api' },
  transports: [
    // Error logs
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Combined logs
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/combined.log'),
      maxsize: 5242880,
      maxFiles: 5
    })
  ]
});

// Console output in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(({ level, message, timestamp, ...meta }) => {
        return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
      })
    )
  }));
}

module.exports = logger;
```

### File: backend/app.js (Use logger)
```javascript
const logger = require('./utils/logger');

// Log requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// Log errors
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});
```

**Install**:
```bash
npm install winston
mkdir -p backend/logs
```

---

## 🔴 PRIORITY 6: Error Tracking with Sentry

### File: backend/app.js (Add at top)
```javascript
const Sentry = require('@sentry/node');

// Initialize Sentry
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express({ app: true, request: true })
    ]
  });

  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
}

// ... rest of app setup ...

// Add error handler at the end
if (process.env.SENTRY_DSN) {
  app.use(Sentry.Handlers.errorHandler());
}
```

**Install**:
```bash
npm install @sentry/node
```

**Add to Vercel environment variables**:
```
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

---

## 🔴 PRIORITY 7: Health Check Endpoint

### File: backend/app.js (Add before routes)
```javascript
// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbStatus,
      environment: process.env.NODE_ENV
    });
  } catch (err) {
    res.status(503).json({
      status: 'error',
      message: 'Service unavailable',
      error: err.message
    });
  }
});
```

---

## 🔴 PRIORITY 8: Environment Validation

### File: backend/app.js (Add at startup)
```javascript
// Validate required environment variables
const requiredEnvVars = [
  'MONGO_URI',
  'JWT_SECRET',
  'STRIPE_SECRET_KEY',
  'STREAM_API_KEY',
  'STREAM_API_SECRET',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_BUCKET_NAME',
  'SMTP_HOST',
  'SMTP_USERNAME',
  'SMTP_PASSWORD'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

console.log('✅ All required environment variables are set');
```

---

## 🔴 PRIORITY 9: Database Connection Error Handling

### File: backend/app.js (Update MongoDB connection)
```javascript
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
})
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    
    if (require.main === module) {
      server.listen(PORT, () => {
        console.log(`🚀 Server running on PORT: ${PORT}`);
      });
    }
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

// Handle connection errors after initial connection
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
  logger.error('Database connection error', { error: err.message });
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected');
});
```

---

## 🔴 PRIORITY 10: Graceful Shutdown

### File: backend/app.js (Add at end)
```javascript
// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  
  server.close(async () => {
    console.log('HTTP server closed');
    
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    } catch (err) {
      console.error('Error closing MongoDB:', err);
    }
    
    process.exit(0);
  });

  // Force shutdown after 30 seconds
  setTimeout(() => {
    console.error('Forced shutdown after 30 seconds');
    process.exit(1);
  }, 30000);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  
  server.close(async () => {
    console.log('HTTP server closed');
    
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    } catch (err) {
      console.error('Error closing MongoDB:', err);
    }
    
    process.exit(0);
  });
});
```

---

## 📋 IMPLEMENTATION ORDER

1. **Day 1**: Security headers, rate limiting, input validation
2. **Day 2**: Socket.io JWT auth, logging, error tracking
3. **Day 3**: Health check, env validation, graceful shutdown
4. **Day 4**: Testing and verification
5. **Day 5**: Deployment to staging

---

## ✅ VERIFICATION CHECKLIST

After implementing all fixes:

```bash
# 1. Check for security headers
curl -I https://your-domain.com/api/health

# 2. Test rate limiting
for i in {1..10}; do curl -X POST https://your-domain.com/api/patient/login; done

# 3. Test Socket.io auth
# Connect with token in auth

# 4. Check logs
tail -f backend/logs/combined.log

# 5. Verify health endpoint
curl https://your-domain.com/api/health

# 6. Run security audit
npm audit

# 7. Check for console logs
grep -r "console\." backend/controller --include="*.js"
```

---

**Total Implementation Time**: 2-3 days  
**Difficulty**: Medium  
**Impact**: Critical for production readiness
