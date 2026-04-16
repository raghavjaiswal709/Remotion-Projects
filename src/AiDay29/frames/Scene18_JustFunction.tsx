/**
 * Scene 18 — JustFunction
 * "Without the runtime, the model is just a function."
 * CSV: 50.480s → 53.220s
 * Duration: 82 frames (2.73s)
 *
 * Animation phases:
 *   Phase 1 (0–18): headline
 *   Phase 2 (12–55): isolated model box, no connections
 *   Phase 3 (48–end): micro
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

export const Scene18_JustFunction: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 4);
  const h2 = useSpringEntrance(frame, 10);

  // Isolated model box — center stage
  const modelBox = useSpringEntrance(frame, 16);

  // "X" marks on sides — no connections
  const xMark1 = useSpringEntrance(frame, 24);
  const xMark2 = useSpringEntrance(frame, 28);

  // Input arrow (broken/dashed — disconnected)
  const brokenArrowLen = 160;
  const brokenDash = usePathDraw(frame, 20, brokenArrowLen, 18);

  // Output arrow (broken/dashed — disconnected)
  const brokenDash2 = usePathDraw(frame, 26, brokenArrowLen, 18);

  // Detail cards
  const card1 = useSpringEntrance(frame, 32);
  const card2 = useSpringEntrance(frame, 40);
  const card3 = useSpringEntrance(frame, 48);

  // f(x) label
  const fxLabel = useSpringEntrance(frame, 36);

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.012;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Sad/static vibe — no rotating elements, things feel stuck
  const staticOpacity = interpolate(frame, [40, 50], [0, 0.15], { extrapolateRight: 'clamp' });

  const particles = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 + frame * 0.008;
    const r = 260 + Math.sin(frame * 0.015 + i) * 15;
    return { x: 540 + Math.cos(a) * r, y: 820 + Math.sin(a) * r * 0.4 };
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s18.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="MODULE 3 · AGENT RUNTIME" y={160} />
        </g>

        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={310} fontFamily={FONT} fontSize={82} fontWeight={800} fill={COLORS.white}>
            Just a Function
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={42} fontWeight={800}
            fill={COLORS.vibrant_red}>Without the runtime</text>
        </g>

        {/* Central MODEL box — isolated, no connections */}
        <g opacity={modelBox.opacity} transform={`translate(0, ${modelBox.translateY})`}>
          <rect x={290} y={540} width={500} height={200} rx={20}
            fill={COLORS.bg_secondary} stroke="rgba(255,255,255,0.15)" strokeWidth={2} />
          {/* Internal model representation */}
          <text x={540} y={620} textAnchor="middle"
            fontFamily={FONT} fontSize={52} fontWeight={800} fill={COLORS.white}>MODEL</text>
          <text x={540} y={666} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Isolated / No loop
          </text>
          {/* Dashed border to show it's incomplete */}
          <rect x={294} y={544} width={492} height={192} rx={18}
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={1.5}
            strokeDasharray="12,8" opacity={staticOpacity * 3} />
        </g>

        {/* Broken input arrow (left side) */}
        <path d="M 120,640 L 280,640"
          fill="none" stroke={COLORS.text_muted} strokeWidth={2}
          strokeDasharray="8,6"
          strokeLinecap="round" opacity={xMark1.opacity * 0.5} />
        {/* X mark on left */}
        <g opacity={xMark1.opacity}>
          <line x1={220} y1={610} x2={250} y2={670} stroke={COLORS.vibrant_red} strokeWidth={3} strokeLinecap="round" />
          <line x1={250} y1={610} x2={220} y2={670} stroke={COLORS.vibrant_red} strokeWidth={3} strokeLinecap="round" />
        </g>

        {/* Broken output arrow (right side) */}
        <path d="M 800,640 L 960,640"
          fill="none" stroke={COLORS.text_muted} strokeWidth={2}
          strokeDasharray="8,6"
          strokeLinecap="round" opacity={xMark2.opacity * 0.5} />
        {/* X mark on right */}
        <g opacity={xMark2.opacity}>
          <line x1={850} y1={610} x2={880} y2={670} stroke={COLORS.vibrant_red} strokeWidth={3} strokeLinecap="round" />
          <line x1={880} y1={610} x2={850} y2={670} stroke={COLORS.vibrant_red} strokeWidth={3} strokeLinecap="round" />
        </g>

        {/* f(x) label */}
        <g opacity={fxLabel.opacity} transform={`translate(0, ${fxLabel.translateY})`}>
          <text x={540} y={820} textAnchor="middle"
            fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.text_muted} fontStyle="italic">f(x)</text>
          <text x={540} y={870} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>text in → text out</text>
        </g>

        {/* Detail cards */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={940} w={310} h={200} />
          <rect x={60} y={940} width={6} height={200} rx={3} fill={COLORS.vibrant_red} />
          <text x={100} y={1000} fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.vibrant_red}>NO TOOLS</text>
          <text x={100} y={1040} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>Cannot call APIs</text>
          <text x={100} y={1076} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>Cannot take action</text>
          <text x={100} y={1112} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>No side effects</text>
        </g>

        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={390} y={940} w={310} h={200} />
          <rect x={390} y={940} width={6} height={200} rx={3} fill={COLORS.vibrant_red} />
          <text x={430} y={1000} fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.vibrant_red}>NO MEMORY</text>
          <text x={430} y={1040} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>Single-turn only</text>
          <text x={430} y={1076} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>No conversation</text>
          <text x={430} y={1112} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>Forgets instantly</text>
        </g>

        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={720} y={940} w={300} h={200} />
          <rect x={720} y={940} width={6} height={200} rx={3} fill={COLORS.vibrant_red} />
          <text x={760} y={1000} fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.vibrant_red}>NO LOOP</text>
          <text x={760} y={1040} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>One pass only</text>
          <text x={760} y={1076} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>Cannot iterate</text>
          <text x={760} y={1112} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>Done immediately</text>
        </g>

        {/* Bottom summary */}
        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={60} y={1190} w={960} h={100} />
          <text x={540} y={1253} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            A model alone is <tspan fill={COLORS.vibrant_red}>passive</tspan> — it just responds
          </text>
        </g>

        {particles.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={2} fill={COLORS.text_muted} opacity={0.04 * shimmer} />
        ))}

        <g transform={`translate(540, ${1560 + breathe})`}>
          <circle cx={0} cy={0} r={18} fill={COLORS.text_muted} opacity={0.03} />
          <circle cx={0} cy={0} r={18} fill="none" stroke={COLORS.text_muted} strokeWidth={1}
            opacity={0.1} transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s18.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
