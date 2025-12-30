/**
 * @fileoverview Base Repository Interface
 * Define el contrato para todos los repositorios
 * Principios SOLID: ISP (Interface Segregation), DIP (Dependency Inversion)
 */

/**
 * @interface IRepository
 * Define las operaciones CRUD básicas
 */
export class IRepository {
  /**
   * Crea una nueva entidad
   * @param {Object} entity - Datos de la entidad
   * @returns {Promise<Object>} - Entidad creada
   */
  async create(entity) {
    throw new Error('Method create must be implemented');
  }

  /**
   * Obtiene una entidad por su ID
   * @param {string} id - ID de la entidad
   * @returns {Promise<Object|null>} - Entidad encontrada o null
   */
  async findById(id) {
    throw new Error('Method findById must be implemented');
  }

  /**
   * Obtiene todas las entidades
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Array>} - Lista de entidades
   */
  async findAll(filters = {}) {
    throw new Error('Method findAll must be implemented');
  }

  /**
   * Actualiza una entidad
   * @param {string} id - ID de la entidad
   * @param {Object} updates - Datos a actualizar
   * @returns {Promise<Object>} - Entidad actualizada
   */
  async update(id, updates) {
    throw new Error('Method update must be implemented');
  }

  /**
   * Elimina una entidad
   * @param {string} id - ID de la entidad
   * @returns {Promise<boolean>} - true si se eliminó
   */
  async delete(id) {
    throw new Error('Method delete must be implemented');
  }
}

/**
 * @interface ITrainingRepository
 * Extiende IRepository con operaciones específicas de capacitaciones
 */
export class ITrainingRepository extends IRepository {
  /**
   * Obtiene capacitaciones verificadas
   * @returns {Promise<Array>} - Capacitaciones verificadas
   */
  async findVerified() {
    throw new Error('Method findVerified must be implemented');
  }

  /**
   * Verifica una capacitación
   * @param {string} id - ID de la capacitación
   * @returns {Promise<boolean>} - true si se verificó
   */
  async verify(id) {
    throw new Error('Method verify must be implemented');
  }
}

/**
 * @interface IFileRepository
 * Define operaciones para gestión de archivos
 */
export class IFileRepository {
  /**
   * Sube un archivo
   * @param {File} file - Archivo a subir
   * @param {string} path - Ruta destino
   * @returns {Promise<string>} - URL del archivo
   */
  async upload(file, path) {
    throw new Error('Method upload must be implemented');
  }

  /**
   * Elimina un archivo
   * @param {string} path - Ruta del archivo
   * @returns {Promise<boolean>} - true si se eliminó
   */
  async delete(path) {
    throw new Error('Method delete must be implemented');
  }

  /**
   * Obtiene URL de descarga
   * @param {string} path - Ruta del archivo
   * @returns {Promise<string>} - URL de descarga
   */
  async getUrl(path) {
    throw new Error('Method getUrl must be implemented');
  }
}