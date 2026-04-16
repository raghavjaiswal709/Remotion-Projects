/**
 * Scene 10 — FormatsPrompt
 * "It formats it into a prompt."
 * CSV: 29.880s → 31.780s
 * Duration: 57 frames (1.9s)
 *
 * Animation phases:
 *   Phase 1 (0–18): headline
 *   Phase 2 (12–40): raw text → formatted prompt transformation
 *   Phase 3 (35–end): micro
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

export const Scene10_FormatsPrompt: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 4);
  const h2 = useSpringEntrance(frame, 8);

  const badge = useSpringEntrance(frame, 2);

  // Left card: raw input
  const leftCard = useSpringEntrance(frame, 14);
  // Right card: formatted prompt
  const rightCard = useSpringEntrance(frame, 20);

  // Arrow between cards
  const arrowLen = 60;
  const arrowDash = usePathDraw(frame, 18, arrowLen, 15);

  // Prompt structure lines
  const promptLines = [
    { text: '{ role: "system",', delay: 24 },
    { text: '  content: "You are...",', delay: 27 },
    { text: '  role: "user",', delay: 30 },
    { text: '  content: "Weather?" }', delay: 33 },
  ];

  // Bottom summary
  const bottomCard = useSpringEntrance(frame, 36);

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.012;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const particles = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 + frame * 0.013;
    const r = 350 + Math.sin(frame * 0.022 + i) * 25;
    return { x: 540 + Math.cos(a) * r, y: 900 + Math.sin(a) * r * 0.3 };
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s10.from);

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
            fill={COLORS.accent} letterSpacing="0.1em">STEP 2</text>
        </g>

        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={320} fontFamily={FONT} fontSize={84} fontWeight={800} fill={COLORS.white}>
            Formats Prompt
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            Raw text becomes structured input
          </text>
        </g>

        {/* Left card — raw input */}
        <g opacity={leftCard.opacity} transform={`translate(0, ${leftCard.translateY})`}>
          <BentoCard x={60} y={480} w={440} h={300} />
          <text x={100} y={540}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.1em">RAW INPUT</text>
          <rect x={80} y={570} width={400} height={60} rx={12}
            fill={COLORS.accent} opacity={0.06} />
          <text x={100} y={610}
            fontFamily="'Fira Code', monospace" fontSize={26} fontWeight={500}
            fill={COLORS.white}>
            "Weather in Tokyo?"
          </text>
          {/* Simple text block lines */}
          <rect x={80} y={660} width={360} height={4} rx={2} fill={COLORS.text_muted} opacity={0.15} />
          <rect x={80} y={680} width={280} height={4} rx={2} fill={COLORS.text_muted} opacity={0.1} />
          <rect x={80} y={700} width={320} height={4} rx={2} fill={COLORS.text_muted} opacity={0.08} />
        </g>

        {/* Arrow */}
        <line x1={510} y1={630} x2={570} y2={630}
          stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)" />

        {/* Right card — formatted prompt */}
        <g opacity={rightCard.opacity} transform={`translate(0, ${rightCard.translateY})`}>
          <BentoCard x={580} y={480} w={440} h={300} accent />
          <rect x={580} y={480} width={6} height={300} rx={3} fill={COLORS.accent} />
          <text x={620} y={540}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">PROMPT</text>
          {promptLines.map((line, i) => {
            const op = interpolate(frame, [line.delay, line.delay + 8], [0, 1], { extrapolateRight: 'clamp' });
            return (
              <text key={i} x={620} y={590 + i * 42}
                fontFamily="'Fira Code', monospace" fontSize={22} fontWeight={500}
                fill={COLORS.text_muted} opacity={op}>
                {line.text}
              </text>
            );
          })}
        </g>

        {/* Large transformation icon */}
        <g opacity={rightCard.opacity}>
          <text x={540} y={920} textAnchor="middle"
            fontFamily={FONT} fontSize={120} fontWeight={800}
            fill={COLORS.accent} opacity={0.08}>
            FORMAT
          </text>
        </g>

        {/* Explanation cards */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={60} y={980} w={460} h={200} />
          <text x={100} y={1050}
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            System message
          </text>
          <text x={100} y={1100}
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Sets behavior rules
          </text>
          <text x={100} y={1145}
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Context + instructions
          </text>

          <BentoCard x={560} y={980} w={460} h={200} accent />
          <text x={600} y={1050}
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>
            User message
          </text>
          <text x={600} y={1100}
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            The actual request
          </text>
          <text x={600} y={1145}
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Natural language query
          </text>
        </g>

        {/* Summary bar */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={60} y={1240} w={960} h={120} />
          <rect x={60} y={1240} width={6} height={120} rx={3} fill={COLORS.accent} />
          <text x={120} y={1312}
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Structure gives the model context it needs
          </text>
        </g>

        {particles.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={2} fill={COLORS.accent} opacity={0.06 * shimmer} />
        ))}

        <g transform={`translate(540, ${1520 + breathe})`}>
          <circle cx={0} cy={0} r={20} fill={COLORS.accent} opacity={0.04} />
          <circle cx={0} cy={0} r={20} fill="none" stroke={COLORS.accent} strokeWidth={1}
            opacity={0.15} transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s10.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
