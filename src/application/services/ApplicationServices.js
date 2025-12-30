/**
 * @fileoverview Application Services
 * Servicios de aplicación según Clean Architecture
 * Application Layer - Coordinación entre Use Cases y Controllers
 */

import { CreateUserUseCase, AuthenticateUserUseCase, CreateTrainingUseCase, GetVerifiedTrainingsUseCase, VerifyTrainingUseCase } from '../usecases/UseCases.js';
import { FirebaseUserRepository, FirebaseTrainingRepository, FirebaseFileRepository } from '../repositories/FirebaseRepositories.js';

/**
 * @class ApplicationService
 * Servicio principal de aplicación
 * Orquesta los diferentes Use Cases disponibles
 */
export class ApplicationService {
  constructor() {
    // Inicializar repositorios (Dependency Injection)
    this.userRepository = new FirebaseUserRepository();
    this.trainingRepository = new FirebaseTrainingRepository();
    this.fileRepository = new FirebaseFileRepository();

    // Inicializar Use Cases
    this.initializeUseCases();
  }

  /**
   * Inicializa todos los Use Cases
   * @private
   */
  initializeUseCases() {
    // User Use Cases
    this.createUserUseCase = new CreateUserUseCase(this.userRepository);
    this.authenticateUserUseCase = new AuthenticateUserUseCase(this.userRepository);

    // Training Use Cases
    this.createTrainingUseCase = new CreateTrainingUseCase(this.trainingRepository, this.fileRepository);
    this.getVerifiedTrainingsUseCase = new GetVerifiedTrainingsUseCase(this.trainingRepository);
    this.verifyTrainingUseCase = new VerifyTrainingUseCase(this.trainingRepository);
  }

  /**
   * Obtiene el Use Case de creación de usuarios
   * @returns {CreateUserUseCase} Use Case de creación
   */
  getCreateUserUseCase() {
    return this.createUserUseCase;
  }

  /**
   * Obtiene el Use Case de autenticación
   * @returns {AuthenticateUserUseCase} Use Case de autenticación
   */
  getAuthenticateUserUseCase() {
    return this.authenticateUserUseCase;
  }

  /**
   * Obtiene el Use Case de creación de capacitaciones
   * @returns {CreateTrainingUseCase} Use Case de creación
   */
  getCreateTrainingUseCase() {
    return this.createTrainingUseCase;
  }

  /**
   * Obtiene el Use Case de consulta de capacitaciones
   * @returns {GetVerifiedTrainingsUseCase} Use Case de consulta
   */
  getGetVerifiedTrainingsUseCase() {
    return this.getVerifiedTrainingsUseCase;
  }

  /**
   * Obtiene el Use Case de verificación de capacitaciones
   * @returns {VerifyTrainingUseCase} Use Case de verificación
   */
  getVerifyTrainingUseCase() {
    return this.verifyTrainingUseCase;
  }

  /**
   * Obtiene el repositorio de usuarios
   * @returns {FirebaseUserRepository} Repositorio de usuarios
   */
  getUserRepository() {
    return this.userRepository;
  }

  /**
   * Obtiene el repositorio de capacitaciones
   * @returns {FirebaseTrainingRepository} Repositorio de capacitaciones
   */
  getTrainingRepository() {
    return this.trainingRepository;
  }

  /**
   * Obtiene el repositorio de archivos
   * @returns {FirebaseFileRepository} Repositorio de archivos
   */
  getFileRepository() {
    return this.fileRepository;
  }

