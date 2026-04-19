/**
 * Scene 03 — Trajectory Definition
 * "The complete sequence of actions and observations from task start to task end."
 * CSV: 8.380s → 13.060s
 * Duration: 144 frames (4.8s)
 *
 * Theme: Dark (#0D0D0D) + grid + teal accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline spring entrance
 *   Phase 2 (frames 20–80):  Definition card with border-draw, flow diagram path-draw
 *   Phase 3 (frames 70–end): Micro-animations — pulse nodes, shimmer labels
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
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene03_TrajectoryDefinition: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 12);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const defCard = useSpringEntrance(frame, 20);
  const flowCard = useSpringEntrance(frame, 32);

  // Definition card border draw
  const defPerimeter = 2 * (960 + 220);
  const defBorderDash = interpolate(frame, [20, 50], [defPerimeter, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Flow: TASK → OBS → ACT → OBS → ACT → END
  const flowNodes = ['TASK', 'OBS', 'ACT', 'OBS', 'ACT', 'END'];
  const flowNodeEnts = flowNodes.map((_, i) => {
    const f = Math.max(0, frame - 35 - i * 8);
    const s = spring({ frame: f, fps, config: SPRING_SNAP });
    return { scale: s, opacity: interpolate(f, [0, 10], [0, 1], { extrapolateRight: 'clamp' }) };
  });

  // Connector arrows between nodes
  const connectorLen = 90;
  const connectors = flowNodes.slice(0, -1).map((_, i) => {
    return usePathDraw(frame, 40 + i * 8, connectorLen, 20);
  });

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.018;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s03.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="RECAP · TRAJECTORY" y={160} />
        </g>

        {/* ── ZONE B ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Complete
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.accent}>
            Sequence
          </text>
        </g>

        {/* ── ZONE C — Definition card ────────────────────────────────── */}
        <g opacity={defCard.opacity} transform={`translate(0, ${defCard.translateY})`}>
          {/* Animated border */}
          <rect x={60} y={480} width={960} height={220} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={defPerimeter} strokeDashoffset={defBorderDash}
          />
          <rect x={60} y={480} width={960} height={220} rx={20}
            fill={COLORS.bg_secondary} opacity={0.95}
          />
          <rect x={60} y={480} width={6} height={220} rx={3} fill={COLORS.accent} />

          <text x={100} y={550} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            Actions and observations
          </text>
          <text x={100} y={610} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.text_muted}>
            from task start to task end
          </text>
          <text x={100} y={668} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            The full record of agent behavior
          </text>
        </g>

        {/* ── Flow diagram ────────────────────────────────────────────── */}
        <g opacity={flowCard.opacity} transform={`translate(0, ${flowCard.translateY})`}>
          <BentoCard x={60} y={740} w={960} h={400} />

          <text x={100} y={800} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            TRAJECTORY FLOW
          </text>

          {/* Nodes in a 2-row layout */}
          {flowNodes.map((label, i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            const cx = 200 + col * 280;
            const cy = 880 + row * 160;
            const ent = flowNodeEnts[i];
            const isTerminal = i === 0 || i === 5;
            const isObs = label === 'OBS';

            return (
              <g key={i} opacity={ent.opacity}>
                <rect
                  x={cx - 70} y={cy - 35} width={140} height={70} rx={isTerminal ? 35 : 16}
                  fill={isTerminal ? COLORS.accent : COLORS.bg_primary}
                  fillOpacity={isTerminal ? 0.15 : 1}
                  stroke={isObs ? COLORS.accent : isTerminal ? COLORS.accent : COLORS.text_muted}
                  strokeWidth={2}
                  transform={`scale(${ent.scale})`}
                  style={{ transformOrigin: `${cx}px ${cy}px` }}
                />
                <text
                  x={cx} y={cy + 10}
                  textAnchor="middle"
                  fontFamily={FONT} fontSize={32} fontWeight={800}
                  fill={isTerminal ? COLORS.accent : isObs ? COLORS.accent : COLORS.white}
                >
                  {label}
                </text>
              </g>
            );
          })}

          {/* Connector arrows */}
          {connectors.map((dash, i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            const nextCol = (i + 1) % 3;
            const nextRow = Math.floor((i + 1) / 3);
            const x1 = 200 + col * 280 + 70;
            const y1 = 880 + row * 160;
            const x2 = 200 + nextCol * 280 - 70;
            const y2 = 880 + nextRow * 160;

            if (row !== nextRow) {
              // wrap down — draw a curved path
              const midPath = `M ${x1},${y1} C ${x1 + 100},${y1} ${x2 - 100},${y2} ${x2},${y2}`;
              return (
                <path key={i} d={midPath} fill="none" stroke={COLORS.accent} strokeWidth={2}
                  strokeDasharray={300} strokeDashoffset={dash * (300 / connectorLen)}
                  strokeLinecap="round" markerEnd="url(#arrow)" />
              );
            }

            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={COLORS.accent} strokeWidth={2}
                strokeDasharray={connectorLen} strokeDashoffset={dash}
                strokeLinecap="round" markerEnd="url(#arrow)" />
            );
          })}
        </g>

        {/* Floating micro elements */}
        <g transform={`translate(540, ${1320 + breathe})`}>
          <circle cx={0} cy={0} r={36} fill={COLORS.accent} fillOpacity={0.05 * shimmer} />
          <circle cx={0} cy={0} r={36} fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        <circle cx={150} cy={1450 + breathe * 1.4} r={4} fill={COLORS.accent} opacity={0.2 * shimmer} />
        <circle cx={920} cy={1430 + breathe} r={5} fill={COLORS.accent} opacity={0.15 * shimmer} />
        <circle cx={400} cy={1500 + breathe * 0.7} r={3} fill={COLORS.accent} opacity={0.18} />

        {/* Corner accents */}
        <path d="M 60,1740 L 60,1660 M 60,1740 L 140,1740" fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" opacity={0.35} />
        <path d="M 1020,60 L 1020,140 M 1020,60 L 940,60" fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" opacity={0.35} />

        {/* ── CAPTION ─────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s03.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
