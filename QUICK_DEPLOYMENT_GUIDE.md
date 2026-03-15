# Medicare-MC: Quick Production Deployment Guide

## 🚀 Pre-Deployment (Do This First!)

### Step 1: Rotate All Secrets
```bash
# 1. Generate new JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 2. Rotate MongoDB password in MongoDB Atlas
# 3. Rotate Stripe keys (get live keys, not test)
# 4. Rotate AWS IAM keys
# 5. Create new Gmail App Password for SMTP
# 6. Rotate Stream.io API secret
```

### Step 2: Remove Secrets from Git
```bash
# Remove .env from Git history
git rm --cached backend/.env frontend/.env
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Remove exposed secrets"
git push
```

### Step 3: Create .env.example (for documentation)
```bash
# backend/.env.example
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your-256-bit-secret-here
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

---

## 🔧 Backend Hardening (5 minutes)

### Install Security Packages
```bash
cd backend
npm install helmet express-mongo-sanitize hpp joi celebrate
```

### Update backend/app.js
```javascript
// Add after CORS setup
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.stripe.com"],
    }
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }
}));
app.use(mongoSanitize());
app.use(hpp());

// HTTPS redirect for production
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

### Apply Rate Limiting to Auth Routes
```javascript
// backend/routes/patientRoutes.js
const { authLimiter } = require('../middleware/rateLimit');

router.post('/login', authLimiter, patientController.loginPatient);
router.post('/forgot-password', authLimiter, patientController.forgotPassword);
router.post('/reset-password', authLimiter, patientController.resetPassword);

// Same for doctorRoutes.js
```

### Secure Socket.io
```javascript
// backend/app.js - Add before io.on('connection')
const { verifyToken } = require('./utils/jwt');

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Auth error'));
    
    const decoded = verifyToken(token);
    socket.userId = decoded.id;
    socket.userRole = decoded.role;
    next();
  } catch (err) {
    next(new Error('Auth error'));
  }
});

io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    if (userId !== socket.userId.toString()) {
      socket.disconnect();
      return;
    }
    socket.join(userId);
  });
});
```

---

## 🎨 Frontend Optimization (5 minutes)

### Update frontend/.env.production
```
VITE_API_URL=https://your-domain.com/api
VITE_STRIPE_PUBLIC_KEY=pk_live_xxx
VITE_STREAM_API_KEY=xxx
```

### Update frontend/src/utils/socket.js
```javascript
const token = localStorage.getItem('token');
const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
  auth: { token }
});
```

### Update frontend/vite.config.js
```javascript
export default {
  build: {
    minify: 'terser',
    terserOptions: {
      compress: { drop_console: true }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'stripe': ['@stripe/stripe-js']
        }
      }
    }
  }
}
```

---

## 📦 Vercel Deployment

### Step 1: Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select root directory: `.`

### Step 2: Configure Environment Variables
In Vercel Dashboard → Settings → Environment Variables, add:
```
MONGO_URI = (your production MongoDB URI)
JWT_SECRET = (your new 256-bit secret)
STRIPE_SECRET_KEY = sk_live_xxx
STRIPE_WEBHOOK_SECRET = whsec_xxx
STREAM_API_KEY = xxx
STREAM_API_SECRET = xxx
AWS_ACCESS_KEY_ID = xxx
AWS_SECRET_ACCESS_KEY = xxx
AWS_REGION = ap-south-1
AWS_BUCKET_NAME = medicare-k
FRONTEND_URL = https://your-domain.com
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USERNAME = your-email@gmail.com
SMTP_PASSWORD = app-password
SMTP_FROM_EMAIL = noreply@your-domain.com
SMTP_FROM_NAME = Medicare
NODE_ENV = production
```

### Step 3: Configure Build Settings
- **Framework**: Other
- **Build Command**: `cd frontend && npm run build`
- **Output Directory**: `frontend/dist`
- **Install Command**: `npm install && cd backend && npm install && cd ../frontend && npm install`

### Step 4: Deploy
```bash
git push origin main
# Vercel will automatically deploy
```

---

## ✅ Post-Deployment Verification

### Test All Critical Flows
```bash
# 1. Patient Registration
curl -X POST https://your-domain.com/api/patient/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"Test@123","contact":"9876543210","age":30,"gender":"male","address":"Test"}'

# 2. Doctor Login
curl -X POST https://your-domain.com/api/doctor/login \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor@example.com","password":"password"}'

# 3. Payment Checkout
curl -X POST https://your-domain.com/api/payment/check-out \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"appointmentId":"xxx","patientEmail":"patient@example.com"}'

# 4. Health Check
curl https://your-domain.com/api/me
```

### Verify Security Headers
```bash
curl -I https://your-domain.com
# Should see:
# Strict-Transport-Security: max-age=31536000
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# Content-Security-Policy: ...
```

### Monitor Logs
```bash
# Vercel Dashboard → Deployments → Logs
# Check for errors, warnings, and performance issues
```

---

## 🔐 Security Checklist (Before Going Live)

- [ ] All secrets rotated and in Vercel
- [ ] `.env` removed from Git
- [ ] Helmet security headers enabled
- [ ] Rate limiting on auth routes
- [ ] Socket.io JWT authentication
- [ ] HTTPS redirect configured
- [ ] MongoDB IP whitelist set (allow Vercel IPs only)
- [ ] S3 bucket private with presigned URLs
- [ ] Stripe webhook secret configured
- [ ] SMTP credentials updated
- [ ] All tests passing
- [ ] npm audit clean
- [ ] Monitoring configured (Sentry/New Relic)
- [ ] Backups enabled
- [ ] Privacy Policy published
- [ ] Terms of Service published

---

## 🚨 Troubleshooting

### Issue: "Cannot find module"
```bash
cd backend && npm install
cd ../frontend && npm install
```

### Issue: "MongoDB connection failed"
- Verify MONGO_URI in Vercel
- Check MongoDB Atlas IP whitelist (add Vercel IPs)
- Verify credentials are correct

### Issue: "Stripe payment fails"
- Verify STRIPE_SECRET_KEY is live key (sk_live_)
- Verify STRIPE_WEBHOOK_SECRET is set
- Check Stripe webhook endpoint configuration

### Issue: "Email not sending"
- Verify SMTP credentials
- Check Gmail App Password (not regular password)
- Verify 2FA enabled on Gmail
- Check email logs in Vercel

### Issue: "S3 upload fails"
- Verify AWS credentials
- Check S3 bucket name
- Verify IAM permissions
- Check bucket region

---

## 📞 Support & Monitoring

### Set Up Monitoring
1. **Uptime**: Uptime Robot (free tier)
2. **Errors**: Sentry (free tier)
3. **Performance**: New Relic (free tier)
4. **Logs**: Vercel built-in logs

### Create Status Page
- Use statuspage.io
- Link from your website
- Notify users of incidents

### Incident Response
1. Check Vercel logs
2. Check Sentry for errors
3. Check database connectivity
4. Rollback if necessary
5. Notify users

---

## 🔄 Maintenance Schedule

- **Daily**: Monitor logs and error rates
- **Weekly**: Review performance metrics
- **Monthly**: Security audit and dependency updates
- **Quarterly**: Full system review and optimization

---

**Deployment Date**: ___________  
**Deployed By**: ___________  
**Status**: ___________  
**Notes**: ___________
