/*
  Conteúdo do carrossel do Frontista.

  Cada fileira é uma lista de tiles. A proporção (ratio) define o formato do tile:
  "9/16" (Reels/TikTok), "3/4", "4/5", "1/1", "16/9".

  Para adicionar um vídeo:
    1. coloque o arquivo em public/frontista/ (MP4 H.264, sem áudio, até ~2 MB, 6 a 12 s)
    2. coloque uma imagem de capa ao lado (JPG/WebP, mesmo formato do vídeo)
    3. acrescente na fileira:
       { kind: "video", src: "/frontista/meu-video.mp4", poster: "/frontista/meu-video.jpg",
         ratio: "9/16", title: "Como centralizar uma div", href: "https://tiktok.com/@frontista/video/..." }
*/

export type Ratio = "9/16" | "3/4" | "4/5" | "1/1" | "16/9";
export type Accent = "green" | "cyan" | "pink";

export type FrontistaTile =
  | { kind: "motion"; project: string; ratio: Ratio }
  | { kind: "video"; src: string; poster?: string; ratio: Ratio; title?: string; href?: string }
  | { kind: "image"; src: string; alt: string; ratio: Ratio; href?: string }
  | { kind: "note"; text: string; tag?: string; ratio: Ratio; accent?: Accent; display?: boolean };

export interface FrontistaRow {
  /** 1 = anda para a esquerda, -1 = para a direita */
  dir: 1 | -1;
  /** velocidade base em px/s */
  speed: number;
  /** altura do tile em px (desktop / celular) */
  height: [number, number];
  tiles: FrontistaTile[];
}

export const FRONTISTA_ROWS: FrontistaRow[] = [
  {
    dir: 1, speed: 38, height: [250, 170],
    tiles: [
      { kind: "motion", project: "kairos", ratio: "16/9" },
      { kind: "note", text: "front\n+ batista", tag: "@frontista", ratio: "1/1", accent: "green", display: true },
      { kind: "video", src: "/frontista/vessa.webm", poster: "/frontista/vessa.jpg", ratio: "9/16", title: "VESSA", href: "https://vessa-atelie.vercel.app/" },
      { kind: "motion", project: "praxis", ratio: "4/5" },
      { kind: "note", text: "Programação não precisa ser difícil de entender. Só precisa ser bem explicada.", tag: "manifesto", ratio: "3/4", accent: "cyan" },
      { kind: "motion", project: "confluencia", ratio: "16/9" },
      { kind: "note", text: "> furar a bolha da comunidade tech", tag: "missão 01", ratio: "4/5", accent: "green" },
    ],
  },
  {
    dir: -1, speed: 52, height: [190, 130],
    tiles: [
      { kind: "motion", project: "nyxa", ratio: "1/1" },
      { kind: "note", text: "> levar código para quem não veio da área", tag: "missão 02", ratio: "16/9", accent: "pink" },
      { kind: "video", src: "/frontista/praxis.webm", poster: "/frontista/praxis.jpg", ratio: "16/9", title: "Praxis", href: "https://demo-praxis.vercel.app/" },
      { kind: "motion", project: "capsula", ratio: "4/5" },
      { kind: "motion", project: "vessa", ratio: "16/9" },
      { kind: "note", text: "transmissão\nem andamento", tag: "● ao vivo", ratio: "1/1", accent: "cyan", display: true },
      { kind: "motion", project: "nina", ratio: "3/4" },
    ],
  },
  {
    dir: 1, speed: 30, height: [230, 160],
    tiles: [
      { kind: "motion", project: "ponte", ratio: "16/9" },
      { kind: "note", text: "> despertar curiosidade pela programação", tag: "missão 03", ratio: "9/16", accent: "green" },
      { kind: "motion", project: "benevo", ratio: "4/5" },
      { kind: "video", src: "/frontista/nyxa.webm", poster: "/frontista/nyxa.jpg", ratio: "9/16", title: "Nyxa", href: "https://nyxa-nft-marketplace.vercel.app/" },
      { kind: "note", text: "> tornar o aprendizado leve e acessível", tag: "missão 04", ratio: "1/1", accent: "pink" },
      { kind: "motion", project: "limpattack", ratio: "16/9" },
      { kind: "note", text: "bastidores,\nprocesso e\nprojetos", tag: "reels · tiktok", ratio: "3/4", accent: "cyan", display: true },
    ],
  },
  {
    dir: -1, speed: 44, height: [220, 150],
    tiles: [
      { kind: "video", src: "/frontista/ta-na-rua.mp4", poster: "/frontista/ta-na-rua.jpg", ratio: "9/16", title: "Tá na Rua" },
      { kind: "note", text: "projetos\nrodando de\nverdade", tag: "● rec", ratio: "1/1", accent: "pink", display: true },
      { kind: "video", src: "/frontista/confluencia.webm", poster: "/frontista/confluencia.jpg", ratio: "16/9", title: "Confluência", href: "https://confluencia-liart.vercel.app/" },
      { kind: "note", text: "> do Figma ao deploy", tag: "processo", ratio: "4/5", accent: "green" },
      { kind: "video", src: "/frontista/capsula.webm", poster: "/frontista/capsula.jpg", ratio: "16/9", title: "Cápsula", href: "https://capsula-mvp.vercel.app/" },
    ],
  },
  {
    dir: 1, speed: 66, height: [120, 90],
    tiles: [
      { kind: "note", text: "React", tag: "stack", ratio: "16/9", accent: "cyan", display: true },
      { kind: "note", text: "Next.js", tag: "stack", ratio: "16/9", accent: "green", display: true },
      { kind: "note", text: "TypeScript", tag: "stack", ratio: "16/9", accent: "cyan", display: true },
      { kind: "note", text: "Supabase", tag: "stack", ratio: "16/9", accent: "green", display: true },
      { kind: "note", text: "Tailwind", tag: "stack", ratio: "16/9", accent: "pink", display: true },
      { kind: "note", text: "Figma", tag: "design", ratio: "16/9", accent: "pink", display: true },
      { kind: "note", text: "Framer Motion", tag: "motion", ratio: "16/9", accent: "cyan", display: true },
    ],
  },
];

export const FRONTISTA_LINKS = {
  tiktok: "https://tiktok.com/@frontista",
  instagram: "https://instagram.com/frontista",
};
