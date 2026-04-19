/**
 * Scene 05 — Step Iteration
 * "A step is one complete iteration of the agent loop."
 * CSV: 15.830s → 19.450s
 * Duration: 115 frames (3.8s)
 *
 * Theme: Dark (#0D0D0D) + grid + teal accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline spring in
 *   Phase 2 (frames 20–80):  Agent loop diagram — circular path-draw with nodes
 *   Phase 3 (frames 70–end): Loop rotation micro-animation, pulse on nodes
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

export const Scene05_StepIteration: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 12);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const loopCard = useSpringEntrance(frame, 20);
  const defCard = useSpringEntrance(frame, 34);

  // Circular loop path draw
  const loopRadius = 180;
  const loopCircumference = 2 * Math.PI * loopRadius;
  const loopDash = usePathDraw(frame, 25, loopCircumference, 40);

  // Node entrances on the loop (3 nodes: OBSERVE, THINK, ACT)
  const loopNodes = ['OBSERVE', 'THINK', 'ACT'];
  const nodeAngles = [-90, 30, 150]; // degrees
  const nodeEnts = loopNodes.map((_, i) => {
    const f = Math.max(0, frame - 35 - i * 8);
    const s = spring({ frame: f, fps, config: SPRING_SNAP });
    return { scale: s, opacity: interpolate(f, [0, 10], [0, 1], { extrapolateRight: 'clamp' }) };
  });

  // Arrow indicators between nodes
  const arrowEnts = loopNodes.map((_, i) => {
    return usePathDraw(frame, 42 + i * 8, 60, 18);
  });

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.85, 1]);
  const loopSpin = frame > 70 ? Math.sin((frame - 70) * 0.02) * 3 : 0;

  // Highlight "one iteration" indicator
  const highlightOpacity = frame > 60 ? interpolate(Math.sin((frame - 60) * 0.1), [-1, 1], [0.3, 0.8]) : 0;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s05.from);

  const cx = 540;
  const cy = 850;

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="THE STEP · DEFINITION" y={160} />
        </g>

        {/* ── ZONE B ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            One Complete
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            Iteration
          </text>
        </g>

        {/* ── ZONE C — Agent loop diagram ─────────────────────────────── */}
        <g opacity={loopCard.opacity} transform={`translate(0, ${loopCard.translateY})`}>
          <BentoCard x={60} y={480} w={960} h={760} accent />

          {/* Loop label */}
          <text x={100} y={540} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            AGENT LOOP
          </text>

          {/* Circular loop path */}
          <g transform={`rotate(${loopSpin}, ${cx}, ${cy})`}>
            <circle
              cx={cx} cy={cy} r={loopRadius}
              fill="none" stroke={COLORS.accent} strokeWidth={3}
              strokeDasharray={loopCircumference} strokeDashoffset={loopDash}
              strokeLinecap="round"
            />
            {/* Inner glow circle */}
            <circle cx={cx} cy={cy} r={loopRadius}
              fill={COLORS.accent} fillOpacity={0.03 * shimmer}
            />
          </g>

          {/* Nodes on the loop */}
          {loopNodes.map((label, i) => {
            const angle = (nodeAngles[i] * Math.PI) / 180;
            const nx = cx + Math.cos(angle) * loopRadius;
            const ny = cy + Math.sin(angle) * loopRadius;
            const ent = nodeEnts[i];
            const isObserve = label === 'OBSERVE';

            return (
              <g key={i} opacity={ent.opacity}>
                {/* Node background circle */}
                <circle
                  cx={nx} cy={ny}
                  r={44 * ent.scale}
                  fill={COLORS.bg_primary}
                  stroke={isObserve ? COLORS.accent : COLORS.text_muted}
                  strokeWidth={2.5}
                />
                <circle
                  cx={nx} cy={ny}
                  r={44 * ent.scale}
                  fill={isObserve ? COLORS.accent : COLORS.bg_secondary}
                  fillOpacity={isObserve ? 0.15 : 0.8}
                />
                {/* Node label */}
                <text
                  x={nx} y={ny + 8}
                  textAnchor="middle"
                  fontFamily={FONT} fontSize={24} fontWeight={800}
                  fill={isObserve ? COLORS.accent : COLORS.white}
                >
                  {label}
                </text>
              </g>
            );
          })}

          {/* "1 STEP" center label */}
          <text
            x={cx} y={cy - 10}
            textAnchor="middle"
            fontFamily={FONT} fontSize={56} fontWeight={800}
            fill={COLORS.accent} opacity={pulse}
          >
            1
          </text>
          <text
            x={cx} y={cy + 30}
            textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}
          >
            STEP
          </text>

          {/* One-iteration highlight arc */}
          <circle
            cx={cx} cy={cy} r={loopRadius + 20}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            strokeDasharray={`${loopCircumference * 0.95} ${loopCircumference * 0.05}`}
            opacity={highlightOpacity}
            strokeLinecap="round"
          />

          {/* Curved arrows between nodes */}
          {arrowEnts.map((dash, i) => {
            const startAngle = (nodeAngles[i] * Math.PI) / 180;
            const endAngle = (nodeAngles[(i + 1) % 3] * Math.PI) / 180;
            const midAngle = (startAngle + endAngle) / 2;
            const sx = cx + Math.cos(startAngle) * (loopRadius + 50);
            const sy = cy + Math.sin(startAngle) * (loopRadius + 50);
            const ex = cx + Math.cos(endAngle) * (loopRadius + 50);
            const ey = cy + Math.sin(endAngle) * (loopRadius + 50);
            const mx = cx + Math.cos(midAngle) * (loopRadius + 85);
            const my = cy + Math.sin(midAngle) * (loopRadius + 85);

            return (
              <path key={i}
                d={`M ${sx},${sy} Q ${mx},${my} ${ex},${ey}`}
                fill="none" stroke={COLORS.accent} strokeWidth={1.5}
                strokeDasharray={120} strokeDashoffset={dash * 2}
                strokeLinecap="round" opacity={0.5}
                markerEnd="url(#arrow)"
              />
            );
          })}
        </g>

        {/* Definition summary card */}
        <g opacity={defCard.opacity} transform={`translate(0, ${defCard.translateY})`}>
          <BentoCard x={60} y={1280} w={960} h={140} />
          <rect x={60} y={1280} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={100} y={1340} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            One observation in, one action out
          </text>
          <text x={100} y={1390} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            = one complete iteration
          </text>
        </g>

        {/* Floating micro elements */}
        <circle cx={180} cy={1550 + breathe * 1.2} r={5} fill={COLORS.accent} opacity={0.2 * shimmer} />
        <circle cx={870} cy={1510 + breathe} r={4} fill={COLORS.accent} opacity={0.15 * shimmer} />
        <circle cx={400} cy={1580 + breathe * 0.8} r={3} fill={COLORS.accent} opacity={0.18} />

        {/* Corner accents */}
        <path d="M 60,60 L 60,140 M 60,60 L 140,60" fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" opacity={0.35} />
        <path d="M 1020,1740 L 1020,1660 M 1020,1740 L 940,1740" fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" opacity={0.35} />

        {/* ── CAPTION ─────────────────────────────────────────────────── */}
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
