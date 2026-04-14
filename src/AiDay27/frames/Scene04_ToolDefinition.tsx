/**
 * Scene 04 — Tool Definition
 * "A tool is a named callable function that the agent can invoke."
 * CSV: 8.860s → 13.340s
 * Duration: 152 frames (5.1s)
 *
 * Theme: Dark (#1D1D1C) + grid + series accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):  Label + headline spring in with per-word stagger
 *   Phase 2 (frames 20–90): Function signature card builds, diagram animates
 *   Phase 3 (frames 80–end): Gear rotation, accent ring pulse, code shimmer
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

export const Scene04_ToolDefinition: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);

  // Per-word headline spring
  const headlineWords = ['A', 'Tool', 'Is'];
  const wordSprings = headlineWords.map((_, i) => {
    const f = Math.max(0, frame - 6 - i * 7);
    const sp = spring({ frame: f, fps, config: SPRING_SNAP });
    const ty = interpolate(sp, [0, 1], [24, 0]);
    const op = interpolate(sp, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });
    return { ty, op };
  });

  const sublineEntrance = useSpringEntrance(frame, 28);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const card1 = useSpringEntrance(frame, 30);
  const card2 = useSpringEntrance(frame, 42);
  const card3 = useSpringEntrance(frame, 54);
  const card4 = useSpringEntrance(frame, 66);

  // Border draw on feature card
  const PERIMETER = 2 * (960 + 240);
  const borderDash = interpolate(frame, [30, 60], [PERIMETER, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Path draws ─────────────────────────────────────────────────────────────
  const connLen = 200;
  const connDash1 = usePathDraw(frame, 50, connLen, 25);
  const connDash2 = usePathDraw(frame, 60, connLen, 25);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const gearRotation = frame * 0.8;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s04.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="CORE CONCEPT · DEFINITION" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Per-word headline ──────────────────────────────────── */}
        {headlineWords.map((word, i) => (
          <text
            key={i}
            x={60 + i * 260}
            y={330}
            opacity={wordSprings[i].op}
            transform={`translate(0, ${wordSprings[i].ty})`}
            fontFamily={FONT} fontSize={108} fontWeight={800}
            fill={i === 1 ? COLORS.accent : COLORS.white}
          >
            {word}
          </text>
        ))}

        {/* Subline */}
        <g transform={`translate(0, ${sublineEntrance.translateY})`} opacity={sublineEntrance.opacity}>
          <text x={60} y={430} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.text_muted}>
            A named callable function
          </text>
        </g>

        {/* ── ZONE C — Definition breakdown ───────────────────────────────── */}

        {/* Feature card: function signature with border-draw */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <rect x={60} y={500} width={960} height={240} rx={20}
            fill={COLORS.bg_secondary}
            stroke="none" />
          <rect x={60} y={500} width={960} height={240} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={PERIMETER} strokeDashoffset={borderDash} />
          <rect x={60} y={500} width={6} height={240} rx={3} fill={COLORS.accent} />

          {/* Code-style function signature */}
          <text x={100} y={570} fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={36} fontWeight={500} fill={COLORS.text_muted}>
            {'function '}
          </text>
          <text x={322} y={570} fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={36} fontWeight={700} fill={COLORS.accent}>
            search
          </text>
          <text x={468} y={570} fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={36} fontWeight={500} fill={COLORS.text_muted}>
            {'(query: string)'}
          </text>

          <text x={100} y={630} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Named
          </text>
          <text x={300} y={630} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            Callable
          </text>
          <text x={540} y={630} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Function
          </text>

          <text x={100} y={700} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            The agent invokes it by name with specific arguments
          </text>
        </g>

        {/* Three property cards */}

        {/* Card: Named */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={780} w={300} h={340} accent />
          <text x={210} y={850} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            NAMED
          </text>
          {/* Tag icon */}
          <g transform={`translate(210, ${940 + breathe})`}>
            <rect x={-40} y={-25} width={80} height={50} rx={8}
              fill="none" stroke={COLORS.accent} strokeWidth={2} />
            <circle cx={-25} cy={0} r={6} fill={COLORS.accent} />
            <line x1={-10} y1={0} x2={30} y2={0}
              stroke={COLORS.accent} strokeWidth={2} />
          </g>
          <text x={210} y={1020} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Has an
          </text>
          <text x={210} y={1060} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            identity
          </text>
        </g>

        {/* Card: Callable */}
        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={390} y={780} w={300} h={340} />
          <text x={540} y={850} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            CALLABLE
          </text>
          {/* Phone/invoke icon */}
          <g transform={`translate(540, ${940 + breathe * 0.8})`}>
            <rect x={-20} y={-30} width={40} height={60} rx={6}
              fill="none" stroke={COLORS.accent} strokeWidth={2} />
            <line x1={-10} y1={20} x2={10} y2={20}
              stroke={COLORS.accent} strokeWidth={2} />
            <circle cx={0} cy={-10} r={3} fill={COLORS.accent} />
            {/* Ring waves */}
            <path d="M -30,-36 C -30,-50 30,-50 30,-36"
              fill="none" stroke={COLORS.accent} strokeWidth={1.5}
              opacity={0.4 * shimmer} />
            <path d="M -38,-44 C -38,-62 38,-62 38,-44"
              fill="none" stroke={COLORS.accent} strokeWidth={1.5}
              opacity={0.25 * shimmer} />
          </g>
          <text x={540} y={1020} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Can be
          </text>
          <text x={540} y={1060} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            invoked
          </text>
        </g>

        {/* Card: Function */}
        <g opacity={card4.opacity} transform={`translate(0, ${card4.translateY})`}>
          <BentoCard x={720} y={780} w={300} h={340} />
          <text x={870} y={850} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            FUNCTION
          </text>
          {/* Gear icon */}
          <g transform={`translate(870, ${940 + breathe * 0.6}) rotate(${gearRotation}, 0, 0)`}>
            <circle cx={0} cy={0} r={24} fill="none"
              stroke={COLORS.accent} strokeWidth={2} />
            <circle cx={0} cy={0} r={10} fill={COLORS.accent} opacity={0.5} />
            {[0, 60, 120, 180, 240, 300].map(angle => {
              const rad = (angle * Math.PI) / 180;
              return (
                <line key={angle}
                  x1={Math.cos(rad) * 20} y1={Math.sin(rad) * 20}
                  x2={Math.cos(rad) * 32} y2={Math.sin(rad) * 32}
                  stroke={COLORS.accent} strokeWidth={4} strokeLinecap="round" />
              );
            })}
          </g>
          <text x={870} y={1020} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Does real
          </text>
          <text x={870} y={1060} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            work
          </text>
        </g>

        {/* Connector lines between cards */}
        <path d="M 360,950 L 390,950"
          fill="none" stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={connLen} strokeDashoffset={connDash1}
          strokeLinecap="round" opacity={0.4} />
        <path d="M 690,950 L 720,950"
          fill="none" stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={connLen} strokeDashoffset={connDash2}
          strokeLinecap="round" opacity={0.4} />

        {/* ── Bottom summary card ─────────────────────────────────────────── */}
        <g opacity={card4.opacity} transform={`translate(0, ${card4.translateY})`}>
          <BentoCard x={60} y={1160} w={960} h={260} accent />

          {/* Agent → Tool flow diagram */}
          {/* Agent box */}
          <rect x={120} y={1210} width={200} height={80} rx={14}
            fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <text x={220} y={1260} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            AGENT
          </text>

          {/* Arrow */}
          <path d="M 320,1250 L 480,1250"
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={connLen} strokeDashoffset={connDash1}
            strokeLinecap="round" markerEnd="url(#arrow)" />
          <text x={400} y={1230} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            invokes
          </text>

          {/* Tool box */}
          <rect x={480} y={1210} width={200} height={80} rx={14}
            fill={COLORS.accent} fillOpacity={0.1}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={580} y={1260} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            TOOL
          </text>

          {/* Result arrow */}
          <path d="M 680,1250 L 840,1250"
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={connLen} strokeDashoffset={connDash2}
            strokeLinecap="round" markerEnd="url(#arrow)" />
          <text x={760} y={1230} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            returns
          </text>

          {/* Result box */}
          <rect x={840} y={1210} width={140} height={80} rx={14}
            fill="none" stroke={COLORS.text_muted} strokeWidth={1.5} />
          <text x={910} y={1260} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Result
          </text>

          {/* Labels beneath */}
          <text x={540} y={1380} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            A tool bridges text output and real-world effects
          </text>
        </g>

        {/* Floating accent dots */}
        <circle cx={160} cy={1540} r={4} fill={COLORS.accent} opacity={0.3 * shimmer} />
        <circle cx={920} cy={1560} r={3} fill={COLORS.accent} opacity={0.25 * shimmer} />
        <circle cx={540} cy={1520} r={5} fill={COLORS.accent} opacity={0.2 * pulse} />

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s04.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
