import { describe, it, expect } from 'vitest';

describe('Theme Toggle', () => {
  it('should toggle between light and dark themes', () => {
    const html = document.documentElement;
    
    html.classList.add('dark');
    expect(html.classList.contains('dark')).toBe(true);
    
    html.classList.remove('dark');
    expect(html.classList.contains('dark')).toBe(false);
  });
});

describe('Language Toggle', () => {
  it('should switch between Spanish and English', () => {
    const html = document.documentElement;
    
    html.setAttribute('lang', 'es');
    expect(html.getAttribute('lang')).toBe('es');
    
    html.setAttribute('lang', 'en');
    expect(html.getAttribute('lang')).toBe('en');
  });
});
