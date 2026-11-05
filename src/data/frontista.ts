/*
  Conteúdo do carrossel do Frontista.

  Cada fileira é uma lista de tiles. A proporção (ratio) define o formato do tile:
  "9/16" (Reels/TikTok), "3/4", "4/5", "1/1", "16/9".
  Textos aceitam string simples ou { pt, en }.

  Para adicionar um vídeo:
    1. coloque o arquivo em public/frontista/ (WebM ou MP4, sem áudio, até ~1 MB, 8 a 12 s)
    2. coloque uma imagem de capa ao lado (JPG, mesmo formato do vídeo)
    3. acrescente na fileira:
       { kind: "video", src: "/frontista/meu-video.webm", poster: "/frontista/meu-video.jpg", ratio: "9/16",
         title: { pt: "Título", en: "Title" }, href: "https://tiktok.com/@frontista/video/..." }
  Para uma foto: { kind: "image", src: "/frontista/foto.jpg", alt: { pt, en }, ratio: "3/4", title?: { pt, en } }
*/
import type { L10n } from "../i18n/context";

export type Ratio = "9/16" | "3/4" | "4/5" | "1/1" | "16/9";
export type Accent = "green" | "cyan" | "pink";
export type Text = string | L10n;

export type FrontistaTile =
  | { kind: "motion"; project: string; ratio: Ratio }
  | { kind: "video"; src: string; poster?: string; ratio: Ratio; title?: Text; href?: string }
  | { kind: "image"; src: string; alt: Text; ratio: Ratio; title?: Text; href?: string }
  | { kind: "note"; text: Text; tag?: Text; ratio: Ratio; accent?: Accent; display?: boolean };

export interface FrontistaRow {
  /** 1 = anda para a esquerda, -1 = para a direita */
  dir: 1 | -1;
  /** velocidade base em px/s */
  speed: number;
  /** altura do tile em px (desktop / celular) */
  height: [number, number];
  tiles: FrontistaTile[];
}

const V = "/frontista/";

