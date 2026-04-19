/**
 * Scene 24 — Goal To Steps
 * "One large goal produces many steps."
 * CSV: 77.340s → 80.200s
 * Duration: 86 frames (2.87s)
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

const STEP_LABELS = ['Observe', 'Reason', 'Select Tool', 'Execute', 'Verify', 'Store'];

export const Scene24_GoalToSteps: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headEnt = useSpringEntrance(frame, 6);
  const goalCard = useSpringEntrance(frame, 16);

  const breathe = Math.sin(frame * 0.06) * 3;

  // Arrows from goal to steps
  const arrowLen = 100;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s24.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="GOAL → STEPS" y={160} />
        </g>

        <g transform={`translate(0, ${headEnt.translateY})`} opacity={headEnt.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={64} fontWeight={800} fill={COLORS.white}>
            One Large Goal
          </text>
          <text x={60} y={380} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent}>
            Produces Many Steps
          </text>
        </g>

        {/* Large goal circle */}
        <g opacity={goalCard.opacity} transform={`translate(0, ${goalCard.translateY})`}>
          <circle cx={540} cy={580} r={90} fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={3} />
          <text x={540} y={590} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            GOAL
          </text>
        </g>

        {/* Step boxes fanning out below */}
        {STEP_LABELS.map((label, i) => {
          const ent = useSpringEntrance(frame, 28 + i * 8);
          const x = 80 + i * 160;
          const y = 800;
          const dash = usePathDraw(frame, 28 + i * 8, arrowLen, 20);

          return (
            <g key={i}>
              {/* Arrow from goal to step */}
              <line x1={540} y1={670} x2={x + 70} y2={y}
                stroke={COLORS.accent} strokeWidth={2} strokeOpacity={ent.opacity * 0.4}
                strokeDasharray={arrowLen} strokeDashoffset={dash}
                markerEnd="url(#arrow)" />

              {/* Step card */}
              <g opacity={ent.opacity} transform={`translate(0, ${ent.translateY + breathe * (i % 2 === 0 ? 1 : -1)})`}>
                <rect x={x} y={y} width={140} height={140} rx={16}
                  fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={1.5} />
                <text x={x + 70} y={y + 60} textAnchor="middle" fontFamily={FONT}
                  fontSize={28} fontWeight={800} fill={COLORS.white}>
                  Step
                </text>
                <text x={x + 70} y={y + 95} textAnchor="middle" fontFamily={FONT}
                  fontSize={24} fontWeight={800} fill={COLORS.accent}>
                  {i + 1}
                </text>
                <text x={x + 70} y={y + 125} textAnchor="middle" fontFamily={FONT}
                  fontSize={18} fontWeight={800} fill={COLORS.text_muted}>
                  {label}
                </text>
              </g>
            </g>
          );
        })}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s24.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
