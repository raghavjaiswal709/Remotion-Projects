/**
 * Scene 18 — MethodAdapts
 * "The method adapts to whatever data is available."
 * CSV: 55.360s → 57.620s
 * Duration: 85 frames (2.83s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20): Label + hero headline
 *   Phase 2 (frames 14–60): Three data levels expanding, method morphing
 *   Phase 3 (frames 50–end): Pulse, breathe, shimmer
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
import { DarkBackground, GlobalDefs, Caption, BentoCard } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
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

export const Scene18_MethodAdapts: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const label  = useSpringEntrance(frame, 0);
  const heroA  = useSpringEntrance(frame, 4);
  const heroB  = useSpringEntrance(frame, 8);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const lvl1    = useSpringEntrance(frame, 14);
  const lvl2    = useSpringEntrance(frame, 22);
  const lvl3    = useSpringEntrance(frame, 30);
  const arrowE1 = useSpringEntrance(frame, 20);
  const arrowE2 = useSpringEntrance(frame, 28);
  const resultC = useSpringEntrance(frame, 38);
  const bottomR = useSpringEntrance(frame, 44);
  const summRow = useSpringEntrance(frame, 50);

  // ── Path draws ─────────────────────────────────────────────────────────────
  const arrow1Len = 100;
  const arrow1D   = usePathDraw(frame, 20, arrow1Len, 15);
  const arrow2Len = 100;
  const arrow2D   = usePathDraw(frame, 28, arrow2Len, 15);

  // ── Widening bars ──────────────────────────────────────────────────────────
  const bar1W = interpolate(
    spring({ frame: Math.max(0, frame - 14), fps, config: SPRING_CONFIG }),
    [0, 1], [0, 280]
  );
  const bar2W = interpolate(
    spring({ frame: Math.max(0, frame - 22), fps, config: SPRING_CONFIG }),
    [0, 1], [0, 480]
  );
  const bar3W = interpolate(
    spring({ frame: Math.max(0, frame - 30), fps, config: SPRING_CONFIG }),
    [0, 1], [0, 700]
  );

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s18.from);

  // Data levels
  const levels = [
    { label: 'Route only',               params: '(String route)',                          color: COLORS.accent },
    { label: 'Route + Seat Class',        params: '(String route, String seatClass)',        color: COLORS.accent },
    { label: 'Route + Class + Peak Hour', params: '(String route, String seatClass, boolean isPeak)', color: COLORS.accent },
  ];
  const barWidths = [bar1W, bar2W, bar3W];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${label.translateY})`} opacity={label.opacity}>
          <text x={60} y={160}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.15em" opacity={0.8}>
            ADAPTIVE DISPATCH · FLEXIBILITY
          </text>
        </g>

        {/* ── ZONE B ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${heroA.translateY})`} opacity={heroA.opacity}>
          <text x={540} y={310} textAnchor="middle"
            fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.white}>
            The Method
          </text>
        </g>
        <g transform={`translate(0, ${heroB.translateY})`} opacity={heroB.opacity}>
          <text x={540} y={420} textAnchor="middle"
            fontFamily={FONT} fontSize={88} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Adapts
          </text>
        </g>

        {/* ── Three expanding data levels ────────────────────────────────── */}
        {levels.map((lvl, i) => {
          const ent = [lvl1, lvl2, lvl3][i];
          const bw  = barWidths[i];
          const rowY = 540 + i * 200;

          return (
            <g key={i} opacity={ent.opacity} transform={`translate(0, ${ent.translateY})`}>
              {/* Container card */}
              <BentoCard x={60} y={rowY} w={960} h={160}
                accent={i === 2} />
              {/* Label */}
              <text x={100} y={rowY + 44}
                fontFamily={FONT} fontSize={28} fontWeight={800}
                fill={COLORS.text_muted} letterSpacing="0.1em">
                LEVEL {i + 1}
              </text>
              {/* Level label */}
              <text x={100} y={rowY + 86}
                fontFamily={FONT} fontSize={32} fontWeight={800}
                fill={COLORS.white}>
                {lvl.label}
              </text>
              {/* Expanding data bar */}
              <rect x={100} y={rowY + 110} width={bw} height={20} rx={10}
                fill={lvl.color} fillOpacity={0.2 + i * 0.08} />
              <rect x={100} y={rowY + 110} width={bw} height={20} rx={10}
                fill="none" stroke={lvl.color} strokeWidth={1.5}
                opacity={0.5} />
              {/* Param count badge */}
              <g transform={`translate(940, ${rowY + 80})`}>
                <circle cx={0} cy={0} r={24}
                  fill={COLORS.accent} fillOpacity={0.12}
                  stroke={COLORS.accent} strokeWidth={1.5} />
                <text x={0} y={8} textAnchor="middle"
                  fontFamily={FONT} fontSize={24} fontWeight={800}
                  fill={COLORS.accent}>
                  {i + 1}
                </text>
              </g>
            </g>
          );
        })}

        {/* ── Connecting arrows between levels ───────────────────────────── */}
        <line x1={540} y1={700} x2={540} y2={740}
          stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={arrow1Len} strokeDashoffset={arrow1D}
          markerEnd="url(#arrow)"
          opacity={arrowE1.opacity * 0.5} />
        <line x1={540} y1={900} x2={540} y2={940}
          stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={arrow2Len} strokeDashoffset={arrow2D}
          markerEnd="url(#arrow)"
          opacity={arrowE2.opacity * 0.5} />

        {/* ── "Data drives dispatch" card ─────────────────────────────────── */}
        <g opacity={resultC.opacity} transform={`translate(0, ${resultC.translateY})`}>
          <BentoCard x={60} y={1180} w={960} h={120} accent />
          <rect x={60} y={1180} width={6} height={120} rx={3} fill={COLORS.accent} />
          <text x={540} y={1255} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>
            More data available → <tspan fill={COLORS.accent} fontStyle="italic">more precise</tspan> fare
          </text>
        </g>

        {/* ── Bottom info row ────────────────────────────────────────────── */}
        <g opacity={bottomR.opacity} transform={`translate(0, ${bottomR.translateY})`}>
          <BentoCard x={60} y={1340} w={460} h={140} />
          <text x={100} y={1400}
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.white}>
            Same method name
          </text>
          <text x={100} y={1444}
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>
            Always calculateFare()
          </text>
        </g>
        <g opacity={bottomR.opacity} transform={`translate(0, ${bottomR.translateY})`}>
          <BentoCard x={560} y={1340} w={460} h={140} accent />
          <text x={600} y={1400}
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>
            Different data
          </text>
          <text x={600} y={1444}
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>
            1, 2, or 3 parameters
          </text>
        </g>

        {/* ── Summary ────────────────────────────────────────────────────── */}
        <g opacity={summRow.opacity} transform={`translate(0, ${summRow.translateY})`}>
          <BentoCard x={120} y={1530} w={840} h={100} />
          <text x={540} y={1592} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>
            Whatever data is available — the method <tspan fill={COLORS.accent}>adapts</tspan>
          </text>
        </g>

        {/* ── Floating decorations ───────────────────────────────────────── */}
        <g transform={`translate(160, ${1700 + breathe})`} opacity={0.1}>
          <circle cx={0} cy={0} r={14}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} />
        </g>
        <g transform={`translate(920, ${1690 + breathe * 0.6})`} opacity={shimmer * 0.1}>
          <circle cx={0} cy={0} r={8} fill={COLORS.accent} />
        </g>

        {/* ── Corner accents ─────────────────────────────────────────────── */}
        <g opacity={label.opacity * 0.3}>
          <path d="M 60,60 L 60,130 M 60,60 L 130,60" fill="none"
            stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
          <path d="M 1020,1740 L 1020,1670 M 1020,1740 L 950,1740" fill="none"
            stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s18.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
