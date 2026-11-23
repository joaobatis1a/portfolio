import { createContext, useContext, useEffect, useRef, useState, type CSSProperties } from "react";
import "./Projects.css";
import { UNLOCKED } from "../data/projects";
import { useLang, type L10n } from "../i18n/context";

/* ── Per-project card effects ── */

// Limpattack: pixel fox walks across the card
function LimpattackEffect() {
  const t = useClock();

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
  const { t: tr } = useLang();
  const t = useClock();

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
        {carrying ? tr("TRANSPORTE EM CURSO", "IN TRANSIT") : placing ? tr("ARMAZENANDO...", "STORING...") : tr("AGUARDANDO CARGA", "AWAITING CARGO")}
      </text>
    </svg>
  );
}

// Ponte: clean pixel bridge — solid arch, no suspension cables, person walking across
function PonteEffect() {
  const t = useClock();

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
  const { t: tr } = useLang();
  const t = useClock();

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
        {tr("CONECTANDO O CONHECIMENTO", "CONNECTING KNOWLEDGE")}
      </text>
    </svg>
  );
}

// Kairos: pixel barbershop — the pole spins, the scissors snip, the chair frees up
function KairosEffect() {
  const { t: tr } = useLang();
  const t = useClock();

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
        {done ? tr("CADEIRA LIVRE", "CHAIR FREE") : tr("CORTE EM ANDAMENTO", "CUT IN PROGRESS")}
      </text>
    </svg>
  );
}

// Relógio compartilhado pelos efeitos novos: segundos desde a montagem
/* Quadros por segundo das animações: 60 no mapa, menos no carrossel do Frontista (várias ao mesmo tempo) */
const ClockFps = createContext(60);

/* fps 0 = animação congelada num quadro bonito (custa só uma renderização, nenhum loop) */
const FROZEN_T = 1.35;

function useClock() {
  const fps = useContext(ClockFps);
  const [t, setT] = useState(fps === 0 ? FROZEN_T : 0);
  const tRef = useRef(t);
  const rafRef = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (fps === 0) return;
    // continua de onde parou (quando uma animação congelada ganha vaga para rodar)
    let start: number | undefined;
    let last = -Infinity;
    const minGap = 1000 / fps - 1;
    const tick = (ts: number) => {
      if (start === undefined) start = ts - tRef.current * 1000;
      if (ts - last >= minGap) { last = ts; tRef.current = (ts - start) / 1000; setT(tRef.current); }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current!);
  }, [fps]);
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
  const { t: tr } = useLang();
  const t = useClock();
  const Y = "rgba(245,184,0,";
  const YL = "rgba(254,240,138,";
  const buildings = [[14, 22], [34, 34], [58, 18], [128, 30], [152, 40], [176, 24], [196, 32]];
  const columns = [[86, 0], [100, 1.7], [114, 3.1]];
  const cycle = 2.4;
  const phase = (t % cycle) / cycle;
  const pinY = 20 + Math.min(1, phase * 1.6) * 64;
  const steps = tr(["RELATO NO MAPA", "CONSULTA ABERTA", "OBRA ENTREGUE"], ["REPORT ON THE MAP", "CONSULTATION OPEN", "WORK DELIVERED"]);
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
  const { t: tr } = useLang();
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
        <text x="34" y="3" fill={`${CL}0.6)`} fontSize="6" fontFamily="monospace">{tr(`${clicks} CLIQUE${clicks === 1 ? "" : "S"} · 1 PEDIDO`, `${clicks} CLICK${clicks === 1 ? "" : "S"} · 1 ORDER`)}</text>
      </g>
      <EffectLabel text={tr("PREÇO AO VIVO", "LIVE PRICE")} color={C} light={CL} />
    </svg>
  );
}

