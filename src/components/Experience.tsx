import { useEffect, useRef, useState } from "react";

/* ══ DURAÇÃO DINÂMICA ══ */
function tempoDesde(ano: number, mes: number) {
  const inicio = new Date(ano, mes - 1, 1);
  const agora  = new Date();
  const meses  = Math.max(0, (agora.getFullYear() - inicio.getFullYear()) * 12 + (agora.getMonth() - inicio.getMonth()));
  if (meses < 1)  return "recém-iniciado";
  if (meses < 12) return `${meses} ${meses === 1 ? "mês" : "meses"}`;
  const anos  = Math.floor(meses / 12);
  const restM = meses % 12;
  return `${anos}a${restM ? ` ${restM}m` : ""}`;
}

/* ══ REVEAL: o texto está sempre no HTML; a tarja ▓ é só uma camada visual que recolhe ══ */
function Reveal({ children, delay = 0, revealed, mono = false }: {
  children: string; delay?: number; revealed: boolean; mono?: boolean;
}) {
  return (
    <span
      className={`exp-redact${revealed ? " is-on" : ""}`}
      style={{ "--d": `${delay}ms`, fontFamily: mono ? "monospace" : "inherit" } as React.CSSProperties}
    >
      {children}
    </span>
  );
}

/* ══ LINHA DE CAMPO DA FICHA ══ */
function MissionField({ label, value, delay, revealed, mono = false }: {
  label: string; value: string; delay: number; revealed: boolean; mono?: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", padding: "5px 0",
      borderBottom: "1px solid rgba(34,197,94,0.07)" }}>
      <span style={{ fontFamily: "monospace", fontSize: 8, letterSpacing: 2,
        color: "rgba(34,197,94,0.35)", textTransform: "uppercase",
        minWidth: 110, paddingTop: 1, flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ fontSize: 11, color: "rgba(220,235,220,0.82)", lineHeight: 1.5 }}>
        <Reveal delay={delay} revealed={revealed} mono={mono}>{value}</Reveal>
      </span>
    </div>
  );
}

/* ══ CHIP DE CAPACIDADE ══ */
function CapChip({ label, delay, revealed }: { label: string; delay: number; revealed: boolean }) {
  return (
    <span
      className={`exp-chip${revealed ? " is-on" : ""}`}
      style={{ "--d": `${delay}ms` } as React.CSSProperties}
    >
      {label}
    </span>
  );
}

/* ══ CARIMBO: efeito de stamp físico, todo em CSS ══ */
function Stamp({ active }: { active: boolean }) {
  return (
    <div aria-hidden="true" style={{
      position: "absolute",
      top: "34%", right: 14,
      pointerEvents: "none",
      zIndex: 30,
    }}>
      {active && <div className="exp-stamp-flash" />}
      <div className={`exp-stamp${active ? " is-on" : ""}`}>
        <span style={{ fontFamily: "monospace", fontSize: 7, letterSpacing: 3,
          color: "rgba(34,197,94,0.55)" }}>
          MISSÃO
        </span>
        <span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 900,
          letterSpacing: 4, color: "rgba(34,197,94,0.88)" }}>
          ACEITA
        </span>
        <span style={{ fontFamily: "monospace", fontSize: 7, letterSpacing: 2,
          color: "rgba(34,197,94,0.4)" }}>
          NOV 2025
        </span>
      </div>
    </div>
  );
}


