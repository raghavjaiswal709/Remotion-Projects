/**
 * Scene 18 — Agent's Hands
 * "Tools are the agent's hands."
 * CSV: 76.960s → 79.020s
 * Duration: 80 frames (2.7s)
 *
 * Theme: Dark (#1D1D1C) + grid + series accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20):   Label + giant "HANDS" headline springs
 *   Phase 2 (frames 14–50):  Central agent node with extending tool arms (5 arms radiating out)
 *   Phase 3 (frames 40–end): Arms pulse length, tool icons breathe, ring orbits
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

// Tool arm data: angle (degrees), label, icon type
const TOOL_ARMS = [
  { angle: -90, label: 'SEARCH', iconType: 'magnify' },
  { angle: -36, label: 'CODE', iconType: 'bracket' },
  { angle: 18, label: 'BROWSE', iconType: 'globe' },
  { angle: 72, label: 'EMAIL', iconType: 'envelope' },
  { angle: 144, label: 'FILE', iconType: 'file' },
];

const CENTER_X = 540;
const CENTER_Y = 940;
const ARM_LENGTH = 280;

export const Scene18_AgentHands: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headEnt1 = useSpringEntrance(frame, 4);
  const headEnt2 = useSpringEntrance(frame, 8);
  const subEnt = useSpringEntrance(frame, 12);

  // ── Phase 2: Agent node + extending arms ───────────────────────────────────
  const agentNode = useSpringEntrance(frame, 14);
  const agentScale = spring({ frame: Math.max(0, frame - 14), fps, config: SPRING_SNAP });

  // Outer ring draw
  const ringCircum = 2 * Math.PI * 52;
  const ringOffset = usePathDraw(frame, 16, ringCircum, 18);

  // Arms extend with stagger
  const armSprings = TOOL_ARMS.map((_, i) => {
    const f = Math.max(0, frame - (18 + i * 6));
    const prog = spring({ frame: f, fps, config: SPRING_CONFIG });
    const op = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
    return { progress: prog, opacity: op };
  });

  // Tool nodes at arm endpoints
  const toolNodeSprings = TOOL_ARMS.map((_, i) => {
    const f = Math.max(0, frame - (26 + i * 6));
    const prog = spring({ frame: f, fps, config: SPRING_SNAP });
    const op = interpolate(f, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
    return { progress: prog, opacity: op };
  });

  // Bottom summary
  const summaryCard = useSpringEntrance(frame, 50);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const orbitAngle = frame * 0.5;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s18.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="TOOLS · METAPHOR" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Headline ───────────────────────────────────────────── */}
        <g transform={`translate(0, ${headEnt1.translateY})`} opacity={headEnt1.opacity}>
          <text x={60} y={310} fontFamily={FONT} fontSize={100} fontWeight={800} fill={COLORS.white}>
            The Agent's
          </text>
        </g>
        <g transform={`translate(0, ${headEnt2.translateY})`} opacity={headEnt2.opacity}>
          <text x={60} y={420} fontFamily={FONT} fontSize={120} fontWeight={800} fill={COLORS.accent}>
            Hands
          </text>
        </g>
        <g transform={`translate(0, ${subEnt.translateY})`} opacity={subEnt.opacity}>
          <text x={60} y={480} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            Tools let the agent reach into the real world
          </text>
        </g>

        {/* ── ZONE C — Central agent with radiating arms ──────────────────── */}

        {/* Ambient glow behind agent */}
        <circle cx={CENTER_X} cy={CENTER_Y} r={160}
          fill={COLORS.accent} fillOpacity={0.03 * shimmer} />
        <circle cx={CENTER_X} cy={CENTER_Y} r={320}
          fill={COLORS.accent} fillOpacity={0.01 * shimmer} />

        {/* Orbiting decorative ring */}
        <circle cx={CENTER_X} cy={CENTER_Y} r={320}
          fill="none" stroke={COLORS.accent} strokeWidth={1}
          opacity={agentNode.opacity * 0.08}
          strokeDasharray="8 12"
          transform={`rotate(${orbitAngle}, ${CENTER_X}, ${CENTER_Y})`} />

        {/* Arms — lines from center to tool nodes */}
        {TOOL_ARMS.map((arm, i) => {
          const rad = (arm.angle * Math.PI) / 180;
          const endX = CENTER_X + Math.cos(rad) * ARM_LENGTH * armSprings[i].progress;
          const endY = CENTER_Y + Math.sin(rad) * ARM_LENGTH * armSprings[i].progress;
          const armLen = ARM_LENGTH * armSprings[i].progress;

          return (
            <g key={i} opacity={armSprings[i].opacity}>
              {/* Arm line */}
              <line x1={CENTER_X} y1={CENTER_Y} x2={endX} y2={endY}
                stroke={COLORS.accent} strokeWidth={2.5}
                strokeLinecap="round" opacity={0.5} />
              {/* Pulsing dot at midpoint */}
              <circle
                cx={CENTER_X + Math.cos(rad) * armLen * 0.5}
                cy={CENTER_Y + Math.sin(rad) * armLen * 0.5}
                r={3 * pulse}
                fill={COLORS.accent} opacity={0.25} />
            </g>
          );
        })}

        {/* Tool nodes at arm endpoints */}
        {TOOL_ARMS.map((arm, i) => {
          const rad = (arm.angle * Math.PI) / 180;
          const nodeX = CENTER_X + Math.cos(rad) * ARM_LENGTH;
          const nodeY = CENTER_Y + Math.sin(rad) * ARM_LENGTH;
          const nodeScale = toolNodeSprings[i].progress;
          const nodeOp = toolNodeSprings[i].opacity;
          const nodeBreath = Math.sin(frame * 0.06 + i * 1.2) * 2;

          return (
            <g key={`node-${i}`} opacity={nodeOp}
              transform={`translate(${nodeX}, ${nodeY + nodeBreath})`}>
              {/* Node background */}
              <circle cx={0} cy={0} r={44 * nodeScale}
                fill={COLORS.bg_secondary} stroke={COLORS.accent}
                strokeWidth={2} />
              {/* Inner glow */}
              <circle cx={0} cy={0} r={30 * nodeScale}
                fill={COLORS.accent} fillOpacity={0.06 * shimmer} />

              {/* Tool icon */}
              {arm.iconType === 'magnify' && (
                <g transform={`scale(${nodeScale})`} style={{ transformOrigin: '0px 0px' }}>
                  <circle cx={-4} cy={-4} r={12} fill="none" stroke={COLORS.accent} strokeWidth={2} />
                  <line x1={5} y1={5} x2={14} y2={14} stroke={COLORS.accent} strokeWidth={2.5}
                    strokeLinecap="round" />
                </g>
              )}
              {arm.iconType === 'bracket' && (
                <g transform={`scale(${nodeScale})`} style={{ transformOrigin: '0px 0px' }}>
                  <text x={0} y={6} textAnchor="middle" fontFamily="'Fira Code', monospace"
                    fontSize={22} fontWeight={800} fill={COLORS.accent}>
                    {'</>'}
                  </text>
                </g>
              )}
              {arm.iconType === 'globe' && (
                <g transform={`scale(${nodeScale})`} style={{ transformOrigin: '0px 0px' }}>
                  <circle cx={0} cy={0} r={12} fill="none" stroke={COLORS.accent} strokeWidth={2} />
                  <ellipse cx={0} cy={0} rx={12} ry={4} fill="none" stroke={COLORS.accent} strokeWidth={1} opacity={0.5} />
                  <ellipse cx={0} cy={0} rx={5} ry={12} fill="none" stroke={COLORS.accent} strokeWidth={1} opacity={0.5} />
                </g>
              )}
              {arm.iconType === 'envelope' && (
                <g transform={`scale(${nodeScale})`} style={{ transformOrigin: '0px 0px' }}>
                  <rect x={-14} y={-8} width={28} height={18} rx={3}
                    fill="none" stroke={COLORS.accent} strokeWidth={2} />
                  <polyline points="-14,-8 0,4 14,-8"
                    fill="none" stroke={COLORS.accent} strokeWidth={1.5} />
                </g>
              )}
              {arm.iconType === 'file' && (
                <g transform={`scale(${nodeScale})`} style={{ transformOrigin: '0px 0px' }}>
                  <path d="M -8,-12 L 4,-12 L 10,-6 L 10,12 L -8,12 Z"
                    fill="none" stroke={COLORS.accent} strokeWidth={2} />
                  <polyline points="4,-12 4,-6 10,-6"
                    fill="none" stroke={COLORS.accent} strokeWidth={1.5} />
                </g>
              )}

              {/* Label below node */}
              <text x={0} y={64} textAnchor="middle"
                fontFamily={FONT} fontSize={22} fontWeight={800}
                fill={COLORS.text_muted} opacity={0.7}>
                {arm.label}
              </text>
            </g>
          );
        })}

        {/* Central AGENT node (drawn last to be on top) */}
        <g opacity={agentNode.opacity} transform={`translate(${CENTER_X}, ${CENTER_Y})`}>
          {/* Outer ring */}
          <circle cx={0} cy={0} r={52}
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={ringCircum} strokeDashoffset={ringOffset} />
          {/* Filled core */}
          <circle cx={0} cy={0} r={44}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={1.5} />
          <circle cx={0} cy={0} r={36}
            fill={COLORS.accent} fillOpacity={0.08 * shimmer} />

          {/* Robot/Agent icon */}
          <rect x={-16} y={-16} width={32} height={24} rx={6}
            fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
          {/* Eyes */}
          <circle cx={-6} cy={-6} r={3} fill={COLORS.accent} />
          <circle cx={6} cy={-6} r={3} fill={COLORS.accent} />
          {/* Antenna */}
          <line x1={0} y1={-16} x2={0} y2={-24}
            stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={0} cy={-26} r={3} fill={COLORS.accent} />
          {/* Body base */}
          <rect x={-12} y={10} width={24} height={8} rx={4}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5} opacity={0.5} />

          {/* AGENT label below */}
          <text x={0} y={76} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            AGENT
          </text>
        </g>

        {/* ── Summary card ────────────────────────────────────────────────── */}
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <BentoCard x={60} y={1340} w={960} h={140} accent />
          {/* Hand icon */}
          <g transform="translate(110, 1410)">
            <path d="M -16,10 L -16,-6 A 6,6 0 0 1 -4,-6 L -4,10"
              fill="none" stroke={COLORS.accent} strokeWidth={2} />
            <path d="M -4,-10 A 5,5 0 0 1 6,-10 L 6,6"
              fill="none" stroke={COLORS.accent} strokeWidth={2} />
            <path d="M 6,-8 A 5,5 0 0 1 16,-8 L 16,6"
              fill="none" stroke={COLORS.accent} strokeWidth={2} />
            <rect x={-18} y={8} width={36} height={14} rx={4}
              fill="none" stroke={COLORS.accent} strokeWidth={1.5} />
          </g>

          <text x={160} y={1396} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Tools =
          </text>
          <text x={355} y={1396} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}>
            Agent's Hands
          </text>
          <text x={160} y={1444} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            Bridge between language model output and real-world effects
          </text>
        </g>

        {/* ── Bottom stat cards ───────────────────────────────────────────── */}
        <g opacity={summaryCard.opacity * 0.8}>
          <BentoCard x={60} y={1520} w={300} h={100} />
          <text x={100} y={1576} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            5
          </text>
          <text x={140} y={1576} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Tool types
          </text>
        </g>

        <g opacity={summaryCard.opacity * 0.8}>
          <BentoCard x={380} y={1520} w={300} h={100} />
          <text x={420} y={1576} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Unlimited
          </text>
          <text x={420} y={1605} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            reach
          </text>
        </g>

        <g opacity={summaryCard.opacity * 0.8}>
          <BentoCard x={700} y={1520} w={320} h={100} accent />
          <text x={740} y={1576} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            Real world
          </text>
          <text x={740} y={1605} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            effects
          </text>
        </g>

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s18.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
