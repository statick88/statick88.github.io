import { describe, it, expect } from 'vitest';

describe('Date Formatting', () => {
  it('should format dates correctly', () => {
    const date = new Date('2024-01-15');
    const formatted = date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long'
    });
    
    expect(formatted).toContain('2024');
    expect(formatted).toContain('enero');
  });
});

describe('URL Validation', () => {
  it('should validate URL format', () => {
    const validUrls = [
      'https://example.com',
      'https://www.example.com/path',
      'https://example.com/path?query=value'
    ];
    const invalidUrls = ['example.com', 'not a url', 'ftp://example.com'];
    
    const urlRegex = /^https?:\/\/.+/;
    
    validUrls.forEach(url => {
      expect(urlRegex.test(url)).toBe(true);
    });
    
    invalidUrls.forEach(url => {
      expect(urlRegex.test(url)).toBe(false);
    });
  });
});

describe('PDF Download', () => {
  it('should validate PDF file paths', () => {
    const validPaths = ['/cv-diego-saavedra-es.pdf', '/cv-diego-saavedra-en.pdf'];
    const invalidPaths = [
      '../../../etc/passwd',
      '/cv/../file.pdf',
      '..\\..\\..\\windows\\system32\\config\\sam',
      '',
      'invalid.pdf',
      '/path/to/file.pdf'
    ];
    
    const pathRegex = /^\/cv-diego-saavedra-(es|en)\.pdf$/;
    
    validPaths.forEach(path => {
      expect(pathRegex.test(path)).toBe(true);
    });
    
    invalidPaths.forEach(path => {
      expect(pathRegex.test(path)).toBe(false);
    });
  });
});
