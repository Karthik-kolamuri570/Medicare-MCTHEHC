const express = require("express");
const dotEnv = require("dotenv");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const { StreamChat } = require('stream-chat');
const http = require('http');
const { Server } = require('socket.io');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const Sentry = require('@sentry/node');
const logger = require('./utils/logger');
const { verifyToken } = require('./utils/jwt');
const cookieParser = require('cookie-parser');

// Configure dotenv (triggered auto-restart)
dotEnv.config();

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

// Initialize Sentry (if DSN is provided)
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

// Stripe webhook needs raw body BEFORE express.json() parses it
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

app.use(express.json()); // to parse the incoming request with JSON payloads
app.use(cookieParser()); // to parse cookies
app.use(bodyParser.urlencoded({ extended: true }));
// app.set("view engine", "pug");
// app.set("views", path.join(__dirname, "views"));


// app.use(cors({
//   origin: [
//     "http://localhost:5173",
//     "http://127.0.0.1:5173",
//     /\.vercel\.app$/, // Allow Vercel preview deployments
//     process.env.FRONTEND_URL // Future production URL
//   ].filter(Boolean),
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));



app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    // Allow all localhost variants and LAN IPs in development
    if (process.env.NODE_ENV !== 'production') return callback(null, true);
    // Production whitelist
    const allowed = [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    if (allowed.includes(origin) || /\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


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

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      /\.vercel\.app$/,
      process.env.FRONTEND_URL
    ].filter(Boolean),
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Socket.io Authentication Middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const decoded = verifyToken(token);
    
    socket.userId = decoded.id;
    socket.userRole = decoded.role;
    
    next();
  } catch (err) {
    logger.error('Socket authentication error', { error: err.message });
    next(new Error('Authentication error: Invalid token'));
  }
});

// Socket.io Connection Handler
io.on('connection', (socket) => {
  logger.info(`User ${socket.userId} connected with role ${socket.userRole}`);

  socket.on('join', (userId) => {
    if (userId !== socket.userId.toString()) {
      logger.warn(`Unauthorized join attempt: ${userId} vs ${socket.userId}`);
      socket.disconnect();
      return;
    }
    
    // Only join if not already in the room (prevents duplicate logs)
    if (!socket.rooms.has(userId)) {
      socket.join(userId);
      logger.info(`User ${userId} joined their notification room`);
    }
  });

  socket.on('disconnect', () => {
    logger.info(`User ${socket.userId} disconnected`);
  });
});

// Make io accessible to routers
app.set('socketio', io);

const { startReminderScheduler } = require('./utils/reminderScheduler');

const PORT = process.env.PORT || 1600;
mongoose.connect(process.env.MONGO_URI)
  .then(async (result) => {
    // Only start the server if we are running the script directly
    if (require.main === module) {
      server.listen(PORT, () => {
        console.log(`Server is running on PORT: ${PORT}`);
      });
      // Start the appointment reminder scheduler
      startReminderScheduler();
    }
    console.log("Data Base is connected... ");
  })
  .catch(err => console.log(err));



const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const paymentRoutes = require('./routes/payment');
const BloodBankUserRoutes = require('./blood_bank/routes/userRoutes');
const BloodBankRoutes = require('./blood_bank/routes/bankRoute');
const BloodCampRoutes = require('./blood_bank/routes/bloodCamp');
const BlogRoutes = require('./Blogs/routes/BlogRoutes');
const AdminRoutes = require('./routes/adminRoutes');

const { globalLimiter, paymentLimiter } = require('./middleware/rateLimit');

// --- STREAM CHAT API (Moved above globalLimiter to avoid 429 Too Many Requests) ---
const streamApiKey = process.env.STREAM_API_KEY;
const streamApiSecret = process.env.STREAM_API_SECRET;
const streamClient = StreamChat.getInstance(streamApiKey, streamApiSecret);

app.get('/api/stream/token', async (req, res) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const decoded = verifyToken(token);
    const userId = decoded.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const streamToken = streamClient.createToken(userId.toString());
    return res.json({ token: streamToken, userId: userId.toString(), apiKey: streamApiKey });
  } catch (err) {
    if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    console.error("Stream Token Generation Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/api/stream/upsert-users', async (req, res) => {
  try {
    let { users } = req.body;

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ error: 'Users array is required' });
    }

    console.log("Upserting users:", users);

    const formattedUsers = users.map(user => {
      console.log("Processing user:", user.id);
      if (!user || !user.id) throw new Error("User object missing `id`");
      return {
        id: user.id.toString(),
      };
    });

    await streamClient.upsertUsers(formattedUsers);

    return res.status(200).json({ message: 'Users upserted successfully' });
  } catch (err) {
    console.error('Upsert Error:', err);
    return res.status(500).json({ error: 'Failed to upsert users', details: err.message });
  }
});
// ---------------------------------------------------------------------------------

