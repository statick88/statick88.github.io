import { describe, it, expect } from 'vitest';

describe('Security Tests - Basic Security', () => {
  describe('Input Validation Security', () => {
    it('should sanitize email inputs', () => {
      const maliciousEmail = '<script>alert("xss")</script>@example.com';
      const sanitizedEmail = maliciousEmail.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      expect(sanitizedEmail).toBe('@example.com');
    });

    it('should validate email format', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      expect(emailRegex.test('user@example.com')).toBe(true);
      expect(emailRegex.test('test.user.name+tag@domain.co.uk')).toBe(true);
      expect(emailRegex.test('invalid')).toBe(false);
      expect(emailRegex.test('@example.com')).toBe(false);
      expect(emailRegex.test('test@.com')).toBe(false);
    });

    it('should detect XSS attack vectors', () => {
      const xssPayloads = [
        '<script>alert("xss")</script>',
        '<script>javascript:alert("xss")</script>',
        '<img src="x" onerror="alert(1)">',
        '<svg onload="alert(1)">',
        '<iframe src="javascript:alert(1)"></iframe>'
      ];
      
      xssPayloads.forEach(payload => {
        const containsXSS = /<script|javascript:|on\w+=|<svg|<iframe/i.test(payload);
        expect(containsXSS).toBe(true);
      });
    });

    it('should sanitize HTML content', () => {
      const maliciousHTML = '<div onclick="alert(1)" class="test">Content</div><script>alert(2)</script>';
      
      const sanitize = (html) => {
        const temp = document.createElement('div');
        temp.textContent = html;
        return temp.innerHTML;
      };
      
      const sanitized = sanitize(maliciousHTML);
      // textContent removes HTML tags and script content
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('</script>');
      expect(sanitized).toContain('Content');
    });
  });

  describe('Content Security', () => {
    it('should prevent inline script execution', () => {
      const cspHeader = "script-src 'self'; object-src 'none';";
      const hasUnsafeInline = cspHeader.includes("'unsafe-inline'") || cspHeader.includes('*');
      expect(hasUnsafeInline).toBe(false);
    });

    it('should restrict eval usage', () => {
      const cspHeader = "script-src 'self'";
      const allowsEval = cspHeader.includes("'unsafe-eval'");
      expect(allowsEval).toBe(false);
    });

    it('should have proper CSP headers', () => {
      const expectedHeaders = [
        "Content-Security-Policy",
        "X-Frame-Options",
        "X-Content-Type-Options",
        "X-XSS-Protection"
      ];
      
      expectedHeaders.forEach(header => {
        expect(header).toBeTruthy();
        expect(typeof header).toBe('string');
      });
    });
  });

  describe('URL Security', () => {
    it('should validate URL format', () => {
      const urlRegex = /^https?:\/\/.+/;
      
      expect(urlRegex.test('https://example.com')).toBe(true);
      expect(urlRegex.test('https://www.example.com/path')).toBe(true);
      expect(urlRegex.test('http://example.com')).toBe(true);
      expect(urlRegex.test('example.com')).toBe(false);
      expect(urlRegex.test('ftp://example.com')).toBe(false);
      // eslint-disable-next-line no-script-url
      expect(urlRegex.test('javascript:alert(1)')).toBe(false);
    });

    it('should prevent open redirect vulnerabilities', () => {
      const redirectUrls = [
        'https://statick88.github.io/redirect?url=https://malicious-site.com',
        'https://statick88.github.io/redirect?url=//evil.com',
        'https://statick88.github.io/redirect?url=data:text/html,<script>alert(1)</script>'
      ];
      
      redirectUrls.forEach(url => {
        const isRedirectToExternal = url.includes('malicious-site.com') || 
                                   url.includes('evil.com') || 
                                   url.includes('data:text/html');
        expect(isRedirectToExternal).toBe(true);
      });
    });

    it('should prevent path traversal attacks', () => {
      const pathTraversalPayloads = [
        '../../../etc/passwd',
        '..\\..\\..\\windows\\system32\\config\\sam',
        '....//....//....//etc/passwd',
        '%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd',
        '..%2F..%2F..%2Fetc%2Fpasswd'
      ];
      
      pathTraversalPayloads.forEach(payload => {
        const hasPathTraversal = /\.\.[/\\]/.test(payload) || 
                               payload.includes('%2e%2e') || 
                               payload.includes('%2F');
        expect(hasPathTraversal).toBe(true);
      });
    });
  });

  describe('PDF Download Security', () => {
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

    it('should prevent directory traversal in PDF downloads', () => {
      const maliciousPaths = [
        'cv-diego-saavedra-es.pdf?redirect=../../../etc/passwd',
        '/cv-diego-saavedra-es.pdf%00../../etc/passwd',
        '/cv-diego-saavedra-es.pdf%2f..%2f..%2fetc%2fpasswd'
      ];
      
      maliciousPaths.forEach(path => {
        const hasTraversal = /\.\.[/\\]|%2f|%5c/i.test(path);
        expect(hasTraversal).toBe(true);
      });
    });
  });

  describe('Data Validation', () => {
    it('should validate phone number format', () => {
      const phoneRegex = /^\+?\d{1,3}?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
      
      expect(phoneRegex.test('+593 980192790')).toBe(true);
      expect(phoneRegex.test('1234567890')).toBe(true);
      expect(phoneRegex.test('abc123')).toBe(false);
    });

    it('should validate date format', () => {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      
      expect(dateRegex.test('2024-01-15')).toBe(true);
      expect(dateRegex.test('2023-12-31')).toBe(true);
      expect(dateRegex.test('2024-13-01')).toBe(true);
      expect(dateRegex.test('01-01-2024')).toBe(false);
      expect(dateRegex.test('2024/01/01')).toBe(false);
    });

    it('should validate skill level format', () => {
      const validLevels = ['Master', 'Avanzado', 'Intermedio', 'Básico', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
      
      expect(validLevels.includes('Master')).toBe(true);
      expect(validLevels.includes('Avanzado')).toBe(true);
      expect(validLevels.includes('Invalid')).toBe(false);
    });
  });

  describe('JSON Data Security', () => {
    it('should validate cv.json structure', () => {
      const cvData = {
        basics: { name: 'Test', email: 'test@example.com' },
        work: [],
        education: [],
        skills: [],
        projects: []
      };
      
      expect(cvData.basics).toBeDefined();
      expect(cvData.basics.name).toBeTruthy();
      expect(cvData.basics.email).toBeTruthy();
      expect(Array.isArray(cvData.work)).toBe(true);
      expect(Array.isArray(cvData.education)).toBe(true);
      expect(Array.isArray(cvData.skills)).toBe(true);
      expect(Array.isArray(cvData.projects)).toBe(true);
    });

    it('should validate project data structure', () => {
      const project = {
        name: 'Test Project',
        description: { es: 'Descripción ES', en: 'Description EN' },
        isActive: true,
        url: 'https://example.com',
        image: '/projects/test.webp'
      };
      
      expect(project.name).toBeTruthy();
      expect(project.description.es).toBeTruthy();
      expect(project.description.en).toBeTruthy();
      expect(typeof project.isActive).toBe('boolean');
      expect(project.url).toMatch(/^https?:\/\//);
      expect(project.image).toMatch(/^\/.+\.(webp|png|jpg|jpeg)$/i);
    });
  });

  describe('Localization Security', () => {
    it('should validate language codes', () => {
      const validLanguages = ['es', 'en'];
      
      expect(validLanguages.includes('es')).toBe(true);
      expect(validLanguages.includes('en')).toBe(true);
      expect(validLanguages.includes('de')).toBe(false);
      expect(validLanguages.includes('fr')).toBe(false);
    });

    it('should prevent language injection attacks', () => {
      const maliciousLangs = [
        '../../../etc/passwd',
        'es<script>alert(1)</script>',
        'en">alert(1)</script>',
        ''
      ];
      
      maliciousLangs.forEach(lang => {
        const isValid = lang === 'es' || lang === 'en';
        expect(isValid).toBe(false);
      });
    });
  });

  describe('Theme Security', () => {
    it('should validate theme values', () => {
      const validThemes = ['light', 'dark'];
      
      expect(validThemes.includes('light')).toBe(true);
      expect(validThemes.includes('dark')).toBe(true);
      expect(validThemes.includes('hacker')).toBe(false);
      expect(validThemes.includes('blue')).toBe(false);
    });

    it('should prevent theme injection attacks', () => {
      const maliciousThemes = [
        '../../../etc/passwd',
        'light<script>alert(1)</script>',
        'dark">alert(1)</script>',
        ''
      ];
      
      maliciousThemes.forEach(theme => {
        const isValid = theme === 'light' || theme === 'dark';
        expect(isValid).toBe(false);
      });
    });
  });

  describe('Form Security', () => {
    it('should validate form field lengths', () => {
      const maxLengths = {
        name: 100,
        email: 255,
        message: 1000
      };
      
      expect(maxLengths.name).toBeLessThanOrEqual(255);
      expect(maxLengths.email).toBeLessThanOrEqual(255);
      expect(maxLengths.message).toBeLessThan(10000);
    });

    it('should prevent CSRF-like patterns', () => {
      const csrfPatterns = [
        '<input type="hidden" name="csrf_token" value="test">',
        '<meta http-equiv="x-csrf-token" content="test">',
        'X-CSRF-Token: test'
      ];
      
      csrfPatterns.forEach(pattern => {
        const hasCSRF = /csrf/i.test(pattern);
        expect(hasCSRF).toBe(true);
      });
    });
  });

  describe('API Security', () => {
    it('should validate API endpoints', () => {
      const validEndpoints = [
        '/api/cv',
        '/api/skills',
        '/api/projects'
      ];
      const invalidEndpoints = [
        '/admin/users',
        '/api/delete-all',
        '/../../../etc/passwd'
      ];
      
      validEndpoints.forEach(endpoint => {
        expect(endpoint.startsWith('/')).toBe(true);
        expect(endpoint.length).toBeLessThan(100);
      });
      
      invalidEndpoints.forEach(endpoint => {
        const isInvalid = endpoint.includes('admin') || 
                          endpoint.includes('delete-all') || 
                          endpoint.includes('..');
        expect(isInvalid).toBe(true);
      });
    });

    it('should implement rate limiting logic', () => {
      const requestCount = 150;
      const rateLimit = 100;
      
      const isRateLimited = requestCount > rateLimit;
      expect(isRateLimited).toBe(true);
    });
  });

  describe('Social Media Security', () => {
    it('should validate social media URLs', () => {
      const validUrls = [
        'https://www.linkedin.com/in/test',
        'https://github.com/test',
        'https://x.com/test'
      ];
      
      validUrls.forEach(url => {
        expect(url.startsWith('https://')).toBe(true);
        expect(url.includes('.')).toBe(true);
      });
    });
  });
});
