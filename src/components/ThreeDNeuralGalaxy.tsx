/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  speedZ: number;
  interactive?: boolean;
}

interface CodeFragment {
  text: string;
  x: number;
  y: number;
  z: number;
  speed: number;
  opacity: number;
}

export default function ThreeDNeuralGalaxy({ theme }: { theme: "light" | "dark" }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 600, height: 600 });

  // Handle intersection observer to pause animations when offscreen
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Handle responsive canvas resizing
  useEffect(() => {
    if (!containerRef.current) return;

    const handleResize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({
          width: clientWidth || 600,
          height: clientHeight || 600,
        });
      }
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Main Canvas loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const particles: Particle[] = [];
    const particleCount = 200;
    const maxDistance = 90;

    const fragments: CodeFragment[] = [
      { text: "const mentra = ai()", x: 0, y: 0, z: 0, speed: 0.1, opacity: 0.8 },
      { text: "import { learn }", x: 0, y: 0, z: 0, speed: 0.15, opacity: 0.6 },
      { text: "function build()", x: 0, y: 0, z: 0, speed: 0.08, opacity: 0.5 },
      { text: "await practice()", x: 0, y: 0, z: 0, speed: 0.12, opacity: 0.7 },
      { text: "=> compile", x: 0, y: 0, z: 0, speed: 0.18, opacity: 0.4 },
      { text: "CompanionMode", x: 0, y: 0, z: 0, speed: 0.09, opacity: 0.6 },
    ];

    // Mouse coordinates (centered around origin)
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const colors = {
      light: {
        node: "rgba(31, 41, 55, 0.75)", // Dark gray
        line: "rgba(31, 41, 55, 0.08)",
        glowingNode: "rgba(242, 125, 38, 0.95)",
        text: "rgba(107, 114, 128, 0.7)",
      },
      dark: {
        node: "rgba(243, 244, 246, 0.75)", // Off-white
        line: "rgba(243, 244, 246, 0.06)",
        glowingNode: "rgba(242, 125, 38, 0.95)",
        text: "rgba(156, 163, 175, 0.5)",
      },
    };

    // Initialize code fragments in 3D
    fragments.forEach((f) => {
      f.x = (Math.random() - 0.5) * 400;
      f.y = (Math.random() - 0.5) * 400;
      f.z = (Math.random() - 0.5) * 400;
    });

    // Initialize particles in 3D sphere layout
    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 160 + Math.random() * 80; // Layered sphere shell

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      // Distinct custom particles
      const colorType = Math.random();
      let color = theme === "dark" ? "rgba(255, 255, 255, 0.7)" : "rgba(31, 41, 55, 0.7)";
      if (colorType > 0.8) {
        color = "rgba(242, 125, 38, 0.9)"; // Artistic peach accent
      } else if (colorType > 0.95) {
        color = theme === "dark" ? "rgba(167, 139, 250, 0.9)" : "rgba(124, 58, 237, 0.9)"; // Purple accent
      }

      particles.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        size: Math.random() * 2.2 + 0.8,
        color,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        speedZ: (Math.random() - 0.5) * 0.2,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      // Convert to -width/2 to width/2
      mouse.targetX = clientX - canvas.width / 2;
      mouse.targetY = clientY - canvas.height / 2;
    };

    const handleMouseLeave = () => {
      mouse.targetX = 0;
      mouse.targetY = 0;
    };

    window.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // 3D rotation angles
    let angleY = 0.0018;
    let angleX = 0.0008;

    const rotateY = (point: { x: number; y: number; z: number }, phiAngle: number) => {
      const cos = Math.cos(phiAngle);
      const sin = Math.sin(phiAngle);
      const x = point.x * cos - point.z * sin;
      const z = point.x * sin + point.z * cos;
      return { ...point, x, z };
    };

    const rotateX = (point: { x: number; y: number; z: number }, thetaAngle: number) => {
      const cos = Math.cos(thetaAngle);
      const sin = Math.sin(thetaAngle);
      const y = point.y * cos - point.z * sin;
      const z = point.y * sin + point.z * cos;
      return { ...point, y, z };
    };

    const renderLoop = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(renderLoop);
        return;
      }

      // Smooth mouse spring effect
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const halfWidth = canvas.width / 2;
      const halfHeight = canvas.height / 2;
      const activeColors = theme === "dark" ? colors.dark : colors.light;

      // Project camera perspective
      // Map mouse displacement to rotation angles
      const currentRotationY = angleY + mouse.x * 0.00003;
      const currentRotationX = angleX - mouse.y * 0.00003;

      // Rotate and project particles
      const projected = particles.map((p) => {
        // Drift particle slightly
        p.baseX += p.speedX;
        p.baseY += p.speedY;
        p.baseZ += p.speedZ;

        // Keep inside sphere shell limits
        const d = Math.sqrt(p.baseX * p.baseX + p.baseY * p.baseY + p.baseZ * p.baseZ);
        if (d > 260 || d < 120) {
          p.speedX *= -1;
          p.speedY *= -1;
          p.speedZ *= -1;
        }

        let rotated = { x: p.baseX, y: p.baseY, z: p.baseZ };
        rotated = rotateY(rotated, currentRotationY);
        rotated = rotateX(rotated, currentRotationX);

        // Perspective projection
        const focalLength = 400;
        const scale = focalLength / (focalLength + rotated.z);
        const screenX = halfWidth + rotated.x * scale;
        const screenY = halfHeight + rotated.y * scale;

        return {
          p,
          screenX,
          screenY,
          scale,
          z: rotated.z,
        };
      });

      // Sort by depth (back to front) for volumetric rendering
      projected.sort((a, b) => b.z - a.z);

      // Rotate angle constants slowly for general orbit
      angleY += 0.0005;
      angleX += 0.0002;

      // Project code fragments
      const projectedFragments = fragments.map((f) => {
        let rotated = { x: f.x, y: f.y, z: f.z };
        rotated = rotateY(rotated, currentRotationY);
        rotated = rotateX(rotated, currentRotationX);

        // Slow drift
        f.x += (Math.random() - 0.5) * 0.1;
        f.y += (Math.random() - 0.5) * 0.1;
        if (Math.abs(f.x) > 220) f.x *= -0.9;
        if (Math.abs(f.y) > 220) f.y *= -0.9;

        const focalLength = 400;
        const scale = focalLength / (focalLength + rotated.z);
        const screenX = halfWidth + rotated.x * scale;
        const screenY = halfHeight + rotated.y * scale;

        return {
          f,
          screenX,
          screenY,
          scale,
          z: rotated.z,
        };
      });

      // Draw constellation lines (Network links)
      ctx.lineWidth = 0.8;
      for (let i = 0; i < projected.length; i++) {
        const a = projected[i];
        if (a.scale < 0.2) continue; // Skip too far

        for (let j = i + 1; j < projected.length; j++) {
          const b = projected[j];
          // Simple 3D distance check to keep rendering clean
          const dx = a.p.baseX - b.p.baseX;
          const dy = a.p.baseY - b.p.baseY;
          const dz = a.p.baseZ - b.p.baseZ;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (distance < maxDistance) {
            // Check closeness to mouse coordinates in 2D space for glowing links
            const mouseDx = (a.screenX + b.screenX) / 2 - halfWidth - mouse.x;
            const mouseDy = (a.screenY + b.screenY) / 2 - halfHeight - mouse.y;
            const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);

            const isGlowing = mouseDist < 100;
            const alpha = (1 - distance / maxDistance) * (isGlowing ? 0.35 : 0.15) * a.scale;

            ctx.strokeStyle = isGlowing
              ? `rgba(242, 125, 38, ${alpha})`
              : activeColors.line;

            ctx.beginPath();
            ctx.moveTo(a.screenX, a.screenY);
            ctx.lineTo(b.screenX, b.screenY);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      projected.forEach(({ p, screenX, screenY, scale }) => {
        const radius = p.size * scale;
        if (radius < 0.1) return;

        // Check distance to mouse cursor for magnetic illumination
        const dx = screenX - halfWidth - mouse.x;
        const dy = screenY - halfHeight - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const isNearMouse = dist < 90;
        const sizeMultiplier = isNearMouse ? 1.5 : 1.0;

        ctx.beginPath();
        ctx.arc(screenX, screenY, radius * sizeMultiplier, 0, Math.PI * 2);

        if (isNearMouse) {
          ctx.fillStyle = activeColors.glowingNode;
          // Render extra shadow bloom glow for near nodes
          ctx.shadowBlur = radius * 3;
          ctx.shadowColor = "rgb(242, 125, 38)";
        } else {
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 0;
        }

        ctx.fill();
        ctx.shadowBlur = 0; // Reset
      });

      // Draw floating code snippets
      projectedFragments.forEach(({ f, screenX, screenY, scale }) => {
        if (scale < 0.4) return;
        ctx.font = `italic ${Math.floor(10 * scale)}px var(--font-mono, monospace)`;
        ctx.fillStyle = activeColors.text;
        ctx.fillText(f.text, screenX, screenY);
      });

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [theme, isVisible, dimensions]);

  return (
    <div
      ref={containerRef}
      id="three-d-neural-galaxy"
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="block cursor-crosshair max-w-full max-h-full"
      />
    </div>
  );
}
