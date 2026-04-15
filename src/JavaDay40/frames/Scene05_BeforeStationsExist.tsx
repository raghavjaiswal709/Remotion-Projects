/**
 * Scene 05 — Before Stations Exist
 * "before a single station object exists, the system needs certain data ready."
 * CSV: 22.220s → 28.180s | Duration: 179 frames
 *
 * Animation phases:
 *   Phase 1 (0–30): Label + headline spring
 *   Phase 2 (20–90): Empty station grid + data dependency arrows
 *   Phase 3 (80–end): Pulse on "DATA NEEDED" badge
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, FPS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

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

export const Scene05_BeforeStationsExist: React.FC = () => {
  const frame = useCurrentFrame();

  const labelE = useSpringEntrance(frame, 0);
  const headE = useSpringEntrance(frame, 8);
  const subE = useSpringEntrance(frame, 16);

  // Empty station slots
  const stationSlots = [0, 1, 2, 3].map(i => useSpringEntrance(frame, 28 + i * 12));

  // Data badge
  const dataE = useSpringEntrance(frame, 60);
  const arrowLen = 200;
  const arrowDash = usePathDraw(frame, 68, arrowLen, 25);

  // Bottom card
  const cardE = useSpringEntrance(frame, 72);

  // Phase 3
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.09) * 0.018;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.8, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s05.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="APPLICATION STARTUP" y={140} />
        </g>

        <g transform={`translate(0, ${headE.translateY})`} opacity={headE.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Before Stations
          </text>
        </g>
        <g transform={`translate(0, ${subE.translateY})`} opacity={subE.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.accent}>
            Data must be ready first
          </text>
        </g>

        {/* Empty station grid */}
        <g>
          {[
            { x: 60, y: 460, label: 'Station A' },
            { x: 560, y: 460, label: 'Station B' },
            { x: 60, y: 680, label: 'Station C' },
            { x: 560, y: 680, label: 'Station D' },
          ].map((s, i) => (
            <g key={i} opacity={stationSlots[i].opacity} transform={`translate(0, ${stationSlots[i].translateY})`}>
              <rect x={s.x} y={s.y} width={460} height={180} rx={20}
                fill="none" stroke={COLORS.text_muted} strokeWidth={2}
                strokeDasharray="14 10" opacity={0.35} />
              {/* Station icon — platform shape */}
              <rect x={s.x + 40} y={s.y + 50} width={120} height={16} rx={4}
                fill={COLORS.text_muted} opacity={0.2} />
              <rect x={s.x + 40} y={s.y + 80} width={120} height={4} rx={2}
                fill={COLORS.text_muted} opacity={0.15} />
              <text x={s.x + 200} y={s.y + 80} fontFamily={FONT} fontSize={32} fontWeight={800}
                fill={COLORS.text_muted} opacity={0.4}>{s.label}</text>
              <text x={s.x + 200} y={s.y + 120} fontFamily={FONT} fontSize={28} fontWeight={800}
                fill={COLORS.text_muted} opacity={0.3}>NOT CREATED</text>
            </g>
          ))}
        </g>

        {/* Data dependency badge */}
        <g opacity={dataE.opacity} transform={`translate(0, ${dataE.translateY})`}>
          <BentoCard x={60} y={910} w={960} h={200} accent />
          <rect x={60} y={910} width={6} height={200} rx={3} fill={COLORS.accent} />
          {/* Warning icon */}
          <circle cx={120} cy={1010} r={30} fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={120} y={1020} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent}>!</text>
          <text x={180} y={990} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            System Needs Data Ready
          </text>
          <text x={180} y={1040} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Before any station object can be created
          </text>
        </g>

        {/* Arrow from data badge to stations */}
        <path d="M 540,910 L 540,860 L 300,680 M 540,860 L 780,680"
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)" opacity={dataE.opacity * 0.7} />

        {/* Bottom info */}
        <g opacity={cardE.opacity} transform={`translate(0, ${cardE.translateY})`}>
          <BentoCard x={60} y={1160} w={960} h={160} />
          <text x={100} y={1240} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Certain data must exist
          </text>
          <text x={100} y={1290} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            before the first object is ever constructed
          </text>
        </g>

        {/* Floating pulse */}
        <g transform={`translate(540, ${1470 + breathe})`} opacity={shimmer}>
          <circle r={40} fill={COLORS.accent} fillOpacity={0.05} />
          <circle r={40} fill="none" stroke={COLORS.accent} strokeWidth={2}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} opacity={0.4} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s05.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
