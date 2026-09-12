import { useEffect, useRef, useState } from "react";

/* ══════════════════════════════════════════════
   STATIC / NOISE CANVAS
══════════════════════════════════════════════ */
function StaticCanvas({ opacity = 0.04 }: { opacity?: number }) {
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = ref.current; if (!canvas) return;
        const ctx = canvas.getContext("2d")!;
        let raf: number;
        const draw = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            const img = ctx.createImageData(canvas.width, canvas.height);
            for (let i = 0; i < img.data.length; i += 4) {
                const v = Math.random() > 0.5 ? 255 : 0;
                img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
                img.data[i + 3] = Math.random() * 40;
            }
            ctx.putImageData(img, 0, 0);
            raf = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(raf);
    }, []);
    return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity, mixBlendMode: "screen" }} />;
}

/* ══════════════════════════════════════════════
   BACKGROUND TÁTICO — grid de pontos + HUD edges
══════════════════════════════════════════════ */
function TacticalBackground({ phase }: { phase: string }) {
    const ref = useRef<HTMLCanvasElement>(null);
    const alphaRef = useRef(0);
    const rafRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        const canvas = ref.current; if (!canvas) return;
        const ctx = canvas.getContext("2d")!;

        const draw = () => {
            const W = canvas.offsetWidth;
            const H = canvas.offsetHeight;
            if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
            ctx.clearRect(0, 0, W, H);

            const target = phase === "idle" ? 0 : phase === "materialize" ? 0.6 : 0.3;
            alphaRef.current += (target - alphaRef.current) * 0.025;
            const a = alphaRef.current;
            if (a < 0.005) { rafRef.current = requestAnimationFrame(draw); return; }

            // Grid de pontos
            const spacing = 36;
            ctx.fillStyle = `rgba(34,197,94,${a * 0.18})`;
            for (let x = spacing / 2; x < W; x += spacing) {
                for (let y = spacing / 2; y < H; y += spacing) {
                    ctx.beginPath();
                    ctx.arc(x, y, 0.8, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // Linha de horizonte tático (1/3 superior)
            ctx.strokeStyle = `rgba(6,182,212,${a * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.setLineDash([6, 12]);
            ctx.beginPath();
            ctx.moveTo(0, H * 0.28);
            ctx.lineTo(W, H * 0.28);
            ctx.stroke();
            ctx.setLineDash([]);

            // Bordas HUD — cantos
            const cSize = 28;
            ctx.strokeStyle = `rgba(34,197,94,${a * 0.35})`;
            ctx.lineWidth = 1;
            const corners = [[0,0],[W,0],[0,H],[W,H]] as const;
            corners.forEach(([cx, cy]) => {
                const dx = cx === 0 ? 1 : -1;
                const dy = cy === 0 ? 1 : -1;
                ctx.beginPath();
                ctx.moveTo(cx + dx * cSize, cy);
                ctx.lineTo(cx, cy);
                ctx.lineTo(cx, cy + dy * cSize);
                ctx.stroke();
            });

            // Coordenadas nas bordas
            ctx.font = "7px monospace";
            ctx.fillStyle = `rgba(6,182,212,${a * 0.4})`;
            ctx.textAlign = "left";
            ctx.fillText("LAT -8.0476° · LON -34.8770°", 36, 18);
            ctx.textAlign = "right";
            ctx.fillText("ALT 0m MSL · UTC -03:00", W - 36, 18);
            ctx.textAlign = "left";
            ctx.fillStyle = `rgba(34,197,94,${a * 0.25})`;
            ctx.fillText("SYS-01 · RADAR ATIVO", 36, H - 12);
            ctx.textAlign = "right";
            ctx.fillStyle = `rgba(6,182,212,${a * 0.25})`;
            ctx.fillText("PERNAMBUCO · BR", W - 36, H - 12);

            rafRef.current = requestAnimationFrame(draw);
        };

        rafRef.current = requestAnimationFrame(draw);
        return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    }, [phase]);

    return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 2 }} />;
}

/* ══════════════════════════════════════════════
   RADAR CANVAS — CINEMATOGRÁFICO CORRIGIDO
   FIX: loop roda uma vez, fases via ref (sem reset)
══════════════════════════════════════════════ */
interface Echo { x: number; y: number; born: number; intensity: number; isTarget?: boolean; }
interface Particle { angle: number; speed: number; radius: number; baseRadius: number; alpha: number; }

function RadarCanvas({
    phaseRef: externalPhaseRef,
    onDetected,
    onZoomComplete,
}: {
    phaseRef: React.MutableRefObject<string>;
    onDetected: () => void;
    onZoomComplete: () => void;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const onDetectedRef = useRef(onDetected);
    onDetectedRef.current = onDetected;
    const onZoomCompleteRef = useRef(onZoomComplete);
    onZoomCompleteRef.current = onZoomComplete;

    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext("2d")!;

        // ── Estado interno completo ──
        const s = {
            angle: -Math.PI / 2,
            totalRotated: 0,
            detectedCalled: false,
            echoes: [] as Echo[],
            lockProgress: 0,
            pingWaves: [] as { born: number; layer: number }[],
            zoomProgress: 0,
            frameCount: 0,
            targetAngle: -Math.PI * 0.3,
            targetDist: 0.48,
            hudLineIndex: 0,
            hudCharIndex: 0,
            hudText: [] as string[],
            hudTimer: 0,
            angle2: Math.PI / 2,
            signalStrength: 0,
            interferencePoints: [] as { x: number; y: number; life: number }[],
            particles: [] as Particle[],
            // velocity for organic sweep
            sweepVelocity: 0.032,
            // handoff
            handoffProgress: 0,
            handoffParticles: [] as { x: number; y: number; tx: number; ty: number; progress: number; speed: number }[],
        };

        // Ecos de fundo iniciais
        for (let i = 0; i < 10; i++) {
            const a = Math.random() * Math.PI * 2;
            const d = 0.15 + Math.random() * 0.78;
            s.echoes.push({ x: Math.cos(a) * d, y: Math.sin(a) * d, born: -Math.random() * 300, intensity: 0.04 + Math.random() * 0.1 });
        }
        for (let i = 0; i < 15; i++) {
            s.interferencePoints.push({ x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2, life: Math.random() * 80 });
        }

        const ROTATIONS_BEFORE_DETECT = 0.45;
        const TARGET_TOTAL = Math.PI * 2 * ROTATIONS_BEFORE_DETECT;
        const BASE_SPEED = 0.032;
        const TRAIL_ANGLE = Math.PI * 0.78;

        const HUD_LINES = [
            "> FREQ 2.4GHz · AES-256",
            "> ALCANCE 384.400km",
            "> ANOMALIA DETECTADA",
            "> @frontista ██ LOCK-ON",
        ];

        // Noise leve para velocidade orgânica
        const organicNoise = (t: number) =>
            Math.sin(t * 0.00071) * 0.008 + Math.cos(t * 0.00134) * 0.005;

        let raf: number;

        const draw = (ts: number) => {
            s.frameCount++;
            const ph = externalPhaseRef.current;
            if (ph === "materialize" && s.handoffProgress >= 1) return;

            const W = canvas.offsetWidth;
            const H = canvas.offsetHeight;
            if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
            ctx.clearRect(0, 0, W, H);

            const cx = W / 2, cy = H / 2;
            const R = Math.min(cx, cy) * 0.82;

            /* ── 1. FUNDO RADIAL ── */
            const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.15);
            bgGrad.addColorStop(0, "rgba(0,22,10,0.72)");
            bgGrad.addColorStop(0.6, "rgba(0,12,5,0.5)");
            bgGrad.addColorStop(0.85, "rgba(0,6,3,0.3)");
            bgGrad.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, W, H);

            ctx.save();
            ctx.translate(cx, cy);

            /* ── 2. CLIP ── */
            ctx.save();
            ctx.beginPath();
            ctx.arc(0, 0, R, 0, Math.PI * 2);
            ctx.clip();

            // Grade hexagonal
            ctx.save();
            ctx.globalAlpha = 0.032;
            ctx.strokeStyle = "#22c55e";
            ctx.lineWidth = 0.4;
            const hexSize = R * 0.12;
            for (let row = -10; row < 10; row++) {
                for (let col = -10; col < 10; col++) {
                    const hx = col * hexSize * 1.73 + (row % 2) * hexSize * 0.865;
                    const hy = row * hexSize * 1.5;
                    ctx.beginPath();
                    for (let v = 0; v < 6; v++) {
                        const va = (v / 6) * Math.PI * 2 - Math.PI / 6;
                        if (v === 0) ctx.moveTo(hx + Math.cos(va) * hexSize, hy + Math.sin(va) * hexSize);
                        else ctx.lineTo(hx + Math.cos(va) * hexSize, hy + Math.sin(va) * hexSize);
                    }
                    ctx.closePath();
                    ctx.stroke();
                }
            }
            ctx.restore();

            // Linhas de latitude
            ctx.save();
            ctx.globalAlpha = 0.022;
            ctx.strokeStyle = "#06b6d4";
            ctx.lineWidth = 0.5;
            for (let ly = -R; ly < R; ly += R * 0.08) {
                const hw = Math.sqrt(Math.max(0, R * R - ly * ly));
                ctx.beginPath();
                ctx.moveTo(-hw, ly);
                ctx.lineTo(hw, ly);
                ctx.stroke();
            }
            ctx.restore();

            ctx.restore(); // fim clip

            /* ── 3. ANÉIS ── */
            const dashOffset = (ts * 0.016) % 20;
            [0.22, 0.44, 0.66, 0.88, 1].forEach((f, idx) => {
                ctx.beginPath();
                ctx.arc(0, 0, R * f, 0, Math.PI * 2);
                if (idx === 4) {
                    ctx.strokeStyle = "rgba(34,197,94,0.35)";
                    ctx.lineWidth = 1.2;
                    ctx.setLineDash([]);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(0, 0, R * f + 4, 0, Math.PI * 2);
                    ctx.strokeStyle = "rgba(6,182,212,0.12)";
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                } else {
                    ctx.strokeStyle = `rgba(34,197,94,${0.05 + idx * 0.03})`;
                    ctx.lineWidth = 0.6;
                    ctx.setLineDash([3, 6]);
                    ctx.lineDashOffset = -dashOffset * (idx * 0.7 + 1);
                    ctx.stroke();
                    ctx.setLineDash([]);
                }
            });

            /* ── 4. RAIOS E TICKS ── */
            for (let i = 0; i < 16; i++) {
                const a = (i / 16) * Math.PI * 2;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(Math.cos(a) * R, Math.sin(a) * R);
                ctx.strokeStyle = i % 4 === 0 ? "rgba(34,197,94,0.09)" : "rgba(34,197,94,0.04)";
                ctx.lineWidth = i % 4 === 0 ? 0.7 : 0.4;
                ctx.stroke();
            }
            for (let i = 0; i < 72; i++) {
                const a = (i / 72) * Math.PI * 2;
                const isMajor = i % 9 === 0;
                const isMid = i % 3 === 0;
                const inner = isMajor ? R * 0.89 : isMid ? R * 0.93 : R * 0.965;
                ctx.beginPath();
                ctx.moveTo(Math.cos(a) * inner, Math.sin(a) * inner);
                ctx.lineTo(Math.cos(a) * R, Math.sin(a) * R);
                ctx.strokeStyle = isMajor ? "rgba(34,197,94,0.45)" : isMid ? "rgba(34,197,94,0.22)" : "rgba(34,197,94,0.08)";
                ctx.lineWidth = isMajor ? 1.2 : 0.5;
                ctx.stroke();
            }

            // Labels
            ctx.save();
            ctx.font = "bold 8px monospace";
            [0, 90, 180, 270].forEach((deg) => {
                const a = (deg / 360) * Math.PI * 2 - Math.PI / 2;
                ctx.fillStyle = "rgba(34,197,94,0.22)";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(`${deg}°`, Math.cos(a) * (R * 0.83), Math.sin(a) * (R * 0.83));
            });
            ["96km", "192km", "288km", "384km"].forEach((lbl, i) => {
                ctx.fillStyle = "rgba(6,182,212,0.25)";
                ctx.textAlign = "center";
                ctx.fillText(lbl, 0, -(R * (i === 3 ? 0.96 : [0.22, 0.44, 0.66][i]) - 5));
            });
            ctx.restore();

            /* ── 5. SWEEP SECUNDÁRIO ── */
            s.angle2 -= BASE_SPEED * 0.22;
            const TRAIL2 = Math.PI * 0.5;
            for (let i = 0; i < 40; i++) {
                const frac = i / 40;
                const sliceA = s.angle2 - frac * TRAIL2;
                const nextA = sliceA - TRAIL2 / 40;
                const alpha = Math.pow(1 - frac, 2.5) * 0.07;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.arc(0, 0, R, sliceA, nextA, true);
                ctx.closePath();
                ctx.fillStyle = `rgba(6,182,212,${alpha})`;
                ctx.fill();
            }

            /* ── 6. SWEEP PRINCIPAL — 3 camadas (phosphor / afterglow / ghost) ── */
            if (ph !== "materialize") {
                const SLICES = 180;
                // Ghost (trail completo, quase invisível)
                for (let i = 0; i < SLICES; i++) {
                    const frac = i / SLICES;
                    const sliceAngle = s.angle - frac * TRAIL_ANGLE;
                    const nextAngle = sliceAngle - TRAIL_ANGLE / SLICES;
                    const alpha = Math.pow(1 - frac, 4.5) * 0.1;
                    ctx.beginPath(); ctx.moveTo(0, 0);
                    ctx.arc(0, 0, R, sliceAngle, nextAngle, true);
                    ctx.closePath();
                    ctx.fillStyle = `rgba(6,182,212,${alpha})`;
                    ctx.fill();
                }
                // Afterglow (75% do trail)
                for (let i = 0; i < SLICES; i++) {
                    const frac = i / SLICES;
                    if (frac > 0.75) continue;
                    const sliceAngle = s.angle - frac * TRAIL_ANGLE * 0.75;
                    const nextAngle = sliceAngle - (TRAIL_ANGLE * 0.75) / SLICES;
                    const alpha = Math.pow(1 - frac / 0.75, 2.2) * 0.38;
                    ctx.beginPath(); ctx.moveTo(0, 0);
                    ctx.arc(0, 0, R, sliceAngle, nextAngle, true);
                    ctx.closePath();
                    ctx.fillStyle = `rgba(34,197,94,${alpha})`;
                    ctx.fill();
                }
                // Phosphor (30% — brilho quente na ponta)
                for (let i = 0; i < SLICES; i++) {
                    const frac = i / SLICES;
                    if (frac > 0.30) continue;
                    const sliceAngle = s.angle - frac * TRAIL_ANGLE * 0.30;
                    const nextAngle = sliceAngle - (TRAIL_ANGLE * 0.30) / SLICES;
                    const alpha = Math.pow(1 - frac / 0.30, 0.7) * 0.75;
                    ctx.beginPath(); ctx.moveTo(0, 0);
                    ctx.arc(0, 0, R, sliceAngle, nextAngle, true);
                    ctx.closePath();
                    ctx.fillStyle = `rgba(160,255,190,${alpha})`;
                    ctx.fill();
                }

                // Bloom screen na ponta
                ctx.save();
                ctx.globalCompositeOperation = "screen";
                for (let i = 0; i < 30; i++) {
                    const frac = i / 30;
                    const sliceA = s.angle - frac * (TRAIL_ANGLE * 0.18);
                    const alpha = Math.pow(1 - frac, 1.8) * 0.28;
                    ctx.beginPath(); ctx.moveTo(0, 0);
                    ctx.arc(0, 0, R, sliceA, sliceA - TRAIL_ANGLE * 0.18 / 30, true);
                    ctx.closePath();
                    ctx.fillStyle = `rgba(200,255,215,${alpha})`;
                    ctx.fill();
                }
                ctx.restore();

                /* ── 7. LINHA PRINCIPAL com jitter ── */
                const jx = (Math.random() - 0.5) * 1.4;
                const jy = (Math.random() - 0.5) * 1.4;
                const sx = Math.cos(s.angle) * R + jx;
                const sy = Math.sin(s.angle) * R + jy;
                const lineGrad = ctx.createLinearGradient(0, 0, sx, sy);
                lineGrad.addColorStop(0, "rgba(34,197,94,0)");
                lineGrad.addColorStop(0.3, "rgba(34,197,94,0.15)");
                lineGrad.addColorStop(0.8, "rgba(100,255,150,0.8)");
                lineGrad.addColorStop(1, "rgba(240,255,240,1)");
                ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(sx, sy);
                ctx.strokeStyle = lineGrad; ctx.lineWidth = 1.8; ctx.stroke();

                // Glow da linha
                ctx.save();
                ctx.globalCompositeOperation = "screen";
                const glowGrad = ctx.createLinearGradient(0, 0, sx, sy);
                glowGrad.addColorStop(0, "rgba(34,197,94,0)");
                glowGrad.addColorStop(0.7, "rgba(34,197,94,0.08)");
                glowGrad.addColorStop(1, "rgba(34,197,94,0.35)");
                ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(sx, sy);
                ctx.strokeStyle = glowGrad; ctx.lineWidth = 14; ctx.stroke();
                ctx.restore();

                // Halo na ponta
                const tipG = ctx.createRadialGradient(sx, sy, 0, sx, sy, 13);
                tipG.addColorStop(0, "rgba(240,255,245,1)");
                tipG.addColorStop(0.35, "rgba(34,197,94,0.85)");
                tipG.addColorStop(1, "rgba(34,197,94,0)");
                ctx.beginPath(); ctx.arc(sx, sy, 13, 0, Math.PI * 2);
                ctx.fillStyle = tipG; ctx.fill();
            }

            /* ── 8. CENTRO ── */
            ctx.save();
            ctx.globalCompositeOperation = "screen";
            const centerG = ctx.createRadialGradient(0, 0, 0, 0, 0, 18);
            centerG.addColorStop(0, "rgba(200,255,220,0.9)");
            centerG.addColorStop(0.4, "rgba(34,197,94,0.4)");
            centerG.addColorStop(1, "rgba(34,197,94,0)");
            ctx.beginPath(); ctx.arc(0, 0, 18, 0, Math.PI * 2);
            ctx.fillStyle = centerG; ctx.fill();
            ctx.restore();
            ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(200,255,220,0.95)"; ctx.fill();
            [-1, 1].forEach(dir => {
                ctx.beginPath(); ctx.moveTo(dir * 7, 0); ctx.lineTo(dir * 20, 0);
                ctx.strokeStyle = "rgba(34,197,94,0.38)"; ctx.lineWidth = 0.8; ctx.stroke();
                ctx.beginPath(); ctx.moveTo(0, dir * 7); ctx.lineTo(0, dir * 20); ctx.stroke();
            });

            /* ── 9. ECOS ── */
            s.echoes.forEach(echo => {
                const age = s.frameCount - echo.born;
                const LIFE = echo.isTarget ? 999999 : 220;
                if (age > LIFE) return;
                const life = echo.isTarget ? 1 : Math.max(0, 1 - age / LIFE);
                const ex = echo.x * R, ey = echo.y * R;
                const alpha = life * echo.intensity;
                if (alpha < 0.005) return;
                if (echo.isTarget) {
                    const pulse = 0.85 + 0.15 * Math.sin(s.frameCount * 0.12);
                    const eg = ctx.createRadialGradient(ex, ey, 0, ex, ey, 11 * pulse);
                    eg.addColorStop(0, `rgba(255,255,200,${alpha * 3})`);
                    eg.addColorStop(0.3, `rgba(34,197,94,${alpha * 2})`);
                    eg.addColorStop(1, "rgba(34,197,94,0)");
                    ctx.beginPath(); ctx.arc(ex, ey, 11 * pulse, 0, Math.PI * 2);
                    ctx.fillStyle = eg; ctx.fill();
                } else {
                    const eg = ctx.createRadialGradient(ex, ey, 0, ex, ey, 5);
                    eg.addColorStop(0, `rgba(180,255,200,${alpha * 2.5})`);
                    eg.addColorStop(1, "rgba(34,197,94,0)");
                    ctx.beginPath(); ctx.arc(ex, ey, 5, 0, Math.PI * 2);
                    ctx.fillStyle = eg; ctx.fill();
                }
            });

            /* ── 10. INTERFERÊNCIA ── */
            s.interferencePoints = s.interferencePoints.filter(p => p.life > 0);
            s.interferencePoints.forEach(p => {
                p.life -= 1;
                const ex = p.x * R, ey = p.y * R;
                if (Math.sqrt(ex * ex + ey * ey) > R) return;
                ctx.fillStyle = `rgba(6,182,212,${(p.life / 80) * 0.14})`;
                ctx.fillRect(ex - 0.5, ey - 0.5, 1, 1);
            });
            if (s.frameCount % 5 === 0 && Math.random() < 0.55) {
                const a = Math.random() * Math.PI * 2;
                const d = Math.random() * 0.9;
                s.interferencePoints.push({ x: Math.cos(a) * d, y: Math.sin(a) * d, life: 60 + Math.random() * 40 });
            }
            // Scanlines radiais ocasionais
            if (s.frameCount % 9 === 0 && Math.random() < 0.28) {
                const ia = Math.random() * Math.PI * 2;
                const iLen = R * (0.3 + Math.random() * 0.5);
                ctx.save();
                ctx.globalAlpha = 0.055;
                ctx.strokeStyle = "#06b6d4";
                ctx.lineWidth = 0.3;
                ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(ia) * iLen, Math.sin(ia) * iLen);
                ctx.stroke();
                ctx.restore();
            }

            /* ── 11. BARRA DE SINAL ── */
            ctx.save();
            s.signalStrength = Math.min(s.signalStrength + 0.007, (ph === "detected" || ph === "zoom") ? 1 : 0.62);
            const barX = R + 12, barH = R * 0.5, barY = -barH / 2;
            ctx.fillStyle = "rgba(34,197,94,0.07)";
            ctx.fillRect(barX, barY, 5, barH);
            const fillH = barH * s.signalStrength;
            const barGrad = ctx.createLinearGradient(0, barY + barH, 0, barY);
            barGrad.addColorStop(0, "rgba(34,197,94,0.4)");
            barGrad.addColorStop(0.7, "rgba(34,197,94,0.8)");
            barGrad.addColorStop(1, "rgba(100,255,150,1)");
            ctx.fillStyle = barGrad;
            ctx.fillRect(barX, barY + barH - fillH, 5, fillH);
            ctx.font = "7px monospace"; ctx.fillStyle = "rgba(34,197,94,0.38)";
            ctx.textAlign = "center"; ctx.fillText("SIG", barX + 2.5, barY + barH + 12);
            ctx.restore();

            /* ── 12. AVANÇO DO SWEEP (velocidade orgânica) ── */
            if (ph === "scanning") {
                // Velocidade com ruído orgânico suave
                s.sweepVelocity = BASE_SPEED + organicNoise(ts);
                s.angle += s.sweepVelocity;
                s.angle2 -= s.sweepVelocity * 0.22;
                s.totalRotated += s.sweepVelocity;

                if (s.frameCount % 6 === 0 && Math.random() < 0.5) {
                    const echoAngle = s.angle - Math.random() * TRAIL_ANGLE * 0.6;
                    const echoDist = 0.12 + Math.random() * 0.82;
                    s.echoes.push({ x: Math.cos(echoAngle) * echoDist, y: Math.sin(echoAngle) * echoDist, born: s.frameCount, intensity: 0.04 + Math.random() * 0.14 });
                }
                s.echoes = s.echoes.filter(e => e.isTarget || s.frameCount - e.born < 240);

                if (!s.detectedCalled && s.totalRotated >= TARGET_TOTAL) {
                    s.detectedCalled = true;
                    s.echoes.push({
                        x: Math.cos(s.targetAngle) * s.targetDist,
                        y: Math.sin(s.targetAngle) * s.targetDist,
                        born: s.frameCount, intensity: 1.0, isTarget: true,
                    });
                    // Inicializar partículas ao redor do alvo
                    for (let i = 0; i < 18; i++) {
                        s.particles.push({
                            angle: (i / 18) * Math.PI * 2,
                            speed: 0.018 + Math.random() * 0.012,
                            radius: 0, baseRadius: 22 + Math.random() * 14,
                            alpha: 0.4 + Math.random() * 0.4,
                        });
                    }
                    onDetectedRef.current();
                }
            }

            // Detected: desacelera suavemente (easeOutExpo)
            if (ph === "detected") {
                const targetSpeed = BASE_SPEED * 0.25;
                s.sweepVelocity += (targetSpeed - s.sweepVelocity) * 0.04;
                s.angle += s.sweepVelocity;
                s.angle2 -= s.sweepVelocity * 0.22;
                s.lockProgress = Math.min(s.lockProgress + 0.014, 1);
                // 3 camadas de ping com offset
                if (s.frameCount % 22 === 0)  s.pingWaves.push({ born: s.frameCount, layer: 0 });
                if (s.frameCount % 22 === 7)  s.pingWaves.push({ born: s.frameCount, layer: 1 });
                if (s.frameCount % 22 === 14) s.pingWaves.push({ born: s.frameCount, layer: 2 });
            }

            /* ── 13. ALVO ── */
            const targetEcho = s.echoes.find(e => e.isTarget);
            if (targetEcho || ph === "detected" || ph === "zoom") {
                const tex = (targetEcho?.x ?? Math.cos(s.targetAngle) * s.targetDist) * R;
                const tey = (targetEcho?.y ?? Math.sin(s.targetAngle) * s.targetDist) * R;
                const lp = s.lockProgress;

                // Ping waves em 3 camadas
                s.pingWaves = s.pingWaves.filter(w => s.frameCount - w.born < 90);
                s.pingWaves.forEach(w => {
                    const age = s.frameCount - w.born;
                    const wProg = age / 90;
                    const wR = wProg * 58;
                    const wA = (1 - wProg) * (0.85 - w.layer * 0.2);
                    const colors = ["34,197,94", "6,182,212", "160,255,190"];
                    ctx.beginPath(); ctx.arc(tex, tey, wR, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(${colors[w.layer]},${wA})`;
                    ctx.lineWidth = 1.5 - w.layer * 0.3; ctx.stroke();
                });

                // Partículas orbitando (elipse irregular)
                s.particles.forEach((p, i) => {
                    p.angle += p.speed * (1 + 0.25 * Math.sin(p.angle * 3));
                    p.radius = Math.min(p.radius + 1.2, p.baseRadius);
                    const px = tex + Math.cos(p.angle) * p.radius;
                    const py = tey + Math.sin(p.angle) * p.radius * 0.55;
                    const pa = p.alpha * Math.abs(Math.sin(p.angle + i)) * lp;
                    if (pa < 0.01) return;
                    ctx.fillStyle = `rgba(34,197,94,${pa})`;
                    ctx.fillRect(px - 0.75, py - 0.75, 1.5, 1.5);
                });

                // Ponto central pulsante
                const pulse = 1 + 0.14 * Math.sin(s.frameCount * 0.14);
                const pg = ctx.createRadialGradient(tex, tey, 0, tex, tey, 16 * pulse);
                pg.addColorStop(0, "rgba(255,255,255,1)");
                pg.addColorStop(0.2, "rgba(100,255,180,1)");
                pg.addColorStop(0.6, "rgba(34,197,94,0.5)");
                pg.addColorStop(1, "rgba(34,197,94,0)");
                ctx.beginPath(); ctx.arc(tex, tey, 16 * pulse, 0, Math.PI * 2);
                ctx.fillStyle = pg; ctx.fill();
                ctx.beginPath(); ctx.arc(tex, tey, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = "#fff"; ctx.fill();

                // Lock-on cantos com overshoot
                if (lp > 0) {
                    const overShoot = lp < 0.5 ? lp * 2 : 1;
                    const lockSize = 26 - overShoot * 12 + (lp > 0.8 ? Math.sin((lp - 0.8) * 15) * 2 : 0);
                    const len = lockSize * 0.55 * lp + 5;
                    ([ [-1, -1], [1, -1], [1, 1], [-1, 1] ] as const).forEach(([dx, dy]) => {
                        const bx = tex + dx * lockSize;
                        const by = tey + dy * lockSize;
                        ctx.strokeStyle = `rgba(34,197,94,${0.45 + lp * 0.55})`;
                        ctx.lineWidth = lp > 0.8 ? 2 : 1.5;
                        ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx - dx * len, by); ctx.stroke();
                        ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, by - dy * len); ctx.stroke();
                    });
                    ctx.beginPath();
                    ctx.arc(tex, tey, lockSize * 1.5, 0, Math.PI * 2 * lp);
                    ctx.strokeStyle = `rgba(6,182,212,${lp * 0.5})`;
                    ctx.lineWidth = 0.8; ctx.stroke();
                }

                // Label HUD
                if (lp > 0.3) {
                    const la = (lp - 0.3) / 0.7;
                    ctx.beginPath();
                    ctx.moveTo(tex + 18, tey - 18);
                    ctx.lineTo(tex + 36, tey - 36);
                    ctx.lineTo(tex + 52, tey - 36);
                    ctx.strokeStyle = `rgba(34,197,94,${la * 0.6})`;
                    ctx.lineWidth = 0.8; ctx.setLineDash([3, 2]); ctx.stroke(); ctx.setLineDash([]);
                    ctx.font = "bold 9px monospace";
                    ctx.fillStyle = `rgba(100,255,150,${la * 0.95})`;
                    ctx.textAlign = "left";
                    ctx.fillText("@FRONTISTA", tex + 55, tey - 40);
                    ctx.font = "7px monospace";
                    ctx.fillStyle = `rgba(34,197,94,${la * 0.6})`;
                    ctx.fillText("SINAL FORTE · LOCK-ON", tex + 55, tey - 28);
                    ctx.fillStyle = `rgba(6,182,212,${la * 0.45})`;
                    ctx.fillText(`BRG ${Math.round((s.targetAngle * 180 / Math.PI + 360 + 90) % 360)}° · ${Math.round(s.targetDist * 384)}km`, tex + 55, tey - 18);
                }
            }

            /* ── 14. FASE ZOOM ── */
            if (ph === "zoom") {
                s.zoomProgress = Math.min(s.zoomProgress + 0.035, 1);
                const tex = Math.cos(s.targetAngle) * R * s.targetDist;
                const tey = Math.sin(s.targetAngle) * R * s.targetDist;
                // easeOutQuad para as ondas
                const eased = 1 - Math.pow(1 - s.zoomProgress, 2);
                for (let w = 0; w < 5; w++) {
                    const wProg = Math.min(eased + w * 0.1, 1);
                    const wR = wProg * Math.max(W, H) * 0.95;
                    const wA = (1 - wProg) * (0.65 - w * 0.1);
                    if (wA <= 0) continue;
                    const colors = ["100,255,180", "34,197,94", "6,182,212", "34,197,94", "100,255,180"];
                    ctx.beginPath(); ctx.arc(tex, tey, wR, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(${colors[w]},${wA})`;
                    ctx.lineWidth = 2 - w * 0.3; ctx.stroke();
                }
                if (s.zoomProgress > 0.5) {
                    const fp = (s.zoomProgress - 0.5) / 0.5;
                    const fpEased = 1 - Math.pow(1 - fp, 3);
                    const fg = ctx.createRadialGradient(tex, tey, 0, tex, tey, fpEased * Math.max(W, H));
                    fg.addColorStop(0, `rgba(200,255,220,${fpEased * 0.9})`);
                    fg.addColorStop(0.35, `rgba(34,197,94,${fpEased * 0.35})`);
                    fg.addColorStop(1, "rgba(0,0,0,0)");
                    ctx.fillStyle = fg;
                    ctx.fillRect(-cx, -cy, W, H);
                }
                if (s.zoomProgress >= 1) { onZoomCompleteRef.current(); return; }
            }

            /* ── 15. HUD TEXTO ── */
            ctx.save();
            const hudX = -R + 14;
            const hudY = R - 14 - HUD_LINES.length * 15;
            if (ph === "detected" && s.lockProgress > 0.1) {
                s.hudTimer++;
                if (s.hudTimer % 2 === 0) {
                    if (s.hudLineIndex < HUD_LINES.length) {
                        const line = HUD_LINES[s.hudLineIndex];
                        if (s.hudCharIndex < line.length) {
                            if (!s.hudText[s.hudLineIndex]) s.hudText[s.hudLineIndex] = "";
                            s.hudText[s.hudLineIndex] += line[s.hudCharIndex];
                            s.hudCharIndex++;
                        } else { s.hudLineIndex++; s.hudCharIndex = 0; }
                    }
                }
            }
            s.hudText.forEach((line, i) => {
                const isLast = i === s.hudText.length - 1 && s.hudLineIndex === i;
                ctx.font = "bold 7.5px monospace";
                ctx.fillStyle = i === HUD_LINES.length - 1 ? "rgba(100,255,150,0.95)" : "rgba(34,197,94,0.65)";
                ctx.textAlign = "left";
                ctx.fillText(line + (isLast ? (s.frameCount % 18 < 9 ? "█" : "") : ""), hudX, hudY + i * 14);
            });

            // HUD coords
            ctx.font = "7px monospace"; ctx.fillStyle = "rgba(6,182,212,0.3)"; ctx.textAlign = "right";
            const angleDeg = ((s.angle * 180 / Math.PI) % 360 + 360) % 360;
            ctx.fillText(`AZ ${angleDeg.toFixed(1)}°`, R - 10, -R + 18);
            ctx.fillText("MODE ACTIVE", R - 10, -R + 30);
            ctx.fillText("F 2.4GHz", R - 10, -R + 42);
            ctx.fillStyle = "rgba(34,197,94,0.22)"; ctx.textAlign = "right";
            ctx.fillText(`ECOS: ${s.echoes.filter(e => !e.isTarget).length.toString().padStart(2, "0")}`, R - 10, R - 22);
            ctx.fillText(`FRAME ${s.frameCount.toString().padStart(4, "0")}`, R - 10, R - 10);
            ctx.restore();

            /* ── 16. ANEL DE STATUS ── */
            const statusAlpha = ph === "detected" ? 0.55 + 0.45 * Math.sin(s.frameCount * 0.13) : 0.28;
            ctx.beginPath(); ctx.arc(0, 0, R + 2, 0, Math.PI * 2);
            ctx.strokeStyle = ph === "detected" ? `rgba(34,197,94,${statusAlpha})` : "rgba(34,197,94,0.28)";
            ctx.lineWidth = ph === "detected" ? 2 : 1.2; ctx.stroke();

            ctx.restore(); // translate

            raf = requestAnimationFrame(draw);
        };

        raf = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // ← [] intencional: loop roda uma vez, fases via ref

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 4 }}
        />
    );
}

/* ══════════════════════════════════════════════
   CARD — IDENTIDADE FRONTISTA (criador de conteúdo)
══════════════════════════════════════════════ */
function MaterializeCard({ show }: { show: boolean }) {
    const [columns, setColumns] = useState<boolean[]>(Array(20).fill(false));
    const [fullyVisible, setFullyVisible] = useState(false);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const cardRef = useRef<HTMLDivElement>(null);
    const [floatY, setFloatY] = useState(0);
    const rafRef = useRef<number | undefined>(undefined);
    const [blink, setBlink] = useState(true);
    const [time, setTime] = useState(new Date());
    const [glitchActive, setGlitchActive] = useState(false);

    useEffect(() => {
        if (!show) return;
        // Glitch na entrada
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 420);
        // Materialização por colunas
        columns.forEach((_, i) => {
            setTimeout(() => {
                setColumns(prev => { const n = [...prev]; n[i] = true; return n; });
                if (i === 19) setTimeout(() => setFullyVisible(true), 200);
            }, i * 55);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    useEffect(() => {
        let t = 0;
        const tick = () => {
            t += 0.006;
            setFloatY(Math.sin(t) * 5 + Math.sin(t * 1.7) * 1.5); // float com harmônico
            rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current!);
    }, []);

    useEffect(() => { const id = setInterval(() => setBlink(v => !v), 900); return () => clearInterval(id); }, []);
    useEffect(() => { const id = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(id); }, []);

    const pad = (n: number) => String(n).padStart(2, "0");

    // Spring tilt — suavizado via lerp inline (sem dependência)
    const tiltTarget = useRef({ x: 0, y: 0 });
    const tiltCurrent = useRef({ x: 0, y: 0 });
    useEffect(() => {
        let id: number;
        const tick = () => {
            tiltCurrent.current.x += (tiltTarget.current.x - tiltCurrent.current.x) * 0.1;
            tiltCurrent.current.y += (tiltTarget.current.y - tiltCurrent.current.y) * 0.1;
            setTilt({ x: tiltCurrent.current.x, y: tiltCurrent.current.y });
            id = requestAnimationFrame(tick);
        };
        id = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(id);
    }, []);

    const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current; if (!card) return;
        const rect = card.getBoundingClientRect();
        tiltTarget.current = {
            x: ((e.clientY - rect.top) / rect.height - 0.5) * 7,
            y: ((e.clientX - rect.left) / rect.width - 0.5) * 7,
        };
    };

    if (!show) return null;

    const PILLARS = [
        { id: "01", label: "ORIGEM", value: "Front + Batista", sub: "uma marca, uma missão" },
        { id: "02", label: "PROPÓSITO", value: "Compartilhar", sub: "conhecimento sem barreiras" },
        { id: "03", label: "FORMATO", value: "Short-form", sub: "direto, criativo e real" },
        { id: "04", label: "ESTÁGIO", value: "Em evolução", sub: "documentando ao vivo" },
    ];

    return (
        <div className="relative z-10 flex items-center justify-center px-4 w-full" style={{ zIndex: 10 }}>
            <div style={{ transform: `translateY(${floatY}px)`, width: "100%", maxWidth: 760 }}>

                {/* Transmission bar */}
                <div className="flex items-center justify-between mb-3 px-1"
                    style={{ opacity: fullyVisible ? 1 : 0, transition: "opacity 0.6s ease 0.3s" }}>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1"
                            style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.4)" }}>
                            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e",
                                boxShadow: blink ? "0 0 8px rgba(34,197,94,0.9)" : "none",
                                opacity: blink ? 1 : 0.3, transition: "all 0.15s" }} />
                            <span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(34,197,94,0.9)", letterSpacing: 2, fontWeight: 700 }}>
                                AO VIVO
                            </span>
                        </div>
                        <span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(6,182,212,0.5)", letterSpacing: 2 }}>
                            CH 01 · FRONTISTA
                        </span>
                    </div>
                    <span style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: 1 }}>
                        {pad(time.getHours())}:{pad(time.getMinutes())}:{pad(time.getSeconds())}
                    </span>
                </div>

                {/* THE CARD */}
                <div
                    ref={cardRef}
                    onMouseMove={onMouseMove}
                    onMouseLeave={() => { tiltTarget.current = { x: 0, y: 0 }; }}
                    className="relative overflow-hidden"
                    style={{
                        transform: `perspective(1100px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                        background: "rgba(3,10,6,0.96)",
                        border: "1px solid rgba(34,197,94,0.28)",
                        boxShadow: "0 0 0 1px rgba(6,182,212,0.09), 0 0 60px rgba(34,197,94,0.13), 0 0 120px rgba(6,182,212,0.06), inset 0 0 80px rgba(34,197,94,0.03)",
                        backdropFilter: "blur(12px)",
                        // Glitch na entrada via filter
                        filter: glitchActive ? `hue-rotate(${Math.random() * 20}deg) brightness(1.4)` : "none",
                        transition: glitchActive ? "none" : "transform 0.05s linear, filter 0.15s ease",
                        // Cantos arredondados
                        borderRadius: 20,
                    }}
                >
                    {/* Marcadores de canto HUD */}
                    {[
                        { top: 4, left: 6, text: "SYS-01" },
                        { top: 4, right: 6, text: "ACTIVE" },
                    ].map((c, i) => (
                        <span key={i} style={{
                            position: "absolute", ...c,
                            fontFamily: "monospace", fontSize: 7,
                            color: "rgba(34,197,94,0.3)", letterSpacing: 1,
                            opacity: fullyVisible ? 1 : 0, transition: "opacity 0.4s ease 0.8s",
                        }}>{c.text}</span>
                    ))}

                    {/* Coluna de materialização */}
                    <div className="absolute inset-0 pointer-events-none z-20 flex"
                        style={{ opacity: fullyVisible ? 0 : 1, transition: "opacity 0.4s" }}>
                        {columns.map((visible, i) => (
                            <div key={i} className="flex-1 h-full"
                                style={{ background: visible ? "transparent" : "rgba(0,0,0,0.96)", transition: "background 0.12s ease" }} />
                        ))}
                    </div>

                    <StaticCanvas opacity={0.022} />

                    {/* Scanlines animadas */}
                    <div className="absolute inset-0 pointer-events-none"
                        style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.06) 2px,rgba(0,0,0,0.06) 3px)" }} />

                    {/* Top glow bar */}
                    <div style={{ height: 2, background: "linear-gradient(90deg,transparent,rgba(34,197,94,0.85),rgba(6,182,212,1),rgba(34,197,94,0.85),transparent)" }} />

                    {/* GRID: mobile stack / desktop 2 cols */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr" }} className="card-grid">

                        {/* ── ESQUERDA — Identidade ── */}
                        <div style={{ padding: "clamp(16px,2.6vw,26px) clamp(18px,3.4vw,40px)" }} className="card-left">

                            {/* Eyebrow */}
                            <div className="flex items-center gap-2 mb-3"
                                style={{ opacity: fullyVisible ? 1 : 0, transition: "opacity 0.5s ease 0.2s" }}>
                                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px rgba(34,197,94,0.9)" }} />
                                <span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(34,197,94,0.7)", letterSpacing: 3 }}>
                                    CRIADOR DE CONTEÚDO · FRONT-END
                                </span>
                            </div>

                            {/* Nome */}
                            <h2 style={{
                                fontSize: "clamp(1.9rem,4.6vw,2.7rem)", fontWeight: 900, lineHeight: 1, marginBottom: 5, letterSpacing: -1,
                                opacity: fullyVisible ? 1 : 0, transition: "opacity 0.5s ease 0.3s, transform 0.5s ease 0.3s",
                                transform: fullyVisible ? "none" : "translateY(10px)",
                            }}>
                                <span style={{
                                    background: "linear-gradient(135deg,#22c55e 0%,#06b6d4 50%,#22c55e 100%)",
                                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                                    backgroundClip: "text", display: "inline-block",
                                }}>@frontista</span>
                            </h2>

                            {/* Conceito em destaque */}
                            <div style={{
                                fontFamily: "monospace", fontSize: 12, color: "rgba(6,182,212,0.55)",
                                letterSpacing: 1, marginBottom: 14,
                                opacity: fullyVisible ? 1 : 0, transition: "opacity 0.5s ease 0.4s",
                            }}>
                                // Front + Batista — uma marca, uma missão
                            </div>

                            <div style={{ height: 1, background: "linear-gradient(90deg,rgba(34,197,94,0.4),transparent)", marginBottom: 14 }} />

                            {/* Manifesto */}
                            <div style={{ opacity: fullyVisible ? 1 : 0, transition: "opacity 0.5s ease 0.5s" }}>
                                <p style={{ color: "rgba(220,240,220,0.88)", fontSize: 13, lineHeight: 1.6, marginBottom: 10 }}>
                                    O Frontista nasceu da fusão do meu sobrenome com o que eu faço:{" "}
                                    <span style={{ color: "rgba(34,197,94,0.9)", fontWeight: 700 }}>desenvolvimento Front-end</span>.
                                    Mais do que um nome, é um compromisso de tornar o aprendizado de programação acessível, criativo e sem frescura.
                                </p>
                                <p style={{ color: "rgba(180,210,190,0.65)", fontSize: 12, lineHeight: 1.6, marginBottom: 14 }}>
                                    Aqui eu documento minha evolução em tempo real, compartilho o que aprendo e produzo conteúdo pensado para quem está começando —
                                    porque programação não precisa ser difícil de entender, só precisa ser bem explicada.
                                </p>
                            </div>

                            {/* 4 pilares */}
                            <div style={{
                                display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6,
                                opacity: fullyVisible ? 1 : 0, transition: "opacity 0.5s ease 0.65s",
                            }}>
                                {PILLARS.map(p => (
                                    <div key={p.id} style={{
                                        padding: "8px 12px",
                                        background: "rgba(34,197,94,0.04)",
                                        border: "1px solid rgba(34,197,94,0.13)",
                                        position: "relative",
                                    }}>
                                        <span style={{
                                            position: "absolute", top: 6, right: 8,
                                            fontFamily: "monospace", fontSize: 8,
                                            color: "rgba(6,182,212,0.25)", letterSpacing: 1,
                                        }}>{p.id}</span>
                                        <span style={{ display: "block", fontFamily: "monospace", fontSize: 8, color: "rgba(34,197,94,0.4)", letterSpacing: 2, marginBottom: 3 }}>
                                            {p.label}
                                        </span>
                                        <span style={{
                                            display: "block", fontFamily: "monospace", fontWeight: 800, fontSize: 12,
                                            background: "linear-gradient(135deg,#22c55e,#06b6d4)",
                                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                                        }}>{p.value}</span>
                                        <span style={{ display: "block", fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.22)", marginTop: 1 }}>
                                            {p.sub}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── DIREITA — Missão + CTAs ── */}
                        <div style={{
                            padding: "clamp(16px,2.6vw,26px) clamp(18px,3.4vw,40px)",
                            display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 16,
                        }}>
                            {/* Terminal de missão */}
                            <div style={{ opacity: fullyVisible ? 1 : 0, transition: "opacity 0.5s ease 0.4s" }}>
                                <p style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.18)", letterSpacing: 2, margin: "0 0 8px 0" }}>
                                    // MISSÃO
                                </p>
                                <div style={{
                                    padding: "12px 14px",
                                    background: "rgba(0,8,4,0.75)",
                                    border: "1px solid rgba(34,197,94,0.1)",
                                    marginBottom: 12,
                                }}>
                                    <p style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.22)", letterSpacing: 0.5, lineHeight: 1.7, margin: 0 }}>
                                        &gt; furar a bolha da comunidade tech<br />
                                        &gt; levar código para quem não veio da área<br />
                                        &gt; despertar curiosidade pela programação<br />
                                        &gt; tornar o aprendizado <span style={{ color: "rgba(34,197,94,0.8)" }}>leve e acessível</span><br />
                                        &gt; status:{" "}
                                        <span style={{ color: "rgba(6,182,212,0.8)" }}>transmissão em andamento</span>
                                    </p>
                                </div>

                                {/* Barra de sinal decorativa */}
                                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                                    {[3, 5, 7, 9, 11, 13, 11, 9, 7, 5, 3].map((h, i) => (
                                        <div key={i} style={{
                                            width: 4, height: h * 2.2,
                                            background: i < 7 ? `rgba(34,197,94,${0.28 + i * 0.09})` : "rgba(255,255,255,0.05)",
                                            borderRadius: 2,
                                            animation: `signalPulse 1.5s ease-in-out ${i * 0.09}s infinite alternate`,
                                        }} />
                                    ))}
                                    <span style={{ fontFamily: "monospace", fontSize: 8, color: "rgba(34,197,94,0.45)", letterSpacing: 2, marginLeft: 8 }}>
                                        SINAL ATIVO
                                    </span>
                                </div>
                            </div>

                            {/* CTAs — TikTok e Instagram */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 8,
                                opacity: fullyVisible ? 1 : 0, transition: "opacity 0.5s ease 0.7s" }}>
                                <p style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.18)", letterSpacing: 2, margin: "0 0 4px 0" }}>
                                    // SINTONIZE O CANAL
                                </p>

                                {/* TikTok */}
                                <a href="https://tiktok.com/@frontista" target="_blank" rel="noopener noreferrer"
                                    className="group"
                                    style={{
                                        display: "flex", alignItems: "center", gap: 14,
                                        padding: "11px 14px",
                                        border: "1px solid rgba(6,182,212,0.25)",
                                        background: "rgba(6,182,212,0.04)",
                                        color: "rgba(200,240,220,0.75)",
                                        textDecoration: "none",
                                        transition: "all 0.22s ease",
                                        position: "relative", overflow: "hidden",
                                    }}
                                    onMouseEnter={e => {
                                        const el = e.currentTarget as HTMLElement;
                                        el.style.border = "1px solid rgba(6,182,212,0.8)";
                                        el.style.boxShadow = "0 0 22px rgba(6,182,212,0.3), inset 0 0 16px rgba(6,182,212,0.07)";
                                        el.style.color = "rgba(6,182,212,1)";
                                    }}
                                    onMouseLeave={e => {
                                        const el = e.currentTarget as HTMLElement;
                                        el.style.border = "1px solid rgba(6,182,212,0.25)";
                                        el.style.boxShadow = "none";
                                        el.style.color = "rgba(200,240,220,0.75)";
                                    }}
                                >
                                    {/* Ícone TK */}
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 32 }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.85 }}>
                                            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.15 8.15 0 004.77 1.52V6.74a4.85 4.85 0 01-1-.05z"/>
                                        </svg>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
                                            TikTok
                                        </div>
                                        <div style={{ fontFamily: "monospace", fontSize: 9, opacity: 0.4, marginTop: 2, letterSpacing: 1 }}>
                                            vídeos curtos · dev content · tendências
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ fontFamily: "monospace", fontSize: 10, opacity: 0.6 }}>@frontista</div>
                                        <div style={{ fontSize: 14, opacity: 0.4, marginTop: 2 }}>›</div>
                                    </div>
                                </a>

                                {/* Instagram */}
                                <a href="https://instagram.com/frontista" target="_blank" rel="noopener noreferrer"
                                    style={{
                                        display: "flex", alignItems: "center", gap: 14,
                                        padding: "11px 14px",
                                        border: "1px solid rgba(225,48,108,0.25)",
                                        background: "rgba(225,48,108,0.04)",
                                        color: "rgba(200,240,220,0.75)",
                                        textDecoration: "none",
                                        transition: "all 0.22s ease",
                                        position: "relative", overflow: "hidden",
                                    }}
                                    onMouseEnter={e => {
                                        const el = e.currentTarget as HTMLElement;
                                        el.style.border = "1px solid rgba(225,48,108,0.8)";
                                        el.style.boxShadow = "0 0 22px rgba(225,48,108,0.3), inset 0 0 16px rgba(225,48,108,0.07)";
                                        el.style.color = "rgba(225,48,108,1)";
                                    }}
                                    onMouseLeave={e => {
                                        const el = e.currentTarget as HTMLElement;
                                        el.style.border = "1px solid rgba(225,48,108,0.25)";
                                        el.style.boxShadow = "none";
                                        el.style.color = "rgba(200,240,220,0.75)";
                                    }}
                                >
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 32 }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.85 }}>
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                        </svg>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
                                            Instagram
                                        </div>
                                        <div style={{ fontFamily: "monospace", fontSize: 9, opacity: 0.4, marginTop: 2, letterSpacing: 1 }}>
                                            reels · bastidores · projetos
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ fontFamily: "monospace", fontSize: 10, opacity: 0.6 }}>@frontista</div>
                                        <div style={{ fontSize: 14, opacity: 0.4, marginTop: 2 }}>›</div>
                                    </div>
                                </a>
                            </div>

                            {/* Rodapé */}
                            <div style={{
                                display: "flex", alignItems: "center", gap: 6,
                                opacity: fullyVisible ? 1 : 0, transition: "opacity 0.5s ease 0.9s",
                            }}>
                                <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,transparent,rgba(34,197,94,0.16))" }} />
                                <span style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(34,197,94,0.22)", letterSpacing: 1 }}>
                                    FRONTISTA © {new Date().getFullYear()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(6,182,212,0.45),rgba(34,197,94,0.65),transparent)" }} />
                </div>

                {/* Bottom bar */}
                <div className="flex items-center justify-between mt-3 px-1"
                    style={{ opacity: fullyVisible ? 1 : 0, transition: "opacity 0.5s ease 0.5s" }}>
                    <span style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.13)", letterSpacing: 2 }}>REC · 00:00:00:00</span>
                    <span style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(34,197,94,0.28)", letterSpacing: 1 }}>TRANSMISSÃO RECEBIDA · 384.400 km · SINAL ESTÁVEL</span>
                    <span style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.13)", letterSpacing: 2 }}>SP · PE · BR</span>
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════
   MAIN SECTION
