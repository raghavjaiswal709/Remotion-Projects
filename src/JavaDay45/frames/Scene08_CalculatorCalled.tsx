/**
 * Scene 08 — Calculator Called
 * "When calculate() is called,"
 * CSV: 30.760s → 33.000s
 * Duration: 66 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–20): Label + headline spring in
 *   Phase 2 (frames 15–45): Method call arrow, code card
 *   Phase 3 (frames 40–end): Pulse on call site, micro-float
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

export const Scene08_CalculatorCalled: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelE = useSpringEntrance(frame, 0);
  const headA  = useSpringEntrance(frame, 4);
  const headB  = useSpringEntrance(frame, 8);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const codeCard  = useSpringEntrance(frame, 14);
  const arrowCard = useSpringEntrance(frame, 22);
  const infoCard1 = useSpringEntrance(frame, 30);
  const infoCard2 = useSpringEntrance(frame, 38);

  // Arrow path
  const arrowLen = 300;
  const arrowDash = usePathDraw(frame, 20, arrowLen, 20);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const pulse    = 1 + Math.sin(frame * 0.1) * 0.02;
  const breathe  = Math.sin(frame * 0.06) * 4;
  const shimmer  = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Ring pulse around method name
  const ringScale = interpolate(frame % 40, [0, 40], [0.9, 1.2], { extrapolateRight: 'clamp' });
  const ringOp    = interpolate(frame % 40, [0, 40], [0.4, 0], { extrapolateRight: 'clamp' });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s08.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ───────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="TICKETING ENGINE · METHOD DISPATCH" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B ───────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={84} fontWeight={800} fill={COLORS.white}>
            When
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={420} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.accent}>
            calculate() is called
          </text>
        </g>

        {/* ── ZONE C — Code card ───────────────────────────────────────── */}
        <g opacity={codeCard.opacity} transform={`translate(0, ${codeCard.translateY})`}>
          <BentoCard x={60} y={520} w={960} h={260} accent />
          <rect x={60} y={520} width={6} height={260} rx={3} fill={COLORS.accent} />

          {/* Code header */}
          <text x={100} y={570} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            CALL SITE
          </text>

          {/* Code line */}
          <text x={100} y={640} fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={38} fontWeight={500} fill={COLORS.text_muted}>
            FareCalculator fc = ...;
          </text>
          <text x={100} y={700} fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={38} fontWeight={500} fill={COLORS.white}>
            fc.<tspan fill={COLORS.accent} fontWeight={700}>calculate</tspan>(ticket);
          </text>

          {/* Pulse ring on calculate */}
          <circle cx={355} cy={688} r={60}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            opacity={ringOp}
            transform={`scale(${ringScale})`}
            style={{ transformOrigin: '355px 688px' }} />
        </g>

        {/* ── Arrow down to runtime ────────────────────────────────────── */}
        <path d="M 540,790 L 540,1080"
          fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* ── Runtime dispatch card ────────────────────────────────────── */}
        <g opacity={arrowCard.opacity} transform={`translate(0, ${arrowCard.translateY})`}>
          <BentoCard x={60} y={1090} w={960} h={200} accent />

          {/* Gear/process icon */}
          <circle cx={170} cy={1190} r={50} fill="none" stroke={COLORS.accent} strokeWidth={3}
            transform={`scale(${pulse})`} style={{ transformOrigin: '170px 1190px' }} />
          {Array.from({ length: 8 }, (_, i) => {
            const angle = (i * 45 * Math.PI) / 180;
            const ix = 170 + Math.cos(angle) * 50;
            const iy = 1190 + Math.sin(angle) * 50;
            const ox = 170 + Math.cos(angle) * 65;
            const oy = 1190 + Math.sin(angle) * 65;
            return (
              <line key={i} x1={ix} y1={iy} x2={ox} y2={oy}
                stroke={COLORS.accent} strokeWidth={4} strokeLinecap="round"
                opacity={arrowCard.opacity} />
            );
          })}
          <circle cx={170} cy={1190} r={20} fill={COLORS.accent} fillOpacity={0.15} />

          <text x={260} y={1175} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            JVM Method Dispatch
          </text>
          <text x={260} y={1230} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            Resolves at runtime
          </text>
        </g>

        {/* ── Info tiles ───────────────────────────────────────────────── */}
        <g opacity={infoCard1.opacity} transform={`translate(0, ${infoCard1.translateY})`}>
          <BentoCard x={60} y={1340} w={460} h={180} />
          <text x={100} y={1400} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.08em">COMPILE TIME</text>
          <text x={100} y={1455} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.text_muted}>
            Knows signature
          </text>
          <text x={100} y={1500} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            Not which version
          </text>
        </g>

        <g opacity={infoCard2.opacity} transform={`translate(0, ${infoCard2.translateY})`}>
          <BentoCard x={560} y={1340} w={460} h={180} />
          <text x={600} y={1400} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.08em">RUNTIME</text>
          <text x={600} y={1455} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Picks exact version
          </text>
          <text x={600} y={1500} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Based on actual obj
          </text>
        </g>

        {/* ── Rails ────────────────────────────────────────────────────── */}
        <g opacity={0.1 * shimmer}>
          <line x1={60} y1={1580} x2={1020} y2={1580} stroke={COLORS.accent} strokeWidth={3} />
          <line x1={60} y1={1590} x2={1020} y2={1590} stroke={COLORS.accent} strokeWidth={3} />
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={100 + i * 75} y={1575} width={28} height={6} rx={2}
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
            sceneDuration={SCENE_TIMING.s08.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