/* ══ SEÇÃO PRINCIPAL ══ */
export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const tiltRef    = useRef<HTMLDivElement>(null);
  const [inView,   setInView]   = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [stamped,  setStamped]  = useState(false);

  useEffect(() => {
    // Sem animação (preferência do sistema): a ficha já aparece aberta
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setInView(true);
        if (still) { setRevealed(true); setStamped(true); }
        obs.disconnect();
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  /* Sequência: scan (CSS) → reveal → stamp */
  const onScanEnd = () => {
    setRevealed(true);
    setTimeout(() => setStamped(true), 950);
  };

  /* Tilt do card no mouse: lerp num rAF que só roda enquanto há movimento */
  const tiltTarget  = useRef({ x: 0, y: 0 });
  const tiltCurrent = useRef({ x: 0, y: 0 });
  const tiltRaf     = useRef(0);
  const runTilt = () => {
    if (tiltRaf.current) return;
    const tick = () => {
      const c = tiltCurrent.current, t = tiltTarget.current;
      c.x += (t.x - c.x) * 0.1;
      c.y += (t.y - c.y) * 0.1;
      if (tiltRef.current) tiltRef.current.style.transform = `perspective(1100px) rotateX(${c.x}deg) rotateY(${c.y}deg)`;
      if (Math.abs(t.x - c.x) + Math.abs(t.y - c.y) > 0.01) tiltRaf.current = requestAnimationFrame(tick);
      else tiltRaf.current = 0;
    };
    tiltRaf.current = requestAnimationFrame(tick);
  };
  useEffect(() => () => cancelAnimationFrame(tiltRaf.current), []);

  const onCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    tiltTarget.current = {
      x: ((e.clientY - rect.top) / rect.height - 0.5) * 7,
      y: ((e.clientX - rect.left) / rect.width - 0.5) * 7,
    };
    runTilt();
  };
  const onCardMouseLeave = () => { tiltTarget.current = { x: 0, y: 0 }; runTilt(); };

  const dur  = tempoDesde(2025, 11);
  const CAPS = [
    "Notas de Empenho", "Gestão Documental", "Comunicados e Circulares",
    "Processos Internos", "Padronização", "Microsoft Excel", "Microsoft Word",
  ];

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative flex flex-col items-center justify-center overflow-hidden px-4 py-24"
    >
      {/* ── Grid sutil ── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(6,182,212,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(6,182,212,0.02) 1px,transparent 1px)",
        backgroundSize: "60px 60px", zIndex: 1,
      }} />

      <div className="relative w-full max-w-2xl" style={{ zIndex: 2 }}>

        {/* ── Título ── */}
        <div className="text-center mb-12" style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.7s ease",
        }}>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400 bg-clip-text text-transparent">
            <span className="text-emerald-400/40 font-light">&lt;</span>
            {" "}Experiência{" "}
            <span className="text-emerald-400/40 font-light">/&gt;</span>
          </h2>
          <p className="mt-3 text-xs tracking-widest text-emerald-500/40 uppercase">
            // primeira missão profissional
          </p>
        </div>

        {/* ── Ficha de missão ── */}
        <div style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(24px)",
          transition: "all 0.6s ease 0.2s",
          position: "relative",
        }}>
          {/* Wrapper único de tilt: card e carimbo giram juntos, no mesmo espaço 3D */}
          <div
            ref={tiltRef}
            onMouseMove={onCardMouseMove}
            onMouseLeave={onCardMouseLeave}
            style={{
              position: "relative",
              transformStyle: "preserve-3d",
              animation: stamped ? "cardShake 0.3s ease" : "none",
            }}
          >
          <div
            style={{
              background: "rgba(2,8,4,0.97)",
              border: "1px solid rgba(34,197,94,0.18)",
              borderRadius: 16,
              position: "relative", overflow: "hidden",
              boxShadow: "0 0 60px rgba(34,197,94,0.08), 0 0 100px rgba(6,182,212,0.04)",
            }}
          >
            {/* Scanlines */}
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(34,197,94,0.012) 3px,rgba(34,197,94,0.012) 4px)",
              zIndex: 0,
            }} />

            {/* Barra de scan */}
            {inView && !revealed && (
              <div className="exp-scan" onAnimationEnd={onScanEnd} style={{
                position: "absolute", left: 0, right: 0, zIndex: 10,
                top: 0, height: 2,
                background: "linear-gradient(90deg,transparent,rgba(34,197,94,0.9),rgba(6,182,212,0.9),transparent)",
                boxShadow: "0 0 20px rgba(34,197,94,0.6), 0 0 40px rgba(34,197,94,0.2)",
              }} />
            )}

            {/* Cabeçalho */}
            <div style={{
              padding: "14px 20px 12px",
              borderBottom: "1px solid rgba(34,197,94,0.12)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "rgba(34,197,94,0.03)", position: "relative", zIndex: 1,
            }}>
              <div>
                <div style={{ fontFamily: "monospace", fontSize: 8, letterSpacing: 3,
                  color: "rgba(34,197,94,0.4)", marginBottom: 2 }}>
                  REGISTRO OPERACIONAL · Nº EXP-2025-001
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 700,
                  color: "rgba(34,197,94,0.7)", letterSpacing: 2 }}>
                  FICHA DE MISSÃO
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "monospace", fontSize: 8,
                  color: "rgba(255,255,255,0.2)", letterSpacing: 1 }}>
                  CLASSIFICAÇÃO
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 9, fontWeight: 700,
                  color: revealed ? "rgba(34,197,94,0.55)" : "rgba(34,197,94,0.2)",
                  letterSpacing: 2, transition: "color 0.5s" }}>
                  {revealed ? "LIBERADO" : "RESTRITO"}
                </div>
              </div>
            </div>

            {/* Corpo */}
            <div style={{ padding: "18px 20px 20px", position: "relative", zIndex: 1 }}>
              <MissionField label="Cargo"       value="Assistente Administrativo · Jovem Aprendiz" delay={0}   revealed={revealed} />
              <MissionField label="Organização" value="Grupo ACLF, Paulista/PE"                   delay={100} revealed={revealed} />
              <MissionField label="Início"      value="Novembro de 2025"                   delay={200} revealed={revealed} mono />
              <MissionField label="Status"      value="EM ANDAMENTO"                       delay={300} revealed={revealed} mono />
              <MissionField label="Duração"     value={dur}                                delay={400} revealed={revealed} mono />

              {/* Sumário */}
              <div style={{
                margin: "16px 0 14px", padding: "12px 14px",
                background: "rgba(34,197,94,0.035)", border: "1px solid rgba(34,197,94,0.1)",
                opacity: revealed ? 1 : 0, transform: revealed ? "translateY(0)" : "translateY(6px)",
                transition: "opacity 0.5s ease 0.7s, transform 0.5s ease 0.7s",
              }}>
                <div style={{ fontFamily: "monospace", fontSize: 8, letterSpacing: 2,
                  color: "rgba(34,197,94,0.35)", marginBottom: 8 }}>
                  SUMÁRIO OPERACIONAL
                </div>
                <p style={{ fontSize: 12, lineHeight: 1.75, color: "rgba(210,228,210,0.78)", margin: 0 }}>
                  Elaboro e controlo notas de empenho, documentos e planilhas em Word e Excel, com foco em
                  precisão e rastreabilidade, e distribuo comunicados e circulares para setores internos e lojas.
                  Foi aqui que percebi a falta de padronização de documentos e procedimentos e criei o{" "}
                  <span style={{ color: "rgba(74,222,128,0.9)" }}>Praxis</span>, que uso na rotina e apresentei ao setor.
                </p>
              </div>

              {/* Capacidades */}
              <div style={{
                opacity: revealed ? 1 : 0,
                transition: "opacity 0.4s ease 0.9s",
              }}>
                <div style={{ fontFamily: "monospace", fontSize: 8, letterSpacing: 2,
                  color: "rgba(34,197,94,0.3)", marginBottom: 10 }}>
                  CAPACIDADES ADQUIRIDAS
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {CAPS.map((c, i) => (
                    <CapChip key={c} label={c} delay={500 + i * 40} revealed={revealed} />
                  ))}
                </div>
              </div>

              {/* Quote */}
              <div style={{
                marginTop: 18, padding: "11px 14px",
                borderLeft: "2px solid rgba(34,197,94,0.3)",
                opacity: revealed ? 1 : 0, transform: revealed ? "translateY(0)" : "translateY(6px)",
                transition: "opacity 0.5s ease 1.5s, transform 0.5s ease 1.5s",
              }}>
                <p style={{ fontFamily: "monospace", fontSize: 8, letterSpacing: 2,
                  color: "rgba(34,197,94,0.35)", marginBottom: 6 }}>
                  APRENDIZADO-CHAVE
                </p>
                <p style={{ fontSize: 11.5, lineHeight: 1.7, color: "rgba(220,235,220,0.7)",
                  fontStyle: "italic", margin: 0 }}>
                  "Antes de aprender a estruturar sistemas, aprendi a estruturar processos."
                </p>
              </div>
            </div>

            {/* Rodapé */}
            <div style={{
              borderTop: "1px solid rgba(34,197,94,0.1)",
              padding: "8px 20px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "rgba(34,197,94,0.02)", position: "relative", zIndex: 1,
              opacity: revealed ? 1 : 0, transition: "opacity 0.4s ease 2s",
            }}>
              <span style={{ fontFamily: "monospace", fontSize: 8,
                color: "rgba(255,255,255,0.15)", letterSpacing: 1 }}>
                EXP-001 · JOÃO BATISTA NETO
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ade80",
                  boxShadow: "0 0 6px rgba(74,222,128,0.8)",
                  animation: "expPulse 1.6s ease-in-out infinite" }} />
                <span style={{ fontFamily: "monospace", fontSize: 8,
                  color: "rgba(74,222,128,0.7)", letterSpacing: 2 }}>
                  ATIVO
                </span>
              </div>
            </div>
          </div>

          {/* ── CARIMBO ── */}
          <Stamp active={stamped} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes expPulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes stampFlash { 0%{opacity:1} 100%{opacity:0} }
        @keyframes expScan { from { top: 0%; } to { top: 100%; } }
        .exp-scan { animation: expScan 0.7s linear forwards; }

        /* Tarja: o texto real fica embaixo e a barra recolhe para a direita */
        .exp-redact { position: relative; display: inline-block; }
        .exp-redact::after {
          content: ""; position: absolute; inset: 1px -2px; border-radius: 2px;
          background:
            repeating-linear-gradient(90deg, rgba(34,197,94,0.32) 0 5px, rgba(34,197,94,0.18) 5px 6px),
            #06140b;
          transform-origin: right center;
          transition: transform 0.45s cubic-bezier(0.65,0,0.35,1) var(--d, 0ms);
        }
        .exp-redact.is-on::after { transform: scaleX(0); }

        .exp-chip {
          font-family: monospace; font-size: 9px; letter-spacing: 1px; padding: 3px 9px;
          display: inline-block;
          border: 1px solid rgba(34,197,94,0.28);
          color: rgba(34,197,94,0.62);
          background: rgba(34,197,94,0.05);
          opacity: 0; transform: scale(0.92);
          transition: opacity 0.35s ease var(--d, 0ms), transform 0.35s cubic-bezier(0.34,1.56,0.64,1) var(--d, 0ms);
        }
        .exp-chip.is-on { opacity: 1; transform: scale(1); }

        .exp-stamp {
          border: 3px solid rgba(34,197,94,0.85);
          padding: 10px 18px;
          display: flex; flex-direction: column; align-items: center; gap: 2px;
          background: rgba(2,8,4,0.98);
          box-shadow: 0 0 0 1px rgba(34,197,94,0.15), 0 0 20px rgba(34,197,94,0.2);
          transform: rotate(-12deg) scale(0.05);
          opacity: 0;
        }
        .exp-stamp.is-on { animation: stampIn 0.4s ease forwards; }
        @keyframes stampIn {
          0%   { transform: rotate(-12deg) scale(0.05); opacity: 0; }
          18%  { transform: rotate(-12deg) scale(1.12); opacity: 1;
                 box-shadow: 0 0 0 4px rgba(34,197,94,0.25), 0 0 36px rgba(34,197,94,0.5); }
          55%  { transform: rotate(-12deg) scale(0.97); opacity: 1; }
          100% { transform: rotate(-12deg) scale(1); opacity: 1;
                 box-shadow: 0 0 0 1px rgba(34,197,94,0.15), 0 0 20px rgba(34,197,94,0.2); }
        }
        .exp-stamp-flash {
          position: absolute; inset: -22px; border-radius: 2px;
          background: radial-gradient(ellipse, rgba(34,197,94,0.4) 0%, transparent 70%);
          animation: stampFlash 0.3s ease forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .exp-redact::after { display: none; }
          .exp-chip { opacity: 1; transform: none; transition: none; }
          .exp-stamp, .exp-stamp.is-on { animation: none; opacity: 1; transform: rotate(-12deg); }
          .exp-stamp-flash { display: none; }
        }
        @keyframes cardShake {
          0%   { translate: 0 0; }
          20%  { translate: -3px 1px; }
          40%  { translate: 3px -1px; }
          60%  { translate: -2px 1px; }
          80%  { translate: 2px 0; }
          100% { translate: 0 0; }
        }
      `}</style>
    </section>
  );
}
