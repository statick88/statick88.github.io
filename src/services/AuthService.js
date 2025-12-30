/**
 * @fileoverview Authentication Service
 * Gestiona autenticación de usuarios
 * Sigue principios SOLID: SRP, OCP, LSP, DIP
 */

import { BaseService } from './BaseService.js';
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth } from "@/firebase.js";

/**
 * @class AuthService
 * Gestiona el ciclo de vida de la autenticación
 */
export class AuthService extends BaseService {
  constructor() {
    super('AuthService');
    this.currentUser = null;
  }

  /**
   * Hook para inicialización específica del servicio
   * @protected
   */
  async _onInitialize() {
    // Observar cambios en estado de autenticación
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        this.currentUser = user;
        if (user) {
          this.info('Usuario autenticado', { 
            email: user.email, 
            uid: user.uid 
          });
        } else {
          this.info('Sesión cerrada');
        }
        resolve();
      });
    });
  }

  /**
   * Verifica si el servicio está saludable
   * @returns {Promise<boolean>} - true si el servicio está funcionando
   */
  async healthCheck() {
    return this.currentUser !== null;
  }

  /**
   * Inicia sesión con email y contraseña
   * @param {string} email - Correo electrónico
   * @param {string} password - Contraseña
   * @returns {Promise<Object>} - Resultado del login
   */
  async signIn(email, password) {
    this.info('Intentando inicio de sesión', { email });
    
    try {
      // Validar inputs (Principio de Validación)
      this.validateCredentials(email, password);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      this.info('Login exitoso', { 
        email: userCredential.user.email,
        uid: userCredential.user.uid
      });
      
      return { 
        success: true, 
        user: {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName
        }
      };
      
    } catch (error) {
      this.error('Error en login', error);
      
      return {
        success: false,
        error: this.getAuthErrorMessage(error.code)
      };
    }
  }

  /**
   * Cierra la sesión del usuario
   * @returns {Promise<boolean>} - true si se cerró exitosamente
   */
  async signOut() {
    this.info('Cerrando sesión');
    
    try {
      await signOut(auth);
      this.currentUser = null;
      this.info('Sesión cerrada exitosamente');
      return true;
      
    } catch (error) {
      this.error('Error al cerrar sesión', error);
      throw new Error(`No se pudo cerrar sesión: ${error.message}`);
    }
  }

  /**
   * Obtiene el usuario actual
   * @returns {Object|null} - Usuario actual o null
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Verifica si hay un usuario autenticado
   * @returns {boolean} - true si hay sesión activa
   */
  isAuthenticated() {
    return this.currentUser !== null;
  }

  /**
   * Crea un nuevo usuario
   * @param {string} email - Correo electrónico
   * @param {string} password - Contraseña
   * @returns {Promise<Object>} - Resultado de la creación
   */
  async createUser(email, password) {
    this.info('Creando nuevo usuario', { email });
    
    try {
      this.validateCredentials(email, password);
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      this.info('Usuario creado exitosamente', { 
        email: userCredential.user.email,
        uid: userCredential.user.uid
      });
      
      return { 
        success: true, 
        user: userCredential.user 
      };
      
    } catch (error) {
      this.error('Error al crear usuario', error);
      return {
        success: false,
        error: this.getAuthErrorMessage(error.code)
      };
    }
  }

  /**
   * Envía email de recuperación de contraseña
   * @param {string} email - Correo electrónico
   * @returns {Promise<boolean>} - true si se envió exitosamente
   */
  async resetPassword(email) {
    this.info('Enviando email de recuperación', { email });
    
    try {
      await sendPasswordResetEmail(auth, email);
      this.info('Email de recuperación enviado exitosamente');
      return true;
      
    } catch (error) {
      this.error('Error al enviar email de recuperación', error);
      throw new Error(`No se pudo enviar email de recuperación: ${error.message}`);
    }
  }

  /**
   * Valida credenciales (Principio de Validación)
   * @param {string} email - Correo electrónico
   * @param {string} password - Contraseña
   * @throws {Error} - Si las credenciales no son válidas
   */
  validateCredentials(email, password) {
    if (!email || typeof email !== 'string') {
      throw new Error('El correo electrónico es requerido');
    }
    
    if (!this.isValidEmail(email)) {
      throw new Error('El correo electrónico no es válido');
    }
    
    if (!password || typeof password !== 'string') {
      throw new Error('La contraseña es requerida');
    }
    
    if (password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }
  }

  /**
   * Valida formato de email
   * @param {string} email - Correo a validar
   * @returns {boolean} - true si el formato es válido
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Mapea códigos de error de Firebase a mensajes legibles
   * @param {string} errorCode - Código de error de Firebase
   * @returns {string} - Mensaje de error legible
   */
  getAuthErrorMessage(errorCode) {
    const errorMessages = {
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/invalid-email': 'Correo electrónico inválido',
      'auth/user-disabled': 'Usuario deshabilitado',
      'auth/too-many-requests': 'Demasiados intentos. Inténtalo más tarde',
      'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
      'auth/email-already-in-use': 'El correo ya está en uso',
      'auth/weak-password': 'La contraseña es muy débil',
      'auth/invalid-credential': 'Credenciales inválidas',
      'auth/operation-not-allowed': 'Operación no permitida'
    };
    
    return errorMessages[errorCode] || 'Error desconocido. Inténtalo de nuevo.';
  }
}