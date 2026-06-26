import { useEffect, useRef, useState } from 'react';

const MAX_PARTICLES = 15;

function createParticle(canvasWidth, canvasHeight) {
  return {
    x: Math.random() * canvasWidth,
    y: canvasHeight + Math.random() * 100,
    size: Math.random() * 2 + 1.5, // 1.5-3.5px
    speed: Math.random() * 0.5 + 0.3, // 0.3-0.8 px/frame
    opacity: Math.random() * 0.4 + 0.1, // 0.1-0.5
    hue: Math.random() * 60 + 180, // 180-240 (blue to purple)
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.02,
  };
}

function drawParticle(ctx, particle) {
  ctx.save();
  ctx.translate(particle.x, particle.y);
  ctx.rotate(particle.rotation);
  
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size);
  gradient.addColorStop(0, `hsla(${particle.hue}, 100%, 70%, ${particle.opacity})`);
  gradient.addColorStop(1, `hsla(${particle.hue}, 100%, 50%, 0)`);
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export default function Particles() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const [isVisible, setIsVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Initialize particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const initParticles = () => {
      const width = canvas.width;
      const height = canvas.height;
      particlesRef.current = Array.from({ length: MAX_PARTICLES }, () => 
        createParticle(width, height)
      );
    };

    initParticles();
  }, []);

  // Handle prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // IntersectionObserver for visibility detection
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: '100px' } // Start/stop slightly before entering/leaving viewport
    );

    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  // Resize handler
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);

      // Recreate particles for new dimensions
      particlesRef.current = Array.from({ length: MAX_PARTICLES }, () => 
        createParticle(rect.width, rect.height)
      );
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    let lastTime = 0;

    const animate = (currentTime) => {
      // Skip if not visible or reduced motion preferred
      if (!isVisible || prefersReducedMotion) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      // Update and draw particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const particle = particlesRef.current[i];
        
        particle.y -= particle.speed * (deltaTime / 16.67); // Normalize to 60fps
        particle.rotation += particle.rotationSpeed;

        // Reset particle when it goes off-screen
        if (particle.y < -particle.size) {
          particlesRef.current[i] = createParticle(width, height);
          particlesRef.current[i].y = height + particle.size;
        }

        drawParticle(ctx, particle);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="particles"
      aria-hidden="true"
      role="img"
      aria-label="Decorative animated particles background"
    />
  );
}