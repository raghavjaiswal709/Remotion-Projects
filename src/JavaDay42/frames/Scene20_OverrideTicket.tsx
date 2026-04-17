/**
 * Scene 20 — Override In Ticket
 * "We override each one inside the Ticket class."
 * CSV: 89.700s → 94.940s
 * Duration: 157 frames (5.23s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–18):   Label + headline
 *   Phase 2 (frames 12–70):  Ticket class code with 3 overrides
 *   Phase 3 (frames 60–end): Micro-animations
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, SectionLabel, BentoCard } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const MONO = "'Fira Code', 'Courier New', monospace";

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, dur = 30) {
  const p = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - p);
}

export const Scene20_OverrideTicket: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headA    = useSpringEntrance(frame, 4);
  const headB    = useSpringEntrance(frame, 9);

  // ── Phase 2 — Class diagram ────────────────────────────────────────────────
  const classEnt = useSpringEntrance(frame, 14);

  const methods = [
    { name: '@Override toString()', body: 'return seat + " " + coach;', delay: 22 },
    { name: '@Override equals(Object o)', body: 'return this.pnr == t.pnr;', delay: 32 },
    { name: '@Override hashCode()', body: 'return Objects.hash(pnr);', delay: 42 },
  ];
  const methEnts = methods.map(m => useSpringEntrance(frame, m.delay));

  // Connector
  const connDash = usePathDraw(frame, 50, 140, 20);

  // Bottom card
  const btmEnt = useSpringEntrance(frame, 56);
  const btm2Ent = useSpringEntrance(frame, 64);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.012;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s20.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="OVERRIDE · TICKET" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={270} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Override Each
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={360} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent}>
            Inside the Ticket class
          </text>
        </g>

        {/* ── Class header card ───────────────────────────────────────── */}
        <g opacity={classEnt.opacity} transform={`translate(0, ${classEnt.translateY})`}>
          <BentoCard x={60} y={430} w={960} h={80} accent />
          <text x={100} y={482} fontFamily={MONO} fontSize={30} fontWeight={800} fill={COLORS.accent}>
            class Ticket extends Object
          </text>
        </g>

        {/* ── Three override method cards ──────────────────────────────── */}
        {methods.map((m, i) => {
          const cardY = 540 + i * 200;
          return (
            <g key={i} opacity={methEnts[i].opacity}
              transform={`translate(0, ${methEnts[i].translateY})`}>
              <BentoCard x={100} y={cardY} w={880} h={170} />
              {/* Green left bar = override */}
              <rect x={100} y={cardY} width={6} height={170} rx={3} fill={COLORS.accent} />
              {/* @Override badge */}
              <rect x={130} y={cardY + 14} width={120} height={30} rx={15}
                fill={COLORS.accent} fillOpacity={0.12} />
              <text x={190} y={cardY + 36} textAnchor="middle"
                fontFamily={MONO} fontSize={18} fontWeight={800} fill={COLORS.accent}>
                @Override
              </text>
              {/* Method name */}
              <text x={130} y={cardY + 84} fontFamily={MONO} fontSize={24} fontWeight={800}
                fill={COLORS.white}>{m.name}</text>
              {/* Method body */}
              <text x={150} y={cardY + 126} fontFamily={MONO} fontSize={22} fontWeight={500}
                fill={COLORS.text_muted}>{m.body}</text>
              {/* Check mark */}
              <g transform={`translate(920, ${cardY + 56})`}>
                <circle cx={0} cy={0} r={16} fill={COLORS.accent} fillOpacity={0.12} />
                <path d="M -6,0 L -2,5 L 7,-5" fill="none" stroke={COLORS.accent}
                  strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </g>
          );
        })}

        {/* ── Connector line from class header to methods ──────────────── */}
        <line x1={540} y1={510} x2={540} y2={540}
          stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={140} strokeDashoffset={connDash}
          strokeLinecap="round" />

        {/* ── Bottom info card ─────────────────────────────────────────── */}
        <g opacity={btmEnt.opacity} transform={`translate(0, ${btmEnt.translateY})`}>
          <BentoCard x={60} y={1160} w={960} h={120} accent />
          <text x={100} y={1232} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Same method name — new, specific behavior
          </text>
        </g>

        {/* ── Ticket illustration ──────────────────────────────────────── */}
        <g opacity={btm2Ent.opacity} transform={`translate(0, ${btm2Ent.translateY})`}>
          <BentoCard x={60} y={1320} w={960} h={300} />
          {/* Ticket shape */}
          <rect x={140} y={1360} width={800} height={220} rx={16}
            fill="rgba(216,118,86,0.06)" stroke={COLORS.accent} strokeWidth={2} />
          {/* Perforation */}
          {Array.from({ length: 18 }, (_, i) => (
            <circle key={i} cx={340} cy={1370 + i * 12} r={2}
              fill={COLORS.accent} fillOpacity={0.3} />
          ))}
          {/* Left side — ticket info */}
          <text x={180} y={1410} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>TICKET</text>
          <text x={180} y={1452} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.white}>Seat: 42A</text>
          <text x={180} y={1488} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.white}>Coach: S4</text>
          <text x={180} y={1524} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>PNR: 8374291</text>
          {/* Right side — method outputs */}
          <text x={440} y={1410} fontFamily={MONO} fontSize={22} fontWeight={500}
            fill={COLORS.accent}>toString → "42A S4"</text>
          <text x={440} y={1452} fontFamily={MONO} fontSize={22} fontWeight={500}
            fill={COLORS.accent}>equals → compare PNR</text>
          <text x={440} y={1494} fontFamily={MONO} fontSize={22} fontWeight={500}
            fill={COLORS.accent}>hashCode → hash(PNR)</text>
        </g>

        {/* ── Floaters ────────────────────────────────────────────────── */}
        <circle cx={100} cy={1700 + breathe} r={3} fill={COLORS.accent} fillOpacity={0.12 * shimmer} />
        <circle cx={980} cy={1680 - breathe} r={2} fill={COLORS.accent} fillOpacity={0.08} />
        <g transform={`translate(540, ${1720 + breathe * 0.5})`}>
          <circle cx={0} cy={0} r={24} fill="none" stroke={COLORS.accent} strokeWidth={1}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }}
            opacity={0.15} />
        </g>

        {/* ── CAPTION ─────────────────────────────────────────────────── */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s20.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
