import { useEffect, useMemo, useRef, useState } from "react";

/* ══════════════════════════════════════════════════════════
   DADOS
══════════════════════════════════════════════════════════ */

const TIMELINE_NODES = [
  {
    year: "2022",
    label: "ORIGEM",
    color: "#22c55e",
    glow: "rgba(34,197,94,0.6)",
    events: [
      { icon: "⚙️", text: "Entrada no Senac, curso Mediotech (Ensino Médio + Técnico em TI)" },
      { icon: "🖥️", text: "Foco em Montagem e Manutenção de Computadores" },
      { icon: "📜", text: "Certificado: Aperfeiçoamento em Algoritmo e Pensamento Computacional" },
      { icon: "💡", text: "Primeiro contato com lógica de programação" },
    ],
  },
  {
    year: "2023",
    label: "EXPANSÃO",
    color: "#06b6d4",
    glow: "rgba(6,182,212,0.6)",
    events: [
      { icon: "🌐", text: "Foco em Redes de Computadores e infraestrutura" },
      { icon: "📜", text: "Certificado: Assistente de Suporte e Manutenção de Computadores" },
      { icon: "📜", text: "Certificado: Assistente de Operação de Redes de Computadores" },
    ],
  },
  {
    year: "2024",
    label: "CÓDIGO",
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.6)",
    events: [
      { icon: "💻", text: "Foco em Desenvolvimento de Software" },
      { icon: "🧠", text: "HTML, CSS, JavaScript, Python, Dart e MySQL" },
      { icon: "🏗️", text: "Projeto Integrador SkillShare, plataforma de venda de cursos online" },
      { icon: "🚀", text: "SkillShare selecionado para o REC'n'Play" },
      { icon: "📜", text: "Certificado: Assistente de Desenvolvimento de Aplicativos Computacionais" },
    ],
  },
  {
    year: "2025",
    label: "DECOLAGEM",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.6)",
    events: [
      { icon: "🎓", text: "Ingresso no Centro Universitário UNIFAFIRE, curso de ADS (Análise e Desenvolvimento de Sistemas)" },
      { icon: "🏆", text: "LimpAttack: 1º lugar no 1º período" },
      { icon: "🥈", text: "Benevo: 2º lugar no 2º período" },
      { icon: "📜", text: "Certificado: Formação em Lógica de Programação com JavaScript (Dio)" },
    ],
  },
  {
    year: "2026",
    label: "PRESENTE",
    color: "#ec4899",
    glow: "rgba(236,72,153,0.6)",
    events: [
      { icon: "🏆", text: "P.O.N.T.E: 1º lugar no 3º período" },
      { icon: "📡", text: "Marca Frontista: criador de conteúdo de front-end" },
      { icon: "⚡", text: "4º período em andamento, com foco em projetos pessoais" },
    ],
  },
];

const CERTIFICATES = [
  {
    title: "Lógica de Programação com JavaScript",
    institution: "Dio",
    date: "Abril 2026",
    category: "Desenvolvimento",
    color: "#f59e0b",
    icon: "JS",
  },
  {
    title: "Assistente de Desenvolvimento de Aplicativos Computacionais",
    institution: "Senac",
    date: "Janeiro 2025",
    category: "Desenvolvimento",
    color: "#22c55e",
    icon: "DEV",
  },
  {
    title: "Assistente de Operação de Redes de Computadores",
    institution: "Senac",
    date: "Janeiro 2024",
    category: "Infraestrutura",
    color: "#06b6d4",
    icon: "NET",
  },
  {
    title: "Basic 1, Inglês",
    institution: "Senac",
    date: "Julho 2024",
    category: "Idioma",
    color: "#a78bfa",
    icon: "EN",
  },
  {
    title: "Assistente de Suporte e Manutenção de Computadores",
    institution: "Senac",
    date: "Abril 2023",
    category: "Infraestrutura",
    color: "#06b6d4",
    icon: "HW",
  },
  {
    title: "Aperfeiçoamento em Algoritmo e Pensamento Computacional",
    institution: "Senac",
    date: "Dezembro 2022",
    category: "Fundamentos",
    color: "#22c55e",
    icon: "ALG",
  },
];

