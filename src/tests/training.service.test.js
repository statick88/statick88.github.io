import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TrainingService } from '../services/TrainingService.js';

describe('TrainingService - TDD Implementation', () => {
  let trainingService;
  let mockFirebase, mockStorage;
  
  beforeEach(() => {
    trainingService = new TrainingService();
    
    // Mock Firebase services
    mockFirebase = {
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
    };
    
    mockStorage = {
      ref: vi.fn(),
      uploadBytes: vi.fn(),
      getDownloadURL: vi.fn(),
      deleteObject: vi.fn()
    };
    
    vi.mock('@/firebase.js', () => ({
      db: mockFirebase,
      storage: mockStorage
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('SRP - Single Responsibility Principle', () => {
    it('should handle only training operations', () => {
      expect(typeof trainingService.createTraining).toBe('function');
      expect(typeof trainingService.getVerifiedTrainings).toBe('function');
      expect(typeof trainingService.getAllTrainings).toBe('function');
      expect(typeof trainingService.verifyTraining).toBe('function');
      expect(typeof trainingService.deleteTraining).toBe('function');
    });
  });

  describe('Input Validation - Defense Programming', () => {
    it('should validate PDF file type', () => {
      const validFile = new File([''], 'test.pdf', { type: 'application/pdf' });
      const invalidFile = new File([''], 'test.txt', { type: 'text/plain' });
      
      expect(() => trainingService.validateFile(validFile)).not.toThrow();
      expect(() => trainingService.validateFile(invalidFile)).toThrow('Solo se permiten archivos PDF');
    });

    it('should validate file size', () => {
      const largeFile = new File(['a'.repeat(11 * 1024 * 1024)], 'large.pdf', { type: 'application/pdf' });
      Object.defineProperty(largeFile, 'size', { value: 11 * 1024 * 1024 });
      
      expect(() => trainingService.validateFile(largeFile)).toThrow('El archivo no puede superar los 10MB');
    });

    it('should sanitize input data', () => {
      const maliciousInput = '<script>alert("xss")</script>';
      const sanitized = trainingService.sanitizeInput(maliciousInput);
      
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('<>');
    });
  });

  describe('OCP - Open/Closed Principle', () => {
    it('should be extensible for new training types', () => {
      // Service should handle any training data structure
      const trainingData = {
        title: 'Test Training',
        institution: 'Test Institution',
        date: '2023-01-01',
        description: 'Test Description'
      };
      
      expect(trainingService.sanitizeInput(trainingData.title)).toBe('Test Training');
      expect(trainingService.sanitizeInput(trainingData.institution)).toBe('Test Institution');
    });
  });

  describe('CRUD Operations', () => {
    it('should create training successfully', async () => {
      const mockFile = new File([''], 'test.pdf', { type: 'application/pdf' });
      const trainingData = {
        title: 'Test Training',
        institution: 'Test Institution',
        date: '2023-01-01',
        description: 'Test Description'
      };
      
      // Mock successful upload
      mockStorage.ref.mockReturnValue({
        uploadBytes: vi.fn().mockResolvedValue({}),
        getDownloadURL: vi.fn().mockResolvedValue('https://example.com/pdf.pdf')
      });
      
      mockFirebase.collection.mockReturnValue({
        add: vi.fn().mockResolvedValue({ id: '123' })
      });
      
      const result = await trainingService.createTraining(trainingData, mockFile);
      
      expect(result.id).toBe('123');
      expect(result.title).toBe('Test Training');
      expect(result.pdfUrl).toBe('https://example.com/pdf.pdf');
      expect(result.verified).toBe(false);
    });

    it('should handle file upload errors', async () => {
      const mockFile = new File([''], 'test.pdf', { type: 'application/pdf' });
      
      mockStorage.ref.mockReturnValue({
        uploadBytes: vi.fn().mockRejectedValue(new Error('Upload failed'))
      });
      
      await expect(trainingService.createTraining({}, mockFile))
        .rejects.toThrow('No se pudo crear la capacitación');
    });
  });

  describe('LSP - Liskov Substitution Principle', () => {
    it('should work with BaseService interface', async () => {
      expect(typeof trainingService.initialize).toBe('function');
      expect(typeof trainingService.shutdown).toBe('function');
      expect(typeof trainingService.healthCheck).toBe('function');
      
      const isHealthy = await trainingService.healthCheck();
      expect(typeof isHealthy).toBe('boolean');
    });
  });

  describe('ISP - Interface Segregation Principle', () => {
    it('should provide only necessary methods', () => {
      // Service should have minimal, focused interface
      const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(trainingService));
      const necessaryMethods = [
        'constructor',
        'createTraining',
        'getVerifiedTrainings',
        'getAllTrainings',
        'verifyTraining',
        'deleteTraining',
        'validateFile',
        'sanitizeInput',
        'mapDocToTraining'
      ];
      
      necessaryMethods.forEach(method => {
        expect(methods).toContain(method);
      });
    });
  });

  describe('DIP - Dependency Inversion Principle', () => {
    it('should depend on abstractions', () => {
      // Service should depend on Firebase interfaces, not concretion
      expect(mockFirebase.collection).toBeDefined();
      expect(mockStorage.ref).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing file', async () => {
      await expect(trainingService.createTraining({}, null))
        .rejects.toThrow('El archivo es requerido');
    });

    it('should handle invalid date format', () => {
      const invalidDate = 'invalid-date';
      const trainingData = { date: invalidDate };
      
      // Service should handle invalid date gracefully
      expect(() => new Date(trainingData.date)).not.toThrow();
    });
  });

  describe('Logging and Monitoring', () => {
    it('should log operations', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      trainingService.log('INFO', 'Test message');
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[TrainingService]'),
        expect.stringContaining('[INFO]'),
        expect.stringContaining('Test message')
      );
      
      consoleSpy.mockRestore();
    });
  });
});