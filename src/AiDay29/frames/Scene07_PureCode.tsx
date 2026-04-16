/**
 * Scene 07 — PureCode
 * "Pure code, the scaffolding, the entire loop runs inside."
 * CSV: 21.140s → 25.260s
 * Duration: 123 frames (4.1s)
 *
 * Animation phases:
 *   Phase 1 (0–25): headline spring
 *   Phase 2 (20–80): code scaffolding illustration with path-draw
 *   Phase 3 (70–end): micro-anims
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

export const Scene07_PureCode: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 5);
  const h2 = useSpringEntrance(frame, 10);

  // Code block card
  const codeCard = useSpringEntrance(frame, 16);
  const codePerim = 2 * (960 + 600);
  const codeDash = usePathDraw(frame, 16, codePerim, 30);

  // Code lines reveal
  const codeLines = [
    { text: 'while (goal_not_met) {', kw: true, delay: 20 },
    { text: '  prompt = format(input)', kw: false, delay: 24 },
    { text: '  response = model.call(prompt)', kw: false, delay: 28 },
    { text: '  if (response.tool_call) {', kw: true, delay: 32 },
    { text: '    result = execute(tool)', kw: false, delay: 36 },
    { text: '    input = append(result)', kw: false, delay: 40 },
    { text: '  }', kw: true, delay: 44 },
    { text: '}', kw: true, delay: 48 },
  ];

  // Scaffolding illustration — vertical bars on sides
  const scaffLeft = usePathDraw(frame, 18, 700, 25);
  const scaffRight = usePathDraw(frame, 20, 700, 25);
  const scaffCross1 = usePathDraw(frame, 22, 960, 25);
  const scaffCross2 = usePathDraw(frame, 26, 960, 25);

  // Bottom summary
  const bottomCard = useSpringEntrance(frame, 52);

  // Label: "PURE CODE"
  const pureCodeLabel = useSpringEntrance(frame, 14);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const particles = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 + frame * 0.01;
    const r = 400 + Math.sin(frame * 0.025 + i) * 40;
    return { x: 540 + Math.cos(a) * r, y: 900 + Math.sin(a) * r * 0.4, op: 0.08, size: 2 + (i % 3) };
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s07.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="MODULE 3 · AGENT RUNTIME" y={160} />
        </g>

        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={290} fontFamily={FONT} fontSize={84} fontWeight={800} fill={COLORS.white}>
            Pure Code
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            The scaffolding the loop runs inside
          </text>
        </g>

        {/* Scaffolding bars — left + right vertical */}
        <line x1={60} y1={440} x2={60} y2={1140}
          stroke={COLORS.accent} strokeWidth={3} opacity={0.25}
          strokeDasharray={700} strokeDashoffset={scaffLeft} />
        <line x1={1020} y1={440} x2={1020} y2={1140}
          stroke={COLORS.accent} strokeWidth={3} opacity={0.25}
          strokeDasharray={700} strokeDashoffset={scaffRight} />
        {/* Cross bars */}
        <line x1={60} y1={440} x2={1020} y2={440}
          stroke={COLORS.accent} strokeWidth={2} opacity={0.15}
          strokeDasharray={960} strokeDashoffset={scaffCross1} />
        <line x1={60} y1={1140} x2={1020} y2={1140}
          stroke={COLORS.accent} strokeWidth={2} opacity={0.15}
          strokeDasharray={960} strokeDashoffset={scaffCross2} />

        {/* PURE CODE badge */}
        <g opacity={pureCodeLabel.opacity} transform={`translate(0, ${pureCodeLabel.translateY})`}>
          <rect x={60} y={460} width={200} height={44} rx={10}
            fill={COLORS.accent} opacity={0.12} />
          <text x={160} y={490} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.15em">
            PURE CODE
          </text>
        </g>

        {/* Code block card */}
        <g opacity={codeCard.opacity} transform={`translate(0, ${codeCard.translateY})`}>
          <BentoCard x={80} y={520} w={920} h={560} accent />
          <rect x={80} y={520} width={920} height={560} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={codePerim} strokeDashoffset={codeDash} />
          <rect x={80} y={520} width={6} height={560} rx={3} fill={COLORS.accent} />

          {codeLines.map((line, i) => {
            const lineOp = interpolate(frame, [line.delay, line.delay + 10], [0, 1], { extrapolateRight: 'clamp' });
            return (
              <text key={i} x={130} y={590 + i * 60}
                fontFamily="'Fira Code', 'Courier New', monospace"
                fontSize={30} fontWeight={500}
                fill={line.kw ? COLORS.accent : COLORS.text_muted}
                opacity={lineOp}>
                {line.text}
              </text>
            );
          })}
        </g>

        {/* Bottom summary */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={60} y={1160} w={960} h={160} />
          <rect x={60} y={1160} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={120} y={1255}
            fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            The entire agent loop, in code
          </text>
        </g>

        {particles.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.size} fill={COLORS.accent} opacity={p.op * shimmer} />
        ))}

        <g transform={`translate(540, ${1500 + breathe})`}>
          <circle cx={0} cy={0} r={28} fill={COLORS.accent} opacity={0.05} />
          <circle cx={0} cy={0} r={28} fill="none" stroke={COLORS.accent} strokeWidth={1}
            opacity={0.2} transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s07.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
