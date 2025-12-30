/**
 * @fileoverview Domain Entity - Training
 * Entidad de dominio para capacitaciones
 * Clean Architecture - Domain Layer
 */

/**
 * @class Training
 * Entidad de dominio que representa una capacitación
 * Sigue principios de Clean Code y Clean Architecture
 */
export class Training {
  /**
   * @param {Object} trainingData - Datos de la capacitación
   * @param {string} trainingData.id - ID único de la capacitación
   * @param {string} trainingData.title - Título de la capacitación
   * @param {string} trainingData.description - Descripción
   * @param {string} trainingData.institution - Institución
   * @param {Date} trainingData.date - Fecha de la capacitación
   * @param {string} trainingData.pdfUrl - URL del PDF
   * @param {string} trainingData.fileName - Nombre del archivo
   * @param {boolean} trainingData.verified - Si está verificada
   * @param {Date} trainingData.createdAt - Fecha de creación
   */
  constructor({
    id,
    title,
    description = '',
    institution,
    date,
    pdfUrl,
    fileName,
    verified = false,
    createdAt
  }) {
    this._validateTrainingData({
      id, title, institution, date, pdfUrl, fileName, createdAt
    });

    this.id = id;
    this.title = title;
    this.description = description;
    this.institution = institution;
    this.date = new Date(date);
    this.pdfUrl = pdfUrl;
    this.fileName = fileName;
    this.verified = verified;
    this.createdAt = new Date(createdAt);
    this._updatedAt = new Date(createdAt);
  }

  /**
   * Obtiene el ID de la capacitación
   * @returns {string} ID de la capacitación
   */
  getId() {
    return this.id;
  }

  /**
   * Obtiene el título
   * @returns {string} Título de la capacitación
   */
  getTitle() {
    return this.title;
  }

  /**
   * Obtiene la descripción
   * @returns {string} Descripción de la capacitación
   */
  getDescription() {
    return this.description;
  }

  /**
   * Obtiene la institución
   * @returns {string} Institución
   */
  getInstitution() {
    return this.institution;
  }

  /**
   * Obtiene la fecha
   * @returns {Date} Fecha de la capacitación
   */
  getDate() {
    return this.date;
  }

  /**
   * Obtiene la URL del PDF
   * @returns {string} URL del PDF
   */
  getPdfUrl() {
    return this.pdfUrl;
  }

  /**
   * Obtiene el nombre del archivo
   * @returns {string} Nombre del archivo
   */
  getFileName() {
    return this.fileName;
  }

  /**
   * Verifica si está verificada
   * @returns {boolean} true si está verificada
   */
  isVerified() {
    return this.verified;
  }

  /**
   * Obtiene la fecha de creación
   * @returns {Date} Fecha de creación
   */
  getCreatedAt() {
    return this.createdAt;
  }

  /**
   * Obtiene la fecha de última actualización
   * @returns {Date} Fecha de última actualización
   */
  getUpdatedAt() {
    return this._updatedAt;
  }

  /**
   * Verifica si la capacitación está completa
   * @returns {boolean} true si tiene todos los datos requeridos
   */
  isComplete() {
    return !!(
      this.id &&
      this.title &&
      this.institution &&
      this.date &&
      this.pdfUrl &&
      this.fileName
    );
  }

  /**
   * Verifica si la capacitación es pública (visible para todos)
   * @returns {boolean} true si es pública
   */
  isPublic() {
    return this.verified && this.isComplete();
  }

  /**
   * Actualiza el título
   * @param {string} newTitle - Nuevo título
   * @throws {Error} Si el título no es válido
   */
  updateTitle(newTitle) {
    this._validateTitle(newTitle);
    this.title = newTitle;
    this._updatedAt = new Date();
  }

  /**
   * Actualiza la descripción
   * @param {string} newDescription - Nueva descripción
   * @throws {Error} Si la descripción no es válida
   */
  updateDescription(newDescription) {
    this._validateDescription(newDescription);
    this.description = newDescription;
    this._updatedAt = new Date();
  }

  /**
   * Verifica la capacitación
   * @throws {Error} Si no se puede verificar
   */
  verify() {
    if (!this.isComplete()) {
      throw new Error('Cannot verify incomplete training');
    }

    this.verified = true;
    this._updatedAt = new Date();
  }

