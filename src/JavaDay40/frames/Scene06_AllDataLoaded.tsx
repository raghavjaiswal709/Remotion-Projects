/**
 * Scene 06 — All Data Loaded
 * "All station codes loaded, all route maps mapped, all fair tables pulled from the database."
 * CSV: 28.180s → 35.340s | Duration: 215 frames
 *
 * Animation phases:
 *   Phase 1 (0–30): Label + headline spring
 *   Phase 2 (20–90): Three data category cards staggered
 *   Phase 3 (80–end): Database icon pulse
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

export const Scene06_AllDataLoaded: React.FC = () => {
  const frame = useCurrentFrame();

  const labelE = useSpringEntrance(frame, 0);
  const headE = useSpringEntrance(frame, 8);

  // Three data categories
  const cat1 = useSpringEntrance(frame, 24);
  const cat2 = useSpringEntrance(frame, 38);
  const cat3 = useSpringEntrance(frame, 52);

  // Database icon
  const dbE = useSpringEntrance(frame, 66);
  const connLen = 180;
  const connDash = usePathDraw(frame, 70, connLen, 25);

  // Bottom summary
  const summaryE = useSpringEntrance(frame, 78);

  // Phase 3
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s06.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="INITIALIZATION DATA" y={140} />
        </g>

        <g transform={`translate(0, ${headE.translateY})`} opacity={headE.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>Data Ready</text>
          <text x={60} y={380} fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.accent}>
            Before First Object
          </text>
        </g>

        {/* Category 1 — Station Codes */}
        <g opacity={cat1.opacity} transform={`translate(0, ${cat1.translateY})`}>
          <BentoCard x={60} y={460} w={960} h={200} accent />
          <rect x={60} y={460} width={6} height={200} rx={3} fill={COLORS.accent} />
          {/* Icon — grid of codes */}
          <rect x={110} y={500} width={100} height={120} rx={8} fill={COLORS.accent} fillOpacity={0.1}
            stroke={COLORS.accent} strokeWidth={1.5} />
          {[0, 1, 2].map(r => [0, 1].map(c => (
            <rect key={`${r}${c}`} x={120 + c * 44} y={514 + r * 34} width={36} height={22} rx={4}
              fill={COLORS.accent} fillOpacity={0.2} />
          )))}
          <text x={250} y={540} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Station Codes
          </text>
          <text x={250} y={586} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            All station identifiers loaded
          </text>
        </g>

        {/* Category 2 — Route Maps */}
        <g opacity={cat2.opacity} transform={`translate(0, ${cat2.translateY})`}>
          <BentoCard x={60} y={690} w={960} h={200} />
          <rect x={60} y={690} width={6} height={200} rx={3} fill={COLORS.accent} />
          {/* Icon — route lines */}
          <rect x={110} y={730} width={100} height={120} rx={8} fill={COLORS.accent} fillOpacity={0.1}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <path d="M 125,760 L 155,810 L 195,780" fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={125} cy={760} r={5} fill={COLORS.accent} />
          <circle cx={155} cy={810} r={5} fill={COLORS.accent} />
          <circle cx={195} cy={780} r={5} fill={COLORS.accent} />
          <text x={250} y={770} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Route Maps
          </text>
          <text x={250} y={816} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            All routes mapped and ready
          </text>
        </g>

        {/* Category 3 — Fare Tables */}
        <g opacity={cat3.opacity} transform={`translate(0, ${cat3.translateY})`}>
          <BentoCard x={60} y={920} w={960} h={200} accent />
          <rect x={60} y={920} width={6} height={200} rx={3} fill={COLORS.accent} />
          {/* Icon — table grid */}
          <rect x={110} y={960} width={100} height={120} rx={8} fill={COLORS.accent} fillOpacity={0.1}
            stroke={COLORS.accent} strokeWidth={1.5} />
          {[0, 1, 2, 3].map(r => (
            <line key={r} x1={120} y1={982 + r * 26} x2={200} y2={982 + r * 26}
              stroke={COLORS.accent} strokeWidth={1} opacity={0.3} />
          ))}
          <text x={250} y={1000} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Fare Tables
          </text>
          <text x={250} y={1046} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Pulled from the database
          </text>
        </g>

        {/* Database icon */}
        <g opacity={dbE.opacity} transform={`translate(540, ${1220 + dbE.translateY})`}>
          {/* DB cylinder */}
          <ellipse cx={0} cy={0} rx={60} ry={20} fill={COLORS.accent} fillOpacity={0.1}
            stroke={COLORS.accent} strokeWidth={2} />
          <rect x={-60} y={0} width={120} height={60} fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2} />
          <ellipse cx={0} cy={60} rx={60} ry={20} fill={COLORS.accent} fillOpacity={0.1}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={0} y={40} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>DB</text>
        </g>

        {/* Connectors from DB to categories */}
        <path d="M 540,1200 L 540,1120 L 300,920 M 540,1120 L 780,920"
          fill="none" stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={connLen} strokeDashoffset={connDash} opacity={0.6} />

        {/* Bottom summary */}
        <g opacity={summaryE.opacity} transform={`translate(0, ${summaryE.translateY})`}>
          <BentoCard x={60} y={1380} w={960} h={120} />
          <text x={100} y={1452} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            All initialization data pre-loaded at startup
          </text>
        </g>

        {/* Floating pulse */}
        <g transform={`translate(540, ${1580 + breathe})`}>
          <circle r={32} fill={COLORS.accent} fillOpacity={0.06} />
          <circle r={32} fill="none" stroke={COLORS.accent} strokeWidth={2}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} opacity={0.4} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s06.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
