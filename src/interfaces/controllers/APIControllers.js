/**
 * @fileoverview API Controllers
 * Controladores que coordinan Application Services
 * Presentation Layer - Interface Web Application
 */

import { ApplicationService, UserService, TrainingService } from '../application/services/ApplicationServices.js';

/**
 * @class BaseController
 * Controlador base con funcionalidad común
 */
export class BaseController {
  constructor() {
    this.applicationService = new ApplicationService();
  }

  /**
   * Maneja respuestas de éxito
   * @protected
   * @param {Object} data - Datos a responder
   * @param {string} message - Mensaje de éxito
   * @returns {Object} - Respuesta formateada
   */
  successResponse(data, message = 'Operation successful') {
    return {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Maneja respuestas de error
   * @protected
   * @param {string} error - Mensaje de error
   * @param {number} code - Código de error HTTP
   * @returns {Object} - Respuesta formateada
   */
  errorResponse(error, code = 400) {
    return {
      success: false,
      error,
      code,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Maneja errores de forma consistente
   * @protected
   * @param {Error} err - Error ocurrido
   * @param {string} operation - Operación que falló
   * @returns {Object} - Respuesta de error formateada
   */
  handleError(err, operation) {
    console.error(`Error in ${operation}:`, err);
    return this.errorResponse(err.message || 'Internal server error', 500);
  }
}

/**
 * @class UserController
 * Controlador para operaciones de usuarios
 */
export class UserController extends BaseController {
  constructor() {
    super();
    this.userService = new UserService(this.applicationService);
  }

  /**
   * Crea un nuevo usuario
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   */
  async createUser(req, res) {
    try {
      const { email, displayName, password } = req.body;
      
      // Validar entrada
      this._validateCreateUserData({ email, displayName, password });

      // Ejecutar Use Case
      const result = await this.userService.createUser({ email, displayName, password });
      
      if (result.success) {
        res.status(201).json(this.successResponse(result.user, result.message));
      } else {
        res.status(400).json(this.errorResponse(result.error, 400));
      }
    } catch (error) {
      res.status(500).json(this.handleError(error, 'createUser'));
    }
  }

  /**
   * Autentica un usuario
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   */
  async authenticateUser(req, res) {
    try {
      const { email, password } = req.body;
      
      // Validar entrada
      this._validateAuthData({ email, password });

      // Ejecutar Use Case
      const result = await this.userService.authenticateUser({ email, password });
      
      if (result.success) {
        res.status(200).json(this.successResponse({
          user: result.user,
          token: result.token
        }, result.message));
      } else {
        res.status(401).json(this.errorResponse(result.error, 401));
      }
    } catch (error) {
      res.status(500).json(this.handleError(error, 'authenticateUser'));
    }
  }

  /**
   * Obtiene el perfil del usuario
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   */
  async getUserProfile(req, res) {
    try {
      const userId = req.user?.id || req.params.userId;
      
      if (!userId) {
        return res.status(401).json(this.errorResponse('Unauthorized', 401));
      }

      const result = await this.userService.getUserProfile(userId);
      
      if (result.success) {
        res.status(200).json(this.successResponse(result.user, 'Profile retrieved successfully'));
      } else {
        res.status(404).json(this.errorResponse(result.error, 404));
      }
    } catch (error) {
      res.status(500).json(this.handleError(error, 'getUserProfile'));
    }
  }

  /**
   * Actualiza el perfil del usuario
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   */
  async updateUserProfile(req, res) {
    try {
      const userId = req.user?.id;
      const updates = req.body;
      
      if (!userId) {
        return res.status(401).json(this.errorResponse('Unauthorized', 401));
      }

      // Validar datos de actualización
      this._validateUpdateData(updates);

      const result = await this.userService.updateUserProfile(userId, updates);
      
      if (result.success) {
        res.status(200).json(this.successResponse(result.user, 'Profile updated successfully'));
      } else {
        res.status(400).json(this.errorResponse(result.error, 400));
      }
    } catch (error) {
      res.status(500).json(this.handleError(error, 'updateUserProfile'));
    }
  }

  /**
   * Valida datos para creación de usuario
   * @private
   * @param {Object} data - Datos a validar
   * @throws {Error} Si los datos no son válidos
   */
  _validateEmail(email) {
    if (!email || typeof email !== 'string') {
      throw new Error('Email is required and must be a string');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Email format is invalid');
    }
  }

  _validateDisplayName(displayName) {
    if (!displayName || typeof displayName !== 'string') {
      throw new Error('Display name is required and must be a string');
    }

    if (displayName.length < 2 || displayName.length > 100) {
      throw new Error('Display name must be between 2 and 100 characters');
    }
  }

  _validateCreateUserData(data) {
    const { email, displayName, password } = data;
    
    this._validateEmail(email);
    this._validateDisplayName(displayName);
    this._validatePassword(password);
  }

  _validatePassword(password) {
    if (!password || typeof password !== 'string') {
      throw new Error('Password is required and must be a string');
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
  }

  /**
   * Valida datos de autenticación
   * @private
   * @param {Object} data - Datos a validar
   * @throws {Error} Si los datos no son válidos
   */
  _validateAuthData(data) {
    const { email, password } = data;

    if (!email || typeof email !== 'string') {
      throw new Error('Email is required and must be a string');
    }

    if (!password || typeof password !== 'string') {
      throw new Error('Password is required and must be a string');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Email format is invalid');
    }
  }

  /**
   * Valida datos de actualización
   * @private
   * @param {Object} data - Datos a validar
   * @throws {Error} Si los datos no son válidos
   */
  _validateUpdateData(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Update data is required and must be an object');
    }

    // Validar campos permitidos para actualización
    const allowedFields = ['displayName', 'email'];
    const invalidFields = Object.keys(data).filter(field => !allowedFields.includes(field));
    
    if (invalidFields.length > 0) {
      throw new Error(`Invalid fields for update: ${invalidFields.join(', ')}`);
    }
  }
}

/**
 * @class TrainingController
 * Controlador para operaciones de capacitaciones
 */
export class TrainingController extends BaseController {
  constructor() {
    super();
    this.trainingService = new TrainingService(this.applicationService);
  }

  /**
   * Crea una nueva capacitación
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   */
  async createTraining(req, res) {
    try {
      const trainingData = req.body;
      const file = req.file;
      
      // Validar entrada
      this._validateCreateTrainingData({ trainingData, file });

      // Ejecutar Use Case
      const result = await this.trainingService.createTraining(trainingData, file);
      
      if (result.success) {
        res.status(201).json(this.successResponse(result.training, result.message));
      } else {
        res.status(400).json(this.errorResponse(result.error, 400));
      }
    } catch (error) {
      res.status(500).json(this.handleError(error, 'createTraining'));
    }
  }

  /**
   * Obtiene capacitaciones verificadas
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   */
  async getVerifiedTrainings(req, res) {
    try {
      const { page = 1, limit = 10, search, institution } = req.query;
      
      // Validar parámetros de paginación
      this._validatePaginationParams({ page, limit });

      // Ejecutar Use Case
      const result = await this.trainingService.getVerifiedTrainings({
        pagination: { page: parseInt(page), limit: parseInt(limit) },
        filters: { search, institution }
      });
      
      if (result.success) {
        res.status(200).json(this.successResponse(result, result.message));
      } else {
        res.status(400).json(this.errorResponse(result.error, 400));
      }
    } catch (error) {
      res.status(500).json(this.handleError(error, 'getVerifiedTrainings'));
    }
  }

  /**
   * Verifica una capacitación (solo admin)
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   */
  async verifyTraining(req, res) {
    try {
      const { trainingId } = req.params;
      
      // Validar entrada
      this._validateId(trainingId);

      // Verificar permisos de admin (simplificado)
      if (!this._isAdmin(req)) {
        return res.status(403).json(this.errorResponse('Forbidden: Admin access required', 403));
      }

      // Ejecutar Use Case
      const result = await this.trainingService.verifyTraining(trainingId);
      
      if (result.success) {
        res.status(200).json(this.successResponse(result.training, result.message));
      } else {
        res.status(400).json(this.errorResponse(result.error, 400));
      }
    } catch (error) {
      res.status(500).json(this.handleError(error, 'verifyTraining'));
    }
  }

  /**
   * Obtiene detalles de una capacitación
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   */
  async getTrainingDetails(req, res) {
    try {
      const { trainingId } = req.params;
      
      // Validar entrada
      this._validateId(trainingId);

      const result = await this.trainingService.getTrainingDetails(trainingId);
      
      if (result.success) {
        res.status(200).json(this.successResponse(result.training, 'Training retrieved successfully'));
      } else {
        res.status(404).json(this.errorResponse(result.error, 404));
      }
    } catch (error) {
      res.status(500).json(this.handleError(error, 'getTrainingDetails'));
    }
  }

  /**
   * Obtiene estadísticas de capacitaciones
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   */
  async getTrainingStatistics(req, res) {
    try {
      const result = await this.trainingService.getTrainingStatistics();
      
      if (result.success) {
        res.status(200).json(this.successResponse(result.statistics, 'Statistics retrieved successfully'));
      } else {
        res.status(400).json(this.errorResponse(result.error, 400));
      }
    } catch (error) {
      res.status(500).json(this.handleError(error, 'getTrainingStatistics'));
    }
  }

  /**
   * Valida datos para creación de capacitación
   * @private
   * @param {Object} data - Datos a validar
   * @throws {Error} Si los datos no son válidos
   */
  _validateCreateTrainingData(data) {
    const { trainingData, file } = data;

    if (!trainingData || typeof trainingData !== 'object') {
      throw new Error('Training data is required and must be an object');
    }

    if (!file || typeof file !== 'object') {
      throw new Error('File is required');
    }

    if (file.type !== 'application/pdf') {
      throw new Error('Only PDF files are allowed');
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      throw new Error('File size cannot exceed 10MB');
    }

    // Validar campos requeridos
    const requiredFields = ['title', 'institution', 'date'];
    for (const field of requiredFields) {
      if (!trainingData[field] || typeof trainingData[field] !== 'string') {
        throw new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required and must be a string`);
      }
    }
  }

  /**
   * Valida parámetros de paginación
   * @private
   * @param {Object} params - Parámetros a validar
   * @throws {Error} Si los parámetros no son válidos
   */
  _validatePaginationParams(params) {
    const { page, limit } = params;

    if (page && (isNaN(page) || page < 1)) {
      throw new Error('Page must be a positive integer');
    }

    if (limit && (isNaN(limit) || limit < 1 || limit > 100)) {
      throw new Error('Limit must be between 1 and 100');
    }
  }

  /**
   * Valida un ID
   * @private
   * @param {string} id - ID a validar
   * @throws {Error} Si el ID no es válido
   */
  _validateId(id) {
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      throw new Error('ID is required and must be a non-empty string');
    }
  }

  /**
   * Verifica si el usuario es admin (simplificado)
   * @private
   * @param {Object} req - Request de Express
   * @returns {boolean} - true si es admin
   */
  _isAdmin(req) {
    // En un caso real, esto verificaria tokens, roles, etc.
    // Por ahora, simplificado como ejemplo
    return req.user && req.user.role === 'admin';
  }
}

/**
 * @class HealthController
 * Controlador para endpoints de salud
 */
export class HealthController extends BaseController {
  constructor() {
    super();
    this.applicationService = new ApplicationService();
  }

  /**
   * Endpoint de salud del sistema
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   */
  async healthCheck(req, res) {
    try {
      const result = await this.applicationService.healthCheck();
      
      if (result.success) {
        res.status(200).json(this.successResponse({
          status: 'healthy',
          services: result.services,
          uptime: process.uptime()
        }, 'System is healthy'));
      } else {
        res.status(503).json(this.errorResponse('System unhealthy', 503));
      }
    } catch (error) {
      res.status(500).json(this.handleError(error, 'healthCheck'));
    }
  }

  /**
   * Obtiene estadísticas del sistema
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   */
  async getSystemStatistics(req, res) {
    try {
      const result = await this.applicationService.getSystemStatistics();
      
      if (result.success) {
        res.status(200).json(this.successResponse(result.statistics, 'Statistics retrieved successfully'));
      } else {
        res.status(400).json(this.errorResponse(result.error, 400));
      }
    } catch (error) {
      res.status(500).json(this.handleError(error, 'getSystemStatistics'));
    }
  }
}