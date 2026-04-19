/**
 * Scene 11 — Runs That Version
 * "It runs that version of calculate()."
 * CSV: 39.680s → 42.080s
 * Duration: 72 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–20): Headline
 *   Phase 2 (frames 15–45): Play button, execution flow
 *   Phase 3 (frames 40–end): Running indicator pulse
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

export const Scene11_RunsThatVersion: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  const labelE = useSpringEntrance(frame, 0);
  const headA  = useSpringEntrance(frame, 4);
  const headB  = useSpringEntrance(frame, 9);

  const playBtn  = useSpringEntrance(frame, 14);
  const flowCard = useSpringEntrance(frame, 22);
  const codeCard = useSpringEntrance(frame, 30);
  const resultCard = useSpringEntrance(frame, 38);
  const bottomTile1 = useSpringEntrance(frame, 44);
  const bottomTile2 = useSpringEntrance(frame, 50);

  // Flow arrow
  const arrowLen = 250;
  const arrowDash = usePathDraw(frame, 22, arrowLen, 20);

  // Execution progress bar
  const progressW = interpolate(frame, [30, 55], [0, 800], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  const pulse    = 1 + Math.sin(frame * 0.1) * 0.02;
  const breathe  = Math.sin(frame * 0.06) * 4;
  const shimmer  = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const runDot   = interpolate(frame % 30, [0, 30], [0, 800], { extrapolateRight: 'clamp' });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s11.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ───────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="TICKETING ENGINE · EXECUTION" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B ───────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={310} fontFamily={FONT} fontSize={84} fontWeight={800} fill={COLORS.white}>
            Runs That
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={420} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.accent}>
            Version
          </text>
        </g>

        {/* ── ZONE C — Play button ─────────────────────────────────────── */}
        <g opacity={playBtn.opacity} transform={`translate(0, ${playBtn.translateY})`}>
          <circle cx={540} cy={620} r={70}
            fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={3}
            transform={`scale(${pulse})`} style={{ transformOrigin: '540px 620px' }} />
          {/* Play triangle */}
          <polygon points="520,585 520,655 580,620"
            fill={COLORS.accent} opacity={0.9} />
        </g>

        {/* ── Execution flow ───────────────────────────────────────────── */}
        <g opacity={flowCard.opacity} transform={`translate(0, ${flowCard.translateY})`}>
          <BentoCard x={60} y={730} w={960} h={160} accent />

          {/* Progress track */}
          <rect x={100} y={790} width={880} height={10} rx={5}
            fill="rgba(255,255,255,0.08)" />
          <rect x={100} y={790} width={progressW} height={10} rx={5}
            fill={COLORS.accent} opacity={0.9} />

          {/* Running dot */}
          <circle cx={100 + runDot} cy={795} r={6}
            fill={COLORS.accent} opacity={flowCard.opacity * 0.6} />

          <text x={100} y={770} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.08em">
            EXECUTING
          </text>
          <text x={100} y={860} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            ExpressFareCalculator.calculate(ticket)
          </text>
        </g>

        {/* ── Code card ────────────────────────────────────────────────── */}
        <g opacity={codeCard.opacity} transform={`translate(0, ${codeCard.translateY})`}>
          <BentoCard x={60} y={940} w={960} h={260} />
          <rect x={60} y={940} width={6} height={260} rx={3} fill={COLORS.accent} />

          <text x={100} y={990} fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">CHILD'S VERSION</text>

          <text x={100} y={1050} fontFamily="'Fira Code', monospace"
            fontSize={32} fontWeight={500} fill={COLORS.text_muted}>
            class ExpressFareCalculator
          </text>
          <text x={120} y={1100} fontFamily="'Fira Code', monospace"
            fontSize={32} fontWeight={500} fill={COLORS.text_muted}>
            {'  extends FareCalculator {'}
          </text>
          <text x={120} y={1150} fontFamily="'Fira Code', monospace"
            fontSize={32} fontWeight={500} fill={COLORS.white}>
            {'  '}double <tspan fill={COLORS.accent}>calculate</tspan>(Ticket t)
          </text>
          <text x={120} y={1190} fontFamily="'Fira Code', monospace"
            fontSize={32} fontWeight={500} fill={COLORS.text_muted}>
            {'}'}
          </text>
        </g>

        {/* ── Result card ──────────────────────────────────────────────── */}
        <g opacity={resultCard.opacity} transform={`translate(0, ${resultCard.translateY})`}>
          <BentoCard x={60} y={1240} w={960} h={120} accent />
          <text x={100} y={1310} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Returns express fare with surcharge
          </text>
        </g>

        {/* ── Bottom tiles ─────────────────────────────────────────────── */}
        <g opacity={bottomTile1.opacity} transform={`translate(0, ${bottomTile1.translateY})`}>
          <BentoCard x={60} y={1400} w={460} h={140} />
          <text x={100} y={1450} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>PARENT VERSION</text>
          <text x={100} y={1500} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.text_muted}>Skipped</text>
        </g>

        <g opacity={bottomTile2.opacity} transform={`translate(0, ${bottomTile2.translateY})`}>
          <BentoCard x={560} y={1400} w={460} h={140} accent />
          <text x={600} y={1450} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>CHILD VERSION</text>
          <text x={600} y={1500} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>Executed</text>
        </g>

        {/* ── Tracks ───────────────────────────────────────────────────── */}
        <g opacity={0.1 * shimmer}>
          <line x1={60} y1={1600} x2={1020} y2={1600} stroke={COLORS.accent} strokeWidth={3} />
          <line x1={60} y1={1610} x2={1020} y2={1610} stroke={COLORS.accent} strokeWidth={3} />
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={100 + i * 75} y={1595} width={28} height={6} rx={2}
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
            sceneDuration={SCENE_TIMING.s11.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
