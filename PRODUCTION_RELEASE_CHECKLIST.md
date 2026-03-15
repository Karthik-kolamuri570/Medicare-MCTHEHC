# Medicare-MC: Production Release Checklist

**Project**: Medicare-MC (Healthcare Management System)  
**Status**: Pre-Production  
**Last Updated**: 2025  
**Target Deployment**: Vercel (Frontend + Backend)

---

## 🔴 CRITICAL SECURITY ISSUES (Fix Before Release)

### 1. **Exposed Secrets in Repository**
- **Status**: ⚠️ CRITICAL
- **Issue**: `.env` file committed to Git with real credentials (MongoDB, Stripe, AWS, SMTP, Stream.io)
- **Impact**: Anyone with repo access can access production databases, payment systems, and cloud storage
- **Action Required**:
  ```bash
  # 1. Immediately rotate ALL credentials:
  - MongoDB password
  - Stripe API keys (revoke old, generate new)
  - AWS access keys (revoke old, generate new)
  - Stream.io API secret
  - SMTP password
  - JWT_SECRET
  
  # 2. Remove .env from Git history:
  git rm --cached backend/.env
  git rm --cached frontend/.env
  echo ".env" >> .gitignore
  git add .gitignore
  git commit -m "Remove exposed secrets from repo"
  git push
  
  # 3. Use Vercel Secrets Management:
  - Go to Vercel Dashboard > Project Settings > Environment Variables
  - Add all secrets there (never commit .env to production)
  
  # 4. Audit Git history:
  git log --all --full-history -- backend/.env
  # If secrets were exposed, consider rotating credentials again
  ```

### 2. **Weak JWT Secret**
- **Status**: ⚠️ CRITICAL
- **Current**: `pJDdvFAUWKbaWEZPhbFx4dkXP2nTQKi+yXVSdqeJFMM=` (exposed in repo)
- **Action Required**:
  ```bash
  # Generate a strong JWT secret (256-bit):
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  # Output: <use this as JWT_SECRET in Vercel>
  ```

### 3. **Hardcoded SMTP Credentials**
- **Status**: ⚠️ CRITICAL
- **Issue**: Gmail app password exposed in `.env`
- **Action Required**:
  - Create a dedicated Gmail account for production (not personal)
  - Enable 2FA on Gmail
  - Generate a new App Password
  - Store in Vercel secrets only

### 4. **AWS S3 Keys Exposed**
- **Status**: ⚠️ CRITICAL
- **Issue**: AWS access keys in `.env` allow full S3 bucket access
- **Action Required**:
  ```bash
  # 1. Revoke current keys in AWS IAM
  # 2. Create new IAM user with S3-only permissions:
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject"
        ],
        "Resource": "arn:aws:s3:::medicare-k/*"
      }
    ]
  }
  # 3. Generate new access keys
  # 4. Store in Vercel secrets
  ```

### 5. **MongoDB Connection String Exposed**
- **Status**: ⚠️ CRITICAL
- **Issue**: Full MongoDB URI with credentials in `.env`
- **Action Required**:
  - Change MongoDB password immediately
  - Create a new database user with limited permissions
  - Use IP whitelist in MongoDB Atlas (allow only Vercel IPs)
  - Store new URI in Vercel secrets

### 6. **Stripe Test Keys in Production**
- **Status**: ⚠️ HIGH
- **Issue**: Using `sk_test_*` keys (test mode) for production
- **Action Required**:
  - Switch to live Stripe keys (`sk_live_*`)
  - Set `STRIPE_WEBHOOK_SECRET` in Vercel (currently missing)
  - Test webhook signature verification in production

---

## 🟡 HIGH-PRIORITY SECURITY HARDENING

### 7. **Add HTTP Security Headers**
- **Status**: ⚠️ HIGH
- **File**: `backend/app.js`
- **Action Required**:
  ```javascript
  const helmet = require('helmet');
  const mongoSanitize = require('express-mongo-sanitize');
  const hpp = require('hpp');
  
  // Add after CORS
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com", "https://cdn.jsdelivr.net"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:", "https://medicare-k.s3.ap-south-1.amazonaws.com"],
        connectSrc: ["'self'", "https://api.stripe.com", "https://stream-io.com"],
        fontSrc: ["'self'", "https://fonts.googleapis.com"],
        frameSrc: ["'self'", "https://js.stripe.com"]
      }
    },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
  }));
  app.use(mongoSanitize());
  app.use(hpp());
  ```
