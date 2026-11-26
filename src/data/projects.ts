import type { L10n } from "../i18n/context";

/* ── Data ── */
export interface UnlockedProjectData {
  id: string;
  name: string;
  period: L10n;
  shortDesc: L10n;
  fullDesc: L10n;
  role: L10n;
  stack: string[];
  github: string | null;
  demo: string | null;
  trailer: string | null;
  award: L10n | null;
  /** ilha do arquipélago: projetos solo ou em equipe */
  island: "solo" | "team";
  /** logo do projeto em public/logos/projects */
  logo: string;
  /** placa escura atrás da logo: só para marcas transparentes que somem sobre o brilho (ex.: Praxis) */
  plate?: boolean;
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

export const UNLOCKED: UnlockedProjectData[] = [
  {
    id: "kairos",
    name: "Kairos",
    period: { pt: "Jun 2026 – Set 2026", en: "Jun 2026 – Sep 2026" },
    shortDesc: { pt: "Agendamento pra barbearias: o cliente marca sozinho pelo link e o dono vê agenda, equipe e faturamento num painel.", en: "Booking for barbershops: clients book on their own through a link and the owner tracks schedule, team and revenue in one dashboard." },
    fullDesc: { pt: "Cada barbearia ganha um link próprio pra botar na bio. O cliente escolhe serviço, barbeiro e horário sozinho, e o dono acompanha agenda, equipe e faturamento num painel só. Fiz sozinho, do banco ao deploy, em Next.js e Supabase: cada barbearia fica isolada no Postgres com Row Level Security, a agenda atualiza em tempo real, o app instala como PWA e os e-mails de confirmação e lembrete saem automáticos pela Resend.", en: "Each barbershop gets its own link to put in its bio. Clients pick the service, barber and time on their own, and the owner tracks schedule, team and revenue in a single dashboard. I built it alone, from database to deploy, with Next.js and Supabase: each shop is isolated in Postgres with Row Level Security, the schedule updates in real time, the app installs as a PWA and confirmation and reminder emails go out automatically through Resend." },
    role: { pt: "Desenvolvedor Full-stack (solo)", en: "Full-stack Developer (solo)" },
    stack: ["Next.js", "React", "TypeScript", "Tailwind", "Supabase", "Resend"],
    github: "https://github.com/joaobatis1a/kairos",
    demo: "https://kairos-demo-rouge.vercel.app/",
    trailer: null,
    award: null,
    island: "solo", logo: "/logos/projects/kairos.svg",
    mx: 250, my: 215,
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
    period: { pt: "Mai 2026 – Jul 2026", en: "May 2026 – Jul 2026" },
    shortDesc: { pt: "Gestão do conhecimento: documentos, procedimentos e avisos da equipe num lugar só. Nasceu no meu trabalho.", en: "Knowledge management: a team's documents, procedures and announcements in one place. Born at my job." },
    fullDesc: { pt: "Nasceu de um problema que vi no meu trabalho no Grupo ACLF: documentos e procedimentos espalhados e sem padrão. Juntei tudo num lugar só: documentos versionados, procedimentos com checklist e responsável, avisos internos e suporte, com acesso por cargo. Fiz sozinho, do banco à tela: modelei o Postgres no Supabase com Row Level Security e montei o front em React, com design system próprio e tema claro e escuro. Uso na minha rotina e apresentei a proposta ao setor.", en: "It came from a problem I saw at my job at Grupo ACLF: documents and procedures scattered with no standard. I brought it all into one place: versioned documents, procedures with checklists and owners, internal announcements and support, with role-based access. I built it alone, from database to UI: I modeled Postgres on Supabase with Row Level Security and built the front end in React, with its own design system and light and dark themes. I use it in my daily routine and presented the proposal to my department." },
    role: { pt: "Desenvolvedor Full-stack (solo)", en: "Full-stack Developer (solo)" },
    stack: ["React", "TypeScript", "Tailwind", "Supabase", "Vite"],
    github: "https://github.com/joaobatis1a/praxis",
    demo: "https://demo-praxis.vercel.app/",
    trailer: null,
    award: null,
    island: "solo", logo: "/logos/projects/praxis.png", plate: true,
    mx: 535, my: 200,
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
    period: { pt: "Out 2026 – Nov 2026", en: "Oct 2026 – Nov 2026" },
    shortDesc: { pt: "Plataforma cívica do Recife: o cidadão relata problemas num mapa 3D, vota nas soluções e acompanha a obra.", en: "Civic platform for Recife: citizens report problems on a 3D map, vote on solutions and follow the public works." },
    fullDesc: { pt: "Fecha o ciclo entre o problema e a obra: o cidadão relata no mapa, o relato ganha peso pelos apoios, o órgão público responde em público, transforma o relato em projeto, abre consulta com voto secreto e comprovante verificável e publica a obra numa linha do tempo com prazos. Fui o líder do time de três: coordenei as entregas semanais, revisei os pull requests, criei a base do projeto e o Feed com o mapa 3D (MapLibre GL e deck.gl) e redesenhei landing, login, perfil e projetos. Apresentação à banca em dezembro de 2026.", en: "It closes the loop between a problem and the public work: citizens report on the map, reports gain weight through support, the public agency responds publicly, turns the report into a project, opens a consultation with a secret ballot and a verifiable receipt, and publishes the work on a timeline with deadlines. I led the team of three: I coordinated the weekly deliveries, reviewed pull requests, created the project foundation and the Feed with the 3D map (MapLibre GL and deck.gl), and redesigned landing, login, profile and projects. Presentation to the panel in December 2026." },
    role: { pt: "Líder da equipe (time de 3)", en: "Team lead (team of 3)" },
    stack: ["React", "TypeScript", "Vite", "Tailwind", "MapLibre GL", "deck.gl", "Supabase"],
    github: "https://github.com/joaobatis1a/confluencia",
    demo: "https://confluencia-liart.vercel.app/",
    trailer: null,
    award: null,
    island: "team", logo: "/logos/projects/confluencia.png",
    mx: 400, my: 320,
    color: palette(245, 184, 0, 254, 240, 138, "#f5b800"),
  },
  {
    id: "nyxa",
    name: "Nyxa",
    period: { pt: "Out 2026", en: "Oct 2026" },
    shortDesc: { pt: "Marketplace de NFTs com preço e estoque em tempo real e uma compra que não quebra com rede lenta ou clique repetido.", en: "NFT marketplace with real-time price and stock and a checkout that doesn't break on a slow network or repeated clicks." },
    fullDesc: { pt: "Marketplace de arte digital com catálogo, favoritos, carrinho, checkout e conta. Preço e estoque mudam em tempo real pelo Socket.IO, e o pedido é idempotente: clique repetido ou resposta perdida nunca criam duas compras. A API e o tempo real são simulados com MSW, com 16 cenários de falha num painel dentro do app. Defini os requisitos e a arquitetura (cache com TanStack Query e reconciliação do tempo real) e rodei e depurei os 41 testes E2E e a auditoria Lighthouse. Projeto pessoal, com marca fictícia.", en: "Digital art marketplace with catalog, favorites, cart, checkout and account. Price and stock change in real time via Socket.IO, and orders are idempotent: a repeated click or a lost response never creates two purchases. The API and real-time layer are mocked with MSW, with 16 failure scenarios in an in-app panel. I defined the requirements and architecture (caching with TanStack Query and real-time reconciliation) and ran and debugged the 41 E2E tests and the Lighthouse audit. Personal project with a fictional brand." },
    role: { pt: "Desenvolvedor Front-end (solo)", en: "Front-end Developer (solo)" },
    stack: ["React", "TypeScript", "TanStack Query", "Socket.IO", "MSW", "Tailwind"],
    github: "https://github.com/joaobatis1a/nyxa",
    demo: "https://nyxa-nft-marketplace.vercel.app/",
    trailer: null,
    award: null,
    island: "solo", logo: "/logos/projects/nyxa.svg",
    mx: 395, my: 335,
    color: palette(210, 138, 76, 240, 196, 150, "#d28a4c"),
  },
  {
    id: "capsula",
    name: "Cápsula",
    period: { pt: "Out 2026", en: "Oct 2026" },
    shortDesc: { pt: "Estúdio criativo com IA para marketing de farmácia, criado no Hacka Business da Avanade.", en: "AI creative studio for pharmacy marketing, built at Avanade's Hacka Business." },
    fullDesc: { pt: "Transforma o briefing de uma campanha em peças para feed, story e banner. Antes de escrever, consulta o que já funcionou, o que está em alta e a sazonalidade da saúde. Cada peça mostra de onde veio cada ideia e passa por um checklist baseado na RDC 96/2008 da Anvisa, que bloqueia o que não pode ir ao ar e explica o motivo; nada é publicado sem aprovação humana. Fui Product Owner e principal desenvolvedor num time de três, com geração via Gemini e RAG e contratos validados com Zod no navegador e no servidor.", en: "It turns a campaign brief into pieces for feed, story and banner. Before writing, it checks what has worked before, what's trending and health seasonality. Each piece shows where every idea came from and goes through a checklist based on Anvisa's RDC 96/2008, which blocks what can't go live and explains why; nothing is published without human approval. I was Product Owner and lead developer on a team of three, with generation via Gemini and RAG and contracts validated with Zod on the client and the server." },
    role: { pt: "Product Owner & dev principal (time de 3)", en: "Product Owner & lead dev (team of 3)" },
    stack: ["Next.js", "React", "TypeScript", "Zod", "Gemini"],
    github: "https://github.com/joaobatis1a/capsula",
    demo: "https://capsula-mvp.vercel.app/",
    trailer: null,
    award: null,
    island: "team", logo: "/logos/projects/capsula.svg",
    mx: 560, my: 440,
    color: palette(99, 102, 241, 169, 174, 255, "#4c4fe8"),
  },
  {
    id: "vessa",
    name: "VESSA",
    period: { pt: "Out 2026", en: "Oct 2026" },
    shortDesc: { pt: "Landing page de moda costurada por um fio animado que acompanha a rolagem do início ao fim.", en: "Fashion landing page stitched together by an animated thread that follows the scroll from start to finish." },
    fullDesc: { pt: "Landing page editorial para uma marca de roupas fictícia: um fio animado nasce no logo, acompanha a rolagem com curvas e nós e termina amarrado no rodapé. Tem cenas presas ao scroll, galeria horizontal, menu com revelação circular e pedido montado direto no WhatsApp. Fiz sozinho, do conceito ao deploy, com a geometria do fio calculada em JavaScript puro para a rolagem não travar, além de SEO e analytics.", en: "Editorial landing page for a fictional clothing brand: an animated thread is born in the logo, follows the scroll with curves and knots and ends tied at the footer. It has scroll-pinned scenes, a horizontal gallery, a menu with a circular reveal and orders put together straight into WhatsApp. I built it alone, from concept to deploy, with the thread geometry computed in plain JavaScript so scrolling doesn't stutter, plus SEO and analytics." },
    role: { pt: "Desenvolvedor Front-end (solo)", en: "Front-end Developer (solo)" },
    stack: ["Next.js", "React", "TypeScript", "Tailwind", "Framer Motion", "Lenis"],
    github: "https://github.com/joaobatis1a/vessa",
    demo: "https://vessa-atelie.vercel.app/",
    trailer: null,
    award: null,
    island: "solo", logo: "/logos/projects/vessa.svg",
    mx: 245, my: 440,
    color: palette(232, 195, 175, 250, 228, 215, "#e8c3af"),
  },
  {
    id: "nina",
    name: "Nina Brinquedos",
    period: { pt: "Set 2026", en: "Sep 2026" },
    shortDesc: { pt: "Loja virtual de brinquedos com busca, filtros, carrinho, favoritos e checkout em etapas.", en: "Toy store with search, filters, cart, favorites and a step-by-step checkout." },
    fullDesc: { pt: "MVP de e-commerce para uma marca fictícia, feito do zero com foco em UX/UI: home com destaques, busca com sugestões, filtros por marca, preço e faixa etária, página de produto com galeria e avaliações, carrinho, favoritos, conta e checkout simulado em etapas, com formulários validados por React Hook Form e Zod. Projeto só de front-end, com dados simulados.", en: "E-commerce MVP for a fictional brand, built from scratch with a focus on UX/UI: home with highlights, search with suggestions, filters by brand, price and age range, product page with gallery and reviews, cart, favorites, account and a simulated step-by-step checkout, with forms validated by React Hook Form and Zod. Front-end only, with mock data." },
    role: { pt: "Desenvolvedor Front-end (solo)", en: "Front-end Developer (solo)" },
    stack: ["Next.js", "React", "TypeScript", "Tailwind", "React Hook Form", "Zod"],
    github: "https://github.com/joaobatis1a/ninabrinquedos",
    demo: "https://ninabrinquedos.vercel.app/",
    trailer: null,
    award: null,
    island: "solo", logo: "/logos/projects/nina.svg",
    mx: 555, my: 440,
    color: palette(139, 92, 246, 196, 181, 253, "#8b5cf6"),
  },
  {
    id: "ponte",
    name: "P.O.N.T.E",
    period: { pt: "Fev 2026 – Jun 2026", en: "Feb 2026 – Jun 2026" },
    shortDesc: { pt: "Conecta jovens do Nordeste a oportunidades reais, com um assistente de IA que identifica habilidades a partir de conversas.", en: "Connects young people in Brazil's Northeast to real opportunities, with an AI assistant that identifies skills from conversations." },
    fullDesc: { pt: "Plataforma de Oportunidades para Novos Talentos Emergentes: conecta jovens do Nordeste a vagas, cursos e eventos de empresas locais, com gamificação por XP e ranking e o Manguelito, um assistente de IA que identifica habilidades a partir de conversas. Fui co-líder e Scrum Master num time de cinco: conduzi os rituais ágeis e a frente de design e front-end, com prototipação no Figma, rotas, componentização e handoff para o time. O back-end roda em Python, FastAPI e MongoDB. Ficou em 1º lugar na banca da UNIFAFIRE.", en: "Opportunity Platform for New Emerging Talent: it connects young people in Brazil's Northeast to jobs, courses and events from local companies, with XP and ranking gamification and Manguelito, an AI assistant that identifies skills from conversations. I was co-lead and Scrum Master on a team of five: I ran the agile ceremonies and led design and front end, with Figma prototyping, routing, componentization and handoff to the team. The back end runs on Python, FastAPI and MongoDB. Took 1st place with the UNIFAFIRE panel." },
    role: { pt: "Co-líder & Scrum Master", en: "Co-lead & Scrum Master" },
    stack: ["HTML", "CSS", "JavaScript", "Python", "FastAPI", "MongoDB", "Figma"],
    github: "https://github.com/joaobatis1a/ponte",
    demo: "https://ponte-demo.vercel.app/",
    trailer: null,
    award: { pt: "🏆 1º Lugar", en: "🏆 1st Place" },
    island: "team", logo: "/logos/projects/ponte.png",
    mx: 255, my: 205,
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
    period: { pt: "Jul 2025 – Dez 2025", en: "Jul 2025 – Dec 2025" },
    shortDesc: { pt: "Sistema de gestão de doações para ONGs com controle de estoque, recebimento e distribuição de itens.", en: "Donation management system for NGOs with inventory control, intake and distribution of items." },
    fullDesc: { pt: "Sistema para ONGs controlarem estoque, recebimento e distribuição de itens aos beneficiários, com foco em transparência e menos burocracia. Fui co-líder e Scrum Master durante todos os sprints e liderei a frente de front-end, definindo a arquitetura de componentes e os padrões visuais das telas. HTML, CSS e JavaScript no front; Java e MongoDB no back. Ficou em 2º lugar na banca técnica da UNIFAFIRE.", en: "A system for NGOs to manage inventory, intake and distribution of items to beneficiaries, focused on transparency and less red tape. I was co-lead and Scrum Master through every sprint and led the front end, defining the component architecture and the visual standards of the screens. HTML, CSS and JavaScript on the front; Java and MongoDB on the back. Took 2nd place at the UNIFAFIRE technical panel." },
    role: { pt: "Co-líder & Scrum Master", en: "Co-lead & Scrum Master" },
    stack: ["HTML", "CSS", "JavaScript", "Java", "MongoDB"],
    github: "https://github.com/joaobatis1a/benevo",
    demo: "https://benevo-demo.vercel.app/",
    trailer: null,
    award: { pt: "🥈 2º Lugar", en: "🥈 2nd Place" },
    island: "team", logo: "/logos/projects/benevo.svg",
    mx: 545, my: 200,
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
    period: { pt: "Fev 2025 – Jul 2025", en: "Feb 2025 – Jul 2025" },
    shortDesc: { pt: "Jogo educativo inspirado em Pokémon, para crianças de 6 a 10 anos. Foco em higiene e combate a bactérias.", en: "Pokémon-inspired educational game for kids aged 6 to 10, focused on hygiene and fighting germs." },
    fullDesc: { pt: "Jogo educativo inspirado em Pokémon para crianças de 6 a 10 anos, com sprites, mapas interativos e mecânicas de RPG, que ensina hábitos de higiene e o combate às bactérias. Fui responsável pelas mecânicas de jogo e pela produção do trailer oficial, num time da UNIFAFIRE. Ficou em 1º lugar na banca da UNIFAFIRE e foi aplicado com crianças. A landing reúne o trailer e leva ao download do jogo. Python e Pygame.", en: "Pokémon-inspired educational game for kids aged 6 to 10, with sprites, interactive maps and RPG mechanics, that teaches hygiene habits and fighting germs. I was responsible for the game mechanics and for producing the official trailer, on a UNIFAFIRE team. It took 1st place with the UNIFAFIRE panel and was used with children. The landing page brings together the trailer and leads to the game download. Python and Pygame." },
    role: { pt: "Mecânicas de jogo & trailer", en: "Game mechanics & trailer" },
    stack: ["Python", "Pygame"],
    github: "https://github.com/joaobatis1a/limpattack",
    demo: "https://limpattack.vercel.app/",
    trailer: "/trailer_limpattack.mp4",
    award: { pt: "🏆 1º Lugar", en: "🏆 1st Place" },
    island: "team", logo: "/logos/projects/limpattack.png",
    mx: 245, my: 430,
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
    id: "rafa",
    name: "Rafaela Ferreira · Arquitetura",
    period: { pt: "nov. de 2026 – nov. de 2026", en: "Nov 2026 – Nov 2026" },
    shortDesc: { pt: "Site institucional de uma arquiteta de espaços comerciais, em uma página, com processo em maquete 3D.", en: "Institutional site for an architect of commercial spaces, on one page, with a process section in 3D." },
    fullDesc: { pt: "Site institucional em uma página para uma arquiteta especializada em espaços comerciais, com projetos em galeria, serviços em lista, o processo de trabalho com uma maquete 3D que se monta conforme a rolagem (no celular, uma prancha por etapa) e contato direto por WhatsApp e e-mail. Desenvolvido a partir do site atual da profissional.", en: "One-page institutional site for an architect specialized in commercial spaces, with a project gallery, a service list, the work process with a 3D model that assembles as you scroll (on mobile, one board per step) and direct contact by WhatsApp and email. Built from the professional's current site." },
    role: { pt: "Desenvolvedor front-end (solo)", en: "Front-end developer (solo)" },
    stack: ["React", "TypeScript", "Vite", "Tailwind", "Framer Motion", "Three.js"],
    github: "https://github.com/joaobatis1a/rafa-portfolio",
    demo: "https://rafa-portfolio-eta.vercel.app/",
    trailer: null,
    award: null,
    island: "solo", logo: "/logos/projects/rafa.png",
    mx: 620, my: 300,
    color: palette(201, 183, 154, 245, 240, 230, "#c9b79a"),
  },
  {
    id: "driblou",
    name: "Driblou Caiu",
    period: { pt: "Ago 2026 – Nov 2026", en: "Aug 2026 – Nov 2026" },
    shortDesc: { pt: "Site oficial de um clube de Pro Clubs no EA FC 26, com elenco, esquema tático interativo, jogos e um painel para atualizar tudo sem mexer no código.", en: "Official website of a Pro Clubs team in EA FC 26, with squad, interactive tactical board, matches and an admin panel to update everything without touching code." },
    fullDesc: { pt: "Site oficial do Driblou Caiu, clube de Pro Clubs no EA FC 26, com identidade visual de futebol de várzea: muro caiado com estêncil, placar de chapa, álbum de figurinhas, lambe-lambe e súmula datilografada. Tem elenco, esquema tático com os 11 slots no campo, próximo jogo com contagem regressiva, súmula de resultados e estatísticas por clube, jogadores, líderes, evolução e confrontos. No rodapé, um muro em que o visitante picha com spray. O painel admin, protegido por senha, registra partidas, monta a escalação arrastando os jogadores e gerencia o elenco; artilharia e aproveitamento são calculados a partir das partidas. Os dados ficam num Redis (Upstash).", en: "Official website of Driblou Caiu, a Pro Clubs team in EA FC 26, with a grassroots-football visual identity: whitewashed wall with stencil lettering, tin scoreboard, sticker album, wheat-paste posters and a typewritten match sheet. It has the squad, a tactical board with the 11 slots on the pitch, next match with countdown, match sheet and stats by club, players, leaders, evolution and head-to-head. At the footer, a wall where visitors spray-paint. The password-protected admin panel logs matches, builds the lineup by dragging players and manages the squad; top scorers and win rate are computed from the matches. Data lives in a Redis (Upstash)." },
    role: { pt: "Papel a confirmar", en: "Role to be confirmed" },
    stack: ["TanStack Start", "React", "TypeScript", "Tailwind", "Framer Motion", "Lenis", "Upstash Redis"],
    github: "https://github.com/joaobatis1a/dribloucaiu-landing",
    demo: "https://dribloucaiu-landing.vercel.app",
    trailer: null,
    award: null,
    island: "solo", logo: "/logos/projects/driblou.png",
    mx: 120, my: 380,
    color: palette(220, 38, 38, 252, 165, 165, "#dc2626"),
  },
];

/** Quantidade de projetos: a mesma lista da seção Projetos (usada também no texto de Sobre) */
export const PROJECTS_TOTAL = UNLOCKED.length;
