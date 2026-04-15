/**
 * Scene 05 — Control Room Needs
 * "But the control room needs one number."
 * CSV: 27.480s → 30.580s
 * Duration: 93 frames (3.1s)
 *
 * Animation phases:
 *   Phase 1 (0–20):  Control room card reveal
 *   Phase 2 (15–60): Dashboard with single number slot
 *   Phase 3 (50–end): Pulse on "ONE NUMBER"
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, FPS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
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

export const Scene05_ControlRoomNeeds: React.FC = () => {
  const frame = useCurrentFrame();

  // Phase 1
  const label    = useSpringEntrance(frame, 0);
  const headline = useSpringEntrance(frame, 4);

  // Phase 2
  const dashboard = useSpringEntrance(frame, 14);
  const numSlot   = useSpringEntrance(frame, 26);
  const borderPerim = 2 * (400 + 200);
  const borderDash  = usePathDraw(frame, 28, borderPerim, 25);

  // Phase 3
  const pulse = 1 + Math.sin(frame * 0.1) * 0.025;
  const glow  = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.6, 1]);
  const breathe = Math.sin(frame * 0.06) * 3;

  // Control room elements
  const screenRows = [1, 2, 3, 4, 5];
  const screenEntries = screenRows.map((_, i) => useSpringEntrance(frame, 18 + i * 4));

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s05.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g transform={`translate(0, ${label.translateY})`} opacity={label.opacity}>
          <SectionLabel text="MODULE 2 · CONTROL ROOM" y={160} opacity={0.8} />
        </g>

        {/* ZONE B */}
        <g transform={`translate(0, ${headline.translateY})`} opacity={headline.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            The Control Room
          </text>
          <text x={60} y={380} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}>
            needs ONE number
          </text>
        </g>

        {/* ZONE C — Control room building */}
        <g opacity={dashboard.opacity} transform={`translate(0, ${dashboard.translateY})`}>
          {/* Building outline */}
          <BentoCard x={60} y={480} w={960} h={700} accent />
          {/* Roof / header */}
          <rect x={60} y={480} width={960} height={80} rx={20}
            fill={COLORS.accent} fillOpacity={0.08} />
          <text x={540} y={534} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}
            letterSpacing="0.15em">
            RAILWAY CONTROL ROOM
          </text>

          {/* Mini screens — dashboard panels */}
          {screenRows.map((_, i) => {
            const sy = 590 + i * 80;
            const se = screenEntries[i];
            return (
              <g key={i} opacity={se.opacity} transform={`translate(0, ${se.translateY * 0.5})`}>
                <rect x={100} y={sy} width={380} height={56} rx={10}
                  fill={COLORS.bg_primary} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
                <text x={120} y={sy + 38} fontFamily={FONT} fontSize={24} fontWeight={800}
                  fill={COLORS.text_muted}>
                  {['Train Status', 'Route Info', 'Speed Data', 'Passenger Count', 'Schedule'][i]}
                </text>
                {/* Simulated data bar */}
                <rect x={340} y={sy + 16} width={interpolate(se.progress, [0, 1], [0, 120])} height={24} rx={4}
                  fill={COLORS.accent} fillOpacity={0.2} />
              </g>
            );
          })}

          {/* ONE NUMBER — hero display */}
          <g opacity={numSlot.opacity} transform={`translate(0, ${numSlot.translateY})`}>
            <rect x={540} y={590} width={400} height={200} rx={20}
              fill="none" stroke={COLORS.accent} strokeWidth={3}
              strokeDasharray={borderPerim}
              strokeDashoffset={borderDash} />
            <rect x={540} y={590} width={400} height={200} rx={20}
              fill={COLORS.accent} fillOpacity={0.06} />

            <text x={740} y={670} textAnchor="middle"
              fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
              TOTAL ACTIVE
            </text>
            <text x={740} y={750} textAnchor="middle"
              fontFamily={FONT} fontSize={80} fontWeight={800}
              fill={COLORS.accent}
              transform={`scale(${pulse})`}
              style={{ transformOrigin: '740px 750px' }}>
              ?
            </text>
          </g>
        </g>

        {/* Arrow pointing to the ? */}
        <g opacity={numSlot.opacity}>
          <text x={540} y={1260} textAnchor="middle"
            fontFamily={FONT} fontSize={100} fontWeight={800}
            fill={COLORS.accent} opacity={glow}
            transform={`translate(0, ${breathe})`}>
            ONE NUMBER
          </text>
          <text x={540} y={1330} textAnchor="middle"
            fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.text_muted}>
            across the entire network
          </text>
        </g>

        {/* Decorative side accents */}
        {[0, 1, 2, 3].map(i => (
          <circle key={i} cx={60 + i * 340} cy={1440}
            r={4} fill={COLORS.accent} opacity={0.3 + Math.sin(frame * 0.05 + i) * 0.2} />
        ))}

        {/* Summary bottom card */}
        <g opacity={numSlot.opacity}>
          <BentoCard x={60} y={1500} w={960} h={120} />
          <text x={540} y={1574} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            Not per-train. Not per-route. One shared value.
          </text>
        </g>

        {/* CAPTION */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s05.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
