/**
 * Scene 14 — Static Vs Instance
 * "Now, static variables and instance variables both live inside a class, but they behave completely differently."
 * CSV: 76.790s → 85.100s | Duration: 248 frames (longest scene)
 *
 * Animation phases:
 *   Phase 1 (0–30): Label + headline
 *   Phase 2 (20–100): Two-column comparison (static vs instance)
 *   Phase 3 (90–end): Breathing, pulse
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

export const Scene14_StaticVsInstance: React.FC = () => {
  const frame = useCurrentFrame();

  const labelE = useSpringEntrance(frame, 0);
  const headE = useSpringEntrance(frame, 8);
  const subE = useSpringEntrance(frame, 14);

  // Column headers
  const staticH = useSpringEntrance(frame, 22);
  const instanceH = useSpringEntrance(frame, 30);

  // Static column rows
  const sRows = [
    { label: 'Belongs to', value: 'CLASS' },
    { label: 'Copies', value: 'ONE' },
    { label: 'Shared', value: 'YES' },
    { label: 'Created at', value: 'Class load' },
  ];
  const sEnters = sRows.map((_, i) => useSpringEntrance(frame, 36 + i * 12));

  // Instance column rows
  const iRows = [
    { label: 'Belongs to', value: 'OBJECT' },
    { label: 'Copies', value: 'MANY' },
    { label: 'Shared', value: 'NO' },
    { label: 'Created at', value: 'new keyword' },
  ];
  const iEnters = iRows.map((_, i) => useSpringEntrance(frame, 42 + i * 12));

  // Middle divider
  const divLen = 800;
  const divDash = usePathDraw(frame, 34, divLen, 30);

  // VS badge
  const vsE = useSpringEntrance(frame, 50);

  // Bottom
  const bottomE = useSpringEntrance(frame, 100);

  // Phase 3
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s14.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />
        <CornerAccents opacity={labelE.opacity * 0.3} />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="COMPARISON" y={140} />
        </g>

        <g transform={`translate(0, ${headE.translateY})`} opacity={headE.opacity}>
          <text x={60} y={280} fontFamily={FONT} fontSize={60} fontWeight={800} fill={COLORS.white}>
            Static vs Instance
          </text>
        </g>
        <g transform={`translate(0, ${subE.translateY})`} opacity={subE.opacity}>
          <text x={60} y={340} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            Both live inside a class — behave differently
          </text>
        </g>

        {/* Column headers */}
        <g opacity={staticH.opacity} transform={`translate(0, ${staticH.translateY})`}>
          <BentoCard x={60} y={400} w={470} h={80} accent />
          <text x={295} y={452} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent}>STATIC</text>
        </g>
        <g opacity={instanceH.opacity} transform={`translate(0, ${instanceH.translateY})`}>
          <BentoCard x={560} y={400} w={460} h={80} />
          <text x={790} y={452} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>INSTANCE</text>
        </g>

        {/* VS badge */}
        <g opacity={vsE.opacity}>
          <circle cx={540} cy={440} r={28} fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={2} />
          <text x={540} y={448} textAnchor="middle" fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent}>VS</text>
        </g>

        {/* Vertical divider */}
        <line x1={540} y1={500} x2={540} y2={1100}
          stroke={COLORS.accent} strokeWidth={1.5} opacity={0.15}
          strokeDasharray={divLen} strokeDashoffset={divDash} />

        {/* Static rows */}
        {sRows.map((row, i) => {
          const y = 520 + i * 150;
          return (
            <g key={`s${i}`} opacity={sEnters[i].opacity} transform={`translate(0, ${sEnters[i].translateY})`}>
              <BentoCard x={60} y={y} w={470} h={130} />
              <text x={100} y={y + 50} fontFamily={FONT} fontSize={28} fontWeight={800}
                fill={COLORS.text_muted}>{row.label}</text>
              <text x={100} y={y + 96} fontFamily={FONT} fontSize={40} fontWeight={800}
                fill={COLORS.accent}>{row.value}</text>
            </g>
          );
        })}

        {/* Instance rows */}
        {iRows.map((row, i) => {
          const y = 520 + i * 150;
          return (
            <g key={`i${i}`} opacity={iEnters[i].opacity} transform={`translate(0, ${iEnters[i].translateY})`}>
              <BentoCard x={560} y={y} w={460} h={130} />
              <text x={600} y={y + 50} fontFamily={FONT} fontSize={28} fontWeight={800}
                fill={COLORS.text_muted}>{row.label}</text>
              <text x={600} y={y + 96} fontFamily={FONT} fontSize={40} fontWeight={800}
                fill={COLORS.white}>{row.value}</text>
            </g>
          );
        })}

        {/* Bottom summary */}
        <g opacity={bottomE.opacity} transform={`translate(0, ${bottomE.translateY})`}>
          <BentoCard x={60} y={1140} w={960} h={140} accent />
          <rect x={60} y={1140} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={100} y={1198} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Same class, completely
          </text>
          <text x={630} y={1198} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            different behavior
          </text>
          <text x={100} y={1248} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Confusing them breaks your system
          </text>
        </g>

        {/* Floating */}
        <g transform={`translate(540, ${1420 + breathe})`}>
          <circle r={30} fill={COLORS.accent} fillOpacity={0.04} />
          <circle r={30} fill="none" stroke={COLORS.accent} strokeWidth={2}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} opacity={0.3} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s14.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
