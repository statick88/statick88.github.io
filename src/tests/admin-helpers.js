// Helper functions para testing
export function validatePDFFile(file) {
  return file.type === 'application/pdf';
}

export function validateFileSize(file, maxSize) {
  return file.size <= maxSize;
}

export function sanitizeInput(input) {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}

export function createRateLimiter(maxRequests, windowMs) {
  const requests = [];
  
  return {
    check() {
      const now = Date.now();
      const windowStart = now - windowMs;
      
      // Remove old requests
      while (requests.length > 0 && requests[0] < windowStart) {
        requests.shift();
      }
      
      if (requests.length >= maxRequests) {
        return false;
      }
      
      requests.push(now);
      return true;
    }
  };
}