import { useEffect, useRef, useState } from "react";

/* ── Data ── */
const UNLOCKED = [
  {
    id: "limpattack",
    name: "Limpattack",
    period: "Fev 2025 – Jun 2025",
    shortDesc: "Jogo educativo interativo inspirado em Pokémon, para crianças de 6–10 anos. Foco em higiene e combate a bactérias.",
    fullDesc: "Jogo educativo interativo inspirado na franquia Pokémon, voltado para crianças de 6 a 10 anos com foco em higiene e combate a bactérias. Atuei como desenvolvedor principal do sistema de batalha e mecânicas de progressão, além de liderar a integração visual com Pygame. Desenvolvido em equipe com Python e Pygame.",
    role: "Desenvolvedor de Gameplay & Integração Visual",
    stack: ["Python", "Pygame"],
    github: "https://github.com/joaobatis1a/limpattack",
    demo: "https://limpattack.vercel.app/",
    trailer: "/trailer_limpattack.mp4",
    award: "🏆 1º Lugar",
    mx: 210, my: 210,
    color: {
      base: "rgba(251,191,36,0.95)",
      glow: "rgba(251,191,36,0.6)",
      bg: "rgba(251,191,36,0.12)",
      border: "rgba(251,191,36,0.35)",
      text: "rgba(253,230,138,0.95)",
      ping: "rgba(251,191,36,0.3)",
      hex: "#FBbf24",
      solid: "rgba(251,191,36,0.08)",
    },
  },
  {
    id: "benevo",
    name: "Benevo",
    period: "Jul 2025 – Dez 2025",
    shortDesc: "Sistema de gestão de doações para ONGs com controle de estoque, recebimento e distribuição de itens.",
    fullDesc: "Sistema de gestão de doações para ONGs com controle de estoque, recebimento e distribuição de itens. Assumi o papel de Scrum Master durante todos os sprints e liderei a equipe de front-end, definindo arquitetura de componentes, padrões de design system e garantindo a entrega de interfaces acessíveis e responsivas. A plataforma impactou diretamente o fluxo de trabalho de voluntários em campo.",
    role: "Líder de Front-end & Scrum Master",
    stack: ["HTML", "CSS", "JavaScript", "Java", "MongoDB"],
    github: "https://github.com/joaobatis1a/benevo",
    demo: "https://benevo-demo.vercel.app/",
    trailer: null,
    award: "🥈 2º Lugar",
    mx: 420, my: 275,
    color: {
      base: "rgba(59,130,246,0.95)",
      glow: "rgba(59,130,246,0.6)",
      bg: "rgba(59,130,246,0.12)",
      border: "rgba(59,130,246,0.35)",
      text: "rgba(147,197,253,0.95)",
      ping: "rgba(59,130,246,0.3)",
      hex: "#3b82f6",
      solid: "rgba(59,130,246,0.08)",
    },
  },
  {
    id: "ponte",
    name: "P.O.N.T.E",
    period: "Jan 2026 – presente",
    shortDesc: "Plataforma que conecta jovens talentos a oportunidades profissionais reais.",
    fullDesc: "Plataforma de Oportunidades e Novos Talentos Emergentes — conecta jovens talentos a oportunidades profissionais reais. Conduzi os rituais ágeis como Scrum Master e dirigi toda a frente de design e desenvolvimento front-end: sistema de rotas, componentização, prototipagem no Figma e handoff para o time. O projeto nasceu de uma demanda real identificada durante vivências acadêmicas.",
    role: "Líder de Front-end & Scrum Master",
    stack: ["HTML", "CSS", "JavaScript", "Figma"],
    github: "https://github.com/joaobatis1a/ponte",
    demo: "https://ponte-demo.vercel.app/",
    trailer: null,
    award: "🏆 1º Lugar",
    mx: 600, my: 215,
    color: {
      base: "rgba(249,115,22,0.95)",
      glow: "rgba(249,115,22,0.6)",
      bg: "rgba(249,115,22,0.12)",
      border: "rgba(249,115,22,0.35)",
      text: "rgba(253,186,116,0.95)",
      ping: "rgba(249,115,22,0.3)",
      hex: "#f97316",
      solid: "rgba(249,115,22,0.08)",
    },
  },
  {
    id: "kairos",
    name: "Kairos",
    period: "Jun 2026 – Set 2026",
    shortDesc: "Agendamento pra barbearias: o cliente marca sozinho pelo link e o barbeiro vê tudo no painel.",
    fullDesc: "Cada barbearia ganha um link próprio pra botar na bio. O cliente escolhe serviço, barbeiro e horário sozinho, e o dono acompanha agenda, equipe e faturamento num painel só. Fiz sozinho em Next.js e Supabase, com cada barbearia isolada no banco e os e-mails de confirmação e lembrete saindo automático pela Resend.",
    role: "Desenvolvedor Full-stack (solo)",
    stack: ["Next.js", "React", "TypeScript", "Supabase", "Resend"],
    github: "https://github.com/joaobatis1a/kairos",
    demo: "https://kairos-demo-rouge.vercel.app/",
    trailer: null,
    award: null,
    mx: 415, my: 150,
    color: {
      base: "rgba(244,63,94,0.95)",
      glow: "rgba(244,63,94,0.6)",
      bg: "rgba(244,63,94,0.12)",
      border: "rgba(251,113,133,0.4)",
      text: "rgba(253,164,175,0.95)",
      ping: "rgba(244,63,94,0.3)",
      hex: "#f43f5e",
      solid: "rgba(244,63,94,0.08)",
    },
  },
  {
    id: "praxis",
    name: "Praxis",
    period: "Jul 2026 – Ago 2026",
    shortDesc: "Gestão do conhecimento pra empresas: documentos, procedimentos e avisos da equipe num lugar só.",
    fullDesc: "Um lugar só pra tudo que a equipe precisa saber: documentos versionados, procedimentos com checklist e responsável, avisos internos e notificações. Fiz sozinho, do banco à tela. Modelei o Postgres no Supabase com acesso por cargo e montei o front em React, com design system próprio e tema claro e escuro.",
    role: "Desenvolvedor Full-stack (solo)",
    stack: ["React", "TypeScript", "Tailwind", "Supabase", "Vite"],
    github: null,
    demo: "https://praxis-oficial.vercel.app/",
    trailer: null,
    award: null,
    mx: 300, my: 415,
    color: {
      base: "rgba(20,184,166,0.95)",
      glow: "rgba(20,184,166,0.6)",
      bg: "rgba(20,184,166,0.12)",
      border: "rgba(45,212,191,0.4)",
      text: "rgba(153,246,228,0.95)",
      ping: "rgba(20,184,166,0.3)",
      hex: "#14b8a6",
      solid: "rgba(20,184,166,0.08)",
    },
  },
];

const LOCKED = [
  {
    id: "guts",
    name: "Guts",
    date: "??/11/2026",
    mx: 540, my: 430,
    hint: "Compartilhe suas experiências nos restaurantes favoritos do grupo",
    fullHint: "Registre quando você visitou um restaurante, compartilhe a experiência com seus amigos e acompanhe o histórico das visitas e avaliações do grupo.",
    classLevel: "ALPHA",
    stack: ["?", "?", "?"],
  },
];

type UnlockedProject = typeof UNLOCKED[number];
type LockedProject = typeof LOCKED[number];

const ISLAND_PATH = `
  M 110 330
  C  75 280,  65 220,  95 175
  C 120 138, 165 115, 215 100
  C 260  87, 295  70, 350  62
  C 400  55, 445  46, 495  58
  C 545  70, 575  92, 610 112
  C 648 133, 675 155, 698 182
  C 725 212, 730 246, 724 278
  C 718 308, 700 332, 688 358
  C 670 392, 664 420, 644 448
  C 620 480, 590 500, 556 516
  C 520 532, 482 540, 448 546
  C 410 552, 372 554, 334 549
  C 292 543, 252 526, 220 508
  C 184 488, 156 462, 138 432
  C 118 400, 116 368, 110 330 Z
`;

/* ── Per-project card effects ── */

