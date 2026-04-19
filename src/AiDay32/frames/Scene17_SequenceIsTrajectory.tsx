/**
 * Scene 17 — That Sequence Is The Trajectory
 * "That sequence is the trajectory."
 * CSV: 42.500s → 44.500s
 * Duration: 60 frames (2.0s)
 *
 * Animation phases:
 *   Phase 1 (0–12): Label + headline reveal
 *   Phase 2 (8–40): Full trajectory chain path-draw + definition card
 *   Phase 3 (30–end): Pulse, shimmer
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

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
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

export const Scene17_SequenceIsTrajectory: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelIn = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 3);
  const h2 = useSpringEntrance(frame, 8);

  // Large trajectory arc
  const arcLen = 900;
  const arcDash = usePathDraw(frame, 10, arcLen, 25);

  // Trajectory nodes
  const nodes = ['s₀', 'a₁', 'o₁', 's₁', 'a₂', 'o₂', 's₂', 'a₃', 'o₃'];
  const nodeEntrances = nodes.map((_, i) => useSpringEntrance(frame, 12 + i * 2));

  const defCard = useSpringEntrance(frame, 30);
  const formulaCard = useSpringEntrance(frame, 36);
  const summaryCard = useSpringEntrance(frame, 42);

  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const breathe = Math.sin(frame * 0.06) * 4;

  // Traveling highlight
  const highlightPos = interpolate(frame, [15, 45], [0, 8], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const activeNode = Math.floor(highlightPos);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s17.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g transform={`translate(0, ${labelIn.translateY})`} opacity={labelIn.opacity}>
          <SectionLabel text="TRAJECTORY · DEFINITION" y={160} opacity={0.8} />
        </g>

        {/* ZONE B */}
        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            That Sequence
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            is the Trajectory
          </text>
        </g>

        {/* Large arc connecting all nodes */}
        <path d="M 100,700 C 100,500 980,500 980,700"
          fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={arcLen} strokeDashoffset={arcDash}
          strokeLinecap="round" opacity={0.3} />

        {/* Trajectory nodes — horizontal band */}
        {nodes.map((label, i) => {
          const x = 100 + i * 110;
          const y = 700;
          const isActive = i === activeNode;
          return (
            <g key={i} opacity={nodeEntrances[i].opacity}
              transform={`translate(0, ${nodeEntrances[i].translateY})`}>
              <circle cx={x} cy={y} r={isActive ? 30 : 24}
                fill={isActive ? COLORS.accent : COLORS.bg_secondary}
                fillOpacity={isActive ? 0.2 : 1}
                stroke={isActive ? COLORS.accent : 'rgba(255,255,255,0.12)'}
                strokeWidth={isActive ? 2.5 : 1.5} />
              <text x={x} y={y + 6} textAnchor="middle"
                fontFamily={FONT} fontSize={isActive ? 18 : 14} fontWeight={800}
                fill={isActive ? COLORS.accent : COLORS.text_muted}>
                {label}
              </text>
              {/* Connector */}
              {i < 8 && (
                <line x1={x + 26} y1={y} x2={x + 84} y2={y}
                  stroke={COLORS.accent} strokeWidth={1} opacity={0.15}
                  strokeDasharray="4,3" />
              )}
            </g>
          );
        })}

        {/* Bracket below */}
        <path d="M 100,760 L 100,780 L 980,780 L 980,760"
          fill="none" stroke={COLORS.accent} strokeWidth={2} opacity={h2.opacity * 0.4} />
        <text x={540} y={820} textAnchor="middle"
          fontFamily={FONT} fontSize={28} fontWeight={800}
          fill={COLORS.accent} opacity={h2.opacity * 0.7} fontStyle="italic">
          τ = (s₀, a₁, o₁, s₁, a₂, o₂, s₂, a₃, o₃)
        </text>

        {/* Definition card */}
        <g opacity={defCard.opacity} transform={`translate(0, ${defCard.translateY})`}>
          <BentoCard x={60} y={880} w={960} h={200} accent />
          <rect x={60} y={880} width={6} height={200} rx={3} fill={COLORS.accent} />
          <text x={100} y={940} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            DEFINITION
          </text>
          <text x={100} y={1000} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            A trajectory is the full ordered sequence
          </text>
          <text x={100} y={1050} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            of states, actions, and observations.
          </text>
        </g>

        {/* Formula card */}
        <g opacity={formulaCard.opacity} transform={`translate(0, ${formulaCard.translateY})`}>
          <BentoCard x={60} y={1120} w={960} h={160} />
          <text x={540} y={1216} textAnchor="middle"
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={36} fontWeight={500} fill={COLORS.accent}>
            τ = (s₀, a₁, o₁, ..., sₙ, aₙ, oₙ)
          </text>
        </g>

        {/* Summary card */}
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <BentoCard x={60} y={1340} w={460} h={280} />
          <text x={100} y={1400} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            NOT JUST
          </text>
          <text x={100} y={1450} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            The final
          </text>
          <text x={100} y={1500} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            answer
          </text>
          {/* X mark */}
          <line x1={380} y1={1440} x2={420} y2={1480}
            stroke={COLORS.vibrant_red} strokeWidth={3} strokeLinecap="round" />
          <line x1={420} y1={1440} x2={380} y2={1480}
            stroke={COLORS.vibrant_red} strokeWidth={3} strokeLinecap="round" />
        </g>

        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <BentoCard x={560} y={1340} w={460} h={280} accent />
          <text x={600} y={1400} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            BUT THE
          </text>
          <text x={600} y={1450} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            Entire
          </text>
          <text x={600} y={1500} fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            journey
          </text>
          {/* Checkmark */}
          <path d="M 940,1440 L 955,1460 L 980,1430"
            fill="none" stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" />
        </g>

        {/* Floating accents */}
        {[80, 540, 1000].map((x, i) => (
          <circle key={i} cx={x} cy={1700 + Math.sin(frame * 0.05 + i) * 3}
            r={4} fill={COLORS.accent} opacity={0.06 * shimmer} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s17.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
