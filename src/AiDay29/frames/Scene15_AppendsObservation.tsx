/**
 * Scene 15 — AppendsObservation
 * "It appends that observation to the conversation."
 * CSV: 42.180s → 44.680s
 * Duration: 75 frames (2.5s)
 *
 * Animation phases:
 *   Phase 1 (0–20): headline
 *   Phase 2 (14–50): conversation stack with new message appending
 *   Phase 3 (45–end): micro
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

export const Scene15_AppendsObservation: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 4);
  const h2 = useSpringEntrance(frame, 8);

  // Message stack — existing messages
  const messages = [
    { role: 'USER', text: '"What is the weather in Tokyo?"', color: COLORS.text_muted, delay: 12 },
    { role: 'ASSISTANT', text: 'tool_call: get_weather("Tokyo")', color: COLORS.accent, delay: 16 },
    { role: 'TOOL', text: '"Tokyo: 22°C, Sunny"', color: COLORS.accent, delay: 20, isNew: false },
  ];

  const msgCards = messages.map(m => useSpringEntrance(frame, m.delay));

  // New observation sliding in
  const newObs = useSpringEntrance(frame, 30);
  const newObsSlide = interpolate(
    spring({ frame: Math.max(0, frame - 30), fps, config: { damping: 14, stiffness: 200, mass: 0.7 } }),
    [0, 1], [80, 0]
  );

  // Plus icon
  const plusOp = interpolate(frame, [26, 34], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const plusScale = spring({ frame: Math.max(0, frame - 26), fps, config: { damping: 10, stiffness: 300, mass: 0.5 } });

  // Summary
  const summaryCard = useSpringEntrance(frame, 42);

  // Arrow pointing down
  const arrowLen = 80;
  const arrowDash = usePathDraw(frame, 24, arrowLen, 20);

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.012;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const particles = Array.from({ length: 5 }, (_, i) => {
    const a = (i / 5) * Math.PI * 2 + frame * 0.014;
    const r = 350 + Math.sin(frame * 0.022 + i) * 25;
    return { x: 540 + Math.cos(a) * r, y: 1000 + Math.sin(a) * r * 0.25 };
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s15.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="MODULE 3 · AGENT RUNTIME" y={160} />
        </g>

        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={78} fontWeight={800} fill={COLORS.white}>
            Appends
          </text>
          <text x={60} y={390} fontFamily={FONT} fontSize={78} fontWeight={800} fill={COLORS.accent}>
            Observation
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={450} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.text_muted}>
            Conversation history grows
          </text>
        </g>

        {/* Conversation stack label */}
        <text x={60} y={520}
          fontFamily={FONT} fontSize={24} fontWeight={800}
          fill={COLORS.accent} letterSpacing="0.12em"
          opacity={msgCards[0].opacity}>CONVERSATION HISTORY</text>

        {/* Existing messages */}
        {messages.map((msg, i) => {
          const mc = msgCards[i];
          const cardY = 550 + i * 140;
          return (
            <g key={i} opacity={mc.opacity} transform={`translate(0, ${mc.translateY})`}>
              <BentoCard x={60} y={cardY} w={960} h={120} />
              <rect x={60} y={cardY} width={6} height={120} rx={3}
                fill={msg.color} />
              <text x={100} y={cardY + 42}
                fontFamily={FONT} fontSize={22} fontWeight={800}
                fill={msg.color} letterSpacing="0.1em">{msg.role}</text>
              <text x={100} y={cardY + 84}
                fontFamily={FONT} fontSize={28} fontWeight={800}
                fill={COLORS.white}>{msg.text}</text>
            </g>
          );
        })}

        {/* Plus icon */}
        <g opacity={plusOp} transform={`translate(540, ${960}) scale(${plusScale})`}>
          <circle cx={0} cy={0} r={24} fill={COLORS.accent} opacity={0.15} />
          <line x1={-10} y1={0} x2={10} y2={0} stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" />
          <line x1={0} y1={-10} x2={0} y2={10} stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" />
        </g>

        {/* Downward arrow */}
        <line x1={540} y1={990} x2={540} y2={1030}
          stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)" />

        {/* NEW observation message — slides in */}
        <g opacity={newObs.opacity} transform={`translate(0, ${newObsSlide})`}>
          <BentoCard x={60} y={1050} w={960} h={140} accent />
          <rect x={60} y={1050} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={100} y={1094}
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">TOOL (NEW)</text>
          <text x={100} y={1140}
            fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.white}>"Tokyo: 22°C, Sunny, Low humidity"</text>
          {/* Glow effect */}
          <rect x={56} y={1046} width={968} height={148} rx={22}
            fill="none" stroke={COLORS.accent} strokeWidth={1}
            opacity={0.2 * shimmer} />
        </g>

        {/* Summary */}
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <BentoCard x={60} y={1260} w={960} h={140} />
          <rect x={60} y={1260} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={120} y={1318}
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Model sees full context on next call
          </text>
          <text x={120} y={1366}
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            History = memory of the loop
          </text>
        </g>

        {particles.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={2} fill={COLORS.accent} opacity={0.05 * shimmer} />
        ))}

        <g transform={`translate(540, ${1580 + breathe})`}>
          <circle cx={0} cy={0} r={20} fill={COLORS.accent} opacity={0.04} />
          <circle cx={0} cy={0} r={20} fill="none" stroke={COLORS.accent} strokeWidth={1}
            opacity={0.12} transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s15.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
