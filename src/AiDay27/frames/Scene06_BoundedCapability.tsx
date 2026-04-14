/**
 * Scene 06 — Bounded Capability
 * "Each of these is a tool, a precise bounded capability the agent can choose to use."
 * CSV: 19.600s → 25.820s
 * Duration: 205 frames (6.8s)
 *
 * Theme: Dark (#1D1D1C) + grid + series accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):  Headline and label spring entrance
 *   Phase 2 (frames 20–100): Central bounded-capability diagram builds,
 *           tool nodes animate in staggered, boundary ring draws
 *   Phase 3 (frames 90–end): Orbital rotation, ring pulse, accent shimmer
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

function useCounter(frame: number, startFrame: number, endValue: number, durationFrames = 45) {
  const raw = interpolate(frame, [startFrame, startFrame + durationFrames], [0, endValue], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(raw);
}

// ── Tool node data ────────────────────────────────────────────────────────────
const TOOL_NODES = [
  { label: 'Search', angle: 0 },
  { label: 'Read', angle: 72 },
  { label: 'Email', angle: 144 },
  { label: 'SQL', angle: 216 },
  { label: 'Code', angle: 288 },
];

export const Scene06_BoundedCapability: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headWord1 = useSpringEntrance(frame, 6);
  const headWord2 = useSpringEntrance(frame, 14);
  const headWord3 = useSpringEntrance(frame, 22);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  // Center agent node
  const centerNode = useSpringEntrance(frame, 30);

  // Outer boundary ring draw
  const RING_CIRCUMFERENCE = Math.ceil(2 * Math.PI * 280);
  const ringDash = usePathDraw(frame, 36, RING_CIRCUMFERENCE, 40);

  // Tool node staggered entrances
  const toolSprings = TOOL_NODES.map((_, i) => useSpringEntrance(frame, 42 + i * 10));

  // Connector lines from center to each tool
  const connLen = 160;
  const connDashes = TOOL_NODES.map((_, i) => usePathDraw(frame, 48 + i * 10, connLen, 20));

  // Bottom explanation cards
  const card1 = useSpringEntrance(frame, 82);
  const card2 = useSpringEntrance(frame, 94);

  // Counter: number of tools available
  const toolCount = useCounter(frame, 60, 5, 30);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.012;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const orbitAngle = frame * 0.3; // slow orbit rotation

  // Center of diagram
  const CX = 540;
  const CY = 880;
  const ORBIT_R = 260;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s06.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="MODULE 3 · KEY CONCEPT" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Per-word headline ──────────────────────────────────── */}
        <g transform={`translate(0, ${headWord1.translateY})`} opacity={headWord1.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.white}>
            Bounded
          </text>
        </g>
        <g transform={`translate(0, ${headWord2.translateY})`} opacity={headWord2.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.accent}>
            Capability
          </text>
        </g>
        <g transform={`translate(0, ${headWord3.translateY})`} opacity={headWord3.opacity}>
          <text x={60} y={470} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.text_muted}>
            Each tool does one precise thing
          </text>
        </g>

        {/* ── ZONE C — Orbital diagram ────────────────────────────────────── */}

        {/* Outer boundary ring (the "bounded" concept) */}
        <circle cx={CX} cy={CY} r={ORBIT_R + 40}
          fill="none" stroke={COLORS.accent} strokeWidth={1.5}
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={ringDash}
          opacity={0.3} />

        {/* Secondary inner ring */}
        <circle cx={CX} cy={CY} r={ORBIT_R + 20}
          fill="none" stroke={COLORS.accent} strokeWidth={1}
          strokeDasharray="8 12"
          opacity={0.15 * shimmer} />

        {/* Boundary fill */}
        <circle cx={CX} cy={CY} r={ORBIT_R + 40}
          fill={COLORS.accent} fillOpacity={centerNode.opacity * 0.03}
          stroke="none" />

        {/* Center AGENT node */}
        <g opacity={centerNode.opacity} transform={`translate(${CX}, ${CY + centerNode.translateY})`}>
          {/* Pulse ring */}
          <circle cx={0} cy={0} r={58}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            opacity={0.3 * pulse}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} />
          {/* Main circle */}
          <circle cx={0} cy={0} r={52}
            fill={COLORS.accent} fillOpacity={0.12} />
          <circle cx={0} cy={0} r={52}
            fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
          <text textAnchor="middle" y={6}
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            AGENT
          </text>
        </g>

        {/* Tool nodes around the orbit */}
        {TOOL_NODES.map((tool, i) => {
          const angle = ((tool.angle + orbitAngle) * Math.PI) / 180;
          const tx = CX + Math.cos(angle) * ORBIT_R;
          const ty = CY + Math.sin(angle) * ORBIT_R + breathe * (i % 2 === 0 ? 1 : -1);
          const ts = toolSprings[i];

          return (
            <g key={tool.label}>
              {/* Connector line from center to tool */}
              <line x1={CX} y1={CY} x2={tx} y2={ty}
                stroke={COLORS.accent} strokeWidth={1.5}
                strokeDasharray={connLen}
                strokeDashoffset={connDashes[i]}
                opacity={ts.opacity * 0.4}
                strokeLinecap="round" />

              {/* Tool node */}
              <g opacity={ts.opacity} transform={`translate(${tx}, ${ty})`}>
                <circle cx={0} cy={0} r={40}
                  fill={COLORS.bg_secondary}
                  stroke={COLORS.accent} strokeWidth={2} />
                {/* Inner glow */}
                <circle cx={0} cy={0} r={28}
                  fill={COLORS.accent} fillOpacity={0.08 * shimmer} />
                <text textAnchor="middle" y={6}
                  fontFamily={FONT} fontSize={24} fontWeight={800}
                  fill={COLORS.white}>
                  {tool.label}
                </text>
              </g>
            </g>
          );
        })}

        {/* "BOUNDARY" label on the ring */}
        <g opacity={card1.opacity}>
          <text x={CX + ORBIT_R + 50} y={CY - ORBIT_R - 20}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} opacity={0.6}
            letterSpacing="0.15em">
            BOUNDARY
          </text>
          {/* Arrow pointing to ring */}
          <path d={`M ${CX + ORBIT_R + 60},${CY - ORBIT_R - 10} L ${CX + ORBIT_R + 20},${CY - ORBIT_R + 30}`}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            markerEnd="url(#arrow)" opacity={0.5} />
        </g>

        {/* ── Explanation cards below diagram ──────────────────────────────── */}

        {/* Card 1: Precise */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={1200} w={460} h={260} accent />
          <text x={100} y={1270} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent}>
            Precise
          </text>
          <text x={100} y={1330} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Each tool does exactly
          </text>
          <text x={100} y={1374} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            one thing well
          </text>
          {/* Check mark icon */}
          <g transform={`translate(380, 1280)`}>
            <circle cx={0} cy={0} r={24} fill={COLORS.accent} fillOpacity={0.12} />
            <path d="M -10,0 L -3,8 L 10,-8" fill="none"
              stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" />
          </g>
        </g>

        {/* Card 2: Choosable */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={560} y={1200} w={460} h={260} />
          <text x={600} y={1270} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.white}>
            Choosable
          </text>
          <text x={600} y={1330} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            The agent selects
          </text>
          <text x={600} y={1374} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            which tool to use
          </text>
          {/* Counter */}
          <text x={940} y={1290} textAnchor="middle"
            fontFamily={FONT} fontSize={64} fontWeight={800} fill={COLORS.accent}>
            {toolCount}
          </text>
          <text x={940} y={1330} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            tools
          </text>
        </g>

        {/* Bottom full-width summary */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={1500} w={960} h={160} />
          <text x={540} y={1570} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Tools are the bridge between{' '}
          </text>
          <text x={540} y={1620} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            text output and real-world effects
          </text>
        </g>

        {/* Decorative floating dots */}
        <circle cx={120} cy={1710} r={3} fill={COLORS.accent} opacity={0.2 * shimmer} />
        <circle cx={960} cy={1720} r={4} fill={COLORS.accent} opacity={0.15 * shimmer} />
        <circle cx={540} cy={1730} r={2.5} fill={COLORS.accent} opacity={0.18 * pulse} />

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s06.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
