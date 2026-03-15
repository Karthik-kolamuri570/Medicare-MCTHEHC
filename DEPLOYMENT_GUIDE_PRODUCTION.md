# 🚀 DEPLOYMENT GUIDE - Medicare-MC Production Release

**Version**: 1.0.0  
**Date**: 2025  
**Status**: Production Ready

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### Security Verification (48 hours before)
- [ ] All secrets rotated and stored in Vercel
- [ ] `.env` removed from Git history
- [ ] Security headers configured and tested
- [ ] Rate limiting enabled on all auth routes
- [ ] Socket.io JWT authentication verified
- [ ] HTTPS redirect configured
- [ ] Database backups enabled
- [ ] S3 bucket private with presigned URLs

### Testing Verification
- [ ] All unit tests passing (npm run test:unit)
- [ ] All integration tests passing (npm run test:integration)
- [ ] Code coverage > 80%
- [ ] No security vulnerabilities (npm audit)
- [ ] Load testing completed
- [ ] Staging deployment successful

### Monitoring Verification
- [ ] Sentry configured and tested
- [ ] Health check endpoint responding
- [ ] Monitoring dashboards created
- [ ] Alerts configured and tested
- [ ] Log aggregation working
- [ ] Performance tracking enabled

### Documentation Verification
- [ ] API documentation complete (Swagger)
- [ ] Deployment guide reviewed
- [ ] Runbooks created
- [ ] Incident response plan ready
- [ ] Team trained on deployment

---

## 🔧 DEPLOYMENT STEPS

### Step 1: Pre-Deployment (2 hours before)

#### 1.1 Final Security Audit
```bash
# Run security audit
npm audit

# Check for vulnerabilities
snyk test

# Verify environment variables
node -e "console.log(process.env.JWT_SECRET ? '✓ JWT_SECRET set' : '✗ JWT_SECRET missing')"
```

#### 1.2 Final Testing
```bash
# Run all tests
npm test

# Generate coverage report
npm test -- --coverage

# Run security tests
npm run test:security
```

#### 1.3 Database Backup
```bash
# Backup MongoDB
mongodump --uri="$MONGO_URI" --out=./backups/pre-deployment-$(date +%Y%m%d-%H%M%S)

# Verify backup
ls -lh ./backups/
```

### Step 2: Staging Deployment (1 hour before)

#### 2.1 Deploy to Staging
```bash
# Push to staging branch
git push origin main:staging

# Vercel will automatically deploy to staging
# Monitor deployment at: https://staging.medicare-mc.vercel.app
```

#### 2.2 Verify Staging
```bash
# Test health endpoint
curl https://staging.medicare-mc.vercel.app/api/health

# Test security headers
curl -I https://staging.medicare-mc.vercel.app/api/health

# Run smoke tests
npm run test:smoke
```

#### 2.3 Monitor Staging (30 minutes)
- Check error rates in Sentry
- Monitor response times
- Verify database connectivity
- Test critical workflows

### Step 3: Production Deployment

#### 3.1 Deploy to Production
```bash
# Ensure main branch is up to date
git pull origin main

# Tag the release
git tag -a v1.0.0 -m "Production Release v1.0.0"

# Push to production
git push origin main
git push origin v1.0.0

# Vercel will automatically deploy to production
# Monitor deployment at: https://medicare-mc.vercel.app
```

#### 3.2 Verify Production
```bash
# Test health endpoint
curl https://medicare-mc.vercel.app/api/health

# Test security headers
curl -I https://medicare-mc.vercel.app/api/health

# Verify database connectivity
curl -H "Authorization: Bearer $TOKEN" https://medicare-mc.vercel.app/api/me
```

#### 3.3 Monitor Production (24 hours)
- Monitor error rates (target: < 0.1%)
- Monitor response times (target: < 500ms p95)
- Monitor uptime (target: > 99.9%)
- Check user registrations
- Verify payment processing
- Monitor security events

---

## 🔐 PRODUCTION ENVIRONMENT SETUP

### Vercel Environment Variables

```bash
# Database
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname

# JWT & Security
JWT_SECRET=<256-bit-secret>
NODE_ENV=production

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# AWS S3
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_REGION=ap-south-1
AWS_BUCKET_NAME=medicare-k

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=app-password
SMTP_FROM_EMAIL=noreply@medicare-mc.com
SMTP_FROM_NAME=Medicare-MC

# Stream.io
STREAM_API_KEY=xxx
STREAM_API_SECRET=xxx

# Frontend
FRONTEND_URL=https://medicare-mc.vercel.app

# Monitoring
SENTRY_DSN=https://xxx@sentry.io/xxx
NEW_RELIC_LICENSE_KEY=xxx (optional)

# Alerts
ALERT_EMAIL_ENABLED=true
ALERT_EMAIL_RECIPIENTS=admin@medicare-mc.com,ops@medicare-mc.com
SLACK_WEBHOOK_ENABLED=true
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx
```

