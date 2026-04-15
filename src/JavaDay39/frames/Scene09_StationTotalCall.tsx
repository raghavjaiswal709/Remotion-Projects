/**
 * Scene 09 — Station Total Call
 * "Station.total network stations. No object. No constructor. Nothing."
 * CSV: 46.460s → 52.700s | Duration: 187 frames
 * Animation: Phase 1 headline → Phase 2 code call + strikethrough → Phase 3 micro
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

export const Scene09_StationTotalCall: React.FC = () => {
  const frame = useCurrentFrame();

  const label = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const card1 = useSpringEntrance(frame, 18);
  const card2 = useSpringEntrance(frame, 32);
  const card3 = useSpringEntrance(frame, 44);

  // Strikethrough lines for "No object", "No constructor", "Nothing"
  const strike1 = usePathDraw(frame, 50, 320, 20);
  const strike2 = usePathDraw(frame, 55, 380, 20);
  const strike3 = usePathDraw(frame, 60, 260, 20);

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.012;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s09.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <DarkBackground />
        <GlobalDefs />

        <g opacity={label.opacity} transform={`translate(0,${label.translateY})`}>
          <SectionLabel text="DIRECT CALL · NO OVERHEAD" y={160} />
        </g>

        <g opacity={headA.opacity} transform={`translate(0,${headA.translateY})`}>
          <text x={540} y={320} textAnchor="middle" fontFamily={MONO} fontSize={52} fontWeight={500} fill={COLORS.white}>
            Station.<tspan fill={COLORS.accent}>getTotalNetworkStations()</tspan>
          </text>
        </g>

        {/* Hero call illustration */}
        <g opacity={card1.opacity} transform={`translate(0,${card1.translateY})`}>
          <BentoCard x={60} y={420} w={960} h={300} accent />
          {/* Station class box */}
          <rect x={120} y={460} width={340} height={200} rx={12} fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={2.5} />
          <rect x={120} y={460} width={340} height={50} rx={12} fill={COLORS.accent} fillOpacity={0.15} />
          <text x={290} y={495} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>Station</text>
          <text x={140} y={570} fontFamily={MONO} fontSize={24} fontWeight={500} fill={COLORS.text_muted}>static getTotalNetwork</text>
          <text x={140} y={610} fontFamily={MONO} fontSize={24} fontWeight={500} fill={COLORS.text_muted}>{'  Stations()'}</text>

          {/* Direct arrow */}
          <line x1={460} y1={560} x2={620} y2={560} stroke={COLORS.accent} strokeWidth={3} markerEnd="url(#arrow)" />
          <text x={540} y={540} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent}>DIRECT</text>

          {/* Result */}
          <rect x={620} y={500} width={340} height={120} rx={16} fill={COLORS.accent} fillOpacity={0.12} stroke={COLORS.accent} strokeWidth={2} />
          <text x={790} y={558} textAnchor="middle" fontFamily={FONT} fontSize={64} fontWeight={800} fill={COLORS.accent}>42</text>
          <text x={790} y={600} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>stations</text>
        </g>

        {/* Strikethrough items */}
        <g opacity={card2.opacity} transform={`translate(0,${card2.translateY})`}>
          {/* No object */}
          <BentoCard x={60} y={760} w={960} h={120} />
          <text x={100} y={836} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.text_muted}>No Object Required</text>
          <line x1={90} y1={824} x2={500} y2={824} stroke={COLORS.vibrant_red} strokeWidth={3} strokeDasharray={320} strokeDashoffset={strike1} />

          {/* No constructor */}
          <BentoCard x={60} y={900} w={960} h={120} />
          <text x={100} y={976} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.text_muted}>No Constructor Called</text>
          <line x1={90} y1={964} x2={540} y2={964} stroke={COLORS.vibrant_red} strokeWidth={3} strokeDasharray={380} strokeDashoffset={strike2} />

          {/* Nothing */}
          <BentoCard x={60} y={1040} w={960} h={120} />
          <text x={100} y={1116} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.text_muted}>Nothing Extra</text>
          <line x1={90} y1={1104} x2={400} y2={1104} stroke={COLORS.vibrant_red} strokeWidth={3} strokeDasharray={260} strokeDashoffset={strike3} />
        </g>

        {/* Bottom highlight */}
        <g opacity={card3.opacity} transform={`translate(0,${card3.translateY})`}>
          <BentoCard x={60} y={1200} w={960} h={140} accent />
          <text x={540} y={1288} textAnchor="middle" fontFamily={FONT} fontSize={46} fontWeight={800} fill={COLORS.white}>
            Just the class. <tspan fill={COLORS.accent}>That's it.</tspan>
          </text>
        </g>

        <g transform={`translate(540, ${1460 + breathe})`}>
          <circle cx={0} cy={0} r={26} fill={COLORS.accent} fillOpacity={0.06} />
          <circle cx={0} cy={0} r={26} fill="none" stroke={COLORS.accent} strokeWidth={1.5} transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {caption && <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s09.duration} />}
      </svg>
    </AbsoluteFill>
  );
};