// Cápsula: a cápsula abre em peças de feed, story e banner, e o checklist confere cada uma
function CapsulaEffect() {
  const { t: tr } = useLang();
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
      <EffectLabel text={blocked ? tr("BLOQUEADO: REGRA DA ANVISA", "BLOCKED: ANVISA RULE") : tr("CHECKLIST ANVISA OK", "ANVISA CHECKLIST OK")} color={I} light={IL} />
    </svg>
  );
}

// VESSA: um fio costura o card de ponta a ponta, com nós e a agulha na frente
function VessaEffect() {
  const { t: tr } = useLang();
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
      <EffectLabel text={tr("COSTURANDO A PÁGINA", "STITCHING THE PAGE")} color={T} light={R} />
    </svg>
  );
}

// Nina Brinquedos: brinquedos caindo no carrinho e a bola quicando
function NinaEffect() {
  const { t: tr } = useLang();
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
      <EffectLabel text={tr(`CARRINHO: ${landed} ${landed === 1 ? "ITEM" : "ITENS"}`, `CART: ${landed} ${landed === 1 ? "ITEM" : "ITEMS"}`)} color={V} light={VL} />
    </svg>
  );
}

// Driblou Caiu: o drible, a queda do marcador e o gol (cena em pixel, gerada como SVG a cada quadro)
function DriblouEffect() {
  const { t: tr } = useLang();
  const t = useClock();
  const f = (n: number) => Math.round(n * 100) / 100;
  const sin = Math.sin, abs = Math.abs;
  const r = (x: number, y: number, w: number, h: number, c: string, o?: number) =>
    `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${c}"${o === undefined ? "" : ` opacity="${f(o)}"`}/>`;
  const ln = (x1: number, y1: number, x2: number, y2: number, c: string, w = 1) =>
    `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${c}" stroke-width="${w}"/>`;
  const R = "rgba(220,38,38,", Y = "rgba(250,204,21,", W = "rgba(255,255,255,";
  const SK = "rgba(232,202,172,0.95)", DK = "rgba(24,24,24,0.95)";
  const cy = 4.4, p = (t % cy) / cy, run = Math.min(1, p / 0.78), ax = 20 + run * 146, lp = t * 9, sw = sin(lp) > 0;
  const bob = p < 0.78 ? abs(sin(lp)) * 1.4 : 0;
  const fk = Math.min(1, Math.max(0, (p - 0.4) / 0.1));
  const dodge = p > 0.3 && p < 0.48 ? -7 * sin(((p - 0.3) / 0.18) * Math.PI) : 0;
  const goal = p > 0.8, k = goal ? Math.min(1, (p - 0.8) / 0.14) : 0;
  let s = "";
  for (let i = 0; i < 11; i++) s += r(i * 20, 112, 20, 10, i % 2 ? "rgba(34,197,94,0.11)" : "rgba(34,197,94,0.05)");
  s += ln(0, 112, 220, 112, W + "0.32)") + ln(96, 112, 96, 122, W + "0.2)");
  [[20, 20], [58, 12], [128, 16], [176, 26], [98, 26]].forEach(([x, y], i) => { s += r(x, y, 2, 2, Y + "0.5)", 0.25 + 0.5 * abs(sin(t * 1.1 + i))); });
  s += r(196, 68, 3, 44, W + "0.9)") + r(196, 68, 24, 3, W + "0.9)");
  for (let i = 0; i < 4; i++) s += r(202 + i * 5, 71, 1, 41, W + "0.18)");
  for (let j = 0; j < 5; j++) s += r(199, 77 + j * 7, 21, 1, W + "0.18)");
  if (k >= 1) s += r(199, 71, 21, 41, Y + f(0.28 * abs(sin(t * 10))) + ")");
  s += `<g transform="translate(112,112) rotate(${f(fk * 86)})">${r(-4, -30, 8, 7, SK)}${r(-4, -32, 8, 3, DK)}${r(-5, -23, 10, 11, W + "0.92)")}${r(-4, -12, 3, 9, DK)}${r(1, -12, 3, 9, DK)}${r(-5, -3, 4, 3, W + "0.9)")}${r(1, -3, 4, 3, W + "0.9)")}</g>`;
  if (fk >= 1) [[126, 96], [134, 88], [120, 86]].forEach(([x, y], i) => { s += `<g opacity="${f(0.45 + 0.45 * sin(t * 8 + i))}">${r(x, y - 2, 1.5, 5, Y + "0.95)")}${r(x - 2, y, 5, 1.5, Y + "0.95)")}</g>`; });
  s += `<g transform="translate(${f(ax)},${f(112 - bob + dodge)})">${r(-4, -30, 8, 7, SK)}${r(-4, -32, 8, 3, "rgba(58,42,26,0.95)")}${r(-5, -23, 10, 11, R + "0.96)")}${r(-1, -23, 2, 11, W + "0.85)")}${r(sw ? -8 : 5, -21, 3, 6, SK)}${r(sw ? 5 : -8, -21, 3, 6, SK)}${r(sw ? -5 : -1, -12, 3, 9, DK)}${r(sw ? 1 : -4, -12, 3, 9, DK)}${r(sw ? -6 : -2, -3, 5, 3, Y + "0.95)")}${r(sw ? 0 : -5, -3, 5, 3, Y + "0.95)")}</g>`;
  const bx = goal ? ax + 9 + k * (207 - ax - 9) : ax + 9 + (sw ? 2 : 0);
  const by = goal ? 106 - 12 * sin(k * Math.PI) : 108 - abs(sin(lp)) * 3 + dodge * 0.6;
  s += r(bx - 3, by - 3, 6, 6, "#fff") + r(bx - 1, by - 1, 2, 2, "#111");
  for (let i = 0; i < 3; i++) { const dx = ax - 10 - i * 7, o = p < 0.78 ? Math.max(0, 0.3 - i * 0.1) * abs(sin(t * 9 + i)) : 0; s += r(dx, 110, 4, 2, W + "0.5)", o); }
  const label = p < 0.4 ? "DRIBLOU" : p < 0.8 ? tr("CAIU", "FELL") : tr("GOL DO DRIBLOU CAIU", "DRIBLOU CAIU SCORES");
  const lw = Math.max(70, label.length * 4.4 + 14);
  s += `<rect x="${110 - lw / 2}" y="4" width="${lw}" height="12" rx="2" fill="${R}0.08)" stroke="${R}0.2)" stroke-width="0.5"/><text x="110" y="13" text-anchor="middle" fill="rgba(252,165,165,0.65)" font-size="6.5" font-family="monospace" letter-spacing="0.5">${label}</text>`;
  return <svg viewBox="0 0 220 140" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges" style={SVG_STYLE} aria-hidden="true" dangerouslySetInnerHTML={{ __html: s }} />;
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
  driblou: DriblouEffect,
};

