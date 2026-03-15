/**
 * Monitoring & Alerting Configuration
 * Integrates with Sentry, New Relic, and Uptime Robot
 */

const logger = require('./logger');

/**
 * Sentry Configuration
 * Error tracking and performance monitoring
 */
const sentryConfig = {
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  integrations: [
    new (require('@sentry/node')).Integrations.Http({ tracing: true }),
    new (require('@sentry/node')).Integrations.Express({ app: true, request: true })
  ],
  beforeSend(event, hint) {
    // Filter out certain errors
    if (event.exception) {
      const error = hint.originalException;
      if (error.message && error.message.includes('ECONNREFUSED')) {
        return null; // Don't send connection errors
      }
    }
    return event;
  }
};

/**
 * Performance Monitoring Thresholds
 */
const performanceThresholds = {
  apiResponseTime: 500, // ms
  databaseQueryTime: 1000, // ms
  errorRate: 1, // percentage
  cpuUsage: 80, // percentage
  memoryUsage: 85 // percentage
};

/**
 * Alert Configuration
 */
const alertConfig = {
  email: {
    enabled: process.env.ALERT_EMAIL_ENABLED === 'true',
    recipients: (process.env.ALERT_EMAIL_RECIPIENTS || '').split(','),
    subject: 'Medicare-MC Alert'
  },
  slack: {
    enabled: process.env.SLACK_WEBHOOK_ENABLED === 'true',
    webhookUrl: process.env.SLACK_WEBHOOK_URL,
    channel: '#alerts'
  },
  pagerduty: {
    enabled: process.env.PAGERDUTY_ENABLED === 'true',
    integrationKey: process.env.PAGERDUTY_INTEGRATION_KEY
  }
};

/**
 * Health Check Configuration
 */
const healthCheckConfig = {
  interval: 30000, // 30 seconds
  timeout: 5000, // 5 seconds
  checks: {
    database: true,
    redis: false, // Enable if using Redis
    externalAPIs: true
  }
};

/**
 * Metrics to Track
 */
const metricsConfig = {
  // API Metrics
  apiMetrics: {
    enabled: true,
    trackEndpoints: [
      '/api/patient/login',
      '/api/patient/register',
      '/api/doctor/login',
      '/api/payment/check-out',
      '/api/health'
    ]
  },

  // Database Metrics
  databaseMetrics: {
    enabled: true,
    trackQueries: true,
    slowQueryThreshold: 1000 // ms
  },

  // Business Metrics
  businessMetrics: {
    enabled: true,
    trackEvents: [
      'user_registration',
      'appointment_booking',
      'payment_completed',
      'doctor_verification'
    ]
  },

  // Security Metrics
  securityMetrics: {
    enabled: true,
    trackEvents: [
      'failed_login_attempt',
      'unauthorized_access',
      'invalid_token',
      'rate_limit_exceeded'
    ]
  }
};

/**
 * Logging Configuration
 */
const loggingConfig = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white'
  },
  format: {
    timestamp: 'YYYY-MM-DD HH:mm:ss',
    maxSize: '5m',
    maxFiles: 5
  }
};

/**
 * Initialize Monitoring
 */
function initializeMonitoring(app) {
  logger.info('Initializing monitoring and alerting...');

  // Initialize Sentry if DSN is provided
  if (sentryConfig.dsn) {
    const Sentry = require('@sentry/node');
    Sentry.init(sentryConfig);
    logger.info('Sentry initialized for error tracking');
  }

  // Add request timing middleware
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      if (duration > performanceThresholds.apiResponseTime) {
        logger.warn(`Slow API response: ${req.method} ${req.path} took ${duration}ms`);
      }
    });
    next();
  });

  logger.info('Monitoring initialized successfully');
}

/**
 * Report Metric
 */
function reportMetric(name, value, tags = {}) {
  logger.info(`Metric: ${name}`, { value, tags });
  
  // Send to external monitoring services
  if (process.env.NEW_RELIC_ENABLED === 'true') {
    // Send to New Relic
  }
  
  if (process.env.DATADOG_ENABLED === 'true') {
    // Send to Datadog
  }
}

/**
 * Report Alert
 */
function reportAlert(severity, message, context = {}) {
  logger.warn(`Alert [${severity}]: ${message}`, context);
  
  // Send to alert channels
  if (alertConfig.email.enabled) {
    // Send email alert
  }
  
  if (alertConfig.slack.enabled) {
    // Send Slack alert
  }
  
  if (alertConfig.pagerduty.enabled) {
    // Send PagerDuty alert
  }
}

module.exports = {
  sentryConfig,
  performanceThresholds,
  alertConfig,
  healthCheckConfig,
  metricsConfig,
  loggingConfig,
  initializeMonitoring,
  reportMetric,
  reportAlert
};
