/**
 * Scene 12 — FormattedSpec
 * "not a prose answer, a formatted specification,"
 * CSV: 37.240s → 40.340s
 * Duration: 116 frames (3.87s)
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline spring entrance
 *   Phase 2 (frames 15–80):  Two-column comparison: prose vs spec, path-draw divider
 *   Phase 3 (frames 60–end): Pulse on spec side, shimmer, floating particles
 *
 * Visual: Left column shows crossed-out "prose" paragraph,
 *         Right column shows highlighted structured specification.
 *         Big "NOT ≠" contrast visual.
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

export const Scene12_FormattedSpec: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──────────────────────────────────────────────────────────────
  const labelEnter = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 4);
  const h2 = useSpringEntrance(frame, 9);

  // ── Phase 2 ──────────────────────────────────────────────────────────────
  // Two-column cards
  const leftCard = useSpringEntrance(frame, 14);
  const rightCard = useSpringEntrance(frame, 20);

  // Divider line between columns
  const dividerLen = 800;
  const dividerDash = usePathDraw(frame, 18, dividerLen, 20);

  // Strike-through on prose text
  const strikeLen = 500;
  const strikeDash = usePathDraw(frame, 30, strikeLen, 16);

  // X mark on prose side
  const xLen = 120;
  const xDash1 = usePathDraw(frame, 36, xLen, 12);
  const xDash2 = usePathDraw(frame, 38, xLen, 12);

  // Checkmark on spec side
  const checkLen = 140;
  const checkDash = usePathDraw(frame, 36, checkLen, 14);

  // Spec field rows
  const specFields = [
    { text: 'tool: "search"', delay: 26 },
    { text: 'query: "weather SF"', delay: 32 },
    { text: 'format: "json"', delay: 38 },
    { text: 'limit: 5', delay: 44 },
  ];
  const specEntrances = specFields.map(f => useSpringEntrance(frame, f.delay));

  // Bottom summary cards
  const summary1 = useSpringEntrance(frame, 50);
  const summary2 = useSpringEntrance(frame, 58);

  // ── Phase 3 ──────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const pulse = 1 + Math.sin(frame * 0.08) * 0.01;
  const specGlow = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.04, 0.1]);

  // Border perimeter draws
  const leftPerim = 2 * (440 + 640);
  const rightPerim = 2 * (460 + 640);
  const leftBorder = interpolate(frame, [14, 38], [leftPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const rightBorder = interpolate(frame, [20, 44], [rightPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s12.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="TOOL CALLING · FORMAT" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={260}
            fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Not Prose
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={380}
            fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            Formatted Spec
          </text>
        </g>

        {/* ── ZONE C — Two-Column Comparison ─────────────────────────────── */}

        {/* LEFT COLUMN — Prose (rejected) */}
        <g opacity={leftCard.opacity}
           transform={`translate(0, ${leftCard.translateY})`}>
          <BentoCard x={60} y={460} w={440} h={640} />
          {/* Border draw */}
          <rect x={60} y={460} width={440} height={640} rx={20}
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={2}
            strokeDasharray={leftPerim} strokeDashoffset={leftBorder}
            opacity={0.6} />

          {/* Header */}
          <text x={280} y={520} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.vibrant_red} letterSpacing="0.1em">
            PROSE
          </text>

          {/* Prose text lines (blurry/faded look) */}
          {[
            'The weather in San',
            'Francisco is currently',
            'mild with temperatures',
            'around 62 degrees and',
            'partly cloudy skies...',
          ].map((line, i) => (
            <text key={i} x={100} y={590 + i * 48}
              fontFamily={FONT} fontSize={32} fontWeight={800}
              fill={COLORS.text_muted} opacity={0.4}>
              {line}
            </text>
          ))}

          {/* Strike-through line */}
          <line x1={90} y1={740} x2={460} y2={740}
            stroke={COLORS.vibrant_red} strokeWidth={3}
            strokeDasharray={strikeLen} strokeDashoffset={strikeDash}
            strokeLinecap="round" />

          {/* Big X mark */}
          <g transform="translate(280, 940)">
            <line x1={-35} y1={-35} x2={35} y2={35}
              stroke={COLORS.vibrant_red} strokeWidth={5}
              strokeDasharray={xLen} strokeDashoffset={xDash1}
              strokeLinecap="round" />
            <line x1={35} y1={-35} x2={-35} y2={35}
              stroke={COLORS.vibrant_red} strokeWidth={5}
              strokeDasharray={xLen} strokeDashoffset={xDash2}
              strokeLinecap="round" />
          </g>

          {/* "REJECTED" label */}
          <text x={280} y={1040} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.vibrant_red} opacity={leftCard.opacity * 0.7}>
            REJECTED
          </text>
        </g>

        {/* Center divider */}
        <line x1={540} y1={480} x2={540} y2={1080}
          stroke={COLORS.accent} strokeWidth={1.5}
          strokeDasharray={dividerLen} strokeDashoffset={dividerDash}
          opacity={0.3} />

        {/* Divider "vs" label */}
        <g opacity={leftCard.opacity * rightCard.opacity}>
          <circle cx={540} cy={720} r={24} fill={COLORS.bg_primary} />
          <circle cx={540} cy={720} r={24} fill="none"
            stroke={COLORS.accent} strokeWidth={1.5} opacity={0.5} />
          <text x={540} y={728} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.accent}>
            VS
          </text>
        </g>

        {/* RIGHT COLUMN — Specification (accepted) */}
        <g opacity={rightCard.opacity}
           transform={`translate(0, ${rightCard.translateY})`}>
          <BentoCard x={580} y={460} w={460} h={640} accent />
          {/* Glow pulse around spec card */}
          <rect x={578} y={458} width={464} height={644} rx={22}
            fill="none" stroke={COLORS.accent} strokeWidth={1}
            opacity={specGlow}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '810px 780px' }} />

          {/* Header */}
          <text x={810} y={520} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            SPECIFICATION
          </text>

          {/* Left accent bar */}
          <rect x={580} y={460} width={6} height={640} rx={3}
            fill={COLORS.accent} opacity={0.7} />

          {/* Spec fields */}
          {specFields.map((field, i) => {
            const ent = specEntrances[i];
            return (
              <g key={i} opacity={ent.opacity}
                 transform={`translate(0, ${ent.translateY})`}>
                <rect x={610} y={555 + i * 90} width={400} height={56} rx={10}
                  fill={COLORS.accent} opacity={0.06} />
                <text x={630} y={593 + i * 90}
                  fontFamily="'Fira Code', monospace"
                  fontSize={30} fontWeight={600} fill={COLORS.white}>
                  {field.text}
                </text>
              </g>
            );
          })}

          {/* Checkmark */}
          <g transform="translate(810, 950)">
            <path d="M -30,0 L -8,25 L 30,-20"
              fill="none" stroke={COLORS.accent} strokeWidth={5}
              strokeDasharray={checkLen} strokeDashoffset={checkDash}
              strokeLinecap="round" />
          </g>

          {/* "ACCEPTED" label */}
          <text x={810} y={1040} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} opacity={rightCard.opacity * 0.8}>
            ACCEPTED
          </text>
        </g>

        {/* ── Bottom summary row ─────────────────────────────────────────── */}
        <g opacity={summary1.opacity} transform={`translate(0, ${summary1.translateY})`}>
          <BentoCard x={60} y={1180} w={460} h={140} />
          <text x={100} y={1262}
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Parseable by machines
          </text>
        </g>

        <g opacity={summary2.opacity} transform={`translate(0, ${summary2.translateY})`}>
          <BentoCard x={560} y={1180} w={460} h={140} accent />
          <text x={600} y={1262}
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>
            Exact tool contract
          </text>
        </g>

        {/* ── Floating accent dots ──────────────────────────────────────── */}
        {[
          { x: 100, y: 1420 }, { x: 1000, y: 1450 },
          { x: 200, y: 1550 }, { x: 900, y: 1570 },
          { x: 540, y: 1650 }, { x: 350, y: 1700 },
          { x: 750, y: 1720 },
        ].map((pt, i) => (
          <circle key={i}
            cx={pt.x} cy={pt.y + Math.sin(frame * 0.04 + i * 0.9) * 4}
            r={2.5} fill={COLORS.accent} opacity={0.1 * shimmer} />
        ))}

        {/* ── CAPTION ──────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s12.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
