import { useEffect, useRef, useState } from "react";

/* ── Data ── */
interface UnlockedProjectData {
  id: string;
  name: string;
  period: string;
  shortDesc: string;
  fullDesc: string;
  role: string;
  stack: string[];
  github: string | null;
  demo: string | null;
  trailer: string | null;
  award: string | null;
  mx: number;
  my: number;
  color: {
    base: string;
    glow: string;
    bg: string;
    border: string;
    text: string;
    ping: string;
    hex: string;
    solid: string;
  };
}

/* Paleta no formato usado pelos marcadores, a partir de uma cor base (r, g, b) e de uma cor clara para o texto. */
function palette(r: number, g: number, b: number, tr: number, tg: number, tb: number, hex: string) {
  return {
    base: `rgba(${r},${g},${b},0.95)`,
    glow: `rgba(${r},${g},${b},0.6)`,
    bg: `rgba(${r},${g},${b},0.12)`,
    border: `rgba(${r},${g},${b},0.4)`,
    text: `rgba(${tr},${tg},${tb},0.95)`,
    ping: `rgba(${r},${g},${b},0.3)`,
    hex,
    solid: `rgba(${r},${g},${b},0.08)`,
  };
}

const UNLOCKED: UnlockedProjectData[] = [
  {
    id: "kairos",
    name: "Kairos",
    period: "Jun 2026 – Set 2026",
    shortDesc: "Agendamento pra barbearias: o cliente marca sozinho pelo link e o dono vê agenda, equipe e faturamento num painel.",
    fullDesc: "Cada barbearia ganha um link próprio pra botar na bio. O cliente escolhe serviço, barbeiro e horário sozinho, e o dono acompanha agenda, equipe e faturamento num painel só. Fiz sozinho, do banco ao deploy, em Next.js e Supabase: cada barbearia fica isolada no Postgres com Row Level Security, a agenda atualiza em tempo real, o app instala como PWA e os e-mails de confirmação e lembrete saem automáticos pela Resend.",
    role: "Desenvolvedor Full-stack (solo)",
    stack: ["Next.js", "React", "TypeScript", "Tailwind", "Supabase", "Resend"],
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
    period: "Mai 2026 – Jul 2026",
    shortDesc: "Gestão do conhecimento: documentos, procedimentos e avisos da equipe num lugar só. Nasceu no meu trabalho.",
    fullDesc: "Nasceu de um problema que vi no meu trabalho no Grupo ACLF: documentos e procedimentos espalhados e sem padrão. Juntei tudo num lugar só: documentos versionados, procedimentos com checklist e responsável, avisos internos e suporte, com acesso por cargo. Fiz sozinho, do banco à tela: modelei o Postgres no Supabase com Row Level Security e montei o front em React, com design system próprio e tema claro e escuro. Uso na minha rotina e apresentei a proposta ao setor.",
    role: "Desenvolvedor Full-stack (solo)",
    stack: ["React", "TypeScript", "Tailwind", "Supabase", "Vite"],
    github: "https://github.com/joaobatis1a/praxis",
    demo: "https://demo-praxis.vercel.app/",
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
  {
    id: "confluencia",
    name: "Confluência",
    period: "Ago 2026 – presente",
    shortDesc: "Plataforma cívica do Recife: o cidadão relata problemas num mapa 3D, vota nas soluções e acompanha a obra.",
    fullDesc: "Fecha o ciclo entre o problema e a obra: o cidadão relata no mapa, o relato ganha peso pelos apoios, o órgão público responde em público, transforma o relato em projeto, abre consulta com voto secreto e comprovante verificável e publica a obra numa linha do tempo com prazos. Fui o líder do time de três: coordenei as entregas semanais, revisei os pull requests, criei a base do projeto e o Feed com o mapa 3D (MapLibre GL e deck.gl) e redesenhei landing, login, perfil e projetos. Apresentação à banca em dezembro de 2026.",
    role: "Líder da equipe (time de 3)",
    stack: ["React", "TypeScript", "Vite", "Tailwind", "MapLibre GL", "deck.gl", "Supabase"],
    github: "https://github.com/joaobatis1a/confluencia",
    demo: "https://confluencia-liart.vercel.app/",
    trailer: null,
    award: null,
    mx: 530, my: 390,
    color: palette(245, 184, 0, 254, 240, 138, "#f5b800"),
  },
  {
    id: "nyxa",
    name: "Nyxa",
    period: "Out 2026",
    shortDesc: "Marketplace de NFTs com preço e estoque em tempo real e uma compra que não quebra com rede lenta ou clique repetido.",
    fullDesc: "Marketplace de arte digital com catálogo, favoritos, carrinho, checkout e conta. Preço e estoque mudam em tempo real pelo Socket.IO, e o pedido é idempotente: clique repetido ou resposta perdida nunca criam duas compras. A API e o tempo real são simulados com MSW, com 16 cenários de falha num painel dentro do app. Defini os requisitos e a arquitetura (cache com TanStack Query e reconciliação do tempo real) e rodei e depurei os 41 testes E2E e a auditoria Lighthouse. Projeto pessoal, com marca fictícia.",
    role: "Desenvolvedor Front-end (solo)",
    stack: ["React", "TypeScript", "TanStack Query", "Socket.IO", "MSW", "Tailwind"],
    github: "https://github.com/joaobatis1a/nyxa",
    demo: "https://nyxa-nft-marketplace.vercel.app/",
    trailer: null,
    award: null,
    mx: 370, my: 500,
    color: palette(210, 138, 76, 240, 196, 150, "#d28a4c"),
  },
  {
    id: "capsula",
    name: "Cápsula",
    period: "Out 2026",
    shortDesc: "Estúdio criativo com IA para marketing de farmácia, criado no Hacka Business da Avanade.",
    fullDesc: "Transforma o briefing de uma campanha em peças para feed, story e banner. Antes de escrever, consulta o que já funcionou, o que está em alta e a sazonalidade da saúde. Cada peça mostra de onde veio cada ideia e passa por um checklist baseado na RDC 96/2008 da Anvisa, que bloqueia o que não pode ir ao ar e explica o motivo; nada é publicado sem aprovação humana. Fui Product Owner e principal desenvolvedor num time de três, com geração via Gemini e RAG e contratos validados com Zod no navegador e no servidor.",
    role: "Product Owner & dev principal (time de 3)",
    stack: ["Next.js", "React", "TypeScript", "Zod", "Gemini"],
    github: "https://github.com/joaobatis1a/capsula",
    demo: "https://capsula-mvp.vercel.app/",
    trailer: null,
    award: null,
    mx: 655, my: 300,
    color: palette(99, 102, 241, 169, 174, 255, "#4c4fe8"),
  },
  {
    id: "vessa",
    name: "VESSA",
    period: "Out 2026",
    shortDesc: "Landing page de moda costurada por um fio animado que acompanha a rolagem do início ao fim.",
    fullDesc: "Landing page editorial para uma marca de roupas fictícia: um fio animado nasce no logo, acompanha a rolagem com curvas e nós e termina amarrado no rodapé. Tem cenas presas ao scroll, galeria horizontal, menu com revelação circular e pedido montado direto no WhatsApp. Fiz sozinho, do conceito ao deploy, com a geometria do fio calculada em JavaScript puro para a rolagem não travar, além de SEO e analytics.",
    role: "Desenvolvedor Front-end (solo)",
    stack: ["Next.js", "React", "TypeScript", "Tailwind", "Framer Motion", "Lenis"],
    github: "https://github.com/joaobatis1a/vessa",
    demo: "https://vessa-atelie.vercel.app/",
    trailer: null,
    award: null,
    mx: 300, my: 300,
    color: palette(232, 195, 175, 250, 228, 215, "#e8c3af"),
  },
  {
    id: "nina",
    name: "Nina Brinquedos",
    period: "Set 2026",
    shortDesc: "Loja virtual de brinquedos com busca, filtros, carrinho, favoritos e checkout em etapas.",
    fullDesc: "MVP de e-commerce para uma marca fictícia, feito do zero com foco em UX/UI: home com destaques, busca com sugestões, filtros por marca, preço e faixa etária, página de produto com galeria e avaliações, carrinho, favoritos, conta e checkout simulado em etapas, com formulários validados por React Hook Form e Zod. Projeto só de front-end, com dados simulados.",
    role: "Desenvolvedor Front-end (solo)",
    stack: ["Next.js", "React", "TypeScript", "Tailwind", "React Hook Form", "Zod"],
    github: "https://github.com/joaobatis1a/ninabrinquedos",
    demo: "https://ninabrinquedos.vercel.app/",
    trailer: null,
    award: null,
    mx: 480, my: 495,
    color: palette(139, 92, 246, 196, 181, 253, "#8b5cf6"),
  },
  {
    id: "ponte",
    name: "P.O.N.T.E",
    period: "Fev 2026 – Jun 2026",
    shortDesc: "Conecta jovens do Nordeste a oportunidades reais, com um assistente de IA que identifica habilidades a partir de conversas.",
    fullDesc: "Plataforma de Oportunidades para Novos Talentos Emergentes: conecta jovens do Nordeste a vagas, cursos e eventos de empresas locais, com gamificação por XP e ranking e o Manguelito, um assistente de IA que identifica habilidades a partir de conversas. Fui co-líder e Scrum Master num time de cinco: conduzi os rituais ágeis e a frente de design e front-end, com prototipação no Figma, rotas, componentização e handoff para o time. O back-end roda em Python, FastAPI e MongoDB. Eleita a melhor proposta de software pela banca da UNIFAFIRE.",
    role: "Co-líder & Scrum Master",
    stack: ["HTML", "CSS", "JavaScript", "Python", "FastAPI", "MongoDB", "Figma"],
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
    id: "benevo",
    name: "Benevo",
    period: "Jul 2025 – Dez 2025",
    shortDesc: "Sistema de gestão de doações para ONGs com controle de estoque, recebimento e distribuição de itens.",
    fullDesc: "Sistema para ONGs controlarem estoque, recebimento e distribuição de itens aos beneficiários, com foco em transparência e menos burocracia. Fui co-líder e Scrum Master durante todos os sprints e liderei a frente de front-end, definindo a arquitetura de componentes e os padrões visuais das telas. HTML, CSS e JavaScript no front; Java e MongoDB no back. Ficou em 2º lugar na banca técnica da UNIFAFIRE.",
    role: "Co-líder & Scrum Master",
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
    id: "limpattack",
    name: "Limpattack",
    period: "Fev 2025 – Jul 2025",
    shortDesc: "Jogo educativo inspirado em Pokémon, para crianças de 6 a 10 anos. Foco em higiene e combate a bactérias.",
    fullDesc: "Jogo educativo inspirado em Pokémon para crianças de 6 a 10 anos, com sprites, mapas interativos e mecânicas de RPG, que ensina hábitos de higiene e o combate às bactérias. Fui responsável pelas mecânicas de jogo e pela produção do trailer oficial, num time da UNIFAFIRE. Ficou em 1º lugar entre 8 equipes e foi aplicado com crianças. Python e Pygame.",
    role: "Mecânicas de jogo & trailer",
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
];

type UnlockedProject = UnlockedProjectData;

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

// Relógio compartilhado pelos efeitos novos: segundos desde a montagem
function useClock() {
  const [t, setT] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);
  useEffect(() => {
    let start: number | undefined;
    const tick = (ts: number) => {
      if (start === undefined) start = ts;
      setT((ts - start) / 1000);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current!);
  }, []);
  return t;
}

function EffectLabel({ text, color, light }: { text: string; color: string; light: string }) {
  const w = Math.max(70, text.length * 4.4 + 14);
  return (
    <>
      <rect x={110 - w / 2} y="4" width={w} height="12" rx="2" fill={`${color}0.08)`} stroke={`${color}0.2)`} strokeWidth="0.5" />
      <text x="110" y="13" textAnchor="middle" fill={`${light}0.65)`} fontSize="6.5" fontFamily="monospace" letterSpacing="0.5">{text}</text>
    </>
  );
}

const SVG_STYLE = { position: "absolute" as const, inset: 0, width: "100%", height: "100%", pointerEvents: "none" as const };

// Confluência: bairros em pixel, colunas do mapa 3D subindo e um relato caindo no mapa
function ConfluenciaEffect() {
  const t = useClock();
  const Y = "rgba(245,184,0,";
  const YL = "rgba(254,240,138,";
  const buildings = [[14, 22], [34, 34], [58, 18], [128, 30], [152, 40], [176, 24], [196, 32]];
  const columns = [[86, 0], [100, 1.7], [114, 3.1]];
  const cycle = 2.4;
  const phase = (t % cycle) / cycle;
  const pinY = 20 + Math.min(1, phase * 1.6) * 64;
  const steps = ["RELATO NO MAPA", "CONSULTA ABERTA", "OBRA ENTREGUE"];
  const step = steps[Math.floor(t / 2.4) % steps.length];

  return (
    <svg style={SVG_STYLE} viewBox="0 0 220 140" shapeRendering="crispEdges">
      <line x1="0" y1="112" x2="220" y2="112" stroke={`${Y}0.25)`} strokeWidth="1" />
      {buildings.map(([x, h], i) => (
        <g key={i}>
          <rect x={x} y={112 - h} width="16" height={h} fill={`${Y}0.07)`} stroke={`${Y}0.22)`} strokeWidth="0.5" />
          {Array.from({ length: Math.floor(h / 9) }, (_, j) => (
            <rect key={j} x={x + 4} y={112 - h + 4 + j * 9} width="3" height="3" fill={`${YL}${(0.15 + 0.3 * Math.abs(Math.sin(t + i + j))).toFixed(2)})`} />
          ))}
        </g>
      ))}
      {columns.map(([x, off], i) => {
        const h = 8 + 30 * Math.abs(Math.sin(t * 0.9 + off));
        return (
          <g key={i}>
            <rect x={x} y={112 - h} width="8" height={h} fill={`${Y}0.55)`} />
            <rect x={x} y={112 - h} width="8" height="2" fill={`${YL}0.95)`} />
          </g>
        );
      })}
      <g transform={`translate(100,${pinY})`} opacity={phase > 0.85 ? (1 - phase) / 0.15 : 1}>
        <rect x="-3" y="-8" width="6" height="6" fill={`${YL}0.95)`} />
        <rect x="-1" y="-2" width="2" height="5" fill={`${Y}0.9)`} />
      </g>
      {phase > 0.62 && <rect x={100 - phase * 14} y="84" width={phase * 28} height="1" fill={`${YL}0.5)`} />}
      <EffectLabel text={step} color={Y} light={YL} />
    </svg>
  );
}

// Nyxa: obras em pixel com preço ao vivo, o tempo real passando e muitos cliques virando um pedido só
function NyxaEffect() {
  const t = useClock();
  const C = "rgba(210,138,76,";
  const CL = "rgba(240,196,150,";
  const frames = [26, 94, 162];
  const base = [1.2, 0.85, 2.4];
  const tickPos = (t * 70) % 240 - 10;
  const clicks = Math.floor((t * 2) % 6);

  return (
    <svg style={SVG_STYLE} viewBox="0 0 220 140" shapeRendering="crispEdges">
      <line x1="0" y1="27" x2="220" y2="27" stroke={`${C}0.12)`} strokeWidth="1" strokeDasharray="3 3" />
      <rect x={tickPos} y="25" width="6" height="4" fill={`${CL}0.9)`} />
      {frames.map((x, i) => {
        const price = base[i] + 0.12 * Math.sin(t * 1.3 + i * 2);
        const hot = Math.abs(tickPos - (x + 16)) < 10;
        return (
          <g key={i}>
            <rect x={x} y="36" width="32" height="40" fill="rgba(20,13,10,0.9)" stroke={hot ? `${CL}0.95)` : `${C}0.45)`} strokeWidth="1" />
            <rect x={x + 9} y="44" width="14" height="14" fill={`${C}0.55)`} />
            <rect x={x + 12} y="48" width="3" height="3" fill="rgba(20,13,10,0.9)" />
            <rect x={x + 18} y="48" width="3" height="3" fill="rgba(20,13,10,0.9)" />
            <rect x={x + 13} y="54" width="7" height="2" fill="rgba(20,13,10,0.9)" />
            <rect x={x + 6} y="62" width="20" height="9" fill={`${C}0.18)`} />
            <text x={x + 16} y="85" textAnchor="middle" fill={hot ? `${CL}0.95)` : `${CL}0.6)`} fontSize="6.5" fontFamily="monospace">{`Ξ ${price.toFixed(2)}`}</text>
          </g>
        );
      })}
      <g transform="translate(78,98)">
        {Array.from({ length: clicks }, (_, i) => (
          <rect key={i} x={i * 5} y="0" width="3" height="3" fill={`${CL}0.8)`} />
        ))}
        <text x="34" y="3" fill={`${CL}0.6)`} fontSize="6" fontFamily="monospace">{`${clicks} CLIQUE${clicks === 1 ? "" : "S"} · 1 PEDIDO`}</text>
      </g>
      <EffectLabel text="PREÇO AO VIVO" color={C} light={CL} />
    </svg>
  );
}

// Cápsula: a cápsula abre em peças de feed, story e banner, e o checklist confere cada uma
function CapsulaEffect() {
  const t = useClock();
  const I = "rgba(99,102,241,";
  const IL = "rgba(169,174,255,";
  const cycle = 4.5;
  const p = (t % cycle) / cycle;
  const pieces = [
    { x: 92, y: 34, w: 28, h: 28, at: 0.12 },
    { x: 128, y: 30, w: 18, h: 34, at: 0.24 },
    { x: 154, y: 40, w: 50, h: 16, at: 0.36 },
  ];
  const rows = [0.5, 0.62, 0.74];
  const blocked = Math.floor(t / cycle) % 2 === 1;

  return (
    <svg style={SVG_STYLE} viewBox="0 0 220 140" shapeRendering="crispEdges">
      <rect x="24" y="44" width="22" height="14" fill={`${I}0.75)`} />
      <rect x="46" y="44" width="22" height="14" fill={`${IL}0.85)`} />
      <rect x="22" y="46" width="2" height="10" fill={`${I}0.75)`} />
      <rect x="68" y="46" width="2" height="10" fill={`${IL}0.85)`} />
      {pieces.map((pc, i) => p > pc.at && (
        <g key={i}>
          <rect x={pc.x} y={pc.y} width={pc.w} height={pc.h} fill="rgba(10,10,30,0.9)" stroke={`${IL}0.7)`} strokeWidth="1" />
          <rect x={pc.x + 3} y={pc.y + 3} width={pc.w - 6} height={Math.max(3, pc.h / 3)} fill={`${I}0.4)`} />
          <rect x={pc.x + 3} y={pc.y + pc.h - 7} width={(pc.w - 6) * 0.7} height="2" fill={`${IL}0.6)`} />
        </g>
      ))}
      {rows.map((at, i) => {
        const y = 78 + i * 12;
        const on = p > at;
        const bad = blocked && i === 2;
        return (
          <g key={i}>
            <rect x="92" y={y} width="7" height="7" fill="none" stroke={`${IL}0.5)`} strokeWidth="1" />
            {on && !bad && (
              <>
                <rect x="93" y={y + 4} width="2" height="2" fill="rgba(80,220,150,0.95)" />
                <rect x="95" y={y + 5} width="2" height="1" fill="rgba(80,220,150,0.95)" />
                <rect x="96" y={y + 2} width="2" height="3" fill="rgba(80,220,150,0.95)" />
              </>
            )}
            {on && bad && (
              <>
                <rect x="93" y={y + 1} width="5" height="1" fill="rgba(240,80,110,0.95)" transform={`rotate(45 95.5 ${y + 3.5})`} />
                <rect x="93" y={y + 1} width="5" height="1" fill="rgba(240,80,110,0.95)" transform={`rotate(-45 95.5 ${y + 3.5})`} />
              </>
            )}
            <rect x="104" y={y + 2} width={60 - i * 10} height="2" fill={on ? `${IL}0.55)` : `${I}0.2)`} />
          </g>
        );
      })}
      <EffectLabel text={blocked ? "BLOQUEADO: REGRA DA ANVISA" : "CHECKLIST ANVISA OK"} color={I} light={IL} />
    </svg>
  );
}

// VESSA: um fio costura o card de ponta a ponta, com nós e a agulha na frente
function VessaEffect() {
  const t = useClock();
  const R = "rgba(232,195,175,";
  const T = "rgba(189,91,53,";
  const prog = (t * 0.22) % 1;
  const pts: [number, number][] = [];
  for (let x = 8; x <= 212; x += 4) pts.push([x, 78 + 24 * Math.sin(x / 20)]);
  const shown = Math.max(2, Math.floor(prog * pts.length));
  const tip = pts[shown - 1];
  const knots = pts.filter((_, i) => i % 13 === 6 && i < shown);

  return (
    <svg style={SVG_STYLE} viewBox="0 0 220 140" shapeRendering="crispEdges">
      {Array.from({ length: 40 }, (_, i) => (
        <rect key={i} x={(i % 10) * 22 + 8} y={Math.floor(i / 10) * 26 + 28} width="1" height="1" fill={`${R}0.12)`} />
      ))}
      <polyline points={pts.slice(0, shown).map(([x, y]) => `${x},${y}`).join(" ")} fill="none" stroke={`${T}0.85)`} strokeWidth="1.5" strokeDasharray="5 2" shapeRendering="geometricPrecision" />
      {knots.map(([x, y], i) => (
        <rect key={i} x={x - 2} y={y - 2} width="4" height="4" fill={`${R}0.9)`} />
      ))}
      <g transform={`translate(${tip[0]},${tip[1]})`}>
        <rect x="0" y="-1" width="10" height="2" fill={`${R}0.95)`} />
        <rect x="1" y="-1" width="2" height="1" fill="rgba(20,16,12,0.9)" />
      </g>
      <EffectLabel text="COSTURANDO A PÁGINA" color={T} light={R} />
    </svg>
  );
}

// Nina Brinquedos: brinquedos caindo no carrinho e a bola quicando
function NinaEffect() {
  const t = useClock();
  const V = "rgba(139,92,246,";
  const VL = "rgba(196,181,253,";
  const toys = ["rgba(255,197,61,0.9)", "rgba(63,176,229,0.9)", "rgba(255,92,147,0.9)"];
  const cycle = 3.6;
  const p = (t % cycle) / cycle;
  const ballY = 104 - 40 * Math.abs(Math.sin(t * 3));
  const landed = toys.filter((_, i) => p > 0.2 + i * 0.22).length;

  return (
    <svg style={SVG_STYLE} viewBox="0 0 220 140" shapeRendering="crispEdges">
      <line x1="0" y1="112" x2="220" y2="112" stroke={`${V}0.25)`} strokeWidth="1" />
      <rect x="44" y={ballY - 4} width="10" height="10" fill="rgba(255,92,147,0.85)" />
      <rect x="46" y={ballY - 2} width="3" height="3" fill="rgba(255,255,255,0.5)" />
      <rect x={45 - (112 - ballY) * 0.04} y="111" width={10 + (112 - ballY) * 0.08} height="1" fill="rgba(0,0,0,0.4)" />
      {toys.map((c, i) => {
        const start = 0.2 + i * 0.22 - 0.16;
        const k = Math.min(1, Math.max(0, (p - start) / 0.16));
        if (k <= 0) return null;
        const y = 24 + k * (98 - 24);
        return <rect key={i} x={140 + i * 9} y={y} width="8" height="8" fill={c} />;
      })}
      <g transform="translate(130,90)">
        <rect x="0" y="0" width="44" height="2" fill={`${VL}0.85)`} />
        <rect x="2" y="2" width="2" height="14" fill={`${VL}0.7)`} />
        <rect x="40" y="2" width="2" height="14" fill={`${VL}0.7)`} />
        <rect x="2" y="16" width="40" height="2" fill={`${VL}0.7)`} />
        <rect x="-8" y="-6" width="10" height="2" fill={`${VL}0.7)`} />
        <rect x="6" y="20" width="4" height="4" fill={`${V}0.9)`} />
        <rect x="34" y="20" width="4" height="4" fill={`${V}0.9)`} />
      </g>
      <EffectLabel text={`CARRINHO: ${landed} ${landed === 1 ? "ITEM" : "ITENS"}`} color={V} light={VL} />
    </svg>
  );
}

const CARD_EFFECTS: Record<string, React.FC> = {
  limpattack: LimpattackEffect,
  benevo: BenevoEffect,
  ponte: PonteEffect,
  praxis: PraxisEffect,
  kairos: KairosEffect,
  confluencia: ConfluenciaEffect,
  nyxa: NyxaEffect,
  capsula: CapsulaEffect,
  vessa: VessaEffect,
  nina: NinaEffect,
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
            {project.github && project.demo
              ? "CLIQUE PARA VER CÓDIGO E DEMO"
              : project.github
              ? "CLIQUE PARA VER O CÓDIGO"
              : "CLIQUE PARA SABER MAIS"}
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
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

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
                {project.demo && (
                <a href={project.demo} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "10px", fontSize: "12px", fontWeight: 600, textDecoration: "none", background: c.bg, border: `1px solid ${c.border}`, color: c.text }}>
                  <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Ver Demo
                </a>
                )}

                {!project.github && !project.demo && (
                  <span style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "10px", fontSize: "12px", fontWeight: 600, background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.18)", color: "rgba(200,200,210,0.6)" }}>
                    🚧 Ainda em planejamento, sem código publicado
                  </span>
                )}

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

