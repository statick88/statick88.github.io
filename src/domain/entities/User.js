/**
 * @fileoverview Domain Entity - User
 * Entidad de dominio principal del sistema
 * Clean Architecture - Domain Layer
 */

/**
 * @class User
 * Entidad de dominio que representa a un usuario en el sistema
 * Sigue principios de Clean Code y Clean Architecture
 */
export class User {
  /**
   * @param {Object} userData - Datos del usuario
   * @param {string} userData.id - ID único del usuario
   * @param {string} userData.email - Email del usuario
   * @param {string} userData.displayName - Nombre a mostrar
   * @param {Date} userData.createdAt - Fecha de creación
   */
  constructor({ id, email, displayName, createdAt }) {
    this._validateUserData({ id, email, displayName, createdAt });
    
    this.id = id;
    this.email = email;
    this.displayName = displayName;
    this.createdAt = createdAt;
    this._updatedAt = createdAt;
  }

  /**
   * Obtiene el ID del usuario
   * @returns {string} ID del usuario
   */
  getId() {
    return this.id;
  }

  /**
   * Obtiene el email del usuario
   * @returns {string} Email del usuario
   */
  getEmail() {
    return this.email;
  }

  /**
   * Obtiene el nombre a mostrar
   * @returns {string} Nombre a mostrar
   */
  getDisplayName() {
    return this.displayName;
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
   * Actualiza el email del usuario
   * @param {string} newEmail - Nuevo email
   * @throws {Error} Si el email no es válido
   */
  updateEmail(newEmail) {
    this._validateEmail(newEmail);
    this.email = newEmail;
    this._updatedAt = new Date();
  }

  /**
   * Actualiza el nombre a mostrar
   * @param {string} newDisplayName - Nuevo nombre
   * @throws {Error} Si el nombre no es válido
   */
  updateDisplayName(newDisplayName) {
    this._validateDisplayName(newDisplayName);
    this.displayName = newDisplayName;
    this._updatedAt = new Date();
  }

  /**
   * Verifica si el usuario está activo
   * @returns {boolean} true si está activo
   */
  isActive() {
    return this.id && this.email && this.createdAt;
  }

  /**
   * Convierte el usuario a objeto plano
   * @returns {Object} Representación plana del usuario
   */
  toObject() {
    return {
      id: this.id,
      email: this.email,
      displayName: this.displayName,
      createdAt: this.createdAt,
      updatedAt: this._updatedAt
    };
  }

  /**
   * Crea un usuario desde objeto plano
   * @param {Object} userData - Datos del usuario
   * @returns {User} Instancia de User
   */
  static fromObject(userData) {
    return new User({
      id: userData.id,
      email: userData.email,
      displayName: userData.displayName,
      createdAt: new Date(userData.createdAt)
    });
  }

  /**
   * Valida datos del usuario
   * @private
   * @param {Object} userData - Datos a validar
   * @throws {Error} Si los datos no son válidos
   */
  _validateUserData({ id, email, displayName, createdAt }) {
    this._validateId(id);
    this._validateEmail(email);
    this._validateDisplayName(displayName);
    this._validateDate(createdAt);
  }

  /**
   * Valida el ID
   * @private
   * @param {string} id - ID a validar
   * @throws {Error} Si el ID no es válido
   */
  _validateId(id) {
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      throw new Error('User ID is required and must be a non-empty string');
    }
  }

  /**
   * Valida el email
   * @private
   * @param {string} email - Email a validar
   * @throws {Error} Si el email no es válido
   */
  _validateEmail(email) {
    if (!email || typeof email !== 'string') {
      throw new Error('Email is required and must be a string');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Email format is invalid');
    }
  }

  /**
   * Valida el nombre a mostrar
   * @private
   * @param {string} displayName - Nombre a validar
   * @throws {Error} Si el nombre no es válido
   */
  _validateDisplayName(displayName) {
    if (!displayName || typeof displayName !== 'string') {
      throw new Error('Display name is required and must be a string');
    }

    if (displayName.trim().length < 2) {
      throw new Error('Display name must be at least 2 characters long');
    }

    if (displayName.length > 100) {
      throw new Error('Display name cannot exceed 100 characters');
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