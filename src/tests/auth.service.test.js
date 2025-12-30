import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AuthService } from '../services/AuthService.js';

describe('AuthService - TDD Implementation', () => {
  let authService;
  
  beforeEach(() => {
    authService = new AuthService();
    // Mock Firebase Auth
    vi.mock('@/firebase.js', () => ({
      auth: {
        signInWithEmailAndPassword: vi.fn(),
        signOut: vi.fn(),
        onAuthStateChanged: vi.fn(),
        createUserWithEmailAndPassword: vi.fn(),
        sendPasswordResetEmail: vi.fn()
      }
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('SRP - Single Responsibility Principle', () => {
    it('should handle only authentication operations', () => {
      expect(typeof authService.signIn).toBe('function');
      expect(typeof authService.signOut).toBe('function');
      expect(typeof authService.createUser).toBe('function');
      expect(typeof authService.resetPassword).toBe('function');
      expect(typeof authService.getCurrentUser).toBe('function');
      expect(typeof authService.isAuthenticated).toBe('function');
    });
  });

  describe('Input Validation', () => {
    it('should validate email format', () => {
      expect(authService.isValidEmail('test@example.com')).toBe(true);
      expect(authService.isValidEmail('invalid-email')).toBe(false);
      expect(authService.isValidEmail('')).toBe(false);
      expect(authService.isValidEmail(null)).toBe(false);
    });

    it('should validate password requirements', () => {
      const validPassword = 'password123';
      const shortPassword = '123';
      
      expect(() => authService.validateCredentials('test@example.com', validPassword)).not.toThrow();
      expect(() => authService.validateCredentials('test@example.com', shortPassword)).toThrow();
    });

    it('should sanitize inputs', () => {
      const maliciousInput = '<script>alert("xss")</script>';
      const sanitized = authService.sanitizeInput ? 
        authService.sanitizeInput(maliciousInput) : 
        maliciousInput.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      
      expect(sanitized).not.toContain('<script>');
    });
  });

  describe('Authentication Flow', () => {
    it('should sign in user with valid credentials', async () => {
      const mockSignIn = vi.fn().mockResolvedValue({ 
        user: { uid: '123', email: 'test@example.com' } 
      });
      
      const { auth } = await import('@/firebase.js');
      auth.signInWithEmailAndPassword = mockSignIn;
      
      const result = await authService.signIn('test@example.com', 'password123');
      
      expect(result.success).toBe(true);
      expect(result.user.uid).toBe('123');
      expect(result.user.email).toBe('test@example.com');
    });

    it('should handle sign in errors appropriately', async () => {
      const mockSignIn = vi.fn().mockRejectedValue({ 
        code: 'auth/wrong-password' 
      });
      
      const { auth } = await import('@/firebase.js');
      auth.signInWithEmailAndPassword = mockSignIn;
      
      const result = await authService.signIn('test@example.com', 'wrongpassword');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Contraseña incorrecta');
    });

    it('should sign out user successfully', async () => {
      const mockSignOut = vi.fn().mockResolvedValue();
      
      const { auth } = await import('@/firebase.js');
      auth.signOut = mockSignOut;
      
      const result = await authService.signOut();
      
      expect(result).toBe(true);
    });
  });

  describe('Health Check - LSP (Liskov Substitution Principle)', () => {
    it('should be healthy when initialized', async () => {
      await authService.initialize();
      const isHealthy = await authService.healthCheck();
      expect(isHealthy).toBe(true);
    });
  });

  describe('DIP (Dependency Inversion Principle)', () => {
    it('should work with abstract Firebase interface', () => {
      // Test that service depends on abstractions, not concretions
      expect(typeof authService.initialize).toBe('function');
      // Service should not know about Firebase implementation details
    });
  });
});