// Limpattack: pixel fox walks across the card
function LimpattackEffect() {
  const [t, setT] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);
  useEffect(() => {
    let start: number;
    const tick = (ts: number) => { if (!start) start = ts; setT((ts - start) / 1000); rafRef.current = requestAnimationFrame(tick); };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current!);
  }, []);

  const speed = 22;
  const totalWidth = 260;
  const foxX = ((t * speed) % (totalWidth + 40)) - 20;
  const legPhase = t * 7;
  const bobY = Math.sin(t * 7) * 1.2;
  const tailWag = Math.sin(t * 5) * 8;

  // Pixel grid floor
  const floorTiles = Array.from({ length: 14 }, (_, i) => i);

  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 220 140">
      {/* Pixel grid bg */}
      {Array.from({ length: 28 }, (_, i) => (
        <rect key={i} x={(i % 7) * 32} y={Math.floor(i / 7) * 35} width="1" height="1" fill="rgba(251,191,36,0.06)" />
      ))}

      {/* Floor tiles */}
      {floorTiles.map(i => (
        <rect key={i} x={i * 16} y={108} width="15" height="6" fill={i % 2 === 0 ? "rgba(251,191,36,0.10)" : "rgba(251,191,36,0.05)"} />
      ))}
      <line x1="0" y1="108" x2="220" y2="108" stroke="rgba(251,191,36,0.2)" strokeWidth="1" />

      {/* Pixel fox */}
      <g transform={`translate(${foxX}, ${96 + bobY})`}>
        {/* Tail — behind body */}
        <g transform={`rotate(${tailWag}, -10, 0)`} style={{ transformOrigin: "-10px 0px" }}>
          {/* Tail base */}
          <rect x="-20" y="-4" width="10" height="6" fill="#c2410c" />
          {/* Tail tip (white) */}
          <rect x="-26" y="-5" width="8" height="8" fill="#fef3c7" />
          <rect x="-24" y="-7" width="4" height="3" fill="#fef3c7" />
        </g>

        {/* Body */}
        <rect x="-10" y="-10" width="22" height="12" fill="#fb923c" />
        {/* Belly */}
        <rect x="-4" y="-6" width="10" height="8" fill="#fde68a" />

        {/* Head */}
        <rect x="6" y="-18" width="16" height="14" fill="#fb923c" />
        {/* Ears */}
        <rect x="7" y="-24" width="5" height="8" fill="#fb923c" />
        <rect x="9" y="-22" width="3" height="5" fill="#fda4af" />
        <rect x="16" y="-24" width="5" height="8" fill="#fb923c" />
        <rect x="18" y="-22" width="3" height="5" fill="#fda4af" />
        {/* Face mask (white) */}
        <rect x="14" y="-12" width="9" height="8" fill="#fef3c7" />
        {/* Eye */}
        <rect x="8" y="-14" width="3" height="3" fill="#1c1917" />
        <rect x="9" y="-13" width="1" height="1" fill="white" />
        {/* Nose */}
        <rect x="20" y="-9" width="3" height="2" fill="#1c1917" />

        {/* Legs — animated */}
        {(() => {
          const l1 = Math.sin(legPhase) > 0 ? 4 : 0;
          const l2 = Math.sin(legPhase) > 0 ? 0 : 4;
          return (
            <>
              {/* Front legs */}
              <rect x="4" y="2" width="4" height={6 + l1} fill="#fb923c" />
              <rect x="10" y="2" width="4" height={6 + l2} fill="#c2410c" />
              {/* Back legs */}
              <rect x="-8" y="2" width="4" height={6 + l2} fill="#fb923c" />
              <rect x="-2" y="2" width="4" height={6 + l1} fill="#c2410c" />
              {/* Paws */}
              <rect x="3" y={8 + l1} width="6" height="3" fill="#1c1917" />
              <rect x="9" y={8 + l2} width="6" height="3" fill="#1c1917" />
              <rect x="-9" y={8 + l2} width="6" height="3" fill="#1c1917" />
              <rect x="-3" y={8 + l1} width="6" height="3" fill="#1c1917" />
            </>
          );
        })()}
      </g>

      {/* Dust puff when fox moves */}
      {[0, 1, 2].map(i => {
        const dustX = foxX - 8 - i * 7;
        const dustOpacity = Math.max(0, 0.35 - i * 0.12) * Math.abs(Math.sin(t * 7 + i));
        return (
          <g key={i} opacity={dustOpacity}>
            <rect x={dustX} y={107} width="5" height="3" fill="rgba(251,191,36,0.5)" />
            <rect x={dustX + 2} y={104} width="3" height="3" fill="rgba(251,191,36,0.3)" />
          </g>
        );
      })}

      {/* Stars in bg */}
      {[[20,18],[180,12],[100,8],[155,30],[45,35]].map(([sx,sy],i) => (
        <rect key={i} x={sx} y={sy} width="2" height="2"
          fill="rgba(251,191,36,0.4)"
          opacity={0.3 + 0.5 * Math.abs(Math.sin(t * 1.2 + i * 1.3))} />
      ))}
    </svg>
  );
}

// Benevo: pixel art crates being stacked and organized in a warehouse
function BenevoEffect() {
  const [t, setT] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);
  useEffect(() => {
    let start: number;
    const tick = (ts: number) => { if (!start) start = ts; setT((ts - start) / 1000); rafRef.current = requestAnimationFrame(tick); };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current!);
  }, []);

  // Worker walks left and right carrying a crate
  const cycleTime = 5.5;
  const phase = (t % cycleTime) / cycleTime;
  // 0-0.4: walk right (empty), 0.4-0.5: pick up, 0.5-0.9: walk left (carrying), 0.9-1.0: place
  const walkRight = phase < 0.4;
  const pickingUp = phase >= 0.4 && phase < 0.5;
  const walkLeft = phase >= 0.5 && phase < 0.9;
  const placing = phase >= 0.9;
  const carrying = walkLeft || placing;

  const finalWorkerX = walkRight
    ? 148 - (phase / 0.4) * 80
    : pickingUp
    ? 68
    : walkLeft
    ? 68 + ((phase - 0.5) / 0.4) * 80
    : 148;

  const legPhase = (walkRight || walkLeft) ? t * 6 : 0;
  const legSwing = Math.sin(legPhase) > 0;
  const bobY = (walkRight || walkLeft) ? Math.sin(legPhase) * 1 : 0;

  // How many crates are stacked (increases over time, resets)
  const stackCount = Math.min(3, Math.floor(t / cycleTime) % 4);

  // Crate colors cycling
  const crateColors = [
    { body: "rgba(59,130,246,0.85)", top: "rgba(96,165,250,0.9)", stripe: "rgba(147,197,253,0.4)" },
    { body: "rgba(37,99,235,0.85)", top: "rgba(59,130,246,0.9)", stripe: "rgba(96,165,250,0.4)" },
    { body: "rgba(29,78,216,0.85)", top: "rgba(37,99,235,0.9)", stripe: "rgba(59,130,246,0.4)" },
  ];

  const renderCrate = (cx: number, cy: number, colorIdx: number, key: string) => {
    const c = crateColors[colorIdx % crateColors.length];
    return (
      <g key={key} transform={`translate(${cx},${cy})`}>
        <rect x="-9" y="-10" width="18" height="10" fill={c.body} />
        <rect x="-9" y="-10" width="18" height="2" fill={c.top} />
        <rect x="-9" y="-10" width="1" height="10" fill={c.top} opacity={0.5} />
        <rect x="8" y="-10" width="1" height="10" fill="rgba(0,0,0,0.2)" />
        <rect x="-6" y="-7" width="12" height="1" fill={c.stripe} />
        <rect x="-6" y="-4" width="12" height="1" fill={c.stripe} />
        <rect x="0" y="-10" width="1" height="10" fill={c.stripe} opacity={0.6} />
      </g>
    );
  };

  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 220 140">
      {/* Grid floor */}
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={i * 18} y={108} width="17" height="6"
          fill={i % 2 === 0 ? "rgba(59,130,246,0.07)" : "rgba(59,130,246,0.04)"} />
      ))}
      <line x1="0" y1="108" x2="220" y2="108" stroke="rgba(59,130,246,0.25)" strokeWidth="1" />

      {/* Shelf on the left */}
      <rect x="8" y="60" width="52" height="3" fill="rgba(59,130,246,0.5)" />
      <rect x="8" y="82" width="52" height="3" fill="rgba(59,130,246,0.4)" />
      <rect x="8" y="60" width="3" height="48" fill="rgba(59,130,246,0.35)" />
      <rect x="57" y="60" width="3" height="48" fill="rgba(59,130,246,0.35)" />
      {/* Shelf bottom support */}
      <rect x="8" y="105" width="52" height="3" fill="rgba(59,130,246,0.3)" />

      {/* Fixed crates on shelf — top row */}
      {renderCrate(24, 78, 1, "shelf-t1")}
      {renderCrate(43, 78, 2, "shelf-t2")}
      {/* Fixed crates on shelf — bottom row (grows with stack) */}
      {stackCount >= 1 && renderCrate(24, 100, 0, "shelf-b1")}
      {stackCount >= 2 && renderCrate(43, 100, 1, "shelf-b2")}
      {stackCount >= 3 && renderCrate(33, 90, 2, "shelf-b3")}

      {/* Pickup zone — right side */}
      <rect x="148" y="95" width="55" height="3" fill="rgba(59,130,246,0.3)" />
      <rect x="148" y="95" width="3" height="13" fill="rgba(59,130,246,0.25)" />
      <rect x="200" y="95" width="3" height="13" fill="rgba(59,130,246,0.25)" />
      {/* Waiting crate on pickup zone */}
      {!placing && renderCrate(175, 95, stackCount % 3, "pickup")}

      {/* Pixel worker */}
      <g transform={`translate(${finalWorkerX}, ${96 + bobY})`}>
        {/* Carried crate above head */}
        {carrying && (
          <g transform="translate(0,-22)">
            {renderCrate(0, -4, stackCount % 3, "carried")}
          </g>
        )}
        {/* Head */}
        <rect x="-4" y="-20" width="8" height="7" fill="rgba(147,197,253,0.9)" />
        {/* Hair */}
        <rect x="-4" y="-20" width="8" height="2" fill="rgba(30,58,138,0.8)" />
        {/* Eyes */}
        <rect x={walkLeft || placing ? -2 : 1} y="-16" width="2" height="2" fill="rgba(10,10,40,0.9)" />
        {/* Body */}
        <rect x="-5" y="-13" width="10" height="9" fill="rgba(37,99,235,0.9)" />
        {/* Vest detail */}
        <rect x="-2" y="-13" width="4" height="9" fill="rgba(59,130,246,0.6)" />
        {/* Arms */}
        {carrying ? (
          <>
            <rect x="-8" y="-13" width="3" height="6" fill="rgba(147,197,253,0.8)" />
            <rect x="5" y="-13" width="3" height="6" fill="rgba(147,197,253,0.8)" />
          </>
        ) : (
          <>
            <rect x={legSwing ? -8 : 5} y="-12" width="3" height="5" fill="rgba(147,197,253,0.8)" />
            <rect x={legSwing ? 5 : -8} y="-12" width="3" height="5" fill="rgba(147,197,253,0.8)" />
          </>
        )}
        {/* Legs */}
        <rect x={legSwing ? -4 : 0} y="-4" width="3" height={6 + (legSwing ? 2 : 0)} fill="rgba(29,78,216,0.9)" />
        <rect x={legSwing ? 0 : -4} y="-4" width="3" height={6 + (!legSwing ? 2 : 0)} fill="rgba(29,78,216,0.9)" />
        {/* Boots */}
        <rect x={legSwing ? -5 : -1} y={2 + (legSwing ? 2 : 0)} width="5" height="2" fill="rgba(15,23,42,0.9)" />
        <rect x={legSwing ? -1 : -5} y={2 + (!legSwing ? 2 : 0)} width="5" height="2" fill="rgba(15,23,42,0.9)" />
      </g>

      {/* BG dots */}
      {[[20,15],[190,18],[110,10],[160,28],[55,32],[195,55],[15,65]].map(([sx,sy],i) => (
        <rect key={i} x={sx} y={sy} width="2" height="2"
          fill="rgba(59,130,246,0.3)"
          opacity={0.2 + 0.5 * Math.abs(Math.sin(t * 0.9 + i * 1.1))} />
      ))}

      {/* Status label */}
      <rect x="70" y="6" width="80" height="13" rx="3" fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.2)" strokeWidth="0.5" />
      <text x="110" y="16" textAnchor="middle" fill="rgba(147,197,253,0.6)" fontSize="7" fontFamily="monospace" letterSpacing="0.5">
        {carrying ? "TRANSPORTE EM CURSO" : placing ? "ARMAZENANDO..." : "AGUARDANDO CARGA"}
      </text>
    </svg>
  );
}

