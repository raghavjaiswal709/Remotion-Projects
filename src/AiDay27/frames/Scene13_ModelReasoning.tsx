/**
 * Scene 13 — Model's Job Is Reasoning
 * "The model's job is reasoning, choosing which tool
 *  with what arguments at what point in the task."
 * CSV: 52.160s → 59.400s
 * Duration: 235 frames (7.8s)
 *
 * Theme: Dark (#1D1D1C) + grid + series accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):   Label + "REASONING" headline reveal with per-word spring
 *   Phase 2 (frames 25–120): Decision tree diagram — 3 decision nodes branch to 3 tool choices
 *   Phase 3 (frames 100–end): Node pulse, connector shimmer, floating thought particles
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

export const Scene13_ModelReasoning: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);

  // Per-word headline spring
  const words = ['REASONING'];
  const wordSprings = words.map((_, i) => {
    const f = Math.max(0, frame - 6 - i * 8);
    const sp = spring({ frame: f, fps, config: SPRING_SNAP });
    const ty = interpolate(sp, [0, 1], [24, 0]);
    const op = interpolate(sp, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });
    return { ty, op };
  });

  const subH = useSpringEntrance(frame, 14);

  // ── Phase 2: Decision tree ─────────────────────────────────────────────────
  // Central "MODEL" node
  const modelNode = useSpringEntrance(frame, 22);

  // Three decision question cards
  const q1 = useSpringEntrance(frame, 32);
  const q2 = useSpringEntrance(frame, 42);
  const q3 = useSpringEntrance(frame, 52);

  // Branches from model to questions (path draw)
  const branchLen = 120;
  const branch1 = usePathDraw(frame, 28, branchLen, 18);
  const branch2 = usePathDraw(frame, 38, branchLen, 18);
  const branch3 = usePathDraw(frame, 48, branchLen, 18);

  // Three answer / tool-choice cards
  const a1 = useSpringEntrance(frame, 60);
  const a2 = useSpringEntrance(frame, 70);
  const a3 = useSpringEntrance(frame, 80);

  // Arrows from questions to answers
  const ansLen = 80;
  const ans1 = usePathDraw(frame, 56, ansLen, 14);
  const ans2 = usePathDraw(frame, 66, ansLen, 14);
  const ans3 = usePathDraw(frame, 76, ansLen, 14);

  // Bottom summary card
  const summaryCard = useSpringEntrance(frame, 90);

  // Border draw for emphasis card
  const emphPerim = 2 * (960 + 120);
  const emphBorder = usePathDraw(frame, 92, emphPerim, 25);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const nodePulse = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.08, 0.16]);

  // Thought particle positions
  const tp1x = 200 + Math.sin(frame * 0.03) * 10;
  const tp1y = 600 + Math.cos(frame * 0.04) * 8;
  const tp2x = 880 + Math.cos(frame * 0.035) * 12;
  const tp2y = 700 + Math.sin(frame * 0.045) * 6;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s13.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="MODEL'S ROLE" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Headline ───────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <text x={60} y={280} fontFamily={FONT} fontSize={52} fontWeight={800} fill={COLORS.text_muted}>
            The Model&apos;s Job Is
          </text>
        </g>

        {wordSprings.map((ws, i) => (
          <text key={i} x={60} y={390}
            opacity={ws.op} transform={`translate(0, ${ws.ty})`}
            fontFamily={FONT} fontSize={110} fontWeight={800} fill={COLORS.accent}>
            {words[i]}
          </text>
        ))}

        <g transform={`translate(0, ${subH.translateY})`} opacity={subH.opacity}>
          <text x={60} y={460} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            Choosing which tool, what arguments, when
          </text>
        </g>

        {/* ── ZONE C — Decision tree diagram ──────────────────────────────── */}

        {/* Central MODEL node */}
        <g opacity={modelNode.opacity} transform={`translate(0, ${modelNode.translateY})`}>
          <circle cx={540} cy={570} r={56}
            fill={COLORS.accent} fillOpacity={nodePulse}
            stroke={COLORS.accent} strokeWidth={2.5} />
          <circle cx={540} cy={570} r={56}
            fill="none" stroke={COLORS.accent} strokeWidth={1}
            transform={`scale(${pulse})`} style={{ transformOrigin: '540px 570px' }}
            opacity={0.3} />
          {/* Brain mini icon */}
          <ellipse cx={540} cy={560} rx={22} ry={20}
            fill="none" stroke={COLORS.white} strokeWidth={1.5} />
          <line x1={540} y1={542} x2={540} y2={578}
            stroke={COLORS.white} strokeWidth={1} strokeDasharray="3 3" opacity={0.6} />
          <text x={540} y={610} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.accent}>
            MODEL
          </text>
        </g>

        {/* Branches from model down to 3 question rows */}
        {/* Left branch */}
        <path d="M 480,620 L 240,700"
          fill="none" stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={branchLen} strokeDashoffset={branch1}
          markerEnd="url(#arrow)" strokeLinecap="round" />
        {/* Center branch */}
        <path d="M 540,626 L 540,700"
          fill="none" stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={branchLen} strokeDashoffset={branch2}
          markerEnd="url(#arrow)" strokeLinecap="round" />
        {/* Right branch */}
        <path d="M 600,620 L 840,700"
          fill="none" stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={branchLen} strokeDashoffset={branch3}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        {/* ── Three question cards (row 1) ────────────────────────────────── */}
        {/* Q1: Which tool? */}
        <g opacity={q1.opacity} transform={`translate(0, ${q1.translateY})`}>
          <BentoCard x={60} y={720} w={300} h={140} accent />
          <text x={80} y={770} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            WHICH
          </text>
          <text x={80} y={810} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Tool?
          </text>
          {/* Question mark icon */}
          <text x={310} y={810} textAnchor="middle"
            fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.accent} opacity={0.2}>
            ?
          </text>
        </g>

        {/* Q2: What arguments? */}
        <g opacity={q2.opacity} transform={`translate(0, ${q2.translateY})`}>
          <BentoCard x={390} y={720} w={300} h={140} accent />
          <text x={410} y={770} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            WHAT
          </text>
          <text x={410} y={810} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Arguments?
          </text>
          <text x={640} y={810} textAnchor="middle"
            fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.accent} opacity={0.2}>
            ?
          </text>
        </g>

        {/* Q3: When? */}
        <g opacity={q3.opacity} transform={`translate(0, ${q3.translateY})`}>
          <BentoCard x={720} y={720} w={300} h={140} accent />
          <text x={740} y={770} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            WHEN
          </text>
          <text x={740} y={810} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            To call?
          </text>
          <text x={970} y={810} textAnchor="middle"
            fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.accent} opacity={0.2}>
            ?
          </text>
        </g>

        {/* ── Arrows from questions down to answers ───────────────────────── */}
        <line x1={210} y1={870} x2={210} y2={940}
          stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={ansLen} strokeDashoffset={ans1}
          markerEnd="url(#arrow)" strokeLinecap="round" />
        <line x1={540} y1={870} x2={540} y2={940}
          stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={ansLen} strokeDashoffset={ans2}
          markerEnd="url(#arrow)" strokeLinecap="round" />
        <line x1={870} y1={870} x2={870} y2={940}
          stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={ansLen} strokeDashoffset={ans3}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        {/* ── Three answer cards (row 2) ──────────────────────────────────── */}
        {/* A1: search tool */}
        <g opacity={a1.opacity} transform={`translate(0, ${a1.translateY})`}>
          <BentoCard x={60} y={950} w={300} h={120} />
          {/* Magnifying glass mini icon */}
          <circle cx={100} cy={1010} r={14}
            fill="none" stroke={COLORS.accent} strokeWidth={2} opacity={shimmer} />
          <line x1={110} y1={1020} x2={122} y2={1032}
            stroke={COLORS.accent} strokeWidth={2} opacity={shimmer} />
          <text x={130} y={1018} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            search()
          </text>
        </g>

        {/* A2: specific args */}
        <g opacity={a2.opacity} transform={`translate(0, ${a2.translateY})`}>
          <BentoCard x={390} y={950} w={300} h={120} />
          {/* Curly braces icon */}
          <text x={420} y={1020} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            {'{'}
          </text>
          <text x={440} y={1015} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            query: ...
          </text>
          <text x={640} y={1020} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            {'}'}
          </text>
        </g>

        {/* A3: right timing */}
        <g opacity={a3.opacity} transform={`translate(0, ${a3.translateY})`}>
          <BentoCard x={720} y={950} w={300} h={120} />
          {/* Clock icon */}
          <circle cx={760} cy={1010} r={16}
            fill="none" stroke={COLORS.accent} strokeWidth={2} opacity={shimmer} />
          <line x1={760} y1={1000} x2={760} y2={1010}
            stroke={COLORS.accent} strokeWidth={2} />
          <line x1={760} y1={1010} x2={770} y2={1016}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={790} y={1018} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Step 3
          </text>
        </g>

        {/* ── Process summary — all three come together ───────────────────── */}
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          {/* Main summary bento */}
          <rect x={60} y={1120} width={960} height={120} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={emphPerim} strokeDashoffset={emphBorder} />
          <rect x={60} y={1120} width={960} height={120} rx={20}
            fill={COLORS.bg_secondary} />

          <text x={100} y={1168} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Reasoning =
          </text>
          <text x={340} y={1168} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            tool
          </text>
          <text x={410} y={1168} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            +
          </text>
          <text x={440} y={1168} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            args
          </text>
          <text x={530} y={1168} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            +
          </text>
          <text x={560} y={1168} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            timing
          </text>

          <text x={100} y={1210} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            The model orchestrates — it does not operate
          </text>
        </g>

        {/* ── Bottom detail cards ──────────────────────────────────────────── */}
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <BentoCard x={60} y={1280} w={460} h={120} />
          <text x={100} y={1330} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            No direct execution
          </text>
          <text x={100} y={1370} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Only text generation
          </text>
        </g>

        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <BentoCard x={560} y={1280} w={460} h={120} accent />
          <text x={600} y={1330} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            Strategic selection
          </text>
          <text x={600} y={1370} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Right tool, right time
          </text>
        </g>

        {/* Thought particles */}
        <circle cx={tp1x} cy={tp1y} r={3} fill={COLORS.accent} opacity={0.12 * shimmer} />
        <circle cx={tp2x} cy={tp2y} r={2.5} fill={COLORS.accent} opacity={0.1 * shimmer} />
        <circle cx={540} cy={1500 + breathe} r={2} fill={COLORS.accent} opacity={0.08} />

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
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
