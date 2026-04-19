/**
 * Scene 22 — The Gate
 * "this check is the gate that stands between correct behavior and a production crash."
 * CSV: 63.280s → 67.580s | Duration: 95 frames
 *
 * Animation phases:
 *   Phase 1 (0–18): Label + headline
 *   Phase 2 (14–60): Gate diagram
 *   Phase 3 (50–end): Pulse, shimmer
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const MONO = "'Fira Code', 'Courier New', monospace";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
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

export const Scene22_TheGate: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelE = useSpringEntrance(frame, 0);
  const headE = useSpringEntrance(frame, 5);
  const gateE = useSpringEntrance(frame, 14);
  const leftE = useSpringEntrance(frame, 22);
  const rightE = useSpringEntrance(frame, 28);
  const arrowLeftE = useSpringEntrance(frame, 26);
  const arrowRightE = useSpringEntrance(frame, 32);
  const codeE = useSpringEntrance(frame, 40);
  const summaryE = useSpringEntrance(frame, 50);

  const gateDrawLen = 400;
  const gateDash = usePathDraw(frame, 14, gateDrawLen, 20);

  const leftArrowLen = 120;
  const rightArrowLen = 120;
  const leftArrowDash = usePathDraw(frame, 26, leftArrowLen, 14);
  const rightArrowDash = usePathDraw(frame, 32, rightArrowLen, 14);

  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const breathe = Math.sin(frame * 0.06) * 3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s22.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="INSTANCEOF · THE GATE" y={160} />
        </g>

        <g transform={`translate(0, ${headE.translateY})`} opacity={headE.opacity}>
          <text x={540} y={310} textAnchor="middle" fontFamily={FONT} fontSize={88} fontWeight={800}
            fill={COLORS.white}>The Gate</text>
          <text x={540} y={400} textAnchor="middle" fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.accent}>Between safety and crash</text>
        </g>

        {/* Gate structure */}
        <g opacity={gateE.opacity} transform={`translate(0, ${gateE.translateY})`}>
          {/* Gate pillars */}
          <rect x={460} y={490} width={16} height={280} rx={4} fill={COLORS.accent} fillOpacity={0.6} />
          <rect x={604} y={490} width={16} height={280} rx={4} fill={COLORS.accent} fillOpacity={0.6} />
          {/* Gate arch */}
          <path d={`M 460,490 Q 540,440 620,490`}
            fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={gateDrawLen} strokeDashoffset={gateDash}
            strokeLinecap="round" />
          {/* Gate label */}
          <text x={540} y={480} textAnchor="middle" fontFamily={MONO} fontSize={24} fontWeight={500}
            fill={COLORS.accent}>instanceof</text>
          {/* Gate bars */}
          {[0, 1, 2, 3, 4].map(i => (
            <rect key={i} x={480 + i * 28} y={500} width={4} height={260} rx={2}
              fill={COLORS.accent} fillOpacity={0.15 * shimmer} />
          ))}
        </g>

        {/* Left side: Correct Behavior */}
        <g opacity={leftE.opacity} transform={`translate(0, ${leftE.translateY})`}>
          <BentoCard x={60} y={560} w={360} h={180} accent />
          <path d="M 420,650 L 460,650" fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={leftArrowLen} strokeDashoffset={leftArrowDash}
            markerEnd="url(#arrow)" opacity={arrowLeftE.opacity} />
          <text x={240} y={630} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>Correct</text>
          <text x={240} y={670} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.white}>Behavior</text>
          <text x={240} y={720} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>Safe cast, methods work</text>
        </g>

        {/* Right side: Production Crash */}
        <g opacity={rightE.opacity} transform={`translate(0, ${rightE.translateY})`}>
          <BentoCard x={660} y={560} w={360} h={180} />
          <path d="M 660,650 L 620,650" fill="none" stroke={COLORS.vibrant_red} strokeWidth={2}
            strokeDasharray={rightArrowLen} strokeDashoffset={rightArrowDash}
            opacity={arrowRightE.opacity} />
          <text x={840} y={630} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.vibrant_red}>Production</text>
          <text x={840} y={670} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.white}>Crash</text>
          <text x={840} y={720} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>ClassCastException</text>
        </g>

        {/* Code block */}
        <g opacity={codeE.opacity} transform={`translate(0, ${codeE.translateY})`}>
          <BentoCard x={60} y={830} w={960} h={220} accent />
          <rect x={60} y={830} width={6} height={220} rx={3} fill={COLORS.accent} />
          <text x={100} y={895} fontFamily={MONO} fontSize={26} fontWeight={500} fill={COLORS.accent}>
            {'// The gate check'}
          </text>
          <text x={100} y={940} fontFamily={MONO} fontSize={26} fontWeight={500} fill={COLORS.white}>
            {'if (t instanceof ExpressTrain) {'}
          </text>
          <text x={140} y={980} fontFamily={MONO} fontSize={26} fontWeight={500} fill={COLORS.text_muted}>
            {'ExpressTrain e = (ExpressTrain) t;'}
          </text>
          <text x={100} y={1020} fontFamily={MONO} fontSize={26} fontWeight={500} fill={COLORS.white}>
            {'}'}
          </text>
        </g>

        {/* Summary */}
        <g opacity={summaryE.opacity} transform={`translate(0, ${summaryE.translateY})`}>
          <BentoCard x={60} y={1110} w={960} h={200} />
          <text x={540} y={1180} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>This single check is the difference</text>
          <text x={540} y={1230} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent}>between a working system</text>
          <text x={540} y={1280} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.vibrant_red}>and a runtime explosion</text>
        </g>

        {/* Shield icon */}
        <g opacity={summaryE.opacity} transform={`translate(540, ${1430 + breathe})`}>
          <path d="M 0,-40 L 32,-24 L 32,10 Q 32,40 0,52 Q -32,40 -32,10 L -32,-24 Z"
            fill={COLORS.accent} fillOpacity={0.08} stroke={COLORS.accent} strokeWidth={2}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s22.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
