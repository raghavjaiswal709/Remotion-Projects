/**
 * Scene 11 — StructuredOutput
 * "it generates a structured output,"
 * CSV: 34.980s → 36.720s
 * Duration: 68 frames (2.27s)
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–18):   Label + headline spring
 *   Phase 2 (frames 12–48):  JSON structure assembling, bracket-by-bracket path draw
 *   Phase 3 (frames 40–end): Structure shimmer, field highlights, breathe
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

export const Scene11_StructuredOutput: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──────────────────────────────────────────────────────────────
  const labelEnter = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 4);
  const h2 = useSpringEntrance(frame, 9);

  // ── Phase 2 ──────────────────────────────────────────────────────────────
  // JSON structure card enters
  const structureEnter = useSpringEntrance(frame, 12);

  // Bracket path draw — left bracket
  const bracketLen = 240;
  const leftBracketDash = usePathDraw(frame, 14, bracketLen, 18);
  const rightBracketDash = usePathDraw(frame, 18, bracketLen, 18);

  // JSON field lines appear staggered
  const fields = [
    { key: '"tool"', val: '"search"', delay: 18 },
    { key: '"arguments"', val: '{...}', delay: 24 },
    { key: '"query"', val: '"weather SF"', delay: 30 },
    { key: '"format"', val: '"json"', delay: 36 },
  ];
  const fieldEntrances = fields.map(f => useSpringEntrance(frame, f.delay));

  // Highlight sweeps across field values
  const highlightPos = interpolate(frame, [30, 50], [0, fields.length], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Cards
  const card1 = useSpringEntrance(frame, 36);
  const card2 = useSpringEntrance(frame, 44);

  // Robot small icon (top-right of structure)
  const robotEnter = useSpringEntrance(frame, 10);

  // ── Phase 3 ──────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const structPulse = 1 + Math.sin(frame * 0.08) * 0.008;

  // Border draw animation on large card
  const perim = 2 * (860 + 580);
  const borderDash = interpolate(frame, [12, 36], [perim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s11.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="TOOL CALLING · OUTPUT" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={260}
            fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            Structured
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={380}
            fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Output
          </text>
        </g>

        {/* ── ZONE C — Large JSON structure card ───────────────────────── */}

        {/* Border draw animation */}
        <rect x={110} y={460} width={860} height={580} rx={24}
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={perim} strokeDashoffset={borderDash} />

        {/* Structure card background */}
        <g opacity={structureEnter.opacity}
           transform={`translate(0, ${structureEnter.translateY})`}>
          <rect x={110} y={460} width={860} height={580} rx={24}
            fill={COLORS.bg_secondary} opacity={0.95} />

          {/* Header bar */}
          <rect x={110} y={460} width={860} height={56} rx={24}
            fill={COLORS.accent} opacity={0.08} />
          <text x={160} y={498}
            fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            STRUCTURED OUTPUT
          </text>

          {/* Robot mini icon */}
          <g opacity={robotEnter.opacity} transform={`translate(900, 488)`}>
            <rect x={-18} y={-16} width={36} height={28} rx={6}
              fill="none" stroke={COLORS.accent} strokeWidth={1.5} />
            <circle cx={-6} cy={-4} r={3} fill={COLORS.accent} opacity={shimmer} />
            <circle cx={6} cy={-4} r={3} fill={COLORS.accent} opacity={shimmer} />
          </g>

          {/* Left bracket — large curly */}
          <path d="M 170,540 C 150,540 145,560 145,580 L 145,700 C 145,720 135,730 125,740 C 135,750 145,760 145,780 L 145,900 C 145,920 150,940 170,940"
            fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={bracketLen} strokeDashoffset={leftBracketDash}
            strokeLinecap="round" opacity={0.7} />

          {/* Right bracket — large curly */}
          <path d="M 910,540 C 930,540 935,560 935,580 L 935,700 C 935,720 945,730 955,740 C 945,750 935,760 935,780 L 935,900 C 935,920 930,940 910,940"
            fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={bracketLen} strokeDashoffset={rightBracketDash}
            strokeLinecap="round" opacity={0.7} />

          {/* JSON field lines */}
          {fields.map((field, i) => {
            const ent = fieldEntrances[i];
            const isHighlighted = Math.floor(highlightPos) === i;
            const fieldY = 590 + i * 85;
            return (
              <g key={i} opacity={ent.opacity}
                 transform={`translate(0, ${ent.translateY})`}>
                {/* Highlight bar */}
                {isHighlighted && (
                  <rect x={200} y={fieldY - 22} width={680} height={50} rx={8}
                    fill={COLORS.accent} opacity={0.06} />
                )}
                {/* Key */}
                <text x={220} y={fieldY + 8}
                  fontFamily="'Fira Code', 'Courier New', monospace"
                  fontSize={32} fontWeight={600}
                  fill={COLORS.accent}>
                  {field.key}:
                </text>
                {/* Value */}
                <text x={540} y={fieldY + 8}
                  fontFamily="'Fira Code', 'Courier New', monospace"
                  fontSize={32} fontWeight={500}
                  fill={COLORS.white}>
                  {field.val}
                </text>
                {/* Comma */}
                {i < fields.length - 1 && (
                  <text x={840} y={fieldY + 8}
                    fontFamily="'Fira Code', monospace"
                    fontSize={32} fontWeight={500}
                    fill={COLORS.text_muted}>
                    ,
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* ── Explanation cards ──────────────────────────────────────────── */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={1120} w={460} h={180} accent />
          <rect x={60} y={1120} width={6} height={180} rx={3} fill={COLORS.accent} />
          <text x={100} y={1200}
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Machine-readable
          </text>
          <text x={100} y={1260}
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            Not natural language
          </text>
        </g>

        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={560} y={1120} w={460} h={180} />
          <text x={600} y={1200}
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            Precise format
          </text>
          <text x={600} y={1260}
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            Name + args + values
          </text>
        </g>

        {/* ── Floating accent particles ──────────────────────────────────── */}
        {[
          { x: 80, y: 1420 }, { x: 1000, y: 1440 },
          { x: 120, y: 1560 }, { x: 950, y: 1580 },
          { x: 540, y: 1680 }, { x: 300, y: 1640 },
          { x: 750, y: 1700 },
        ].map((pt, i) => (
          <circle key={i}
            cx={pt.x} cy={pt.y + Math.sin(frame * 0.04 + i * 1.1) * 5}
            r={3} fill={COLORS.accent} opacity={0.1 * shimmer} />
        ))}

        {/* ── Structure glow pulse ───────────────────────────────────────── */}
        <rect x={108} y={458} width={864} height={584} rx={26}
          fill="none" stroke={COLORS.accent} strokeWidth={1}
          opacity={0.05 * shimmer}
          transform={`scale(${structPulse})`}
          style={{ transformOrigin: '540px 750px' }} />

        {/* ── CAPTION ──────────────────────────────────────────────────── */}
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
