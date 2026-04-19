/**
 * Scene 11 — BookShortest
 * "And book the one with the shortest layover."
 * CSV: 34.820s → 37.080s
 * Duration: ~77 frames
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline spring
 *   Phase 2 (frames 18–65):  3 flight cards with layover times, selection highlight
 *   Phase 3 (frames 50+):    Pulse on winner, shimmer, float particles
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 } as const;
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, durationFrames = 30) {
  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene11_BookShortest: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA     = useSpringEntrance(frame, 5);
  const headlineB     = useSpringEntrance(frame, 10);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const flight1 = useSpringEntrance(frame, 18);
  const flight2 = useSpringEntrance(frame, 28);
  const flight3 = useSpringEntrance(frame, 38);
  const selectCard = useSpringEntrance(frame, 50);
  const resultCard = useSpringEntrance(frame, 58);

  // Selection ring draw
  const selectRingLen = Math.PI * 2 * 60;
  const selectRingDash = usePathDraw(frame, 44, selectRingLen, 18);

  // Checkmark draw
  const checkLen = 50;
  const checkDash = usePathDraw(frame, 52, checkLen, 14);

  // Arrow connector
  const arrowLen = 100;
  const arrowDash = usePathDraw(frame, 46, arrowLen, 18);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const flights = [
    { airline: 'Air India', layover: '4h 20m', price: '$412', hrs: 4.33, winner: false },
    { airline: 'British Air', layover: '1h 45m', price: '$428', hrs: 1.75, winner: true },
    { airline: 'Emirates', layover: '3h 10m', price: '$455', hrs: 3.17, winner: false },
  ];

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s11.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="MODULE 6 · SELECTION CRITERION" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={290} fontFamily={FONT} fontSize={76} fontWeight={800} fill={COLORS.white}>
            Book the One
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={64} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            Shortest Layover
          </text>
        </g>

        {/* ── Three flight comparison cards ──────────────────────────────── */}
        {flights.map((fl, idx) => {
          const ent = [flight1, flight2, flight3][idx];
          const cY = 470 + idx * 220;
          const isWin = fl.winner;
          return (
            <g key={idx} opacity={ent.opacity} transform={`translate(0, ${ent.translateY})`}>
              <BentoCard x={60} y={cY} w={960} h={200} accent={isWin} />
              {/* Left accent bar */}
              <rect x={60} y={cY} width={6} height={200} rx={3}
                fill={isWin ? COLORS.accent : 'rgba(255,255,255,0.15)'} />

              {/* Airline name */}
              <text x={100} y={cY + 55} fontFamily={FONT} fontSize={36} fontWeight={800}
                fill={isWin ? COLORS.accent : COLORS.white}>
                {fl.airline}
              </text>

              {/* Price */}
              <text x={100} y={cY + 100} fontFamily={FONT} fontSize={32} fontWeight={800}
                fill={COLORS.text_muted}>
                {fl.price}
              </text>

              {/* Layover visualization — horizontal bar */}
              <text x={440} y={cY + 48} fontFamily={FONT} fontSize={24} fontWeight={800}
                fill={COLORS.text_muted}>
                LAYOVER
              </text>
              <rect x={440} y={cY + 60} width={460} height={12} rx={6}
                fill="rgba(255,255,255,0.06)" />
              <rect x={440} y={cY + 60}
                width={interpolate(ent.progress, [0, 1], [0, (fl.hrs / 5) * 460])}
                height={12} rx={6}
                fill={isWin ? COLORS.accent : COLORS.text_muted}
                opacity={isWin ? 1 : 0.5} />

              {/* Layover time label */}
              <text x={440} y={cY + 105} fontFamily={FONT} fontSize={40} fontWeight={800}
                fill={isWin ? COLORS.accent : COLORS.white}>
                {fl.layover}
              </text>

              {/* Winner label */}
              {isWin && (
                <g>
                  {/* Selection ring */}
                  <circle cx={940} cy={cY + 100} r={34}
                    fill="none" stroke={COLORS.accent} strokeWidth={2.5}
                    strokeDasharray={selectRingLen} strokeDashoffset={selectRingDash}
                    transform={`scale(${pulse})`}
                    style={{ transformOrigin: `940px ${cY + 100}px` }} />
                  {/* Checkmark */}
                  <path d={`M 924,${cY + 100} L 935,${cY + 114} L 958,${cY + 88}`}
                    fill="none" stroke={COLORS.accent} strokeWidth={3}
                    strokeLinecap="round" strokeLinejoin="round"
                    strokeDasharray={checkLen} strokeDashoffset={checkDash} />
                  {/* Badge */}
                  <rect x={780} y={cY + 130} width={180} height={40} rx={20}
                    fill={COLORS.accent} fillOpacity={0.12}
                    stroke={COLORS.accent} strokeWidth={1.5} />
                  <text x={870} y={cY + 158} textAnchor="middle"
                    fontFamily={FONT} fontSize={20} fontWeight={800} fill={COLORS.accent}>
                    SELECTED
                  </text>
                </g>
              )}

              {/* Dimmed overlay for non-winners after selection */}
              {!isWin && frame > 48 && (
                <rect x={60} y={cY} width={960} height={200} rx={20}
                  fill={COLORS.bg_primary} opacity={interpolate(frame, [48, 60], [0, 0.4], { extrapolateRight: 'clamp' })} />
              )}
            </g>
          );
        })}

        {/* ── Arrow pointing to winner ───────────────────────────────────── */}
        <g opacity={interpolate(frame, [44, 52], [0, 0.8], { extrapolateRight: 'clamp' })}>
          <path d="M 30,570 L 55,570" fill="none" stroke={COLORS.accent}
            strokeWidth={3} strokeLinecap="round"
            strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
            markerEnd="url(#arrow)" />
        </g>

        {/* ── Result card ────────────────────────────────────────────────── */}
        <g opacity={resultCard.opacity} transform={`translate(0, ${resultCard.translateY})`}>
          <BentoCard x={60} y={1160} w={960} h={160} />
          <rect x={60} y={1160} width={6} height={160} rx={3} fill={COLORS.accent} />
          {/* Clock icon */}
          <circle cx={110} cy={1240} r={22} fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <line x1={110} y1={1224} x2={110} y2={1240} stroke={COLORS.accent} strokeWidth={2}
            strokeLinecap="round" />
          <line x1={110} y1={1240} x2={122} y2={1246} stroke={COLORS.accent} strokeWidth={2}
            strokeLinecap="round" />
          <text x={155} y={1230} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Shortest layover wins: 1h 45m
          </text>
          <text x={155} y={1275} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted}>
            Clear, measurable selection criterion applied
          </text>
        </g>

        {/* ── Floating particles ─────────────────────────────────────────── */}
        <g opacity={shimmer * 0.3}>
          <circle cx={150} cy={1450 + breathe} r={3} fill={COLORS.accent} />
          <circle cx={900} cy={1520 + breathe * 0.8} r={2.5} fill={COLORS.accent} />
          <circle cx={500} cy={1600 + breathe * 1.1} r={2} fill={COLORS.accent} />
          <circle cx={320} cy={1680 + breathe * 0.6} r={3} fill={COLORS.accent} opacity={0.2} />
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s11.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