══════════════════════════════════════════════ */
type Phase = "idle" | "scanning" | "detected" | "zoom" | "materialize";

export default function Frontista() {
    const [phase, setPhase] = useState<Phase>("idle");
    const phaseRef = useRef<string>("idle");
    const sectionRef = useRef<HTMLElement>(null);
    const triggered = useRef(false);

    // Sync phase para ref (sem recriar o canvas)
    useEffect(() => { phaseRef.current = phase; }, [phase]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !triggered.current) {
                    triggered.current = true;
                    setTimeout(() => setPhase("scanning"), 300);
                }
            },
            { threshold: 0.3 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const handleDetected = () => setPhase("detected");
    const handleZoomComplete = () => setPhase("materialize");

    useEffect(() => {
        if (phase !== "detected") return;
        const t = setTimeout(() => setPhase("zoom"), 700);
        return () => clearTimeout(t);
    }, [phase]);

    const showRadar = phase === "scanning" || phase === "detected" || phase === "zoom" || phase === "materialize";

    return (
        <section ref={sectionRef} id="frontista" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-24">

            {/* Nebula */}
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[600px] rounded-full"
                    style={{ background: "radial-gradient(ellipse,rgba(34,197,94,0.06) 0%,rgba(6,182,212,0.04) 40%,transparent 70%)" }} />
            </div>

            {/* Background tático */}
            <TacticalBackground phase={phase} />

            {/* Título — alterna entre scanning e materialize */}
            <div className="relative mb-8 w-full" style={{ zIndex: 6 }}>

                {/* Título do radar (some ao materializar) */}
                <div className="flex flex-col items-center text-center" style={{
                    opacity: phase === "materialize" ? 0 : 1,
                    transition: "opacity 0.8s ease",
                    pointerEvents: "none",
                    position: phase === "materialize" ? "absolute" : "relative",
                    inset: 0,
                }}>
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400 bg-clip-text text-transparent whitespace-nowrap">
                        <span className="text-emerald-400/40 font-light">&lt;</span>
                        {" "}Criação{" "}
                        <span className="text-emerald-400/40 font-light">/&gt;</span>
                    </h2>
                    <p className="mt-3 text-xs tracking-widest text-emerald-500/40 uppercase whitespace-nowrap">
                        — sintonizando transmissão —
                    </p>
                </div>

                {/* Título do card (aparece ao materializar) */}
                <div className="flex flex-col items-center text-center" style={{
                    opacity: phase === "materialize" ? 1 : 0,
                    transition: "opacity 0.8s ease 0.4s",
                    pointerEvents: "none",
                    position: phase === "materialize" ? "relative" : "absolute",
                    inset: 0,
                }}>
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400 bg-clip-text text-transparent whitespace-nowrap">
                        <span className="text-emerald-400/40 font-light">&lt;</span>
                        {" "}Criação{" "}
                        <span className="text-emerald-400/40 font-light">/&gt;</span>
                    </h2>
                    <p className="mt-3 text-xs tracking-widest text-emerald-500/30 uppercase whitespace-nowrap">
                        — sinal captado · transmissão estabilizada —
                    </p>
                </div>
            </div>

            {/* Radar — montado uma vez, fases via ref */}
            {showRadar && (
                <div className="absolute inset-0" style={{ zIndex: 4,
                    opacity: phase === "materialize" ? 0 : 1, transition: "opacity 1s ease" }}>
                    <RadarCanvas
                        phaseRef={phaseRef}
                        onDetected={handleDetected}
                        onZoomComplete={handleZoomComplete}
                    />
                </div>
            )}

            {/* Card */}
            <MaterializeCard show={phase === "materialize"} />

            <style>{`
                @keyframes signalPulse {
                    from { opacity: 0.35; transform: scaleY(0.82); }
                    to   { opacity: 1;   transform: scaleY(1); }
                }
                @media (min-width: 768px) {
                    .card-grid { grid-template-columns: 1fr 1fr !important; }
                    .card-left {
                        border-right: 1px solid rgba(34,197,94,0.09);
                        border-bottom: none !important;
                    }
                }
                .card-left { border-bottom: 1px solid rgba(34,197,94,0.09); }
            `}</style>
        </section>
    );
}
