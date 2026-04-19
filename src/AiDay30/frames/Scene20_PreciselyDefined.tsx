/**
 * Scene 20 — PreciselyDefined
 * "every layer of the agentic system depends on the task being precisely defined."
 * CSV: 62.940s → 67.720s
 * Duration: ~165 frames
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + per-word headline spring
 *   Phase 2 (frames 20–80):  Task definition card + dependency arrows radiating outward
 *   Phase 3 (frames 70+):    Pulse on central node, orbit dots
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

export const Scene20_PreciselyDefined: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelE = useSpringEntrance(frame, 0);

  // Per-word spring headline
  const headlineWords = ['Every', 'layer', 'depends', 'on', 'the', 'task'];
  const wordSprings = headlineWords.map((_, i) => {
    const f = Math.max(0, frame - 5 - i * 5);
    const sp = spring({ frame: f, fps, config: SPRING_SNAP });
    const ty = interpolate(sp, [0, 1], [24, 0]);
    const op = interpolate(sp, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });
    return { ty, op };
  });

  // ── Phase 2 — Central hub + radiating dependencies ─────────────────────────
  const centerCard  = useSpringEntrance(frame, 22);
  const plannerNode = useSpringEntrance(frame, 34);
  const haltNode    = useSpringEntrance(frame, 42);
  const evalNode    = useSpringEntrance(frame, 50);
  const bottomCard  = useSpringEntrance(frame, 62);

  // Dependency arrows from center outward
  const arrow1Len = 180;
  const arrow1Dash = usePathDraw(frame, 36, arrow1Len, 18);
  const arrow2Len = 180;
  const arrow2Dash = usePathDraw(frame, 44, arrow2Len, 18);
  const arrow3Len = 180;
  const arrow3Dash = usePathDraw(frame, 52, arrow3Len, 18);

  // Central hub border draw
  const hubPerim = 2 * Math.PI * 90;
  const hubBorderDash = usePathDraw(frame, 24, hubPerim, 20);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const centerPulse = 1 + Math.sin(frame * 0.1) * 0.02;
  const orbitAngle = frame * 1.5;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Hub center coordinates
  const HUB_X = 540;
  const HUB_Y = 800;

  // Satellite node positions (relative to hub)
  const satellites = [
    { label: 'PLANNER', x: 160, y: 560, entrance: plannerNode, arrowDash: arrow1Dash },
    { label: 'HALT', x: 920, y: 560, entrance: haltNode, arrowDash: arrow2Dash },
    { label: 'EVALUATOR', x: 540, y: 1100, entrance: evalNode, arrowDash: arrow3Dash },
  ];

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s20.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="TASK DEPENDENCY · PRINCIPLE" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Per-word spring headline ─────────────────────────── */}
        {headlineWords.map((word, i) => {
          const isAccent = word === 'task' || word === 'depends';
          return (
            <g key={i} transform={`translate(0, ${wordSprings[i].ty})`} opacity={wordSprings[i].op}>
              <text
                x={60 + i * (word.length > 3 ? 160 : 100)}
                y={320}
                fontFamily={FONT}
                fontSize={i === 5 ? 80 : 64}
                fontWeight={800}
                fill={isAccent ? COLORS.accent : COLORS.white}
                fontStyle={isAccent ? 'italic' : 'normal'}
              >
                {word}
              </text>
            </g>
          );
        })}

        <g transform={`translate(0, ${wordSprings[5]?.ty ?? 0})`} opacity={wordSprings[5]?.op ?? 0}>
          <text x={60} y={410} fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.text_muted}>
            being
          </text>
          <text x={200} y={410} fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            precisely defined
          </text>
        </g>

        {/* ── Central TASK hub ───────────────────────────────────────────── */}
        <g opacity={centerCard.opacity} transform={`translate(0, ${centerCard.translateY})`}>
          {/* Glow ring */}
          <circle cx={HUB_X} cy={HUB_Y} r={95}
            fill={COLORS.accent} fillOpacity={0.06 * centerPulse} />

          {/* Hub circle with animated border */}
          <circle cx={HUB_X} cy={HUB_Y} r={80}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={hubPerim} strokeDashoffset={hubBorderDash} />

          {/* Inner circle */}
          <circle cx={HUB_X} cy={HUB_Y} r={50}
            fill={COLORS.accent} fillOpacity={0.1}
            stroke={COLORS.accent} strokeWidth={1.5} />

          {/* TASK label */}
          <text x={HUB_X} y={HUB_Y + 12} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}>
            TASK
          </text>

          {/* Orbiting dots */}
          {[0, 1, 2].map(i => {
            const a = ((orbitAngle + i * 120) * Math.PI) / 180;
            return (
              <circle key={i}
                cx={HUB_X + Math.cos(a) * 95}
                cy={HUB_Y + Math.sin(a) * 95}
                r={4} fill={COLORS.accent} opacity={0.5} />
            );
          })}
        </g>

        {/* ── Satellite nodes + arrows ──────────────────────────────────── */}
        {satellites.map((sat, i) => {
          const nodeW = 260;
          const nodeH = 100;
          return (
            <g key={i}>
              {/* Arrow from hub to satellite */}
              <line
                x1={HUB_X} y1={HUB_Y + (i === 2 ? 80 : -80)}
                x2={sat.x} y2={sat.y + (i === 2 ? -nodeH / 2 : nodeH / 2)}
                stroke={COLORS.accent} strokeWidth={2}
                strokeDasharray={arrow1Len} strokeDashoffset={sat.arrowDash}
                strokeLinecap="round" markerEnd="url(#arrow)" />

              {/* Node card */}
              <g opacity={sat.entrance.opacity}
                transform={`translate(0, ${sat.entrance.translateY})`}>
                <rect x={sat.x - nodeW / 2} y={sat.y - nodeH / 2}
                  width={nodeW} height={nodeH} rx={20}
                  fill={COLORS.bg_secondary}
                  stroke={COLORS.accent} strokeWidth={2} />

                {/* Icon circle */}
                <circle cx={sat.x - nodeW / 2 + 50} cy={sat.y} r={24}
                  fill={COLORS.accent} fillOpacity={0.15} />
                <text x={sat.x - nodeW / 2 + 50} y={sat.y + 8} textAnchor="middle"
                  fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.accent}>
                  {sat.label[0]}
                </text>

                {/* Label */}
                <text x={sat.x - nodeW / 2 + 90} y={sat.y + 8}
                  fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.white}>
                  {sat.label}
                </text>
              </g>
            </g>
          );
        })}

        {/* ── Data flow labels on arrows ──────────────────────────────────── */}
        <g opacity={plannerNode.opacity * shimmer}>
          <text x={300} y={650} fontFamily={FONT} fontSize={20} fontWeight={800}
            fill={COLORS.text_muted} transform="rotate(-30, 300, 650)">
            reads task
          </text>
        </g>
        <g opacity={haltNode.opacity * shimmer}>
          <text x={740} y={650} fontFamily={FONT} fontSize={20} fontWeight={800}
            fill={COLORS.text_muted} transform="rotate(30, 740, 650)">
            checks criterion
          </text>
        </g>
        <g opacity={evalNode.opacity * shimmer}>
          <text x={560} y={970} fontFamily={FONT} fontSize={20} fontWeight={800}
            fill={COLORS.text_muted}>
            scores result
          </text>
        </g>

        {/* ── Bottom insight card ─────────────────────────────────────────── */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={60} y={1220} w={960} h={300} accent />
          <rect x={60} y={1220} width={6} height={300} rx={3} fill={COLORS.accent} />

          {/* Crosshair icon */}
          <g transform="translate(140, 1370)">
            <circle cx={0} cy={0} r={28} fill="none"
              stroke={COLORS.accent} strokeWidth={2} />
            <line x1={-36} y1={0} x2={36} y2={0}
              stroke={COLORS.accent} strokeWidth={1.5} />
            <line x1={0} y1={-36} x2={0} y2={36}
              stroke={COLORS.accent} strokeWidth={1.5} />
            <circle cx={0} cy={0} r={6} fill={COLORS.accent} />
          </g>

          <text x={200} y={1300} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Precise task = aligned system
          </text>
          <text x={200} y={1344} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Planner knows WHAT to decompose
          </text>
          <text x={200} y={1382} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Halt knows WHEN to stop
          </text>
          <text x={200} y={1420} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Evaluator knows HOW to score
          </text>

          {/* Three state badges */}
          {['WHAT', 'WHEN', 'HOW'].map((label, i) => (
            <g key={i} transform={`translate(${760 + i * 0}, ${1320 + i * 38})`}>
              <rect x={0} y={-14} width={80} height={28} rx={14}
                fill={COLORS.accent} fillOpacity={0.15} />
              <text x={40} y={4} textAnchor="middle"
                fontFamily={FONT} fontSize={16} fontWeight={800} fill={COLORS.accent}>
                {label}
              </text>
            </g>
          ))}

          <text x={200} y={1478} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            Vague task = broken at every layer
          </text>
        </g>

        {/* ── Floating particles ──────────────────────────────────────────── */}
        <g opacity={shimmer * 0.2}>
          <circle cx={140} cy={1600 + breathe} r={3} fill={COLORS.accent} />
          <circle cx={920} cy={1660 + breathe * 0.8} r={2} fill={COLORS.accent} />
          <circle cx={540} cy={1720 + breathe * 1.1} r={2.5} fill={COLORS.accent} opacity={0.4} />
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s20.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
