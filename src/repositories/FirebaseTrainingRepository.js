/**
 * @fileoverview Firebase Training Repository
 * Implementación de ITrainingRepository usando Firebase
 * Principios SOLID: SRP, DIP
 */

import { ITrainingRepository } from './IRepository.js';
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
  getDoc,
  Timestamp 
} from "firebase/firestore";
import { db } from "@/firebase.js";

/**
 * @class FirebaseTrainingRepository
 * Implementación del repositorio de capacitaciones con Firebase
 */
export class FirebaseTrainingRepository extends ITrainingRepository {
  constructor() {
    super();
    this.collectionName = 'trainings';
  }

  /**
   * Crea una nueva capacitación
   * @param {Object} trainingData - Datos de la capacitación
   * @returns {Promise<Object>} - Capacitación creada
   */
  async create(trainingData) {
    try {
      const entity = {
        ...trainingData,
        createdAt: Timestamp.now(),
        verified: false
      };

      const docRef = await addDoc(collection(db, this.collectionName), entity);
      return { id: docRef.id, ...entity };
    } catch (error) {
      throw new Error(`Error creating training: ${error.message}`);
    }
  }

  /**
   * Obtiene una capacitación por ID
   * @param {string} id - ID de la capacitación
   * @returns {Promise<Object|null>} - Capacitación encontrada o null
   */
  async findById(id) {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      throw new Error(`Error finding training by ID: ${error.message}`);
    }
  }

  /**
   * Obtiene todas las capacitaciones
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Array>} - Lista de capacitaciones
   */
  async findAll(filters = {}) {
    try {
      let trainingsQuery = query(
        collection(db, this.collectionName),
        orderBy('date', 'desc')
      );

      // Aplicar filtros si existen
      if (filters.verified !== undefined) {
        trainingsQuery = query(
          collection(db, this.collectionName),
          where('verified', '==', filters.verified),
          orderBy('date', 'desc')
        );
      }

      const querySnapshot = await getDocs(trainingsQuery);
      return querySnapshot.docs.map(doc => this._mapDocToTraining(doc));
    } catch (error) {
      throw new Error(`Error finding all trainings: ${error.message}`);
    }
  }

  /**
   * Obtiene capacitaciones verificadas
   * @returns {Promise<Array>} - Capacitaciones verificadas
   */
  async findVerified() {
    return this.findAll({ verified: true });
  }

  /**
   * Actualiza una capacitación
   * @param {string} id - ID de la capacitación
   * @param {Object} updates - Datos a actualizar
   * @returns {Promise<Object>} - Capacitación actualizada
   */
  async update(id, updates) {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });

      return await this.findById(id);
    } catch (error) {
      throw new Error(`Error updating training: ${error.message}`);
    }
  }

  /**
   * Verifica una capacitación
   * @param {string} id - ID de la capacitación
   * @returns {Promise<boolean>} - true si se verificó
   */
  async verify(id) {
    try {
      await this.update(id, {
        verified: true,
        verifiedAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      throw new Error(`Error verifying training: ${error.message}`);
    }
  }

  /**
   * Elimina una capacitación
   * @param {string} id - ID de la capacitación
   * @returns {Promise<boolean>} - true si se eliminó
   */
  async delete(id) {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      throw new Error(`Error deleting training: ${error.message}`);
    }
  }

  /**
   * Mapea documento de Firestore a entidad Training
   * @private
   * @param {Object} doc - Documento de Firestore
   * @returns {Object} - Entidad Training normalizada
   */
  _mapDocToTraining(doc) {
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
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      verifiedAt: data.verifiedAt
    };
  }
}