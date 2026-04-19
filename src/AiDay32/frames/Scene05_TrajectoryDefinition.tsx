/**
 * Scene 05 — Trajectory Definition
 * "A trajectory is the complete sequence of everything that happened during a task,"
 * CSV: 15.340s → 20.240s
 * Duration: 147 frames (4.90s)
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline spring
 *   Phase 2 (20–90): Timeline with 6 event nodes, path-draw connectors
 *   Phase 3 (80–end): Pulse, float, shimmer on nodes
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

const TIMELINE_EVENTS = [
  { label: 'GOAL', desc: 'User request', icon: 'G', y: 560 },
  { label: 'STATE', desc: 'Current context', icon: 'S', y: 740 },
  { label: 'ACTION', desc: 'Agent decides', icon: 'A', y: 920 },
  { label: 'RESULT', desc: 'External reply', icon: 'R', y: 1100 },
  { label: 'STATE', desc: 'Updated context', icon: 'S', y: 1280 },
  { label: 'OUTPUT', desc: 'Final answer', icon: 'O', y: 1460 },
];

export const Scene05_TrajectoryDefinition: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 5);
  const headlineB = useSpringEntrance(frame, 10);

  // ── Phase 2 ──
  // Timeline spine
  const spineLen = 920;
  const spineDash = usePathDraw(frame, 18, spineLen, 40);

  // Event node springs
  const eventSprings = TIMELINE_EVENTS.map((_, i) =>
    useSpringEntrance(frame, 22 + i * 10)
  );

  // Right-side definition card
  const defCard = useSpringEntrance(frame, 35);
  const defBorderPerim = 2 * (440 + 800);
  const defBorderDash = usePathDraw(frame, 38, defBorderPerim, 30);

  // Connector lines from timeline to card
  const connectorLen = 80;
  const connectorDashes = TIMELINE_EVENTS.map((_, i) =>
    usePathDraw(frame, 30 + i * 10, connectorLen, 15)
  );

  // ── Phase 3 ──
  const breathe = Math.sin(frame * 0.055) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.018;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Traveling highlight
  const highlightProgress = interpolate(frame, [50, 130], [0, 5], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const highlightIdx = Math.floor(highlightProgress);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s05.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="MODULE 5 · TRAJECTORY" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B ── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Complete Sequence
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={390} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent}>
            Everything that happened
          </text>
          <text x={60} y={450} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.text_muted}>
            during a task
          </text>
        </g>

        {/* ── ZONE C — Vertical timeline ── */}
        {/* Timeline spine */}
        <line
          x1={200} y1={560} x2={200} y2={1480}
          stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={spineLen} strokeDashoffset={spineDash}
          strokeLinecap="round"
        />
        {/* Background spine */}
        <line x1={200} y1={560} x2={200} y2={1480}
          stroke="rgba(255,255,255,0.05)" strokeWidth={3} />

        {/* Event nodes */}
        {TIMELINE_EVENTS.map((event, i) => {
          const es = eventSprings[i];
          const isHighlighted = i <= highlightIdx;
          const isActive = i === highlightIdx;
          const nodeFloat = Math.sin(frame * 0.04 + i * 0.9) * 2;
          const isAction = event.icon === 'A';
          return (
            <g key={i} opacity={es.opacity} transform={`translate(0, ${es.translateY + nodeFloat})`}>
              {/* Node circle */}
              <circle cx={200} cy={event.y} r={isAction ? 22 : 16}
                fill={isHighlighted ? COLORS.accent : COLORS.bg_secondary}
                stroke={COLORS.accent} strokeWidth={isAction ? 3 : 2}
                opacity={isHighlighted ? 1 : 0.5} />
              {/* Active ring */}
              {isActive && (
                <circle cx={200} cy={event.y} r={30}
                  fill="none" stroke={COLORS.accent} strokeWidth={1.5}
                  opacity={0.4 * shimmer}
                  transform={`scale(${pulse})`}
                  style={{ transformOrigin: `200px ${event.y}px` }} />
              )}
              {/* Icon letter */}
              <text x={200} y={event.y + 6} textAnchor="middle"
                fontFamily={FONT} fontSize={isAction ? 20 : 16} fontWeight={800}
                fill={isHighlighted ? COLORS.bg_primary : COLORS.accent}>
                {event.icon}
              </text>

              {/* Label — right of node */}
              <text x={240} y={event.y - 8} fontFamily={FONT} fontSize={32} fontWeight={800}
                fill={isHighlighted ? COLORS.white : COLORS.text_muted}>
                {event.label}
              </text>
              <text x={240} y={event.y + 24} fontFamily={FONT} fontSize={26} fontWeight={800}
                fill={COLORS.text_muted} opacity={0.6}>
                {event.desc}
              </text>

              {/* Horizontal connector to right card area */}
              <line
                x1={440} y1={event.y} x2={440 + connectorLen} y2={event.y}
                stroke={COLORS.accent} strokeWidth={1}
                strokeDasharray={connectorLen} strokeDashoffset={connectorDashes[i]}
                opacity={0.2}
              />
            </g>
          );
        })}

        {/* Right-side definition card */}
        <g opacity={defCard.opacity} transform={`translate(0, ${defCard.translateY})`}>
          <BentoCard x={560} y={560} w={440} h={800} accent />
          <rect x={560} y={560} width={440} height={800} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={defBorderPerim} strokeDashoffset={defBorderDash} />

          {/* Card title */}
          <text x={600} y={630} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            TRAJECTORY
          </text>
          <line x1={600} y1={650} x2={960} y2={650}
            stroke="rgba(255,255,255,0.1)" strokeWidth={1} />

          {/* Definition text */}
          <text x={600} y={700} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            The ordered record
          </text>
          <text x={600} y={745} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            of every state,
          </text>
          <text x={600} y={790} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            action, and
          </text>
          <text x={600} y={835} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            observation
          </text>
          <text x={600} y={880} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            that occurred.
          </text>

          {/* Mini sequence diagram inside card */}
          <rect x={600} y={920} width={360} height={120} rx={12}
            fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
          {['s₀', 'a₁', 'o₁', 's₁', 'a₂', 'o₂'].map((sym, i) => {
            const sx = 625 + i * 55;
            const isA = sym.startsWith('a');
            return (
              <g key={i}>
                <circle cx={sx} cy={980} r={14}
                  fill={isA ? COLORS.accent : COLORS.bg_secondary}
                  stroke={COLORS.accent} strokeWidth={1.5} />
                <text x={sx} y={985} textAnchor="middle"
                  fontFamily={FONT} fontSize={16} fontWeight={800}
                  fill={isA ? COLORS.bg_primary : COLORS.accent}>
                  {sym}
                </text>
                {i < 5 && (
                  <line x1={sx + 14} y1={980} x2={sx + 41} y2={980}
                    stroke={COLORS.accent} strokeWidth={1} opacity={0.3} />
                )}
              </g>
            );
          })}

          {/* Key insight */}
          <text x={600} y={1100} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Not just the final output —
          </text>
          <text x={600} y={1140} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.white}>
            everything in between.
          </text>

          {/* Bottom accent bar */}
          <rect x={600} y={1180} width={360} height={4} rx={2}
            fill={COLORS.accent} opacity={0.3 * shimmer} />
        </g>

        {/* Floating particles */}
        {[
          { x: 100, y: 1600 },
          { x: 300, y: 1640 },
          { x: 500, y: 1620 },
          { x: 700, y: 1650 },
          { x: 900, y: 1610 },
        ].map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y + breathe * (i % 2 === 0 ? 1 : -1)}
            r={3} fill={COLORS.accent} opacity={0.08 * shimmer} />
        ))}

        {/* ── CAPTION ── */}
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