// Ponte: clean pixel bridge — solid arch, no suspension cables, person walking across
function PonteEffect() {
  const [t, setT] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);
  useEffect(() => {
    let start: number;
    const tick = (ts: number) => { if (!start) start = ts; setT((ts - start) / 1000); rafRef.current = requestAnimationFrame(tick); };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current!);
  }, []);

  const personX = 18 + ((t * 20) % 186);
  const legPhase = t * 6;
  const legSwing = Math.sin(legPhase) > 0;
  const bobY = Math.sin(legPhase) * 0.8;

  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 220 140">

      {/* Sky stars */}
      {[[18,14],[68,9],[118,16],[172,10],[200,22],[42,26],[148,20]].map(([sx,sy],i) => (
        <rect key={i} x={sx} y={sy} width="2" height="2"
          fill="rgba(249,115,22,0.35)"
          opacity={0.2 + 0.6 * Math.abs(Math.sin(t * 0.8 + i * 1.1))} />
      ))}

      {/* Water ripples */}
      {[0,1,2].map(row => (
        Array.from({ length: 10 }, (_, col) => (
          <rect key={`${row}-${col}`}
            x={col * 22 + (row % 2) * 11}
            y={118 + row * 6}
            width="18" height="4"
            fill={`rgba(59,130,246,${0.05 + 0.025 * Math.sin(t * 1.4 + col * 0.5 + row)})`} />
        ))
      ))}

      {/* Bridge arch — simple solid structure */}
      {/* Left bank */}
      <rect x="0" y="88" width="28" height="8" fill="rgba(249,115,22,0.9)" />
      <rect x="0" y="96" width="28" height="4" fill="rgba(194,65,12,0.8)" />
      <rect x="0" y="88" width="28" height="30" fill="rgba(180,60,10,0.3)" />

      {/* Right bank */}
      <rect x="192" y="88" width="28" height="8" fill="rgba(249,115,22,0.9)" />
      <rect x="192" y="96" width="28" height="4" fill="rgba(194,65,12,0.8)" />
      <rect x="192" y="88" width="28" height="30" fill="rgba(180,60,10,0.3)" />

      {/* Bridge deck — single clean span */}
      <rect x="20" y="88" width="180" height="8" fill="rgba(249,115,22,0.88)" />
      <rect x="20" y="96" width="180" height="3" fill="rgba(194,65,12,0.85)" />

      {/* Left pillar */}
      <rect x="24" y="52" width="12" height="38" fill="rgba(249,115,22,0.85)" />
      <rect x="22" y="50" width="16" height="5" fill="rgba(253,186,116,0.9)" />
      <rect x="26" y="46" width="8" height="6" fill="rgba(249,115,22,0.7)" />
      <rect x="28" y="43" width="4" height="4" fill="rgba(253,186,116,0.8)" />

      {/* Right pillar */}
      <rect x="184" y="52" width="12" height="38" fill="rgba(249,115,22,0.85)" />
      <rect x="182" y="50" width="16" height="5" fill="rgba(253,186,116,0.9)" />
      <rect x="186" y="46" width="8" height="6" fill="rgba(249,115,22,0.7)" />
      <rect x="188" y="43" width="4" height="4" fill="rgba(253,186,116,0.8)" />

      {/* Deck road markings */}
      {[50, 82, 114, 146].map(mx => (
        <rect key={mx} x={mx} y="90" width="14" height="2" fill="rgba(253,186,116,0.18)" />
      ))}

      {/* Guardrails — simple posts, no cables */}
      {[36, 60, 84, 108, 132, 156, 180].map(px => (
        <rect key={px} x={px} y="74" width="3" height="15" fill="rgba(249,115,22,0.45)" />
      ))}
      {/* Single top rail */}
      <line x1="36" y1="75" x2="182" y2="75" stroke="rgba(249,115,22,0.35)" strokeWidth="1.5" />

      {/* Pixel person walking */}
      <g transform={`translate(${personX}, ${80 + bobY})`}>
        {/* Head */}
        <rect x="-3" y="-12" width="6" height="6" fill="rgba(253,186,116,0.95)" />
        {/* Body */}
        <rect x="-3" y="-6" width="6" height="7" fill="rgba(249,115,22,0.9)" />
        {/* Legs */}
        <rect x={legSwing ? -3 : -1} y="1" width="2" height="5" fill="rgba(194,65,12,0.9)" />
        <rect x={legSwing ? 1 : -3} y="1" width="2" height="5" fill="rgba(194,65,12,0.9)" />
        {/* Arms */}
        <rect x={legSwing ? -6 : 3} y="-5" width="3" height="2" fill="rgba(253,186,116,0.85)" />
        <rect x={legSwing ? 3 : -6} y="-5" width="3" height="2" fill="rgba(253,186,116,0.85)" />
      </g>

    </svg>
  );
}

