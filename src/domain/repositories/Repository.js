/**
 * @fileoverview Domain Repository Interface
 * Contratos de repositorios según Clean Architecture
 * Domain Layer - No depende de infraestructura
 */

/**
 * @interface Repository
 * Interfaz genérica para repositorios
 * Define el contrato que deben cumplir todos los repositorios
 */
export class Repository {
  /**
   * Guarda una entidad
   * @param {Object} entity - Entidad a guardar
   * @returns {Promise<Object>} - Entidad guardada con ID
   * @throws {Error} Si no se puede guardar
   */
  async save(_entity) {
    throw new Error('Method save must be implemented');
  }

  /**
   * Busca una entidad por ID
   * @param {string} id - ID de la entidad
   * @returns {Promise<Object|null>} - Entidad encontrada o null
   */
  async findById(_id) {
    throw new Error('Method findById must be implemented');
  }

  /**
   * Busca todas las entidades
   * @param {Object} criteria - Criterios de búsqueda (opcional)
   * @returns {Promise<Array>} - Lista de entidades
   */
  async findAll(_criteria = {}) {
    throw new Error('Method findAll must be implemented');
  }

  /**
   * Actualiza una entidad
   * @param {string} id - ID de la entidad
   * @param {Object} updates - Datos a actualizar
   * @returns {Promise<Object>} - Entidad actualizada
   * @throws {Error} Si no se puede actualizar
   */
  async update(_id, _updates) {
    throw new Error('Method update must be implemented');
  }

  /**
   * Elimina una entidad
   * @param {string} id - ID de la entidad
   * @returns {Promise<boolean>} - true si se eliminó
   * @throws {Error} Si no se puede eliminar
   */
  async delete(_id) {
    throw new Error('Method delete must be implemented');
  }

  /**
   * Cuenta entidades según criterios
   * @param {Object} criteria - Criterios de conteo
   * @returns {Promise<number>} - Número de entidades
   */
  async count(_criteria = {}) {
    throw new Error('Method count must be implemented');
  }

  /**
   * Verifica si existe una entidad
   * @param {string} id - ID a verificar
   * @returns {Promise<boolean>} - true si existe
   */
  async exists(id) {
    const entity = await this.findById(id);
    return entity !== null;
  }
}

/**
 * @interface UserRepository
 * Interfaz específica para repositorio de usuarios
 * Define operaciones específicas del dominio de usuarios
 */
export class UserRepository extends Repository {
  /**
   * Busca usuario por email
   * @param {string} email - Email del usuario
   * @returns {Promise<Object|null>} - Usuario encontrado o null
   */
  async findByEmail(_email) {
    throw new Error('Method findByEmail must be implemented');
  }

  /**
   * Busca usuarios activos
   * @returns {Promise<Array>} - Lista de usuarios activos
   */
  async findActive() {
    throw new Error('Method findActive must be implemented');
  }

  /**
   * Busca usuarios por criterios avanzados
   * @param {Object} criteria - Criterios de búsqueda
   * @param {Object} options - Opciones de paginación y ordenamiento
   * @returns {Promise<{users: Array, total: number}>} - Resultados paginados
   */
  async findWithCriteria(_criteria, _options = {}) {
    throw new Error('Method findWithCriteria must be implemented');
  }

  /**
   * Actualiza estado de actividad del usuario
   * @param {string} id - ID del usuario
   * @param {boolean} active - Nuevo estado de actividad
   * @returns {Promise<boolean>} - true si se actualizó
   */
  async updateActiveStatus(_id, _active) {
    throw new Error('Method updateActiveStatus must be implemented');
  }
}

/**
 * @interface TrainingRepository
 * Interfaz específica para repositorio de capacitaciones
 * Define operaciones específicas del dominio de capacitaciones
 */
export class TrainingRepository extends Repository {
  /**
   * Busca capacitaciones verificadas
   * @returns {Promise<Array>} - Lista de capacitaciones verificadas
   */
  async findVerified() {
    throw new Error('Method findVerified must be implemented');
  }

  /**
   * Busca capacitaciones por institución
   * @param {string} institution - Institución a buscar
   * @returns {Promise<Array>} - Lista de capacitaciones de la institución
   */
  async findByInstitution(_institution) {
    throw new Error('Method findByInstitution must be implemented');
  }

  /**
   * Busca capacitaciones por rango de fechas
   * @param {Date} startDate - Fecha de inicio
   * @param {Date} endDate - Fecha de fin
   * @returns {Promise<Array>} - Lista de capacitaciones en el rango
   */
  async findByDateRange(_startDate, _endDate) {
    throw new Error('Method findByDateRange must be implemented');
  }

  /**
   * Busca capacitaciones con paginación
   * @param {Object} criteria - Criterios de búsqueda
   * @param {Object} pagination - Opciones de paginación
   * @returns {Promise<{trainings: Array, total: number, page: number}>} - Resultados paginados
   */
  async findWithPagination(_criteria, _pagination) {
    throw new Error('Method findWithPagination must be implemented');
  }

  /**
   * Actualiza estado de verificación
   * @param {string} id - ID de la capacitación
   * @param {boolean} verified - Estado de verificación
   * @returns {Promise<boolean>} - true si se actualizó
   */
  async updateVerificationStatus(_id, _verified) {
    throw new Error('Method updateVerificationStatus must be implemented');
  }

  /**
   * Busca capacitaciones recientes
   * @param {number} days - Días hacia atrás
   * @param {number} limit - Límite de resultados
   * @returns {Promise<Array>} - Lista de capacitaciones recientes
   */
  async findRecent(_days = 30, _limit = 10) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - _days);
    
    return this.findByDateRange(cutoffDate, new Date());
  }

  /**
   * Obtiene estadísticas de capacitaciones
   * @returns {Promise<Object>} - Estadísticas
   */
  async getStatistics() {
    const [total, verified, recent] = await Promise.all([
      this.count(),
      this.count({ verified: true }),
      this.findRecent(30, 100)
    ]);

    return {
      total,
      verified,
      pending: total - verified,
      recentCount: recent.length
    };
  }
}

/**
 * @interface FileRepository
 * Interfaz para repositorio de archivos
 * Define operaciones de gestión de archivos
 */
export class FileRepository extends Repository {
  /**
   * Guarda un archivo
   * @param {File} file - Archivo a guardar
   * @param {string} path - Ruta de destino
   * @returns {Promise<string>} - URL del archivo guardado
   * @throws {Error} Si no se puede guardar
   */
  async save(_file, _path) {
    throw new Error('Method save must be implemented');
  }

  /**
   * Elimina un archivo
   * @param {string} path - Ruta del archivo
   * @returns {Promise<boolean>} - true si se eliminó
   * @throws {Error} Si no se puede eliminar
   */
  async delete(_path) {
    throw new Error('Method delete must be implemented');
  }

  /**
   * Obtiene URL de un archivo
   * @param {string} path - Ruta del archivo
   * @returns {Promise<string>} - URL del archivo
   * @throws {Error} Si no se puede obtener
   */
  async getUrl(_path) {
    throw new Error('Method getUrl must be implemented');
  }

  /**
   * Valida si un archivo existe
   * @param {string} path - Ruta del archivo
   * @returns {Promise<boolean>} - true si existe
   */
  async exists(_path) {
    throw new Error('Method exists must be implemented');
  }

  /**
   * Obtiene información de un archivo
   * @param {string} path - Ruta del archivo
   * @returns {Promise<Object>} - Información del archivo
   * @throws {Error} Si no se puede obtener
   */
  async getFileInfo(_path) {
    throw new Error('Method getFileInfo must be implemented');
  }
}