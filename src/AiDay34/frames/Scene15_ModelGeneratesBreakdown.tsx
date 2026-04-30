/**
 * Scene 15 — The Model Generates This Breakdown Itself
 * "The model generates this breakdown itself."
 * CSV: 54.920s → 57.480s | Duration: 64 frames (2.13s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–18):  Label + headline spring in
 *   Phase 2 (frames 16–52): Robot/brain icon + "generates" action path draw
 *   Phase 3 (frames 48–end): Key insight card + breathing circle
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

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress   = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity    = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, start: number, len: number, dur = 18) {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return len * (1 - p);
}

export const Scene15_ModelGeneratesBreakdown: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  const labelEnter  = useSpringEntrance(frame, 0);
  const headEnter   = useSpringEntrance(frame, 5);
  const robotEnter  = useSpringEntrance(frame, 18);
  const arrowLen    = 140; const arrowDash = usePathDraw(frame, 28, arrowLen, 18);
  const planEnter   = useSpringEntrance(frame, 38);
  const insightCard = useSpringEntrance(frame, 50);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.018;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s15.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="AGENTIC AI · TASK DECOMPOSITION · AUTONOMY" y={140} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headEnter.translateY})`} opacity={headEnter.opacity}>
          <text x={60} y={264}
            fontFamily={FONT} fontSize={78} fontWeight={800}
            fill={COLORS.white}>
            The Model
          </text>
          <text x={60} y={366}
            fontFamily={FONT} fontSize={78} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Generates
          </text>
          <text x={60} y={448}
            fontFamily={FONT} fontSize={54} fontWeight={800}
            fill={COLORS.white}>
            the breakdown
          </text>
        </g>

        {/* Robot head illustration */}
        <g opacity={robotEnter.opacity}
          transform={`translate(200, ${breathe + 580})`}>
          {/* Head */}
          <rect x={-70} y={-70} width={140} height={140} rx={18}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2.5} />
          {/* Eyes */}
          <rect x={-44} y={-30} width={32} height={24} rx={6}
            fill={COLORS.accent} fillOpacity={0.8} />
          <rect x={14} y={-30} width={32} height={24} rx={6}
            fill={COLORS.accent} fillOpacity={0.8} />
          {/* Mouth grid */}
          <rect x={-40} y={16} width={80} height={20} rx={4}
            fill={COLORS.accent} fillOpacity={0.2}
            stroke={COLORS.accent} strokeWidth={1} />
          {/* Circuitry lines */}
          <line x1={-70} y1={0} x2={-90} y2={0} stroke={COLORS.accent} strokeWidth={1.5} opacity={0.5} />
          <line x1={70}  y1={0} x2={90}  y2={0} stroke={COLORS.accent} strokeWidth={1.5} opacity={0.5} />
          {/* Antenna */}
          <line x1={0} y1={-70} x2={0} y2={-100} stroke={COLORS.accent} strokeWidth={2} opacity={0.7} />
          <circle cx={0} cy={-106} r={7}
            fill={COLORS.accent} fillOpacity={0.6} transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px -106px' }} />
          {/* Label */}
          <text x={0} y={100} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>
            AI MODEL
          </text>
        </g>

        {/* Arrow */}
        <line x1={320} y1={630} x2={450} y2={630}
          stroke={COLORS.accent} strokeWidth={3} markerEnd="url(#arrow)"
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash} />

        {/* Generated plan card */}
        <g opacity={planEnter.opacity} transform={`translate(0, ${planEnter.translateY})`}>
          <BentoCard x={470} y={490} w={490} h={290} accent />
          <rect x={470} y={490} width={6} height={290} rx={3} fill={COLORS.accent} />
          <text x={490} y={544}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.06em">
            GENERATED PLAN
          </text>
          {[
            '1. Search for recent data',
            '2. Read each source',
            '3. Identify trends',
            '4. Draft sections',
            '5. Review + finalize',
          ].map((item, i) => (
            <text key={i} x={490} y={590 + i * 40}
              fontFamily={FONT} fontSize={28} fontWeight={800}
              fill={i === 0 ? COLORS.white : COLORS.text_muted}>
              {item}
            </text>
          ))}
        </g>

        {/* Insight card */}
        <g opacity={insightCard.opacity} transform={`translate(0, ${insightCard.translateY})`}>
          <BentoCard x={60} y={840} w={960} h={130} />
          <rect x={60} y={840} width={6} height={130} rx={3} fill={COLORS.accent} />
          <text x={540} y={898} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.white}>
            Not pre-programmed by a human
          </text>
          <text x={540} y={944} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            reasoned into existence at runtime
          </text>
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s15.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