// Praxis: pixel knowledge graph — scattered doc-nodes wire up, a pulse runs the edges
function PraxisEffect() {
  const [t, setT] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);
  useEffect(() => {
    let start: number;
    const tick = (ts: number) => { if (!start) start = ts; setT((ts - start) / 1000); rafRef.current = requestAnimationFrame(tick); };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current!);
  }, []);

  const nodes = [
    { x: 34, y: 44 }, { x: 92, y: 30 }, { x: 150, y: 46 }, { x: 190, y: 78 },
    { x: 58, y: 82 }, { x: 116, y: 74 }, { x: 30, y: 112 }, { x: 150, y: 108 },
  ];
  const edges = [[0, 1], [1, 2], [2, 3], [0, 4], [4, 5], [1, 5], [5, 3], [4, 6], [5, 7], [6, 7]];

  const edgeDur = 0.42;
  const activeEdge = Math.floor(t / edgeDur) % edges.length;
  const prog = (t % edgeDur) / edgeDur;
  const [ea, eb] = edges[activeEdge];
  const na = nodes[ea], nb = nodes[eb];

  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 220 140" shapeRendering="crispEdges">
      {Array.from({ length: 24 }, (_, i) => (
        <rect key={i} x={(i % 8) * 28 + 6} y={Math.floor(i / 8) * 42 + 12} width="1" height="1" fill="rgba(20,184,166,0.14)" />
      ))}

      {edges.map(([a, b], i) => {
        const p = nodes[a], q = nodes[b];
        const on = i === activeEdge;
        return (
          <line key={i} x1={p.x} y1={p.y} x2={q.x} y2={q.y}
            stroke={on ? "rgba(94,234,212,0.75)" : "rgba(20,184,166,0.16)"} strokeWidth={on ? 1.5 : 1} />
        );
      })}

      <rect x={na.x + (nb.x - na.x) * prog - 1.5} y={na.y + (nb.y - na.y) * prog - 1.5} width="3" height="3" fill="rgba(204,251,241,0.95)" />

      {nodes.map((n, i) => {
        const hot = i === ea || i === eb;
        const pulse = 0.4 + 0.35 * Math.abs(Math.sin(t * 2 + i * 1.3));
        const c = hot ? "rgba(153,246,228,0.95)" : `rgba(45,212,191,${pulse.toFixed(2)})`;
        return (
          <g key={i}>
            <rect x={n.x - 4} y={n.y - 5} width="8" height="10" fill="rgba(3,16,14,0.92)" stroke={c} strokeWidth="1" />
            <rect x={n.x - 2} y={n.y - 3} width="4" height="1" fill={c} />
            <rect x={n.x - 2} y={n.y - 1} width="4" height="1" fill={c} />
            <rect x={n.x - 2} y={n.y + 1} width="3" height="1" fill={c} />
            {hot && <rect x={n.x - 7} y={n.y - 8} width="14" height="16" fill="none" stroke="rgba(45,212,191,0.3)" strokeWidth="1" />}
          </g>
        );
      })}

      <rect x="62" y="4" width="96" height="12" rx="2" fill="rgba(20,184,166,0.08)" stroke="rgba(20,184,166,0.2)" strokeWidth="0.5" />
      <text x="110" y="13" textAnchor="middle" fill="rgba(153,246,228,0.6)" fontSize="6.5" fontFamily="monospace" letterSpacing="0.5">
        CONECTANDO O CONHECIMENTO
      </text>
    </svg>
  );
}

// Kairos: pixel barbershop — the pole spins, the scissors snip, the chair frees up
function KairosEffect() {
  const [t, setT] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);
  useEffect(() => {
    let start: number;
    const tick = (ts: number) => { if (!start) start = ts; setT((ts - start) / 1000); rafRef.current = requestAnimationFrame(tick); };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current!);
  }, []);

  const gap = 1.5 + Math.max(0, Math.sin(t * 6)) * 3.5;
  const poleOffset = (t * 12) % 10;
  const done = Math.sin(t * 0.8) > 0.55;
  const G = "rgba(244,63,94,";
  const GL = "rgba(253,164,175,";

  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 220 140" shapeRendering="crispEdges">
      {[[24, 16], [188, 14], [150, 24], [40, 32], [198, 46], [14, 54]].map(([sx, sy], i) => (
        <rect key={i} x={sx} y={sy} width="2" height="2" fill={`${G}0.4)`} opacity={0.25 + 0.5 * Math.abs(Math.sin(t * 1.1 + i))} />
      ))}

      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={i * 18} y={112} width="17" height="5" fill={i % 2 === 0 ? `${G}0.10)` : `${G}0.05)`} />
      ))}
      <line x1="0" y1="112" x2="220" y2="112" stroke={`${G}0.25)`} strokeWidth="1" />

      {/* barber pole */}
      <rect x="18" y="44" width="11" height="5" fill={`${GL}0.9)`} />
      <rect x="18" y="88" width="11" height="5" fill={`${GL}0.9)`} />
      <rect x="19" y="49" width="9" height="39" fill="rgba(10,14,20,0.8)" />
      {Array.from({ length: 5 }, (_, i) => {
        const y = 49 + ((i * 10 + poleOffset) % 39);
        return <rect key={i} x="19" y={y} width="9" height="4" fill={`${G}0.85)`} />;
      })}
      <rect x="19" y="49" width="3" height="39" fill={`${GL}0.15)`} />

      {/* chair + client */}
      <g transform="translate(118,0)">
        <rect x="-14" y="98" width="28" height="6" fill={`${G}0.5)`} />
        <rect x="-4" y="88" width="8" height="12" fill={`${G}0.4)`} />
        <rect x="-16" y="80" width="32" height="9" fill={`${G}0.6)`} />
        <rect x="-16" y="48" width="7" height="33" fill={`${G}0.55)`} />
        <rect x="-7" y="60" width="19" height="20" fill={`${GL}0.8)`} />
        <rect x="-3" y="43" width="12" height="13" fill="rgba(232,202,172,0.92)" />
        <rect x="-4" y="39" width="14" height="5" fill="rgba(58,42,26,0.9)" />
      </g>

      {/* barber + scissors */}
      <g transform="translate(150,0)">
        <rect x="-4" y="62" width="12" height="20" fill={`${G}0.7)`} />
        <rect x="-2" y="48" width="10" height="12" fill="rgba(232,202,172,0.92)" />
        <rect x="-3" y="44" width="12" height="5" fill="rgba(30,22,14,0.9)" />
        <rect x="-16" y="60" width="13" height="3" fill="rgba(232,202,172,0.85)" />
        <g transform="translate(-22,60)">
          <rect x="0" y={-gap} width="11" height="1.5" fill={`${GL}0.95)`} />
          <rect x="0" y={gap} width="11" height="1.5" fill={`${GL}0.95)`} />
          <rect x="10" y={-gap - 1.5} width="2.5" height="3" fill={`${G}0.9)`} />
          <rect x="10" y={gap - 1.5} width="2.5" height="3" fill={`${G}0.9)`} />
        </g>
      </g>

      {[0, 1, 2, 3].map(i => {
        const fall = (t * 28 + i * 34) % 58;
        return <rect key={i} x={112 + i * 5} y={46 + fall} width="1.5" height="1.5" fill="rgba(58,42,26,0.7)" opacity={1 - fall / 58} />;
      })}

      {done && [[116, 40], [124, 33], [108, 36]].map(([sx, sy], i) => (
        <g key={i} opacity={0.5 + 0.4 * Math.sin(t * 8 + i)}>
          <rect x={sx} y={sy - 2} width="1.5" height="5" fill={`${GL}0.95)`} />
          <rect x={sx - 2} y={sy} width="5" height="1.5" fill={`${GL}0.95)`} />
        </g>
      ))}

      <rect x="64" y="4" width="92" height="12" rx="2" fill={`${G}0.08)`} stroke={`${G}0.2)`} strokeWidth="0.5" />
      <text x="110" y="13" textAnchor="middle" fill={`${GL}0.65)`} fontSize="6.5" fontFamily="monospace" letterSpacing="0.5">
        {done ? "CADEIRA LIVRE" : "CORTE EM ANDAMENTO"}
      </text>
    </svg>
  );
}

const CARD_EFFECTS: Record<string, React.FC> = {
  limpattack: LimpattackEffect,
  benevo: BenevoEffect,
  ponte: PonteEffect,
  praxis: PraxisEffect,
  kairos: KairosEffect,
};

