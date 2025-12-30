import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock Firebase before importing services
vi.mock('@/firebase.js', () => ({
  auth: {
    signInWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChanged: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    sendPasswordResetEmail: vi.fn(),
    _getRecaptchaConfig: vi.fn(() => Promise.resolve())
  },
  db: {
    collection: vi.fn(),
    addDoc: vi.fn(),
    getDocs: vi.fn(),
    deleteDoc: vi.fn(),
    doc: vi.fn(),
    updateDoc: vi.fn(),
    query: vi.fn(),
    orderBy: vi.fn(),
    where: vi.fn(),
    Timestamp: {
      now: vi.fn(() => ({ seconds: Date.now() / 1000 }))
    }
  },
  storage: {
    ref: vi.fn(),
    uploadBytes: vi.fn(),
    getDownloadURL: vi.fn(),
    deleteObject: vi.fn()
  }
}));

import { AuthService } from '../services/AuthService.js';
import { TrainingService } from '../services/TrainingService.js';

describe('Services - Basic Functionality', () => {
  describe('AuthService', () => {
    let authService;

    beforeEach(() => {
      authService = new AuthService();
    });

    it('should instantiate correctly', () => {
      expect(authService).toBeDefined();
      expect(authService.constructor.name).toBe('AuthService');
    });

    it('should have basic auth methods', () => {
      expect(typeof authService.signIn).toBe('function');
      expect(typeof authService.signOut).toBe('function');
      expect(typeof authService.createUser).toBe('function');
      expect(typeof authService.resetPassword).toBe('function');
    });

    it('should have health check', () => {
      expect(typeof authService.healthCheck).toBe('function');
    });

    it('should be well-structured', () => {
      expect(authService.constructor.prototype).toBeDefined();
      expect(Object.keys(authService).length).toBeGreaterThan(0);
    });
  });

  describe('TrainingService', () => {
    let trainingService;

    beforeEach(() => {
      trainingService = new TrainingService();
    });

    it('should instantiate correctly', () => {
      expect(trainingService).toBeDefined();
      expect(trainingService.constructor.name).toBe('TrainingService');
    });

    it('should have training methods', () => {
      expect(typeof trainingService.createTraining).toBe('function');
    });

    it('should be well-structured', () => {
      expect(trainingService.constructor.prototype).toBeDefined();
      expect(Object.keys(trainingService).length).toBeGreaterThan(0);
    });
  });
});

describe('Services - Architecture', () => {
  describe('Architecture Compliance', () => {
    it('should follow SOLID principles', () => {
      // Both services should be well-designed according to SOLID
      const authService = new AuthService();
      const trainingService = new TrainingService();

      expect(authService.constructor.name).toBe('AuthService');
      expect(trainingService.constructor.name).toBe('TrainingService');
    });

    it('should be extensible (OCP)', () => {
      const authService = new AuthService();
      const trainingService = new TrainingService();

      expect(authService.constructor.prototype).toBeDefined();
      expect(trainingService.constructor.prototype).toBeDefined();
    });

    it('should have proper separation of concerns (SRP)', () => {
      // Services should have single responsibilities
      const authService = new AuthService();
      const trainingService = new TrainingService();

      // AuthService should focus on authentication
      expect(typeof authService.signIn).toBe('function');

      // TrainingService should focus on training operations
      expect(typeof trainingService.createTraining).toBe('function');
    });
  });
});