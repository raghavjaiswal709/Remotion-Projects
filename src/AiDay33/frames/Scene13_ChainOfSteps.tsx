/**
 * Scene 13 — Chain of Steps
 * "The entire trajectory is a chain of steps."
 * CSV: 39.520s → 42.660s
 * Duration: 94 frames (3.1s)
 *
 * Theme: Dark (#0D0D0D) + grid + teal accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20): Label + headline
 *   Phase 2 (frames 14–70): Chain links drawn as connected circles with path-draw
 *   Phase 3 (frames 60–end): Chain sways gently
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

const CHAIN_NODES = 8;
const NODE_R = 36;
const CHAIN_START_X = 120;
const CHAIN_END_X = 960;
const CHAIN_Y = 800;
const LINK_GAP = (CHAIN_END_X - CHAIN_START_X) / (CHAIN_NODES - 1);

export const Scene13_ChainOfSteps: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // Phase 1
  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 12);

  // Phase 2 — chain nodes + links
  const nodes = Array.from({ length: CHAIN_NODES }, (_, i) => {
    const delay = 18 + i * 5;
    const ent = useSpringEntrance(frame, delay);
    const cx = CHAIN_START_X + i * LINK_GAP;
    return { cx, ent, num: i + 1 };
  });

  const links = Array.from({ length: CHAIN_NODES - 1 }, (_, i) => {
    const x1 = CHAIN_START_X + i * LINK_GAP + NODE_R;
    const x2 = CHAIN_START_X + (i + 1) * LINK_GAP - NODE_R;
    const linkLen = x2 - x1;
    const dash = usePathDraw(frame, 22 + i * 5, linkLen, 14);
    return { x1, x2, dash, linkLen };
  });

  // "TRAJECTORY" label card
  const trajCard = useSpringEntrance(frame, 50);

  // Phase 3
  const sway = Math.sin(frame * 0.04) * 3;
  const breathe = Math.sin(frame * 0.06) * 2;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s13.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="TRAJECTORY · STRUCTURE" y={160} />
        </g>

        {/* ZONE B */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            A Chain of Steps
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={390} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent}>
            The entire trajectory
          </text>
        </g>

        {/* ZONE C — Chain visualization */}
        <g transform={`translate(0, ${sway})`}>
          {/* Background track */}
          <BentoCard x={60} y={CHAIN_Y - 120} w={960} h={240} />

          {/* Links (lines between nodes) */}
          {links.map((l, i) => (
            <line key={i}
              x1={l.x1} y1={CHAIN_Y}
              x2={l.x2} y2={CHAIN_Y}
              stroke={COLORS.accent} strokeWidth={3}
              strokeDasharray={l.linkLen} strokeDashoffset={l.dash}
              strokeLinecap="round"
            />
          ))}

          {/* Nodes */}
          {nodes.map(n => (
            <g key={n.num} opacity={n.ent.opacity} transform={`translate(0, ${n.ent.translateY * 0.5})`}>
              <circle cx={n.cx} cy={CHAIN_Y} r={NODE_R}
                fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2.5} />
              <text x={n.cx} y={CHAIN_Y + 12} textAnchor="middle"
                fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
                {n.num}
              </text>
            </g>
          ))}
        </g>

        {/* Labels for first and last */}
        <text x={CHAIN_START_X} y={CHAIN_Y + 80} textAnchor="middle"
          fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}
          opacity={nodes[0].ent.opacity}>
          START
        </text>
        <text x={CHAIN_END_X} y={CHAIN_Y + 80} textAnchor="middle"
          fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}
          opacity={nodes[CHAIN_NODES - 1].ent.opacity}>
          END
        </text>

        {/* Trajectory card */}
        <g opacity={trajCard.opacity} transform={`translate(0, ${trajCard.translateY})`}>
          <BentoCard x={60} y={1000} w={960} h={260} accent />
          <rect x={60} y={1000} width={6} height={260} rx={3} fill={COLORS.accent} />
          <text x={100} y={1070} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent} letterSpacing="0.1em">
            TRAJECTORY
          </text>
          <text x={100} y={1130} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            = Step 1 + Step 2 + ... + Step N
          </text>
          <text x={100} y={1200} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            Linked sequence of atomic actions
          </text>
        </g>

        {/* Small chain icon bottom */}
        <g opacity={trajCard.opacity * 0.5} transform={`translate(0, ${breathe})`}>
          {[0, 1, 2].map(i => (
            <g key={i}>
              <circle cx={440 + i * 100} cy={1400} r={16} fill="none" stroke={COLORS.accent} strokeWidth={2} opacity={0.4} />
              {i < 2 && <line x1={456 + i * 100} y1={1400} x2={524 + i * 100} y2={1400} stroke={COLORS.accent} strokeWidth={1.5} opacity={0.3} />}
            </g>
          ))}
        </g>

        {/* Corner accents */}
        <path d="M 60,60 L 60,140 M 60,60 L 140,60" fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" opacity={0.3} />
        <path d="M 1020,1740 L 1020,1660 M 1020,1740 L 940,1740" fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" opacity={0.3} />

        {/* CAPTION */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s13.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
