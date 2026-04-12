/**
 * Scene08 — Water Extends Impact
 * "Water extends the impact across a longer window, the forces stay within survivable limits."
 * CSV: 46.400s → 52.260s
 *
 * Animation phases:
 *   Phase 1 (0–30): Label + headline spring entrance
 *   Phase 2 (20–90): Full force-time graph with filled areas, animated curves, survivable limit,
 *                     impact point markers, time annotations with bracket markers
 *   Phase 3 (80–end): Curve shimmer, impact markers pulse, breathing on cards
 */
import React from 'react';
import {
  AbsoluteFill, useCurrentFrame, interpolate, spring, Easing,
} from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { PaperBackground, GlobalDefs, Caption, SectionLabel, CornerAccents } from '../helpers/components';

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;
const SPRING_SOFT = { damping: 22, stiffness: 120, mass: 1.0 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, durationFrames = 30) {
  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene08_WaterImpact: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal (0–30) ──────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 14);

  // ── Phase 2: Graph + content build (20–90) ────────────────────────
  const axisEnt = useSpringEntrance(frame, 20);
  const gridEnt = useSpringEntrance(frame, 24);
  const limitDraw = usePathDraw(frame, 30, 840, 25);
  const groundDraw = usePathDraw(frame, 36, 500, 35);
  const waterDraw = usePathDraw(frame, 44, 700, 35);
  const fillReveal = interpolate(frame, [50, 75], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const groundMarker = useSpringEntrance(frame, 52);
  const waterMarker = useSpringEntrance(frame, 60);
  const timeBracket1 = useSpringEntrance(frame, 56);
  const timeBracket2 = useSpringEntrance(frame, 64);
  const resultCard1 = useSpringEntrance(frame, 70);
  const resultCard2 = useSpringEntrance(frame, 80);
  const noteEnt = useSpringEntrance(frame, 88);

  // ── Phase 3: Micro-animations (80–end) ────────────────────────────
  const breathe = Math.sin(frame * 0.05) * 3;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.82, 1]);
  const markerPulse = 1 + Math.sin(frame * 0.1) * 0.08;
  const peakGlow = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.3, 0.6]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s08.from);

  // ── Graph geometry ────────────────────────────────────────────────
  const GX = 140;       // graph origin X
  const GY = 530;       // graph origin Y (top)
  const GW = 800;       // graph width
  const GH = 540;       // graph height
  const GBX = GX + GW;  // graph bottom-right X
  const GBY = GY + GH;  // graph bottom Y (baseline)

  // Y axis tick values (G-forces)
  const yTicks = [
    { label: '150G', pct: 0.0 },
    { label: '100G', pct: 0.33 },
    { label: '50G', pct: 0.67 },
    { label: '0', pct: 1.0 },
  ];

  // X axis tick values
  const xTicks = [
    { label: '0', pct: 0.0 },
    { label: '200', pct: 0.25 },
    { label: '400', pct: 0.5 },
    { label: '600', pct: 0.75 },
    { label: '800ms', pct: 1.0 },
  ];

  // Survivable limit at ~35G → ~77% from top
  const limitY = GY + GH * 0.77;

  // Ground spike: narrow triangle peaking at ~140G (top of graph)
  const gPeakX = GX + GW * 0.12;
  const gStartX = GX + GW * 0.05;
  const gEndX = GX + GW * 0.19;
  const gPeakY = GY + 20;
  const groundPath = `M ${gStartX},${GBY} L ${gPeakX},${gPeakY} L ${gEndX},${GBY}`;
  const groundFill = `M ${gStartX},${GBY} L ${gPeakX},${gPeakY} L ${gEndX},${GBY} Z`;

  // Water curve: wide gentle bell peaking at ~25G → ~83% from top
  const wStartX = GX + GW * 0.05;
  const wPeakX = GX + GW * 0.45;
  const wPeakY = GY + GH * 0.83;
  const wEndX = GX + GW * 0.85;
  const waterPath = `M ${wStartX},${GBY} C ${GX + GW * 0.15},${GBY - 60} ${GX + GW * 0.3},${wPeakY} ${wPeakX},${wPeakY} C ${GX + GW * 0.6},${wPeakY} ${GX + GW * 0.75},${GBY - 30} ${wEndX},${GBY}`;
  const waterFillPath = waterPath + ` L ${wStartX},${GBY} Z`;

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A ─────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="IMPACT PHYSICS · WATER vs GROUND" y={260} opacity={0.55} />
        </g>

        {/* ── ZONE B ─────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={380} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={68} fontWeight={900} fill={COLORS.deep_black}>
            Longer Window
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={455} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={38} fontWeight={500} fill={COLORS.green}>
            Forces Stay Survivable
          </text>
        </g>

        {/* ── GRAPH FRAME ────────────────────────────────────────── */}
        {/* Outer graph border — path-draw */}
        <rect x={GX - 2} y={GY - 2} width={GW + 4} height={GH + 4} rx={8}
          fill="none" stroke={COLORS.deep_black} strokeWidth={1.5} opacity={axisEnt.opacity * 0.1} />

        {/* Y axis */}
        <g opacity={axisEnt.opacity}>
          <line x1={GX} y1={GY} x2={GX} y2={GBY}
            stroke={COLORS.deep_black} strokeWidth={2.5} opacity={0.2} />
          {/* Y axis label */}
          <text x={GX - 50} y={GY + GH / 2} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={600} fill={COLORS.cool_silver}
            transform={`rotate(-90, ${GX - 50}, ${GY + GH / 2})`}>
            FORCE (G)
          </text>
          {/* Y ticks */}
          {yTicks.map((t, i) => {
            const ty = GY + GH * t.pct;
            return (
              <g key={`yt-${i}`}>
                <line x1={GX - 8} y1={ty} x2={GX} y2={ty}
                  stroke={COLORS.deep_black} strokeWidth={2} opacity={0.25} />
                <text x={GX - 14} y={ty + 5} textAnchor="end"
                  fontFamily="'Inter', system-ui, sans-serif"
                  fontSize={18} fontWeight={500} fill={COLORS.cool_silver}>
                  {t.label}
                </text>
              </g>
            );
          })}
        </g>

        {/* X axis */}
        <g opacity={axisEnt.opacity}>
          <line x1={GX} y1={GBY} x2={GBX} y2={GBY}
            stroke={COLORS.deep_black} strokeWidth={2.5} opacity={0.2} />
          {/* X axis label */}
          <text x={GX + GW / 2} y={GBY + 50} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={600} fill={COLORS.cool_silver}>
            TIME (ms)
          </text>
          {/* X ticks */}
          {xTicks.map((t, i) => {
            const tx = GX + GW * t.pct;
            return (
              <g key={`xt-${i}`}>
                <line x1={tx} y1={GBY} x2={tx} y2={GBY + 8}
                  stroke={COLORS.deep_black} strokeWidth={2} opacity={0.25} />
                <text x={tx} y={GBY + 28} textAnchor="middle"
                  fontFamily="'Inter', system-ui, sans-serif"
                  fontSize={16} fontWeight={400} fill={COLORS.cool_silver}>
                  {t.label}
                </text>
              </g>
            );
          })}
        </g>

        {/* Horizontal grid lines */}
        <g opacity={gridEnt.opacity * 0.06}>
          {[0.2, 0.4, 0.6, 0.8].map((p, i) => (
            <line key={`grid-${i}`}
              x1={GX} y1={GY + GH * p} x2={GBX} y2={GY + GH * p}
              stroke={COLORS.deep_black} strokeWidth={1}
              strokeDasharray="8 6" />
          ))}
        </g>
        {/* Vertical grid lines */}
        <g opacity={gridEnt.opacity * 0.04}>
          {[0.25, 0.5, 0.75].map((p, i) => (
            <line key={`vgrid-${i}`}
              x1={GX + GW * p} y1={GY} x2={GX + GW * p} y2={GBY}
              stroke={COLORS.deep_black} strokeWidth={1}
              strokeDasharray="8 6" />
          ))}
        </g>

        {/* ── SURVIVABLE LIMIT LINE ──────────────────────────────── */}
        <line x1={GX} y1={limitY} x2={GBX} y2={limitY}
          stroke={COLORS.green} strokeWidth={2.5}
          strokeDasharray="12 6"
          strokeDashoffset={limitDraw}
          opacity={0.6} strokeLinecap="round" />
        {/* Limit badge */}
        <g opacity={gridEnt.opacity}>
          <rect x={GBX - 160} y={limitY - 18} width={150} height={28} rx={6}
            fill={COLORS.green} fillOpacity={0.12}
            stroke={COLORS.green} strokeWidth={1.5} />
          <text x={GBX - 85} y={limitY + 1} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={16} fontWeight={700} fill={COLORS.green}>
            SURVIVABLE
          </text>
        </g>

        {/* ── GROUND IMPACT — Sharp spike (filled area) ──────────── */}
        {/* Fill under ground curve */}
        <path d={groundFill}
          fill={COLORS.vibrant_red} fillOpacity={fillReveal * 0.12}
          stroke="none" />
        {/* Ground curve stroke with path-draw */}
        <path d={groundPath}
          fill="none" stroke={COLORS.vibrant_red} strokeWidth={3.5}
          strokeDasharray={500} strokeDashoffset={groundDraw}
          strokeLinecap="round" strokeLinejoin="round" />
        {/* Peak marker — pulsing diamond */}
        <g opacity={groundMarker.opacity}
          transform={`translate(${gPeakX}, ${gPeakY}) scale(${markerPulse})`}
          style={{ transformOrigin: '0px 0px' }}>
          <polygon points="0,-10 8,0 0,10 -8,0"
            fill={COLORS.vibrant_red} fillOpacity={peakGlow}
            stroke={COLORS.vibrant_red} strokeWidth={2} />
        </g>
        {/* Peak G label */}
        <g opacity={groundMarker.opacity}>
          <text x={gPeakX + 18} y={gPeakY + 5}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={20} fontWeight={800} fill={COLORS.vibrant_red}>
            ~140G
          </text>
          {/* FATAL badge */}
          <rect x={gPeakX + 18} y={gPeakY + 12} width={60} height={22} rx={4}
            fill={COLORS.vibrant_red} fillOpacity={0.15} />
          <text x={gPeakX + 48} y={gPeakY + 28} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={14} fontWeight={700} fill={COLORS.vibrant_red}>
            FATAL
          </text>
        </g>

        {/* ── WATER IMPACT — Wide gentle bell (filled area) ──────── */}
        {/* Fill under water curve */}
        <path d={waterFillPath}
          fill={COLORS.sky_blue} fillOpacity={fillReveal * 0.1}
          stroke="none" />
        {/* Water curve stroke with path-draw */}
        <path d={waterPath}
          fill="none" stroke={COLORS.sky_blue} strokeWidth={3.5}
          strokeDasharray={700} strokeDashoffset={waterDraw}
          strokeLinecap="round" />
        {/* Water peak marker — circle */}
        <g opacity={waterMarker.opacity}
          transform={`translate(${wPeakX}, ${wPeakY}) scale(${markerPulse})`}
          style={{ transformOrigin: '0px 0px' }}>
          <circle cx={0} cy={0} r={8}
            fill={COLORS.sky_blue} fillOpacity={0.3}
            stroke={COLORS.sky_blue} strokeWidth={2} />
        </g>
        {/* Water peak label */}
        <g opacity={waterMarker.opacity}>
          <text x={wPeakX + 16} y={wPeakY - 8}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={20} fontWeight={800} fill={COLORS.sky_blue}>
            ~25G
          </text>
          <rect x={wPeakX + 16} y={wPeakY - 2} width={50} height={22} rx={4}
            fill={COLORS.sky_blue} fillOpacity={0.12} />
          <text x={wPeakX + 41} y={wPeakY + 14} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={14} fontWeight={700} fill={COLORS.sky_blue}>
            SAFE
          </text>
        </g>

        {/* ── TIME WINDOW BRACKETS ───────────────────────────────── */}
        {/* Ground — short bracket */}
        <g opacity={timeBracket1.opacity * shimmer}
          transform={`translate(0, ${timeBracket1.translateY})`}>
          {/* Left bracket arm */}
          <line x1={gStartX} y1={GBY + 20} x2={gStartX} y2={GBY + 35}
            stroke={COLORS.vibrant_red} strokeWidth={2} />
          {/* Right bracket arm */}
          <line x1={gEndX} y1={GBY + 20} x2={gEndX} y2={GBY + 35}
            stroke={COLORS.vibrant_red} strokeWidth={2} />
          {/* Bottom bar */}
          <line x1={gStartX} y1={GBY + 35} x2={gEndX} y2={GBY + 35}
            stroke={COLORS.vibrant_red} strokeWidth={2.5} />
          {/* Duration label */}
          <text x={(gStartX + gEndX) / 2} y={GBY + 58} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={800} fill={COLORS.vibrant_red}>
            ~50ms
          </text>
        </g>

        {/* Water — wide bracket */}
        <g opacity={timeBracket2.opacity * shimmer}
          transform={`translate(0, ${timeBracket2.translateY})`}>
          <line x1={wStartX} y1={GBY + 68} x2={wStartX} y2={GBY + 83}
            stroke={COLORS.sky_blue} strokeWidth={2} />
          <line x1={wEndX} y1={GBY + 68} x2={wEndX} y2={GBY + 83}
            stroke={COLORS.sky_blue} strokeWidth={2} />
          <line x1={wStartX} y1={GBY + 83} x2={wEndX} y2={GBY + 83}
            stroke={COLORS.sky_blue} strokeWidth={2.5} />
          <text x={(wStartX + wEndX) / 2} y={GBY + 108} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={800} fill={COLORS.sky_blue}>
            ~800ms — 16x longer impact window
          </text>
        </g>

        {/* ── CURVE LEGEND (mini) ────────────────────────────────── */}
        <g opacity={gridEnt.opacity * shimmer}>
          {/* Ground legend */}
          <line x1={GBX - 240} y1={GY + 16} x2={GBX - 200} y2={GY + 16}
            stroke={COLORS.vibrant_red} strokeWidth={3} />
          <text x={GBX - 192} y={GY + 22}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={18} fontWeight={700} fill={COLORS.vibrant_red}>
            GROUND
          </text>
          {/* Water legend */}
          <line x1={GBX - 240} y1={GY + 42} x2={GBX - 200} y2={GY + 42}
            stroke={COLORS.sky_blue} strokeWidth={3} />
          <text x={GBX - 192} y={GY + 48}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={18} fontWeight={700} fill={COLORS.sky_blue}>
            WATER
          </text>
        </g>

        {/* ── RESULT CARDS WITH ICONS ────────────────────────────── */}
        {/* Card 1: Ground — skull/danger icon */}
        <g opacity={resultCard1.opacity}
          transform={`translate(60, ${1350 + resultCard1.translateY + breathe})`}>
          <rect x={0} y={0} width={450} height={120} rx={14}
            fill={COLORS.vibrant_red} fillOpacity={0.06}
            stroke={COLORS.vibrant_red} strokeWidth={2} />
          {/* Danger icon — triangle with ! */}
          <g transform="translate(50, 60)">
            <polygon points="0,-28 26,20 -26,20"
              fill="none" stroke={COLORS.vibrant_red} strokeWidth={2.5} strokeLinejoin="round" />
            <line x1={0} y1={-14} x2={0} y2={6}
              stroke={COLORS.vibrant_red} strokeWidth={3} strokeLinecap="round" />
            <circle cx={0} cy={14} r={2.5} fill={COLORS.vibrant_red} />
          </g>
          <text x={100} y={42} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={20} fontWeight={500} fill={COLORS.cool_silver}>
            GROUND IMPACT
          </text>
          <text x={100} y={78} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32} fontWeight={800} fill={COLORS.vibrant_red}>
            Exceeds Limit
          </text>
          <text x={100} y={104} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={18} fontWeight={400} fill={COLORS.cool_silver}>
            Peak ~140G in 50ms window
          </text>
        </g>

        {/* Card 2: Water — checkmark/shield icon */}
        <g opacity={resultCard2.opacity}
          transform={`translate(530, ${1350 + resultCard2.translateY + breathe})`}>
          <rect x={0} y={0} width={450} height={120} rx={14}
            fill={COLORS.green} fillOpacity={0.06}
            stroke={COLORS.green} strokeWidth={2} />
          {/* Shield + checkmark icon */}
          <g transform="translate(50, 60)">
            <path d="M 0,-26 L 22,-14 L 22,8 C 22,20 0,30 0,30 C 0,30 -22,20 -22,8 L -22,-14 Z"
              fill="none" stroke={COLORS.green} strokeWidth={2.5} strokeLinejoin="round" />
            <path d="M -8,2 L -2,10 L 10,-6"
              fill="none" stroke={COLORS.green} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <text x={100} y={42} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={20} fontWeight={500} fill={COLORS.cool_silver}>
            WATER IMPACT
          </text>
          <text x={100} y={78} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32} fontWeight={800} fill={COLORS.green}>
            Within Limits
          </text>
          <text x={100} y={104} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={18} fontWeight={400} fill={COLORS.cool_silver}>
            Peak ~25G spread over 800ms
          </text>
        </g>

        {/* ── Bottom note ────────────────────────────────────────── */}
        <g opacity={noteEnt.opacity}
          transform={`translate(0, ${noteEnt.translateY})`}>
          <line x1={100} y1={1510} x2={980} y2={1510}
            stroke={COLORS.deep_black} strokeWidth={1} opacity={0.08} />
          <text x={540} y={1545} textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={400} fill={COLORS.cool_silver}>
            Water absorbs and distributes impact energy over time
          </text>
        </g>

        {/* ── Corner accents ─────────────────────────────────────── */}
        <CornerAccents opacity={0.35} color={COLORS.green} />

        {/* ── CAPTION ────────────────────────────────────────────── */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s08.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
