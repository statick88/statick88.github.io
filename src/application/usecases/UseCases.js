/**
 * @fileoverview Use Cases - Application Use Cases
 * Casos de uso según Clean Architecture
 * Application Layer - Coordinación entre Domain y Infrastructure
 */

/**
 * @class UseCase
 * Clase base para Use Cases
 * Define la estructura común para todos los casos de uso
 */
export class UseCase {
  /**
   * @param {Repository} repository - Repositorio a utilizar
   */
  constructor(repository) {
    this.repository = repository;
  }

  /**
   * Método principal que debe ser implementado
   * @protected
   * @param {Object} params - Parámetros del caso de uso
   * @returns {Promise<Object>} - Resultado del caso de uso
   */
  async execute(_params) {
    throw new Error('Execute method must be implemented by subclass');
  }

  /**
   * Maneja errores de forma consistente
   * @protected
   * @param {Error} error - Error ocurrido
   * @param {string} operation - Operación que falló
   * @returns {Object} - Respuesta de error estandarizada
   */
  handleError(error, operation) {
    return {
      success: false,
      error: error.message,
      operation,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * @class CreateUserUseCase
 * Caso de uso: Crear un nuevo usuario
 * Application Layer - Orquesta creación de usuarios
 */
export class CreateUserUseCase extends UseCase {
  /**
   * @param {UserRepository} userRepository - Repositorio de usuarios
   */
  constructor(userRepository) {
    super(userRepository);
    this.userRepository = userRepository;
  }

  /**
   * Crea un nuevo usuario
   * @param {Object} params - Parámetros de creación
   * @param {string} params.email - Email del usuario
   * @param {string} params.displayName - Nombre a mostrar
   * @param {string} params.password - Contraseña
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async execute({ email, displayName, password }) {
    try {
      // Validar parámetros
      this._validateParams({ email, displayName, password });

      // Verificar si ya existe
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Crear entidad de dominio
      const user = new (await import('../entities/User.js')).User({
        id: this._generateId(),
        email,
        displayName,
        createdAt: new Date()
      });

      // Guardar usando el repositorio
      const savedUser = await this.userRepository.save(user.toObject());

      return {
        success: true,
        user: {
          id: savedUser.id,
          email: savedUser.email,
          displayName: savedUser.displayName,
          createdAt: savedUser.createdAt
        },
        message: 'User created successfully'
      };

    } catch (error) {
      return this.handleError(error, 'createUser');
    }
  }

  /**
   * Valida parámetros de entrada
   * @private
   * @param {Object} params - Parámetros a validar
   * @throws {Error} Si los parámetros no son válidos
   */
  _validateParams({ email, displayName, password }) {
    if (!email || typeof email !== 'string') {
      throw new Error('Email is required and must be a string');
    }

    if (!displayName || typeof displayName !== 'string') {
      throw new Error('Display name is required and must be a string');
    }

    if (!password || typeof password !== 'string') {
      throw new Error('Password is required and must be a string');
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
  }

  /**
   * Genera un ID único
   * @private
   * @returns {string} ID único
   */
  _generateId() {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * @class AuthenticateUserUseCase
 * Caso de uso: Autenticar un usuario
 * Application Layer - Orquesta autenticación
 */
export class AuthenticateUserUseCase extends UseCase {
  /**
   * @param {UserRepository} userRepository - Repositorio de usuarios
   */
  constructor(userRepository) {
    super(userRepository);
    this.userRepository = userRepository;
  }

  /**
   * Autentica un usuario
   * @param {Object} params - Parámetros de autenticación
   * @param {string} params.email - Email del usuario
   * @param {string} params.password - Contraseña
   * @returns {Promise<Object>} - Resultado de la autenticación
   */
  async execute({ email, password }) {
    try {
      // Validar parámetros
      this._validateParams({ email, password });

      // Buscar usuario por email
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Aquí iría la lógica de verificación de contraseña
      // Para este ejemplo, simulamos la verificación
      const isValidPassword = await this._verifyPassword(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      // Actualizar último acceso
      await this.userRepository.update(user.id, {
        lastLoginAt: new Date()
      });

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName
        },
        token: this._generateToken(user),
        message: 'Authentication successful'
      };

    } catch (error) {
      return this.handleError(error, 'authenticateUser');
    }
  }

  /**
   * Valida parámetros de autenticación
   * @private
   * @param {Object} params - Parámetros a validar
   * @throws {Error} Si los parámetros no son válidos
   */
  _validateParams({ email, password }) {
    if (!email || typeof email !== 'string') {
      throw new Error('Email is required and must be a string');
    }

    if (!password || typeof password !== 'string') {
      throw new Error('Password is required and must be a string');
    }
  }

  /**
   * Verifica la contraseña (simulado)
   * @private
   * @param {string} inputPassword - Contraseña ingresada
   * @param {string} storedPassword - Contraseña almacenada
   * @returns {Promise<boolean>} - true si es válida
   */
  async _verifyPassword(inputPassword, storedPassword) {
    // En un caso real, aquí iría bcrypt o similar
    return inputPassword === storedPassword;
  }

  /**
   * Genera un token JWT (simulado)
   * @private
   * @param {Object} user - Usuario autenticado
   * @returns {string} Token generado
   */
  _generateToken(user) {
    return Buffer.from(JSON.stringify({
      id: user.id,
      email: user.email,
      exp: Date.now() + 24 * 60 * 60 * 1000 // 24 horas
    })).toString('base64');
  }
}

/**
 * @class CreateTrainingUseCase
 * Caso de uso: Crear una nueva capacitación
 * Application Layer - Orquesta creación de capacitaciones
 */
export class CreateTrainingUseCase extends UseCase {
  /**
   * @param {TrainingRepository} trainingRepository - Repositorio de capacitaciones
   * @param {FileRepository} fileRepository - Repositorio de archivos
   */
  constructor(trainingRepository, fileRepository) {
    super(trainingRepository);
    this.trainingRepository = trainingRepository;
    this.fileRepository = fileRepository;
  }

  /**
   * Crea una nueva capacitación
   * @param {Object} params - Parámetros de creación
   * @param {Object} params.trainingData - Datos de la capacitación
   * @param {File} params.file - Archivo PDF
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async execute({ trainingData, file }) {
    try {
      // Validar parámetros
      this._validateParams({ trainingData, file });

      // Generar nombre único para el archivo
      const fileName = this._generateFileName(file.name);

      // Subir archivo
      const pdfUrl = await this.fileRepository.save(file, fileName);

      // Crear entidad de dominio
      const Training = (await import('../entities/Training.js')).Training;
      const training = new Training({
        ...trainingData,
        id: this._generateId(),
        pdfUrl,
        fileName,
        verified: false,
        createdAt: new Date()
      });

      // Guardar usando el repositorio
      const savedTraining = await this.trainingRepository.save(training.toObject());

      return {
        success: true,
        training: {
          id: savedTraining.id,
          title: savedTraining.title,
          institution: savedTraining.institution,
          date: savedTraining.date,
          pdfUrl: savedTraining.pdfUrl,
          verified: savedTraining.verified
        },
        message: 'Training created successfully'
      };

    } catch (error) {
      return this.handleError(error, 'createTraining');
    }
  }

  /**
   * Valida parámetros de creación
   * @private
   * @param {Object} params - Parámetros a validar
   * @throws {Error} Si los parámetros no son válidos
   */
  _validateParams({ trainingData, file }) {
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
  }

  /**
   * Genera un ID único
   * @private
   * @returns {string} ID único
   */
  _generateId() {
    return `training_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Genera nombre de archivo único
   * @private
   * @param {string} originalName - Nombre original
   * @returns {string} Nombre único
   */
  _generateFileName(originalName) {
    const timestamp = Date.now();
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `trainings/${timestamp}_${sanitizedName}`;
  }
}

/**
 * @class GetVerifiedTrainingsUseCase
 * Caso de uso: Obtener capacitaciones verificadas
 * Application Layer - Orquesta consulta de capacitaciones
 */
export class GetVerifiedTrainingsUseCase extends UseCase {
  /**
   * @param {TrainingRepository} trainingRepository - Repositorio de capacitaciones
   */
  constructor(trainingRepository) {
    super(trainingRepository);
    this.trainingRepository = trainingRepository;
  }

  /**
   * Obtiene capacitaciones verificadas
   * @param {Object} params - Parámetros de consulta (opcional)
   * @param {Object} params.pagination - Opciones de paginación
   * @param {Object} params.filters - Filtros adicionales
   * @returns {Promise<Object>} - Resultado de la consulta
   */
  async execute(params = {}) {
    try {
      const { pagination = {}, filters = {} } = params;

      // Obtener capacitaciones verificadas
      const verifiedTrainings = await this.trainingRepository.findVerified();

      // Aplicar filtros adicionales
      let filteredTrainings = verifiedTrainings;
      if (filters.institution) {
        filteredTrainings = filteredTrainings.filter(
          training => training.institution.toLowerCase().includes(filters.institution.toLowerCase())
        );
      }

      // Aplicar paginación
      const { page = 1, limit = 10 } = pagination;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedTrainings = filteredTrainings.slice(startIndex, endIndex);

      return {
        success: true,
        trainings: paginatedTrainings,
        pagination: {
          page,
          limit,
          total: filteredTrainings.length,
          pages: Math.ceil(filteredTrainings.length / limit)
        },
        message: 'Verified trainings retrieved successfully'
      };

    } catch (error) {
      return this.handleError(error, 'getVerifiedTrainings');
    }
  }
}

/**
 * @class VerifyTrainingUseCase
 * Caso de uso: Verificar una capacitación (admin)
 * Application Layer - Orquesta verificación de capacitaciones
 */
export class VerifyTrainingUseCase extends UseCase {
  /**
   * @param {TrainingRepository} trainingRepository - Repositorio de capacitaciones
   */
  constructor(trainingRepository) {
    super(trainingRepository);
    this.trainingRepository = trainingRepository;
  }

  /**
   * Verifica una capacitación
   * @param {Object} params - Parámetros de verificación
   * @param {string} params.trainingId - ID de la capacitación
   * @returns {Promise<Object>} - Resultado de la verificación
   */
  async execute({ trainingId }) {
    try {
      // Validar parámetros
      this._validateParams({ trainingId });

      // Buscar capacitación
      const training = await this.trainingRepository.findById(trainingId);
      if (!training) {
        throw new Error('Training not found');
      }

      // Verificar la capacitación usando el repositorio
      await this.trainingRepository.updateVerificationStatus(trainingId, true);

      return {
        success: true,
        training: {
          id: training.id,
          title: training.title,
          verified: true,
          verifiedAt: new Date()
        },
        message: 'Training verified successfully'
      };

    } catch (error) {
      return this.handleError(error, 'verifyTraining');
    }
  }

  /**
   * Valida parámetros de verificación
   * @private
   * @param {Object} params - Parámetros a validar
   * @throws {Error} Si los parámetros no son válidos
   */
  _validateParams({ trainingId }) {
    if (!trainingId || typeof trainingId !== 'string') {
      throw new Error('Training ID is required and must be a string');
    }
  }
}