  /**
   * Realiza verificación de salud de todos los servicios
   * @returns {Promise<Object>} - Estado de salud de los servicios
   */
  async healthCheck() {
    try {
      const healthChecks = await Promise.allSettled([
        this._checkRepository(this.userRepository, 'User'),
        this._checkRepository(this.trainingRepository, 'Training'),
        this._checkRepository(this.fileRepository, 'File')
      ]);

      const results = {
        user: healthChecks[0].status === 'fulfilled',
        training: healthChecks[1].status === 'fulfilled',
        file: healthChecks[2].status === 'fulfilled',
        overall: healthChecks.every(check => check.status === 'fulfilled'),
        timestamp: new Date().toISOString()
      };

      return {
        success: results.overall,
        services: results,
        message: results.overall ? 'All services healthy' : 'Some services unhealthy'
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Verifica salud de un repositorio específico
   * @private
   * @param {Repository} repository - Repositorio a verificar
   * @param {string} name - Nombre del servicio
   * @returns {Promise<Object>} - Resultado de la verificación
   */
  async _checkRepository(repository, name) {
    try {
      const count = await repository.count();
      return {
        service: name,
        status: 'healthy',
        count,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        service: name,
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Obtiene estadísticas del sistema
   * @returns {Promise<Object>} - Estadísticas completas
   */
  async getSystemStatistics() {
    try {
      const [userStats, trainingStats] = await Promise.all([
        this._getUserStatistics(),
        this._getTrainingStatistics()
      ]);

      return {
        success: true,
        statistics: {
          users: userStats,
          trainings: trainingStats,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Obtiene estadísticas de usuarios
   * @private
   * @returns {Promise<Object>} - Estadísticas de usuarios
   */
  async _getUserStatistics() {
    try {
      const [total, active] = await Promise.all([
        this.userRepository.count(),
        this.userRepository.count({ active: true })
      ]);

      return {
        total,
        active,
        inactive: total - active,
        recentRegistrations: await this._getRecentUserCount()
      };
    } catch (error) {
      throw new Error(`Failed to get user statistics: ${error.message}`);
    }
  }

  /**
   * Obtiene estadísticas de capacitaciones
   * @private
   * @returns {Promise<Object>} - Estadísticas de capacitaciones
   */
  async _getTrainingStatistics() {
    try {
      const stats = await this.trainingRepository.getStatistics();
      return {
        total: stats.total,
        verified: stats.verified,
        pending: stats.pending,
        recent: stats.recentCount
      };
    } catch (error) {
      throw new Error(`Failed to get training statistics: ${error.message}`);
    }
  }

  /**
   * Obtiene conteo de usuarios recientes
   * @private
   * @returns {Promise<number>} - Número de usuarios recientes
   */
  async _getRecentUserCount() {
    try {
      const recentUsers = await this.userRepository.findWithCriteria(
        { active: true },
        { limit: 5 }
      );
      return recentUsers.users?.length || 0;
    } catch (error) {
      console.warn('Could not get recent user count:', error.message);
      return 0;
    }
  }
}

/**
 * @class UserService
 * Servicio especializado para usuarios
 * Application Layer - Fachada para operaciones de usuarios
 */
export class UserService {
  constructor(applicationService) {
    this.applicationService = applicationService;
    this.createUserUseCase = applicationService.getCreateUserUseCase();
    this.authenticateUserUseCase = applicationService.getAuthenticateUserUseCase();
    this.userRepository = applicationService.getUserRepository();
  }

  /**
   * Crea un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>} - Resultado de la creación
   */
  async createUser(userData) {
    return this.createUserUseCase.execute(userData);
  }

  /**
   * Autentica un usuario
   * @param {Object} credentials - Credenciales del usuario
   * @returns {Promise<Object>} - Resultado de la autenticación
   */
  async authenticateUser(credentials) {
    return this.authenticateUserUseCase.execute(credentials);
  }

  /**
   * Obtiene perfil de usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>} - Perfil del usuario
   */
  async getUserProfile(userId) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      return {
        success: true,
        user: user.toObject()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Actualiza perfil de usuario
   * @param {string} userId - ID del usuario
   * @param {Object} updates - Datos a actualizar
   * @returns {Promise<Object>} - Resultado de la actualización
   */
  async updateUserProfile(userId, updates) {
    try {
      const updatedUser = await this.userRepository.update(userId, updates);
      return {
        success: true,
        user: updatedUser
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

/**
 * @class TrainingService
 * Servicio especializado para capacitaciones
 * Application Layer - Fachada para operaciones de capacitaciones
 */
export class TrainingService {
  constructor(applicationService) {
    this.applicationService = applicationService;
    this.createTrainingUseCase = applicationService.getCreateTrainingUseCase();
    this.getVerifiedTrainingsUseCase = applicationService.getGetVerifiedTrainingsUseCase();
    this.verifyTrainingUseCase = applicationService.getVerifyTrainingUseCase();
    this.trainingRepository = applicationService.getTrainingRepository();
    this.fileRepository = applicationService.getFileRepository();
  }

  /**
   * Crea una nueva capacitación
   * @param {Object} trainingData - Datos de la capacitación
   * @param {File} file - Archivo PDF
   * @returns {Promise<Object>} - Resultado de la creación
   */
  async createTraining(trainingData, file) {
    return this.createTrainingUseCase.execute({ trainingData, file });
  }

  /**
   * Obtiene capacitaciones verificadas
   * @param {Object} params - Parámetros de consulta
   * @returns {Promise<Object>} - Capacitaciones verificadas
   */
  async getVerifiedTrainings(params = {}) {
    return this.getVerifiedTrainingsUseCase.execute(params);
  }

  /**
   * Verifica una capacitación
   * @param {string} trainingId - ID de la capacitación
   * @returns {Promise<Object>} - Resultado de la verificación
   */
  async verifyTraining(trainingId) {
    return this.verifyTrainingUseCase.execute({ trainingId });
  }

  /**
   * Obtiene detalles de una capacitación
   * @param {string} trainingId - ID de la capacitación
   * @returns {Promise<Object>} - Detalles de la capacitación
   */
  async getTrainingDetails(trainingId) {
    try {
      const training = await this.trainingRepository.findById(trainingId);
      if (!training) {
        return {
          success: false,
          error: 'Training not found'
        };
      }

      return {
        success: true,
        training: training.toObject()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtiene estadísticas de capacitaciones
   * @returns {Promise<Object>} - Estadísticas
   */
  async getTrainingStatistics() {
    try {
      const stats = await this.trainingRepository.getStatistics();
      return {
        success: true,
        statistics: {
          total: stats.total,
          verified: stats.verified,
          pending: stats.pending,
          recent: stats.recentCount
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}