/**
 * Scene 23 — Every Decision, Every Tool Call, Every Observation
 * "Every decision, every tool call, every observation."
 * CSV: 56.600s → 59.800s
 * Duration: 96 frames (3.2s)
 *
 * Animation phases:
 *   Phase 1 (0–15): Label + headline
 *   Phase 2 (10–60): 3 large category cards with icons
 *   Phase 3 (50–end): Micro-animations
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

function usePathDraw(frame: number, start: number, len: number, dur = 20) {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return len * (1 - p);
}

export const Scene23_EveryDecision: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const lbl = useSpringEntrance(frame, 0);
  const words = ['Every decision,', 'every tool call,', 'every observation.'];
  const wordEntrances = words.map((_, i) => useSpringEntrance(frame, 3 + i * 5));

  const cards = [
    { title: 'DECISION', sub: 'What the agent chose to do', icon: 'brain', color: COLORS.accent },
    { title: 'TOOL CALL', sub: 'Which tool and what arguments', icon: 'gear', color: COLORS.white },
    { title: 'OBSERVATION', sub: 'What came back from the environment', icon: 'eye', color: COLORS.accent },
  ];
  const cardEntrances = cards.map((_, i) => useSpringEntrance(frame, 18 + i * 10));

  const connLen = 120;
  const conn1 = usePathDraw(frame, 32, connLen, 15);
  const conn2 = usePathDraw(frame, 42, connLen, 15);

  const summaryCard = useSpringEntrance(frame, 52);

  const breathe = Math.sin(frame * 0.06) * 3;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s23.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${lbl.translateY})`} opacity={lbl.opacity}>
          <SectionLabel text="TRAJECTORY · COMPLETENESS" y={160} opacity={0.8} />
        </g>

        {/* Per-line spring headline */}
        {words.map((w, i) => (
          <g key={i} transform={`translate(0, ${wordEntrances[i].translateY})`}
            opacity={wordEntrances[i].opacity}>
            <text x={60} y={300 + i * 80} fontFamily={FONT}
              fontSize={64} fontWeight={800}
              fill={i === 2 ? COLORS.accent : COLORS.white}
              fontStyle={i === 2 ? 'italic' : 'normal'}>
              {w}
            </text>
          </g>
        ))}

        {/* 3 vertical category cards */}
        {cards.map((card, i) => {
          const e = cardEntrances[i];
          const cy = 600 + i * 280;
          return (
            <g key={i} opacity={e.opacity} transform={`translate(0, ${e.translateY})`}>
              <BentoCard x={60} y={cy} w={960} h={240} accent={i === 0 || i === 2} />
              <rect x={60} y={cy} width={6} height={240} rx={3} fill={card.color} />

              {/* Icon area */}
              <circle cx={160} cy={cy + 120} r={50}
                fill={card.color} fillOpacity={0.08}
                stroke={card.color} strokeWidth={2} />
              {i === 0 && (
                /* Brain icon */
                <g>
                  <ellipse cx={160} cy={cy + 115} rx={28} ry={24}
                    fill="none" stroke={card.color} strokeWidth={2} />
                  <path d={`M 145,${cy + 100} Q 160,${cy + 90} 175,${cy + 100}`}
                    fill="none" stroke={card.color} strokeWidth={1.5} />
                  <path d={`M 148,${cy + 118} Q 160,${cy + 128} 172,${cy + 118}`}
                    fill="none" stroke={card.color} strokeWidth={1.5} />
                  <line x1={160} y1={cy + 95} x2={160} y2={cy + 135}
                    stroke={card.color} strokeWidth={1} opacity={0.4} />
                </g>
              )}
              {i === 1 && (
                /* Gear icon */
                <g>
                  <circle cx={160} cy={cy + 120} r={18}
                    fill="none" stroke={card.color} strokeWidth={2} />
                  <circle cx={160} cy={cy + 120} r={6}
                    fill={card.color} fillOpacity={0.3} />
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((a, j) => {
                    const rad = (a * Math.PI) / 180;
                    return (
                      <line key={j}
                        x1={160 + Math.cos(rad) * 18} y1={cy + 120 + Math.sin(rad) * 18}
                        x2={160 + Math.cos(rad) * 28} y2={cy + 120 + Math.sin(rad) * 28}
                        stroke={card.color} strokeWidth={3} strokeLinecap="round" />
                    );
                  })}
                </g>
              )}
              {i === 2 && (
                /* Eye icon */
                <g>
                  <ellipse cx={160} cy={cy + 120} rx={30} ry={18}
                    fill="none" stroke={card.color} strokeWidth={2} />
                  <circle cx={160} cy={cy + 120} r={10}
                    fill={card.color} fillOpacity={0.2}
                    stroke={card.color} strokeWidth={1.5} />
                  <circle cx={160} cy={cy + 120} r={4} fill={card.color} />
                </g>
              )}

              <text x={240} y={cy + 80}
                fontFamily={FONT} fontSize={28} fontWeight={800}
                fill={card.color} letterSpacing="0.1em">
                {card.title}
              </text>
              <text x={240} y={cy + 130}
                fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
                {card.sub}
              </text>
              <text x={240} y={cy + 180}
                fontFamily={FONT} fontSize={28} fontWeight={800}
                fill={COLORS.text_muted}>
                Recorded in the trajectory
              </text>
            </g>
          );
        })}

        {/* Connectors between cards */}
        <line x1={540} y1={840} x2={540} y2={880}
          stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={connLen} strokeDashoffset={conn1}
          strokeLinecap="round" opacity={0.4} />
        <line x1={540} y1={1120} x2={540} y2={1160}
          stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={connLen} strokeDashoffset={conn2}
          strokeLinecap="round" opacity={0.4} />

        {/* Summary */}
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <BentoCard x={60} y={1480} w={960} h={120} accent />
          <text x={540} y={1554} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            All captured in <tspan fill={COLORS.accent} fontStyle="italic">τ = (s₀, a₁, o₁, ...)</tspan>
          </text>
        </g>

        {[100, 540, 980].map((x, i) => (
          <circle key={i} cx={x} cy={1700 + breathe}
            r={4} fill={COLORS.accent} opacity={0.05 * shimmer} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s23.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
