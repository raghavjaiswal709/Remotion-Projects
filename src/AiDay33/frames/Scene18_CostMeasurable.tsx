/**
 * Scene 18 — Cost Measurable
 * "Each step is individually cost measurable."
 * CSV: 57.260s → 60.160s
 * Duration: 87 frames (2.9s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–20): Label + headline
 *   Phase 2 (frames 16–60): Cost gauge + meter
 *   Phase 3 (frames 55–end): Needle micro-oscillation
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
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
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

function useCounter(frame: number, startFrame: number, endValue: number, dur = 45) {
  const raw = interpolate(frame, [startFrame, startFrame + dur], [0, endValue], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(raw);
}

export const Scene18_CostMeasurable: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headEnt = useSpringEntrance(frame, 6);
  const gaugeCard = useSpringEntrance(frame, 16);
  const statsCard = useSpringEntrance(frame, 32);
  const defCard = useSpringEntrance(frame, 48);

  // Gauge arc
  const arcLength = Math.PI * 220; // semicircle
  const arcDash = usePathDraw(frame, 18, arcLength, 25);

  // Needle rotation
  const needleAngle = interpolate(
    spring({ frame: Math.max(0, frame - 22), fps, config: { damping: 15, stiffness: 120, mass: 1.0 } }),
    [0, 1], [-90, 35]
  );
  const needleOscillation = frame > 50 ? Math.sin(frame * 0.12) * 2 : 0;

  // Counters
  const tokenCount = useCounter(frame, 30, 847, 35);
  const costCount = useCounter(frame, 36, 12, 30);

  const breathe = Math.sin(frame * 0.06) * 3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s18.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="PROPERTY 2 · COST" y={160} />
        </g>

        {/* ZONE B */}
        <g transform={`translate(0, ${headEnt.translateY})`} opacity={headEnt.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Cost Measurable
          </text>
          <text x={60} y={380} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            Each step, individually
          </text>
        </g>

        {/* ZONE C — Gauge */}
        <g opacity={gaugeCard.opacity} transform={`translate(0, ${gaugeCard.translateY})`}>
          <BentoCard x={60} y={480} w={960} h={440} accent />

          {/* Semi-circle gauge */}
          <g transform="translate(540, 760)">
            {/* Track */}
            <path d="M -220,0 A 220,220 0 0,1 220,0" fill="none"
              stroke="rgba(255,255,255,0.08)" strokeWidth={16} strokeLinecap="round" />
            {/* Fill */}
            <path d="M -220,0 A 220,220 0 0,1 220,0" fill="none"
              stroke={COLORS.accent} strokeWidth={16} strokeLinecap="round"
              strokeDasharray={arcLength} strokeDashoffset={arcDash} />

            {/* Tick marks */}
            {Array.from({ length: 7 }, (_, i) => {
              const angle = -180 + i * 30;
              const rad = (angle * Math.PI) / 180;
              const x1 = Math.cos(rad) * 195, y1 = Math.sin(rad) * 195;
              const x2 = Math.cos(rad) * 210, y2 = Math.sin(rad) * 210;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={COLORS.text_muted} strokeWidth={2} />;
            })}

            {/* Needle */}
            <g transform={`rotate(${needleAngle + needleOscillation})`}>
              <line x1={0} y1={0} x2={0} y2={-170} stroke={COLORS.white} strokeWidth={4}
                strokeLinecap="round" />
              <circle cx={0} cy={0} r={10} fill={COLORS.accent} />
            </g>

            {/* Center label */}
            <text x={0} y={-40} textAnchor="middle" fontFamily={FONT} fontSize={56} fontWeight={800}
              fill={COLORS.white}>{costCount}¢</text>
            <text x={0} y={10} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
              fill={COLORS.text_muted}>PER STEP</text>
          </g>
        </g>

        {/* Stats row */}
        <g opacity={statsCard.opacity} transform={`translate(0, ${statsCard.translateY})`}>
          <BentoCard x={60} y={960} w={460} h={180} />
          <text x={100} y={1030} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>TOKENS</text>
          <text x={100} y={1100} fontFamily={FONT} fontSize={60} fontWeight={800}
            fill={COLORS.accent}>{tokenCount}</text>

          <BentoCard x={560} y={960} w={460} h={180} accent />
          <text x={600} y={1030} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>COST</text>
          <text x={600} y={1100} fontFamily={FONT} fontSize={60} fontWeight={800}
            fill={COLORS.white}>${(costCount / 100).toFixed(2)}</text>
        </g>

        {/* Definition card */}
        <g opacity={defCard.opacity} transform={`translate(0, ${defCard.translateY + breathe})`}>
          <BentoCard x={60} y={1200} w={960} h={140} accent />
          <rect x={60} y={1200} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={100} y={1285} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            Every step has a <tspan fill={COLORS.accent} fontStyle="italic">measurable price tag</tspan>
          </text>
        </g>

        {/* CAPTION */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s18.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
