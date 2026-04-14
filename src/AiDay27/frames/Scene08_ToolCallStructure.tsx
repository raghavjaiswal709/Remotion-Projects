/**
 * Scene 08 — Tool Call Structure
 * "It generates text. A tool call is a structured piece of text
 *  that says call this function with these arguments."
 * CSV: 30.340s → 38.120s (MERGED phrase — longest content scene)
 * Duration: 251 frames (8.4s)
 *
 * Theme: Dark (#1D1D1C) + grid + series accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):   Headline + sub-line spring in
 *   Phase 2 (frames 20–120): JSON tool call card reveals line-by-line, flow arrows draw
 *   Phase 3 (frames 100–end): JSON field shimmer, flow arrow pulse, dot breathing
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
const SPRING_SOFT = { damping: 22, stiffness: 120, mass: 1.0 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

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

// JSON lines to animate in one by one
const JSON_LINES = [
  { text: '{', indent: 0, isKey: false },
  { text: '"name": "search",', indent: 1, isKey: true },
  { text: '"arguments": {', indent: 1, isKey: true },
  { text: '"query": "latest AI research"', indent: 2, isKey: false },
  { text: '}', indent: 1, isKey: false },
  { text: '}', indent: 0, isKey: false },
];

export const Scene08_ToolCallStructure: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headlineEnt = useSpringEntrance(frame, 6);
  const subEnt = useSpringEntrance(frame, 14);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const jsonCard = useSpringEntrance(frame, 22);
  const borderPerim = 2 * (860 + 440);
  const borderDraw = usePathDraw(frame, 26, borderPerim, 35);

  // JSON line stagger (one line every 10 frames starting at frame 34)
  const jsonLineOpacities = JSON_LINES.map((_, i) => {
    const f = Math.max(0, frame - (34 + i * 10));
    const sp = spring({ frame: f, fps, config: SPRING_SNAP });
    const op = interpolate(f, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
    const ty = interpolate(sp, [0, 1], [20, 0]);
    return { op, ty };
  });

  // Flow diagram cards
  const flowModel = useSpringEntrance(frame, 85);
  const flowArrowLen = 120;
  const flowArrow1 = usePathDraw(frame, 95, flowArrowLen, 20);
  const flowCall = useSpringEntrance(frame, 100);
  const flowArrow2 = usePathDraw(frame, 110, flowArrowLen, 20);
  const flowRuntime = useSpringEntrance(frame, 115);

  // Annotation cards
  const annot1 = useSpringEntrance(frame, 70);
  const annot2 = useSpringEntrance(frame, 80);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const cursorBlink = Math.sin(frame * 0.2) > 0 ? 1 : 0;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s08.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="TOOL CALL ANATOMY" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Headline ───────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineEnt.translateY})`} opacity={headlineEnt.opacity}>
          <text x={60} y={290} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Tool Call
          </text>
          <text x={530} y={290} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.accent}>
            = Text
          </text>
        </g>

        <g transform={`translate(0, ${subEnt.translateY})`} opacity={subEnt.opacity}>
          <text x={60} y={370} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.text_muted}>
            A structured piece of text the model produces
          </text>
        </g>

        {/* ── ZONE C — JSON Tool Call Card ─────────────────────────────────── */}
        <g opacity={jsonCard.opacity} transform={`translate(0, ${jsonCard.translateY})`}>
          {/* Card background */}
          <BentoCard x={100} y={420} w={860} h={440} accent />

          {/* Border draw animation */}
          <rect x={100} y={420} width={860} height={440} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={borderPerim} strokeDashoffset={borderDraw} />

          {/* Header bar */}
          <rect x={100} y={420} width={860} height={56} rx={20} ry={20}
            fill={COLORS.accent} fillOpacity={0.12} />
          <text x={140} y={458} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.12em">
            TOOL CALL — JSON
          </text>

          {/* Blinking cursor dot */}
          <circle cx={920} cy={448} r={5} fill={COLORS.accent} opacity={cursorBlink * 0.8} />

          {/* JSON lines with staggered entrance */}
          {JSON_LINES.map((line, i) => {
            const anim = jsonLineOpacities[i];
            const lineY = 520 + i * 52;
            const indentX = 140 + line.indent * 36;

            return (
              <g key={i} opacity={anim.op} transform={`translate(0, ${anim.ty})`}>
                <text x={indentX} y={lineY}
                  fontFamily={MONO} fontSize={34} fontWeight={500}
                  fill={line.isKey ? COLORS.accent : COLORS.text_muted}>
                  {line.text}
                </text>
              </g>
            );
          })}
        </g>

        {/* ── Annotation cards ────────────────────────────────────────────── */}
        <g opacity={annot1.opacity} transform={`translate(0, ${annot1.translateY})`}>
          <BentoCard x={60} y={890} w={460} h={140} />
          {/* Tag icon */}
          <rect x={96} y={934} width={48} height={48} rx={10}
            fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={120} y={966} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent}>
            N
          </text>
          <text x={168} y={956} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            &quot;name&quot;
          </text>
          <text x={168} y={1000} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Which function to call
          </text>
        </g>

        <g opacity={annot2.opacity} transform={`translate(0, ${annot2.translateY})`}>
          <BentoCard x={560} y={890} w={460} h={140} />
          {/* Args icon */}
          <rect x={596} y={934} width={48} height={48} rx={10}
            fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={620} y={966} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent}>
            A
          </text>
          <text x={668} y={956} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            &quot;arguments&quot;
          </text>
          <text x={668} y={1000} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Input parameters to pass
          </text>
        </g>

        {/* ── Flow diagram: Model → Tool Call → Runtime ───────────────────── */}
        <g opacity={flowModel.opacity} transform={`translate(0, ${flowModel.translateY})`}>
          {/* Model node */}
          <rect x={60} y={1090} width={260} height={100} rx={20}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          <text x={190} y={1150} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            MODEL
          </text>
          {/* Brain mini icon */}
          <ellipse cx={110} cy={1140} rx={18} ry={14}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5} opacity={0.5 * shimmer} />
        </g>

        {/* Arrow 1 */}
        <line x1={320} y1={1140} x2={400} y2={1140}
          stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={flowArrowLen} strokeDashoffset={flowArrow1}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        <g opacity={flowCall.opacity} transform={`translate(0, ${flowCall.translateY})`}>
          {/* Tool Call node (accent-highlighted) */}
          <rect x={400} y={1090} width={280} height={100} rx={20}
            fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={2.5} />
          <text x={540} y={1150} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>
            TOOL CALL
          </text>
          {/* Code brackets */}
          <text x={420} y={1150} fontFamily={MONO} fontSize={28} fontWeight={800}
            fill={COLORS.accent} opacity={0.5}>
            {'{'}
          </text>
          <text x={658} y={1150} fontFamily={MONO} fontSize={28} fontWeight={800}
            fill={COLORS.accent} opacity={0.5}>
            {'}'}
          </text>
        </g>

        {/* Arrow 2 */}
        <line x1={680} y1={1140} x2={760} y2={1140}
          stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={flowArrowLen} strokeDashoffset={flowArrow2}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        <g opacity={flowRuntime.opacity} transform={`translate(0, ${flowRuntime.translateY})`}>
          {/* Runtime node */}
          <rect x={760} y={1090} width={260} height={100} rx={20}
            fill={COLORS.bg_secondary} stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} />
          <text x={890} y={1150} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            RUNTIME
          </text>
          {/* Gear mini icon */}
          <circle cx={810} cy={1140} r={12}
            fill="none" stroke={COLORS.text_muted} strokeWidth={1.5} opacity={0.4} />
        </g>

        {/* ── Bottom Key Insight Card ──────────────────────────────────────── */}
        <g opacity={flowRuntime.opacity} transform={`translate(0, ${flowRuntime.translateY})`}>
          <BentoCard x={60} y={1240} w={960} h={210} />

          <text x={100} y={1320} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            The model produces{' '}
          </text>
          <text x={540} y={1320} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.accent}>
            structured text
          </text>

          <text x={100} y={1380} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            &quot;Call this function with these arguments.&quot;
          </text>
          <text x={100} y={1420} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            The runtime interprets and executes.
          </text>
        </g>

        {/* Floating accent dots */}
        <circle cx={80} cy={1520} r={3}
          fill={COLORS.accent} opacity={0.15 * shimmer} />
        <circle cx={1000} cy={1550} r={2.5}
          fill={COLORS.accent} opacity={0.12 * pulse} />

        {/* ── Summary strip ───────────────────────────────────────────────── */}
        <g opacity={flowRuntime.opacity} transform={`translate(0, ${flowRuntime.translateY})`}>
          <BentoCard x={60} y={1500} w={960} h={100} accent />
          <text x={540} y={1562} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Tool call = intention expressed as{' '}
          </text>
          <text x={880} y={1562}
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>
            data
          </text>
        </g>

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s08.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
