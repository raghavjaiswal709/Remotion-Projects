/**
 * Scene 10 — Finds Express
 * "It finds ExpressFareCalculator."
 * CSV: 37.280s → 39.680s
 * Duration: 73 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–20): Headline springs
 *   Phase 2 (frames 15–45): Magnifying glass + target card
 *   Phase 3 (frames 40–end): Glow pulse on found object
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
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, durationFrames = 30) {
  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene10_FindsExpress: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelE = useSpringEntrance(frame, 0);
  const headA  = useSpringEntrance(frame, 4);
  const headB  = useSpringEntrance(frame, 9);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const magGlass = useSpringEntrance(frame, 14);
  const targetCard = useSpringEntrance(frame, 22);
  const foundBadge = useSpringEntrance(frame, 30);
  const infoCard1  = useSpringEntrance(frame, 36);
  const infoCard2  = useSpringEntrance(frame, 44);
  const methodCards = useSpringEntrance(frame, 50);

  // Magnifying glass circle draw
  const magCircleLen = 2 * Math.PI * 90;
  const magCircleDash = usePathDraw(frame, 14, magCircleLen, 20);

  // Handle draw
  const handleLen = 80;
  const handleDash = usePathDraw(frame, 20, handleLen, 15);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const glow     = interpolate(Math.sin(frame * 0.07), [-1, 1], [0.08, 0.2]);
  const pulse    = 1 + Math.sin(frame * 0.08) * 0.015;
  const breathe  = Math.sin(frame * 0.06) * 4;
  const shimmer  = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s10.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ───────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="TICKETING ENGINE · LOOKUP" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B ───────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={310} fontFamily={FONT} fontSize={84} fontWeight={800} fill={COLORS.white}>
            It Finds
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={420} fontFamily={FONT} fontSize={60} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            ExpressFareCalculator
          </text>
        </g>

        {/* ── ZONE C — Magnifying glass ────────────────────────────────── */}
        <g opacity={magGlass.opacity} transform={`translate(0, ${magGlass.translateY})`}>
          {/* Lens */}
          <circle cx={380} cy={700} r={90}
            fill={COLORS.accent} fillOpacity={0.04}
            stroke={COLORS.accent} strokeWidth={4}
            strokeDasharray={magCircleLen} strokeDashoffset={magCircleDash} />
          {/* Handle */}
          <line x1={445} y1={765} x2={510} y2={830}
            stroke={COLORS.accent} strokeWidth={8} strokeLinecap="round"
            strokeDasharray={handleLen} strokeDashoffset={handleDash} />
          {/* Inner circle */}
          <circle cx={380} cy={700} r={50}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5} opacity={0.3} />
        </g>

        {/* ── Found target card ────────────────────────────────────────── */}
        <g opacity={targetCard.opacity} transform={`translate(0, ${targetCard.translateY})`}>
          {/* Glow */}
          <rect x={550} y={590} width={430} height={230} rx={24}
            fill={COLORS.accent} opacity={glow} />
          <BentoCard x={560} y={595} w={420} h={220} accent />
          <rect x={560} y={595} width={6} height={220} rx={3} fill={COLORS.accent} />

          <text x={600} y={650} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">FOUND IN HEAP</text>
          <text x={600} y={710} fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.white}>
            ExpressFare
          </text>
          <text x={600} y={760} fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.white}>
            Calculator
          </text>
          <text x={600} y={800} fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={500}
            fill={COLORS.text_muted}>@0x7F3A</text>
        </g>

        {/* ── FOUND badge ──────────────────────────────────────────────── */}
        <g opacity={foundBadge.opacity}>
          <rect x={860} y={580} width={120} height={44} rx={22}
            fill={COLORS.accent} opacity={0.9}
            transform={`scale(${pulse})`} style={{ transformOrigin: '920px 602px' }} />
          <text x={920} y={610} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.bg_primary}>
            FOUND
          </text>
        </g>

        {/* ── Method list ──────────────────────────────────────────────── */}
        <g opacity={methodCards.opacity} transform={`translate(0, ${methodCards.translateY})`}>
          <BentoCard x={60} y={880} w={960} h={240} accent />
          <text x={100} y={930} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">OVERRIDDEN METHODS</text>

          <rect x={100} y={960} width={400} height={60} rx={10}
            fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={120} y={1000} fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={500}
            fill={COLORS.accent}>calculate(Ticket t)</text>

          <rect x={540} y={960} width={440} height={60} rx={10}
            fill={COLORS.bg_primary} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
          <text x={560} y={1000} fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={500}
            fill={COLORS.text_muted}>getExpressSurcharge()</text>

          <text x={100} y={1090} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Uses child's own implementation
          </text>
        </g>

        {/* ── Info tiles ───────────────────────────────────────────────── */}
        <g opacity={infoCard1.opacity} transform={`translate(0, ${infoCard1.translateY})`}>
          <BentoCard x={60} y={1170} w={460} h={160} />
          <text x={100} y={1225} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>DECLARED AS</text>
          <text x={100} y={1280} fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.text_muted}>FareCalculator</text>
          <text x={100} y={1315} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>Parent type</text>
        </g>

        <g opacity={infoCard2.opacity} transform={`translate(0, ${infoCard2.translateY})`}>
          <BentoCard x={560} y={1170} w={460} h={160} accent />
          <text x={600} y={1225} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>ACTUALLY IS</text>
          <text x={600} y={1280} fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.white}>ExpressFareCalc</text>
          <text x={600} y={1315} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>Child type</text>
        </g>

        {/* ── Tracks ───────────────────────────────────────────────────── */}
        <g opacity={0.1 * shimmer}>
          <line x1={60} y1={1560} x2={1020} y2={1560} stroke={COLORS.accent} strokeWidth={3} />
          <line x1={60} y1={1570} x2={1020} y2={1570} stroke={COLORS.accent} strokeWidth={3} />
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={100 + i * 75} y={1555} width={28} height={6} rx={2}
              fill={COLORS.accent} opacity={0.3} />
          ))}
        </g>

        {/* ── Caption ─────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s10.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