/* ══════════════════════════════════════════════════════════
   LINHA DO TEMPO — curva SVG (viewBox) + marcadores HTML
   Toda a geometria é fixa e calculada uma única vez, em unidades
   do viewBox. A curva escala com o container via SVG nativo, e os
   marcadores usam porcentagem sobre o MESMO sistema de coordenadas
   — então nunca existe medição em JS, nunca existe recálculo em
   runtime, e curva/nós são matematicamente impossíveis de
   dessincronizar, em qualquer tamanho de tela ou reflow tardio.
══════════════════════════════════════════════════════════ */
const VB_W = 1000;
const VB_H = 260;

function getTimelinePositions(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const t = count > 1 ? i / (count - 1) : 0;
    const x = VB_W * 0.06 + t * VB_W * 0.88;
    const y = VB_H * 0.54 + Math.sin(t * Math.PI * 1.4) * VB_H * 0.3;
    return { x, y, t };
  });
}

// Spline Catmull-Rom → Bézier cúbica: curva suave que passa exatamente
// pelos pontos dos nós, sem "cotovelos" entre segmentos.
function smoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

function NeuralTimeline({
  nodes,
  activeIdx,
  onHoverNode,
}: {
  nodes: typeof TIMELINE_NODES;
  activeIdx: number | null;
  onHoverNode: (idx: number | null) => void;
}) {
  // Calculado uma única vez a partir da quantidade de nós — não depende
  // do tamanho do container, então nunca precisa ser recalculado depois
  // que os dados chegaram. Zero medição, zero ResizeObserver, zero raf.
  const positions = useMemo(() => getTimelinePositions(nodes.length), [nodes.length]);
  const pathD = useMemo(() => smoothPath(positions), [positions]);

  const gradientId = "timeline-grad";
  const glowId = "timeline-glow";

  return (
    <div style={{ position: "relative", width: "100%", height: 260 }}>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            {nodes.map((n, i) => (
              <stop key={i} offset={`${(i / (nodes.length - 1)) * 100}%`} stopColor={n.color} />
            ))}
          </linearGradient>
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Trilho de fundo, sutil, sempre visível */}
        <path d={pathD} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1.5} />

        {/* Curva principal — desenha-se uma vez ao entrar em viewport e
            permanece fixa para sempre. pathLength="1" normaliza o
            comprimento, então a animação de "desenho" funciona igual
            não importa o tamanho real do path em pixels. */}
        <path
          d={pathD}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={2.5}
          strokeLinecap="round"
          pathLength={1}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: 1,
            animation: "timelineDraw 1.6s cubic-bezier(0.65,0,0.35,1) forwards",
            filter: `url(#${glowId})`,
          }}
        />

        {/* Pulsos de energia viajando sobre a curva — 100% SVG nativo
            (animateMotion + mpath), sem nenhum JS por frame. Sempre
            perfeitamente colados na curva porque usam o MESMO `d`. */}
        <path id="timeline-motion-path" d={pathD} fill="none" stroke="none" />
        {[0, 1, 2].map((i) => (
          <circle key={i} r={3.2} fill="#fff" opacity={0.9}>
            <animateMotion
              dur="5s"
              begin={`${i * 1.7}s`}
              repeatCount="indefinite"
              rotate="auto"
            >
              <mpath href="#timeline-motion-path" />
            </animateMotion>
            <animate
              attributeName="opacity"
              values="0;0.9;0.9;0"
              keyTimes="0;0.05;0.9;1"
              dur="5s"
              begin={`${i * 1.7}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>

      {/* Marcadores dos nós — HTML real (acessível, hover nativo),
          posicionados em % sobre o MESMO sistema de coordenadas do
          viewBox da curva. Fixos desde a primeira renderização. */}
      {positions.map((p, i) => {
        const node = nodes[i];
        const isActive = activeIdx === i;
        const leftPct = (p.x / VB_W) * 100;
        const topPct = (p.y / VB_H) * 100;
        return (
          <div
            key={node.year}
            role="button"
            tabIndex={0}
            aria-label={`${node.year}, ${node.label}`}
            onMouseEnter={() => onHoverNode(i)}
            onMouseLeave={() => onHoverNode(null)}
            onFocus={() => onHoverNode(i)}
            onBlur={() => onHoverNode(null)}
            onClick={() => onHoverNode(isActive ? null : i)}
            style={{
              position: "absolute",
              left: `${leftPct}%`,
              top: `${topPct}%`,
              transform: "translate(-50%, -50%)",
              cursor: "pointer",
              outline: "none",
              opacity: 0,
              animation: `nodeIn 0.5s ease forwards`,
              animationDelay: `${0.3 + i * 0.15}s`,
            }}
          >
            {/* Halo (só aparece em hover/active) */}
            <div
              style={{
                position: "absolute", inset: -20,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${node.glow} 0%, transparent 70%)`,
                opacity: isActive ? 1 : 0,
                transition: "opacity 0.25s ease",
                pointerEvents: "none",
              }}
            />
            {/* Anel pulsante — CSS puro, nunca toca na posição */}
            <div
              style={{
                position: "absolute", inset: isActive ? -13 : -9,
                borderRadius: "50%",
                border: `1.5px solid ${node.color}`,
                opacity: isActive ? 0.9 : 0.55,
                transition: "inset 0.25s ease, opacity 0.25s ease",
                animation: "ringPulse 2.6s ease-in-out infinite",
                animationDelay: `${i * 0.3}s`,
              }}
            />
            {/* Núcleo */}
            <div
              style={{
                width: isActive ? 15 : 11,
                height: isActive ? 15 : 11,
                borderRadius: "50%",
                background: `radial-gradient(circle at 35% 35%, #fff, ${node.color})`,
                boxShadow: `0 0 12px ${node.glow}, 0 0 4px ${node.color}`,
                transition: "width 0.25s ease, height 0.25s ease",
              }}
            />
            {/* Rótulo */}
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                marginTop: 10,
                textAlign: "center",
                whiteSpace: "nowrap",
                pointerEvents: "none",
              }}
            >
              <div style={{
                fontFamily: "monospace", fontWeight: 800,
                fontSize: isActive ? 13 : 11,
                color: isActive ? "#fff" : node.color,
                letterSpacing: 1,
                transition: "font-size 0.2s ease, color 0.2s ease",
              }}>
                {node.year}
              </div>
              <div style={{
                fontFamily: "monospace", fontSize: 8,
                color: node.color + (isActive ? "cc" : "77"),
                letterSpacing: 2, marginTop: 1,
              }}>
                {node.label}
              </div>
            </div>
          </div>
        );
      })}

      {/* Partículas decorativas flutuantes — puramente cosméticas,
          posições fixas via CSS, nunca reposicionadas em JS. */}
      {[
        { left: "18%", top: "70%", delay: "0s", size: 3 },
        { left: "38%", top: "82%", delay: "1.2s", size: 2 },
        { left: "62%", top: "24%", delay: "2.1s", size: 2.5 },
        { left: "81%", top: "58%", delay: "0.6s", size: 2 },
      ].map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: p.left, top: p.top,
            width: p.size, height: p.size,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.5)",
            animation: `floatParticle 4.5s ease-in-out infinite`,
            animationDelay: p.delay,
            pointerEvents: "none",
          }}
        />
      ))}

      <style>{`
        @keyframes timelineDraw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes nodeIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.4); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes ringPulse {
          0%, 100% { transform: scale(1); opacity: 0.55; }
          50%      { transform: scale(1.12); opacity: 0.9; }
        }
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.15; }
          50%      { transform: translateY(-10px) scale(1.3); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PAINEL DE EVENTOS DO ANO
══════════════════════════════════════════════════════════ */
function YearPanel({ node, visible }: { node: typeof TIMELINE_NODES[0] | null; visible: boolean }) {
  const [rendered, setRendered] = useState<typeof TIMELINE_NODES[0] | null>(null);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (node) { setRendered(node); setAnimKey(k => k + 1); }
  }, [node]);

  if (!rendered) return (
    <div style={{
      minHeight: 180,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "monospace", fontSize: 11, color: "rgba(34,197,94,0.3)", letterSpacing: 3,
    }}>
      // PASSE O MOUSE SOBRE UM NÓ
    </div>
  );

  const c = rendered.color;

  return (
    <div style={{
      padding: "20px 24px",
      background: "rgba(3,10,6,0.7)",
      border: `1px solid ${c}44`,
      borderRadius: 16,
      boxShadow: `0 0 40px ${c}18, inset 0 0 30px ${c}08`,
      minHeight: 180,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(8px)",
      transition: "opacity 0.3s ease, transform 0.3s ease",
    }}>
      {/* Header do painel */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: c, boxShadow: `0 0 10px ${c}` }} />
        <span style={{ fontFamily: "monospace", fontWeight: 900, fontSize: 22, color: c, letterSpacing: 1 }}>
          {rendered.year}
        </span>
        <span style={{ fontFamily: "monospace", fontSize: 9, color: c + "88", letterSpacing: 3, textTransform: "uppercase" }}>
          // {rendered.label}
        </span>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${c}40, transparent)` }} />
      </div>

      {/* Eventos com entrada cascata */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {rendered.events.map((ev, i) => (
          <div
            key={`${animKey}-${i}`}
            style={{
              display: "flex", alignItems: "flex-start", gap: 10,
              opacity: 0,
              animation: `eventIn 0.35s ease forwards`,
              animationDelay: `${i * 0.08}s`,
            }}
          >
            <span style={{ fontSize: 14, lineHeight: 1.4, flexShrink: 0 }}>{ev.icon}</span>
            <span style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(220,240,220,0.75)", lineHeight: 1.6 }}>
              {ev.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CARD DE CERTIFICADO com flip 3D
══════════════════════════════════════════════════════════ */
function CertCard({ cert }: { cert: typeof CERTIFICATES[0] }) {
  const [hovering, setHovering] = useState(false);
  const [tapped, setTapped] = useState(false);
  const flipped = hovering || tapped;
  const c = cert.color;

  return (
    <div
      style={{ perspective: 900, height: 140, cursor: "pointer" }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={() => setTapped(t => !t)}
    >
      <div style={{
        width: "100%", height: "100%",
        position: "relative",
        transformStyle: "preserve-3d",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        transition: "transform 0.55s cubic-bezier(0.4,0,0.2,1)",
      }}>
        {/* FRENTE */}
        <div style={{
          position: "absolute", inset: 0,
          backfaceVisibility: "hidden",
          background: "rgba(3,10,6,0.9)",
          border: `1px solid ${c}44`,
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: `0 0 0 1px ${c}18, 0 0 24px ${c}14`,
          padding: "16px 18px",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
        }}>
          {/* Scan lines */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.06) 2px,rgba(0,0,0,0.06) 3px)",
          }} />

          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{
                fontFamily: "monospace", fontWeight: 900, fontSize: 10,
                padding: "2px 8px", border: `1px solid ${c}55`,
                color: c, background: c + "12", letterSpacing: 1,
              }}>
                {cert.icon}
              </span>
              <span style={{ fontFamily: "monospace", fontSize: 8, color: "rgba(255,255,255,0.2)", letterSpacing: 2 }}>
                {cert.category.toUpperCase()}
              </span>
            </div>
            <p style={{
              fontFamily: "monospace", fontSize: 11, color: "rgba(220,240,220,0.85)",
              lineHeight: 1.55, margin: 0,
            }}>
              {cert.title}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.3)" }}>
              {cert.institution}
            </span>
            <span style={{ fontFamily: "monospace", fontSize: 8, color: c + "88", letterSpacing: 1 }}>
              HOVER →
            </span>
          </div>
          {/* Barra inferior colorida */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
            background: `linear-gradient(90deg, transparent, ${c}, transparent)` }} />
        </div>

        {/* VERSO */}
        <div style={{
          position: "absolute", inset: 0,
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          background: c + "18",
          border: `1px solid ${c}66`,
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: `0 0 40px ${c}30, inset 0 0 20px ${c}10`,
          padding: "16px 18px",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          <div style={{ fontSize: 28 }}>🎓</div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 13, color: c, margin: "0 0 4px 0", letterSpacing: 1 }}>
              {cert.institution}
            </p>
            <p style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.35)", margin: 0, letterSpacing: 2 }}>
              {cert.date.toUpperCase()}
            </p>
          </div>
          <div style={{ height: 1, width: "60%", background: `linear-gradient(90deg,transparent,${c},transparent)` }} />
          <p style={{ fontFamily: "monospace", fontSize: 8, color: c + "aa", letterSpacing: 1, textTransform: "uppercase", margin: 0 }}>
            {cert.category}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SEÇÃO PRINCIPAL
══════════════════════════════════════════════════════════ */
export default function Training() {
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [panelVisible, setPanelVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const handleHoverNode = (idx: number | null) => {
    setActiveNode(idx);
    setPanelVisible(idx !== null);
  };

  return (
    <section
      ref={sectionRef}
      id="training"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-24"
    >
      <div className="relative z-10 w-full max-w-5xl">

        {/* ── TÍTULO ── */}
        <div
          className="text-center mb-16"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.7s ease",
          }}
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400 bg-clip-text text-transparent">
            <span className="text-emerald-400/40 font-light">&lt;</span>
            {" "}Formação{" "}
            <span className="text-emerald-400/40 font-light">/&gt;</span>
          </h2>
          <p className="mt-3 text-xs tracking-widest text-emerald-500/40 uppercase">
            // cada nó é um capítulo
          </p>
          <p className="mt-2 text-sm text-zinc-500 hidden md:block">Passe o mouse nos marcadores · Cada ano guarda uma história</p>
          <p className="mt-2 text-sm text-zinc-500 md:hidden">Toque nos marcadores · Cada ano guarda uma história</p>
        </div>

        {/* ══════════════════════════════════
            LINHA DO TEMPO — SINAL
        ══════════════════════════════════ */}
        <div
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.7s ease 0.2s",
            marginBottom: 32,
          }}
        >
          {/* Label da seção */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
            <span style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(34,197,94,0.5)", letterSpacing: 3, textTransform: "uppercase" }}>
              // linha do tempo
            </span>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,rgba(34,197,94,0.2),transparent)" }} />
          </div>

          {/* Osciloscópio da trajetória */}
          <div
            style={{
              position: "relative",
              background: "rgba(3,10,6,0.6)",
              backgroundImage: "repeating-linear-gradient(0deg, rgba(34,197,94,0.035) 0px, rgba(34,197,94,0.035) 1px, transparent 1px, transparent 5px)",
              border: "1px solid rgba(34,197,94,0.12)",
              borderRadius: 16,
              boxShadow: "0 0 40px rgba(34,197,94,0.06)",
              marginBottom: 12,
              padding: "14px 12px 30px",
            }}
          >
            {/* Leitura de canal, no canto — reforça a metáfora de sinal sem competir com os nós */}
            <div style={{
              position: "absolute", top: 10, right: 12,
              fontFamily: "monospace", fontSize: 8, letterSpacing: 2,
              color: "rgba(34,197,94,0.35)", pointerEvents: "none",
            }}>
              CH.1 · TRAJETÓRIA
            </div>
            <NeuralTimeline
              nodes={TIMELINE_NODES}
              activeIdx={activeNode}
              onHoverNode={handleHoverNode}
            />
          </div>

          {/* Painel de eventos */}
          <YearPanel
            node={activeNode !== null ? TIMELINE_NODES[activeNode] : null}
            visible={panelVisible}
          />
        </div>

        {/* ══════════════════════════════════
            CERTIFICADOS
        ══════════════════════════════════ */}
        <div
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.7s ease 0.4s",
            marginTop: 64,
          }}
        >
          {/* Label */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#06b6d4", boxShadow: "0 0 8px #06b6d4" }} />
            <span style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(6,182,212,0.5)", letterSpacing: 3, textTransform: "uppercase" }}>
              // certificados
            </span>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,rgba(6,182,212,0.2),transparent)" }} />
            <span style={{ fontFamily: "monospace", fontSize: 8, color: "rgba(255,255,255,0.15)", letterSpacing: 2 }}>
              {CERTIFICATES.length} EMITIDOS
            </span>
          </div>

          <p style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: 1, marginBottom: 20 }}>
            // passe o mouse para virar
          </p>

          {/* Grid de cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 12,
          }}>
            {CERTIFICATES.map((cert, i) => (
              <div
                key={i}
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(20px)",
                  transition: `all 0.5s ease ${0.5 + i * 0.07}s`,
                }}
              >
                <CertCard cert={cert} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Animações globais */}
      <style>{`
        @keyframes eventIn {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}