---

## 📊 DEPLOYMENT VERIFICATION

### Health Checks
```bash
# API Health
curl https://medicare-mc.vercel.app/api/health

# Expected Response:
# {
#   "status": "ok",
#   "timestamp": "2025-01-15T10:30:00Z",
#   "uptime": 3600,
#   "database": "connected",
#   "environment": "production"
# }
```

### Security Verification
```bash
# Check security headers
curl -I https://medicare-mc.vercel.app/api/health

# Expected Headers:
# Strict-Transport-Security: max-age=31536000
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# Content-Security-Policy: ...
```

### Database Verification
```bash
# Test database connection
curl -H "Authorization: Bearer $TOKEN" \
  https://medicare-mc.vercel.app/api/patient/me

# Expected: 200 OK with patient data
```

---

## 🚨 ROLLBACK PROCEDURE

### If Issues Occur

#### Immediate Rollback (< 5 minutes)
```bash
# Revert to previous version
git revert HEAD
git push origin main

# Vercel will automatically redeploy previous version
```

#### Full Rollback (< 15 minutes)
```bash
# Checkout previous tag
git checkout v0.9.0

# Push to main
git push origin v0.9.0:main

# Vercel will deploy previous version
```

#### Database Rollback (if needed)
```bash
# Restore from backup
mongorestore --uri="$MONGO_URI" ./backups/pre-deployment-backup/
```

---

## 📈 POST-DEPLOYMENT MONITORING

### First Hour
- [ ] Monitor error rate (should be < 0.1%)
- [ ] Monitor response times (should be < 500ms)
- [ ] Check Sentry for new errors
- [ ] Verify user registrations working
- [ ] Test payment processing
- [ ] Monitor database performance

### First 24 Hours
- [ ] Monitor uptime (should be > 99.9%)
- [ ] Check for performance degradation
- [ ] Review security logs
- [ ] Verify all features working
- [ ] Monitor resource usage
- [ ] Check backup completion

### First Week
- [ ] Daily monitoring of metrics
- [ ] Weekly security audit
- [ ] Performance optimization
- [ ] User feedback collection
- [ ] Bug fix deployment if needed

---

## 🔄 CONTINUOUS DEPLOYMENT

### Automated Deployment Pipeline
```
1. Push to main branch
   ↓
2. GitHub Actions runs tests
   ↓
3. Tests pass → Deploy to staging
   ↓
4. Staging verification (30 min)
   ↓
5. Manual approval required
   ↓
6. Deploy to production
   ↓
7. Monitor for 24 hours
```

---

## 📞 INCIDENT RESPONSE

### Critical Issues (Immediate Action)
- Database down → Restore from backup
- Payment processing down → Disable checkout, notify users
- Security breach → Rotate credentials, notify users
- API down → Check logs, restart if needed

### Communication Plan
- [ ] Status page update
- [ ] Email notification to users
- [ ] Slack notification to team
- [ ] Support team briefing

---

## ✅ DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] All tests passing
- [ ] Security audit clean
- [ ] Backups created
- [ ] Monitoring configured
- [ ] Team notified

### Deployment
- [ ] Staging deployed successfully
- [ ] Staging verified (30 min)
- [ ] Production deployed successfully
- [ ] Production verified
- [ ] Monitoring active

### Post-Deployment
- [ ] Error rate < 0.1%
- [ ] Response time < 500ms
- [ ] Uptime > 99.9%
- [ ] All features working
- [ ] Users notified

---

## 🎯 SUCCESS CRITERIA

### Deployment Success
- ✅ Zero critical errors
- ✅ Error rate < 0.1%
- ✅ Response time < 500ms p95
- ✅ Uptime > 99.9%
- ✅ All features working
- ✅ Security headers present
- ✅ Database connected
- ✅ Payments processing

---

## 📞 SUPPORT CONTACTS

### On-Call Team
- **Lead**: [Name] - [Phone]
- **Backup**: [Name] - [Phone]
- **Database**: [Name] - [Phone]

### Escalation
- **Critical**: Page on-call engineer
- **High**: Email team lead
- **Medium**: Slack notification
- **Low**: Create ticket

---

**Deployment Date**: [To be filled]  
**Deployed By**: [To be filled]  
**Status**: [To be filled]  
**Notes**: [To be filled]

---

**Let's ship it! 🚀**