/* ── Map ── */
// Largura do rótulo do marcador: cabe o nome inteiro (Poppins 600, 10px)
const labelW = (name: string) => Math.max(60, name.length * 6.1 + 20);

function IslandMap() {
  const [selectedUnlocked, setSelectedUnlocked] = useState<UnlockedProject | null>(null);
  const [hoveredUnlocked, setHoveredUnlocked] = useState<string | null>(null);
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

        {/* Unlocked markers */}
        {UNLOCKED.map((p, idx) => {
          const c = p.color;
          const isH = hoveredUnlocked === p.id;
          return (
            <g key={p.id} style={{ cursor: "pointer", outline: "none" }}
              role="button" tabIndex={0} aria-label={`${p.name}: ver detalhes do projeto`}
              onClick={() => setSelectedUnlocked(p)}
              onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedUnlocked(p); } }}
              onFocus={() => { if (!isMobile) setHoveredUnlocked(p.id); }}
              onBlur={() => { if (!isMobile) setHoveredUnlocked(null); }}
              onMouseEnter={() => { if (!isMobile) setHoveredUnlocked(p.id); }}
              onMouseLeave={() => { if (!isMobile) setHoveredUnlocked(null); }}
            >
              <circle cx={p.mx} cy={p.my} r={isH ? 30 : 22} fill="none" stroke={c.ping} strokeWidth="1" style={{ animation: `ping 2s ease-out infinite`, animationDelay: `${idx * 0.6}s`, transition: "r 0.3s ease" }} />
              {isH && <circle cx={p.mx} cy={p.my} r={42} fill="none" stroke={c.ping} strokeWidth="0.5" style={{ animation: `ping 1.5s ease-out infinite` }} />}
              <circle cx={p.mx} cy={p.my} r={isH ? 17 : 14} fill={c.bg} stroke={c.glow} strokeWidth={isH ? 2 : 1.5} filter="url(#glow)" style={{ transition: "all 0.25s ease" }} />
              <circle cx={p.mx} cy={p.my} r={isH ? 6 : 5} fill={c.base} filter={isH ? "url(#strongGlow)" : "url(#glow)"} style={{ transition: "all 0.25s ease" }} />
              <rect x={p.mx - labelW(p.name) / 2} y={p.my - 36} width={labelW(p.name)} height={18} rx={9} fill="rgba(6,12,6,0.88)" stroke={isH ? c.border : "rgba(34,197,94,0.2)"} strokeWidth="1" style={{ transition: "stroke 0.2s ease" }} />
              <text x={p.mx} y={p.my - 27} textAnchor="middle" dominantBaseline="central" fill={c.text} fontSize="10" fontWeight="600" fontFamily="Poppins, sans-serif" letterSpacing="0.2">{p.name}</text>
              <line x1={p.mx} y1={p.my - 18} x2={p.mx} y2={p.my - 14} stroke={c.border} strokeWidth="1" />
            </g>
          );
        })}

        <text x="400" y="582" textAnchor="middle" fill="rgba(34,197,94,0.3)" fontSize="11" fontFamily="monospace" letterSpacing="4" fontWeight="600">ILHA DOS PROJETOS</text>
      </svg>

      {selectedUnlocked && <UnlockedPanel project={selectedUnlocked} onClose={() => setSelectedUnlocked(null)} />}

      <style>{`
        @keyframes ping { 0% { transform-origin:center; transform:scale(1); opacity:0.8; } 100% { transform-origin:center; transform:scale(2.2); opacity:0; } }
        @keyframes shimmer { 0% { stroke-dashoffset:0; } 100% { stroke-dashoffset:-80; } }
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
        <p className="mt-4 text-sm tracking-widest text-emerald-500/40 uppercase">// explore o território</p>
        <p className="mt-2 text-sm text-zinc-500 hidden md:block">Passe o mouse nos marcadores para ver os detalhes</p>
        <p className="mt-2 text-sm text-zinc-500 md:hidden">Toque nos marcadores para ver os detalhes</p>
      </div>
      <div className="relative z-10 w-full max-w-3xl"><IslandMap /></div>
    </section>
  );
}

export default Projects;
