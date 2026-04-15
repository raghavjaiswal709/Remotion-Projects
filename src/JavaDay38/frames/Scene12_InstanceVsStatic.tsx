/**
 * Scene 12 — Instance vs Static
 * "Instance variables live inside each object. Static variables live inside the class."
 * CSV: 63.580s → 70.200s
 * Duration: 199 frames (6.6s)
 *
 * Animation phases:
 *   Phase 1 (0–25):  Label + headline spring
 *   Phase 2 (20–80): Two-column comparison (instance vs static)
 *   Phase 3 (75–end): Pulse, shimmer
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, FPS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, start: number, len: number, dur = 30) {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return len * (1 - p);
}

const INSTANCE_ITEMS = [
  { label: 'name', value: '"Rajdhani"' },
  { label: 'speed', value: '130' },
  { label: 'route', value: '"DEL→MUM"' },
];

export const Scene12_InstanceVsStatic: React.FC = () => {
  const frame = useCurrentFrame();

  const label    = useSpringEntrance(frame, 0);
  const headline = useSpringEntrance(frame, 6);
  const leftCard = useSpringEntrance(frame, 20);
  const rightCard = useSpringEntrance(frame, 32);
  const vsLabel   = useSpringEntrance(frame, 40);
  const summary   = useSpringEntrance(frame, 60);

  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const breathe = Math.sin(frame * 0.05) * 3;

  const dividerLen = 800;
  const dividerDash = usePathDraw(frame, 50, dividerLen, 25);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s12.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0,${label.translateY})`} opacity={label.opacity}>
          <SectionLabel text="INSTANCE VS STATIC" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0,${headline.translateY})`} opacity={headline.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Where They
          </text>
          <text x={60} y={385} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            Live
          </text>
        </g>

        {/* VS badge */}
        <g opacity={vsLabel.opacity}>
          <circle cx={540} cy={820} r={36} fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={540} y={830} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            vs
          </text>
        </g>

        {/* LEFT: Instance Variables */}
        <g opacity={leftCard.opacity} transform={`translate(0,${leftCard.translateY})`}>
          <BentoCard x={60} y={480} w={440} h={680} />
          <rect x={60} y={480} width={6} height={680} rx={3} fill={COLORS.text_muted} />
          <text x={280} y={540} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            INSTANCE
          </text>
          <text x={280} y={585} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted} opacity={0.6}>
            per object
          </text>

          {/* 3 small object boxes stacked */}
          {['train1', 'train2', 'train3'].map((obj, i) => {
            const objSpring = useSpringEntrance(frame, 30 + i * 10);
            return (
              <g key={i} opacity={objSpring.opacity} transform={`translate(0,${objSpring.translateY})`}>
                <rect x={90} y={620 + i * 170} width={380} height={150} rx={12}
                  fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
                <text x={110} y={660 + i * 170} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent}>
                  {obj}
                </text>
                {INSTANCE_ITEMS.map((item, j) => (
                  <text key={j} x={110} y={695 + i * 170 + j * 28}
                    fontFamily={FONT} fontSize={20} fontWeight={800} fill={COLORS.text_muted}>
                    {item.label}: {item.value}
                  </text>
                ))}
              </g>
            );
          })}
        </g>

        {/* RIGHT: Static Variable */}
        <g opacity={rightCard.opacity} transform={`translate(0,${rightCard.translateY})`}>
          <BentoCard x={560} y={480} w={460} h={680} accent />
          <rect x={560} y={480} width={6} height={680} rx={3} fill={COLORS.accent} />
          <text x={790} y={540} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>
            STATIC
          </text>
          <text x={790} y={585} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent} opacity={0.6}>
            per class
          </text>

          {/* Single class box */}
          <rect x={600} y={650} width={380} height={200} rx={16}
            fill="rgba(255,255,255,0.03)" stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={790} y={710} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.white}>
            Train.class
          </text>
          <text x={790} y={770} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic"
            style={{ transform: `scale(${pulse})`, transformOrigin: '790px 760px' }}>
            totalActiveTrains = 3
          </text>

          {/* "ONE" emphasis */}
          <rect x={680} y={900} width={220} height={80} rx={16}
            fill={COLORS.accent} opacity={0.1} />
          <text x={790} y={950} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}>
            ONE
          </text>
          <text x={790} y={990} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
            copy only
          </text>
        </g>

        {/* Horizontal divider */}
        <line x1={140} y1={1220} x2={940} y2={1220}
          stroke={COLORS.accent} strokeWidth={1} opacity={0.15}
          strokeDasharray={dividerLen} strokeDashoffset={dividerDash} />

        {/* Summary */}
        <g opacity={summary.opacity} transform={`translate(0,${summary.translateY})`}>
          <BentoCard x={60} y={1280} w={960} h={120} />
          <text x={540} y={1350} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Instance → <tspan fill={COLORS.text_muted}>inside object</tspan>  |  Static → <tspan fill={COLORS.accent}>inside class</tspan>
          </text>
        </g>

        {/* Track decoration */}
        <line x1={100} y1={1500} x2={980} y2={1500}
          stroke={COLORS.text_muted} strokeWidth={2} opacity={0.1} />
        <line x1={100} y1={1515} x2={980} y2={1515}
          stroke={COLORS.text_muted} strokeWidth={2} opacity={0.1} />
        {Array.from({ length: 14 }, (_, i) => (
          <rect key={i} x={120 + i * 62} y={1498} width={16} height={20} rx={2}
            fill={COLORS.text_muted} opacity={0.06} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s12.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
