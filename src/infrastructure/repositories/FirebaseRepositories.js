/**
 * @fileoverview Infrastructure Implementations
 * Implementaciones de repositorios usando Firebase
 * Infrastructure Layer - Adaptadores de dominio a Firebase
 */

import { Repository, UserRepository, TrainingRepository, FileRepository } from '../../domain/repositories/Repository.js';
import { User } from '../../domain/entities/User.js';
import { Training } from '../../domain/entities/Training.js';

// Importaciones de Firebase (adaptadas para Clean Architecture)
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  where,
  Timestamp,
  serverTimestamp
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "firebase/storage";

import { auth } from "@/firebase.js";

/**
 * @class FirebaseUserRepository
 * Implementación de UserRepository con Firebase
 * Infrastructure Layer - Adaptador de dominio a Firebase Firestore
 */
export class FirebaseUserRepository extends UserRepository {
  constructor() {
    super();
    this.collectionName = 'users';
  }

  /**
   * Guarda un usuario
   * @param {User} user - Entidad de usuario
   * @returns {Promise<Object>} - Usuario guardado
   */
  async save(user) {
    try {
      const userDoc = {
        email: user.getEmail(),
        displayName: user.getDisplayName(),
        createdAt: Timestamp.fromDate(user.getCreatedAt()),
        updatedAt: Timestamp.fromDate(user.getUpdatedAt()),
        active: user.isActive()
      };

      const docRef = await addDoc(collection(db, this.collectionName), userDoc);
      return { id: docRef.id, ...userDoc };
    } catch (error) {
      throw new Error(`Failed to save user: ${error.message}`);
    }
  }

  /**
   * Busca usuario por ID
   * @param {string} id - ID del usuario
   * @returns {Promise<Object|null>} - Usuario encontrado
   */
  async findById(id) {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return new User({
          id: docSnap.id,
          email: data.email,
          displayName: data.displayName,
          createdAt: data.createdAt.toDate()
        });
      }
      return null;
    } catch (error) {
      throw new Error(`Failed to find user by ID: ${error.message}`);
    }
  }

  /**
   * Busca todos los usuarios
   * @param {Object} criteria - Criterios de búsqueda
   * @returns {Promise<Array>} - Lista de usuarios
   */
  async findAll(criteria = {}) {
    try {
      let q = query(collection(db, this.collectionName));
      
      if (criteria.active !== undefined) {
        q = query(q, where('active', '==', criteria.active));
      }

      q = query(q, orderBy('createdAt', 'desc'));
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return new User({
          id: doc.id,
          email: data.email,
          displayName: data.displayName,
          createdAt: data.createdAt.toDate()
        });
      });
    } catch (error) {
      throw new Error(`Failed to find all users: ${error.message}`);
    }
  }

  /**
   * Actualiza un usuario
   * @param {string} id - ID del usuario
   * @param {Object} updates - Datos a actualizar
   * @returns {Promise<Object>} - Usuario actualizado
   */
  async update(id, updates) {
    try {
      const docRef = doc(db, this.collectionName, id);
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      };

      await updateDoc(docRef, updateData);
      return await this.findById(id);
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  /**
   * Elimina un usuario
   * @param {string} id - ID del usuario
   * @returns {Promise<boolean>} - true si se eliminó
   */
  async delete(id) {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  /**
   * Cuenta usuarios
   * @param {Object} criteria - Criterios de conteo
   * @returns {Promise<number>} - Número de usuarios
   */
  async count(criteria = {}) {
    try {
      const users = await this.findAll(criteria);
      return users.length;
    } catch (error) {
      throw new Error(`Failed to count users: ${error.message}`);
    }
  }

  /**
   * Busca usuario por email
   * @param {string} email - Email del usuario
   * @returns {Promise<Object|null>} - Usuario encontrado
   */
  async findByEmail(email) {
    try {
      const q = query(collection(db, this.collectionName), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        return new User({
          id: doc.id,
          email: data.email,
          displayName: data.displayName,
          createdAt: data.createdAt.toDate()
        });
      }
      return null;
    } catch (error) {
      throw new Error(`Failed to find user by email: ${error.message}`);
    }
  }

  /**
   * Busca usuarios activos
   * @returns {Promise<Array>} - Lista de usuarios activos
   */
  async findActive() {
    return this.findAll({ active: true });
  }

  /**
   * Busca usuarios con criterios avanzados
   * @param {Object} criteria - Criterios de búsqueda
   * @param {Object} options - Opciones de paginación
   * @returns {Promise<Object>} - Resultados paginados
   */
  async findWithCriteria(criteria, options = {}) {
    try {
      let q = query(collection(db, this.collectionName));
      
      // Aplicar filtros
      if (criteria.active !== undefined) {
        q = query(q, where('active', '==', criteria.active));
      }
      
      q = query(q, orderBy('createdAt', 'desc'));

      const querySnapshot = await getDocs(q);
      let users = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return new User({
          id: doc.id,
          email: data.email,
          displayName: data.displayName,
          createdAt: data.createdAt.toDate()
        });
      });

      // Aplicar filtros adicionales en memoria
      if (criteria.search) {
        const searchLower = criteria.search.toLowerCase();
        users = users.filter(user => 
          user.getEmail().toLowerCase().includes(searchLower) ||
          user.getDisplayName().toLowerCase().includes(searchLower)
        );
      }

      // Paginación
      const { page = 1, limit = 10 } = options;
      const startIndex = (page - 1) * limit;
      const paginatedUsers = users.slice(startIndex, startIndex + limit);

      return {
        users: paginatedUsers,
        total: users.length,
        page,
        totalPages: Math.ceil(users.length / limit)
      };
    } catch (error) {
      throw new Error(`Failed to find users with criteria: ${error.message}`);
    }
  }

  /**
   * Actualiza estado de actividad
   * @param {string} id - ID del usuario
   * @param {boolean} active - Nuevo estado
   * @returns {Promise<boolean>} - true si se actualizó
   */
  async updateActiveStatus(id, active) {
    return this.update(id, { active });
  }
}

