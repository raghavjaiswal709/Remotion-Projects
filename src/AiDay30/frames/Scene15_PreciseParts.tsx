/**
 * Scene 15 — PreciseParts
 * "Every part is precise."
 * CSV: 47.360s → 48.780s
 * Duration: ~68 frames
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline spring
 *   Phase 2 (frames 18–70):  Three precision instruments — ruler, caliper, level
 *   Phase 3 (frames 50+):    Pulse on alignment, micro shimmer
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

export const Scene15_PreciseParts: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA     = useSpringEntrance(frame, 5);

  // Per-word headline spring
  const words = ['Every', 'part', 'is', 'precise.'];
  const wordSprings = words.map((_, i) => {
    const f = Math.max(0, frame - 5 - i * 6);
    const sp = spring({ frame: f, fps, config: SPRING_SNAP });
    const ty = interpolate(sp, [0, 1], [28, 0]);
    const op = interpolate(sp, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });
    return { ty, op };
  });

  // ── Phase 2 — Three precision cards ────────────────────────────────────────
  const card1 = useSpringEntrance(frame, 20);
  const card2 = useSpringEntrance(frame, 32);
  const card3 = useSpringEntrance(frame, 44);
  const summaryCard = useSpringEntrance(frame, 56);

  // Ruler tick draw
  const rulerLen = 700;
  const rulerDash = usePathDraw(frame, 22, rulerLen, 20);

  // Caliper draw
  const caliperLen = 300;
  const caliperDash = usePathDraw(frame, 34, caliperLen, 18);

  // Level bubble draw
  const levelLen = 200;
  const levelDash = usePathDraw(frame, 46, levelLen, 16);

  // Connector lines
  const connLen = 60;
  const conn1Dash = usePathDraw(frame, 30, connLen, 10);
  const conn2Dash = usePathDraw(frame, 42, connLen, 10);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse   = 1 + Math.sin(frame * 0.1) * 0.012;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s15.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="TASK DEFINITION · PRECISION" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Per-word headline ──────────────────────────────────── */}
        {words.map((word, i) => (
          <text key={i}
            x={60 + i * 220} y={340}
            opacity={wordSprings[i].op}
            transform={`translate(0, ${wordSprings[i].ty})`}
            fontFamily={FONT} fontSize={88} fontWeight={800}
            fill={word === 'precise.' ? COLORS.accent : COLORS.white}
            fontStyle={word === 'precise.' ? 'italic' : undefined}
          >
            {word}
          </text>
        ))}

        {/* ── Subtitle ───────────────────────────────────────────────────── */}
        <g opacity={headlineA.opacity} transform={`translate(0, ${headlineA.translateY})`}>
          <text x={60} y={420} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            No ambiguity. No vagueness. No guessing.
          </text>
        </g>

        {/* ── Card 1: Start State — Ruler ────────────────────────────────── */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={490} w={960} h={240} accent />
          <rect x={60} y={490} width={6} height={240} rx={3} fill={COLORS.accent} />

          {/* Ruler illustration */}
          <line x1={120} y1={570} x2={960} y2={570}
            stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round"
            strokeDasharray={rulerLen} strokeDashoffset={rulerDash} />
          {/* Tick marks along ruler */}
          {Array.from({ length: 18 }, (_, i) => {
            const tx = 120 + i * 49;
            const h = i % 5 === 0 ? 24 : 12;
            const enterOp = interpolate(frame, [24 + i, 30 + i], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            return (
              <g key={i} opacity={enterOp}>
                <line x1={tx} y1={570 - h} x2={tx} y2={570}
                  stroke={COLORS.accent} strokeWidth={i % 5 === 0 ? 2 : 1} />
                {i % 5 === 0 && (
                  <text x={tx} y={556} textAnchor="middle"
                    fontFamily={FONT} fontSize={16} fontWeight={800} fill={COLORS.text_muted}>
                    {i / 5}
                  </text>
                )}
              </g>
            );
          })}

          <text x={120} y={640} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            START STATE
          </text>
          <text x={120} y={680} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Exact initial conditions, not approximate
          </text>
        </g>

        {/* ── Connector 1 ────────────────────────────────────────────────── */}
        <path d="M 540,740 L 540,770"
          fill="none" stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={connLen} strokeDashoffset={conn1Dash}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* ── Card 2: End State — Caliper ────────────────────────────────── */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={790} w={960} h={240} accent />
          <rect x={60} y={790} width={6} height={240} rx={3} fill={COLORS.accent} />

          {/* Caliper illustration */}
          <g transform="translate(700, 880)">
            {/* Main jaw */}
            <path d="M -100,0 L 100,0 M -100,0 L -100,-40 M 100,0 L 100,-40"
              fill="none" stroke={COLORS.accent} strokeWidth={2.5}
              strokeDasharray={caliperLen} strokeDashoffset={caliperDash}
              strokeLinecap="round" />
            {/* Measurement gap */}
            <line x1={-60} y1={-20} x2={60} y2={-20}
              stroke={COLORS.accent} strokeWidth={1} strokeDasharray="4,4" />
            {/* Arrows */}
            <polygon points="-60,-20 -52,-16 -52,-24" fill={COLORS.accent} />
            <polygon points="60,-20 52,-16 52,-24" fill={COLORS.accent} />
            {/* Reading */}
            <text x={0} y={-30} textAnchor="middle"
              fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.accent}>
              EXACT
            </text>
          </g>

          <text x={120} y={936} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            END STATE
          </text>
          <text x={120} y={976} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Exact desired outcome, verifiable
          </text>
        </g>

        {/* ── Connector 2 ────────────────────────────────────────────────── */}
        <path d="M 540,1040 L 540,1070"
          fill="none" stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={connLen} strokeDashoffset={conn2Dash}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* ── Card 3: Criterion — Level bubble ───────────────────────────── */}
        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={60} y={1090} w={960} h={240} accent />
          <rect x={60} y={1090} width={6} height={240} rx={3} fill={COLORS.accent} />

          {/* Level/bubble illustration */}
          <g transform="translate(750, 1170)">
            <rect x={-80} y={-18} width={160} height={36} rx={18}
              fill="none" stroke={COLORS.accent} strokeWidth={2.5}
              strokeDasharray={levelLen} strokeDashoffset={levelDash} />
            {/* Bubble (centered = aligned = precise) */}
            <circle cx={0 + breathe * 0.3} cy={0} r={12}
              fill={COLORS.accent} fillOpacity={0.25}
              stroke={COLORS.accent} strokeWidth={2} />
            {/* Center mark */}
            <line x1={0} y1={-22} x2={0} y2={-14}
              stroke={COLORS.accent} strokeWidth={2} />
            <line x1={0} y1={14} x2={0} y2={22}
              stroke={COLORS.accent} strokeWidth={2} />
          </g>

          <text x={120} y={1236} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            CRITERION
          </text>
          <text x={120} y={1276} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Binary pass/fail, measurable, zero ambiguity
          </text>
        </g>

        {/* ── Summary card ───────────────────────────────────────────────── */}
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <BentoCard x={60} y={1380} w={960} h={160} />

          {/* Precision icon: crosshair */}
          <g transform={`translate(120, 1460) scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }}>
            <circle cx={0} cy={0} r={22} fill="none" stroke={COLORS.accent} strokeWidth={2} />
            <line x1={-30} y1={0} x2={30} y2={0} stroke={COLORS.accent} strokeWidth={1.5} />
            <line x1={0} y1={-30} x2={0} y2={30} stroke={COLORS.accent} strokeWidth={1.5} />
            <circle cx={0} cy={0} r={5} fill={COLORS.accent} />
          </g>

          <text x={170} y={1440} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Precision enables automation
          </text>
          <text x={170} y={1480} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted}>
            Vague inputs produce vague outputs — always
          </text>
          <text x={170} y={1512} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent}>
            Exact → deterministic → trustworthy
          </text>
        </g>

        {/* ── Floating accent particles ───────────────────────────────────── */}
        <g opacity={shimmer * 0.2}>
          <circle cx={100} cy={1600 + breathe} r={2.5} fill={COLORS.accent} />
          <circle cx={950} cy={1640 + breathe * 0.8} r={3} fill={COLORS.accent} />
          <circle cx={540} cy={1700 + breathe * 1.2} r={2} fill={COLORS.accent} />
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s15.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
