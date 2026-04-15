/**
 * Scene 14 — Invoked On Class
 * "Static methods invoked on the class itself."
 * CSV: 74.900s → 78.260s | Duration: 101 frames
 * Animation: Phase 1 headline → Phase 2 diagram → Phase 3 pulse
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, FPS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const MONO = "'Fira Code', 'Courier New', monospace";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, start: number, len: number, dur = 25) {
  const p = interpolate(frame, [start, start + dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.4, 0, 0.2, 1) });
  return len * (1 - p);
}

export const Scene14_InvokedOnClass: React.FC = () => {
  const frame = useCurrentFrame();

  const label = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const card1 = useSpringEntrance(frame, 16);
  const card2 = useSpringEntrance(frame, 30);

  const arrowDraw = usePathDraw(frame, 24, 200, 20);
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s14.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <DarkBackground />
        <GlobalDefs />

        <g opacity={label.opacity} transform={`translate(0,${label.translateY})`}>
          <SectionLabel text="KEY RULE · INVOCATION" y={160} />
        </g>

        <g opacity={headA.opacity} transform={`translate(0,${headA.translateY})`}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>Invoked on the</text>
          <text x={60} y={400} fontFamily={FONT} fontSize={84} fontWeight={800} fill={COLORS.accent} fontStyle="italic">Class Itself</text>
        </g>

        {/* Central diagram */}
        <g opacity={card1.opacity} transform={`translate(0,${card1.translateY})`}>
          <BentoCard x={60} y={480} w={960} h={520} accent />

          {/* Large class box */}
          <rect x={320} y={530} width={440} height={200} rx={20} fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={3} />
          <rect x={320} y={530} width={440} height={56} rx={20} fill={COLORS.accent} fillOpacity={0.15} />
          <text x={540} y={570} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>Station</text>
          <text x={540} y={670} textAnchor="middle" fontFamily={MONO} fontSize={28} fontWeight={500} fill={COLORS.text_muted}>static getTotal()</text>

          {/* Arrow from "code" to class */}
          <path d="M 540,780 L 540,730" fill="none" stroke={COLORS.accent} strokeWidth={3} strokeDasharray={200} strokeDashoffset={arrowDraw} markerEnd="url(#arrow)" />

          {/* Call syntax */}
          <rect x={280} y={800} width={520} height={80} rx={12} fill={COLORS.accent} fillOpacity={0.08} stroke={COLORS.accent} strokeWidth={2} />
          <text x={540} y={852} textAnchor="middle" fontFamily={MONO} fontSize={36} fontWeight={500} fill={COLORS.white}>
            Station<tspan fill={COLORS.accent}>.getTotal()</tspan>
          </text>

          {/* Label */}
          <text x={540} y={940} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            ClassName.methodName()
          </text>
        </g>

        {/* Bottom highlight */}
        <g opacity={card2.opacity} transform={`translate(0,${card2.translateY})`}>
          <BentoCard x={60} y={1040} w={960} h={140} accent />
          <text x={540} y={1128} textAnchor="middle" fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            No <tspan fill={COLORS.vibrant_red}>new</tspan> keyword. No object.
          </text>
        </g>

        <g transform={`translate(540, ${1300 + breathe})`}>
          <circle cx={0} cy={0} r={26} fill={COLORS.accent} fillOpacity={0.06} />
          <circle cx={0} cy={0} r={26} fill="none" stroke={COLORS.accent} strokeWidth={1.5} transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {caption && <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s14.duration} />}
      </svg>
    </AbsoluteFill>
  );
};
