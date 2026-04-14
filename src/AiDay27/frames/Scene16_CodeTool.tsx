/**
 * Scene 16 — Code Tool
 * "A code tool gives it precise calculation."
 * CSV: 69.580s → 72.040s
 * Duration: 92 frames (3.1s)
 *
 * Theme: Dark (#1D1D1C) + grid + series accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20):   Label + "Code Tool" headline spring
 *   Phase 2 (frames 16–60):  Code block card with line-by-line reveal + calculation result
 *   Phase 3 (frames 50–end): Cursor blink, result counter tick-up, code shimmer
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
import { DarkBackground, GlobalDefs, Caption, SectionLabel, BentoCard } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const MONO = "'Fira Code', 'Courier New', monospace";

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
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

function useCounter(frame: number, startFrame: number, endValue: number, durationFrames = 45) {
  const raw = interpolate(frame, [startFrame, startFrame + durationFrames], [0, endValue], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(raw);
}

export const Scene16_CodeTool: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headlineEnt = useSpringEntrance(frame, 4);
  const subEnt = useSpringEntrance(frame, 10);

  // ── Phase 2: Code block + result ───────────────────────────────────────────
  const codeCard = useSpringEntrance(frame, 14);

  // Code lines with staggered reveal
  const codeLines = [
    { text: 'def compound_interest(p, r, n, t):', isKeyword: true },
    { text: '    rate = r / (100 * n)', isKeyword: false },
    { text: '    amount = p * (1 + rate) ** (n * t)', isKeyword: false },
    { text: '    return round(amount, 2)', isKeyword: true },
    { text: '', isKeyword: false },
    { text: '# Result: 12,682.50', isKeyword: true },
  ];

  const lineStagger = 8;
  const lineOpacities = codeLines.map((_, i) =>
    interpolate(frame, [18 + i * lineStagger, 18 + i * lineStagger + 10], [0, 1], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    })
  );

  // Cursor blink
  const cursorOn = Math.floor(frame / 15) % 2 === 0;

  // Result card
  const resultCard = useSpringEntrance(frame, 44);
  const resultValue = useCounter(frame, 46, 12682, 35);

  // Arrow from code to result
  const arrowLen = 100;
  const arrowOffset = usePathDraw(frame, 40, arrowLen, 14);

  // Border draw for code card
  const codePerim = 2 * (960 + 500);
  const codeBorder = usePathDraw(frame, 16, codePerim, 25);

  // Bottom detail cards
  const detailCard1 = useSpringEntrance(frame, 52);
  const detailCard2 = useSpringEntrance(frame, 60);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s16.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="TOOL EXAMPLE 2" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Headline ───────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineEnt.translateY})`} opacity={headlineEnt.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={96} fontWeight={800} fill={COLORS.white}>
            Code
          </text>
          <text x={340} y={300} fontFamily={FONT} fontSize={96} fontWeight={800} fill={COLORS.accent}>
            Tool
          </text>
        </g>

        <g transform={`translate(0, ${subEnt.translateY})`} opacity={subEnt.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.text_muted}>
            Precise calculation, guaranteed accuracy
          </text>
        </g>

        {/* ── ZONE C — Code block ─────────────────────────────────────────── */}
        <g opacity={codeCard.opacity} transform={`translate(0, ${codeCard.translateY})`}>
          {/* Animated border */}
          <rect x={60} y={440} width={960} height={500} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={codePerim} strokeDashoffset={codeBorder} />
          {/* Background */}
          <rect x={60} y={440} width={960} height={500} rx={20}
            fill={COLORS.bg_secondary} />
          {/* Left accent bar */}
          <rect x={60} y={440} width={6} height={500} rx={3} fill={COLORS.accent} />

          {/* Terminal dots */}
          <circle cx={100} cy={472} r={6} fill={COLORS.vibrant_red} opacity={0.7} />
          <circle cx={120} cy={472} r={6} fill="#FFBD2E" opacity={0.7} />
          <circle cx={140} cy={472} r={6} fill="#27C93F" opacity={0.7} />

          {/* Line numbers + code */}
          {codeLines.map((line, i) => (
            <g key={i} opacity={lineOpacities[i]}>
              {/* Line number */}
              {line.text !== '' && (
                <text x={90} y={524 + i * 56}
                  fontFamily={MONO} fontSize={28} fontWeight={500}
                  fill={COLORS.text_muted} opacity={0.3}>
                  {i + 1}
                </text>
              )}
              {/* Code text */}
              <text x={130} y={524 + i * 56}
                fontFamily={MONO} fontSize={32} fontWeight={500}
                fill={line.isKeyword ? COLORS.accent : COLORS.text_muted}>
                {line.text}
              </text>
            </g>
          ))}

          {/* Blinking cursor */}
          {cursorOn && (
            <rect x={130 + 22 * 22} y={524 + 5 * 56 - 28}
              width={2} height={32}
              fill={COLORS.accent} opacity={0.7} />
          )}

          {/* Code highlight overlay */}
          <rect x={126} y={524 + 2 * 56 - 32} width={700} height={40} rx={4}
            fill={COLORS.accent} opacity={0.04 * shimmer} />
        </g>

        {/* Arrow: code → result */}
        <line x1={540} y1={950} x2={540} y2={1010}
          stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={arrowLen} strokeDashoffset={arrowOffset}
          markerEnd="url(#arrow)" />

        {/* ── Result card ─────────────────────────────────────────────────── */}
        <g opacity={resultCard.opacity} transform={`translate(0, ${resultCard.translateY})`}>
          <BentoCard x={60} y={1020} w={960} h={200} accent />

          {/* Equals sign icon */}
          <text x={120} y={1100} fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.accent} opacity={0.2}>
            =
          </text>

          {/* Animated counter */}
          <text x={240} y={1110} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            ${resultValue.toLocaleString()}
          </text>
          <text x={680} y={1110} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent}>
            .50
          </text>

          <text x={240} y={1170} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Compound interest — exact to the penny
          </text>

          {/* Checkmark */}
          <g transform="translate(950, 1090)">
            <circle cx={0} cy={0} r={18}
              fill={COLORS.accent} fillOpacity={0.15 * pulse} />
            <polyline points="-8,0 -2,7 10,-6"
              fill="none" stroke={COLORS.accent} strokeWidth={3}
              strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>

        {/* ── Bottom detail cards ──────────────────────────────────────────── */}
        <g opacity={detailCard1.opacity} transform={`translate(0, ${detailCard1.translateY})`}>
          <BentoCard x={60} y={1260} w={460} h={120} />
          {/* Calculator icon */}
          <rect x={90} y={1290} width={26} height={30} rx={4}
            fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <line x1={96} y1={1296} x2={110} y2={1296}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <rect x={96} y={1302} width={5} height={5} rx={1} fill={COLORS.accent} opacity={0.5} />
          <rect x={104} y={1302} width={5} height={5} rx={1} fill={COLORS.accent} opacity={0.5} />
          <rect x={96} y={1310} width={5} height={5} rx={1} fill={COLORS.accent} opacity={0.5} />
          <rect x={104} y={1310} width={5} height={5} rx={1} fill={COLORS.accent} opacity={0.5} />
          <text x={130} y={1318} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Math precision
          </text>
          <text x={130} y={1356} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            No hallucinated numbers
          </text>
        </g>

        <g opacity={detailCard2.opacity} transform={`translate(0, ${detailCard2.translateY})`}>
          <BentoCard x={560} y={1260} w={460} h={120} accent />
          {/* Terminal icon */}
          <rect x={590} y={1290} width={30} height={24} rx={4}
            fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <text x={596} y={1308} fontFamily={MONO} fontSize={14} fontWeight={800} fill={COLORS.accent}>
            {'>_'}
          </text>
          <text x={636} y={1318} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            Deterministic
          </text>
          <text x={636} y={1356} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Same input, same output
          </text>
        </g>

        {/* Floating particles */}
        <circle cx={540} cy={1480 + breathe} r={3} fill={COLORS.accent} opacity={0.07} />
        <circle cx={200} cy={1520 + breathe * 0.6} r={2} fill={COLORS.accent} opacity={0.05} />

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s16.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
