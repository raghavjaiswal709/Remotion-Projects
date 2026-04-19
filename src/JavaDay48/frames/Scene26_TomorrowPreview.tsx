/**
 * Scene 26 — Tomorrow Preview
 * "Tomorrow, Java goes further."
 * CSV: 76.480s → 78.280s | Duration: 72 frames
 *
 * Animation phases:
 *   Phase 1 (0–12): Label + headline
 *   Phase 2 (8–40): Forward arrow + preview
 *   Phase 3 (35–end): Pulse, shimmer
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
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

export const Scene26_TomorrowPreview: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelE = useSpringEntrance(frame, 0);
  const headE = useSpringEntrance(frame, 4);
  const todayE = useSpringEntrance(frame, 10);
  const arrowE = useSpringEntrance(frame, 18);
  const tomorrowE = useSpringEntrance(frame, 24);
  const noteE = useSpringEntrance(frame, 32);

  const arrowLen = 300;
  const arrowDash = usePathDraw(frame, 20, arrowLen, 20);

  const pulse = 1 + Math.sin(frame * 0.1) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.85, 1]);
  const breathe = Math.sin(frame * 0.06) * 4;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s26.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="NEXT · DAY 49" y={160} />
        </g>

        <g transform={`translate(0, ${headE.translateY})`} opacity={headE.opacity}>
          <text x={540} y={310} textAnchor="middle" fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.white}>Tomorrow</text>
          <text x={540} y={420} textAnchor="middle" fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.accent}>Java Goes Further</text>
        </g>

        {/* Today card */}
        <g opacity={todayE.opacity} transform={`translate(0, ${todayE.translateY})`}>
          <BentoCard x={60} y={540} w={960} h={200} />
          <rect x={60} y={540} width={6} height={200} rx={3} fill={COLORS.text_muted} />
          <text x={100} y={610} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>DAY 48 — TODAY</text>
          <text x={100} y={670} fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.white}>instanceof keyword</text>
          <text x={100} y={720} fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.text_muted}>Check type, then cast separately</text>
        </g>

        {/* Arrow */}
        <path d="M 540,760 L 540,900" fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeLinecap="round" strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)" opacity={arrowE.opacity} />

        {/* Chevrons */}
        {[0, 1, 2].map(i => {
          const y = 790 + i * 40;
          const op = interpolate(frame, [22 + i * 4, 28 + i * 4], [0, 0.3 + i * 0.15], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          });
          return (
            <path key={i} d={`M 520,${y} L 540,${y + 15} L 560,${y}`}
              fill="none" stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round"
              opacity={op} />
          );
        })}

        {/* Tomorrow card */}
        <g opacity={tomorrowE.opacity} transform={`translate(0, ${tomorrowE.translateY})`}>
          <BentoCard x={60} y={920} w={960} h={260} accent />
          <rect x={60} y={920} width={6} height={260} rx={3} fill={COLORS.accent} />
          <text x={100} y={990} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>DAY 49 — TOMORROW</text>
          <text x={100} y={1050} fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.white}>instanceof Pattern Matching</text>
          <text x={100} y={1110} fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.text_muted}>Check type AND bind variable — one line</text>
          <text x={100} y={1155} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">Java 16+</text>
        </g>

        {/* Floating accent orb */}
        <g transform={`translate(540, ${1340 + breathe})`}>
          <circle cx={0} cy={0} r={40} fill={COLORS.accent} fillOpacity={0.08 * shimmer} />
          <circle cx={0} cy={0} r={40} fill="none" stroke={COLORS.accent} strokeWidth={2}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {/* Bottom note */}
        <g opacity={noteE.opacity} transform={`translate(0, ${noteE.translateY})`}>
          <BentoCard x={120} y={1440} w={840} h={100} />
          <text x={540} y={1502} textAnchor="middle" fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.white}>The evolution of type safety in Java</text>
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s26.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
