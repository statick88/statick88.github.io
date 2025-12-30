/**
 * @fileoverview Logger Service
 * Sistema de logging estructurado y monitoreo
 * Principios SOLID: SRP, OCP
 */

/**
 * @enum LogLevel
 * Niveles de logging
 */
export const LogLevel = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

/**
 * @interface ILogger
 * Interfaz para loggers
 */
export class ILogger {
  /**
   * Registra un mensaje
   * @param {string} level - Nivel de log
   * @param {string} message - Mensaje
   * @param {Object} metadata - Metadatos adicionales
   */
  log(level, message, metadata = {}) {
    throw new Error('Method log must be implemented');
  }

  /**
   * Registra error
   * @param {string} message - Mensaje de error
   * @param {Error|Object} error - Error o datos
   */
  error(message, error = {}) {
    throw new Error('Method error must be implemented');
  }

  /**
   * Registra advertencia
   * @param {string} message - Mensaje de advertencia
   * @param {Object} metadata - Metadatos adicionales
   */
  warn(message, metadata = {}) {
    throw new Error('Method warn must be implemented');
  }

  /**
   * Registra información
   * @param {string} message - Mensaje informativo
   * @param {Object} metadata - Metadatos adicionales
   */
  info(message, metadata = {}) {
    throw new Error('Method info must be implemented');
  }

  /**
   * Registra información de debug
   * @param {string} message - Mensaje de debug
   * @param {Object} metadata - Metadatos adicionales
   */
  debug(message, metadata = {}) {
    throw new Error('Method debug must be implemented');
  }
}

/**
 * @class ConsoleLogger
 * Implementación de logger para consola
 */
export class ConsoleLogger extends ILogger {
  constructor(minLevel = LogLevel.INFO) {
    super();
    this.minLevel = minLevel;
    this.levels = {
      [LogLevel.ERROR]: 'ERROR',
      [LogLevel.WARN]: 'WARN',
      [LogLevel.INFO]: 'INFO',
      [LogLevel.DEBUG]: 'DEBUG'
    };
  }

  /**
   * Formatea el mensaje de log
   * @private
   * @param {string} level - Nivel de log
   * @param {string} message - Mensaje
   * @param {Object} metadata - Metadatos
   * @returns {Object} - Objeto formateado
   */
  _formatMessage(level, message, metadata) {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...metadata
    };
  }

  /**
   * Registra un mensaje
   * @param {string} level - Nivel de log
   * @param {string} message - Mensaje
   * @param {Object} metadata - Metadatos adicionales
   */
  log(level, message, metadata = {}) {
    if (level <= this.minLevel) {
      const formattedMessage = this._formatMessage(this.levels[level], message, metadata);
      
      switch (level) {
        case LogLevel.ERROR:
          console.error('🔴', formattedMessage);
          break;
        case LogLevel.WARN:
          console.warn('🟡', formattedMessage);
          break;
        case LogLevel.INFO:
          console.info('🔵', formattedMessage);
          break;
        case LogLevel.DEBUG:
          console.debug('🟢', formattedMessage);
          break;
        default:
          console.log(formattedMessage);
      }
    }
  }

  error(message, error = {}) {
    this.log(LogLevel.ERROR, message, { error: error.message || error });
  }

  warn(message, metadata = {}) {
    this.log(LogLevel.WARN, message, metadata);
  }

  info(message, metadata = {}) {
    this.log(LogLevel.INFO, message, metadata);
  }

  debug(message, metadata = {}) {
    this.log(LogLevel.DEBUG, message, metadata);
  }
}

/**
 * @class MemoryLogger
 * Logger que almacena logs en memoria (útil para testing)
 */
export class MemoryLogger extends ILogger {
  constructor() {
    super();
    this.logs = [];
    this.maxLogs = 1000;
  }

  log(level, message, metadata = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      metadata
    };

    this.logs.push(logEntry);

    // Mantener límite de logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  error(message, error = {}) {
    this.log(LogLevel.ERROR, message, { error: error.message || error });
  }

  warn(message, metadata = {}) {
    this.log(LogLevel.WARN, message, metadata);
  }

  info(message, metadata = {}) {
    this.log(LogLevel.INFO, message, metadata);
  }

  debug(message, metadata = {}) {
    this.log(LogLevel.DEBUG, message, metadata);
  }

  /**
   * Obtiene todos los logs
   * @returns {Array} - Array de logs
   */
  getLogs() {
    return [...this.logs];
  }

  /**
   * Limpia todos los logs
   */
  clear() {
    this.logs = [];
  }

  /**
   * Filtra logs por nivel
   * @param {number} level - Nivel mínimo
   * @returns {Array} - Logs filtrados
   */
  getLogsByLevel(level) {
    return this.logs.filter(log => log.level >= level);
  }
}

/**
 * @class MetricsCollector
 * Recolector de métricas de aplicación
 */
