/**
 * Scene 02 — Static Method Recap
 * "Last day, we learned how a static method belongs to the class and requires no object to be called."
 * CSV: 6.360s → 13.720s | Duration: 220 frames
 *
 * Animation phases:
 *   Phase 1 (0–30): Label + headline spring in
 *   Phase 2 (20–90): Recap cards + class diagram build
 *   Phase 3 (80–end): Micro-animations — pulse on class node
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

function usePathDraw(frame: number, start: number, len: number, dur = 30) {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return len * (1 - p);
}

export const Scene02_StaticMethodRecap: React.FC = () => {
  const frame = useCurrentFrame();

  // Phase 1
  const labelE = useSpringEntrance(frame, 0);
  const headE = useSpringEntrance(frame, 8);
  const subE = useSpringEntrance(frame, 16);

  // Phase 2 — class diagram
  const classBoxE = useSpringEntrance(frame, 24);
  const methodE = useSpringEntrance(frame, 36);
  const arrowLen = 120;
  const arrowDash = usePathDraw(frame, 44, arrowLen, 20);

  // Recap cards
  const card1 = useSpringEntrance(frame, 48);
  const card2 = useSpringEntrance(frame, 60);
  const card3 = useSpringEntrance(frame, 72);

  // Phase 3
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.012;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.8, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s02.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A */}
        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="DAY 39 RECAP · STATIC METHOD" y={140} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headE.translateY})`} opacity={headE.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Static Method
          </text>
        </g>
        <g transform={`translate(0, ${subE.translateY})`} opacity={subE.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.accent}>
            Belongs to the class, not the object
          </text>
        </g>

        {/* Zone C — Class diagram */}
        <g opacity={classBoxE.opacity} transform={`translate(0, ${classBoxE.translateY})`}>
          <BentoCard x={60} y={460} w={960} h={360} accent />
          {/* Class box */}
          <rect x={340} y={500} width={400} height={60} rx={10}
            fill={COLORS.accent} fillOpacity={0.15} stroke={COLORS.accent} strokeWidth={2} />
          <text x={540} y={542} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent}>Station</text>
          {/* Divider */}
          <line x1={340} y1={560} x2={740} y2={560} stroke={COLORS.accent} strokeWidth={1} opacity={0.4} />
          {/* Fields */}
          <text x={370} y={600} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            - name: String
          </text>
          <text x={370} y={640} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            - platformCount: int
          </text>
          {/* Divider */}
          <line x1={340} y1={660} x2={740} y2={660} stroke={COLORS.accent} strokeWidth={1} opacity={0.4} />
        </g>

        {/* Static method highlight */}
        <g opacity={methodE.opacity} transform={`translate(0, ${methodE.translateY})`}>
          <rect x={340} y={670} width={400} height={50} rx={8}
            fill={COLORS.accent} fillOpacity={0.08} />
          <text x={370} y={704} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            + getTotalStations()
          </text>
          <text x={640} y={704} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            static
          </text>
        </g>

        {/* Arrow from "CLASS" label to method */}
        <g opacity={methodE.opacity}>
          <line x1={540} y1={740} x2={540} y2={740 + arrowLen}
            stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
            markerEnd="url(#arrow)" />
          <text x={560} y={820} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted} opacity={methodE.opacity}>
            Called on CLASS
          </text>
        </g>

        {/* Recap cards */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={900} w={460} h={200} />
          <rect x={60} y={900} width={6} height={200} rx={3} fill={COLORS.accent} />
          <text x={100} y={960} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>No Object</text>
          <text x={100} y={1010} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>Required</text>
          <text x={100} y={1060} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Call directly on class
          </text>
        </g>
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={560} y={900} w={460} h={200} accent />
          <text x={600} y={960} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>Shared</text>
          <text x={600} y={1010} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>Behavior</text>
          <text x={600} y={1060} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Same logic for all instances
          </text>
        </g>
        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={60} y={1130} w={960} h={160} />
          <text x={100} y={1200} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Station.getTotalNetworkStations()
          </text>
          <text x={100} y={1250} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            No instance needed — called on the class itself
          </text>
        </g>

        {/* Floating pulse on class node */}
        <g transform={`translate(540, ${1440 + breathe})`} opacity={shimmer}>
          <circle r={36} fill={COLORS.accent} fillOpacity={0.06} />
          <circle r={36} fill="none" stroke={COLORS.accent} strokeWidth={2}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} opacity={0.4} />
          <text textAnchor="middle" y={8} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>CLASS</text>
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s02.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