/* Animação de um projeto como tile solto (usada no carrossel do Frontista) */
export function ProjectMotion({ id, fps = 60, bare = false }: { id: string; fps?: number; bare?: boolean }) {
  const Effect = CARD_EFFECTS[id];
  const p = UNLOCKED.find(u => u.id === id);
  if (!Effect || !p) return null;
  const c = p.color;
  return (
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 45%, ${c.bg}, rgba(3,7,5,0.97) 78%)` }}>
      <ClockFps.Provider value={fps}><Effect /></ClockFps.Provider>
      {!bare && <div style={{ position: "absolute", left: 12, right: 12, bottom: 10, display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
        <span style={{ color: c.text, fontWeight: 600, fontSize: 13 }}>{p.name}</span>
        <span style={{ color: c.text, opacity: 0.5, fontSize: 9, fontFamily: "monospace", letterSpacing: 1, whiteSpace: "nowrap" }}>MOTION</span>
      </div>}
    </div>
  );
}

/* ── Seção Projetos: parede de monitores ──
   Aparelho de TV (tela + painel de controle) à esquerda, parede de canais à direita e a ficha do projeto
   abaixo da tela. Cada projeto assume as próprias cores e a fonte do repositório quando entra no ar. */

const PER_PAGE = 10;

/* personalidade de cada projeto: cor, segunda cor da marca, fonte do repositório e cor do texto sobre a cor */
const THEME: Record<string, { c: string; c2: string; on: string; f: string; w: number; st?: string; ls: string; tt?: string; fs: number }> = {
  kairos:      { c: "#f43f5e", c2: "#fda4af", on: "#fff",    f: "'Big Shoulders'", w: 800, tt: "uppercase", ls: ".01em", fs: 1 },
  praxis:      { c: "#14b8a6", c2: "#4f7df9", on: "#02130a", f: "'Bricolage Grotesque'", w: 700, ls: "-.03em", fs: .82 },
  confluencia: { c: "#f5b800", c2: "#fef08a", on: "#1a1400", f: "'Instrument Serif'", w: 400, st: "italic", ls: "-.01em", fs: .92 },
  nyxa:        { c: "#d28a4c", c2: "#f0c496", on: "#140d0a", f: "'Roboto Mono'", w: 700, tt: "uppercase", ls: "-.05em", fs: .7 },
  capsula:     { c: "#6366f1", c2: "#ff5a1f", on: "#fff",    f: "'Nunito Sans'", w: 900, ls: "-.03em", fs: .8 },
  vessa:       { c: "#e8c3af", c2: "#bd5b35", on: "#16130d", f: "'Cormorant Garamond'", w: 600, st: "italic", ls: ".01em", fs: .98 },
  nina:        { c: "#8b5cf6", c2: "#f2600a", on: "#fff",    f: "'Baloo 2'", w: 800, ls: "-.01em", fs: .8 },
  ponte:       { c: "#f97316", c2: "#fdba74", on: "#1c0a00", f: "'Sora'", w: 800, ls: "-.04em", fs: .7 },
  benevo:      { c: "#3b82f6", c2: "#93c5fd", on: "#fff",    f: "'Shrikhand'", w: 400, ls: "0", fs: .78 },
  limpattack:  { c: "#fbbf24", c2: "#fb923c", on: "#1c1917", f: "'Press Start 2P'", w: 400, ls: "-.02em", fs: .4 },
  driblou:     { c: "#dc2626", c2: "#facc15", on: "#fff",    f: "'Big Shoulders Stencil','Big Shoulders'", w: 800, tt: "uppercase", ls: ".02em", fs: 1 },
};

const CATEGORY: Record<string, L10n> = {
  kairos:      { pt: "SaaS de agendamento", en: "Booking SaaS" },
  praxis:      { pt: "Gestão do conhecimento", en: "Knowledge management" },
  confluencia: { pt: "Plataforma cívica", en: "Civic platform" },
  nyxa:        { pt: "Marketplace de NFTs", en: "NFT marketplace" },
  capsula:     { pt: "Estúdio criativo com IA", en: "AI creative studio" },
  vessa:       { pt: "Landing page editorial", en: "Editorial landing page" },
  nina:        { pt: "Loja virtual", en: "Online store" },
  ponte:       { pt: "Plataforma de oportunidades", en: "Opportunities platform" },
  benevo:      { pt: "Gestão de doações", en: "Donation management" },
  limpattack:  { pt: "Jogo educativo", en: "Educational game" },
  driblou:     { pt: "Site de clube de Pro Clubs", en: "Pro Clubs club website" },
};

const themeVars = (id: string): CSSProperties => {
  const t = THEME[id];
  return {
    ["--c" as string]: t.c, ["--c2" as string]: t.c2, ["--on" as string]: t.on,
    ["--pf" as string]: `${t.f},var(--display)`, ["--pw" as string]: t.w, ["--ps" as string]: t.st ?? "normal",
    ["--pls" as string]: t.ls, ["--ptt" as string]: t.tt ?? "none", ["--pfs" as string]: t.fs,
  } as CSSProperties;
};

const pad = (n: number) => String(n + 1).padStart(2, "0");

const PX = {
  play: <svg viewBox="0 0 12 12" shapeRendering="crispEdges" aria-hidden="true"><path d="M3 1h2v10H3zM5 3h2v6H5zM7 5h2v2H7z" fill="currentColor" /></svg>,
  anim: <svg viewBox="0 0 12 12" shapeRendering="crispEdges" aria-hidden="true"><path d="M1 1h4v4H1zM7 1h4v4H7zM1 7h4v4H1zM7 7h4v4H7z" fill="currentColor" /></svg>,
  left: <svg viewBox="0 0 12 12" shapeRendering="crispEdges" aria-hidden="true"><path d="M7 1h2v10H7zM5 3h2v6H5zM3 5h2v2H3z" fill="currentColor" /></svg>,
  right: <svg viewBox="0 0 12 12" shapeRendering="crispEdges" aria-hidden="true"><path d="M3 1h2v10H3zM5 3h2v6H5zM7 5h2v2H7z" fill="currentColor" /></svg>,
  out: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3h7v7M13 3L4 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
};

function Projects() {
  const { lang, t, pick } = useLang();
  const N = UNLOCKED.length;
  const PAGES = Math.ceil(N / PER_PAGE);
  const [i, setI] = useState(0);
  const [mode, setMode] = useState<"a" | "t">("a");
  const [page, setPage] = useState(0);
  const [caseOpen, setCaseOpen] = useState(false);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const sectionRef = useRef<HTMLElement>(null);
  const crtRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const swipe = useRef<number | null>(null);
  const p = UNLOCKED[i];

  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(rm.matches);
    rm.addEventListener("change", on);
    return () => rm.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "80px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const go = (n: number, focusMon = false) => {
    const next = (n + N) % N;
    setI(next);
    setPage(Math.floor(next / PER_PAGE));
    setCaseOpen(false);
    const grid = gridRef.current;
    const mon = grid?.querySelectorAll<HTMLElement>(".mon:not(.off)")[next];
    if (mon && grid && grid.scrollWidth > grid.clientWidth) grid.scrollTo({ left: mon.offsetLeft - grid.clientWidth / 2 + mon.offsetWidth / 2, behavior: reduced ? "auto" : "smooth" });
    if (focusMon) mon?.focus();
  };

  const monFps = reduced || !inView ? 0 : 8;
  const screenFps = reduced || !inView ? 0 : 30;
  const teamLabel = p.id === "driblou" ? t("Formato a confirmar", "Format to be confirmed") : p.island === "team" ? t("Em equipe", "Team project") : t("Projeto individual", "Solo project");
  const award = p.award ? pick(p.award).replace(/🏆\s*/, "") : null;
  const total = String(N).padStart(2, "0");

  const onGridKey = (e: React.KeyboardEvent) => {
    const k = e.key;
    const n = k === "ArrowRight" ? i + 1 : k === "ArrowLeft" ? i - 1 : k === "ArrowDown" ? i + 2 : k === "ArrowUp" ? i - 2 : k === "Home" ? 0 : k === "End" ? N - 1 : null;
    if (n !== null) { e.preventDefault(); go(Math.max(0, Math.min(N - 1, n)), true); }
  };

  return (
    <section ref={sectionRef} id="projects" className="pw relative px-4 py-24 md:px-8">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="pw-title text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400 bg-clip-text text-transparent text-center">
          <span className="text-emerald-400/40 font-light">&lt;</span>{" "}{t("Projetos", "Projects")}{" "}<span className="text-emerald-400/40 font-light">/&gt;</span>
        </h2>
        <p className="mt-4 mb-16 mx-auto max-w-2xl text-center text-sm leading-relaxed text-zinc-400">{t("Cada projeto no seu canal. Escolha um monitor para ver a animação, a stack e o case.", "Each project on its own channel. Pick a monitor to see the animation, the stack and the case.")}</p>
        <div className="sec" style={themeVars(p.id)}>
          <div className="sec-h">
            <div>
              <h2>{t("No ar", "On air")} <span className="grad">{t("agora", "now")}</span></h2>
            </div>

          </div>

          <div className="tv">
            {/* Aparelho */}
            <div className="set">
              <div ref={crtRef} className="crt" tabIndex={0} role="group" aria-roledescription={t("tela", "screen")} aria-label={t("Tela principal", "Main screen")}
                onKeyDown={e => { if (e.key === "ArrowRight") { e.preventDefault(); go(i + 1); } else if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1); } }}
                onPointerDown={e => { swipe.current = e.clientX; }}
                onPointerUp={e => { if (swipe.current === null) return; const dx = e.clientX - swipe.current; swipe.current = null; if (Math.abs(dx) > 45) go(i + (dx < 0 ? 1 : -1)); }}
                onPointerCancel={() => { swipe.current = null; }}>
                <div className="scr sbg" key={`${p.id}-${mode}`}>
                  {mode === "a"
                    ? <ProjectMotion id={p.id} fps={screenFps} bare />
                    : p.trailer
                      ? <video src={p.trailer} controls playsInline preload="metadata" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", background: "#000" }} />
                      : <div className="trl"><div><b>{t("TRAILER EM BREVE", "TRAILER COMING SOON")}</b><small>{t(`O vídeo de ${p.name} entra aqui`, `${p.name}'s video goes here`)}</small></div></div>}
                </div>
                <div className="glass" />
                <div className="zap" key={`z${i}${mode}`} />
                <div className="osd"><span>CH {pad(i)} / {total}</span><span className="live">{mode === "a" ? t("NO AR", "LIVE") : "TRAILER"}</span></div>
                <div className="osd-name pfn" key={`n${i}`}>{p.name}</div>
              </div>

              <div className="deck">
                <div className="grp">
                  <span className="glb">{t("Na tela", "On screen")}</span>
                  <div className="sw" role="radiogroup" aria-label={t("O que passa na tela", "What's on screen")}
                    onKeyDown={e => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); setMode(m => (m === "a" ? "t" : "a")); } }}>
                    <button className="px" type="button" role="radio" aria-checked={mode === "a"} onClick={() => setMode("a")}>{PX.anim}{t("Animação", "Animation")}</button>
                    <button className="px" type="button" role="radio" aria-checked={mode === "t"} onClick={() => setMode("t")}>{PX.play}Trailer</button>
                  </div>
                </div>
                <div className="grp chg">
                  <span className="glb">{t(`Canal ${pad(i)} de ${total}`, `Channel ${pad(i)} of ${total}`)}</span>
                  <div className="chx">
                    <button className="px sq" type="button" aria-label={t("Canal anterior", "Previous channel")} onClick={() => go(i - 1)}>{PX.left}</button>
                    <div className="ticks">
                      {UNLOCKED.map((u, n) => (
                        <button key={u.id} type="button" className={`tick${n === i ? " on" : ""}`} tabIndex={-1} style={themeVars(u.id)} onClick={() => go(n)}
                          aria-label={t(`Canal ${pad(n)}: ${u.name}`, `Channel ${pad(n)}: ${u.name}`)} />
                      ))}
                    </div>
                    <button className="px sq" type="button" aria-label={t("Próximo canal", "Next channel")} onClick={() => go(i + 1)}>{PX.right}</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Parede de canais */}
            <div className="wall" data-page={page}>
              <div className="wall-h"><p className="eyebrow">{t("Canais", "Channels")}</p><span className="dim" style={{ font: "600 11px var(--mono)" }}>{total} {t("no ar", "on air")}</span></div>
              <div ref={gridRef} className="wall-g" role="listbox" aria-label={t("Projetos", "Projects")} onKeyDown={onGridKey}>
                {UNLOCKED.map((u, n) => (
                  <button key={u.id} className="mon" type="button" role="option" aria-selected={n === i} tabIndex={n === i ? 0 : -1} data-pg={Math.floor(n / PER_PAGE)}
                    style={themeVars(u.id)} onClick={() => go(n)} aria-label={t(`Canal ${pad(n)}: ${u.name}`, `Channel ${pad(n)}: ${u.name}`)}>
                    <div className="sbg"><ProjectMotion id={u.id} fps={monFps} bare /></div>
                    <span className="no">CH {pad(n)}</span>
                    <span className="air">{t("NO AR", "LIVE")}</span>
                    <span className="mn pfn">{u.name}</span>
                  </button>
                ))}
                {Array.from({ length: PAGES * PER_PAGE - N }, (_, k) => (
                  <div key={`off${k}`} className="mon off" data-pg={PAGES - 1} aria-hidden="true"><span>{t("SEM SINAL", "NO SIGNAL")}<small>{t("próximo projeto", "next project")}</small></span></div>
                ))}
              </div>
              <p className="hint">{total} {t("canais. Deslize para ver todos.", "channels. Swipe to see them all.")}</p>
              <div className="pager">
                <span className="glb" aria-live="polite">{t(`Página ${page + 1} de ${PAGES}`, `Page ${page + 1} of ${PAGES}`)}</span>
                <div className="pgs" role="group" aria-label={t("Páginas de canais", "Channel pages")}>
                  {Array.from({ length: PAGES }, (_, k) => {
                    const a = k * PER_PAGE + 1;
                    const b = Math.min(N, (k + 1) * PER_PAGE);
                    return (
                      <button key={k} className="px sm" type="button" aria-pressed={k === page} aria-label={t(`Página ${k + 1}`, `Page ${k + 1}`)} onClick={() => setPage(k)}>
                        {String(a).padStart(2, "0")}{a === b ? "" : "–" + String(b).padStart(2, "0")}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Ficha */}
            <article className="card" aria-live="polite">
              <img className="wm" src={p.logo} alt="" key={`w${p.id}`} />
              <div className="tx" key={`t${p.id}`}>
                <p className="kick">{pick(CATEGORY[p.id])} · {teamLabel}</p>
                <h3 className="nm">{p.name}</h3>
                <p className="per">
                  <span>{pick(p.role)}</span><span>{pick(p.period)}</span>
                  {award && <span className="badge">{award} · UNIFAFIRE</span>}
                </p>
                <p className="sd">{pick(p.shortDesc)}</p>
                <ul className="chips">{p.stack.map(s => <li key={s}>{s}</li>)}</ul>
                <div className="links">
                  {p.demo && <a className="btn pri" href={p.demo} target="_blank" rel="noopener noreferrer">{t("Ver demo", "View demo")} {PX.out}</a>}
                  {p.github && <a className="btn" href={p.github} target="_blank" rel="noopener noreferrer">GitHub {PX.out}</a>}
                  <button className="btn" type="button" onClick={() => { setMode("t"); crtRef.current?.scrollIntoView({ block: "nearest", behavior: reduced ? "auto" : "smooth" }); crtRef.current?.focus({ preventScroll: true }); }}>{PX.play}{t("Ver trailer", "Watch trailer")}</button>
                </div>
                <button className="cbtn" type="button" aria-expanded={caseOpen} aria-controls="pw-case" onClick={() => setCaseOpen(o => !o)}>
                  {PX.right}<span>{caseOpen ? t("Fechar o case", "Close the case") : t("Ler o case completo", "Read the full case")}</span>
                </button>
                <div className={`cwrap${caseOpen ? " open" : ""}`} id="pw-case"><div><p>{pick(p.fullDesc)}</p></div></div>
              </div>
            </article>
          </div>
        </div>
      </div>
      <span hidden>{lang}</span>
    </section>
  );
}

export default Projects;