- **Install**: `npm install helmet express-mongo-sanitize hpp`

### 8. **Apply Rate Limiting to Auth Routes**
- **Status**: ⚠️ HIGH
- **File**: `backend/routes/patientRoutes.js`, `backend/routes/doctorRoutes.js`
- **Action Required**:
  ```javascript
  const { authLimiter } = require('../middleware/rateLimit');
  
  router.post('/login', authLimiter, patientController.loginPatient);
  router.post('/forgot-password', authLimiter, patientController.forgotPassword);
  router.post('/reset-password', authLimiter, patientController.resetPassword);
  ```

### 9. **Secure Socket.io with JWT Authentication**
- **Status**: ⚠️ HIGH
- **File**: `backend/app.js`
- **Action Required**:
  ```javascript
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      if (!token) return next(new Error('Authentication error'));
      
      const decoded = verifyToken(token);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });
  
  io.on('connection', (socket) => {
    socket.on('join', (userId) => {
      // Verify userId matches authenticated socket.userId
      if (userId !== socket.userId.toString()) {
        socket.disconnect();
        return;
      }
      socket.join(userId);
    });
  });
  ```
- **Frontend Update** (`frontend/src/utils/socket.js`):
  ```javascript
  const token = localStorage.getItem('token');
  const socket = io(SOCKET_URL, {
    autoConnect: false,
    withCredentials: true,
    auth: { token }
  });
  ```

