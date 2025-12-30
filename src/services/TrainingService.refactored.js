/**
 * @fileoverview Refactored Training Service
 * Gestiona operaciones de capacitaciones usando inyección de dependencias
 * Principios SOLID: SRP, OCP, LSP, ISP, DIP
 */

import { BaseService } from './BaseService.js';

/**
 * @class TrainingValidator
 * Clase dedicada a validaciones (SRP)
 */
export class TrainingValidator {
  /**
   * Valida archivo PDF
   * @param {File} file - Archivo a validar
   * @throws {Error} - Si el archivo no es válido
   */
  static validateFile(file) {
    if (!file) {
      throw new Error('El archivo es requerido');
    }
    
    if (file.type !== 'application/pdf') {
      throw new Error('Solo se permiten archivos PDF');
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB
      throw new Error('El archivo no puede superar los 10MB');
    }
  }

  /**
   * Valida datos de capacitación
   * @param {Object} trainingData - Datos a validar
   * @throws {Error} - Si los datos no son válidos
   */
  static validateTrainingData(trainingData) {
    if (!trainingData) {
      throw new Error('Los datos de la capacitación son requeridos');
    }
    
    if (!trainingData.title || typeof trainingData.title !== 'string') {
      throw new Error('El título es requerido y debe ser texto');
    }
    
    if (!trainingData.institution || typeof trainingData.institution !== 'string') {
      throw new Error('La institución es requerida y debe ser texto');
    }
    
    if (!trainingData.date) {
      throw new Error('La fecha es requerida');
    }
  }
}

/**
 * @class TrainingSanitizer
 * Clase dedicada a sanitización (SRP)
 */
export class TrainingSanitizer {
  /**
   * Sanitiza entrada de texto
   * @param {string} input - Input a sanitizar
   * @returns {string} - Input sanitizado
   */
  static sanitizeInput(input) {
    if (!input || typeof input !== 'string') {
      return '';
    }
    
    return input
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Prevenir XSS
      .replace(/[<>]/g, '') // Remover caracteres HTML
      .substring(0, 255); // Limitar longitud
  }

  /**
   * Sanitiza datos completos de capacitación
   * @param {Object} trainingData - Datos a sanitizar
   * @returns {Object} - Datos sanitizados
   */
  static sanitizeTrainingData(trainingData) {
    return {
      title: this.sanitizeInput(trainingData.title),
      institution: this.sanitizeInput(trainingData.institution),
      description: this.sanitizeInput(trainingData.description || ''),
      date: new Date(trainingData.date)
    };
  }
}

/**
 * @class TrainingFileHandler
 * Clase dedicada al manejo de archivos (SRP)
 */
export class TrainingFileHandler {
  /**
   * Genera nombre de archivo único
   * @param {File} file - Archivo original
   * @returns {string} - Nombre único del archivo
   */
  static generateFileName(file) {
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `trainings/${timestamp}_${sanitizedName}`;
  }

  /**
   * Prepara entidad de capacitación con archivo
   * @param {Object} trainingData - Datos sanitizados
   * @param {string} pdfUrl - URL del PDF
   * @param {string} fileName - Nombre del archivo
   * @returns {Object} - Entidad completa
   */
  static prepareEntity(trainingData, pdfUrl, fileName) {
    return {
      ...trainingData,
      pdfUrl,
      fileName,
      verified: false
    };
  }
}

/**
 * @class TrainingService
 * Servicio principal con inyección de dependencias (DIP)
 */
export class TrainingService extends BaseService {
  /**
   * @param {ITrainingRepository} trainingRepository - Repositorio de datos
   * @param {IFileRepository} fileRepository - Repositorio de archivos
   */
  constructor(trainingRepository, fileRepository) {
    super('TrainingService');
    this.trainingRepository = trainingRepository;
    this.fileRepository = fileRepository;
  }

