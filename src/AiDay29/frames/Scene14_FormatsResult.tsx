/**
 * Scene 14 — FormatsResult
 * "It formats the result as an observation."
 * CSV: 39.720s → 42.180s
 * Duration: 74 frames (2.5s)
 *
 * Animation phases:
 *   Phase 1 (0–20): headline
 *   Phase 2 (14–50): raw result → formatted observation two-column
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

export const Scene14_FormatsResult: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 4);
  const h2 = useSpringEntrance(frame, 8);
  const badge = useSpringEntrance(frame, 2);

  // Left card: raw result
  const rawCard = useSpringEntrance(frame, 14);
  const rawPerim = 2 * (440 + 480);
  const rawBorderDash = usePathDraw(frame, 14, rawPerim, 24);

  // Arrow between cards
  const arrowLen = 60;
  const arrowDash = usePathDraw(frame, 28, arrowLen, 16);

  // Right card: formatted observation
  const obsCard = useSpringEntrance(frame, 32);
  const obsPerim = 2 * (480 + 480);
  const obsBorderDash = usePathDraw(frame, 32, obsPerim, 24);

  // Bottom summary
  const summaryCard = useSpringEntrance(frame, 44);

  // Observation structure lines
  const structLines = [
    { text: '{ role: "tool",', delay: 36 },
    { text: '  name: "get_weather",', delay: 39 },
    { text: '  content: "Tokyo: 22°C,', delay: 42 },
    { text: '            Sunny, Low humidity"', delay: 44 },
    { text: '}', delay: 46 },
  ];

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.012;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const particles = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 + frame * 0.013;
    const r = 380 + Math.sin(frame * 0.02 + i) * 20;
    return { x: 540 + Math.cos(a) * r, y: 900 + Math.sin(a) * r * 0.25 };
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s14.from);

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
            fill={COLORS.accent} letterSpacing="0.1em">STEP 6</text>
        </g>

        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={320} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Formats Result
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            As an observation
          </text>
        </g>

        {/* Left: Raw Result */}
        <g opacity={rawCard.opacity} transform={`translate(0, ${rawCard.translateY})`}>
          <BentoCard x={60} y={460} w={440} h={480} />
          <rect x={60} y={460} width={440} height={480} rx={20}
            fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={1}
            strokeDasharray={rawPerim} strokeDashoffset={rawBorderDash} />
          <rect x={60} y={460} width={6} height={480} rx={3} fill={COLORS.text_muted} />
          <text x={100} y={520}
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.12em">RAW RESULT</text>
          <text x={100} y={580}
            fontFamily="'Fira Code', monospace" fontSize={22} fontWeight={500}
            fill={COLORS.text_muted}>"Tokyo: 22°C,</text>
          <text x={100} y={616}
            fontFamily="'Fira Code', monospace" fontSize={22} fontWeight={500}
            fill={COLORS.text_muted}>Sunny, Low humidity"</text>
          {/* Simple document icon */}
          <rect x={160} y={680} width={200} height={180} rx={12}
            fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
          {[0, 1, 2, 3].map(i => (
            <rect key={i} x={185} y={710 + i * 36} width={150} height={10} rx={5}
              fill="rgba(255,255,255,0.08)" />
          ))}
          <text x={260} y={900} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted}>Plain string</text>
        </g>

        {/* Arrow */}
        <line x1={500} y1={700} x2={560} y2={700}
          stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)" />

        {/* Right: Formatted Observation */}
        <g opacity={obsCard.opacity} transform={`translate(0, ${obsCard.translateY})`}>
          <BentoCard x={560} y={460} w={460} h={480} accent />
          <rect x={560} y={460} width={460} height={480} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={obsPerim} strokeDashoffset={obsBorderDash} />
          <rect x={560} y={460} width={6} height={480} rx={3} fill={COLORS.accent} />
          <text x={600} y={520}
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.12em">OBSERVATION</text>
          {structLines.map((line, i) => {
            const op = interpolate(frame, [line.delay, line.delay + 8], [0, 1], { extrapolateRight: 'clamp' });
            return (
              <text key={i} x={600} y={575 + i * 38}
                fontFamily="'Fira Code', monospace" fontSize={20} fontWeight={500}
                fill={COLORS.text_muted} opacity={op}>{line.text}</text>
            );
          })}
          {/* Tool icon */}
          <circle cx={790} y={0} cy={830} r={50} fill={COLORS.accent} opacity={0.06} />
          <text x={790} y={840} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            role: tool
          </text>
          <text x={790} y={900} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted}>Structured message</text>
        </g>

        {/* Summary card */}
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <BentoCard x={60} y={1000} w={960} h={200} />
          <rect x={60} y={1000} width={6} height={200} rx={3} fill={COLORS.accent} />
          <text x={120} y={1070}
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Observation = structured tool output
          </text>
          <text x={120} y={1130}
            fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.text_muted}>
            Ready to be appended to conversation history
          </text>
        </g>

        {/* Floating particles */}
        {particles.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={2} fill={COLORS.accent} opacity={0.05 * shimmer} />
        ))}

        <g transform={`translate(540, ${1560 + breathe})`}>
          <circle cx={0} cy={0} r={20} fill={COLORS.accent} opacity={0.04} />
          <circle cx={0} cy={0} r={20} fill="none" stroke={COLORS.accent} strokeWidth={1}
            opacity={0.12} transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s14.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
