import { useEffect, useRef } from 'react';

/**
 * Fond noir avec une grille blanche et une lueur blanche qui suit la souris.
 * Rendu via canvas pour des performances fluides.
 */
export default function GridBackground() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -1000, y: -1000, target: { x: -1000, y: -1000 } });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e) => {
      mouse.current.target.x = e.clientX;
      mouse.current.target.y = e.clientY;
    };
    const onLeave = () => {
      mouse.current.target.x = -1000;
      mouse.current.target.y = -1000;
    };

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      // Fond noir.
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, w, h);

      // Interpolation douce de la position de la lueur.
      mouse.current.x += (mouse.current.target.x - mouse.current.x) * 0.12;
      mouse.current.y += (mouse.current.target.y - mouse.current.y) * 0.12;

      const gridSize = 44;

      // Grille blanche.
      ctx.strokeStyle = 'rgba(255,255,255,0.07)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= w; x += gridSize) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, h);
      }
      for (let y = 0; y <= h; y += gridSize) {
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(w, y + 0.5);
      }
      ctx.stroke();

      // Lueur blanche qui suit la souris (radial).
      const mx = mouse.current.x;
      const my = mouse.current.y;
      const radius = 260;
      if (mx > -500 && my > -500) {
        const glow = ctx.createRadialGradient(mx, my, 0, mx, my, radius);
        glow.addColorStop(0, 'rgba(255,255,255,0.18)');
        glow.addColorStop(0.4, 'rgba(255,255,255,0.06)');
        glow.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);

        // Accentuation de la grille sous la lueur.
        ctx.save();
        ctx.beginPath();
        ctx.arc(mx, my, radius, 0, Math.PI * 2);
        ctx.clip();
        ctx.strokeStyle = 'rgba(255,255,255,0.22)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = 0; x <= w; x += gridSize) {
          ctx.moveTo(x + 0.5, 0);
          ctx.lineTo(x + 0.5, h);
        }
        for (let y = 0; y <= h; y += gridSize) {
          ctx.moveTo(0, y + 0.5);
          ctx.lineTo(w, y + 0.5);
        }
        ctx.stroke();
        ctx.restore();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 h-full w-full"
      aria-hidden="true"
    />
  );
}