/**
 * @class FirebaseTrainingRepository
 * Implementación de TrainingRepository con Firebase
 * Infrastructure Layer - Adaptador de dominio a Firebase Firestore
 */
export class FirebaseTrainingRepository extends TrainingRepository {
  constructor() {
    super();
    this.collectionName = 'trainings';
  }

  /**
   * Guarda una capacitación
   * @param {Training} training - Entidad de capacitación
   * @returns {Promise<Object>} - Capacitación guardada
   */
  async save(training) {
    try {
      const trainingDoc = {
        title: training.getTitle(),
        description: training.getDescription(),
        institution: training.getInstitution(),
        date: Timestamp.fromDate(training.getDate()),
        pdfUrl: training.getPdfUrl(),
        fileName: training.getFileName(),
        verified: training.isVerified(),
        createdAt: Timestamp.fromDate(training.getCreatedAt()),
        updatedAt: Timestamp.fromDate(training.getUpdatedAt())
      };

      const docRef = await addDoc(collection(db, this.collectionName), trainingDoc);
      return { id: docRef.id, ...trainingDoc };
    } catch (error) {
      throw new Error(`Failed to save training: ${error.message}`);
    }
  }

  /**
   * Busca capacitación por ID
   * @param {string} id - ID de la capacitación
   * @returns {Promise<Object|null>} - Capacitación encontrada
   */
  async findById(id) {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return new Training({
          id: docSnap.id,
          title: data.title,
          description: data.description,
          institution: data.institution,
          date: data.date.toDate(),
          pdfUrl: data.pdfUrl,
          fileName: data.fileName,
          verified: data.verified,
          createdAt: data.createdAt.toDate()
        });
      }
      return null;
    } catch (error) {
      throw new Error(`Failed to find training by ID: ${error.message}`);
    }
  }

  /**
   * Busca todas las capacitaciones
   * @param {Object} criteria - Criterios de búsqueda
   * @returns {Promise<Array>} - Lista de capacitaciones
   */
  async findAll(criteria = {}) {
    try {
      let q = query(collection(db, this.collectionName));
      
      if (criteria.verified !== undefined) {
        q = query(q, where('verified', '==', criteria.verified));
      }

      q = query(q, orderBy('date', 'desc'));
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return new Training({
          id: doc.id,
          title: data.title,
          description: data.description,
          institution: data.institution,
          date: data.date.toDate(),
          pdfUrl: data.pdfUrl,
          fileName: data.fileName,
          verified: data.verified,
          createdAt: data.createdAt.toDate()
        });
      });
    } catch (error) {
      throw new Error(`Failed to find all trainings: ${error.message}`);
    }
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
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      };

      await updateDoc(docRef, updateData);
      return await this.findById(id);
    } catch (error) {
      throw new Error(`Failed to update training: ${error.message}`);
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
      throw new Error(`Failed to delete training: ${error.message}`);
    }
  }

  /**
   * Cuenta capacitaciones
   * @param {Object} criteria - Criterios de conteo
   * @returns {Promise<number>} - Número de capacitaciones
   */
  async count(criteria = {}) {
    try {
      const trainings = await this.findAll(criteria);
      return trainings.length;
    } catch (error) {
      throw new Error(`Failed to count trainings: ${error.message}`);
    }
  }

  /**
   * Busca capacitaciones verificadas
   * @returns {Promise<Array>} - Lista de capacitaciones verificadas
   */
  async findVerified() {
    return this.findAll({ verified: true });
  }

  /**
   * Busca capacitaciones por institución
   * @param {string} institution - Institución
   * @returns {Promise<Array>} - Lista de capacitaciones
   */
  async findByInstitution(institution) {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('institution', '==', institution),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return new Training({
          id: doc.id,
          title: data.title,
          description: data.description,
          institution: data.institution,
          date: data.date.toDate(),
          pdfUrl: data.pdfUrl,
          fileName: data.fileName,
          verified: data.verified,
          createdAt: data.createdAt.toDate()
        });
      });
    } catch (error) {
      throw new Error(`Failed to find trainings by institution: ${error.message}`);
    }
  }

  /**
   * Busca capacitaciones por rango de fechas
   * @param {Date} startDate - Fecha de inicio
   * @param {Date} endDate - Fecha de fin
   * @returns {Promise<Array>} - Lista de capacitaciones
   */
  async findByDateRange(startDate, endDate) {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('date', '>=', Timestamp.fromDate(startDate)),
        where('date', '<=', Timestamp.fromDate(endDate)),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return new Training({
          id: doc.id,
          title: data.title,
          description: data.description,
          institution: data.institution,
          date: data.date.toDate(),
          pdfUrl: data.pdfUrl,
          fileName: data.fileName,
          verified: data.verified,
          createdAt: data.createdAt.toDate()
        });
      });
    } catch (error) {
      throw new Error(`Failed to find trainings by date range: ${error.message}`);
    }
  }

  /**
   * Busca capacitaciones con paginación
   * @param {Object} criteria - Criterios de búsqueda
   * @param {Object} pagination - Opciones de paginación
   * @returns {Promise<Object>} - Resultados paginados
   */
  async findWithPagination(criteria, pagination) {
    try {
      const trainings = await this.findAll(criteria);
      const { page = 1, limit = 10 } = pagination;
      const startIndex = (page - 1) * limit;
      const paginatedTrainings = trainings.slice(startIndex, startIndex + limit);

      return {
        trainings: paginatedTrainings,
        total: trainings.length,
        page,
        totalPages: Math.ceil(trainings.length / limit)
      };
    } catch (error) {
      throw new Error(`Failed to find trainings with pagination: ${error.message}`);
    }
  }

  /**
   * Actualiza estado de verificación
   * @param {string} id - ID de la capacitación
   * @param {boolean} verified - Estado de verificación
   * @returns {Promise<boolean>} - true si se actualizó
   */
  async updateVerificationStatus(id, verified) {
    const updateData = { 
      verified, 
      verifiedAt: verified ? serverTimestamp() : null 
    };
    return this.update(id, updateData);
  }
}

