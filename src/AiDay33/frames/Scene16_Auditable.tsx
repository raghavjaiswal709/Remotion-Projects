/**
 * Scene 16 — Auditable
 * "Each step is independently auditable."
 * CSV: 51.860s → 54.380s
 * Duration: 75 frames (2.5s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–20): Label + headline spring
 *   Phase 2 (frames 16–55): Magnifying glass + checklist card
 *   Phase 3 (frames 50–end): Pulse on lens
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
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

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

export const Scene16_Auditable: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headEnt = useSpringEntrance(frame, 6);
  const subEnt = useSpringEntrance(frame, 12);
  const lensCard = useSpringEntrance(frame, 18);
  const checkCard = useSpringEntrance(frame, 30);
  const defCard = useSpringEntrance(frame, 42);

  // Magnifying glass path draw
  const lensCircumference = 2 * Math.PI * 140;
  const lensDash = usePathDraw(frame, 20, lensCircumference, 25);
  const handleDash = usePathDraw(frame, 28, 120, 18);

  // Phase 3
  const pulse = 1 + Math.sin(frame * 0.1) * 0.02;
  const breathe = Math.sin(frame * 0.06) * 3;

  // Checklist items
  const checks = [
    { text: 'Input received?', delay: 32 },
    { text: 'Logic correct?', delay: 38 },
    { text: 'Output valid?', delay: 44 },
  ];

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s16.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="PROPERTY 1 · AUDIT" y={160} />
        </g>

        {/* ZONE B */}
        <g transform={`translate(0, ${headEnt.translateY})`} opacity={headEnt.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Auditable
          </text>
        </g>
        <g transform={`translate(0, ${subEnt.translateY})`} opacity={subEnt.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            Each step, independently
          </text>
        </g>

        {/* ZONE C — Magnifying glass illustration */}
        <g opacity={lensCard.opacity} transform={`translate(0, ${lensCard.translateY})`}>
          <BentoCard x={60} y={480} w={500} h={420} accent />

          {/* Magnifying glass */}
          <g transform={`translate(310, 690) scale(${pulse})`} style={{ transformOrigin: '0px 0px' }}>
            <circle cx={0} cy={0} r={140} fill="none" stroke={COLORS.accent} strokeWidth={4}
              strokeDasharray={lensCircumference} strokeDashoffset={lensDash} />
            <circle cx={0} cy={0} r={120} fill={COLORS.accent} fillOpacity={0.06} />
            {/* Handle */}
            <line x1={100} y1={100} x2={180} y2={180}
              stroke={COLORS.accent} strokeWidth={8} strokeLinecap="round"
              strokeDasharray={120} strokeDashoffset={handleDash} />
          </g>

          {/* Checkmark inside lens */}
          <path d="M 270,700 L 300,730 L 350,660" fill="none" stroke={COLORS.white} strokeWidth={4}
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={120} strokeDashoffset={usePathDraw(frame, 35, 120, 18)}
          />
        </g>

        {/* Checklist card */}
        <g opacity={checkCard.opacity} transform={`translate(0, ${checkCard.translateY})`}>
          <BentoCard x={600} y={480} w={420} h={420} />

          <text x={640} y={540} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.12em">
            CHECKLIST
          </text>

          {checks.map((ch, i) => {
            const chEnt = useSpringEntrance(frame, ch.delay);
            return (
              <g key={i} opacity={chEnt.opacity} transform={`translate(0, ${chEnt.translateY})`}>
                {/* Checkbox */}
                <rect x={640} y={570 + i * 90} width={36} height={36} rx={8}
                  fill="none" stroke={COLORS.accent} strokeWidth={2} />
                {/* Check mark */}
                {frame > ch.delay + 15 && (
                  <path d={`M ${647},${588 + i * 90} L ${655},${598 + i * 90} L ${672},${578 + i * 90}`}
                    fill="none" stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" />
                )}
                {/* Text */}
                <text x={695} y={600 + i * 90} fontFamily={FONT} fontSize={36} fontWeight={800}
                  fill={COLORS.white}>
                  {ch.text}
                </text>
              </g>
            );
          })}
        </g>

        {/* Definition card */}
        <g opacity={defCard.opacity} transform={`translate(0, ${defCard.translateY + breathe})`}>
          <BentoCard x={60} y={960} w={960} h={160} accent />
          <rect x={60} y={960} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={100} y={1058} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            You can inspect <tspan fill={COLORS.accent} fontStyle="italic">any single step</tspan> in isolation
          </text>
        </g>

        {/* Floating accent circles */}
        <circle cx={900} cy={1300 + breathe} r={40} fill={COLORS.accent} fillOpacity={0.06} />
        <circle cx={180} cy={1400 - breathe} r={28} fill={COLORS.accent} fillOpacity={0.04} />

        {/* CAPTION */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s16.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