  /**
   * Crea una nueva capacitación
   * @param {Object} trainingData - Datos de la capacitación
   * @param {File} file - Archivo PDF
   * @returns {Promise<Object>} - Capacitación creada
   */
  async createTraining(trainingData, file) {
    this.log('INFO', 'Creando nueva capacitación', { title: trainingData.title });
    
    try {
      // Validación (SRP - Validator)
      TrainingValidator.validateTrainingData(trainingData);
      TrainingValidator.validateFile(file);
      
      // Sanitización (SRP - Sanitizer)
      const sanitizedData = TrainingSanitizer.sanitizeTrainingData(trainingData);
      
      // Manejo de archivos (SRP - FileHandler)
      const fileName = TrainingFileHandler.generateFileName(file);
      const pdfUrl = await this.fileRepository.upload(file, fileName);
      
      // Preparar entidad
      const trainingEntity = TrainingFileHandler.prepareEntity(
        sanitizedData, 
        pdfUrl, 
        fileName
      );
      
      // Persistencia (DIP - Repository)
      const createdTraining = await this.trainingRepository.create(trainingEntity);
      
      this.log('INFO', 'Capacitación creada exitosamente', { 
        id: createdTraining.id, 
        title: createdTraining.title 
      });
      
      return createdTraining;
      
    } catch (error) {
      this.log('ERROR', 'Error al crear capacitación', error);
      throw new Error(`No se pudo crear la capacitación: ${error.message}`);
    }
  }

  /**
   * Obtiene capacitaciones verificadas
   * @returns {Promise<Array>} - Lista de capacitaciones verificadas
   */
  async getVerifiedTrainings() {
    this.log('INFO', 'Obteniendo capacitaciones verificadas');
    
    try {
      const trainings = await this.trainingRepository.findVerified();
      this.log('INFO', `Se encontraron ${trainings.length} capacitaciones verificadas`);
      return trainings;
    } catch (error) {
      this.log('ERROR', 'Error al obtener capacitaciones', error);
      return [];
    }
  }

  /**
   * Obtiene todas las capacitaciones
   * @returns {Promise<Array>} - Lista completa de capacitaciones
   */
  async getAllTrainings() {
    this.log('INFO', 'Obteniendo todas las capacitaciones');
    
    try {
      const trainings = await this.trainingRepository.findAll();
      this.log('INFO', `Se encontraron ${trainings.length} capacitaciones en total`);
      return trainings;
    } catch (error) {
      this.log('ERROR', 'Error al obtener todas las capacitaciones', error);
      return [];
    }
  }

  /**
   * Verifica una capacitación
   * @param {string} trainingId - ID de la capacitación
   * @returns {Promise<boolean>} - true si se verificó
   */
  async verifyTraining(trainingId) {
    this.log('INFO', 'Verificando capacitación', { trainingId });
    
    try {
      await this.trainingRepository.verify(trainingId);
      this.log('INFO', 'Capacitación verificada exitosamente', { trainingId });
      return true;
    } catch (error) {
      this.log('ERROR', 'Error al verificar capacitación', error);
      throw new Error(`No se pudo verificar la capacitación: ${error.message}`);
    }
  }

  /**
   * Elimina una capacitación
   * @param {string} trainingId - ID de la capacitación
   * @returns {Promise<boolean>} - true si se eliminó
   */
  async deleteTraining(trainingId) {
    this.log('INFO', 'Eliminando capacitación', { trainingId });
    
    try {
      // Obtener datos para eliminar archivo
      const training = await this.trainingRepository.findById(trainingId);
      if (!training) {
        throw new Error('Capacitación no encontrada');
      }
      
      // Eliminar archivo (si existe)
      if (training.fileName) {
        await this.fileRepository.delete(training.fileName);
      }
      
      // Eliminar registro
      await this.trainingRepository.delete(trainingId);
      
      this.log('INFO', 'Capacitación eliminada exitosamente', { trainingId });
      return true;
      
    } catch (error) {
      this.log('ERROR', 'Error al eliminar capacitación', error);
      throw new Error(`No se pudo eliminar la capacitación: ${error.message}`);
    }
  }
}