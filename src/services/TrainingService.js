/**
 * @fileoverview Training Service
 * Gestiona operaciones CRUD para capacitaciones
 * Sigue principios SOLID: SRP, OCP, LSP, ISP, DIP
 */

import { BaseService } from './BaseService.js';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc,
  updateDoc,
  query,
  orderBy, 
  where,
  Timestamp 
} from "firebase/firestore";
import { 
  ref, 
  uploadBytes, 
  getDownloadURL,
  deleteObject 
} from "firebase/storage";
import { db, storage } from "@/firebase.js";

/**
 * @class TrainingService
 * Gestiona el ciclo de vida completo de las capacitaciones
 */
export class TrainingService extends BaseService {
  constructor() {
    super('TrainingService');
    this.collectionName = 'trainings';
  }

  /**
   * Crea una nueva capacitación
   * @param {Object} trainingData - Datos de la capacitación
   * @param {File} file - Archivo PDF de la capacitación
   * @returns {Promise<Object>} - Capacitación creada
   */
  async createTraining(trainingData, file) {
    this.log('INFO', 'Creando nueva capacitación', { title: trainingData.title });
    
    try {
      // Validar archivo (Principio de Validación)
      this.validateFile(file);
      
      // Subir archivo a Storage (Principio de Abstracción)
      const fileName = `${this.collectionName}/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, fileName);
      
      await uploadBytes(storageRef, file);
      const pdfUrl = await getDownloadURL(storageRef);
      
      // Preparar datos (Principio de Preparación)
      const trainingEntity = {
        title: this.sanitizeInput(trainingData.title),
        date: new Date(trainingData.date),
        description: this.sanitizeInput(trainingData.description || ''),
        institution: this.sanitizeInput(trainingData.institution),
        pdfUrl,
        fileName,
        verified: false,
        createdAt: Timestamp.now()
      };
      
      // Guardar en Firestore (Principio de Persistencia)
      const docRef = await addDoc(collection(db, this.collectionName), trainingEntity);
      
      this.log('INFO', 'Capacitación creada exitosamente', { 
        id: docRef.id, 
        title: trainingEntity.title 
      });
      
      return { id: docRef.id, ...trainingEntity };
      
    } catch (error) {
      this.log('ERROR', 'Error al crear capacitación', error);
      throw new Error(`No se pudo crear la capacitación: ${error.message}`);
    }
  }

  /**
   * Obtiene todas las capacitaciones verificadas
   * @returns {Promise<Array>} - Lista de capacitaciones verificadas
   */
  async getVerifiedTrainings() {
    this.log('INFO', 'Obteniendo capacitaciones verificadas');
    
    try {
      const trainingsQuery = query(
        collection(db, this.collectionName),
        where('verified', '==', true),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(trainingsQuery);
      const trainings = querySnapshot.docs.map(doc => this.mapDocToTraining(doc));
      
      this.log('INFO', `Se encontraron ${trainings.length} capacitaciones verificadas`);
      return trainings;
      
    } catch (error) {
      this.log('ERROR', 'Error al obtener capacitaciones', error);
      return [];
    }
  }

  /**
   * Obtiene todas las capacitaciones (solo admin)
   * @returns {Promise<Array>} - Lista completa de capacitaciones
   */
  async getAllTrainings() {
    this.log('INFO', 'Obteniendo todas las capacitaciones');
    
    try {
      const trainingsQuery = query(
        collection(db, this.collectionName),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(trainingsQuery);
      const trainings = querySnapshot.docs.map(doc => this.mapDocToTraining(doc));
      
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
   * @returns {Promise<boolean>} - true si se verificó exitosamente
   */
  async verifyTraining(trainingId) {
    this.log('INFO', 'Verificando capacitación', { trainingId });
    
    try {
      const docRef = doc(db, this.collectionName, trainingId);
      await updateDoc(docRef, { 
        verified: true,
        verifiedAt: Timestamp.now()
      });
      
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
   * @param {string} fileName - Nombre del archivo en Storage
   * @returns {Promise<boolean>} - true si se eliminó exitosamente
   */
  async deleteTraining(trainingId, fileName) {
    this.log('INFO', 'Eliminando capacitación', { trainingId, fileName });
    
    try {
      // Eliminar de Firestore
      const docRef = doc(db, this.collectionName, trainingId);
      await deleteDoc(docRef);
      
      // Eliminar archivo de Storage
      const storageRef = ref(storage, fileName);
      await deleteObject(storageRef);
      
      this.log('INFO', 'Capacitación eliminada exitosamente', { trainingId });
      return true;
      
    } catch (error) {
      this.log('ERROR', 'Error al eliminar capacitación', error);
      throw new Error(`No se pudo eliminar la capacitación: ${error.message}`);
    }
  }

  /**
   * Valida el archivo PDF (Principio de Validación)
   * @param {File} file - Archivo a validar
   * @throws {Error} - Si el archivo no es válido
   */
  validateFile(file) {
    if (!file) {
      throw new Error('El archivo es requerido');
    }
    
    if (file.type !== 'application/pdf') {
      throw new Error('Solo se permiten archivos PDF');
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB
      throw new Error('El archivo no puede superar los 10MB');
    }
    
    this.log('INFO', 'Archivo validado exitosamente', { 
      name: file.name, 
      size: file.size, 
      type: file.type 
    });
  }

  /**
   * Sanitiza entrada de datos (Principio de Seguridad)
   * @param {string} input - Input a sanitizar
   * @returns {string} - Input sanitizado
   */
  sanitizeInput(input) {
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
   * Mapea documento de Firestore a entidad Training
   * @param {Object} doc - Documento de Firestore
   * @returns {Object} - Entidad Training normalizada
   */
  mapDocToTraining(doc) {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title || '',
      institution: data.institution || '',
      date: data.date,
      description: data.description || '',
      pdfUrl: data.pdfUrl || '',
      fileName: data.fileName || '',
      verified: data.verified || false,
      createdAt: data.createdAt
    };
  }
}