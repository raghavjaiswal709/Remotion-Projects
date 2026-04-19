/**
 * Scene 21 — Called Upcasting
 * "It is called upcasting."
 * Duration: 51 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–15): Headline
 *   Phase 2 (frames 12–35): Hero term reveal with border draw
 *   Phase 3 (frames 30–end): Glow pulse
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
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene21_CalledUpcasting: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelE = useSpringEntrance(frame, 0);
  const headA  = useSpringEntrance(frame, 3);
  const termCard = useSpringEntrance(frame, 8);
  const arrowUp  = useSpringEntrance(frame, 16);
  const defCard  = useSpringEntrance(frame, 22);
  const tileA    = useSpringEntrance(frame, 28);
  const tileB    = useSpringEntrance(frame, 34);

  const pulse = 1 + Math.sin(frame * 0.1) * 0.02;
  const breathe = Math.sin(frame * 0.06) * 4;
  const glowOp = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.06, 0.18]);

  // Term scale-in
  const termScale = spring({ frame: Math.max(0, frame - 10), fps, config: SPRING_SNAP });

  // Border draw for hero card
  const borderLen = 2 * (840 + 300);
  const borderDash = usePathDraw(frame, 10, borderLen, 25);

  // Up arrow path draw
  const arrowLen = 200;
  const arrowDash = usePathDraw(frame, 18, arrowLen, 20);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s21.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="TICKETING ENGINE · TERMINOLOGY" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={540} y={320} textAnchor="middle" fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.white}>It Is Called</text>
        </g>

        {/* ── Hero term card ───────────────────────────────────────────── */}
        <g opacity={termCard.opacity} transform={`translate(0, ${termCard.translateY})`}>
          <rect x={120} y={400} width={840} height={300} rx={20}
            fill={COLORS.bg_secondary} />
          <rect x={120} y={400} width={840} height={300} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={borderLen} strokeDashoffset={borderDash} />

          {/* Glow behind text */}
          <circle cx={540} cy={550} r={140} fill={COLORS.accent} fillOpacity={glowOp} />

          <g transform={`translate(540, 550) scale(${interpolate(termScale, [0,1], [0.6,1])})`}
            style={{ transformOrigin: '0px 0px' }} opacity={termCard.opacity}>
            <text x={0} y={0} textAnchor="middle" dominantBaseline="central"
              fontFamily={FONT} fontSize={120} fontWeight={800} fontStyle="italic"
              fill={COLORS.accent}
              transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }}>
              Upcasting
            </text>
          </g>
        </g>

        {/* ── Up arrow illustration ────────────────────────────────────── */}
        <g opacity={arrowUp.opacity} transform={`translate(540, ${800 + breathe})`}>
          <path d="M 0,80 L 0,-80 M -30,-50 L 0,-80 L 30,-50"
            fill="none" stroke={COLORS.accent} strokeWidth={4} strokeLinecap="round"
            strokeDasharray={arrowLen} strokeDashoffset={arrowDash} />
          <text x={50} y={10} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>UP</text>
          <text x={-90} y={60} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>Child</text>
          <text x={-90} y={-60} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent}>Parent</text>
        </g>

        {/* ── Definition card ──────────────────────────────────────────── */}
        <g opacity={defCard.opacity} transform={`translate(0, ${defCard.translateY})`}>
          <BentoCard x={60} y={960} w={960} h={160} accent />
          <rect x={60} y={960} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={100} y={1020} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>Treating a child object as its parent type</text>
          <text x={100} y={1075} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>Casting "up" the inheritance hierarchy</text>
        </g>

        {/* ── Two tiles ────────────────────────────────────────────────── */}
        <g opacity={tileA.opacity} transform={`translate(0, ${tileA.translateY})`}>
          <BentoCard x={60} y={1160} w={460} h={160} />
          <text x={80} y={1220} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>IMPLICIT</text>
          <text x={80} y={1270} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.white}>No cast operator needed</text>
        </g>
        <g opacity={tileB.opacity} transform={`translate(0, ${tileB.translateY})`}>
          <BentoCard x={560} y={1160} w={460} h={160} accent />
          <text x={580} y={1220} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>SAFE</text>
          <text x={580} y={1270} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.white}>Always valid (IS-A)</text>
        </g>

        {/* Track lines */}
        <g opacity={0.06}>
          <line x1={60} y1={1640} x2={1020} y2={1640} stroke={COLORS.accent} strokeWidth={3} />
          <line x1={60} y1={1650} x2={1020} y2={1650} stroke={COLORS.accent} strokeWidth={3} />
          {Array.from({ length: 13 }, (_, i) => (
            <rect key={i} x={90 + i * 72} y={1635} width={24} height={6} rx={2}
              fill={COLORS.accent} opacity={0.25} />
          ))}
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s21.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