### 10. **Implement HTTPS Redirect**
- **Status**: ⚠️ HIGH
- **File**: `backend/app.js`
- **Action Required**:
  ```javascript
  // Add before routes
  if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
      if (req.header('x-forwarded-proto') !== 'https') {
        res.redirect(`https://${req.header('host')}${req.url}`);
      } else {
        next();
      }
    });
  }
  ```

### 11. **Add CSRF Protection for Cookies**
- **Status**: ⚠️ MEDIUM (if using cookies)
- **Note**: Currently using localStorage for tokens (acceptable but less secure)
- **Future**: Migrate to HttpOnly cookies + CSRF tokens

### 12. **Validate and Sanitize All Inputs**
- **Status**: ⚠️ HIGH
- **Install**: `npm install joi celebrate`
- **Example** (`backend/routes/patientRoutes.js`):
  ```javascript
  const { celebrate, Joi, errors } = require('celebrate');
  
  router.post('/register', celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(100),
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8),
      contact: Joi.string().regex(/^\d{10}$/).required(),
      age: Joi.number().min(1).max(150).required(),
      gender: Joi.string().valid('male', 'female', 'other').required(),
      address: Joi.string().required().min(5)
    })
  }), patientController.registerPatient);
  
  app.use(errors());
  ```

---

## 🟢 DEPLOYMENT & INFRASTRUCTURE

### 13. **Environment Configuration**
- **Status**: ⚠️ HIGH
- **Action Required**:
  ```bash
  # Create .env.example (commit to repo, no secrets):
  MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
  JWT_SECRET=your-secret-here
  STRIPE_SECRET_KEY=sk_live_xxx
  STRIPE_WEBHOOK_SECRET=whsec_xxx
  STREAM_API_KEY=xxx
  STREAM_API_SECRET=xxx
  AWS_ACCESS_KEY_ID=xxx
  AWS_SECRET_ACCESS_KEY=xxx
  AWS_REGION=ap-south-1
  AWS_BUCKET_NAME=medicare-k
  FRONTEND_URL=https://your-domain.com
  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=587
  SMTP_USERNAME=your-email@gmail.com
  SMTP_PASSWORD=app-password
  SMTP_FROM_EMAIL=noreply@your-domain.com
  SMTP_FROM_NAME=Medicare
  NODE_ENV=production
  PORT=1600
  ```

### 14. **Vercel Deployment Configuration**
- **Status**: ⚠️ HIGH
- **File**: `vercel.json` (already exists, needs updates)
- **Action Required**:
  ```json
  {
    "version": 2,
    "env": {
      "MONGO_URI": "@mongo_uri",
      "JWT_SECRET": "@jwt_secret",
      "STRIPE_SECRET_KEY": "@stripe_secret_key",
      "STRIPE_WEBHOOK_SECRET": "@stripe_webhook_secret",
      "STREAM_API_KEY": "@stream_api_key",
      "STREAM_API_SECRET": "@stream_api_secret",
      "AWS_ACCESS_KEY_ID": "@aws_access_key_id",
      "AWS_SECRET_ACCESS_KEY": "@aws_secret_access_key",
      "AWS_REGION": "ap-south-1",
      "AWS_BUCKET_NAME": "medicare-k",
      "FRONTEND_URL": "@frontend_url",
      "SMTP_HOST": "smtp.gmail.com",
      "SMTP_PORT": "587",
      "SMTP_USERNAME": "@smtp_username",
      "SMTP_PASSWORD": "@smtp_password",
      "SMTP_FROM_EMAIL": "@smtp_from_email",
      "SMTP_FROM_NAME": "Medicare",
      "NODE_ENV": "production"
    },
    "builds": [
      {
        "src": "backend/app.js",
        "use": "@vercel/node",
        "config": { "maxLambdaSize": "50mb" }
      },
      {
        "src": "frontend/package.json",
        "use": "@vercel/static-build",
        "config": { "distDir": "dist" }
      }
    ],
    "routes": [
      { "src": "/api/(.*)", "dest": "backend/app.js" },
      { "src": "/((?!api/|.*\\.).*)", "dest": "/frontend/index.html" },
      { "src": "/(.*)", "dest": "frontend/$1" }
    ]
  }
  ```

### 15. **Database Optimization**
- **Status**: ⚠️ MEDIUM
- **Action Required**:
  ```javascript
  // Ensure all indexes are created in MongoDB:
  // backend/models/doctor.js - Already has indexes ✓
  // backend/models/patient.js - Add indexes:
  patientSchema.index({ email: 1 });
  patientSchema.index({ createdAt: -1 });
  
  // backend/models/appointments.js - Already has indexes ✓
  
  // Add TTL index for password reset tokens:
  doctorSchema.index({ resetPasswordExpires: 1 }, { expireAfterSeconds: 0 });
  patientSchema.index({ resetPasswordExpires: 1 }, { expireAfterSeconds: 0 });
  ```

### 16. **Logging & Monitoring**
- **Status**: ⚠️ MEDIUM
- **Install**: `npm install winston pino`
- **Action Required**:
  ```javascript
  // backend/utils/logger.js
  const winston = require('winston');
  
  const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' })
    ]
  });
  
  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple()
    }));
  }
  
  module.exports = logger;
  ```

### 17. **Error Handling & Monitoring**
- **Status**: ⚠️ MEDIUM
- **Install**: `npm install @sentry/node`
- **Action Required**:
  ```javascript
  // backend/app.js
  const Sentry = require('@sentry/node');
  
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0
  });
  
  app.use(Sentry.Handlers.requestHandler());
  // ... routes ...
  app.use(Sentry.Handlers.errorHandler());
  ```

---

## 🟢 FRONTEND OPTIMIZATION

### 18. **Build Optimization**
- **Status**: ⚠️ MEDIUM
- **File**: `frontend/vite.config.js`
- **Action Required**:
  ```javascript
  export default {
    build: {
      minify: 'terser',
      terserOptions: {
        compress: { drop_console: true },
        output: { comments: false }
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['react', 'react-dom'],
            'ui': ['@mui/material', '@radix-ui/react-dialog'],
            'stripe': ['@stripe/stripe-js'],
            'stream': ['stream-chat', 'stream-chat-react']
          }
        }
      }
    }
  }
  ```

### 19. **Content Security Policy (CSP)**
- **Status**: ⚠️ MEDIUM
- **File**: `frontend/vercel.json` or `frontend/nginx.conf`
- **Action Required**:
  ```json
  {
    "headers": [
      {
        "key": "Content-Security-Policy",
        "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.stripe.com https://stream-io.com; font-src 'self' https://fonts.googleapis.com; frame-src 'self' https://js.stripe.com"
      },
      {
        "key": "X-Content-Type-Options",
        "value": "nosniff"
      },
      {
        "key": "X-Frame-Options",
        "value": "DENY"
      },
      {
        "key": "X-XSS-Protection",
        "value": "1; mode=block"
      },
      {
        "key": "Referrer-Policy",
        "value": "strict-origin-when-cross-origin"
      },
      {
        "key": "Strict-Transport-Security",
        "value": "max-age=31536000; includeSubDomains; preload"
      }
    ]
  }
  ```

### 20. **Environment Variables in Frontend**
- **Status**: ⚠️ HIGH
- **File**: `frontend/.env.production`
- **Action Required**:
  ```
  VITE_API_URL=https://your-domain.com/api
  VITE_STRIPE_PUBLIC_KEY=pk_live_xxx
  VITE_STREAM_API_KEY=xxx
  ```

### 21. **Remove Console Logs in Production**
- **Status**: ⚠️ MEDIUM
- **Action Required**:
  ```bash
  # Search for console.log in frontend:
  grep -r "console\." frontend/src --include="*.jsx" --include="*.js"
  
  # Remove or wrap in development check:
  if (process.env.NODE_ENV === 'development') {
    console.log('Debug info');
  }
  ```

---

## 🟢 TESTING & QA

### 22. **Unit & Integration Tests**
- **Status**: ⚠️ HIGH
- **Install**: `npm install --save-dev jest supertest`
- **Action Required**:
  ```bash
  # Create test files:
  backend/tests/auth.test.js
  backend/tests/appointments.test.js
  backend/tests/payments.test.js
  
  # Add to package.json:
  "test": "jest --coverage",
  "test:watch": "jest --watch"
  ```

### 23. **Security Testing**
- **Status**: ⚠️ HIGH
- **Action Required**:
  ```bash
  # Run OWASP ZAP or Snyk:
  npm install -g snyk
  snyk test
  
  # Check for vulnerable dependencies:
  npm audit
  npm audit fix
  ```

### 24. **Load Testing**
- **Status**: ⚠️ MEDIUM
- **Install**: `npm install -g artillery`
- **Action Required**:
  ```bash
  artillery quick --count 100 --num 10 https://your-domain.com/api/patient/me
  ```

### 25. **End-to-End Testing**
- **Status**: ⚠️ MEDIUM
- **Install**: `npm install --save-dev cypress`
- **Action Required**:
  ```bash
  # Create cypress tests for critical flows:
  - Patient registration & login
  - Doctor registration & approval
  - Appointment booking & payment
  - Second opinion workflow
  ```

---

## 🟢 COMPLIANCE & LEGAL

### 26. **Data Privacy & GDPR Compliance**
- **Status**: ⚠️ HIGH
- **Action Required**:
  - [ ] Add Privacy Policy page
  - [ ] Add Terms of Service page
  - [ ] Implement data export functionality
  - [ ] Implement data deletion functionality
  - [ ] Add cookie consent banner
  - [ ] Document data retention policies

### 27. **Healthcare Compliance (HIPAA/NDHM)**
- **Status**: ⚠️ CRITICAL (if handling PHI)
- **Action Required**:
  - [ ] Encrypt sensitive data at rest (S3 SSE-KMS)
  - [ ] Encrypt data in transit (TLS 1.3)
  - [ ] Implement audit logging for all PHI access
  - [ ] Add access controls and role-based permissions
  - [ ] Document data handling procedures
  - [ ] Conduct security audit by third party

### 28. **Payment Compliance (PCI-DSS)**
- **Status**: ⚠️ CRITICAL
- **Action Required**:
  - [ ] Never store credit card data (use Stripe tokenization)
  - [ ] Use HTTPS everywhere
  - [ ] Implement strong authentication
  - [ ] Maintain audit logs
  - [ ] Regular security testing

---

## 🟢 MONITORING & MAINTENANCE

### 29. **Uptime Monitoring**
- **Status**: ⚠️ MEDIUM
- **Action Required**:
  - [ ] Set up Uptime Robot or similar
  - [ ] Configure alerts for downtime
  - [ ] Monitor API response times
  - [ ] Set up health check endpoint: `GET /api/health`

### 30. **Backup & Disaster Recovery**
- **Status**: ⚠️ HIGH
- **Action Required**:
  ```bash
  # MongoDB Atlas automatic backups (enable in settings)
  # S3 versioning and lifecycle policies
  # Daily backup verification
  # Document recovery procedures
  ```

### 31. **Dependency Updates**
- **Status**: ⚠️ MEDIUM
- **Action Required**:
  ```bash
  # Set up Dependabot or Renovate
  # Monthly security audits
  # Quarterly dependency updates
  # Test after each update
  ```

### 32. **Performance Monitoring**
- **Status**: ⚠️ MEDIUM
- **Action Required**:
  - [ ] Set up New Relic or DataDog
  - [ ] Monitor database query performance
  - [ ] Track API response times
  - [ ] Monitor error rates
  - [ ] Set up alerts for anomalies

---

## 🟢 DOCUMENTATION

### 33. **API Documentation**
- **Status**: ⚠️ MEDIUM
- **Action Required**:
  ```bash
  # Install Swagger/OpenAPI:
  npm install swagger-ui-express swagger-jsdoc
  
  # Create backend/swagger.js
  # Document all endpoints with request/response examples
  # Endpoint: GET /api/docs
  ```

### 34. **Deployment Documentation**
- **Status**: ⚠️ MEDIUM
- **Action Required**:
  - [ ] Create DEPLOYMENT.md with step-by-step instructions
  - [ ] Document environment setup
  - [ ] Create runbooks for common issues
  - [ ] Document rollback procedures

### 35. **Architecture Documentation**
- **Status**: ⚠️ MEDIUM
- **Action Required**:
  - [ ] Create architecture diagrams
  - [ ] Document data flow
  - [ ] Document security architecture
  - [ ] Create system design document

---

## 🟢 PRE-LAUNCH CHECKLIST

### Final Verification (48 hours before launch)

- [ ] All secrets rotated and stored in Vercel
- [ ] `.env` removed from Git history
- [ ] Security headers configured
- [ ] Rate limiting enabled on auth routes
- [ ] Socket.io JWT authentication implemented
- [ ] HTTPS redirect configured
- [ ] Database indexes created
- [ ] Logging and monitoring set up
- [ ] Error handling with Sentry configured
- [ ] Frontend build optimized
- [ ] CSP headers configured
- [ ] All tests passing (unit, integration, e2e)
- [ ] Security audit completed (npm audit, Snyk)
- [ ] Load testing completed
- [ ] Backup and recovery tested
- [ ] Monitoring and alerts configured
- [ ] Documentation complete
- [ ] Privacy Policy and Terms of Service published
- [ ] HIPAA/NDHM compliance verified
- [ ] PCI-DSS compliance verified
- [ ] Staging environment tested
- [ ] Rollback plan documented
- [ ] Team trained on deployment and incident response

---

## 🟢 LAUNCH DAY CHECKLIST

1. **Pre-Launch (2 hours before)**
   - [ ] Final backup of production database
   - [ ] Verify all monitoring is active
   - [ ] Verify all alerts are configured
   - [ ] Team on standby

2. **Launch**
   - [ ] Deploy to Vercel
   - [ ] Verify all endpoints responding
   - [ ] Verify database connectivity
   - [ ] Verify payment processing (test transaction)
   - [ ] Verify email sending
   - [ ] Verify file uploads to S3
   - [ ] Verify Socket.io connections
   - [ ] Verify Stream.io video/chat

3. **Post-Launch (24 hours monitoring)**
   - [ ] Monitor error rates
   - [ ] Monitor response times
   - [ ] Monitor database performance
   - [ ] Monitor user registrations
   - [ ] Monitor payment transactions
   - [ ] Check logs for warnings/errors
   - [ ] Verify backups running

---

## 📞 INCIDENT RESPONSE

### Critical Issues (Immediate Action)
- Database down → Restore from backup
- Payment processing down → Disable checkout, notify users
- Security breach → Rotate credentials, notify users
- Data loss → Restore from backup

### Communication Plan
- [ ] Status page (statuspage.io)
- [ ] Email notifications to users
- [ ] Social media updates
- [ ] Support team briefing

---

## 📊 POST-LAUNCH METRICS

Track these KPIs:
- API uptime (target: 99.9%)
- Average response time (target: <200ms)
- Error rate (target: <0.1%)
- User registration rate
- Appointment booking rate
- Payment success rate
- Customer support tickets

---

## 🔄 CONTINUOUS IMPROVEMENT

- Weekly: Review logs and metrics
- Monthly: Security audit and dependency updates
- Quarterly: Performance optimization and feature planning
- Annually: Full security assessment and compliance audit

---

**Last Review**: 2025  
**Next Review**: Before each major release  
**Owner**: DevOps/Security Team
