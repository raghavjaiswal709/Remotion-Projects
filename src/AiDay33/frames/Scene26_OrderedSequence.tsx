/**
 * Scene 26 — Ordered Sequence
 * "How do you break a complex goal into that ordered sequence?"
 * CSV: 83.100s → 86.660s
 * Duration: 107 frames (3.57s)
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

export const Scene26_OrderedSequence: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headEnt = useSpringEntrance(frame, 6);
  const goalBox = useSpringEntrance(frame, 18);
  const questionCard = useSpringEntrance(frame, 34);

  const breathe = Math.sin(frame * 0.06) * 4;
  const questionPulse = 1 + Math.sin(frame * 0.1) * 0.02;

  // Shatter lines from goal box
  const shatterDash = usePathDraw(frame, 30, 300, 35);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s26.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="DECOMPOSITION · QUESTION" y={160} />
        </g>

        <g transform={`translate(0, ${headEnt.translateY})`} opacity={headEnt.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.white}>
            How Do You Break
          </text>
          <text x={60} y={380} fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.accent}>
            A Complex Goal?
          </text>
        </g>

        {/* Large goal blob */}
        <g opacity={goalBox.opacity} transform={`translate(0, ${goalBox.translateY})`}>
          <rect x={300} y={480} width={480} height={200} rx={30}
            fill={COLORS.accent} fillOpacity={0.1}
            stroke={COLORS.accent} strokeWidth={3} />
          <text x={540} y={590} textAnchor="middle" fontFamily={FONT}
            fontSize={44} fontWeight={800} fill={COLORS.accent}>
            COMPLEX GOAL
          </text>

          {/* Shatter lines going down to step fragments */}
          {[0, 1, 2, 3, 4].map(i => {
            const startX = 380 + i * 80;
            return (
              <line key={i} x1={startX} y1={680} x2={startX} y2={840}
                stroke={COLORS.accent} strokeWidth={2} strokeOpacity={0.5}
                strokeDasharray={300} strokeDashoffset={shatterDash}
                markerEnd="url(#arrow)" />
            );
          })}

          {/* Step fragment boxes */}
          {[0, 1, 2, 3, 4].map(i => {
            const ent = useSpringEntrance(frame, 40 + i * 8);
            const x = 340 + i * 80;
            return (
              <g key={i} opacity={ent.opacity} transform={`translate(0, ${ent.translateY})`}>
                <rect x={x} y={850} width={60} height={60} rx={10}
                  fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={1.5} />
                <text x={x + 30} y={888} textAnchor="middle" fontFamily={FONT}
                  fontSize={24} fontWeight={800} fill={COLORS.white}>
                  {i + 1}
                </text>
              </g>
            );
          })}
        </g>

        {/* Big question card */}
        <g opacity={questionCard.opacity} transform={`translate(0, ${questionCard.translateY + breathe})`}>
          <BentoCard x={60} y={980} w={960} h={220} accent />
          <text x={540} y={1060} textAnchor="middle" fontFamily={FONT}
            fontSize={80} fontWeight={800} fill={COLORS.accent}
            transform={`scale(${questionPulse})`}
            style={{ transformOrigin: '540px 1060px' }}>
            ?
          </text>
          <text x={540} y={1140} textAnchor="middle" fontFamily={FONT}
            fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            Into an ordered sequence of steps
          </text>
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s26.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
