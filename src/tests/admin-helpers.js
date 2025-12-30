// Helper functions para testing
function validatePDFFile(file) {
  return file.type === 'application/pdf';
}

function validateFileSize(file, maxSize) {
  return file.size <= maxSize;
}

function sanitizeInput(input) {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}

function createRateLimiter(maxRequests, windowMs) {
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

async function signInWithEmailAndPassword(auth, email, password) {
  return auth.signInWithEmailAndPassword(email, password);
}

async function signOut(auth) {
  return auth.signOut();
}

async function addTraining(training, file) {
  // Mock implementation
  return { id: '123', ...training };
}

async function uploadTraining(formData) {
  // Mock implementation
  return { success: true, id: '123' };
}

// Component mock
function TrainingComponent({ trainings }) {
  // Mock component implementation
  return {
    getByText: (text) => ({ textContent: text }),
    queryByText: (text) => text === 'Test Training' ? { textContent: text } : null
  };
}

function render(component, props) {
  return component(props);
}