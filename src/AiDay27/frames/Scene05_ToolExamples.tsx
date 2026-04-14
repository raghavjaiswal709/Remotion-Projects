/**
 * Scene 05 — Tool Examples
 * "Search, read file, send email, run an SQL query."
 * CSV: 14.100s → 18.880s
 * Duration: 161 frames (5.4s)
 *
 * Theme: Dark (#1D1D1C) + grid + series accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):  Section label + headline spring entrance
 *   Phase 2 (frames 20–90): 4 tool example bento cards cascade in staggered
 *   Phase 3 (frames 80–end): Icon micro-animations — pulse rings, float, shimmer
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
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

// ── Tool example data ─────────────────────────────────────────────────────────
const TOOLS = [
  {
    name: 'search',
    label: 'Search',
    signature: 'search(query)',
    desc: 'Find live information',
    icon: 'magnifier',
  },
  {
    name: 'read_file',
    label: 'Read File',
    signature: 'read_file(path)',
    desc: 'Access local data',
    icon: 'file',
  },
  {
    name: 'send_email',
    label: 'Send Email',
    signature: 'send_email(to, subj)',
    desc: 'Communicate externally',
    icon: 'envelope',
  },
  {
    name: 'sql_query',
    label: 'SQL Query',
    signature: 'sql_query(stmt)',
    desc: 'Read from databases',
    icon: 'database',
  },
];

export const Scene05_ToolExamples: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineEntrance = useSpringEntrance(frame, 6);
  const subtitleEntrance = useSpringEntrance(frame, 14);

  // ── Phase 2: Content build (stagger 12 frames) ────────────────────────────
  const STAGGER = 12;
  const cards = TOOLS.map((_, i) => useSpringEntrance(frame, 28 + i * STAGGER));

  // Border-draw for accent card
  const CARD_PERIM = 2 * (460 + 440);
  const borderDashes = TOOLS.map((_, i) =>
    interpolate(frame, [28 + i * STAGGER, 58 + i * STAGGER], [CARD_PERIM, 0], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    })
  );

  // Bottom summary card
  const summaryCard = useSpringEntrance(frame, 80);

  // Connector path draws
  const connLen = 120;
  const conn1 = usePathDraw(frame, 72, connLen, 20);
  const conn2 = usePathDraw(frame, 80, connLen, 20);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3.5;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s05.from);

  // Card layout: 2x2 grid
  const cardPositions = [
    { x: 60,  y: 520 },
    { x: 560, y: 520 },
    { x: 60,  y: 1000 },
    { x: 560, y: 1000 },
  ];
  const CARD_W = 460;
  const CARD_H = 440;

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="MODULE 3 · EXAMPLES" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Headline ───────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineEntrance.translateY})`} opacity={headlineEntrance.opacity}>
          <text x={60} y={310} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.white}>
            Tool Examples
          </text>
        </g>
        <g transform={`translate(0, ${subtitleEntrance.translateY})`} opacity={subtitleEntrance.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.text_muted}>
            Named functions an agent can invoke
          </text>
        </g>

        {/* ── ZONE C — 2×2 Tool card grid ─────────────────────────────────── */}
        {TOOLS.map((tool, i) => {
          const pos = cardPositions[i];
          const card = cards[i];
          const isAccent = i === 0;

          return (
            <g key={tool.name} opacity={card.opacity} transform={`translate(0, ${card.translateY})`}>
              {/* Card background */}
              <rect x={pos.x} y={pos.y} width={CARD_W} height={CARD_H} rx={20}
                fill={COLORS.bg_secondary}
                stroke="none" />
              {/* Border draw animation */}
              <rect x={pos.x} y={pos.y} width={CARD_W} height={CARD_H} rx={20}
                fill="none"
                stroke={isAccent ? COLORS.accent : 'rgba(255,255,255,0.15)'}
                strokeWidth={isAccent ? 2 : 1}
                strokeDasharray={CARD_PERIM}
                strokeDashoffset={borderDashes[i]} />
              {/* Left accent bar */}
              <rect x={pos.x} y={pos.y} width={5} height={CARD_H} rx={3}
                fill={COLORS.accent} opacity={0.7} />

              {/* Icon area */}
              {tool.icon === 'magnifier' && (
                <g transform={`translate(${pos.x + 230}, ${pos.y + 140 + breathe})`}>
                  <circle cx={0} cy={0} r={44} fill="none"
                    stroke={COLORS.accent} strokeWidth={3} />
                  <circle cx={0} cy={0} r={44} fill={COLORS.accent} fillOpacity={0.06 * shimmer} />
                  <line x1={30} y1={30} x2={54} y2={54}
                    stroke={COLORS.accent} strokeWidth={4} strokeLinecap="round" />
                  {/* Highlight dot */}
                  <circle cx={-12} cy={-12} r={4}
                    fill={COLORS.accent} opacity={0.5 * pulse} />
                </g>
              )}
              {tool.icon === 'file' && (
                <g transform={`translate(${pos.x + 230}, ${pos.y + 140 + breathe * 0.8})`}>
                  <rect x={-30} y={-42} width={60} height={84} rx={6}
                    fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
                  <path d="M 30,-42 L 30,-26 L 14,-26" fill="none"
                    stroke={COLORS.accent} strokeWidth={2} />
                  <line x1={-16} y1={-10} x2={16} y2={-10}
                    stroke={COLORS.accent} strokeWidth={2} opacity={0.6} />
                  <line x1={-16} y1={6} x2={16} y2={6}
                    stroke={COLORS.accent} strokeWidth={2} opacity={0.6} />
                  <line x1={-16} y1={22} x2={8} y2={22}
                    stroke={COLORS.accent} strokeWidth={2} opacity={0.4} />
                </g>
              )}
              {tool.icon === 'envelope' && (
                <g transform={`translate(${pos.x + 230}, ${pos.y + 140 + breathe * 0.9})`}>
                  <rect x={-40} y={-28} width={80} height={56} rx={8}
                    fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
                  <path d="M -40,-28 L 0,10 L 40,-28" fill="none"
                    stroke={COLORS.accent} strokeWidth={2} />
                  {/* Sent indicator */}
                  <circle cx={38} cy={-26} r={5} fill={COLORS.accent}
                    opacity={shimmer * 0.8}
                    transform={`scale(${pulse})`}
                    style={{ transformOrigin: '38px -26px' }} />
                </g>
              )}
              {tool.icon === 'database' && (
                <g transform={`translate(${pos.x + 230}, ${pos.y + 140 + breathe * 0.7})`}>
                  <ellipse cx={0} cy={-30} rx={36} ry={14} fill="none"
                    stroke={COLORS.accent} strokeWidth={2.5} />
                  <line x1={-36} y1={-30} x2={-36} y2={30}
                    stroke={COLORS.accent} strokeWidth={2.5} />
                  <line x1={36} y1={-30} x2={36} y2={30}
                    stroke={COLORS.accent} strokeWidth={2.5} />
                  <ellipse cx={0} cy={30} rx={36} ry={14} fill="none"
                    stroke={COLORS.accent} strokeWidth={2.5} />
                  <ellipse cx={0} cy={0} rx={36} ry={14} fill="none"
                    stroke={COLORS.accent} strokeWidth={1.5} opacity={0.4} />
                </g>
              )}

              {/* Tool name label */}
              <text x={pos.x + 230} y={pos.y + 264} textAnchor="middle"
                fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
                {tool.label}
              </text>

              {/* Signature */}
              <text x={pos.x + 230} y={pos.y + 316} textAnchor="middle"
                fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={500}
                fill={COLORS.accent} opacity={0.7}>
                {tool.signature}
              </text>

              {/* Description */}
              <text x={pos.x + 230} y={pos.y + 370} textAnchor="middle"
                fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
                {tool.desc}
              </text>

              {/* Decorative corner bracket */}
              <path
                d={`M ${pos.x + CARD_W - 20},${pos.y + 20} L ${pos.x + CARD_W - 20},${pos.y + 50} M ${pos.x + CARD_W - 20},${pos.y + 20} L ${pos.x + CARD_W - 50},${pos.y + 20}`}
                fill="none" stroke={COLORS.accent} strokeWidth={1.5} strokeLinecap="round"
                opacity={0.3} />
            </g>
          );
        })}

        {/* Connector between left→right pairs */}
        <path d="M 520,740 L 560,740"
          fill="none" stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={connLen} strokeDashoffset={conn1}
          opacity={0.3} />
        <path d="M 520,1220 L 560,1220"
          fill="none" stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={connLen} strokeDashoffset={conn2}
          opacity={0.3} />

        {/* ── Summary card ────────────────────────────────────────────────── */}
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <BentoCard x={60} y={1480} w={960} h={180} />
          <text x={540} y={1555} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Each tool is a{' '}
          </text>
          <text x={540} y={1555} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            {'          specific capability'}
          </text>
          <text x={540} y={1610} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            The agent chooses which tool to call and when
          </text>
        </g>

        {/* Floating accent dots */}
        <circle cx={180} cy={1700} r={4} fill={COLORS.accent} opacity={0.2 * shimmer} />
        <circle cx={900} cy={1700} r={3} fill={COLORS.accent} opacity={0.15 * shimmer} />

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
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
