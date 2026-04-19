/**
 * Scene 26 — A Trajectory Is Made of Individual Steps
 * "Now a trajectory is made of individual steps."
 * CSV: 65.700s → 69.900s
 * Duration: 126 frames (4.2s)
 *
 * Animation phases:
 *   Phase 1 (0–20): Label + headline
 *   Phase 2 (15–80): Trajectory → steps breakdown
 *   Phase 3 (70–end): Micro-animations
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

function usePathDraw(frame: number, start: number, len: number, dur = 25) {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return len * (1 - p);
}

export const Scene26_StepsIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const lbl = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 4);
  const h2 = useSpringEntrance(frame, 8);

  // Full trajectory arc
  const arcCard = useSpringEntrance(frame, 14);
  const arcLen = 500;
  const arcDash = usePathDraw(frame, 18, arcLen, 30);

  // Step breakdown cards
  const stepCards = [0, 1, 2, 3].map(i => useSpringEntrance(frame, 40 + i * 8));

  // Bracket/grouping
  const bracketE = useSpringEntrance(frame, 62);
  const bracketLen = 400;
  const bracketDash = usePathDraw(frame, 65, bracketLen, 20);

  const transCard = useSpringEntrance(frame, 75);

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.012;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s26.from);

  const steps = [
    { label: 'STEP 1', sub: 's₀ → a₁ → o₁' },
    { label: 'STEP 2', sub: 's₁ → a₂ → o₂' },
    { label: 'STEP 3', sub: 's₂ → a₃ → o₃' },
    { label: 'STEP N', sub: 'sₙ₋₁ → aₙ → oₙ' },
  ];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${lbl.translateY})`} opacity={lbl.opacity}>
          <SectionLabel text="TRAJECTORY · DECOMPOSITION" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={310} fontFamily={FONT} fontSize={68} fontWeight={800} fill={COLORS.white}>
            A trajectory is made of
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={410} fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            individual steps
          </text>
        </g>

        {/* Full trajectory arc */}
        <g opacity={arcCard.opacity} transform={`translate(0, ${arcCard.translateY})`}>
          <BentoCard x={60} y={480} w={960} h={240} accent />
          <text x={100} y={530} fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            FULL TRAJECTORY τ
          </text>
          {/* Arc path */}
          <path d="M 140,660 C 240,520 840,520 940,660"
            fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={arcLen} strokeDashoffset={arcDash}
            strokeLinecap="round" />
          {/* Start/end nodes */}
          <circle cx={140} cy={660} r={10} fill={COLORS.accent} opacity={arcCard.opacity} />
          <circle cx={940} cy={660} r={10} fill={COLORS.accent} opacity={arcCard.opacity} />
          <text x={140} y={695} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
            s₀
          </text>
          <text x={940} y={695} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
            oₙ
          </text>
          {/* Intermediate dots on arc */}
          {[0.25, 0.5, 0.75].map((t, i) => {
            const dotOp = interpolate(frame, [22 + i * 4, 28 + i * 4], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            const cx = 140 + (940 - 140) * t;
            const cy = 660 - 140 * Math.sin(Math.PI * t);
            return <circle key={i} cx={cx} cy={cy} r={6}
              fill={COLORS.accent} opacity={dotOp * 0.6} />;
          })}
        </g>

        {/* Equals / breakdown arrow */}
        <g opacity={interpolate(frame, [36, 42], [0, 1], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        })}>
          <text x={540} y={785} textAnchor="middle"
            fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent}>
            =
          </text>
        </g>

        {/* Step cards */}
        {steps.map((s, i) => {
          const e = stepCards[i];
          const cy = 820 + i * 140;
          const isDotted = i === 3;
          return (
            <g key={i} opacity={e.opacity} transform={`translate(0, ${e.translateY})`}>
              <BentoCard x={120} y={cy} w={840} h={110} accent={i === 0} />
              {/* Step number circle */}
              <circle cx={80} cy={cy + 55} r={24}
                fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
              <text x={80} y={cy + 62} textAnchor="middle"
                fontFamily={FONT} fontSize={18} fontWeight={800} fill={COLORS.accent}>
                {isDotted ? '...' : (i + 1).toString()}
              </text>
              {/* Label */}
              <text x={170} y={cy + 44}
                fontFamily={FONT} fontSize={32} fontWeight={800}
                fill={COLORS.white}>
                {s.label}
              </text>
              <text x={170} y={cy + 82}
                fontFamily={FONT} fontSize={24} fontWeight={800}
                fill={COLORS.text_muted}>
                {s.sub}
              </text>
            </g>
          );
        })}

        {/* Right bracket grouping */}
        <g opacity={bracketE.opacity}>
          <path d="M 990,820 C 1020,820 1020,1380 990,1380"
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={bracketLen} strokeDashoffset={bracketDash}
            strokeLinecap="round" />
          <text x={1010} y={1110}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic"
            transform="rotate(90, 1010, 1110)">
            τ
          </text>
        </g>

        {/* Transition card */}
        <g opacity={transCard.opacity} transform={`translate(0, ${transCard.translateY})`}>
          <BentoCard x={60} y={1420} w={960} h={120} accent />
          <text x={540} y={1496} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Each <tspan fill={COLORS.accent} fontStyle="italic">step</tspan> is the atomic unit
          </text>
        </g>

        {/* Floating */}
        {[200, 540, 880].map((x, i) => (
          <circle key={i} cx={x} cy={1650 + breathe} r={5}
            fill={COLORS.accent} opacity={0.06}
            transform={`scale(${pulse})`} style={{ transformOrigin: `${x}px 1650px` }} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s26.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
