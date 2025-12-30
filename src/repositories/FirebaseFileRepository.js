/**
 * @fileoverview Firebase File Repository
 * Implementación de IFileRepository usando Firebase Storage
 * Principios SOLID: SRP, DIP
 */

import { IFileRepository } from './IRepository.js';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL,
  deleteObject 
} from "firebase/storage";
import { storage } from "@/firebase.js";

/**
 * @class FirebaseFileRepository
 * Implementación del repositorio de archivos con Firebase Storage
 */
export class FirebaseFileRepository extends IFileRepository {
  constructor() {
    super();
  }

  /**
   * Sube un archivo a Firebase Storage
   * @param {File} file - Archivo a subir
   * @param {string} path - Ruta destino
   * @returns {Promise<string>} - URL del archivo subido
   */
  async upload(file, path) {
    try {
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (error) {
      throw new Error(`Error uploading file: ${error.message}`);
    }
  }

  /**
   * Elimina un archivo de Firebase Storage
   * @param {string} path - Ruta del archivo
   * @returns {Promise<boolean>} - true si se eliminó
   */
  async delete(path) {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
      return true;
    } catch (error) {
      throw new Error(`Error deleting file: ${error.message}`);
    }
  }

  /**
   * Obtiene URL de descarga de un archivo
   * @param {string} path - Ruta del archivo
   * @returns {Promise<string>} - URL de descarga
   */
  async getUrl(path) {
    try {
      const storageRef = ref(storage, path);
      return await getDownloadURL(storageRef);
    } catch (error) {
      throw new Error(`Error getting file URL: ${error.message}`);
    }
  }
}