import { describe, it, expect } from 'vitest';

describe('Input Validation', () => {
  it('should validate email format', () => {
    const validEmails = ['test@example.com', 'user.name@domain.co.uk'];
    const invalidEmails = ['invalid', 'test@', '@example.com', 'test@.com'];
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    validEmails.forEach(email => {
      expect(emailRegex.test(email)).toBe(true);
    });
    
    invalidEmails.forEach(email => {
      expect(emailRegex.test(email)).toBe(false);
    });
  });

  it('should sanitize HTML input', () => {
    const sanitize = (html) => {
      const temp = document.createElement('div');
      temp.textContent = html;
      return temp.innerHTML;
    };
    
    const maliciousInput = '<script>alert("xss")</script>';
    const sanitized = sanitize(maliciousInput);
    
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('</script>');
  });
});