export class MetricsCollector {
  constructor() {
    this.metrics = new Map();
    this.counters = new Map();
    this.timers = new Map();
  }

  /**
   * Incrementa un contador
   * @param {string} name - Nombre del contador
   * @param {number} value - Valor a incrementar
   * @param {Object} tags - Etiquetas
   */
  incrementCounter(name, value = 1, tags = {}) {
    const key = this._createKey(name, tags);
    this.counters.set(key, (this.counters.get(key) || 0) + value);
  }

  /**
   * Registra una métrica de valor
   * @param {string} name - Nombre de la métrica
   * @param {number} value - Valor
   * @param {Object} tags - Etiquetas
   */
  recordMetric(name, value, tags = {}) {
    const key = this._createKey(name, tags);
    const values = this.metrics.get(key) || [];
    values.push({
      value,
      timestamp: Date.now()
    });
    this.metrics.set(key, values);
  }

  /**
   * Inicia un temporizador
   * @param {string} name - Nombre del temporizador
   * @param {Object} tags - Etiquetas
   * @returns {string} - ID del temporizador
   */
  startTimer(name, tags = {}) {
    const id = `${name}_${Date.now()}_${Math.random()}`;
    this.timers.set(id, {
      name,
      tags,
      startTime: Date.now()
    });
    return id;
  }

  /**
   * Detiene un temporizador
   * @param {string} timerId - ID del temporizador
   * @returns {number} - Duración en ms
   */
  stopTimer(timerId) {
    const timer = this.timers.get(timerId);
    if (!timer) {
      throw new Error(`Timer not found: ${timerId}`);
    }

    const duration = Date.now() - timer.startTime;
    this.recordMetric(`${timer.name}_duration`, duration, timer.tags);
    this.timers.delete(timerId);
    return duration;
  }

  /**
   * Crea clave para métricas
   * @private
   * @param {string} name - Nombre
   * @param {Object} tags - Etiquetas
   * @returns {string} - Clave
   */
  _createKey(name, tags) {
    const tagStr = Object.entries(tags)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}:${v}`)
      .join(',');
    return tagStr ? `${name}{${tagStr}}` : name;
  }

  /**
   * Obtiene todas las métricas
   * @returns {Object} - Métricas
   */
  getMetrics() {
    return {
      counters: Object.fromEntries(this.counters),
      metrics: Object.fromEntries(this.metrics),
      activeTimers: this.timers.size
    };
  }

  /**
   * Limpia todas las métricas
   */
  reset() {
    this.metrics.clear();
    this.counters.clear();
    this.timers.clear();
  }
}

/**
 * @class MonitoringService
 * Servicio principal de monitoreo
 */
export class MonitoringService {
  constructor(logger = new ConsoleLogger()) {
    this.logger = logger;
    this.metrics = new MetricsCollector();
    this.startTime = Date.now();
  }

  /**
   * Registra evento de negocio
   * @param {string} event - Nombre del evento
   * @param {Object} data - Datos del evento
   */
  logBusinessEvent(event, data = {}) {
    this.logger.info(`Business Event: ${event}`, { event, ...data });
    this.metrics.incrementCounter('business_events', 1, { event });
  }

  /**
   * Registra error de aplicación
   * @param {string} operation - Operación que falló
   * @param {Error} error - Error ocurrido
   * @param {Object} context - Contexto adicional
   */
  logApplicationError(operation, error, context = {}) {
    this.logger.error(`Application Error in ${operation}`, error);
    this.metrics.incrementCounter('application_errors', 1, { 
      operation, 
      errorType: error.constructor.name 
    });
  }

  /**
   * Registra métrica de performance
   * @param {string} operation - Operación medida
   * @param {number} duration - Duración en ms
   * @param {Object} context - Contexto
   */
  logPerformanceMetric(operation, duration, context = {}) {
    this.logger.debug(`Performance: ${operation}`, { duration, ...context });
    this.metrics.recordMetric('operation_duration', duration, { 
      operation, 
      ...context 
    });
  }

  /**
   * Obtiene estado de salud de la aplicación
   * @returns {Object} - Estado de salud
   */
  getHealthStatus() {
    const uptime = Date.now() - this.startTime;
    const metrics = this.metrics.getMetrics();
    
    return {
      status: 'healthy',
      uptime,
      timestamp: new Date().toISOString(),
      metrics: {
        totalErrors: metrics.counters['application_errors'] || 0,
        totalEvents: metrics.counters['business_events'] || 0,
        activeTimers: metrics.activeTimers
      }
    };
  }

  /**
   * Genera reporte de monitoreo
   * @returns {Object} - Reporte completo
   */
  generateMonitoringReport() {
    return {
      healthStatus: this.getHealthStatus(),
      metrics: this.metrics.getMetrics(),
      uptime: Date.now() - this.startTime
    };
  }
}

// Instancia global para uso en la aplicación
export const monitoringService = new MonitoringService();