  /**
   * Desverifica la capacitación (función de admin)
   * @throws {Error} Si no se puede desverificar
   */
  unverify() {
    this.verified = false;
    this._updatedAt = new Date();
  }

  /**
   * Actualiza la información del PDF
   * @param {string} newPdfUrl - Nueva URL del PDF
   * @param {string} newFileName - Nuevo nombre del archivo
   * @throws {Error} Si los datos no son válidos
   */
  updatePdfInfo(newPdfUrl, newFileName) {
    this._validatePdfInfo(newPdfUrl, newFileName);
    this.pdfUrl = newPdfUrl;
    this.fileName = newFileName;
    this._updatedAt = new Date();
  }

  /**
   * Convierte la capacitación a objeto plano
   * @returns {Object} Representación plana
   */
  toObject() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      institution: this.institution,
      date: this.date,
      pdfUrl: this.pdfUrl,
      fileName: this.fileName,
      verified: this.verified,
      createdAt: this.createdAt,
      updatedAt: this._updatedAt
    };
  }

  /**
   * Crea una capacitación desde objeto plano
   * @param {Object} trainingData - Datos de la capacitación
   * @returns {Training} Instancia de Training
   */
  static fromObject(trainingData) {
    return new Training(trainingData);
  }

  /**
   * Crea una nueva capacitación sin verificar
   * @param {Object} trainingData - Datos básicos
   * @returns {Training} Nueva capacitación
   */
  static createNew(trainingData) {
    return new Training({
      ...trainingData,
      verified: false,
      createdAt: new Date()
    });
  }

  /**
   * Valida datos de la capacitación
   * @private
   * @param {Object} data - Datos a validar
   * @throws {Error} Si los datos no son válidos
   */
  _validateTrainingData(data) {
    this._validateId(data.id);
    this._validateTitle(data.title);
    this._validateInstitution(data.institution);
    this._validateDate(data.date);
    this._validatePdfInfo(data.pdfUrl, data.fileName);
    this._validateDate(data.createdAt);
  }

  /**
   * Valida el ID
   * @private
   * @param {string} id - ID a validar
   * @throws {Error} Si el ID no es válido
   */
  _validateId(id) {
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      throw new Error('Training ID is required and must be a non-empty string');
    }
  }

  /**
   * Valida el título
   * @private
   * @param {string} title - Título a validar
   * @throws {Error} Si el título no es válido
   */
  _validateTitle(title) {
    if (!title || typeof title !== 'string') {
      throw new Error('Title is required and must be a string');
    }

    if (title.trim().length < 3) {
      throw new Error('Title must be at least 3 characters long');
    }

    if (title.length > 200) {
      throw new Error('Title cannot exceed 200 characters');
    }
  }

  /**
   * Valida la descripción
   * @private
   * @param {string} description - Descripción a validar
   * @throws {Error} Si la descripción no es válida
   */
  _validateDescription(description) {
    if (description && typeof description !== 'string') {
      throw new Error('Description must be a string');
    }

    if (description && description.length > 1000) {
      throw new Error('Description cannot exceed 1000 characters');
    }
  }

  /**
   * Valida la institución
   * @private
   * @param {string} institution - Institución a validar
   * @throws {Error} Si la institución no es válida
   */
  _validateInstitution(institution) {
    if (!institution || typeof institution !== 'string') {
      throw new Error('Institution is required and must be a string');
    }

    if (institution.trim().length < 2) {
      throw new Error('Institution must be at least 2 characters long');
    }

    if (institution.length > 100) {
      throw new Error('Institution cannot exceed 100 characters');
    }
  }

  /**
   * Valida la información del PDF
   * @private
   * @param {string} pdfUrl - URL del PDF
   * @param {string} fileName - Nombre del archivo
   * @throws {Error} Si la información no es válida
   */
  _validatePdfInfo(pdfUrl, fileName) {
    if (!pdfUrl || typeof pdfUrl !== 'string') {
      throw new Error('PDF URL is required and must be a string');
    }

    if (!fileName || typeof fileName !== 'string') {
      throw new Error('File name is required and must be a string');
    }
  }

  /**
   * Valida la fecha
   * @private
   * @param {Date} date - Fecha a validar
   * @throws {Error} Si la fecha no es válida
   */
  _validateDate(date) {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error('Date is required and must be a valid Date');
    }
  }
}