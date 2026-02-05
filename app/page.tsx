"use client";

import Image from "next/image";
import MuxPlayer from "@mux/mux-player-react";
import { useState, useRef, useEffect, type ElementRef } from "react";

export default function Page() {
  const videoRef = useRef<ElementRef<typeof MuxPlayer> | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const [muted, setMuted] = useState(true);
  // Mouse tracing canvas
  const traceCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Procedural mouse tracing network effect
  useEffect(() => {
    const canvas = traceCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Device performance detection for adaptive quality
    const isLowTierDevice = (() => {
      // Check for various low-performance indicators
      const ua = navigator.userAgent.toLowerCase();
      const isOldAndroid = /android/.test(ua) && !/chrome\/[6-9][0-9]/.test(ua); // Pre-Chrome 60
      const isOldIOS = /iphone|ipad/.test(ua) && /os [5-9]_/.test(ua); // iOS 5-9
      
      // Type-safe checks for experimental navigator APIs
      const navWithMemory = navigator as Navigator & { deviceMemory?: number };
      const navWithConcurrency = navigator as Navigator & { hardwareConcurrency?: number };
      const navWithConnection = navigator as Navigator & { 
        connection?: { effectiveType?: string } 
      };
      
      const hasLowMemory = navWithMemory.deviceMemory && navWithMemory.deviceMemory <= 2; // 2GB or less
      const hasSlowCPU = navWithConcurrency.hardwareConcurrency && navWithConcurrency.hardwareConcurrency <= 2; // 2 cores or less
      const hasSlowConnection = navWithConnection.connection && 
        (navWithConnection.connection.effectiveType === 'slow-2g' || navWithConnection.connection.effectiveType === '2g');
      
      return isOldAndroid || isOldIOS || hasLowMemory || hasSlowCPU || hasSlowConnection;
    })();

    // Check for extremely low-end devices that should disable tracing entirely
    const isVeryLowTierDevice = (() => {
      const ua = navigator.userAgent.toLowerCase();
      const isVeryOldAndroid = /android [2-4]\./.test(ua); // Android 2-4
      const isVeryOldIOS = /os [4-7]_/.test(ua); // iOS 4-7
      
      // Type-safe check for device memory
      const navWithMemory = navigator as Navigator & { deviceMemory?: number };
      const hasVeryLowMemory = navWithMemory.deviceMemory && navWithMemory.deviceMemory <= 1; // 1GB or less
      
      return isVeryOldAndroid || isVeryOldIOS || hasVeryLowMemory;
    })();

    // Exit early for very low-end devices
    if (isVeryLowTierDevice) {
      console.log('Tracing disabled for very low-tier device');
      return;
    }

    // Adaptive quality settings
    const quality = isLowTierDevice ? {
      dpr: Math.min(window.devicePixelRatio || 1, 1.5), // Cap DPR for performance
      particleCount: 20, // Reduce particles
      maxActiveTargets: 30, // Reduce active targets
      frameSkip: 2, // Skip every 2nd frame
      interactionRadius: 180, // Smaller interaction area
      enableScanlines: false, // Disable expensive scanlines
      enableParticlePhysics: false // Simplify particle movement
    } : {
      dpr: window.devicePixelRatio || 1,
      particleCount: 46,
      maxActiveTargets: 90,
      frameSkip: 1,
      interactionRadius: 260,
      enableScanlines: true,
      enableParticlePhysics: true
    };

    // Log performance mode for debugging
    console.log(`Tracing performance mode: ${isLowTierDevice ? 'Low-tier optimized' : 'High-performance'}`, quality);

    let width = window.innerWidth, height = Math.max(window.innerHeight, document.documentElement.scrollHeight);
    let frameCounter = 0; // For frame skipping
    const resize = () => {
      width = window.innerWidth; 
      height = Math.max(window.innerHeight, document.documentElement.scrollHeight);
      canvas.width = width * quality.dpr; canvas.height = height * quality.dpr;
      canvas.style.width = width + 'px'; canvas.style.height = height + 'px';
      ctx.setTransform(quality.dpr,0,0,quality.dpr,0,0);
    };
    resize();
    window.addEventListener('resize', resize);

    // Collect traceable elements (blocks + individual letters)
    let targets: { el: Element; rect: DOMRect; letter: boolean }[] = [];
    const collect = () => {
      targets = Array.from(document.querySelectorAll('[data-trace],[data-trace-letter]')).map(el => {
        const rect = el.getBoundingClientRect();
        // Convert viewport coordinates to document coordinates
        return {
          el,
          rect: new DOMRect(
            rect.left + window.scrollX, 
            rect.top + window.scrollY, 
            rect.width, 
            rect.height
          ),
          letter: (el as HTMLElement).hasAttribute('data-trace-letter')
        };
      });
    };
    collect();
    const refreshRects = () => {
      for (const t of targets) {
        const rect = t.el.getBoundingClientRect();
        // Convert viewport coordinates to document coordinates
        t.rect = new DOMRect(
          rect.left + window.scrollX, 
          rect.top + window.scrollY, 
          rect.width, 
          rect.height
        );
      }
    };
    // Still need to update rects on scroll since elements move as content scrolls
    window.addEventListener('scroll', () => requestAnimationFrame(refreshRects), { passive: true });

  // Particles
    interface P { x:number; y:number; vx:number; vy:number; life:number; size:number; }
    const particles: P[] = Array.from({ length: quality.particleCount }).map(() => ({
      x: Math.random()*width,
      y: Math.random()*height,
      vx: 0, vy: 0,
      life: 0.6 + Math.random()*0.9,
      size: 2 + Math.random()*2.2
    }));

    // Mouse state
    let mx = width/2, my = height/2, active = false;
    const move = (e: PointerEvent) => { 
      mx = e.clientX; 
      my = e.clientY + window.scrollY; // Adjust for scroll position since canvas is now absolute
      active = true; 
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerleave', () => { active = false; });

    let last = performance.now();
  // Random activation state map (letter targets flicker organically)
  const activation = new Map<Element, number>();
  const loop = (now: number) => {
      // Frame skipping for low-tier devices
      frameCounter++;
      if (frameCounter % quality.frameSkip !== 0) {
        requestAnimationFrame(loop);
        return;
      }

      const dt = Math.min(60, now - last)/1000; last = now;
      ctx.clearRect(0,0,width,height);

      // Hero exclusion: only disable when cursor is within video bounds AND user is at top of page
      const heroEl = heroRef.current;
      let inHero = false;
      if (heroEl) {
        const r = heroEl.getBoundingClientRect();
        // Convert hero rect to document coordinates to match mouse coordinates
        const heroDocRect = {
          left: r.left + window.scrollX,
          right: r.right + window.scrollX,
          top: r.top + window.scrollY,
          bottom: r.bottom + window.scrollY
        };
        const cursorInHeroArea = mx >= heroDocRect.left && mx <= heroDocRect.right && my >= heroDocRect.top && my <= heroDocRect.bottom;
        
        // Only suppress when cursor is in hero AND user hasn't scrolled much (still at very top of page)
        // This allows tracing to be active when scrolled below the hero, even if video is partially visible
        const stillAtTop = window.scrollY < 100; // Small threshold instead of full hero height
        
        inHero = cursorInHeroArea && stillAtTop;
      }

      if (inHero) { requestAnimationFrame(loop); return; }

      // Vertical scanlines (disabled on low-tier devices for performance)
      if (quality.enableScanlines) {
        ctx.save();
        ctx.globalAlpha = 0.05;
        ctx.fillStyle = '#000';
        for (let x=0; x<width; x+=4) ctx.fillRect(x,0,1,height);
        ctx.restore();
      }

      // Particle physics (simplified for low-tier devices)
      particles.forEach(p => {
        p.life -= dt*0.15;
        if (p.life <= 0) {
          p.x = active ? mx + (Math.random()*120-60) : Math.random()*width;
          p.y = active ? my + (Math.random()*120-60) : Math.random()*height;
          p.vx = p.vy = 0;
          p.life = 0.6 + Math.random()*0.9;
          p.size = 2 + Math.random()*2.2;
        }
        
        if (quality.enableParticlePhysics) {
          // Full physics for high-end devices
          if (active) {
            const dx = mx - p.x, dy = my - p.y; const dist = Math.hypot(dx,dy) || 1;
            const f = Math.min(180, 260/dist);
            p.vx += (dx/dist)*f*dt*0.65;
            p.vy += (dy/dist)*f*dt*0.65;
          }
          // Nearby target attraction
          let closest: DOMRect | null = null; let closestD = Infinity;
          for (const t of targets) {
            const cx = t.rect.left + t.rect.width/2;
              const cy = t.rect.top + t.rect.height/2;
              const dx = cx - p.x, dy = cy - p.y; const d = dx*dx+dy*dy;
              if (d < 150*150 && d < closestD) { closestD = d; closest = t.rect; }
          }
          if (closest) {
            const cx = closest.left + closest.width/2;
            const cy = closest.top + closest.height/2;
            const dx = cx - p.x, dy = cy - p.y; const dist = Math.hypot(dx,dy)||1;
            p.vx += (dx/dist)*30*dt;
            p.vy += (dy/dist)*30*dt;
          }
          p.vx *= 0.9; p.vy *= 0.9;
          p.x += p.vx*dt*60; p.y += p.vy*dt*60;
        } else {
          // Simplified movement for low-tier devices
          if (active) {
            const dx = mx - p.x, dy = my - p.y;
            p.x += dx * dt * 0.3;
            p.y += dy * dt * 0.3;
          }
        }
        
        // Boundary wrapping
        if (p.x < -40) p.x = width+40; else if (p.x > width+40) p.x = -40;
        if (p.y < -40) p.y = height+40; else if (p.y > height+40) p.y = -40;
      });

  // Particle network connections are disabled when not near text (gated later)

      // Hook lines & outlines (random evolving selection of nearby letters)
      ctx.font = '10px var(--font-body)';
      const nowActive: Element[] = [];
      // Determine nearest target distance for gating
      let nearestDist = Infinity;
      for (const t of targets) {
        const r = t.rect; const cx = r.left + r.width/2, cy = r.top + r.height/2;
        const dx = cx - mx, dy = cy - my; const d = Math.hypot(dx,dy);
        if (d < nearestDist) nearestDist = d;
      }
      const interactionRadius = quality.interactionRadius;
      const maxSimulLetters = quality.maxActiveTargets;
      const decay = dt * 0.25; // slower fade so items linger
      // Pre-pass: compute / attempt activation
      for (const t of targets) {
  const { left, top, width: w, height: h } = t.rect;
        const cx = left + w/2, cy = top + h/2;
        const dx = cx - mx, dy = cy - my; const dist = Math.hypot(dx,dy);
        const outer = t.letter ? 135 : 280; // slightly generous radius
  if (dist < outer && nearestDist < interactionRadius) {
          const falloff = 1 - dist/outer; // 0..1
          // Base probability higher for block targets so they pulse occasionally
            const baseP = t.letter ? 0.012 : 0.025; // drastically reduced spawn probability
          const current = activation.get(t.el) || 0;
          if (Math.random() < baseP * falloff * dt * 60) { // still frame-rate normalized
            const boost = t.letter ? 1 : 0.9; // full intensity for letters
            activation.set(t.el, Math.min(1, current + boost));
          } else if (current > 0) {
            activation.set(t.el, current - decay);
          }
        } else {
          const current = activation.get(t.el) || 0;
          if (current > 0) activation.set(t.el, current - decay*1.1);
        }
        const a = activation.get(t.el);
        if (a && a > 0) nowActive.push(t.el);
      }
      // Cleanup fully faded
      for (const [el, a] of activation.entries()) if (a <= 0) activation.delete(el);
      // Limit active pool randomly if over cap
      if (nowActive.length > maxSimulLetters) {
        for (let i = nowActive.length - 1; i >= maxSimulLetters; i--) {
          const idx = Math.floor(Math.random()*nowActive.length);
          const el = nowActive[idx];
          activation.set(el, (activation.get(el) || 0) * 0.85); // soften
          nowActive.splice(idx,1);
        }
      }
      // If cursor far from all targets, skip drawing overlays entirely
      if (nearestDist >= interactionRadius) {
        // Do not render particles or lines when cursor is far from all targets
        requestAnimationFrame(loop); return;
      }
      // Draw pass
      let linesDrawn = 0; const maxLines = 6; // fewer simultaneous lines for calmer motion
      const slowT = now * 0.00025; // slow temporal factor
      let targetIdx = 0;
      for (const t of targets) {
        const a = activation.get(t.el);
        if (!a || a <= 0) continue;
        const { left, top, width: w, height: h } = t.rect;
        const cx = left + w/2, cy = top + h/2;
        const pad = t.letter ? 1 : 3;
        const alpha = (t.letter ? 0.35 : 0.45) * a;
        ctx.strokeStyle = `rgba(0,0,0,${alpha})`;
        ctx.strokeRect(left-pad, top-pad, w+pad*2, h+pad*2);
        if (a > 0.6 && linesDrawn < maxLines) {
          const dx = cx - mx, dy = cy - my; const dist = Math.hypot(dx,dy) || 1;
          const normX = dx / dist, normY = dy / dist;
          const px = -normY, py = normX; // perpendicular
          // Deterministic phase per target for stable, slow drifting curves
          const phase = targetIdx * 3.137 + (t.letter ? 0 : 1.23);
          const wobbleFactor = 0.35 + 0.25 * Math.sin(slowT + phase);
          const baseWobble = Math.min(140, dist * 0.45);
          const wobble = baseWobble * wobbleFactor;
          const bendSign = Math.sin(slowT * 0.6 + phase) >= 0 ? 1 : -1;
          const midX = mx + dx*0.55 + px * wobble * bendSign;
          const midY = my + dy*0.55 + py * wobble * bendSign;
          ctx.lineCap = 'round'; ctx.lineJoin = 'round';
          const g = ctx.createLinearGradient(mx,my,cx,cy);
          g.addColorStop(0, `rgba(0,0,0,0)`);
          g.addColorStop(0.2, `rgba(0,0,0,${alpha*0.5})`);
          g.addColorStop(0.8, `rgba(0,0,0,${alpha*0.5})`);
          g.addColorStop(1, `rgba(0,0,0,0)`);
          ctx.strokeStyle = g;
          ctx.beginPath();
          ctx.moveTo(mx,my);
          ctx.quadraticCurveTo(midX, midY, cx, cy);
          ctx.stroke();
          linesDrawn++;
          if (!t.letter) {
            ctx.fillStyle = `rgba(0,0,0,${0.5*alpha})`;
            ctx.fillText(((cx/innerWidth)*100).toFixed(1)+','+((cy/innerHeight)*100).toFixed(1), left-2, top-6);
          }
        }
        targetIdx++;
      }

      // Particles (alternate between boxes & dots) only when within interaction radius
      particles.forEach((p,i) => {
        if (i % 3 === 0) {
          ctx.save(); ctx.translate(p.x,p.y); ctx.rotate((p.vx+p.vy)*0.02);
          ctx.strokeStyle = 'rgba(0,0,0,0.45)';
          ctx.strokeRect(-p.size, -p.size*0.6, p.size*2, p.size*1.2);
          ctx.restore();
        } else {
          ctx.beginPath(); ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.arc(p.x,p.y,p.size*0.35,0,Math.PI*2); ctx.fill();
        }
      });

      requestAnimationFrame(loop);
    };
    const id = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', move);
    };
  }, []);

  // Ensure full-bleed video height on iOS dynamic viewport changes
  useEffect(() => {
    const setAppHeight = () => {
      const height = window.visualViewport?.height || window.innerHeight;
      document.documentElement.style.setProperty("--app-height", `${height}px`);
    };
    setAppHeight();
    window.addEventListener("resize", setAppHeight);
    window.visualViewport?.addEventListener("resize", setAppHeight);
    return () => {
      window.removeEventListener("resize", setAppHeight);
      window.visualViewport?.removeEventListener("resize", setAppHeight);
    };
  }, []);

  return (
    <>
      {/* Mouse tracing overlay */}
      <canvas ref={traceCanvasRef} className="absolute inset-0 pointer-events-none z-30 mix-blend-multiply" aria-hidden="true" />

      {/* Hero Section */}
      <section ref={heroRef} className="hero-section relative overflow-hidden">
        <MuxPlayer
          ref={videoRef}
          className="hero-video"
          playbackId="YeOipCkirJz0232Wv02qjDovwfoqq7S00b4iFf00Degg214"
          autoPlay
          loop
          muted={muted}
          playsInline
          controls={false}
          poster="/brand/hero-poster.jpg"
          metadataVideoTitle="Overtone Festival Aftermovie"
          metadataVideoId="overtone-2025-aftermovie"
        />
          <div className="safe-area relative z-10 flex min-h-[100svh] w-full px-6">
            <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center text-[var(--acid)] no-stroke">
              <Image
                src="/logo-wordmark.svg"
                alt="Overtone Festival"
                width={1200}
                height={180}
                className="mx-auto h-auto w-full max-w-4xl"
                priority
              />

              <div className="flex-1" />

              <div className="flex w-full flex-col items-center gap-0">
                <p
                  className="max-w-[18rem] text-base font-medium leading-snug !text-[var(--acid)] sm:max-w-none sm:text-[1.4rem] lg:text-[1.6rem]"
                  style={{ fontFamily: "var(--font-header)" }}
                >
                  Thank you for joining us at the first edition of Overtone Festival. We return in 2026.
                </p>
              <h1
                className="text-[1.6rem] font-semibold leading-snug !text-[var(--acid)] sm:text-[2.2rem] lg:text-[2.7rem]"
                style={{ fontFamily: "var(--font-header)" }}
              >
                To stay up to date on news and information subscribe to our mailing list below
              </h1>
              </div>

              <div className="flex-1" />

              <div className="flex flex-col items-center gap-5 pb-6">
                <a
                  href="https://overtone.fillout.com/earlyaccess"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="holo-btn inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-semibold uppercase tracking-[0.25em] !text-white backdrop-blur transition"
                  style={{ fontFamily: "var(--font-header)" }}
                >
                  Subscribe
                </a>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                  <a
                    href="https://www.instagram.com/overtone.festival/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="holo-btn flex h-10 w-10 items-center justify-center rounded-full !text-white transition"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
                      <path d="M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4Zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm6-7.95a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM12 2.5c2.6 0 2.9 0 3.9.06 1 .05 1.6.22 2 .37.56.22.96.48 1.38.9.42.42.68.82.9 1.38.15.4.32 1 .37 2 .06 1 .06 1.3.06 3.9s0 2.9-.06 3.9c-.05 1-.22 1.6-.37 2-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.4.15-1 .32-2 .37-1 .06-1.3.06-3.9.06s-2.9 0-3.9-.06c-1-.05-1.6-.22-2-.37-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.15-.4-.32-1-.37-2C2.5 14.9 2.5 14.6 2.5 12s0-2.9.06-3.9c.05-1 .22-1.6.37-2 .22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.4-.15 1-.32 2-.37C9.1 2.5 9.4 2.5 12 2.5Zm0-1.5C9.3 1 9 1 8 1c-1.04.05-1.8.22-2.45.47a4.6 4.6 0 0 0-1.67 1.08A4.6 4.6 0 0 0 2.8 4.2c-.25.65-.42 1.41-.47 2.45C2 7.65 2 8 2 12s0 4.35.33 5.35c.05 1.04.22 1.8.47 2.45.23.58.54 1.08 1.08 1.67.59.54 1.09.85 1.67 1.08.65.25 1.41.42 2.45.47C9 23 9.3 23 12 23s3 0 4-.33c1.04-.05 1.8-.22 2.45-.47.58-.23 1.08-.54 1.67-1.08.54-.59.85-1.09 1.08-1.67.25-.65.42-1.41.47-2.45C22 16.35 22 16 22 12s0-3.35-.33-4.35c-.05-1.04-.22-1.8-.47-2.45a4.6 4.6 0 0 0-1.08-1.67A4.6 4.6 0 0 0 18.6 1.47c-.65-.25-1.41-.42-2.45-.47C15 1 14.7 1 12 1Z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.facebook.com/profile.php?id=61579053744346"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="holo-btn flex h-10 w-10 items-center justify-center rounded-full !text-white transition"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
                      <path d="M22 12.06C22 6.48 17.52 2 11.94 2S2 6.48 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.tiktok.com/@overtone.festival"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    className="holo-btn flex h-10 w-10 items-center justify-center rounded-full !text-white transition"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
                      <path d="M21 8.25c-1.47.02-2.9-.46-4.03-1.36v7.03c0 3.66-2.97 6.63-6.63 6.63a6.63 6.63 0 0 1-6.63-6.63c0-3.66 2.97-6.63 6.63-6.63.3 0 .6.02.9.06v3.34a3.3 3.3 0 0 0-.9-.13 3.36 3.36 0 1 0 3.36 3.36V2.5h3.18c.08.63.26 1.24.52 1.82.6 1.35 1.83 2.3 3.17 2.45v1.48Z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        {/* Audio toggle button */}
        <button
          onClick={() => {
            const v = videoRef.current;
            if (!v) return;
            const nextMuted = !v.muted;
            v.muted = nextMuted;
            // Ensure audible playback on user gesture
            if (!nextMuted) {
              v.volume = 1;
              v.play().catch(() => {});
            }
            setMuted(nextMuted);
          }}
          className="audio-toggle absolute right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-[var(--acid)] border border-white/20 backdrop-blur-sm hover:bg-black/70 transition"
          aria-label={muted ? 'Unmute hero video' : 'Mute hero video'}
        >
          {muted ? (
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 stroke-current">
              <path d="M3 10v4h4l5 4V6L7 10H3z" fill="none" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M16 9a4 4 0 0 1 0 6" fill="none" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M19 5a9 9 0 0 1 0 14" fill="none" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M5 5l14 14" fill="none" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 stroke-current">
              <path d="M3 10v4h4l5 4V6L7 10H3z" fill="none" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M16 9a4 4 0 0 1 0 6" fill="none" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M19 5a9 9 0 0 1 0 14" fill="none" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </section>
    </>
  );
}
