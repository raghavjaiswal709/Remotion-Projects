/**
 * Scene 25 — Right Order
 * "But those steps need to arrive in the right order."
 * CSV: 80.200s → 83.100s
 * Duration: 87 frames (2.9s)
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
  const progress = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

const STEPS = [
  { n: 1, label: 'Observe' },
  { n: 2, label: 'Reason' },
  { n: 3, label: 'Act' },
  { n: 4, label: 'Verify' },
  { n: 5, label: 'Store' },
];

export const Scene25_RightOrder: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headEnt = useSpringEntrance(frame, 6);
  const breathe = Math.sin(frame * 0.06) * 3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s25.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="ORDERING · STEPS" y={160} />
        </g>

        <g transform={`translate(0, ${headEnt.translateY})`} opacity={headEnt.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            The Right
          </text>
          <text x={60} y={400} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            Order
          </text>
        </g>

        {/* Vertical step sequence — numbered chain */}
        {STEPS.map((step, i) => {
          const ent = useSpringEntrance(frame, 16 + i * 10);
          const y = 520 + i * 200;
          const arrowDash = usePathDraw(frame, 20 + i * 10, 140, 20);

          return (
            <g key={i}>
              <g opacity={ent.opacity} transform={`translate(0, ${ent.translateY + (i % 2 === 0 ? breathe : -breathe)})`}>
                {/* Number badge */}
                <circle cx={160} cy={y + 50} r={40} fill={COLORS.accent} fillOpacity={0.12}
                  stroke={COLORS.accent} strokeWidth={2} />
                <text x={160} y={y + 62} textAnchor="middle" fontFamily={FONT}
                  fontSize={36} fontWeight={800} fill={COLORS.accent}>
                  {step.n}
                </text>

                {/* Card */}
                <BentoCard x={240} y={y} w={760} h={100} accent={i === 0} />
                <text x={280} y={y + 62} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
                  Step {step.n}: <tspan fill={COLORS.accent}>{step.label}</tspan>
                </text>
              </g>

              {/* Arrow to next */}
              {i < STEPS.length - 1 && (
                <line x1={160} y1={y + 90} x2={160} y2={y + 200}
                  stroke={COLORS.accent} strokeWidth={2}
                  strokeDasharray={140} strokeDashoffset={arrowDash}
                  markerEnd="url(#arrow)" />
              )}
            </g>
          );
        })}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s25.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