/* ── Hover preview card for UNLOCKED ── */
function UnlockedHoverCard({ project, svgX, svgY, svgW, svgH, visible }: {
  project: UnlockedProject; svgX: number; svgY: number; svgW: number; svgH: number; visible: boolean;
}) {
  const c = project.color;
  const leftPct = (svgX / svgW) * 100;
  const topPct = (svgY / svgH) * 100;
  const flipLeft = leftPct > 55;
  const flipUp = topPct > 60;
  const Effect = CARD_EFFECTS[project.id];

  return (
    <div style={{
      position: "absolute",
      left: `${leftPct}%`, top: `${topPct}%`,
      transform: `translate(${flipLeft ? "calc(-100% - 14px)" : "22px"}, ${flipUp ? "calc(-100% + 14px)" : "-14px"})`,
      zIndex: 60, pointerEvents: "none",
      opacity: visible ? 1 : 0,
      scale: visible ? "1" : "0.86",
      transition: "opacity 0.2s ease, scale 0.2s cubic-bezier(0.34,1.56,0.64,1)",
      width: "230px",
    }}>
      {/* Connector dot */}
      <div style={{
        position: "absolute",
        [flipLeft ? "right" : "left"]: "-8px", top: "22px",
        width: "7px", height: "7px", borderRadius: "50%",
        background: c.base, boxShadow: `0 0 10px ${c.glow}`,
      }} />

      <div style={{
        background: "rgba(4,9,5,0.97)", border: `1px solid ${c.border}`,
        borderRadius: "14px", overflow: "hidden",
        boxShadow: `0 0 30px ${c.bg}, 0 8px 32px rgba(0,0,0,0.7)`,
        position: "relative",
      }}>
        {/* Per-project animated background */}
        {visible && Effect && (
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", borderRadius: "14px" }}>
            <Effect />
          </div>
        )}

        {/* Header */}
        <div style={{ padding: "10px 12px 8px", borderBottom: `1px solid ${c.solid}`, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: c.base, boxShadow: `0 0 7px ${c.glow}` }} />
              <span style={{ color: c.text, fontSize: "9px", letterSpacing: "1.5px", textTransform: "uppercase", opacity: 0.7, fontFamily: "monospace" }}>
                {project.period}
              </span>
            </div>
            {project.award && (
              <span style={{ fontSize: "9px", fontWeight: 700, padding: "1px 7px", borderRadius: "20px", background: c.bg, border: `1px solid ${c.border}`, color: c.text }}>
                {project.award}
              </span>
            )}
          </div>
        </div>

        <div style={{ padding: "10px 12px 12px", position: "relative" }}>
          <div style={{ color: "white", fontWeight: 800, fontSize: "15px", marginBottom: "6px" }}>{project.name}</div>
          <p style={{ color: "rgba(180,180,190,0.85)", fontSize: "10.5px", lineHeight: "1.55", marginBottom: "10px" }}>
            {project.shortDesc}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "8px" }}>
            {project.stack.map(s => (
              <span key={s} style={{ fontSize: "9px", padding: "2px 7px", borderRadius: "20px", fontWeight: 600, background: c.solid, border: `1px solid ${c.border}`, color: c.text }}>{s}</span>
            ))}
          </div>
          <div style={{ fontSize: "9px", color: c.text, opacity: 0.45, textAlign: "center", borderTop: `1px solid ${c.solid}`, paddingTop: "7px", fontFamily: "monospace", letterSpacing: "1px" }}>
            CLIQUE PARA VER DETALHES
          </div>
        </div>
      </div>
      <style>{`@keyframes hpFlicker { 0%,100%{opacity:0.5} 50%{opacity:0.9} }`}</style>
    </div>
  );
}

