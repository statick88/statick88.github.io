/**
 * @fileoverview API Routes Configuration
 * Configuración de rutas según Clean Architecture
 * Presentation Layer - API Routing
 */

import { UserController, TrainingController, HealthController } from './APIControllers.js';

/**
 * @class APIRoutes
 * Configura todas las rutas de la API REST
 * Following REST conventions and Clean Architecture
 */
export class APIRoutes {
  constructor(app) {
    this.app = app;
    this.initializeRoutes();
  }

  /**
   * Inicializa todas las rutas de la API
   * @private
   */
  initializeRoutes() {
    this.setupUserRoutes();
    this.setupTrainingRoutes();
    this.setupHealthRoutes();
    this.setupErrorHandling();
    this.setupMiddleware();
  }

  /**
   * Configura middleware global
   * @private
   */
  setupMiddleware() {
    // Middleware de logging
    this.app.use((req, res, next) => {
      const timestamp = new Date().toISOString();
      console.info(`[${timestamp}] ${req.method} ${req.path} - IP: ${req.ip}`);
      next();
    });

    // Middleware de CORS
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization');
      next();
    });

    // Middleware de parsing
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Middleware de límite de tamaño
    this.app.use(express.json({ limit: '10mb' }));
  }

  /**
   * Configura rutas de usuarios
   * @private
   */
  setupUserRoutes() {
    const userController = new UserController();

    // Rutas de autenticación
    this.app.post('/api/auth/register', userController.createUser.bind(userController));
    this.app.post('/api/auth/login', userController.authenticateUser.bind(userController));
    this.app.get('/api/auth/profile', userController.getUserProfile.bind(userController));
    this.app.put('/api/auth/profile', userController.updateUserProfile.bind(userController));

    // Rutas CRUD de usuarios
    this.app.get('/api/users', userController.getAllUsers.bind(userController));
    this.app.get('/api/users/:id', userController.getUserById.bind(userController));
    this.app.put('/api/users/:id', userController.updateUser.bind(userController));
    this.app.delete('/api/users/:id', userController.deleteUser.bind(userController));
  }

  /**
   * Configura rutas de capacitaciones
   * @private
   */
  setupTrainingRoutes() {
    const trainingController = new TrainingController();

    // Rutas públicas de capacitaciones
    this.app.get('/api/trainings/verified', trainingController.getVerifiedTrainings.bind(trainingController));
    this.app.get('/api/trainings/:id', trainingController.getTrainingDetails.bind(trainingController));

    // Rutas de administración (requieren autenticación)
    this.app.post('/api/trainings', this.requireAuth.bind(this), trainingController.createTraining.bind(trainingController));
    this.app.put('/api/trainings/:id', this.requireAuth.bind(this), trainingController.updateTraining.bind(trainingController));
    this.app.delete('/api/trainings/:id', this.requireAdmin.bind(this), trainingController.deleteTraining.bind(trainingController));
    this.app.post('/api/trainings/:id/verify', this.requireAdmin.bind(this), trainingController.verifyTraining.bind(trainingController));

    // Rutas de estadísticas
    this.app.get('/api/trainings/statistics', this.requireAdmin.bind(this), trainingController.getTrainingStatistics.bind(trainingController));
  }

  /**
   * Configura rutas de salud
   * @private
   */
  setupHealthRoutes() {
    const healthController = new HealthController();

    this.app.get('/api/health', healthController.healthCheck.bind(healthController));
    this.app.get('/api/health/detailed', healthController.getDetailedHealth.bind(healthController));
    this.app.get('/api/statistics', healthController.getSystemStatistics.bind(healthController));
  }

  /**
   * Middleware de autenticación
   * @private
   */
  requireAuth(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token required',
        code: 401
      });
    }

    try {
      // Simplificado - en producción usar JWT real
      const decoded = Buffer.from(token, 'base64').toString();
      const user = JSON.parse(decoded);
      req.user = user;
      next();
    } catch {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
        code: 401
      });
    }
  }

  /**
   * Middleware de autorización de administrador
   * @private
   */
   requireAdmin(req, res, next) {
    this.requireAuth(req, res, () => {
      if (req.user && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Admin access required',
          code: 403
        });
      }
      next();
    });
  }

  /**
   * Configura manejo de errores global
   * @private
   */
  setupErrorHandling() {
    // Manejo de errores 404
    this.app.use((req, res) => {
      res.status(404).json({
        success: false,
        error: `Route ${req.method} ${req.path} not found`,
        code: 404,
        timestamp: new Date().toISOString()
      });
    });

    // Manejo de errores globales
    this.app.use((error, req, res, _next) => {
      console.error('Unhandled error:', error);
      
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 500,
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      });
    });
  }

  /**
   * Obtiene documentación de la API
   * @returns {Object} - Documentación de rutas
   */
  getAPIDocumentation() {
    return {
      version: '1.0.0',
      title: 'Portfolio API',
      description: 'RESTful API for portfolio management',
      baseUrl: '/api',
      authentication: this._getAuthDocs(),
      endpoints: this._getEndpointsDocs()
    };
  }

  _getAuthDocs() {
    return {
      type: 'Bearer Token',
      description: 'JWT token required for protected routes'
    };
  }

  _getEndpointsDocs() {
    return {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: {
          get: 'GET /api/auth/profile',
          update: 'PUT /api/auth/profile'
        }
      },
      trainings: {
        public: {
          verified: 'GET /api/trainings/verified',
          details: 'GET /api/trainings/:id'
        },
        protected: {
          create: 'POST /api/trainings',
          update: 'PUT /api/trainings/:id',
          delete: 'DELETE /api/trainings/:id',
          verify: 'POST /api/trainings/:id/verify',
          statistics: 'GET /api/trainings/statistics'
        },
        health: {
          check: 'GET /api/health',
          detailed: 'GET /api/health/detailed',
          statistics: 'GET /api/statistics'
        },
      responseFormat: {
        success: {
          success: true,
          data: 'response_data',
          message: 'success_message',
          timestamp: 'ISO_8601_timestamp'
        },
        error: {
          success: false,
          error: 'error_message',
          code: 'http_status_code',
          timestamp: 'ISO_8601_timestamp'
        }
        }
      }
    };
  }
}

// Exportar configuración para uso fácil
export default APIRoutes;