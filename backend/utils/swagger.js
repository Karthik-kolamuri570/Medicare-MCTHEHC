/**
 * Swagger/OpenAPI Configuration for Medicare-MC
 * API Documentation
 */

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Medicare-MC API',
      version: '1.0.0',
      description: 'Healthcare Management System API Documentation',
      contact: {
        name: 'Medicare-MC Support',
        email: 'support@medicare-mc.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:1600/api',
        description: 'Development Server'
      },
      {
        url: 'https://api.medicare-mc.com/api',
        description: 'Production Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme'
        }
      },
      schemas: {
        Patient: {
          type: 'object',
          required: ['name', 'email', 'password', 'contact', 'age', 'gender', 'address'],
          properties: {
            _id: {
              type: 'string',
              description: 'Patient ID'
            },
            name: {
              type: 'string',
              description: 'Patient full name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Patient email address'
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'Patient password (hashed)'
            },
            contact: {
              type: 'number',
              description: '10-digit phone number'
            },
            age: {
              type: 'number',
              description: 'Patient age'
            },
            gender: {
              type: 'string',
              enum: ['male', 'female', 'other'],
              description: 'Patient gender'
            },
            address: {
              type: 'string',
              description: 'Patient address'
            },
            profileImage: {
              type: 'string',
              description: 'S3 URL to profile image'
            }
          }
        },
        Doctor: {
          type: 'object',
          required: ['name', 'email', 'password', 'contact', 'specialization', 'experience', 'location', 'hospital', 'feePerConsultation'],
          properties: {
            _id: {
              type: 'string',
              description: 'Doctor ID'
            },
            name: {
              type: 'string',
              description: 'Doctor full name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Doctor email address'
            },
            specialization: {
              type: 'string',
              description: 'Medical specialization'
            },
            experience: {
              type: 'number',
              description: 'Years of experience'
            },
            location: {
              type: 'string',
              description: 'Practice location'
            },
            hospital: {
              type: 'string',
              description: 'Associated hospital'
            },
            feePerConsultation: {
              type: 'number',
              description: 'Consultation fee in INR'
            },
            verifiedByAdmin: {
              type: 'string',
              enum: ['pending', 'approved', 'rejected'],
              description: 'Admin verification status'
            }
          }
        },
        Appointment: {
          type: 'object',
          required: ['doctorId', 'patientId', 'problem', 'date', 'time'],
          properties: {
            _id: {
              type: 'string',
              description: 'Appointment ID'
            },
            doctorId: {
              type: 'string',
              description: 'Doctor ID'
            },
            patientId: {
              type: 'string',
              description: 'Patient ID'
            },
            problem: {
              type: 'string',
              description: 'Medical problem description'
            },
            date: {
              type: 'string',
              format: 'date',
              description: 'Appointment date (YYYY-MM-DD)'
            },
            time: {
              type: 'string',
              description: 'Appointment time (HH:MM)'
            },
            status: {
              type: 'string',
              enum: ['Pending', 'Accepted', 'Rejected', 'Cancelled'],
              description: 'Appointment status'
            },
            paymentStatus: {
              type: 'string',
              enum: ['unpaid', 'paid'],
              description: 'Payment status'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Error message'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './routes/patientRoutes.js',
    './routes/doctorRoutes.js',
    './routes/payment.js'
  ]
};

const specs = swaggerJsdoc(options);

module.exports = specs;