/**
 * @class FirebaseFileRepository
 * Implementación de FileRepository con Firebase Storage
 * Infrastructure Layer - Adaptador de dominio a Firebase Storage
 */
export class FirebaseFileRepository extends FileRepository {
  constructor() {
    super();
  }

  /**
   * Guarda un archivo
   * @param {File} file - Archivo a guardar
   * @param {string} path - Ruta de destino
   * @returns {Promise<string>} - URL del archivo guardado
   */
  async save(file, path) {
    try {
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl;
    } catch (error) {
      throw new Error(`Failed to save file: ${error.message}`);
    }
  }

  /**
   * Elimina un archivo
   * @param {string} path - Ruta del archivo
   * @returns {Promise<boolean>} - true si se eliminó
   */
  async delete(path) {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  /**
   * Obtiene URL de un archivo
   * @param {string} path - Ruta del archivo
   * @returns {Promise<string>} - URL del archivo
   */
  async getUrl(path) {
    try {
      const storageRef = ref(storage, path);
      return await getDownloadURL(storageRef);
    } catch (error) {
      throw new Error(`Failed to get file URL: ${error.message}`);
    }
  }

  /**
   * Verifica si un archivo existe
   * @param {string} path - Ruta del archivo
   * @returns {Promise<boolean>} - true si existe
   */
  async exists(path) {
    try {
      const storageRef = ref(storage, path);
      await getDownloadURL(storageRef);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtiene información de un archivo
   * @param {string} path - Ruta del archivo
   * @returns {Promise<Object>} - Información del archivo
   */
  async getFileInfo(path) {
    try {
      const storageRef = ref(storage, path);
      const url = await getDownloadURL(storageRef);
      
      return {
        path,
        url,
        exists: true,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        path,
        exists: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}