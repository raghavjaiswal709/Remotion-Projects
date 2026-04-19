/**
 * Scene 17 — Decision Correct
 * "Was this decision correct given this input?"
 * CSV: 54.380s → 57.260s
 * Duration: 86 frames (2.87s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–20): Label + headline
 *   Phase 2 (frames 16–60): Decision diagram — input box → decision diamond → output
 *   Phase 3 (frames 55–end): Pulse on diamond
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

export const Scene17_DecisionCorrect: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headEnt = useSpringEntrance(frame, 6);
  const inputBox = useSpringEntrance(frame, 16);
  const diamond = useSpringEntrance(frame, 28);
  const outputBox = useSpringEntrance(frame, 40);
  const questionCard = useSpringEntrance(frame, 50);

  // Arrow path draws
  const arrow1Dash = usePathDraw(frame, 24, 180, 20);
  const arrow2Dash = usePathDraw(frame, 36, 180, 20);

  // Phase 3
  const pulse = 1 + Math.sin(frame * 0.08) * 0.02;
  const breathe = Math.sin(frame * 0.06) * 3;

  // Diamond perimeter
  const diamondPerimeter = 4 * 120 * Math.SQRT2;
  const diamondDash = usePathDraw(frame, 28, diamondPerimeter, 22);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s17.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="AUDIT · QUESTION" y={160} />
        </g>

        {/* ZONE B */}
        <g transform={`translate(0, ${headEnt.translateY})`} opacity={headEnt.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={68} fontWeight={800} fill={COLORS.white}>
            Was This Correct?
          </text>
          <text x={60} y={380} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}>
            Given <tspan fontStyle="italic">this</tspan> input
          </text>
        </g>

        {/* ZONE C — Flow diagram */}
        {/* Input box */}
        <g opacity={inputBox.opacity} transform={`translate(0, ${inputBox.translateY})`}>
          <BentoCard x={80} y={520} w={280} h={180} />
          <text x={220} y={590} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.1em">INPUT</text>
          {/* Document icon */}
          <rect x={180} y={610} width={80} height={60} rx={6} fill="none"
            stroke={COLORS.accent} strokeWidth={2} />
          <line x1={196} y1={628} x2={244} y2={628} stroke={COLORS.text_muted} strokeWidth={2} />
          <line x1={196} y1={644} x2={230} y2={644} stroke={COLORS.text_muted} strokeWidth={2} />
        </g>

        {/* Arrow input→diamond */}
        <line x1={360} y1={610} x2={440} y2={610}
          stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round"
          markerEnd="url(#arrow)"
          strokeDasharray={180} strokeDashoffset={arrow1Dash} />

        {/* Decision diamond */}
        <g opacity={diamond.opacity} transform={`translate(540, ${610 + diamond.translateY}) scale(${pulse})`}
          style={{ transformOrigin: '0px 0px' }}>
          <polygon points="0,-100 120,0 0,100 -120,0"
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={diamondPerimeter} strokeDashoffset={diamondDash} />
          <text x={0} y={8} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>CORRECT?</text>
        </g>

        {/* Arrow diamond→output */}
        <line x1={660} y1={610} x2={740} y2={610}
          stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round"
          markerEnd="url(#arrow)"
          strokeDasharray={180} strokeDashoffset={arrow2Dash} />

        {/* Output box */}
        <g opacity={outputBox.opacity} transform={`translate(0, ${outputBox.translateY})`}>
          <BentoCard x={740} y={520} w={280} h={180} accent />
          <text x={880} y={590} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">OUTPUT</text>
          {/* Checkmark */}
          <path d="M 848,630 L 868,650 L 912,606" fill="none"
            stroke={COLORS.accent} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={100} strokeDashoffset={usePathDraw(frame, 45, 100, 15)} />
        </g>

        {/* Question card */}
        <g opacity={questionCard.opacity} transform={`translate(0, ${questionCard.translateY + breathe})`}>
          <BentoCard x={60} y={820} w={960} h={200} accent />
          <rect x={60} y={820} width={6} height={200} rx={3} fill={COLORS.accent} />

          {/* Big question mark */}
          <text x={120} y={960} fontFamily={FONT} fontSize={100} fontWeight={800}
            fill={COLORS.accent} opacity={0.15}>?</text>

          <text x={220} y={910} fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.white}>
            Was <tspan fill={COLORS.accent} fontStyle="italic">this decision</tspan> correct
          </text>
          <text x={220} y={968} fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.text_muted}>
            given <tspan fill={COLORS.accent} fontStyle="italic">this input</tspan>?
          </text>
        </g>

        {/* Floating particles */}
        <circle cx={200} cy={1200 + breathe} r={6} fill={COLORS.accent} fillOpacity={0.12} />
        <circle cx={880} cy={1300 - breathe} r={10} fill={COLORS.accent} fillOpacity={0.08} />

        {/* CAPTION */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s17.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
