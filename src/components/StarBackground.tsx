import { useEffect, useRef } from "react";

function StarBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animId: number;
        let warpActive = false;
        let warpSpeed = 0;
        const mouse = { x: 0.5, y: 0.5 };
        const targetMouse = { x: 0.5, y: 0.5 };

        const SCALE = 0.75;
        const W = () => canvas.width;
        const H = () => canvas.height;

        const resize = () => {
            // Desenha em 75% da resolução: as estrelas são pontos, a diferença não aparece e a pintura fica bem mais leve
            canvas.width = Math.round(window.innerWidth * SCALE);
            canvas.height = Math.round(window.innerHeight * SCALE);
        };
        resize();
        window.addEventListener("resize", resize);

        // ── Stars 3D ──
        const STAR_COUNT = 420;
        const stars = Array.from({ length: STAR_COUNT }, () => ({
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2,
            z: Math.random(),
            pz: 0,
        }));

        const resetStar = (s: typeof stars[0]) => {
            s.x = (Math.random() - 0.5) * 2;
            s.y = (Math.random() - 0.5) * 2;
            s.z = 1;
            s.pz = 1;
        };

        // ── Nebulas ──
        const nebulas = [
            { x: 0.2, y: 0.3, r: 320, color: "rgba(34,197,94,", baseAlpha: 0.032 },
            { x: 0.78, y: 0.65, r: 280, color: "rgba(6,182,212,", baseAlpha: 0.028 },
            { x: 0.5, y: 0.8, r: 200, color: "rgba(16,185,129,", baseAlpha: 0.022 },
        ];

        // Cada nebulosa vira um sprite desenhado uma única vez (antes: 3 gradientes novos por frame)
        const sprites = nebulas.map(neb => {
            const size = Math.ceil(neb.r * SCALE * 2.2);
            const c = document.createElement("canvas");
            c.width = c.height = size;
            const g = c.getContext("2d")!;
            const r = size / 2;
            const grad = g.createRadialGradient(r, r, 0, r, r, neb.r * SCALE);
            grad.addColorStop(0, neb.color + (neb.baseAlpha * 1.8) + ")");
            grad.addColorStop(0.4, neb.color + neb.baseAlpha + ")");
            grad.addColorStop(1, neb.color + "0)");
            g.fillStyle = grad;
            g.fillRect(0, 0, size, size);
            return c;
        });

        // Seções pesadas (o carrossel do Frontista) pedem para o fundo congelar enquanto estão na tela
        let frozen = false;
        const onFreeze = (e: Event) => { frozen = (e as CustomEvent<boolean>).detail; };
        window.addEventListener("starfield-freeze", onFreeze);

        // ── Warp event ──
        const onWarp = () => {
            warpActive = true;
            warpSpeed = 0;
        };
        window.addEventListener("warp", onWarp);

        // ── Mouse parallax ──
        const onMouseMove = (e: MouseEvent) => {
            targetMouse.x = e.clientX / window.innerWidth;
            targetMouse.y = e.clientY / window.innerHeight;
        };
        window.addEventListener("mousemove", onMouseMove);

        let t = 0;
        // 30 fps parado, 60 fps durante o warp
        let lastFrame = 0;
        const draw = (now = 0) => {
            if (!warpActive && warpSpeed === 0 && (frozen || now - lastFrame < 32)) { animId = requestAnimationFrame(draw); return; }
            lastFrame = now;
            const k = warpActive || warpSpeed > 0 ? 1 : 2; // a 30 fps cada quadro anda o dobro
            t += 0.004 * k;
            const w = W(), h = H();
            const cx = w / 2, cy = h / 2;

            // smooth mouse
            mouse.x += (targetMouse.x - mouse.x) * 0.05;
            mouse.y += (targetMouse.y - mouse.y) * 0.05;

            // warp speed curve
            if (warpActive) {
                warpSpeed = Math.min(warpSpeed + 0.06, 1);
                if (warpSpeed >= 1) warpActive = false;
            } else {
                warpSpeed = Math.max(warpSpeed - 0.025, 0);
            }

            ctx.fillStyle = k === 2 ? "rgba(0,0,0,0.32)" : "rgba(0,0,0,0.18)";
            ctx.fillRect(0, 0, w, h);

            // ── Draw nebulas with parallax ──
            nebulas.forEach((neb, i) => {
                const px = (neb.x + (mouse.x - 0.5) * 0.04) * w;
                const py = (neb.y + (mouse.y - 0.5) * 0.04) * h;
                const pulse = 1 + 0.08 * Math.sin(t * 0.7 + neb.x * 10);
                const d = sprites[i].width * pulse;
                ctx.drawImage(sprites[i], px - d / 2, py - d / 2, d, d);
            });

            // ── Draw stars 3D ──
            const speed = (0.0008 + warpSpeed * 0.055) * k;
            const warping = warpSpeed > 0.05;
            if (warping) { ctx.strokeStyle = "rgb(180,255,240)"; }

            for (const s of stars) {
                s.pz = s.z;
                s.z -= speed;
                if (s.z <= 0) { resetStar(s); continue; }

                const sx = (s.x / s.z) * cx + cx;
                const sy = (s.y / s.z) * cy + cy;
                const px2 = (s.x / s.pz) * cx + cx;
                const py2 = (s.y / s.pz) * cy + cy;

                if (sx < 0 || sx > w || sy < 0 || sy > h) { resetStar(s); continue; }

                const size = Math.max(0.3, (1 - s.z) * 2.8);
                const alpha = Math.min(1, (1 - s.z) * 1.4);

                if (warping) {
                    // streak lines during warp
                    ctx.globalAlpha = alpha * Math.min(1, warpSpeed * 1.5);
                    ctx.beginPath();
                    ctx.moveTo(px2, py2);
                    ctx.lineTo(sx, sy);
                    ctx.lineWidth = size * 0.7;
                    ctx.stroke();
                } else {
                    // estrela: quadradinho (bem mais barato que arc) com tom pela profundidade
                    ctx.globalAlpha = alpha;
                    ctx.fillStyle = s.z < 0.5 ? "#b4fff0" : "#b4e6f0";
                    const d = size * 1.6;
                    ctx.fillRect(sx - d / 2, sy - d / 2, d, d);
                }
            }
            ctx.globalAlpha = 1;

            animId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
            window.removeEventListener("warp", onWarp);
            window.removeEventListener("starfield-freeze", onFreeze);
            window.removeEventListener("mousemove", onMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
}

export default StarBackground;
