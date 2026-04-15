/**
 * Scene 15 — Difference Meaning (Day 41 Teaser)
 * "That exact difference and why confusing them breaks the system is what we break down next."
 * CSV: 85.100s → 90.950s | Duration: 177 frames
 *
 * Animation phases:
 *   Phase 1 (0–30): Label + headline
 *   Phase 2 (20–80): Tomorrow teaser cards + forward arrow
 *   Phase 3 (70–end): Breathing, pulse
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, FPS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel, CornerAccents } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;

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

export const Scene15_DifferenceMeaning: React.FC = () => {
  const frame = useCurrentFrame();

  const labelE = useSpringEntrance(frame, 0);
  const headE = useSpringEntrance(frame, 8);
  const subE = useSpringEntrance(frame, 14);

  // Today recap cards
  const todayE = useSpringEntrance(frame, 22);
  const recapItems = ['Static Block Runs at Class Load', 'One-Time Setup Before Objects', 'JVM Triggers It Automatically'];
  const recapEs = recapItems.map((_, i) => useSpringEntrance(frame, 30 + i * 12));

  // Forward arrow
  const arrowLen = 200;
  const arrowDash = usePathDraw(frame, 66, arrowLen, 25);

  // Tomorrow card
  const tmrwE = useSpringEntrance(frame, 72);

  // Bottom
  const bottomE = useSpringEntrance(frame, 84);

  // Phase 3
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s15.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />
        <CornerAccents opacity={labelE.opacity * 0.3} />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="COMING NEXT" y={140} />
        </g>

        <g transform={`translate(0, ${headE.translateY})`} opacity={headE.opacity}>
          <text x={60} y={290} fontFamily={FONT} fontSize={64} fontWeight={800} fill={COLORS.white}>
            Why It Matters
          </text>
        </g>
        <g transform={`translate(0, ${subE.translateY})`} opacity={subE.opacity}>
          <text x={60} y={360} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            Confusing them breaks the system
          </text>
        </g>

        {/* TODAY label */}
        <g opacity={todayE.opacity} transform={`translate(0, ${todayE.translateY})`}>
          <text x={60} y={440} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}
            letterSpacing="0.12em">TODAY — DAY 40</text>
        </g>

        {/* Recap cards */}
        {recapItems.map((item, i) => (
          <g key={i} opacity={recapEs[i].opacity} transform={`translate(0, ${recapEs[i].translateY})`}>
            <BentoCard x={60} y={470 + i * 140} w={960} h={120} />
            <circle cx={110} cy={530 + i * 140} r={16} fill={COLORS.accent} fillOpacity={0.15}
              stroke={COLORS.accent} strokeWidth={1.5} />
            <text x={110} y={538 + i * 140} textAnchor="middle" fontFamily={FONT} fontSize={20} fontWeight={800}
              fill={COLORS.accent}>{i + 1}</text>
            <text x={150} y={538 + i * 140} fontFamily={FONT} fontSize={34} fontWeight={800}
              fill={COLORS.white}>{item}</text>
          </g>
        ))}

        {/* Forward arrow */}
        <line x1={540} y1={900} x2={540} y2={990}
          stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)" opacity={tmrwE.opacity * 0.7} />

        {/* Tomorrow card */}
        <g opacity={tmrwE.opacity} transform={`translate(0, ${tmrwE.translateY})`}>
          <BentoCard x={60} y={1010} w={960} h={240} accent />
          <rect x={60} y={1010} width={6} height={240} rx={3} fill={COLORS.accent} />
          <text x={100} y={1078} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.12em">TOMORROW — DAY 41</text>
          <text x={100} y={1138} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent}>
            Static vs Instance
          </text>
          <text x={100} y={1196} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Why confusing them breaks the system
          </text>
        </g>

        {/* Bottom CTA */}
        <g opacity={bottomE.opacity} transform={`translate(0, ${bottomE.translateY})`}>
          <BentoCard x={60} y={1300} w={960} h={120} />
          <text x={540} y={1374} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent}>We break it down next</text>
          {/* Forward arrow icon */}
          <path d="M 940,1360 L 960,1374 L 940,1388" fill="none" stroke={COLORS.accent}
            strokeWidth={3} strokeLinecap="round" opacity={shimmer} />
        </g>

        {/* Floating */}
        <g transform={`translate(540, ${1520 + breathe})`}>
          <circle r={30} fill={COLORS.accent} fillOpacity={0.04} />
          <circle r={30} fill="none" stroke={COLORS.accent} strokeWidth={2}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} opacity={0.3} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s15.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
