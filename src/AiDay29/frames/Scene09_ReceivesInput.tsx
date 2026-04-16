/**
 * Scene 09 — ReceivesInput
 * "It receives the user input."
 * CSV: 27.300s → 29.880s
 * Duration: 77 frames (2.6s)
 *
 * Animation phases:
 *   Phase 1 (0–20): headline spring
 *   Phase 2 (15–55): user → runtime arrow, input card
 *   Phase 3 (50–end): micro
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

export const Scene09_ReceivesInput: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 4);
  const h2 = useSpringEntrance(frame, 9);

  // Step badge
  const badge = useSpringEntrance(frame, 2);

  // User node
  const userNode = useSpringEntrance(frame, 14);
  // Arrow
  const arrowLen = 300;
  const arrowDash = usePathDraw(frame, 18, arrowLen, 20);
  // Runtime node
  const runtimeNode = useSpringEntrance(frame, 22);

  // Input message card
  const inputCard = useSpringEntrance(frame, 28);
  const inputPerim = 2 * (880 + 200);
  const inputBorderDash = usePathDraw(frame, 28, inputPerim, 25);

  // Message lines
  const msgLines = [
    { text: '"What is the weather in Tokyo?"', delay: 32 },
    { text: '→ user_message.content', delay: 36 },
  ];

  // Detail card
  const detailCard = useSpringEntrance(frame, 40);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const particles = Array.from({ length: 7 }, (_, i) => {
    const a = (i / 7) * Math.PI * 2 + frame * 0.012;
    const r = 380 + Math.sin(frame * 0.02 + i) * 35;
    return { x: 540 + Math.cos(a) * r, y: 850 + Math.sin(a) * r * 0.3 };
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s09.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="MODULE 3 · AGENT RUNTIME" y={160} />
        </g>

        <g opacity={badge.opacity} transform={`translate(0, ${badge.translateY})`}>
          <rect x={60} y={200} width={100} height={40} rx={10}
            fill={COLORS.accent} opacity={0.15} />
          <text x={110} y={227} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">STEP 1</text>
        </g>

        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={320} fontFamily={FONT} fontSize={84} fontWeight={800} fill={COLORS.white}>
            Receives Input
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.accent}>
            The user sends a message
          </text>
        </g>

        {/* User node */}
        <g opacity={userNode.opacity} transform={`translate(0, ${userNode.translateY})`}>
          <circle cx={200} cy={580} r={60}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Person icon */}
          <circle cx={200} cy={562} r={16} fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <path d="M 175,600 Q 200,582 225,600" fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <text x={200} y={668} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            USER
          </text>
        </g>

        {/* Arrow user → runtime */}
        <line x1={270} y1={580} x2={570} y2={580}
          stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)" />

        {/* Runtime node */}
        <g opacity={runtimeNode.opacity} transform={`translate(0, ${runtimeNode.translateY})`}>
          <rect x={600} y={520} width={360} height={120} rx={24}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          <text x={780} y={590} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>
            RUNTIME
          </text>
        </g>

        {/* Input card */}
        <g opacity={inputCard.opacity} transform={`translate(0, ${inputCard.translateY})`}>
          <BentoCard x={100} y={740} w={880} h={200} accent />
          <rect x={100} y={740} width={880} height={200} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={inputPerim} strokeDashoffset={inputBorderDash} />
          <rect x={100} y={740} width={6} height={200} rx={3} fill={COLORS.accent} />
          {msgLines.map((line, i) => {
            const op = interpolate(frame, [line.delay, line.delay + 8], [0, 1], { extrapolateRight: 'clamp' });
            return (
              <text key={i} x={150} y={800 + i * 56}
                fontFamily={i === 0 ? `'Fira Code', monospace` : FONT}
                fontSize={i === 0 ? 32 : 28} fontWeight={i === 0 ? 500 : 800}
                fill={i === 0 ? COLORS.white : COLORS.text_muted}
                opacity={op}>
                {line.text}
              </text>
            );
          })}
        </g>

        {/* Detail card */}
        <g opacity={detailCard.opacity} transform={`translate(0, ${detailCard.translateY})`}>
          <BentoCard x={60} y={1020} w={960} h={280} />
          <text x={100} y={1090}
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Raw text flows in
          </text>
          <text x={100} y={1145}
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Natural language, unstructured
          </text>
          {/* Stylized input funnel */}
          <path d="M 540,1180 L 460,1250 L 620,1250 Z"
            fill="none" stroke={COLORS.accent} strokeWidth={2} opacity={0.5} />
          <text x={540} y={1240} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            INPUT
          </text>
        </g>

        {particles.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={2} fill={COLORS.accent} opacity={0.06 * shimmer} />
        ))}

        <g transform={`translate(540, ${1500 + breathe})`}>
          <circle cx={0} cy={0} r={24} fill={COLORS.accent} opacity={0.04} />
          <circle cx={0} cy={0} r={24} fill="none" stroke={COLORS.accent} strokeWidth={1}
            opacity={0.15} transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s09.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
