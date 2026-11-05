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

        const W = () => canvas.width;
        const H = () => canvas.height;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
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
        const draw = () => {
            t += 0.004;
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

            ctx.fillStyle = "rgba(0,0,0,0.18)";
            ctx.fillRect(0, 0, w, h);

            // ── Draw nebulas with parallax ──
            for (const neb of nebulas) {
                const px = (neb.x + (mouse.x - 0.5) * 0.04) * w;
                const py = (neb.y + (mouse.y - 0.5) * 0.04) * h;
                const pulse = 1 + 0.08 * Math.sin(t * 0.7 + neb.x * 10);
                const grad = ctx.createRadialGradient(px, py, 0, px, py, neb.r * pulse);
                grad.addColorStop(0, neb.color + (neb.baseAlpha * 1.8) + ")");
                grad.addColorStop(0.4, neb.color + neb.baseAlpha + ")");
                grad.addColorStop(1, neb.color + "0)");
                ctx.beginPath();
                ctx.arc(px, py, neb.r * pulse, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();
            }

            // ── Draw stars 3D ──
            const speed = 0.0008 + warpSpeed * 0.055;

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

                if (warpSpeed > 0.05) {
                    // streak lines during warp
                    ctx.beginPath();
                    ctx.moveTo(px2, py2);
                    ctx.lineTo(sx, sy);
                    const streakAlpha = alpha * Math.min(1, warpSpeed * 1.5);
                    ctx.strokeStyle = `rgba(180,255,240,${streakAlpha})`;
                    ctx.lineWidth = size * 0.7;
                    ctx.stroke();
                } else {
                    // normal star dot
                    ctx.beginPath();
                    ctx.arc(sx, sy, size, 0, Math.PI * 2);
                    // slight color tint based on depth
                    const g = Math.floor(200 + (1 - s.z) * 55);
                    ctx.fillStyle = `rgba(180,${g},240,${alpha})`;
                    ctx.fill();
                }
            }

            animId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
            window.removeEventListener("warp", onWarp);
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