/* ── Full panel for UNLOCKED ── */
function UnlockedPanel({ project, onClose }: { project: UnlockedProject; onClose: () => void }) {
  const [show, setShow] = useState(false);
  const [tab, setTab] = useState<"sobre" | "stack">("sobre");
  const c = project.color;
  const Effect = CARD_EFFECTS[project.id];
  useEffect(() => { requestAnimationFrame(() => setShow(true)); }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "rgba(4,9,5,0.98)",
          border: `1px solid ${c.border}`,
          borderRadius: "20px",
          overflow: "hidden",
          width: "100%",
          maxWidth: "540px",
          boxShadow: `0 0 80px ${c.bg}, 0 0 160px ${c.solid}, 0 24px 64px rgba(0,0,0,0.8)`,
          transform: show ? "scale(1) translateY(0)" : "scale(0.9) translateY(30px)",
          opacity: show ? 1 : 0,
          transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
          position: "relative",
        }}
      >
        {/* Scanlines */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(34,197,94,0.012) 3px,rgba(34,197,94,0.012) 4px)", zIndex: 1 }} />

        {/* Per-project animated background — subtle, bottom half only */}
        {show && Effect && (
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "160px",
            pointerEvents: "none", overflow: "hidden", opacity: 0.38,
            maskImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 35%, black 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 35%, black 100%)",
            zIndex: 0,
          }}>
            <Effect />
          </div>
        )}

        {/* Top glow bar */}
        <div style={{ height: "3px", background: `linear-gradient(90deg, transparent, ${c.base}, ${c.glow}, ${c.base}, transparent)`, position: "relative", zIndex: 2 }} />

        {/* Header */}
        <div style={{ padding: "24px 28px 18px", borderBottom: `1px solid ${c.solid}`, position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: c.base, boxShadow: `0 0 10px ${c.glow}` }} />
                <span style={{ color: c.text, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", opacity: 0.65, fontFamily: "monospace" }}>{project.period}</span>
              </div>
              <h3 style={{ color: "white", fontWeight: 900, fontSize: "28px", letterSpacing: "-0.5px", lineHeight: 1.1, marginBottom: "8px" }}>{project.name}</h3>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {project.award && (
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: c.bg, border: `1px solid ${c.border}`, color: c.text }}>
                    {project.award}
                  </span>
                )}
                <span style={{ fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "20px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(200,200,210,0.7)", fontFamily: "monospace" }}>
                  {project.role}
                </span>
              </div>
            </div>
            <button onClick={onClose} style={{ color: "rgba(120,120,130,0.7)", fontSize: "20px", background: "none", border: "none", cursor: "pointer", paddingTop: "2px", lineHeight: 1 }}>✕</button>
          </div>

          {/* Tab switcher */}
          <div style={{ display: "flex", gap: "4px", marginTop: "18px" }}>
            {(["sobre", "stack"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "6px 16px", borderRadius: "8px", fontSize: "11px", fontWeight: 700,
                fontFamily: "monospace", letterSpacing: "1px", textTransform: "uppercase", border: "none", cursor: "pointer",
                background: tab === t ? c.bg : "transparent",
                color: tab === t ? c.text : "rgba(120,120,140,0.6)",
                borderBottom: tab === t ? `2px solid ${c.base}` : "2px solid transparent",
                transition: "all 0.2s ease",
              }}>{t}</button>
            ))}
          </div>
        </div>

        <div style={{ padding: "22px 28px 26px", minHeight: "180px", position: "relative", zIndex: 2 }}>
          {tab === "sobre" ? (
            <div>
              <p style={{ color: "rgba(200,200,210,0.9)", fontSize: "14px", lineHeight: "1.7", marginBottom: "20px" }}>
                {project.fullDesc}
              </p>

              {/* Action buttons row — GitHub (if public), Demo, and Trailer (if exists) all together */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "10px", fontSize: "12px", fontWeight: 600, textDecoration: "none", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#e4e4e7" }}>
                  <svg style={{ width: 14, height: 14 }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  GitHub
                </a>
                )}
                <a href={project.demo} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "10px", fontSize: "12px", fontWeight: 600, textDecoration: "none", background: c.bg, border: `1px solid ${c.border}`, color: c.text }}>
                  <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Ver Demo
                </a>

                {/* Pixel art RPG-style trailer button — Limpattack amber theme */}
                {project.trailer && (
                  <a
                    href={project.trailer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pixel-trailer-btn"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "7px",
                      padding: "7px 13px",
                      textDecoration: "none", position: "relative",
                      background: "rgba(120,60,0,0.85)",
                      color: "rgba(255,236,120,0.97)",
                      fontSize: "11px", fontWeight: 900,
                      fontFamily: "monospace", letterSpacing: "2px", textTransform: "uppercase",
                      imageRendering: "pixelated",
                      /* pixel-corner border via box-shadow layering */
                      outline: "2px solid rgba(251,191,36,0.9)",
                      outlineOffset: "-2px",
                      boxShadow: [
                        /* outer dark pixel shadow — offset L shape */
                        "4px 4px 0px 0px rgba(60,20,0,0.95)",
                        /* inner top-left highlight */
                        "inset 2px 2px 0px 0px rgba(255,220,80,0.25)",
                        /* inner bottom-right shadow */
                        "inset -2px -2px 0px 0px rgba(0,0,0,0.4)",
                        /* amber glow */
                        "0 0 14px rgba(251,191,36,0.2)",
                      ].join(","),
                      borderRadius: 0,
                      cursor: "pointer",
                    }}
                  >
                    {/* Scanline texture */}
                    <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 1px,rgba(0,0,0,0.18) 1px,rgba(0,0,0,0.18) 2px)", pointerEvents: "none" }} />
                    {/* Pixel play icon — chunky L-staircase triangle */}
                    <svg style={{ width: 12, height: 12, imageRendering: "pixelated", flexShrink: 0, position: "relative" }} viewBox="0 0 6 6" shapeRendering="crispEdges" fill="rgba(255,236,120,0.97)">
                      <rect x="0" y="0" width="2" height="6" />
                      <rect x="2" y="1" width="2" height="4" />
                      <rect x="4" y="2" width="2" height="2" />
                    </svg>
                    <span style={{ position: "relative" }}>TRAILER</span>
                    {/* Corner pixel accents — top-left & bottom-right */}
                    <span style={{ position: "absolute", top: -2, left: -2, width: 4, height: 4, background: "rgba(251,191,36,0.9)" }} />
                    <span style={{ position: "absolute", bottom: -2, right: -2, width: 4, height: 4, background: "rgba(251,191,36,0.9)" }} />
                    <span style={{ position: "absolute", top: -2, right: -2, width: 4, height: 4, background: "rgba(60,20,0,0.9)" }} />
                    <span style={{ position: "absolute", bottom: -2, left: -2, width: 4, height: 4, background: "rgba(60,20,0,0.9)" }} />
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div>
              <p style={{ color: "rgba(120,130,140,0.7)", fontSize: "11px", fontFamily: "monospace", letterSpacing: "1px", marginBottom: "14px", textTransform: "uppercase" }}>Tecnologias utilizadas</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {project.stack.map((s, i) => (
                  <div key={s} style={{
                    padding: "10px 18px", borderRadius: "12px", fontSize: "13px", fontWeight: 700,
                    background: c.bg, border: `1px solid ${c.border}`, color: c.text,
                    boxShadow: `0 0 20px ${c.solid}`,
                    animation: `stackPop 0.3s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.07}s both`,
                  }}>{s}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes stackPop { from { opacity:0; transform:scale(0.7) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
        .pixel-trailer-btn:hover {
          transform: translate(2px, 2px);
          box-shadow:
            2px 2px 0px 0px rgba(60,20,0,0.95),
            inset 2px 2px 0px 0px rgba(255,220,80,0.25),
            inset -2px -2px 0px 0px rgba(0,0,0,0.4),
            0 0 20px rgba(251,191,36,0.35) !important;
        }
        .pixel-trailer-btn:active {
          transform: translate(4px, 4px);
          box-shadow: 0px 0px 0px 0px rgba(60,20,0,0.95), inset 2px 2px 0px 0px rgba(0,0,0,0.3) !important;
        }
      `}</style>
    </div>
  );
}

/* ── Hover preview card for LOCKED ── */
function LockedHoverCard({ locked, svgX, svgY, svgW, svgH, visible }: {
  locked: LockedProject; svgX: number; svgY: number; svgW: number; svgH: number; visible: boolean;
}) {
  const [glitch, setGlitch] = useState(false);
  const [scanPos, setScanPos] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!visible) { setGlitch(false); return; }
    const t1 = setTimeout(() => setGlitch(true), 80);
    const t2 = setTimeout(() => setGlitch(false), 200);
    const t3 = setTimeout(() => setGlitch(true), 320);
    const t4 = setTimeout(() => setGlitch(false), 420);
    let start: number;
    const animate = (ts: number) => {
      if (!start) start = ts;
      setScanPos(((ts - start) % 1800) / 1800);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [visible]);

  const leftPct = (svgX / svgW) * 100;
  const topPct = (svgY / svgH) * 100;
  const flipLeft = leftPct > 55;
  const flipUp = topPct > 60;
  const gx = glitch ? (Math.random() * 5 - 2.5) : 0;
  const gy = glitch ? (Math.random() * 3 - 1.5) : 0;

  return (
    <div style={{
      position: "absolute",
      left: `${leftPct}%`, top: `${topPct}%`,
      transform: `translate(${flipLeft ? "calc(-100% - 14px)" : "22px"}, ${flipUp ? "calc(-100% + 14px)" : "-14px"})`,
      zIndex: 60, pointerEvents: "none",
      opacity: visible ? 1 : 0,
      scale: visible ? "1" : "0.85",
      transition: "opacity 0.3s ease, scale 0.3s cubic-bezier(0.34,1.56,0.64,1)",
      width: "200px",
    }}>
      <div style={{
        background: "rgba(3,3,18,0.98)", border: "1px solid rgba(100,80,200,0.5)",
        borderRadius: "12px", overflow: "hidden",
        boxShadow: "0 0 40px rgba(80,60,180,0.35), 0 0 80px rgba(60,40,150,0.15), 0 8px 32px rgba(0,0,0,0.8)",
        transform: `translate(${gx}px,${gy}px)`, transition: glitch ? "none" : "transform 0.1s ease", position: "relative",
      }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", borderRadius: "12px", zIndex: 10 }}>
          <div style={{ position: "absolute", left: 0, right: 0, height: "2px", top: `${scanPos * 100}%`, background: "linear-gradient(90deg,transparent,rgba(120,100,255,0.6),rgba(180,160,255,0.8),rgba(120,100,255,0.6),transparent)", boxShadow: "0 0 12px rgba(140,120,255,0.6)" }} />
          <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(100,80,200,0.04) 2px,rgba(100,80,200,0.04) 3px)" }} />
        </div>
        <div style={{ padding: "10px 12px", borderBottom: "1px solid rgba(80,60,180,0.25)", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "13px" }}>🔒</span>
          <div>
            <div style={{ color: "rgba(160,140,255,0.9)", fontSize: "11px", fontWeight: 800, letterSpacing: "1px", fontFamily: "monospace" }}>{locked.name}</div>
            <div style={{ color: "rgba(100,80,200,0.6)", fontSize: "8px", fontFamily: "monospace" }}>PROJETO CLASSIFICADO</div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "rgba(239,68,68,0.9)", boxShadow: "0 0 6px rgba(239,68,68,0.8)", animation: "redPulse 1s ease-in-out infinite" }} />
          </div>
        </div>
        <div style={{ padding: "12px" }}>
          <div style={{ background: "rgba(80,60,180,0.08)", border: "1px solid rgba(100,80,200,0.2)", borderRadius: "6px", padding: "8px 10px", marginBottom: "10px" }}>
            <div style={{ fontSize: "8px", color: "rgba(120,100,200,0.6)", fontFamily: "monospace", letterSpacing: "1px", marginBottom: "4px" }}>// PISTA DECODIFICADA</div>
            <p style={{ color: "rgba(180,160,255,0.85)", fontSize: "10px", fontStyle: "italic", lineHeight: "1.5", fontFamily: "serif" }}>"{locked.hint}"</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(80,60,180,0.2)", paddingTop: "9px" }}>
            <span style={{ fontSize: "8px", color: "rgba(100,80,200,0.5)", fontFamily: "monospace" }}>LIBERAÇÃO PREVISTA</span>
            <span style={{ fontSize: "10px", fontWeight: 700, fontFamily: "monospace", color: "rgba(160,140,255,0.9)", textShadow: "0 0 8px rgba(140,120,255,0.5)" }}>{locked.date}</span>
          </div>
          <div style={{ marginTop: "8px", textAlign: "center", fontSize: "9px", color: "rgba(140,120,255,0.45)", fontFamily: "monospace", letterSpacing: "0.5px" }}>CLIQUE PARA REVELAR MAIS</div>
        </div>
      </div>
    </div>
  );
}

/* ── Full panel for LOCKED ── */
function LockedPanel({ locked, onClose }: { locked: LockedProject; onClose: () => void }) {
  const [show, setShow] = useState(false);
  const [scanPos, setScanPos] = useState(0);
  const [glitch, setGlitch] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    requestAnimationFrame(() => setShow(true));
    // Entry glitch burst
    const t1 = setTimeout(() => setGlitch(true), 100);
    const t2 = setTimeout(() => setGlitch(false), 220);
    const t3 = setTimeout(() => setGlitch(true), 380);
    const t4 = setTimeout(() => setGlitch(false), 480);
    // Scan line
    let start: number;
    const animate = (ts: number) => {
      if (!start) start = ts;
      setScanPos(((ts - start) % 2400) / 2400);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const gx = glitch ? (Math.random() * 8 - 4) : 0;
  const gy = glitch ? (Math.random() * 4 - 2) : 0;

  const classColors: Record<string, string> = {
    ALPHA: "rgba(251,191,36,0.9)",
    BETA: "rgba(34,197,94,0.9)",
    OMEGA: "rgba(239,68,68,0.9)",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(10px)" }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "rgba(4,4,22,0.99)",
          border: "1px solid rgba(120,100,220,0.5)",
          borderRadius: "20px",
          overflow: "hidden",
          width: "100%",
          maxWidth: "500px",
          boxShadow: "0 0 80px rgba(80,60,200,0.3), 0 0 160px rgba(60,40,160,0.15), 0 24px 64px rgba(0,0,0,0.9)",
          transform: show ? `scale(1) translateY(0) translate(${gx}px,${gy}px)` : "scale(0.88) translateY(30px)",
          opacity: show ? 1 : 0,
          transition: glitch ? "none" : "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
          position: "relative",
        }}
      >
        {/* Scan sweep */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", borderRadius: "20px", zIndex: 5 }}>
          <div style={{
            position: "absolute", left: 0, right: 0, height: "3px",
            top: `${scanPos * 100}%`,
            background: "linear-gradient(90deg,transparent,rgba(120,100,255,0.5),rgba(200,180,255,0.9),rgba(120,100,255,0.5),transparent)",
            boxShadow: "0 0 16px rgba(160,140,255,0.7)",
          }} />
          <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(100,80,200,0.035) 2px,rgba(100,80,200,0.035) 3px)" }} />
        </div>

        {/* Top accent bar */}
        <div style={{ height: "3px", background: "linear-gradient(90deg,transparent,rgba(120,100,255,0.8),rgba(200,160,255,1),rgba(120,100,255,0.8),transparent)", position: "relative", zIndex: 6 }} />

        {/* Header */}
        <div style={{ padding: "24px 28px 18px", borderBottom: "1px solid rgba(80,60,200,0.2)", position: "relative", zIndex: 6 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span style={{ fontSize: "18px" }}>🔒</span>
                <span style={{ fontSize: "9px", fontFamily: "monospace", letterSpacing: "2px", color: "rgba(120,100,200,0.6)", textTransform: "uppercase" }}>PROJETO CLASSIFICADO</span>
                <span style={{
                  fontSize: "9px", fontWeight: 800, padding: "1px 8px", borderRadius: "20px",
                  background: "rgba(0,0,0,0.5)",
                  border: `1px solid ${classColors[locked.classLevel] || "rgba(120,100,200,0.5)"}`,
                  color: classColors[locked.classLevel] || "rgba(180,160,255,0.9)",
                  fontFamily: "monospace",
                }}>
                  {locked.classLevel}
                </span>
              </div>
              <h3 style={{ color: "rgba(200,180,255,0.95)", fontWeight: 900, fontSize: "32px", letterSpacing: "-0.5px", fontFamily: "monospace" }}>
                {locked.name}
              </h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
              <button onClick={onClose} style={{ color: "rgba(120,120,130,0.6)", fontSize: "18px", background: "none", border: "none", cursor: "pointer" }}>✕</button>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "rgba(239,68,68,0.9)", boxShadow: "0 0 6px rgba(239,68,68,0.8)", animation: "redPulse 1s ease-in-out infinite" }} />
                <span style={{ fontSize: "8px", color: "rgba(239,68,68,0.7)", fontFamily: "monospace" }}>ACESSO RESTRITO</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: "22px 28px 26px", position: "relative", zIndex: 6 }}>
          {/* Redacted block that reveals on click */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "10px", color: "rgba(120,100,200,0.55)", fontFamily: "monospace", letterSpacing: "1px", marginBottom: "10px", textTransform: "uppercase" }}>
              // Descrição do projeto
            </div>
            {!revealed ? (
              <div
                onClick={() => setRevealed(true)}
                style={{ cursor: "pointer", position: "relative", padding: "14px 16px", borderRadius: "10px", border: "1px dashed rgba(100,80,200,0.35)", background: "rgba(80,60,180,0.06)" }}
              >
                {/* Fake redacted lines */}
                {[95, 88, 100, 72, 85, 60].map((w, i) => (
                  <div key={i} style={{ height: "10px", width: `${w}%`, borderRadius: "3px", marginBottom: "6px", background: "rgba(80,60,180,0.45)", overflow: "hidden", position: "relative" }}>
                    <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg,transparent,transparent 5px,rgba(0,0,0,0.35) 5px,rgba(0,0,0,0.35) 6px)" }} />
                  </div>
                ))}
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px", background: "rgba(4,4,22,0.5)", backdropFilter: "blur(2px)" }}>
                  <span style={{ fontSize: "11px", color: "rgba(160,140,255,0.8)", fontFamily: "monospace", letterSpacing: "1.5px" }}>🔓 CLIQUE PARA DECIFRAR</span>
                </div>
              </div>
            ) : (
              <p style={{ color: "rgba(190,180,255,0.85)", fontSize: "13.5px", lineHeight: "1.7", animation: "fadeIn 0.5s ease" }}>
                {locked.fullHint}
              </p>
            )}
          </div>

          {/* Pista */}
          <div style={{ background: "rgba(80,60,180,0.08)", border: "1px solid rgba(100,80,200,0.22)", borderRadius: "10px", padding: "12px 14px", marginBottom: "20px" }}>
            <div style={{ fontSize: "8px", color: "rgba(120,100,200,0.5)", fontFamily: "monospace", letterSpacing: "1px", marginBottom: "5px" }}>// TRANSMISSÃO INTERCEPTADA</div>
            <p style={{ color: "rgba(180,160,255,0.85)", fontSize: "13px", fontStyle: "italic", lineHeight: "1.6", fontFamily: "serif" }}>"{locked.hint}"</p>
          </div>

          {/* Stack (hidden) */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "10px", color: "rgba(120,100,200,0.55)", fontFamily: "monospace", letterSpacing: "1px", marginBottom: "10px", textTransform: "uppercase" }}>// Stack [REDACTED]</div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {locked.stack.map((s, i) => (
                <div key={i} style={{ padding: "8px 16px", borderRadius: "10px", fontSize: "13px", fontWeight: 700, background: "rgba(80,60,180,0.15)", border: "1px solid rgba(100,80,200,0.25)", color: "rgba(120,100,200,0.5)", fontFamily: "monospace", letterSpacing: "2px" }}>
                  {s.repeat(3)}
                </div>
              ))}
            </div>
          </div>

          {/* Release */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(80,60,180,0.2)", paddingTop: "16px" }}>
            <div>
              <div style={{ fontSize: "8px", color: "rgba(100,80,200,0.5)", fontFamily: "monospace", letterSpacing: "1px", marginBottom: "3px" }}>TRANSMISSÃO PREVISTA</div>
              <div style={{ fontSize: "20px", fontWeight: 800, fontFamily: "monospace", color: "rgba(180,160,255,0.95)", textShadow: "0 0 20px rgba(160,140,255,0.5)" }}>{locked.date}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "8px", color: "rgba(100,80,200,0.5)", fontFamily: "monospace", letterSpacing: "1px", marginBottom: "3px" }}>NÍVEL</div>
              <div style={{ fontSize: "20px", fontWeight: 800, fontFamily: "monospace", color: classColors[locked.classLevel] || "rgba(180,160,255,0.9)", textShadow: `0 0 20px ${classColors[locked.classLevel] || "rgba(160,140,255,0.5)"}` }}>{locked.classLevel}</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(4px); } to { opacity:1; transform:translateY(0); } }
        @keyframes redPulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
      `}</style>
    </div>
  );
}

/* ── Map ── */
function IslandMap() {
  const [selectedUnlocked, setSelectedUnlocked] = useState<UnlockedProject | null>(null);
  const [selectedLocked, setSelectedLocked] = useState<LockedProject | null>(null);
  const [hoveredUnlocked, setHoveredUnlocked] = useState<string | null>(null);
  const [hoveredLocked, setHoveredLocked] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const VW = 800, VH = 600;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640 || "ontouchstart" in window);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Mobile: zoom into island, crop outer water
  const viewBox = isMobile ? "60 70 680 480" : `0 0 ${VW} ${VH}`;

  return (
    <div className="relative w-full" style={{ maxWidth: 800, margin: "0 auto" }}>
      {/* Hover cards — desktop only */}
      {!isMobile && UNLOCKED.map(p => (
        <UnlockedHoverCard key={p.id} project={p} svgX={p.mx} svgY={p.my} svgW={VW} svgH={VH} visible={hoveredUnlocked === p.id && selectedUnlocked === null} />
      ))}
      {!isMobile && LOCKED.map(lk => (
        <LockedHoverCard key={lk.id} locked={lk} svgX={lk.mx} svgY={lk.my} svgW={VW} svgH={VH} visible={hoveredLocked === lk.id && selectedLocked === null} />
      ))}

      <svg
        viewBox={viewBox}
        className="w-full"
        style={{
          filter: "drop-shadow(0 0 40px rgba(34,197,94,0.08))",
          minHeight: isMobile ? "340px" : undefined,
        }}
      >
        <defs>
          <pattern id="waterGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(6,182,212,0.06)" strokeWidth="0.5" />
          </pattern>
          <radialGradient id="islandGrad" cx="45%" cy="42%" r="55%">
            <stop offset="0%" stopColor="rgba(30,50,30,0.95)" />
            <stop offset="40%" stopColor="rgba(18,32,20,0.98)" />
            <stop offset="100%" stopColor="rgba(8,15,10,1)" />
          </radialGradient>
          <radialGradient id="islandGlow" cx="45%" cy="42%" r="55%">
            <stop offset="0%" stopColor="rgba(34,197,94,0.06)" />
            <stop offset="100%" stopColor="rgba(34,197,94,0)" />
          </radialGradient>
          <radialGradient id="fogGrad0" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(40,40,80,0.95)" />
            <stop offset="60%" stopColor="rgba(20,20,50,0.85)" />
            <stop offset="100%" stopColor="rgba(10,10,30,0)" />
          </radialGradient>
          <radialGradient id="fogGrad1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(35,35,75,0.92)" />
            <stop offset="60%" stopColor="rgba(18,18,48,0.82)" />
            <stop offset="100%" stopColor="rgba(8,8,28,0)" />
          </radialGradient>
          <radialGradient id="fogGrad2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(45,40,85,0.93)" />
            <stop offset="60%" stopColor="rgba(22,18,52,0.83)" />
            <stop offset="100%" stopColor="rgba(10,8,32,0)" />
          </radialGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="strongGlow"><feGaussianBlur stdDeviation="6" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>

        <rect width="800" height="600" fill="url(#waterGrid)" />
        {[80,160,240,320,400,480,560].map((y, i) => (
          <line key={i} x1="0" y1={y} x2="800" y2={y} stroke="rgba(6,182,212,0.04)" strokeWidth="1" strokeDasharray="20 60"
            style={{ animation: `shimmer ${3 + i * 0.4}s linear infinite`, animationDelay: `${i * 0.3}s` }} />
        ))}

        <path d={ISLAND_PATH} fill="rgba(0,0,0,0.5)" transform="translate(6,8)" />
        <path d={ISLAND_PATH} fill="url(#islandGrad)" />
        <path d={ISLAND_PATH} fill="url(#islandGlow)" />
        <path d={ISLAND_PATH} fill="none" stroke="rgba(34,197,94,0.25)" strokeWidth="1.5" />
        <path d={ISLAND_PATH} fill="none" stroke="rgba(6,182,212,0.12)" strokeWidth="4" strokeDasharray="8 16" />

        {["M 180 220 Q 290 195 400 210 Q 510 225 615 215","M 160 278 Q 280 258 400 270 Q 520 282 635 272","M 162 335 Q 285 318 405 328 Q 525 338 632 330","M 185 388 Q 300 375 415 383 Q 530 390 622 382","M 215 438 Q 330 428 440 434 Q 548 440 603 433"].map((d, i) => (
          <path key={i} d={d} fill="none" stroke="rgba(34,197,94,0.07)" strokeWidth="1" />
        ))}

        {/* Fog for locked */}
        {LOCKED.map((lk, i) => {
          const isH = hoveredLocked === lk.id;
          return (
            <g key={lk.id}>
              <ellipse cx={lk.mx} cy={lk.my} rx={isH ? 40 : 70} ry={isH ? 28 : 48} fill={`url(#fogGrad${i})`} style={{ transition: "all 0.6s ease", filter: "blur(1px)", opacity: isH ? 0.4 : 1 }} />
              <ellipse cx={lk.mx - 15} cy={lk.my + 8} rx={isH ? 22 : 40} ry={isH ? 15 : 28} fill={`url(#fogGrad${i})`} opacity={isH ? 0.2 : 0.7} style={{ filter: "blur(3px)", transition: "all 0.6s ease", animation: `fogDrift 5s ease-in-out infinite`, animationDelay: `${i * 1.2}s` }} />
              <ellipse cx={lk.mx + 12} cy={lk.my - 10} rx={isH ? 18 : 35} ry={isH ? 12 : 22} fill={`url(#fogGrad${i})`} opacity={isH ? 0.15 : 0.6} style={{ filter: "blur(2px)", transition: "all 0.6s ease", animation: `fogDrift 7s ease-in-out infinite reverse`, animationDelay: `${i * 0.8}s` }} />
              {isH && (
                <g>
                  <line x1={lk.mx - 8} y1={lk.my - 20} x2={lk.mx + 4} y2={lk.my + 5} stroke="rgba(160,140,255,0.6)" strokeWidth="1.5" style={{ filter: "drop-shadow(0 0 4px rgba(140,120,255,0.8))" }} />
                  <line x1={lk.mx + 4} y1={lk.my + 5} x2={lk.mx - 3} y2={lk.my + 22} stroke="rgba(160,140,255,0.4)" strokeWidth="1" />
                  <line x1={lk.mx + 4} y1={lk.my + 5} x2={lk.mx + 14} y2={lk.my + 18} stroke="rgba(160,140,255,0.35)" strokeWidth="0.8" />
                </g>
              )}
            </g>
          );
        })}

        {/* Unlocked markers */}
        {UNLOCKED.map((p, idx) => {
          const c = p.color;
          const isH = hoveredUnlocked === p.id;
          return (
            <g key={p.id} style={{ cursor: "pointer" }}
              onClick={() => setSelectedUnlocked(p)}
              onMouseEnter={() => { if (!isMobile) setHoveredUnlocked(p.id); }}
              onMouseLeave={() => { if (!isMobile) setHoveredUnlocked(null); }}
            >
              <circle cx={p.mx} cy={p.my} r={isH ? 30 : 22} fill="none" stroke={c.ping} strokeWidth="1" style={{ animation: `ping 2s ease-out infinite`, animationDelay: `${idx * 0.6}s`, transition: "r 0.3s ease" }} />
              {isH && <circle cx={p.mx} cy={p.my} r={42} fill="none" stroke={c.ping} strokeWidth="0.5" style={{ animation: `ping 1.5s ease-out infinite` }} />}
              <circle cx={p.mx} cy={p.my} r={isH ? 17 : 14} fill={c.bg} stroke={c.glow} strokeWidth={isH ? 2 : 1.5} filter="url(#glow)" style={{ transition: "all 0.25s ease" }} />
              <circle cx={p.mx} cy={p.my} r={isH ? 6 : 5} fill={c.base} filter={isH ? "url(#strongGlow)" : "url(#glow)"} style={{ transition: "all 0.25s ease" }} />
              <rect x={p.mx - 34} y={p.my - 36} width={68} height={18} rx={9} fill="rgba(6,12,6,0.88)" stroke={isH ? c.border : "rgba(34,197,94,0.2)"} strokeWidth="1" style={{ transition: "stroke 0.2s ease" }} />
              <text x={p.mx} y={p.my - 23} textAnchor="middle" dominantBaseline="middle" fill={c.text} fontSize="10" fontWeight="700" fontFamily="monospace" letterSpacing="0.5">{p.name}</text>
              <line x1={p.mx} y1={p.my - 18} x2={p.mx} y2={p.my - 14} stroke={c.border} strokeWidth="1" />
            </g>
          );
        })}

        {/* Locked markers */}
        {LOCKED.map((lk, i) => {
          const isH = hoveredLocked === lk.id;
          return (
            <g key={lk.id} style={{ cursor: "pointer" }}
              onMouseEnter={() => { if (!isMobile) setHoveredLocked(lk.id); }}
              onMouseLeave={() => { if (!isMobile) setHoveredLocked(null); }}
              onClick={() => setSelectedLocked(lk)}
            >
              <circle cx={lk.mx} cy={lk.my} r={16} fill={isH ? "rgba(60,50,120,0.85)" : "rgba(40,40,80,0.7)"} stroke={isH ? "rgba(140,120,255,0.8)" : "rgba(80,80,140,0.4)"} strokeWidth="1.5" style={{ transition: "all 0.3s", filter: isH ? "drop-shadow(0 0 10px rgba(120,100,255,0.6))" : "none" }} />
              <circle cx={lk.mx} cy={lk.my} r={isH ? 30 : 24} fill="none" stroke={isH ? "rgba(140,120,255,0.35)" : "rgba(100,100,180,0.25)"} strokeWidth="1" style={{ animation: `ping 2.5s ease-out infinite`, animationDelay: `${i * 0.7}s`, transition: "all 0.3s" }} />
              <text x={lk.mx} y={lk.my + 1} textAnchor="middle" dominantBaseline="middle" fontSize="12" fill={isH ? "rgba(200,180,255,0.95)" : "rgba(150,150,220,0.8)"}>🔒</text>
            </g>
          );
        })}

        <text x="400" y="582" textAnchor="middle" fill="rgba(34,197,94,0.3)" fontSize="11" fontFamily="monospace" letterSpacing="4" fontWeight="600">ILHA DOS PROJETOS</text>
      </svg>

      {selectedUnlocked && <UnlockedPanel project={selectedUnlocked} onClose={() => setSelectedUnlocked(null)} />}
      {selectedLocked && <LockedPanel locked={selectedLocked} onClose={() => setSelectedLocked(null)} />}

      <style>{`
        @keyframes ping { 0% { transform-origin:center; transform:scale(1); opacity:0.8; } 100% { transform-origin:center; transform:scale(2.2); opacity:0; } }
        @keyframes fogDrift { 0%,100% { transform:translate(0,0); } 50% { transform:translate(8px,-6px); } }
        @keyframes shimmer { 0% { stroke-dashoffset:0; } 100% { stroke-dashoffset:-80; } }
        @keyframes redPulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
      `}</style>
    </div>
  );
}

function Projects() {
  return (
    <section id="projects" className="relative min-h-screen flex flex-col items-center justify-center px-4 py-24">

      <div className="relative z-10 text-center mb-12">
        <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400 bg-clip-text text-transparent">
          <span className="text-emerald-400/40 font-light">&lt;</span>{" "}Projetos{" "}<span className="text-emerald-400/40 font-light">/&gt;</span>
        </h2>
        <p className="mt-4 text-sm tracking-widest text-emerald-500/40 uppercase">— explore o território —</p>
        <p className="mt-2 text-sm text-zinc-500 hidden md:block">Passe o mouse nos marcadores · Áreas com névoa guardam segredos</p>
        <p className="mt-2 text-sm text-zinc-500 md:hidden">Toque nos marcadores · Áreas com névoa guardam segredos</p>
      </div>
      <div className="relative z-10 w-full max-w-3xl"><IslandMap /></div>
    </section>
  );
}

export default Projects;
