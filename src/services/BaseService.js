/**
 * @fileoverview Enhanced Base Service
 * Clase base para todos los servicios con logging y monitoreo integrados
 * Sigue principios SOLID: SRP, OCP, LSP, DIP
 */

import { monitoringService } from './MonitoringService.js';

/**
 * @class BaseService
 * Proporciona funcionalidad común a todos los servicios
 */
export class BaseService {
  constructor(serviceName, logger = null) {
    this.serviceName = serviceName;
    this.logger = logger || monitoringService.logger;
    this.metrics = monitoringService.metrics;
    this.startTime = Date.now();
  }

  /**
   * Inicializa el servicio
   * @returns {Promise<boolean>} - true si la inicialización fue exitosa
   */
  async initialize() {
    this.info(`Inicializando ${this.serviceName}`);
    
    try {
      // Medir tiempo de inicialización
      const timerId = this.metrics.startTimer('service_initialization', { 
        service: this.serviceName 
      });
      
      // Lógica de inicialización específica del servicio
      await this._onInitialize();
      
      const duration = this.metrics.stopTimer(timerId);
      this.info(`${this.serviceName} inicializado exitosamente en ${duration}ms`);
      
      this.metrics.incrementCounter('service_initializations', 1, { 
        service: this.serviceName,
        success: true 
      });
      
      return true;
    } catch (error) {
      this.error(`Error inicializando ${this.serviceName}`, error);
      this.metrics.incrementCounter('service_initializations', 1, { 
        service: this.serviceName,
        success: false 
      });
      return false;
    }
  }

  /**
   * Hook para inicialización específica del servicio
   * @protected
   */
  async _onInitialize() {
    // Override en clases hijas
  }

  /**
   * Registra mensaje de error
   * @param {string} message - Mensaje de error
   * @param {Error|Object} error - Error o datos adicionales
   */
  error(message, error = {}) {
    this.logger.error(`[${this.serviceName}] ${message}`, error);
    this.metrics.incrementCounter('service_errors', 1, { 
      service: this.serviceName,
      errorType: error.constructor?.name || 'Unknown' 
    });
  }

  /**
   * Registra mensaje de advertencia
   * @param {string} message - Mensaje de advertencia
   * @param {Object} metadata - Metadatos adicionales
   */
  warn(message, metadata = {}) {
    this.logger.warn(`[${this.serviceName}] ${message}`, { service: this.serviceName, ...metadata });
  }

  /**
   * Registra mensaje informativo
   * @param {string} message - Mensaje informativo
   * @param {Object} metadata - Metadatos adicionales
   */
  info(message, metadata = {}) {
    this.logger.info(`[${this.serviceName}] ${message}`, { service: this.serviceName, ...metadata });
  }

  /**
   * Registra mensaje de debug
   * @param {string} message - Mensaje de debug
   * @param {Object} metadata - Metadatos adicionales
   */
  debug(message, metadata = {}) {
    this.logger.debug(`[${this.serviceName}] ${message}`, { service: this.serviceName, ...metadata });
  }

  /**
   * Maneja errores de forma consistente
   * @param {Error} error - Error ocurrido
   * @param {string} operation - Operación que falló
   * @param {Object} context - Contexto adicional
   * @returns {Object} - Respuesta de error estandarizada
   */
  handleError(error, operation, context = {}) {
    this.error(`Error en ${operation}`, error);
    
    return {
      success: false,
      error: error.message,
      operation,
      service: this.serviceName,
      timestamp: new Date().toISOString(),
      ...context
    };
  }

  /**
   * Ejecuta una operación con medición y manejo de errores
   * @param {string} operation - Nombre de la operación
   * @param {Function} fn - Función a ejecutar
   * @param {Object} options - Opciones adicionales
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async executeOperation(operation, fn, options = {}) {
    const timerId = this.metrics.startTimer('operation_duration', { 
      service: this.serviceName,
      operation 
    });
    
    this.debug(`Iniciando ${operation}`, options);
    
    try {
      const result = await fn();
      const duration = this.metrics.stopTimer(timerId);
      
      this.info(`${operation} completado exitosamente`, { duration, ...options });
      this.metrics.incrementCounter('successful_operations', 1, { 
        service: this.serviceName,
        operation 
      });
      
      return {
        success: true,
        result,
        duration,
        operation,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      const duration = this.metrics.stopTimer(timerId);
      
      this.error(`${operation} falló`, error);
      this.metrics.incrementCounter('failed_operations', 1, { 
        service: this.serviceName,
        operation,
        errorType: error.constructor.name 
      });
      
      return this.handleError(error, operation, { duration, ...options });
    }
  }

  /**
   * Mide tiempo de ejecución de una operación (legacy)
   * @param {string} operation - Nombre de la operación
   * @param {Function} fn - Función a medir
   * @returns {Promise} - Resultado de la función
   */
  async measureTime(operation, fn) {
    const operationResult = await this.executeOperation(operation, fn);
    
    if (operationResult.success) {
      return operationResult.result;
    } else {
      throw new Error(operationResult.error);
    }
  }

  /**
   * Valida que una operación esté permitida
   * @param {string} operation - Operación a validar
   * @param {Object} context - Contexto de validación
   * @returns {boolean} - true si está permitida
   */
  validateOperation(operation, context = {}) {
    this.debug(`Validando operación: ${operation}`, context);
    this.metrics.incrementCounter('operation_validations', 1, { 
      service: this.serviceName,
      operation 
    });
    
    // Lógica de validación común
    return true;
  }

  /**
   * Registra evento de negocio
   * @param {string} event - Nombre del evento
   * @param {Object} data - Datos del evento
   */
  logBusinessEvent(event, data = {}) {
    monitoringService.logBusinessEvent(event, {
      service: this.serviceName,
      ...data
    });
  }

  /**
   * Obtiene estadísticas del servicio
   * @returns {Object} - Estadísticas del servicio
   */
  getStats() {
    return {
      serviceName: this.serviceName,
      uptime: Date.now() - this.startTime,
      timestamp: new Date().toISOString(),
      metrics: this.metrics.getMetrics()
    };
  }

  /**
   * Realiza limpieza del servicio
   * @returns {Promise<boolean>} - true si la limpieza fue exitosa
   */
  async cleanup() {
    this.info(`Limpiando ${this.serviceName}`);
    
    try {
      await this._onCleanup();
      this.info(`${this.serviceName} limpiado exitosamente`);
      return true;
    } catch (error) {
      this.error(`Error limpiando ${this.serviceName}`, error);
      return false;
    }
  }

  /**
   * Hook para limpieza específica del servicio
   * @protected
   */
  async _onCleanup() {
    // Override en clases hijas
  }
}