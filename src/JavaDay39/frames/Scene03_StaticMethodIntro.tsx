/**
 * Scene 03 — Static Method Intro
 * "Today, we learn the static method."
 * CSV: 14.060s → 16.500s | Duration: 73 frames
 * Animation: Phase 1 big reveal → Phase 2 method icon → Phase 3 shimmer
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, FPS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

export const Scene03_StaticMethodIntro: React.FC = () => {
  const frame = useCurrentFrame();

  const label = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 4);
  const headB = useSpringEntrance(frame, 8);
  const card1 = useSpringEntrance(frame, 14);

  const shimmer = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.7, 1]);
  const breathe = Math.sin(frame * 0.07) * 5;
  const pulse = 1 + Math.sin(frame * 0.09) * 0.02;

  // Gear teeth for method icon
  const gearPath = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    const inner = 60, outer = 85;
    const a1 = angle - 0.2, a2 = angle + 0.2;
    return `L ${Math.cos(a1) * outer},${Math.sin(a1) * outer} L ${Math.cos(a2) * outer},${Math.sin(a2) * outer} L ${Math.cos(a2 + 0.15) * inner},${Math.sin(a2 + 0.15) * inner}`;
  }).join(' ');

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s03.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <DarkBackground />
        <GlobalDefs />

        <g opacity={label.opacity} transform={`translate(0,${label.translateY})`}>
          <SectionLabel text="MODULE 2 · STATIC METHOD" y={160} />
        </g>

        {/* Ghost text */}
        <g opacity={headA.opacity * 0.06}>
          <text x={540} y={700} textAnchor="middle" fontFamily={FONT} fontSize={280} fontWeight={800} fill={COLORS.accent}>
            STATIC
          </text>
        </g>

        <g opacity={headA.opacity} transform={`translate(0,${headA.translateY})`}>
          <text x={540} y={420} textAnchor="middle" fontFamily={FONT} fontSize={110} fontWeight={800} fill={COLORS.white}>
            Static
          </text>
        </g>
        <g opacity={headB.opacity} transform={`translate(0,${headB.translateY})`}>
          <text x={540} y={540} textAnchor="middle" fontFamily={FONT} fontSize={110} fontWeight={800} fill={COLORS.accent}>
            Method
          </text>
        </g>

        {/* Large gear icon */}
        <g opacity={card1.opacity} transform={`translate(540, ${900 + breathe})`}>
          <g transform={`rotate(${frame * 0.5})`} style={{ transformOrigin: '0px 0px' }}>
            <path d={`M ${Math.cos(-0.35) * 60},${Math.sin(-0.35) * 60} ${gearPath} Z`}
              fill={COLORS.accent} fillOpacity={0.12} stroke={COLORS.accent} strokeWidth={2.5} />
          </g>
          <circle cx={0} cy={0} r={35} fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          <text x={0} y={12} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>( )</text>
        </g>

        {/* Bento explanation card */}
        <g opacity={card1.opacity} transform={`translate(0,${card1.translateY})`}>
          <BentoCard x={60} y={1100} w={960} h={200} accent />
          <text x={540} y={1180} textAnchor="middle" fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            Called on the Class
          </text>
          <text x={540} y={1240} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            No object required
          </text>
        </g>

        {/* Pulse ring */}
        <g transform={`translate(540, ${1480 + breathe})`}>
          <circle cx={0} cy={0} r={50} fill={COLORS.accent} fillOpacity={0.05 * shimmer} />
          <circle cx={0} cy={0} r={50} fill="none" stroke={COLORS.accent} strokeWidth={1.5} transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {caption && <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s03.duration} />}
      </svg>
    </AbsoluteFill>
  );
};
