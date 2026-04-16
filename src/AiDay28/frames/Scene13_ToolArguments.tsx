/**
 * Scene 13 — ToolArguments
 * "the name of the tool, the argument names, the argument values."
 * CSV: 41.100s → 44.880s
 * Duration: 137 frames (4.57s)
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20):   Label + headline spring
 *   Phase 2 (frames 15–90):  Three stacked bento rows: tool name, arg names, arg values
 *                             Each row path-draws in with animated bracket + fields
 *   Phase 3 (frames 70–end): Shimmer on values, pulse on highlight, floating particles
 *
 * Visual: Three horizontal tiers — each mapping to one element of the specification
 *         Connected by animated vertical arrows between them
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
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;

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

export const Scene13_ToolArguments: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──────────────────────────────────────────────────────────────
  const labelEnter = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 4);
  const h2 = useSpringEntrance(frame, 9);

  // ── Phase 2 — Three specification rows ───────────────────────────────────

  // Row 1: Tool Name
  const row1Enter = useSpringEntrance(frame, 14);
  const row1Perim = 2 * (960 + 200);
  const row1Border = interpolate(frame, [14, 40], [row1Perim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Row 2: Argument Names
  const row2Enter = useSpringEntrance(frame, 28);
  const row2Perim = 2 * (960 + 200);
  const row2Border = interpolate(frame, [28, 54], [row2Perim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Row 3: Argument Values
  const row3Enter = useSpringEntrance(frame, 42);
  const row3Perim = 2 * (960 + 200);
  const row3Border = interpolate(frame, [42, 68], [row3Perim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Arrow connectors between rows
  const arrow1Len = 80;
  const arrow1Dash = usePathDraw(frame, 26, arrow1Len, 14);
  const arrow2Len = 80;
  const arrow2Dash = usePathDraw(frame, 40, arrow2Len, 14);

  // Sub-fields within each row
  const nameBadge = useSpringEntrance(frame, 18);
  const argFields = [
    { text: 'query', delay: 34 },
    { text: 'format', delay: 38 },
    { text: 'limit', delay: 42 },
  ];
  const argEntrances = argFields.map(f => useSpringEntrance(frame, f.delay));

  const valFields = [
    { text: '"weather SF"', delay: 48 },
    { text: '"json"', delay: 52 },
    { text: '5', delay: 56 },
  ];
  const valEntrances = valFields.map(f => useSpringEntrance(frame, f.delay));

  // Summary card
  const summaryEnter = useSpringEntrance(frame, 60);

  // Wrench icon entrance
  const wrenchEnter = useSpringEntrance(frame, 20);
  const wrenchPathLen = 180;
  const wrenchDash = usePathDraw(frame, 20, wrenchPathLen, 20);

  // ── Phase 3 ──────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const valPulse = 1 + Math.sin(frame * 0.07) * 0.008;
  const highlightCycle = interpolate(
    Math.sin(frame * 0.04), [-1, 1], [0.03, 0.08]
  );

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s13.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="TOOL CALLING · ANATOMY" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={260}
            fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Three Parts
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={370}
            fontFamily={FONT} fontSize={52} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            Name, Args, Values
          </text>
        </g>

        {/* ── ZONE C — Three specification rows ──────────────────────────── */}

        {/* ═══ ROW 1: TOOL NAME ═══ */}
        <g opacity={row1Enter.opacity} transform={`translate(0, ${row1Enter.translateY})`}>
          {/* Card background */}
          <BentoCard x={60} y={450} w={960} h={200} accent />
          {/* Border draw */}
          <rect x={60} y={450} width={960} height={200} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={row1Perim} strokeDashoffset={row1Border} />
          {/* Left accent bar */}
          <rect x={60} y={450} width={6} height={200} rx={3} fill={COLORS.accent} />
          {/* Row number */}
          <text x={100} y={520}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} opacity={0.6} letterSpacing="0.1em">
            01
          </text>
          {/* Row label */}
          <text x={100} y={570}
            fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Tool Name
          </text>
          {/* Name badge */}
          <g opacity={nameBadge.opacity}
             transform={`translate(${nameBadge.translateY * -0.5}, 0)`}>
            <rect x={500} y={500} width={300} height={56} rx={12}
              fill={COLORS.accent} opacity={0.12} />
            <text x={515} y={538}
              fontFamily="'Fira Code', monospace"
              fontSize={32} fontWeight={600} fill={COLORS.accent}>
              "search"
            </text>
          </g>

          {/* Wrench icon */}
          <g opacity={wrenchEnter.opacity} transform="translate(920, 550)">
            <path d="M -16,-16 L -6,-6 M -6,-6 L 6,6 L 16,0 L 6,-12 L -6,-6 M 6,6 L 16,16"
              fill="none" stroke={COLORS.accent} strokeWidth={2.5}
              strokeDasharray={wrenchPathLen} strokeDashoffset={wrenchDash}
              strokeLinecap="round" />
          </g>
        </g>

        {/* Arrow 1 → */}
        <line x1={540} y1={650} x2={540} y2={730}
          stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={arrow1Len} strokeDashoffset={arrow1Dash}
          markerEnd="url(#arrow)" />

        {/* ═══ ROW 2: ARGUMENT NAMES ═══ */}
        <g opacity={row2Enter.opacity} transform={`translate(0, ${row2Enter.translateY})`}>
          <BentoCard x={60} y={740} w={960} h={260} />
          <rect x={60} y={740} width={960} height={260} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            strokeDasharray={row2Perim} strokeDashoffset={row2Border}
            opacity={0.6} />
          <rect x={60} y={740} width={6} height={260} rx={3} fill={COLORS.accent} opacity={0.5} />
          {/* Row number */}
          <text x={100} y={800}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} opacity={0.6} letterSpacing="0.1em">
            02
          </text>
          {/* Row label */}
          <text x={100} y={850}
            fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Argument Names
          </text>
          {/* Arg name pills */}
          {argFields.map((arg, i) => {
            const ent = argEntrances[i];
            return (
              <g key={i} opacity={ent.opacity}
                 transform={`translate(${ent.translateY * -1}, 0)`}>
                <rect x={100 + i * 280} y={880} width={240} height={48} rx={10}
                  fill={COLORS.accent} opacity={0.08} />
                <text x={120 + i * 280} y={914}
                  fontFamily="'Fira Code', monospace"
                  fontSize={28} fontWeight={600} fill={COLORS.accent}>
                  {arg.text}
                </text>
              </g>
            );
          })}
        </g>

        {/* Arrow 2 → */}
        <line x1={540} y1={1000} x2={540} y2={1080}
          stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={arrow2Len} strokeDashoffset={arrow2Dash}
          markerEnd="url(#arrow)" />

        {/* ═══ ROW 3: ARGUMENT VALUES ═══ */}
        <g opacity={row3Enter.opacity} transform={`translate(0, ${row3Enter.translateY})`}>
          <BentoCard x={60} y={1090} w={960} h={260} accent />
          <rect x={60} y={1090} width={960} height={260} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={row3Perim} strokeDashoffset={row3Border} />
          <rect x={60} y={1090} width={6} height={260} rx={3} fill={COLORS.accent} />
          {/* Row number */}
          <text x={100} y={1150}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} opacity={0.6} letterSpacing="0.1em">
            03
          </text>
          {/* Row label */}
          <text x={100} y={1200}
            fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Argument Values
          </text>
          {/* Value pills — scale pulse */}
          <g transform={`scale(${valPulse})`}
             style={{ transformOrigin: '540px 1280px' }}>
            {valFields.map((val, i) => {
              const ent = valEntrances[i];
              return (
                <g key={i} opacity={ent.opacity}
                   transform={`translate(${ent.translateY * -1}, 0)`}>
                  <rect x={100 + i * 280} y={1230} width={240} height={48} rx={10}
                    fill={COLORS.accent} opacity={highlightCycle} />
                  <text x={120 + i * 280} y={1264}
                    fontFamily="'Fira Code', monospace"
                    fontSize={28} fontWeight={600} fill={COLORS.white}>
                    {val.text}
                  </text>
                </g>
              );
            })}
          </g>
        </g>

        {/* ── Summary card ───────────────────────────────────────────────── */}
        <g opacity={summaryEnter.opacity} transform={`translate(0, ${summaryEnter.translateY})`}>
          <BentoCard x={60} y={1440} w={960} h={140} />
          <text x={540} y={1525} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            Three fields define every tool call
          </text>
        </g>

        {/* ── Floating particles ─────────────────────────────────────────── */}
        {[
          { x: 80, y: 1640 }, { x: 1000, y: 1660 },
          { x: 200, y: 1700 }, { x: 900, y: 1720 },
          { x: 540, y: 1680 }, { x: 400, y: 1740 },
        ].map((pt, i) => (
          <circle key={i}
            cx={pt.x} cy={pt.y + Math.sin(frame * 0.04 + i) * 4}
            r={2.5} fill={COLORS.accent} opacity={0.1 * shimmer} />
        ))}

        {/* ── CAPTION ──────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s13.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
