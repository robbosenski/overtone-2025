"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import type { ReactNode } from 'react';

export default function Page() {
  // Unified lineup list with country codes
  const lineupAll = [
    { name: "FOUR TET", code: "UK", spotify: "https://open.spotify.com/embed/artist/7Eu1txygG6nJttLHbZdQOh" },
    { name: "X CLUB.", code: "AU", spotify: "https://open.spotify.com/embed/artist/4CYPaFp9yDrNduNptv0DPQ" },
    { name: "FLOATING POINTS", code: "UK", spotify: "https://open.spotify.com/embed/artist/2AR42Ur9PcchQDtEdwkv4L" },
    { name: "1TBSP", code: "AU", spotify: "https://open.spotify.com/embed/artist/6G01WYFYF91rjG5LtwMhY4" },
    { name: "ATSUO THE PINEAPPLE DONKEY (LIVE)", code: "JP" },
    { name: "FUKHED", code: "AU", soundcloud: "https://soundcloud.com/fukhedaus/breakmyheart" },
    { name: "IN2STELLAR", code: "AU", spotify: "https://open.spotify.com/embed/artist/6JDTszsnsJ44yCRBnISbVq" },
    { name: "MIKALAH WATEGO", code: "AU", soundcloud: "https://soundcloud.com/resident-advisor/ra-live-mikalah-watego-pitch-music-arts-2025-australia" },
    { name: "INVT B2B SKEE MASK", code: "US/DE", soundcloud: "https://soundcloud.com/climate-of-fear/invt-b2b-skee-mask-climate-of-fear" },
    { name: "SUPERGLOSS", code: "DE", spotify: "https://open.spotify.com/embed/artist/7uvZrAOASv4qg1VawEFR7Z" },
    { name: "WOLTERS", code: "AU", spotify: "https://open.spotify.com/embed/artist/3gWrhUgsZptXzw4SHZUgOl" },
  ];
  const [heroVideoActive, setHeroVideoActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const [pastHero, setPastHero] = useState(false);
  const [heroHeight, setHeroHeight] = useState(0);
  const [openArtist, setOpenArtist] = useState<string | null>(null);
  const [muted, setMuted] = useState(true);
  const [loadedPlayers, setLoadedPlayers] = useState<Set<string>>(new Set());
  // Mouse tracing canvas
  const traceCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Procedural mouse tracing network effect
  useEffect(() => {
    const canvas = traceCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

  // Use higher DPR for crisper lines but cap to avoid perf issues
  const dpr = Math.min(3, window.devicePixelRatio || 1);
  const hairline = 1 / dpr; // consistent hairline thickness
    let width = window.innerWidth, height = window.innerHeight;
    const resize = () => {
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = width * dpr; canvas.height = height * dpr;
      canvas.style.width = width + 'px'; canvas.style.height = height + 'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.imageSmoothingEnabled = false;
    };
    resize();
    window.addEventListener('resize', resize);

    // Collect traceable elements (blocks + individual letters)
    let targets: { el: Element; rect: DOMRect; letter: boolean }[] = [];
    const collect = () => {
      targets = Array.from(document.querySelectorAll('[data-trace],[data-trace-letter]')).map(el => ({
        el,
        rect: el.getBoundingClientRect(),
        letter: (el as HTMLElement).hasAttribute('data-trace-letter')
      }));
    };
    collect();
    const refreshRects = () => {
      for (const t of targets) t.rect = t.el.getBoundingClientRect();
    };
    window.addEventListener('scroll', () => requestAnimationFrame(refreshRects), { passive: true });

  // Particles
    interface P { x:number; y:number; vx:number; vy:number; life:number; size:number; }
    const particles: P[] = Array.from({ length: 46 }).map(() => ({
      x: Math.random()*width,
      y: Math.random()*height,
      vx: 0, vy: 0,
      life: 0.6 + Math.random()*0.9,
      size: 2 + Math.random()*2.2
    }));

    // Mouse state
    let mx = width/2, my = height/2, active = false;
    const move = (e: PointerEvent) => { mx = e.clientX; my = e.clientY; active = true; };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerleave', () => { active = false; });

    let last = performance.now();
  // Random activation state map (letter targets flicker organically)
  const activation = new Map<Element, number>();
  const loop = (now: number) => {
      const dt = Math.min(60, now - last)/1000; last = now;
      ctx.clearRect(0,0,width,height);

      // Hero exclusion: no effect when cursor within hero video region or page top scrolled less than hero height
      const heroEl = heroRef.current;
      let inHero = false;
      if (heroEl) {
        const r = heroEl.getBoundingClientRect();
        inHero = mx >= r.left && mx <= r.right && my >= r.top && my <= r.bottom;
        // Previously suppressed until nearly entire hero scrolled past. We now allow animation
        // once the user has begun to scroll (revealing content below hero). Retain a tiny
        // threshold to avoid initial load flashes.
        const MIN_SCROLL_TO_ENABLE = 8; // px
        if (window.scrollY < MIN_SCROLL_TO_ENABLE) inHero = true;
      }

      if (inHero) { requestAnimationFrame(loop); return; }

  // Vertical scanlines subtle
      ctx.save();
      ctx.globalAlpha = 0.05;
      ctx.fillStyle = '#000';
      for (let x=0; x<width; x+=4) ctx.fillRect(x,0,1,height);
      ctx.restore();

      // Particle physics
  // Skip particle simulation & drawing if cursor not near any target (nearestDist gating computed later)
  particles.forEach(p => {
        p.life -= dt*0.15;
        if (p.life <= 0) {
          p.x = active ? mx + (Math.random()*120-60) : Math.random()*width;
          p.y = active ? my + (Math.random()*120-60) : Math.random()*height;
          p.vx = p.vy = 0;
          p.life = 0.6 + Math.random()*0.9;
          p.size = 2 + Math.random()*2.2;
        }
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
      const interactionRadius = 260; // only activate inside this
      const maxSimulLetters = 90; // safety cap
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
  // Pixel snap for sharper hairline rectangles
  const snap = (v:number)=>Math.round(v*dpr)/dpr; // pure snap; separate half-pixel if dpr==1
  ctx.lineWidth = hairline;
  const ox = (dpr === 1 ? 0.5 : 0); // half-pixel alignment only for non-retina
  ctx.strokeRect(snap(left-pad)+ox, snap(top-pad)+ox, Math.round((w+pad*2)*dpr)/dpr, Math.round((h+pad*2)*dpr)/dpr);
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
          ctx.lineWidth = hairline * 1.2;
          const oxp = dpr === 1 ? 0.5 : 0;
          ctx.strokeRect(Math.round(-p.size)+oxp, Math.round(-p.size*0.6)+oxp, Math.round(p.size*2), Math.round(p.size*1.2));
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

  // Helper function to toggle artist and clear loading state when closing
  const toggleArtist = (artistName: string) => {
    if (openArtist === artistName) {
      // Closing - clear the loading state for this artist
      setLoadedPlayers(prev => {
        const newSet = new Set(prev);
        newSet.delete(`spotify-${artistName}`);
        newSet.delete(`soundcloud-${artistName}`);
        return newSet;
      });
      setOpenArtist(null);
    } else {
      // Opening
      setOpenArtist(artistName);
    }
  };

  // About section slideshow images (optimized versions)
  const aboutImages = [
    '/about/optimized/260813_OVERTONE_VENUE_STILL_001.jpg',
    '/about/optimized/260813_OVERTONE_VENUE_STILL_002.jpg',
    '/about/optimized/260813_OVERTONE_VENUE_STILL_003.jpg',
    '/about/optimized/260813_OVERTONE_VENUE_STILL_004.jpg',
    '/about/optimized/260813_OVERTONE_VENUE_STILL_006.jpg',
    '/about/optimized/260813_OVERTONE_VENUE_STILL_007.jpg',
    '/about/optimized/260813_OVERTONE_VENUE_STILL_008.jpg',
    '/about/optimized/260813_OVERTONE_VENUE_STILL_009.jpg',
    '/about/optimized/260813_OVERTONE_VENUE_STILL_010.jpg'
  ];
  const aboutParaRef = useRef<HTMLParagraphElement | null>(null);
  const [aboutTextHeight, setAboutTextHeight] = useState(0);
  // Technical slideshow component using edge-point extraction + network animation
  const AboutTechSlideshow: React.FC<{ images: string[]; matchHeight: number }> = ({ images, matchHeight }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [ready, setReady] = useState(false);
  const [active, setActive] = useState<boolean>(() => typeof window !== 'undefined' ? window.innerWidth >= 768 : true); // default paused on mobile
  const [visible, setVisible] = useState(true); // Intersection visibility
  interface EdgeSet { points: { x: number; y: number }[]; w: number; h: number; canvas: HTMLCanvasElement }
  const edgeSetsRef = useRef<EdgeSet[]>([]);
    const idxRef = useRef(0);
    const phaseRef = useRef<'hold' | 'transition'>('hold');
    const phaseStartRef = useRef(performance.now());
    const pointer = useRef({ x: 0, y: 0, t: 0, active: false });
    const autopilotRef = useRef({ enabled: false, t: performance.now(), x: 0.3, y: 0.4 });
  const idleRef = useRef({ lastActive: performance.now() });
  const reducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

    // Config
  const HOLD_MS = reducedMotion ? 4000 : 2400;
  const TRANSITION_MS = reducedMotion ? 1200 : 1700;
  const SAMPLE_STRIDE = isMobile ? 20 : 14; // fewer points on mobile
  const EDGE_THRESH = 26; // luminance delta threshold
  const MAX_LINES = isMobile ? 22 : 40;
  const POINT_SIZE = isMobile ? 2.4 : 2.2;
  const BASE_IMAGE_ALPHA = 0.20;
  const FOCUS_IMAGE_ALPHA = 0.70;
  const REVEAL_RADIUS = isMobile ? 150 : 220;
  const IDLE_TIMEOUT = 6000; // ms until auto-pause on mobile
  const LOOP_TARGET_FPS = isMobile ? 40 : 60; // throttle mobile
  const FRAME_INTERVAL = 1000 / LOOP_TARGET_FPS;

    // Preload & extract edges
    useEffect(() => {
      let cancelled = false;
      const loadAll = async () => {
        const tmpCanvas = document.createElement('canvas');
        const tctx = tmpCanvas.getContext('2d', { willReadFrequently: true })!;
    const sets: EdgeSet[] = [];
        for (const src of images) {
          const img: HTMLImageElement = document.createElement('img');
            img.src = src;
            await new Promise(res => { img.onload = res; img.onerror = res; });
            if (cancelled) return;
            // Fit into container size if known
            const cw = containerRef.current?.clientWidth || img.naturalWidth;
            const ch = containerRef.current?.clientHeight || img.naturalHeight;
            tmpCanvas.width = cw; tmpCanvas.height = ch;
            tctx.drawImage(img, 0, 0, cw, ch);
            const data = tctx.getImageData(0, 0, cw, ch).data;
            const pts: { x: number; y: number }[] = [];
            for (let y = 0; y < ch - SAMPLE_STRIDE; y += SAMPLE_STRIDE) {
              for (let x = 0; x < cw - SAMPLE_STRIDE; x += SAMPLE_STRIDE) {
                const i = (y * cw + x) * 4;
                const r = data[i], g = data[i + 1], b = data[i + 2];
                const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                const j = (y * cw + (x + SAMPLE_STRIDE)) * 4;
                const r2 = data[j], g2 = data[j + 1], b2 = data[j + 2];
                const l2 = 0.2126 * r2 + 0.7152 * g2 + 0.0722 * b2;
                if (Math.abs(l - l2) > EDGE_THRESH) {
                  pts.push({ x: x + (Math.random() - 0.5) * 4, y: y + (Math.random() - 0.5) * 4 });
                }
              }
            }
      // Store a lightweight canvas bitmap of the image for later blending
      const off = document.createElement('canvas'); off.width = cw; off.height = ch;
      off.getContext('2d')!.drawImage(img, 0, 0, cw, ch);
      sets.push({ points: pts, w: cw, h: ch, canvas: off });
        }
        edgeSetsRef.current = sets;
        setReady(true);
      };
      loadAll();
      return () => { cancelled = true; };
    }, [images]);

    // Resize: re-extract edges on size change (debounced)
    useEffect(() => {
      const handle = () => {
        if (!edgeSetsRef.current.length) return;
        // Re-run extraction quickly (could be optimized by scaling points)
        edgeSetsRef.current = []; setReady(false);
        // trigger re-extract by resetting effect dependency via images state mimic
        // (simplest: force reload by slight timeout)
        setTimeout(() => {
          // Will re-run preload effect due to images stable? Not automatically. Instead manually call load logic here.
          const imgs = images.slice();
          const tmpCanvas = document.createElement('canvas');
          const tctx = tmpCanvas.getContext('2d', { willReadFrequently: true })!;
          const sets: EdgeSet[] = [];
          let done = 0;
          imgs.forEach(src => {
            const im: HTMLImageElement = document.createElement('img');
            im.src = src;
            im.onload = () => {
              const cw = containerRef.current?.clientWidth || im.naturalWidth;
              const ch = containerRef.current?.clientHeight || im.naturalHeight;
              tmpCanvas.width = cw; tmpCanvas.height = ch;
              tctx.drawImage(im, 0, 0, cw, ch);
              const data = tctx.getImageData(0, 0, cw, ch).data;
              const pts: { x: number; y: number }[] = [];
              for (let y = 0; y < ch - SAMPLE_STRIDE; y += SAMPLE_STRIDE) {
                for (let x = 0; x < cw - SAMPLE_STRIDE; x += SAMPLE_STRIDE) {
                  const i = (y * cw + x) * 4;
                  const l = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
                  const j = (y * cw + (x + SAMPLE_STRIDE)) * 4;
                  const l2 = 0.2126 * data[j] + 0.7152 * data[j + 1] + 0.0722 * data[j + 2];
                  if (Math.abs(l - l2) > EDGE_THRESH) pts.push({ x: x + (Math.random() - 0.5) * 4, y: y + (Math.random() - 0.5) * 4 });
                }
              }
              const off = document.createElement('canvas'); off.width = cw; off.height = ch;
              off.getContext('2d')!.drawImage(im, 0, 0, cw, ch);
              sets.push({ points: pts, w: cw, h: ch, canvas: off });
              done++;
              if (done === imgs.length) { edgeSetsRef.current = sets; setReady(true); }
            };
          });
        }, 60);
      };
      window.addEventListener('resize', handle);
      return () => window.removeEventListener('resize', handle);
    }, [images]);

    // Pointer tracking
    useEffect(() => {
      const move = (e: PointerEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        pointer.current.x = e.clientX - rect.left; pointer.current.y = e.clientY - rect.top; pointer.current.t = performance.now(); pointer.current.active = true;
        idleRef.current.lastActive = performance.now();
      };
      const leave = () => { pointer.current.active = false; };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerleave', leave);
      return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerleave', leave); };
    }, []);

    // Tap to activate on mobile & tap reposition focus
    useEffect(() => {
      const handler = (e: PointerEvent) => {
        if (!containerRef.current) return;
        if (!active && isMobile) setActive(true);
        const rect = containerRef.current.getBoundingClientRect();
        pointer.current.x = e.clientX - rect.left; pointer.current.y = e.clientY - rect.top; pointer.current.active = true; idleRef.current.lastActive = performance.now();
      };
      containerRef.current?.addEventListener('pointerdown', handler);
      return () => containerRef.current?.removeEventListener('pointerdown', handler);
    }, [active, isMobile]);

    // Intersection Observer to pause when off-screen
    useEffect(() => {
      if (!('IntersectionObserver' in window)) return; // graceful
      const el = containerRef.current; if (!el) return;
      const obs = new IntersectionObserver(entries => {
        for (const entry of entries) {
          setVisible(entry.isIntersecting);
        }
      }, { threshold: 0.05 });
      obs.observe(el);
      return () => obs.disconnect();
    }, []);

    useEffect(() => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      let dpr = Math.min(3, window.devicePixelRatio || 1);
      const resize = () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        canvas.width = w * dpr; canvas.height = h * dpr;
        canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      resize();
      window.addEventListener('resize', resize);
      let last = performance.now();
      const render = (now: number) => {
        const delta = now - last;
        if (delta < FRAME_INTERVAL) { requestAnimationFrame(render); return; }
        last = now;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!ready || edgeSetsRef.current.length < 2) { requestAnimationFrame(render); return; }
        // Auto pause when inactive on mobile
        if (isMobile && active && now - idleRef.current.lastActive > IDLE_TIMEOUT) {
          setActive(false);
        }
        if (!active || !visible) {
          // Draw static current image (first set) lightly
          const sets = edgeSetsRef.current;
          if (sets.length) {
            const current = sets[idxRef.current % sets.length];
            if (current?.canvas) {
              ctx.save(); ctx.globalAlpha = 0.55; ctx.drawImage(current.canvas, 0, 0, canvas.width / dpr, canvas.height / dpr); ctx.restore();
            }
          }
          requestAnimationFrame(render); return;
        }

        // Autopilot if idle
  if (!pointer.current.active && now - pointer.current.t > 5000 && !isMobile) {
          autopilotRef.current.enabled = true;
          const t = (now - autopilotRef.current.t) * 0.00015;
          const rect = container.getBoundingClientRect();
          pointer.current.x = (0.5 + Math.sin(t) * 0.4) * rect.width * 0.9;
          pointer.current.y = (0.5 + Math.cos(t * 1.2) * 0.35) * rect.height * 0.9;
        } else {
          autopilotRef.current.enabled = false;
        }

        const sets = edgeSetsRef.current;
        const idx = idxRef.current;
        const next = (idx + 1) % sets.length;
        const phase = phaseRef.current;
        const elapsed = now - phaseStartRef.current;
        let tNorm = phase === 'hold' ? 0 : Math.min(1, elapsed / TRANSITION_MS);
        if (phase === 'hold' && elapsed >= HOLD_MS) {
          phaseRef.current = 'transition'; phaseStartRef.current = now;
        } else if (phase === 'transition' && elapsed >= TRANSITION_MS) {
          phaseRef.current = 'hold'; phaseStartRef.current = now; idxRef.current = next; tNorm = 0;
        }

        // Easing
        const ease = (x: number) => 1 - Math.pow(1 - x, 3);
        const alphaIn = ease(tNorm);
        const alphaOut = 1 - alphaIn;

  const currentSet = sets[idx];
  const nextSet = sets[next];
        const w = container.clientWidth; const h = container.clientHeight;

        // Background subtle grid
        ctx.save(); ctx.globalAlpha = 0.06; ctx.fillStyle = '#000';
        for (let gx = 0; gx < w; gx += 12) ctx.fillRect(gx, 0, 1, h);
        for (let gy = 0; gy < h; gy += 12) ctx.fillRect(0, gy, w, 1);
        ctx.restore();

        // Draw base image layers (subtle)
        if (currentSet && currentSet.canvas) {
          ctx.save(); ctx.globalAlpha = BASE_IMAGE_ALPHA * alphaOut; ctx.drawImage(currentSet.canvas, 0, 0, w, h); ctx.restore();
        }
        if (nextSet && nextSet.canvas) {
          ctx.save(); ctx.globalAlpha = BASE_IMAGE_ALPHA * alphaIn; ctx.drawImage(nextSet.canvas, 0, 0, w, h); ctx.restore();
        }

        // Pointer focus reveal (clip region) for sharper image
        const px = pointer.current.x, py = pointer.current.y;
        ctx.save();
  ctx.beginPath(); ctx.arc(px, py, REVEAL_RADIUS, 0, Math.PI * 2); ctx.clip();
        if (currentSet && currentSet.canvas) { ctx.save(); ctx.globalAlpha = FOCUS_IMAGE_ALPHA * alphaOut; ctx.drawImage(currentSet.canvas, 0, 0, w, h); ctx.restore(); }
        if (nextSet && nextSet.canvas) { ctx.save(); ctx.globalAlpha = FOCUS_IMAGE_ALPHA * alphaIn; ctx.drawImage(nextSet.canvas, 0, 0, w, h); ctx.restore(); }
        ctx.restore();

        // Add slight scanline overlay for texture
        ctx.save(); ctx.globalAlpha = 0.06; ctx.fillStyle = '#000';
        for (let sy = 0; sy < h; sy += 3) ctx.fillRect(0, sy, w, 1);
        ctx.restore();

        // Draw points
        ctx.lineWidth = 1 / dpr;
        ctx.fillStyle = '#000';

        const drawPoints = (pts: { x: number; y: number }[], alpha: number, jitterScale: number) => {
          if (alpha <= 0) return;
            ctx.save(); ctx.globalAlpha = alpha * 0.9;
            for (let i = 0; i < pts.length; i++) {
              const p = pts[i];
              const jx = Math.sin((now * 0.0012) + p.x * 0.15) * jitterScale;
              const jy = Math.cos((now * 0.0011) + p.y * 0.15) * jitterScale;
              ctx.fillRect(p.x + jx, p.y + jy, POINT_SIZE, POINT_SIZE * 0.55);
            }
            ctx.restore();
        };

        drawPoints(currentSet.points, alphaOut, 0.6 * (1 - tNorm));
        drawPoints(nextSet.points, alphaIn, 0.6 * tNorm);

        // Connection lines emanating near pointer
        const allPts = tNorm < 0.5 ? currentSet.points : nextSet.points;
        if (allPts.length) {
          // Find nearest subset
          const px = pointer.current.x, py = pointer.current.y;
          const subset: { d: number; x: number; y: number }[] = [];
          for (let k = 0; k < allPts.length; k++) {
            const p = allPts[k];
            const dx = p.x - px, dy = p.y - py; const d = dx * dx + dy * dy;
            if (d < 240 * 240) subset.push({ d, x: p.x, y: p.y });
          }
          subset.sort((a, b) => a.d - b.d);
          const use = subset.slice(0, 55);
          ctx.save();
          for (let i = 0; i < Math.min(MAX_LINES, use.length - 1); i++) {
            const a = use[i];
            const b = use[(i + 7) % use.length];
            const midx = (a.x + b.x) / 2 + Math.sin(now * 0.001 + i) * 6;
            const midy = (a.y + b.y) / 2 + Math.cos(now * 0.0011 + i) * 6;
            const grd = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
            grd.addColorStop(0, 'rgba(0,0,0,0)');
            grd.addColorStop(0.45, 'rgba(0,0,0,0.55)');
            grd.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.strokeStyle = grd;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.quadraticCurveTo(midx, midy, b.x, b.y);
            ctx.stroke();
          }
          ctx.restore();
        }

        requestAnimationFrame(render);
      };
      const id = requestAnimationFrame(render);
      return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize); };
    }, [ready]);

    return (
      <div ref={containerRef} className="relative w-full h-[60vh] md:h-auto md:min-h-full bg-[var(--acid)] border border-black/30 overflow-hidden select-none" style={{ height: typeof window !== 'undefined' && window.innerWidth >= 768 ? (matchHeight || undefined) : undefined }}>
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center text-xs tracking-widest font-medium" style={{ fontFamily: 'var(--font-header)' }}>
            <span className="animate-pulse">PROCESSING IMAGERY...</span>
          </div>
        )}
        {!active && ready && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/65 text-[var(--acid)] text-[0.65rem] tracking-widest px-4 py-2 rounded-full font-medium no-stroke" style={{ fontFamily: 'var(--font-header)' }}>
              TAP TO ACTIVATE INTERACTIVE VIEW
            </div>
          </div>
        )}
        {active && isMobile && (
          <button type="button" onClick={() => setActive(false)} className="absolute top-2 right-2 bg-black/70 text-[var(--acid)] text-[0.55rem] tracking-wider px-2 py-1 rounded no-stroke" style={{ fontFamily: 'var(--font-header)' }}>
            PAUSE
          </button>
        )}
        <div className="pointer-events-none absolute bottom-2 left-2 text-[10px] font-medium opacity-60 no-stroke" style={{ fontFamily: 'var(--font-header)' }}>EDGE NETWORK MODE</div>
      </div>
    );
  };

  // Helper to output per-letter traceable spans
  const TraceLetters = ({ text, className }: { text: string; className?: string }) => (
    <span className={className}>
      {Array.from(text).map((ch, i) => (
        <span key={i} data-trace-letter className="inline-block">{ch === ' ' ? '\u00A0' : ch}</span>
      ))}
    </span>
  );

  useEffect(() => {
    const measure = () => {
      if (aboutParaRef.current) {
        setAboutTextHeight(aboutParaRef.current.getBoundingClientRect().height);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Full FAQ data grouped by category
  const faqCategories: { category: string; items: { q: string; a: ReactNode }[] }[] = [
    {
      category: 'General & Tickets',
      items: [
        {
          q: 'When and where is Overtone Festival 2025?',
          a: 'Overtone is a one‑day festival held on Sunday 12 October 2025 in Musgrave Park, Southport (Gold Coast). Gates open at 2pm and the music ends around 10pm. Please arrive early to allow time for entry.'
        },
        {
          q: 'How do I get tickets?',
          a: (<>
            Sign up for Early Access tickets <a href="https://overtone.fillout.com/earlyaccess" target="_blank" rel="noopener noreferrer" className="underline">here</a>. Early Access guarantees you a 1st Release priced ticket when tickets go live on Tuesday 19 August at 12PM. You&apos;ll get a link shortly before that if you signed up. Email or DM us if you don&apos;t receive the link.
          </>)
        },
        {
          q: 'How much are tickets?',
          a: '1st Release - $109.90 + $10 fee (EXCLUSIVE & GUARANTEED TO SIGN UPS)\n2nd Release - $129.90 + $10 fee\n3rd Release - $149.90 + $10 fee\n4th Release - $169.90 + $10 fee'
        },
        {
          q: 'What is Early Access?',
          a: (<>
            Early Access guarantees you a 1st Release ticket. You will be able to buy one when they go on sale on Tuesday 19th August 12PM, until Wednesday 20 August at 12PM when General on sale begins. To sign up, click <a href="https://overtone.fillout.com/earlyaccess" target="_blank" rel="noopener noreferrer" className="underline">here</a>.
          </>)
        },
        {
          q: 'When are tickets on sale?',
          a: (<>
            Early Access live Tuesday 19 August 12pm<br />
            General Access live Wednesday 20 August 12pm
            <br />
            <br />
            Sign up <a href="https://overtone.fillout.com/earlyaccess" target="_blank" rel="noopener noreferrer">here</a> to be sent an exclusive link for 1st Release tickets. You&apos;ll be sent a link on Tuesday 19 August before tickets are live at 12PM.
          </>)
        },
        { q: 'What is the age requirement?', a: 'The festival is strictly 18+. You must present a valid, government‑issued photo ID on entry—digital copies or photos of ID are not accepted.' },
        { q: 'Are pass‑outs allowed (can I leave and return)?', a: 'No. Once you’ve entered, you cannot leave and re‑enter. Please plan accordingly.' },
        { q: 'Is the event cashless?', a: 'Yes. Overtone is 100 % cashless—bring a credit/debit card or phone wallet. ATMs will not be available on site.' },
        { q: 'Can I resell my ticket?', a: 'Tickets may only be resold via the official resale facility (details released closer to the event). Tickets purchased through unofficial sites may be voided.' }
      ]
    },
    {
      category: 'Getting There',
      items: [
        { q: 'How do I get to Musgrave Park?', a: '• Public transport: We strongly recommend using public transport. The G:link tram (Southport South station) and multiple bus routes stop within a short walk.\n• Ride‑share/drop‑off: Ride‑share and taxi zones will be signposted nearby.\n• Driving: Limited parking is available in surrounding streets and paid car parks; please check local parking restrictions. Accessible parking bays will be available for patrons with a permit.' },
        { q: 'Is there parking at the venue?', a: 'Musgrave Park does not have dedicated event parking. Nearby public car parks and street parking are available on a first‑come, first‑served basis. We recommend car‑pooling or catching public transport.' },
        { q: 'What should I do if I need accessible access?', a: 'The site is wheelchair‑friendly with accessible toilets. Please contact us ahead of time to arrange accessible parking or to discuss specific requirements.' }
      ]
    },
    {
      category: 'What to Bring & Banned Items',
      items: [
        { q: 'What can I bring into the festival?', a: '• A small bag (no larger than A4)\n• An empty plastic or metal water bottle to refill at free water stations\n• Sunscreen (110 mL or less)\n• A hat, poncho and earplugs\n• Medically‑necessary items (see below)' },
        { q: 'What items are banned?', a: 'Please do not bring the following items; security will confiscate them and you may be refused entry:\n• Bags larger than A4 size, eskies or coolers\n• Alcohol, food or drink (except empty water bottles and medically required food)\n• Glass of any kind, cans, aerosols, metal water bottles or any liquid containers over 110 mL\n• Drugs or illegal substances\n• Weapons, fireworks, flares, sparklers or explosives\n• Umbrellas (use ponchos or raincoats instead)\n• Professional cameras, GoPros, recording devices, drones, or broadcasting equipment\n• Animals (except registered service animals)\n• Vapes or e‑cigs with more than 110 mL of liquid\n• Totem poles, flags or large banners' },
        { q: 'Can I bring medication or food for a medical condition?', a: 'Yes, but medication must be in its original packaging with the dispensary label matching your ID. Only bring what you need and declare it at the accessible lane or medical entry point. For medical dietary requirements, please email us in advance with supporting documentation.' }
      ]
    },
    {
      category: 'On‑Site Experience',
      items: [
        { q: 'What facilities are available?', a: 'Musgrave Park will have plenty of shade, sunscreen stations, bathrooms and free water refill points. You’ll also find licensed bars, curated food vendors, market stalls, phone‑charging stations and a cloak room for bags.' },
        { q: 'Will there be food and drinks?', a: 'Yes. We’ll host a range of food trucks and market stalls featuring local favourites and global flavours, along with fully‑licensed bars. Please bring ID if you plan to purchase alcohol.' },
        { q: 'Can I smoke or vape?', a: 'Smoking and vaping are only permitted in designated areas. Vapes or e‑cig liquids over 110 mL are not allowed.' },
        { q: 'Will there be first aid services?', a: 'Yes, professional first aid services will be on site with basic over‑the‑counter medication and a quiet space. Harm‑reduction services will also be available.' },
        { q: 'What if it rains?', a: 'Overtone is a rain‑or‑shine event. Musgrave Park is mostly grass, so wear suitable footwear. Umbrellas are not allowed—bring a raincoat or poncho.' },
        { q: 'Where do I go for lost property?', a: 'Lost property will be held at the Info Tent during the event. After the festival, any uncollected items may be handed over to local police; check our social media for updates.' }
      ]
    },
    {
      category: 'Accessibility & Safety',
      items: [
        { q: 'Is the festival wheelchair‑accessible?', a: 'Yes. Musgrave Park’s pathways are accessible and we provide accessible toilets. Please email us to arrange accessible parking or discuss additional needs.' },
        { q: 'Are service animals allowed?', a: 'Registered service animals are welcome. Emotional‑support animals and pets are not allowed.' },
        { q: 'What if I feel unsafe or unwell?', a: 'If you or someone else feels unsafe or unwell, please go to the nearest security guard, volunteer or first aid station. Our team is trained to assist with medical, safety and welfare issues. Harm‑reduction services will be on site.' }
      ]
    }
  ];

  // In case the video is cached and play events fire before React attaches listeners
  useEffect(() => {
    const v = videoRef.current;
    if (v && v.readyState >= 3) setHeroVideoActive(true);
  }, []);

  // Replace IntersectionObserver with precise scroll position check: switch when hero fully scrolled past
  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    const measure = () => {
      setHeroHeight(heroEl.getBoundingClientRect().height);
    };

    const handleScroll = () => {
      setPastHero(window.scrollY >= heroHeight - 1);
    };

    measure();
    handleScroll();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [heroHeight]);

  return (
    <>
  {/* Mouse tracing overlay */}
  <canvas ref={traceCanvasRef} className="fixed inset-0 pointer-events-none z-30 mix-blend-multiply" aria-hidden="true" />
      {/* Nav bar */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="relative px-4 py-[0.55rem]">{/* increased from py-1.5 (~6px) to ~8.8px for ~15% taller nav */}
          {/* Glassy background layer */}
          <div className="absolute inset-0 bg-white/5 dark:bg-white/5 backdrop-blur-xl backdrop-saturate-150 border-b border-white/15 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.5)] supports-[backdrop-filter]:bg-white/5 pointer-events-none" />
          <nav className="relative flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <div className="h-6 flex items-center relative">
                  {/* Mobile: Use compact logo with color transitions */}
                  <div className="sm:hidden relative">
                    {/* Acid logo (pre-hero) */}
                    <Image
                      src="/logo.svg"
                      alt="Overtone Festival"
                      width={72}
                      height={24}
                      className={`h-6 w-auto relative -top-0.5 transition-opacity duration-300 ${pastHero ? 'opacity-0' : 'opacity-100'}`}
                      priority
                    />
                    {/* Black logo (post-hero) */}
                    <Image
                      src="/logo.svg"
                      alt="Overtone Festival"
                      width={72}
                      height={24}
                      className={`h-6 w-auto absolute inset-0 -top-0.5 transition-opacity duration-300 ${pastHero ? 'opacity-100' : 'opacity-0'} filter brightness-0 saturate-100`}
                      aria-hidden={!pastHero}
                      priority
                    />
                  </div>
                  {/* Desktop: Use wordmark with color transitions */}
                  <div className="hidden sm:block relative">
                    {/* Acid wordmark (pre-hero) */}
                    <Image
                      src="/logo-wordmark.svg"
                      alt="Overtone Festival"
                      width={160}
                      height={24}
                      className={`h-6 w-auto relative -top-0.5 transition-opacity duration-300 ${pastHero ? 'opacity-0' : 'opacity-100'}`}
                      priority
                    />
                    {/* Black wordmark (post-hero) using filter to force black */}
                    <Image
                      src="/logo-wordmark.svg"
                      alt="Overtone Festival (Black)"
                      width={160}
                      height={24}
                      className={`h-6 w-auto absolute inset-0 -top-0.5 transition-opacity duration-300 ${pastHero ? 'opacity-100' : 'opacity-0'} filter brightness-0 saturate-100`}
                      aria-hidden={!pastHero}
                    />
                  </div>
                </div>
              </Link>
              <a data-trace href="#about" style={{ fontFamily: 'var(--font-header)' }} className={`${pastHero ? 'text-black' : '!text-[var(--acid)]'} no-stroke inline-flex items-center leading-none text-[0.92rem] sm:text-[1.15rem] font-medium hover:underline hidden sm:inline-flex transition-colors`}><TraceLetters text="About" /></a>
              <a data-trace href="#lineup" style={{ fontFamily: 'var(--font-header)' }} className={`${pastHero ? 'text-black' : '!text-[var(--acid)]'} no-stroke inline-flex items-center leading-none text-[0.92rem] sm:text-[1.15rem] font-medium hover:underline hidden sm:inline-flex transition-colors`}><TraceLetters text="Lineup" /></a>
              <a data-trace href="#faqs" style={{ fontFamily: 'var(--font-header)' }} className={`${pastHero ? 'text-black' : '!text-[var(--acid)]'} no-stroke inline-flex items-center leading-none text-[0.92rem] sm:text-[1.15rem] font-medium hover:underline hidden sm:inline-flex transition-colors`}><TraceLetters text="FAQs" /></a>
              <a data-trace href="#contact" style={{ fontFamily: 'var(--font-header)' }} className={`${pastHero ? 'text-black' : '!text-[var(--acid)]'} no-stroke inline-flex items-center leading-none text-[0.92rem] sm:text-[1.15rem] font-medium hover:underline hidden sm:inline-flex transition-colors`}><TraceLetters text="Contact" /></a>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://moshtix.com.au/v2/event/overtone-festival-2025/184344?skin=OTF25"
                target="_blank"
                rel="noopener noreferrer"
                className={`tickets-btn px-3 sm:px-5 py-2 text-[0.92rem] sm:text-[1.15rem] font-semibold rounded-lg hover:opacity-90 transition-colors no-stroke inline-flex items-center leading-none ${pastHero ? 'bg-black !text-[var(--acid)]' : 'bg-[var(--acid)] !text-[var(--bg)]'}`}
              >
                Tickets
              </a>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen min-h-dvh flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted={muted}
          playsInline
          poster="/brand/hero-poster.jpg"
          onLoadedData={() => setHeroVideoActive(true)}
          onPlay={() => setHeroVideoActive(true)}
        >
          <source src="/brand/hero-mobile.mp4" media="(max-width: 640px)" />
          <source src="/brand/hero.mp4" media="(min-width: 641px)" />
        </video>
        <div className={`relative z-10 text-center transition-opacity duration-500 ease-out ${heroVideoActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} aria-hidden={heroVideoActive}>
          <Image
            src="/logo.svg"
            alt="Overtone Festival Logo"
            width={300}
            height={100}
            priority
          />
        </div>
        {/* Audio toggle button */}
        <button
          onClick={() => {
            const v = videoRef.current; if (!v) return; v.muted = !v.muted; setMuted(v.muted);
          }}
          className="absolute bottom-16 sm:bottom-4 right-4 z-20 bg-black/60 text-[var(--acid)] border border-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium hover:bg-black/70 transition"
          aria-label={muted ? 'Unmute hero video' : 'Mute hero video'}
        >
          {muted ? 'Audio Off' : 'Audio On'}
        </button>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4">
        <div className="w-full">
          <h2 className="text-6xl font-bold text-black mb-10"><TraceLetters text="About" /></h2>
          <div className="grid md:grid-cols-2 gap-10 md:gap-8 lg:gap-12 xl:gap-16">
            <div ref={aboutParaRef} className="max-w-3xl md:max-w-none md:pr-2 lg:pr-4 xl:pr-6 space-y-8">
            {[
              'Overtone Festival is a new open-air music festival coming to Musgrave Park on the Gold Coast.',
              'Set across two outdoor stages, it brings together some of the best international and Australian electronic artists for a full day of music, dancing, and good vibes.',
              'Expect high-quality sound, creative stage design, and a vibrant atmosphere surrounded by the park\u2019s greenery.'
            ].map((para, i) => (
              <p key={i} className="text-[2.25rem] sm:text-[2.75rem] md:text-[3.0rem] leading-[1.08] text-black font-light tracking-tight">
                {Array.from(para).map((ch, idx) => (
                  <span key={idx} data-trace-letter className={ch === ' ' ? 'inline-block w-[0.4ch]' : ''}>{ch}</span>
                ))}
              </p>
            ))}
          </div>
          <AboutTechSlideshow images={aboutImages} matchHeight={aboutTextHeight} />
          </div>
        </div>
      </section>

      {/* Lineup Section */}
      <section id="lineup" className="py-16 px-4">
        <div className="w-full">
          <h2 className="text-6xl font-bold text-black mb-10"><TraceLetters text="Lineup" /></h2>
          <ul className="flex flex-col gap-3" style={{ fontFamily: 'var(--font-header)' }}>
            {lineupAll.map(item => (
              <li
                key={item.name}
                className={`group text-3xl md:text-6xl tracking-tight text-black ${item.name === '1TBSP' ? 'mt-10' : ''}`}
              >
                {/* Show clickable version if artist has audio preview */}
                {(item.spotify || item.soundcloud) ? (
                  <div
                    role="button"
                    tabIndex={0}
                    aria-expanded={openArtist === item.name}
                    onClick={() => toggleArtist(item.name)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleArtist(item.name); } }}
                    className="flex items-baseline justify-between gap-6 cursor-pointer select-none"
                  >
                    <span className="flex-1">
                      {Array.from(item.name).map((ch, i) => (
                        <span
                          key={i}
                          data-trace-letter
                          className="inline-block transition-all duration-200 ease-out group-hover:[transition-duration:260ms] group-hover:font-[600] group-hover:scale-[1.04]"
                        >
                          {ch === ' ' ? '\u00A0' : ch}
                        </span>
                      ))}
                    </span>
                    <span className="text-3xl md:text-6xl tracking-tight min-w-[4rem] text-right font-light no-stroke" style={{ fontFamily: 'var(--font-header)', fontWeight: 300 }}>
                      {Array.from(item.code).map((ch, i) => (
                        <span key={i} data-trace-letter className="inline-block">
                          {ch === ' ' ? '\u00A0' : ch}
                        </span>
                      ))}
                    </span>
                  </div>
                ) : (
                  /* Show non-clickable version if no audio preview */
                  <div className="flex items-baseline justify-between gap-6">
                    <span className="flex-1">
                      {Array.from(item.name).map((ch, i) => (
                        <span
                          key={i}
                          data-trace-letter
                          className="inline-block"
                        >
                          {ch === ' ' ? '\u00A0' : ch}
                        </span>
                      ))}
                    </span>
                    <span className="text-3xl md:text-6xl tracking-tight min-w-[4rem] text-right font-light no-stroke" style={{ fontFamily: 'var(--font-header)', fontWeight: 300 }}>
                      {Array.from(item.code).map((ch, i) => (
                        <span key={i} data-trace-letter className="inline-block">
                          {ch === ' ' ? '\u00A0' : ch}
                        </span>
                      ))}
                    </span>
                  </div>
                )}
                {openArtist === item.name && (
                  <div className="mt-4 max-w-5xl animate-fade-in leading-none">
                    {item.spotify && (
                      <div className="overflow-hidden rounded-xl shadow-md border border-black/10 bg-black/5">
                        <div className="relative w-full h-[152px]">
                          <iframe
                            data-testid="embed-iframe"
                            src={`${item.spotify}?utm_source=generator&theme=0`}
                            width="100%"
                            height="152"
                            frameBorder="0"
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                            className="absolute inset-0 w-full h-full opacity-0 transition-opacity duration-500"
                            style={{ backgroundColor: 'transparent' }}
                            onLoad={(e) => {
                              (e.target as HTMLIFrameElement).style.opacity = '1';
                              setLoadedPlayers(prev => new Set(prev).add(`spotify-${item.name}`));
                            }}
                          />
                          {/* Loading placeholder */}
                          {!loadedPlayers.has(`spotify-${item.name}`) && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/5 text-black/60 text-sm font-medium pointer-events-none" style={{ wordSpacing: 'normal' }}>
                              Loading player...
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {!item.spotify && item.soundcloud && (
                      <div className="overflow-hidden rounded-xl shadow-md border border-black/10 bg-black/5">
                        <div className="relative w-full h-[166px]">
                          <iframe
                            width="100%"
                            height="166"
                            scrolling="no"
                            frameBorder="no"
                            allow="autoplay"
                            src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(item.soundcloud)}&color=%23000000&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
                            className="absolute inset-0 w-full h-full opacity-0 transition-opacity duration-500"
                            onLoad={(e) => {
                              (e.target as HTMLIFrameElement).style.opacity = '1';
                              setLoadedPlayers(prev => new Set(prev).add(`soundcloud-${item.name}`));
                            }}
                          />
                          {/* Loading placeholder */}
                          {!loadedPlayers.has(`soundcloud-${item.name}`) && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/5 text-black/60 text-sm font-medium pointer-events-none" style={{ wordSpacing: 'normal' }}>
                              Loading player...
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {!item.spotify && !item.soundcloud && (
                      <div className="text-sm md:text-base italic text-black/70">No preview available.</div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faqs" className="py-16 px-4">
        <div className="w-full">
            <h2 className="text-6xl font-bold text-black mb-6"><TraceLetters text="FAQs" /></h2>
          {faqCategories.map(cat => (
            <div key={cat.category} className="mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-black mb-4" style={{ fontFamily: 'var(--font-header)' }}>{cat.category}</h3>
              <div className="space-y-4">
                {cat.items.map(item => (
                  <Faq key={item.q} question={item.q} answer={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4">
        <div className="w-full text-center">
          <h2 data-trace className="text-6xl font-bold mb-8"><TraceLetters text="Contact" /></h2>
          <p className="text-lg text-black mb-4">
            {Array.from('Have a question? Get in touch with our team.').map((ch, idx) => (
              <span key={idx} data-trace-letter className={ch === ' ' ? 'inline-block w-[0.35ch]' : ''}>{ch}</span>
            ))}
          </p>
          <a
            href="mailto:hello@overtonefestival.com.au"
            className="inline-block px-6 py-3 bg-[var(--acid)] text-[#00141f] rounded-full font-medium hover:opacity-90"
          >
            Email Us
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-black/20">
        <div className="w-full text-center space-y-4">
          <p className="text-xs text-black">
            {Array.from('We acknowledge the Traditional Custodians of the land on which we gather, and pay our respects to Elders past and present.').map((ch, idx) => (
              <span key={idx} data-trace-letter className={ch === ' ' ? 'inline-block w-[0.33ch]' : ''}>{ch}</span>
            ))}
          </p>
          <div className="flex justify-center space-x-6">
            <a href="https://www.instagram.com/overtone.festival/" target="_blank" rel="noopener noreferrer" className="text-black hover:underline">Instagram</a>
            <a href="https://www.facebook.com/profile.php?id=61579053744346" target="_blank" rel="noopener noreferrer" className="text-black hover:underline">Facebook</a>
            <a href="https://www.tiktok.com/@overtone.festival" target="_blank" rel="noopener noreferrer" className="text-black hover:underline">TikTok</a>
          </div>
          <p className="text-xs text-black">
            {Array.from('© 2025 Overtone Festival. All rights reserved.').map((ch, idx) => (
              <span key={idx} data-trace-letter className={ch === ' ' ? 'inline-block w-[0.33ch]' : ''}>{ch}</span>
            ))}
          </p>
        </div>
      </footer>
    </>
  );
}

type FaqProps = {
  question: string;
  answer: ReactNode;
};

function Faq({ question, answer }: FaqProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-black rounded-lg">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-4 flex justify-between items-center text-black text-[1.2rem]"
      >
        <span>{question}</span>
        <span className="text-black">{open ? "-" : "+"}</span>
      </button>
      {open && <p className="p-4 pt-0 text-black whitespace-pre-line [&_a]:underline [&_a]:decoration-2 [&_a]:underline-offset-2">{answer}</p>}
    </div>
  );
}