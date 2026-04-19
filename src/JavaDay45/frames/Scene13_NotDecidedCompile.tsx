/**
 * Scene 13 — Not Decided At Compile
 * "The method to execute is not decided when the code is compiled."
 * CSV: 44.900s → 48.720s
 * Duration: 115 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–20): Headline
 *   Phase 2 (frames 15–60): Compile-time X badge, code block, timeline
 *   Phase 3 (frames 50–end): Pulse, shimmer
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

export const Scene13_NotDecidedCompile: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  const labelE = useSpringEntrance(frame, 0);
  const headA  = useSpringEntrance(frame, 4);
  const headB  = useSpringEntrance(frame, 9);
  const xBadge = useSpringEntrance(frame, 14);
  const codeCard = useSpringEntrance(frame, 20);
  const timelineCard = useSpringEntrance(frame, 30);
  const arrowE = useSpringEntrance(frame, 40);
  const infoTile1 = useSpringEntrance(frame, 48);
  const infoTile2 = useSpringEntrance(frame, 54);

  const arrowLen = 300;
  const arrowDash = usePathDraw(frame, 40, arrowLen, 25);

  const pulse   = 1 + Math.sin(frame * 0.09) * 0.018;
  const breathe = Math.sin(frame * 0.06) * 3;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // X stamp shake
  const xShake = frame > 14 && frame < 30
    ? Math.sin((frame - 14) * 1.5) * 4 * interpolate(frame, [14, 30], [1, 0], { extrapolateRight: 'clamp' })
    : 0;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s13.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="TICKETING ENGINE · COMPILE TIME" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={310} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Not Decided
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={420} fontFamily={FONT} fontSize={64} fontWeight={800} fill={COLORS.accent}>
            at Compile Time
          </text>
        </g>

        {/* ── Big X Badge ──────────────────────────────────────────────── */}
        <g opacity={xBadge.opacity} transform={`translate(${xShake}, ${xBadge.translateY})`}>
          <circle cx={540} cy={600} r={80}
            fill={COLORS.vibrant_red} fillOpacity={0.12}
            stroke={COLORS.vibrant_red} strokeWidth={4}
            transform={`scale(${pulse})`} style={{ transformOrigin: '540px 600px' }} />
          {/* X mark */}
          <line x1={505} y1={565} x2={575} y2={635} stroke={COLORS.vibrant_red} strokeWidth={8} strokeLinecap="round" />
          <line x1={575} y1={565} x2={505} y2={635} stroke={COLORS.vibrant_red} strokeWidth={8} strokeLinecap="round" />
          <text x={540} y={720} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.vibrant_red}>CANNOT RESOLVE</text>
        </g>

        {/* ── Code card ────────────────────────────────────────────────── */}
        <g opacity={codeCard.opacity} transform={`translate(0, ${codeCard.translateY})`}>
          <BentoCard x={60} y={770} w={960} h={200} />
          <rect x={60} y={770} width={6} height={200} rx={3} fill={COLORS.accent} />
          <text x={100} y={830} fontFamily="'Fira Code', monospace"
            fontSize={30} fontWeight={500} fill={COLORS.text_muted}>
            FareCalculator fc = ???;
          </text>
          <text x={100} y={880} fontFamily="'Fira Code', monospace"
            fontSize={30} fontWeight={500} fill={COLORS.text_muted}>
            fc.calculate(ticket); // which one?
          </text>
          <text x={100} y={930} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.vibrant_red}>Compiler cannot know the answer</text>
        </g>

        {/* ── Timeline card ────────────────────────────────────────────── */}
        <g opacity={timelineCard.opacity} transform={`translate(0, ${timelineCard.translateY})`}>
          <BentoCard x={60} y={1010} w={960} h={180} accent />

          {/* Timeline line */}
          <line x1={120} y1={1100} x2={960} y2={1100}
            stroke="rgba(255,255,255,0.15)" strokeWidth={3} />

          {/* Compile point */}
          <circle cx={300} cy={1100} r={14} fill={COLORS.vibrant_red} fillOpacity={0.3}
            stroke={COLORS.vibrant_red} strokeWidth={2} />
          <text x={300} y={1070} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.vibrant_red}>COMPILE</text>
          <text x={300} y={1145} textAnchor="middle" fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted}>Unknown</text>

          {/* Runtime point */}
          <circle cx={750} cy={1100} r={14} fill={COLORS.accent} fillOpacity={0.3}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={750} y={1070} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent}>RUNTIME</text>
          <text x={750} y={1145} textAnchor="middle" fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted}>Resolved</text>

          {/* Arrow between */}
          <path d="M 330,1100 L 720,1100"
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
            markerEnd="url(#arrow)" />
        </g>

        {/* ── Info tiles ───────────────────────────────────────────────── */}
        <g opacity={infoTile1.opacity} transform={`translate(0, ${infoTile1.translateY})`}>
          <BentoCard x={60} y={1240} w={460} h={140} />
          <text x={100} y={1290} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.vibrant_red}>STATIC ANALYSIS</text>
          <text x={100} y={1335} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>Insufficient info</text>
        </g>

        <g opacity={infoTile2.opacity} transform={`translate(0, ${infoTile2.translateY})`}>
          <BentoCard x={560} y={1240} w={460} h={140} accent />
          <text x={600} y={1290} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>DYNAMIC DISPATCH</text>
          <text x={600} y={1335} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.white}>JVM resolves it</text>
        </g>

        {/* ── Floating elements ────────────────────────────────────────── */}
        <g opacity={0.06 * shimmer}>
          <circle cx={200} cy={1500 + breathe} r={30} fill={COLORS.vibrant_red} />
          <circle cx={880} cy={1480 - breathe} r={24} fill={COLORS.accent} />
        </g>

        {/* ── Tracks ───────────────────────────────────────────────────── */}
        <g opacity={0.07 * shimmer}>
          <line x1={60} y1={1640} x2={1020} y2={1640} stroke={COLORS.accent} strokeWidth={3} />
          <line x1={60} y1={1650} x2={1020} y2={1650} stroke={COLORS.accent} strokeWidth={3} />
          {Array.from({ length: 13 }, (_, i) => (
            <rect key={i} x={90 + i * 72} y={1635} width={24} height={6} rx={2}
              fill={COLORS.accent} opacity={0.25} />
          ))}
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s13.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
