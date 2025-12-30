/**
 * @fileoverview Base Service Interface
 * Define la interfaz común para todos los servicios del sistema
 * Sigue el Principio de Segregación de Interfaces (ISP - SOLID)
 */

export interface IService {
  /**
   * Inicializa el servicio
   * @returns {Promise<boolean>} - true si la inicialización fue exitosa
   */
  initialize(): Promise<boolean>;
  
  /**
   * Detiene el servicio
   * @returns {Promise<boolean>} - true si la detención fue exitosa
   */
  shutdown(): Promise<boolean>;
  
  /**
   * Verifica si el servicio está saludable
   * @returns {Promise<boolean>} - true si el servicio está funcionando
   */
  healthCheck(): Promise<boolean>;
}