export const FRONTISTA_ROWS: FrontistaRow[] = [
  {
    dir: 1, speed: 38, height: [250, 170],
    tiles: [
      { kind: "motion", project: "kairos", ratio: "16/9" },
      { kind: "note", text: "front\n+ batista", tag: "@frontista", ratio: "1/1", accent: "green", display: true },
      { kind: "video", src: V + "joao-fala.webm", poster: V + "joao-fala.jpg", ratio: "9/16", title: "@frontista" },
      { kind: "motion", project: "praxis", ratio: "4/5" },
      { kind: "note", text: { pt: "Programação não precisa ser difícil de entender. Só precisa ser bem explicada.", en: "Programming doesn't have to be hard to understand. It just has to be well explained." }, tag: "manifesto", ratio: "3/4", accent: "cyan" },
      { kind: "image", src: V + "foto-porto-digital.jpg", alt: { pt: "Letreiro do Porto Digital, em Recife", en: "Porto Digital sign in Recife" }, ratio: "3/4", title: "Porto Digital · Recife" },
      { kind: "motion", project: "confluencia", ratio: "16/9" },
      { kind: "note", text: { pt: "> furar a bolha da comunidade tech", en: "> break out of the tech bubble" }, tag: { pt: "missão 01", en: "mission 01" }, ratio: "4/5", accent: "green" },
    ],
  },
  {
    dir: -1, speed: 52, height: [190, 130],
    tiles: [
      { kind: "motion", project: "nyxa", ratio: "1/1" },
      { kind: "note", text: { pt: "> levar código para quem não veio da área", en: "> bring code to people outside tech" }, tag: { pt: "missão 02", en: "mission 02" }, ratio: "16/9", accent: "pink" },
      { kind: "video", src: V + "praxis.webm", poster: V + "praxis.jpg", ratio: "16/9", title: "Praxis", href: "https://demo-praxis.vercel.app/" },
      { kind: "image", src: V + "foto-espelho.jpg", alt: { pt: "João em uma foto no espelho", en: "João in a mirror photo" }, ratio: "3/4" },
      { kind: "motion", project: "capsula", ratio: "4/5" },
      { kind: "motion", project: "vessa", ratio: "16/9" },
      { kind: "note", text: { pt: "transmissão\nem andamento", en: "broadcast\nin progress" }, tag: { pt: "● ao vivo", en: "● live" }, ratio: "1/1", accent: "cyan", display: true },
      { kind: "motion", project: "nina", ratio: "3/4" },
    ],
  },
  {
    dir: 1, speed: 30, height: [230, 160],
    tiles: [
      { kind: "motion", project: "ponte", ratio: "16/9" },
      { kind: "note", text: { pt: "> despertar curiosidade pela programação", en: "> spark curiosity about programming" }, tag: { pt: "missão 03", en: "mission 03" }, ratio: "9/16", accent: "green" },
      { kind: "motion", project: "benevo", ratio: "4/5" },
      { kind: "video", src: V + "nyxa.webm", poster: V + "nyxa.jpg", ratio: "9/16", title: "Nyxa", href: "https://nyxa-nft-marketplace.vercel.app/" },
      { kind: "image", src: V + "foto-hacka-business.jpg", alt: { pt: "Telão do Hacka Business com a frase Experimente, aprenda, construa", en: "Hacka Business screen reading Experiment, learn, build" }, ratio: "3/4", title: "Hacka Business · Avanade" },
      { kind: "note", text: { pt: "> tornar o aprendizado leve e acessível", en: "> make learning light and accessible" }, tag: { pt: "missão 04", en: "mission 04" }, ratio: "1/1", accent: "pink" },
      { kind: "motion", project: "limpattack", ratio: "16/9" },
      { kind: "note", text: { pt: "bastidores,\nprocesso e\nprojetos", en: "behind the\nscenes, process\n& projects" }, tag: "reels · tiktok", ratio: "3/4", accent: "cyan", display: true },
    ],
  },
  {
    dir: -1, speed: 44, height: [220, 150],
    tiles: [
      { kind: "video", src: V + "bastidores-notebook.webm", poster: V + "bastidores-notebook.jpg", ratio: "9/16", title: { pt: "Bastidores", en: "Behind the scenes" } },
      { kind: "note", text: { pt: "projetos\nrodando de\nverdade", en: "projects\nrunning\nfor real" }, tag: "● rec", ratio: "1/1", accent: "pink", display: true },
      { kind: "video", src: V + "confluencia.webm", poster: V + "confluencia.jpg", ratio: "16/9", title: "Confluência", href: "https://confluencia-liart.vercel.app/" },
      { kind: "image", src: V + "foto-aula.jpg", alt: { pt: "Sala de aula com o professor explicando o modelo OSI", en: "Classroom with the teacher explaining the OSI model" }, ratio: "9/16", title: { pt: "Em aula", en: "In class" } },
      { kind: "note", text: { pt: "> do Figma ao deploy", en: "> from Figma to deploy" }, tag: { pt: "processo", en: "process" }, ratio: "4/5", accent: "green" },
      { kind: "video", src: V + "capsula.webm", poster: V + "capsula.jpg", ratio: "16/9", title: "Cápsula", href: "https://capsula-mvp.vercel.app/" },
      { kind: "image", src: V + "foto-selfie.jpg", alt: { pt: "João em uma selfie no espelho", en: "João taking a mirror selfie" }, ratio: "9/16" },
    ],
  },
  {
    dir: 1, speed: 36, height: [200, 140],
    tiles: [
      { kind: "video", src: V + "vessa.webm", poster: V + "vessa.jpg", ratio: "9/16", title: "VESSA", href: "https://vessa-atelie.vercel.app/" },
      { kind: "image", src: V + "foto-visita-mv.jpg", alt: { pt: "Recepção da MV, healthtech, com estudantes aguardando", en: "MV healthtech lobby with students waiting" }, ratio: "3/4", title: "MV · healthtech" },
      { kind: "note", text: { pt: "aprendendo\nem público", en: "learning\nin public" }, tag: "@frontista", ratio: "1/1", accent: "green", display: true },
      { kind: "video", src: V + "nina.webm", poster: V + "nina.jpg", ratio: "9/16", title: "Nina Brinquedos", href: "https://ninabrinquedos-mvp.vercel.app/" },
      { kind: "image", src: V + "foto-mesa-aclf.jpg", alt: { pt: "Mesa de trabalho no Grupo ACLF com desenhos de símbolos de heróis", en: "Work desk at Grupo ACLF with hand-drawn hero symbols" }, ratio: "3/4", title: "Grupo ACLF" },
      { kind: "note", text: { pt: "> código explicado sem frescura", en: "> code explained, no fluff" }, tag: { pt: "conteúdo", en: "content" }, ratio: "4/5", accent: "cyan" },
    ],
  },
];

export const FRONTISTA_LINKS = {
  tiktok: "https://tiktok.com/@frontista",
  instagram: "https://instagram.com/frontista",
};
