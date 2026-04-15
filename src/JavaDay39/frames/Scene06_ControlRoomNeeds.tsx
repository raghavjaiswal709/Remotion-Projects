/**
 * Scene 06 — Control Room Needs
 * "The control room needs station.total network stations."
 * CSV: 29.240s → 34.040s | Duration: 144 frames
 * Animation: Phase 1 label → Phase 2 control room + station → Phase 3 micro
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

function usePathDraw(frame: number, start: number, len: number, dur = 30) {
  const p = interpolate(frame, [start, start + dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.4, 0, 0.2, 1) });
  return len * (1 - p);
}

export const Scene06_ControlRoomNeeds: React.FC = () => {
  const frame = useCurrentFrame();

  const label = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const card1 = useSpringEntrance(frame, 18);
  const card2 = useSpringEntrance(frame, 30);
  const card3 = useSpringEntrance(frame, 42);

  const arrowLen = 300;
  const arrow1 = usePathDraw(frame, 45, arrowLen, 30);

  const breathe = Math.sin(frame * 0.06) * 3;
  const screenFlicker = 0.8 + 0.2 * Math.sin(frame * 0.15);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s06.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <DarkBackground />
        <GlobalDefs />

        <g opacity={label.opacity} transform={`translate(0,${label.translateY})`}>
          <SectionLabel text="CONTROL ROOM · QUERY" y={160} />
        </g>

        <g opacity={headA.opacity} transform={`translate(0,${headA.translateY})`}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>Control Room</text>
          <text x={60} y={390} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent}>Needs Network Data</text>
        </g>

        {/* Control Room building */}
        <g opacity={card1.opacity} transform={`translate(0,${card1.translateY})`}>
          <BentoCard x={60} y={470} w={440} h={480} accent />
          {/* Building shape */}
          <rect x={120} y={540} width={320} height={280} rx={8} fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Roof */}
          <polygon points="120,540 280,470 440,540" fill={COLORS.accent} fillOpacity={0.12} stroke={COLORS.accent} strokeWidth={1.5} />
          {/* Windows (screens) */}
          {[0, 1, 2, 3].map(i => {
            const wx = 150 + (i % 2) * 160;
            const wy = 570 + Math.floor(i / 2) * 120;
            return (
              <g key={i}>
                <rect x={wx} y={wy} width={100} height={70} rx={4} fill={COLORS.accent} opacity={0.08 + 0.04 * Math.sin(frame * 0.1 + i)} />
                <rect x={wx} y={wy} width={100} height={70} rx={4} fill="none" stroke={COLORS.accent} strokeWidth={1} opacity={screenFlicker} />
              </g>
            );
          })}
          {/* CONTROL label */}
          <text x={280} y={870} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>CONTROL ROOM</text>
        </g>

        {/* Arrow to method call */}
        <path d="M 500,700 C 530,700 530,700 560,700" fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeDasharray={arrowLen} strokeDashoffset={arrow1} markerEnd="url(#arrow)" />

        {/* Method call box */}
        <g opacity={card2.opacity} transform={`translate(0,${card2.translateY})`}>
          <BentoCard x={560} y={470} w={460} h={480} />
          <text x={790} y={560} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>CALLS</text>
          {/* Code block */}
          <rect x={600} y={600} width={380} height={160} rx={12} fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={2} />
          <text x={790} y={660} textAnchor="middle" fontFamily={MONO} fontSize={28} fontWeight={500} fill={COLORS.white}>Station</text>
          <text x={790} y={710} textAnchor="middle" fontFamily={MONO} fontSize={26} fontWeight={500} fill={COLORS.accent}>.getTotalNetworkStations()</text>

          {/* Station icon */}
          <rect x={680} y={810} width={220} height={80} rx={8} fill={COLORS.accent} fillOpacity={0.1} stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={790} y={862} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>Station Class</text>
        </g>

        {/* Bottom key insight */}
        <g opacity={card3.opacity} transform={`translate(0,${card3.translateY})`}>
          <BentoCard x={60} y={1000} w={960} h={140} accent />
          <rect x={60} y={1000} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={540} y={1090} textAnchor="middle" fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.white}>
            No specific object needed
          </text>
        </g>

        <g transform={`translate(540, ${1280 + breathe})`}>
          <circle cx={0} cy={0} r={28} fill={COLORS.accent} fillOpacity={0.06} />
        </g>

        {caption && <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s06.duration} />}
      </svg>
    </AbsoluteFill>
  );
};
