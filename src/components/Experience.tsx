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

/* ══ REVEAL — fade + slide suave, sem hacker ══ */
function Reveal({ children, delay = 0, revealed, mono = false }: {
  children: string; delay?: number; revealed: boolean; mono?: boolean;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!revealed) return;
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [revealed, delay]);

  return (
    <span style={{
      display: "inline-block",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(5px)",
      transition: "opacity 0.45s ease, transform 0.45s ease",
      fontFamily: mono ? "monospace" : "inherit",
    }}>
      {/* enquanto não revelado mostra bloco redacted */}
      {!visible
        ? <span style={{ background: "rgba(34,197,94,0.25)", color: "transparent", borderRadius: 2, userSelect: "none" }}>
            {"▓".repeat(Math.max(children.length, 4))}
          </span>
        : children
      }
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
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!revealed) return;
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [revealed, delay]);

  return (
    <span style={{
      fontFamily: "monospace", fontSize: 9, letterSpacing: 1, padding: "3px 9px",
      border: `1px solid rgba(34,197,94,${visible ? "0.28" : "0"})`,
      color: `rgba(34,197,94,${visible ? "0.62" : "0"})`,
      background: `rgba(34,197,94,${visible ? "0.05" : "0"})`,
      opacity: visible ? 1 : 0,
      transform: visible ? "scale(1)" : "scale(0.92)",
      transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
      display: "inline-block",
    }}>
      {label}
    </span>
  );
}

/* ══ CARIMBO — efeito de stamp físico ══ */
function Stamp({ active }: { active: boolean }) {
  const [phase, setPhase] = useState<"hidden"|"impact"|"bounce"|"settle">("hidden");

  useEffect(() => {
    if (!active) return;
    setPhase("impact");
    const t1 = setTimeout(() => setPhase("bounce"), 80);
    const t2 = setTimeout(() => setPhase("settle"), 220);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [active]);

  const transforms: Record<typeof phase, string> = {
    hidden:  "rotate(-12deg) scale(0.05)",
    impact:  "rotate(-12deg) scale(1.12)",
    bounce:  "rotate(-12deg) scale(0.97)",
    settle:  "rotate(-12deg) scale(1)",
  };
  const opacities: Record<typeof phase, number> = {
    hidden: 0, impact: 1, bounce: 1, settle: 1,
  };
  const durations: Record<typeof phase, string> = {
    hidden:  "0s",
    impact:  "0.07s",
    bounce:  "0.14s cubic-bezier(0.34,1.56,0.64,1)",
    settle:  "0.18s ease",
  };

  return (
    <div style={{
      position: "absolute",
      top: "34%", right: 14,
      transformOrigin: "center",
      pointerEvents: "none",
      zIndex: 30,
    }}>
      {/* Halo de impacto — flash que some */}
      {phase === "impact" && (
        <div style={{
          position: "absolute", inset: -22, borderRadius: 2,
          background: "radial-gradient(ellipse, rgba(34,197,94,0.4) 0%, transparent 70%)",
          animation: "stampFlash 0.3s ease forwards",
        }} />
      )}

      {/* O carimbo em si */}
      <div style={{
        transform: transforms[phase],
        opacity: opacities[phase],
        transition: `transform ${durations[phase]}, opacity ${phase === "hidden" ? "0s" : "0.06s"}, box-shadow 0.3s ease`,
        border: "3px solid rgba(34,197,94,0.85)",
        padding: "10px 18px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
        background: "rgba(2,8,4,0.98)",
        boxShadow: phase === "impact"
          ? "0 0 0 4px rgba(34,197,94,0.25), 0 0 36px rgba(34,197,94,0.5)"
          : "0 0 0 1px rgba(34,197,94,0.15), 0 0 20px rgba(34,197,94,0.2)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* "Tinta" que escorre após impact */}
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(34,197,94,0.07)",
          opacity: phase === "impact" ? 1 : 0,
          transition: "opacity 0.4s ease",
        }} />

        <span style={{ fontFamily: "monospace", fontSize: 7, letterSpacing: 3,
          color: "rgba(34,197,94,0.55)", position: "relative" }}>
          MISSÃO
        </span>
        <span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 900,
          letterSpacing: 4, color: "rgba(34,197,94,0.88)", position: "relative",
          textShadow: phase === "impact" ? "0 0 12px rgba(34,197,94,0.8)" : "none",
          transition: "text-shadow 0.4s ease" }}>
          CONCLUÍDA
        </span>
        <span style={{ fontFamily: "monospace", fontSize: 7, letterSpacing: 2,
          color: "rgba(34,197,94,0.4)", position: "relative" }}>
          NOV 2025
        </span>
      </div>
    </div>
  );
}


/* ══ SEÇÃO PRINCIPAL ══ */
export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef    = useRef<HTMLDivElement>(null);
  const [inView,   setInView]   = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [stamped,  setStamped]  = useState(false);
  const [shake,    setShake]    = useState(false);
  const [scanLine, setScanLine] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  /* Sequência: scan → reveal → stamp */
  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    let raf: number;
    const SCAN_DURATION = 700;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / SCAN_DURATION * 100, 100);
      setScanLine(prog);
      if (prog < 100) { raf = requestAnimationFrame(tick); }
      else {
        setTimeout(() => setRevealed(true), 150);
        setTimeout(() => { setStamped(true); setShake(true); setTimeout(() => setShake(false), 300); }, 1100);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  /* Tilt do card no mouse — spring suavizado via lerp inline */
  const tiltTarget  = useRef({ x: 0, y: 0 });
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

  const onCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    tiltTarget.current = {
      x: ((e.clientY - rect.top) / rect.height - 0.5) * 7,
      y: ((e.clientX - rect.left) / rect.width - 0.5) * 7,
    };
  };
  const onCardMouseLeave = () => { tiltTarget.current = { x: 0, y: 0 }; };

  const dur  = tempoDesde(2025, 11);
  const CAPS = [
    "Gestão Documental", "Notas de Empenho", "Lançamento de Receitas",
    "Comunicação Interna", "Padronização", "Microsoft Excel", "Microsoft Word",
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
            onMouseMove={onCardMouseMove}
            onMouseLeave={onCardMouseLeave}
            style={{
              position: "relative",
              transform: `perspective(1100px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: "transform 0.05s linear",
              transformStyle: "preserve-3d",
              animation: shake ? "cardShake 0.3s ease" : "none",
            }}
          >
          <div
            ref={cardRef}
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
            {!revealed && (
              <div style={{
                position: "absolute", left: 0, right: 0, zIndex: 10,
                top: `${scanLine}%`, height: 2,
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
              <MissionField label="Cargo"       value="Auxiliar Administrativo · Aprendiz" delay={0}   revealed={revealed} />
              <MissionField label="Organização" value="ACLF, Pernambuco"                   delay={100} revealed={revealed} />
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
                  Primeiro contato real com rotina profissional: gestão documental, controle de receitas,
                  comunicação institucional e padronização de processos. A mesma disciplina que hoje
                  sustenta como estruturo sistemas e escrevo código.
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
