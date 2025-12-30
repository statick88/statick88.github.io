/**
 * @fileoverview Service Factory
 * Factory pattern para la creación de servicios con inyección de dependencias
 * Principios SOLID: DIP, OCP
 */

import { AuthService } from './AuthService.js';
import { TrainingService, TrainingValidator, TrainingSanitizer, TrainingFileHandler } from './TrainingService.refactored.js';
import { FirebaseTrainingRepository } from '../repositories/FirebaseTrainingRepository.js';
import { FirebaseFileRepository } from '../repositories/FirebaseFileRepository.js';

/**
 * @class ServiceFactory
 * Fabrica de servicios con gestión de dependencias
 */
export class ServiceFactory {
  constructor() {
    this.repositories = new Map();
    this.services = new Map();
    this._initializeRepositories();
  }

  /**
   * Inicializa los repositorios
   * @private
   */
  _initializeRepositories() {
    this.repositories.set('training', new FirebaseTrainingRepository());
    this.repositories.set('file', new FirebaseFileRepository());
  }

  /**
   * Obtiene el servicio de autenticación
   * @returns {AuthService} - Instancia de AuthService
   */
  getAuthService() {
    if (!this.services.has('auth')) {
      this.services.set('auth', new AuthService());
    }
    return this.services.get('auth');
  }

  /**
   * Obtiene el servicio de capacitaciones con inyección de dependencias
   * @returns {TrainingService} - Instancia de TrainingService con dependencias
   */
  getTrainingService() {
    if (!this.services.has('training')) {
      const trainingRepository = this.repositories.get('training');
      const fileRepository = this.repositories.get('file');
      this.services.set('training', new TrainingService(trainingRepository, fileRepository));
    }
    return this.services.get('training');
  }

  /**
   * Registra un repositorio personalizado
   * @param {string} name - Nombre del repositorio
   * @param {Object} repository - Instancia del repositorio
   */
  registerRepository(name, repository) {
    this.repositories.set(name, repository);
    // Limpiar cache de servicios que dependan de este repositorio
    this._clearDependentServices(name);
  }

  /**
   * Registra un servicio personalizado
   * @param {string} name - Nombre del servicio
   * @param {Object} service - Instancia del servicio
   */
  registerService(name, service) {
    this.services.set(name, service);
  }

  /**
   * Limpia servicios dependientes cuando un repositorio cambia
   * @private
   * @param {string} repositoryName - Nombre del repositorio modificado
   */
  _clearDependentServices(repositoryName) {
    const dependencies = {
      'training': ['training'],
      'file': ['training']
    };

    if (dependencies[repositoryName]) {
      dependencies[repositoryName].forEach(serviceName => {
        this.services.delete(serviceName);
      });
    }
  }

  /**
   * Crea una instancia de servicio con configuración personalizada
   * @param {string} serviceType - Tipo de servicio
   * @param {Object} config - Configuración personalizada
   * @returns {Object} - Instancia configurada
   */
  createCustomService(serviceType, config) {
    switch (serviceType) {
      case 'training':
        const { trainingRepository = this.repositories.get('training'), 
                fileRepository = this.repositories.get('file') } = config;
        return new TrainingService(trainingRepository, fileRepository);
      
      case 'auth':
        return new AuthService();
      
      default:
        throw new Error(`Unknown service type: ${serviceType}`);
    }
  }

  /**
   * Obtiene todos los servicios registrados
   * @returns {Map} - Mapa de servicios
   */
  getAllServices() {
    return new Map(this.services);
  }

  /**
   * Reinicia la fábrica (útil para testing)
   */
  reset() {
    this.services.clear();
    this.repositories.clear();
    this._initializeRepositories();
  }
}

// Singleton instance para uso global
export const serviceFactory = new ServiceFactory();