// Apply global rate limiting to all API routes
app.use('/api', globalLimiter);

app.use('/api/patient', patientRoutes);

app.use('/api/doctor', doctorRoutes);

app.use('/api/payment', paymentLimiter, paymentRoutes);

app.use('/api/blood-bank', BloodBankRoutes);

app.use('/api/blood-bank-user', BloodBankUserRoutes);

app.use('/api/blood-camp', BloodCampRoutes);

app.use('/api/blogs', BlogRoutes);

app.use('/api/admin', AdminRoutes);



// Serving static files
const os = require('os');
const isVercel = process.env.VERCEL || process.env.NODE_ENV === 'production';
if (isVercel) {
  app.use('/uploads', express.static(path.join(os.tmpdir(), 'uploads')));
} else {
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
}

const auth = require('./middleware/auth');

const { extractToken } = require('./utils/jwt');
const { generatePresignedUrl } = require('./utils/s3Config');
const Doctor = require('./models/doctor')
const Patient = require('./models/patient');

app.get('/api/me', async (req, res) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = verifyToken(token);

    if (decoded.role === 'doctor') {
      const doctor = await Doctor.findById(decoded.id);
      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }
      return res.json({
        role: "doctor",
        userId: doctor._id.toString(),
        name: doctor.fullname || doctor.name || "Doctor",
        profileImage: doctor.profileImage ? await generatePresignedUrl(doctor.profileImage) : null
      });
    }

    if (decoded.role === 'patient') {
      const patient = await Patient.findById(decoded.id);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      return res.json({
        role: "patient",
        userId: patient._id.toString(),
        name: patient.fullname || patient.name || "Patient",
        profileImage: patient.profileImage ? await generatePresignedUrl(patient.profileImage) : null
      });
    }

    return res.status(401).json({ message: "Invalid token role" });
  } catch (error) {
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    console.error("Error in /me route:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Centralized Token Refresh Route
app.post('/api/auth/refresh', (req, res) => {
  try {
    const { verifyRefreshToken, generateAccessToken, generateRefreshToken } = require('./utils/jwt');
    
    // 1. Get refresh token from request body
    const refreshToken = req.body?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'Refresh token not found' });
    }

    // 2. Verify token
    const decoded = verifyRefreshToken(refreshToken);

    // 3. Generate new tokens
    const tokenPayload = { id: decoded.id, role: decoded.role };
    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    res.json({
      success: true,
      token: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
  }
});

// Secure S3 Presigned URL Upload Route
app.post('/api/s3/presign', async (req, res) => {
  try {
    const { extractToken, verifyToken } = require('./utils/jwt');
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    // Verify token to ensure user is logged in
    verifyToken(token);

    const { fileName, fileType } = req.body;
    if (!fileName || !fileType) {
      return res.status(400).json({ success: false, message: 'fileName and fileType are required' });
    }

    const { generatePresignedPutUrl } = require('./utils/s3Config');
    
    // Generate secure unique S3 Key
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.]/g, '_');
    const key = `client-uploads/${uniqueSuffix}-${cleanFileName}`;

    // Get signed URL to upload directly from the frontend
    const uploadUrl = await generatePresignedPutUrl(key, fileType);
    
    // The final S3 key or location that will be stored in database
    const fileUrl = key; // Store the relative S3 key in the DB

    res.json({
      success: true,
      uploadUrl,
      fileUrl,
      key
    });
  } catch (error) {
    console.error('S3 presign error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate upload signature' });
  }
});

// Legacy Redirect: If someone clicks an old /api/video-call link from chat, redirect to frontend
app.get('/api/video-call/:id', (req, res) => {
  res.redirect(`/video-call/${req.params.id}`);
});

// Stream API routes are moved up, before global rate limiting.

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbStatus,
      environment: process.env.NODE_ENV
    });
  } catch (err) {
    logger.error('Health check error', { error: err.message });
    res.status(503).json({
      status: 'error',
      message: 'Service unavailable',
      error: err.message
    });
  }
});

// Global error handling middleware
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

// Sentry error handler (if enabled)
if (process.env.SENTRY_DSN) {
  app.use(Sentry.Handlers.errorHandler());
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  
  server.close(async () => {
    logger.info('HTTP server closed');
    
    try {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed');
    } catch (err) {
      logger.error('Error closing MongoDB', { error: err.message });
    }
    
    process.exit(0);
  });

  // Force shutdown after 30 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after 30 seconds');
    process.exit(1);
  }, 30000);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully...');
  
  server.close(async () => {
    logger.info('HTTP server closed');
    
    try {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed');
    } catch (err) {
      logger.error('Error closing MongoDB', { error: err.message });
    }
    
    process.exit(0);
  });
});

module.exports = app;
