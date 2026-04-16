/**
 * Scene 05 — ToolCalling
 * "This is tool calling."
 * CSV: 18.367s → 19.560s
 * Duration: 73 frames (2.43s)
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20):   Hero text spring entrance — "TOOL CALLING" in massive type
 *   Phase 2 (frames 15–50):  Surrounding diagram — model node → structured output → system node
 *   Phase 3 (frames 40–end): Pulse rings on "TOOL CALLING", connector breathing
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
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 } as const;

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

export const Scene05_ToolCalling: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Hero text ──────────────────────────────────────────────────────
  const labelEnter = useSpringEntrance(frame, 0);

  // Per-word spring for "TOOL CALLING"
  const wordTool = (() => {
    const f = Math.max(0, frame - 4);
    const p = spring({ frame: f, fps, config: SPRING_SNAP });
    const ty = interpolate(p, [0, 1], [48, 0]);
    const op = interpolate(f, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
    return { ty, op };
  })();

  const wordCalling = (() => {
    const f = Math.max(0, frame - 10);
    const p = spring({ frame: f, fps, config: SPRING_SNAP });
    const ty = interpolate(p, [0, 1], [48, 0]);
    const op = interpolate(f, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
    return { ty, op };
  })();

  // ── Phase 2: Diagram build ──────────────────────────────────────────────────
  const modelNode = useSpringEntrance(frame, 16);
  const specNode = useSpringEntrance(frame, 24);
  const systemNode = useSpringEntrance(frame, 32);

  // Connector paths
  const conn1Len = 200;
  const conn1Dash = usePathDraw(frame, 20, conn1Len, 20);
  const conn2Len = 200;
  const conn2Dash = usePathDraw(frame, 28, conn2Len, 20);

  // ── Phase 3: Micro-animations ───────────────────────────────────────────────
  const pulse = 1 + Math.sin(frame * 0.1) * 0.02;
  const breathe = Math.sin(frame * 0.06) * 4;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.8, 1]);
  const ringExpand = interpolate(frame, [30, 60], [80, 120], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const ringOp = interpolate(frame, [30, 60], [0.3, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const ring2Expand = interpolate(frame, [35, 65], [80, 140], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const ring2Op = interpolate(frame, [35, 65], [0.2, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Underline draw
  const underlineLen = 660;
  const underlineDash = usePathDraw(frame, 12, underlineLen, 18);

  // Bot details
  const card1 = useSpringEntrance(frame, 38);
  const card2 = useSpringEntrance(frame, 46);

  // Caption
  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s05.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="MODULE 4 · TOOL CALLING" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B — Hero definition text ─────────────────────────────── */}
        {/* Ghost behind hero, pulsing */}
        <text x={540} y={440} textAnchor="middle"
          fontFamily={FONT} fontSize={160} fontWeight={800}
          fill={COLORS.accent} opacity={wordTool.op * 0.06}>
          TOOL
        </text>
        <text x={540} y={600} textAnchor="middle"
          fontFamily={FONT} fontSize={160} fontWeight={800}
          fill={COLORS.accent} opacity={wordCalling.op * 0.06}>
          CALLING
        </text>

        {/* Primary "TOOL" */}
        <g transform={`translate(0, ${wordTool.ty})`} opacity={wordTool.op}>
          <text x={540} y={430} textAnchor="middle"
            fontFamily={FONT} fontSize={140} fontWeight={800}
            fill={COLORS.white}>
            TOOL
          </text>
        </g>

        {/* Primary "CALLING" */}
        <g transform={`translate(0, ${wordCalling.ty})`} opacity={wordCalling.op}>
          <text x={540} y={590} textAnchor="middle"
            fontFamily={FONT} fontSize={140} fontWeight={800}
            fill={COLORS.accent}>
            CALLING
          </text>
        </g>

        {/* Underline accent */}
        <line x1={210} y1={620} x2={870} y2={620}
          stroke={COLORS.accent} strokeWidth={4} strokeLinecap="round"
          strokeDasharray={underlineLen} strokeDashoffset={underlineDash}
        />

        {/* Pulse rings */}
        <circle cx={540} cy={510} r={ringExpand}
          fill="none" stroke={COLORS.accent} strokeWidth={2} opacity={ringOp} />
        <circle cx={540} cy={510} r={ring2Expand}
          fill="none" stroke={COLORS.accent} strokeWidth={1.5} opacity={ring2Op} />

        {/* ── ZONE C — Flow diagram: Model → Structured Output → System ── */}

        {/* Model node */}
        <g opacity={modelNode.opacity}
           transform={`translate(170, ${830 + modelNode.translateY})`}>
          <rect x={-120} y={-50} width={240} height={100} rx={20}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2.5} />
          {/* Robot face in node */}
          <circle cx={-40} cy={0} r={12} fill="none" stroke={COLORS.accent} strokeWidth={1.5} />
          <circle cx={-40} cy={0} r={4} fill={COLORS.accent} opacity={shimmer} />
          <circle cx={40} cy={0} r={12} fill="none" stroke={COLORS.accent} strokeWidth={1.5} />
          <circle cx={40} cy={0} r={4} fill={COLORS.accent} opacity={shimmer} />
          <text x={0} y={80} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            MODEL
          </text>
        </g>

        {/* Connector 1 */}
        <path d="M 290,830 L 420,830"
          fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={conn1Len} strokeDashoffset={conn1Dash}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* Structured output node (center) */}
        <g opacity={specNode.opacity}
           transform={`translate(540, ${830 + specNode.translateY})`}>
          {/* Dashed border = structured output */}
          <rect x={-100} y={-55} width={200} height={110} rx={16}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2} strokeDasharray="8 4" />
          {/* JSON brackets */}
          <text x={-60} y={10} fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.accent} opacity={0.8}>
            {'{ }'}
          </text>
          <text x={0} y={100} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            STRUCTURED
          </text>
          <text x={0} y={134} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            OUTPUT
          </text>
        </g>

        {/* Connector 2 */}
        <path d="M 660,830 L 790,830"
          fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={conn2Len} strokeDashoffset={conn2Dash}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* System node */}
        <g opacity={systemNode.opacity}
           transform={`translate(910, ${830 + systemNode.translateY})`}>
          <rect x={-120} y={-50} width={240} height={100} rx={20}
            fill={COLORS.bg_secondary} stroke="rgba(255,255,255,0.2)" strokeWidth={2} />
          {/* Gear icon */}
          <circle cx={0} cy={0} r={20} fill="none" stroke={COLORS.accent} strokeWidth={2} />
          {Array.from({ length: 8 }, (_, i) => {
            const angle = (i * 45 * Math.PI) / 180;
            return (
              <line key={i}
                x1={Math.cos(angle) * 16} y1={Math.sin(angle) * 16}
                x2={Math.cos(angle) * 28} y2={Math.sin(angle) * 28}
                stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" />
            );
          })}
          <text x={0} y={80} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            SYSTEM
          </text>
        </g>

        {/* ── Explanation cards ─────────────────────────────────────────── */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={1080} w={960} h={180} accent />
          <rect x={60} y={1080} width={6} height={180} rx={3} fill={COLORS.accent} />
          <text x={100} y={1155}
            fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.white}>
            The model writes a request
          </text>
          <text x={100} y={1215}
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            Not a chat response — a structured call
          </text>
        </g>

        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={1300} w={960} h={180} />
          <rect x={60} y={1300} width={6} height={180} rx={3}
            fill={COLORS.accent} opacity={0.5} />
          <text x={100} y={1375}
            fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.white}>
            The system executes the call
          </text>
          <text x={100} y={1435}
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            Separation is the core principle
          </text>
        </g>

        {/* ── Corner accents & particles ────────────────────────────────── */}
        {[
          { x: 68, y: 68 }, { x: 1012, y: 68 },
          { x: 68, y: 1740 }, { x: 1012, y: 1740 },
        ].map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3}
            fill={COLORS.accent} opacity={0.3 * shimmer} />
        ))}

        {/* Floating particles */}
        {[
          { x: 130, y: 560 }, { x: 940, y: 680 },
          { x: 120, y: 1580 }, { x: 950, y: 1640 },
          { x: 540, y: 1700 },
        ].map((pt, i) => (
          <circle key={`p${i}`}
            cx={pt.x} cy={pt.y + Math.sin(frame * 0.04 + i * 1.1) * 6}
            r={3} fill={COLORS.accent} opacity={0.1 * shimmer} />
        ))}

        {/* ── CAPTION ──────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s05.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
