/**
 * Scene 25 — Compile Time vs Run Time Distinction
 * "That distinction, compile time versus run time, matters enormously."
 * CSV: 91.800s → 97.000s
 * Duration: ~156 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline
 *   Phase 2 (20–70): Two-column comparison: compile vs run
 *   Phase 3 (60–end): Micro-animations
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

export const Scene25_CompileVsRunTime: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 6);
  const h2 = useSpringEntrance(frame, 12);

  // Two column cards
  const leftCard = useSpringEntrance(frame, 22);
  const rightCard = useSpringEntrance(frame, 32);

  // Left column items
  const leftItems = [
    { label: 'javac', detail: 'Compiler checks types' },
    { label: 'Static', detail: 'Known before execution' },
    { label: 'Overloading', detail: 'Method resolved here' },
  ];
  const leftEnts = leftItems.map((_, i) => useSpringEntrance(frame, 30 + i * 10));

  // Right column items
  const rightItems = [
    { label: 'JVM', detail: 'Virtual machine runs code' },
    { label: 'Dynamic', detail: 'Decided during execution' },
    { label: 'Overriding', detail: 'Method resolved here' },
  ];
  const rightEnts = rightItems.map((_, i) => useSpringEntrance(frame, 36 + i * 10));

  // Divider line
  const divLen = 900;
  const divDash = usePathDraw(frame, 45, divLen, 25);

  // Emphasis card
  const emphEnt = useSpringEntrance(frame, 65);

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.012;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s25.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="CRITICAL DISTINCTION" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={540} y={300} textAnchor="middle"
            fontFamily={FONT} fontSize={60} fontWeight={800} fill={COLORS.white}>
            Matters Enormously
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={540} y={385} textAnchor="middle"
            fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}>
            Compile Time vs Run Time
          </text>
        </g>

        {/* Left column: Compile Time */}
        <g opacity={leftCard.opacity} transform={`translate(0, ${leftCard.translateY})`}>
          <BentoCard x={60} y={460} w={460} h={700} accent />
          <text x={290} y={520} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>
            COMPILE TIME
          </text>
          <line x1={100} y1={545} x2={480} y2={545}
            stroke={COLORS.accent} strokeWidth={1.5} opacity={0.3} />

          {leftItems.map((item, i) => {
            const ent = leftEnts[i];
            const itemY = 580 + i * 170;
            return (
              <g key={i} opacity={ent.opacity} transform={`translate(0, ${ent.translateY})`}>
                <circle cx={120} cy={itemY + 20} r={18} fill={COLORS.accent} opacity={0.12} />
                <text x={120} y={itemY + 27} textAnchor="middle"
                  fontFamily={FONT} fontSize={18} fontWeight={800} fill={COLORS.accent}>
                  {i + 1}
                </text>
                <text x={155} y={itemY + 27}
                  fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
                  {item.label}
                </text>
                <text x={100} y={itemY + 70}
                  fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
                  {item.detail}
                </text>
              </g>
            );
          })}
        </g>

        {/* Right column: Run Time */}
        <g opacity={rightCard.opacity} transform={`translate(0, ${rightCard.translateY})`}>
          <BentoCard x={560} y={460} w={460} h={700} accent={false} />
          <text x={790} y={520} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            RUN TIME
          </text>
          <line x1={600} y1={545} x2={980} y2={545}
            stroke={COLORS.text_muted} strokeWidth={1.5} opacity={0.15} />

          {rightItems.map((item, i) => {
            const ent = rightEnts[i];
            const itemY = 580 + i * 170;
            return (
              <g key={i} opacity={ent.opacity} transform={`translate(0, ${ent.translateY})`}>
                <circle cx={620} cy={itemY + 20} r={18} fill={COLORS.text_muted} opacity={0.12} />
                <text x={620} y={itemY + 27} textAnchor="middle"
                  fontFamily={FONT} fontSize={18} fontWeight={800} fill={COLORS.text_muted}>
                  {i + 1}
                </text>
                <text x={655} y={itemY + 27}
                  fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white} opacity={0.6}>
                  {item.label}
                </text>
                <text x={600} y={itemY + 70}
                  fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted} opacity={0.5}>
                  {item.detail}
                </text>
              </g>
            );
          })}
        </g>

        {/* "VS" badge */}
        <g opacity={leftCard.opacity}>
          <circle cx={540} cy={810} r={32} fill={COLORS.bg_primary}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={540} y={818} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent}>
            VS
          </text>
        </g>

        {/* Divider */}
        <line x1={60} y1={1220} x2={1020} y2={1220}
          stroke={COLORS.accent} strokeWidth={1.5} opacity={0.1}
          strokeDasharray={divLen} strokeDashoffset={divDash} />

        {/* Emphasis card */}
        <g opacity={emphEnt.opacity} transform={`translate(0, ${emphEnt.translateY})`}>
          <BentoCard x={100} y={1280} w={880} h={130} accent />
          <text x={540} y={1358} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            This distinction drives Java's <tspan fill={COLORS.accent}>entire</tspan> design
          </text>
        </g>

        {/* Tracks */}
        <line x1={60} y1={1580} x2={1020} y2={1580}
          stroke={COLORS.text_muted} strokeWidth={2.5} opacity={0.08} />
        <line x1={60} y1={1596} x2={1020} y2={1596}
          stroke={COLORS.text_muted} strokeWidth={2.5} opacity={0.08} />

        <g transform={`translate(540, ${1700 + breathe})`}>
          <circle cx={0} cy={0} r={10} fill="none" stroke={COLORS.accent}
            strokeWidth={2} opacity={0.04}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s25.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
