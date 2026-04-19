/**
 * Scene 06 — This Asks Java
 * "This asks Java,"
 * CSV: 22.560s → 23.560s | Duration: 44 frames
 *
 * Animation phases:
 *   Phase 1 (0–20): Label + headline spring
 *   Phase 2 (15–35): Speech bubble from code to JVM, question mark
 *   Phase 3 (30–end): Pulse on question mark
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const MONO = "'Fira Code', 'Courier New', monospace";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;
const SPRING_SOFT = { damping: 22, stiffness: 120, mass: 1.0 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, dur = 30) {
  const p = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - p);
}

export const Scene06_AsksJava: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // Phase 1
  const labelE = useSpringEntrance(frame, 0);
  const headE = useSpringEntrance(frame, 4);

  // Phase 2
  const codeBoxE = useSpringEntrance(frame, 8);
  const arrowE = useSpringEntrance(frame, 14);
  const jvmBoxE = useSpringEntrance(frame, 18);
  const bubbleE = useSpringEntrance(frame, 12);
  const questionE = useSpringEntrance(frame, 20);

  // Arrow path draw
  const arrowLen = 320;
  const arrowDash = usePathDraw(frame, 14, arrowLen, 18);

  // Phase 3
  const breathe = Math.sin(frame * 0.08) * 5;
  const pulse = 1 + Math.sin(frame * 0.12) * 0.03;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.8, 1]);

  // Question mark bounce
  const qBounce = Math.sin(frame * 0.15) * 6;
  const qScale = 1 + Math.sin(frame * 0.1) * 0.04;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s06.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A */}
        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="RUNTIME · QUESTION" y={160} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headE.translateY})`} opacity={headE.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.white}>
            Asking the
          </text>
          <text x={60} y={400} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.accent}>
            JVM
          </text>
        </g>

        {/* Zone C — Code box (left) */}
        <g opacity={codeBoxE.opacity} transform={`translate(0, ${codeBoxE.translateY})`}>
          <BentoCard x={60} y={500} w={400} h={300} accent />
          <rect x={60} y={500} width={6} height={300} rx={3} fill={COLORS.accent} />
          <text x={100} y={570} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            YOUR CODE
          </text>
          <text x={100} y={630} fontFamily={MONO} fontSize={32} fontWeight={500} fill={COLORS.white}>
            if (t instanceof
          </text>
          <text x={100} y={670} fontFamily={MONO} fontSize={32} fontWeight={500} fill={COLORS.white}>
            {'  ExpressTrain)'}
          </text>
          {/* Code icon — curly braces */}
          <text x={260} y={760} textAnchor="middle" fontFamily={MONO} fontSize={60} fontWeight={800}
            fill={COLORS.accent} fillOpacity={0.15}>
            {'{ }'}
          </text>
        </g>

        {/* Arrow from code to JVM */}
        <line x1={460} y1={650} x2={620} y2={650}
          stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round"
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)" />

        {/* Speech bubble above arrow */}
        <g opacity={bubbleE.opacity} transform={`translate(540, ${580 + bubbleE.translateY})`}>
          <rect x={-80} y={-40} width={160} height={50} rx={12}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={1.5} />
          <polygon points="-10,10 10,10 0,24" fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={0} y={-8} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>
            Is it?
          </text>
        </g>

        {/* JVM box (right) */}
        <g opacity={jvmBoxE.opacity} transform={`translate(0, ${jvmBoxE.translateY})`}>
          <BentoCard x={620} y={500} w={400} h={300} />
          <text x={660} y={570} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            JAVA RUNTIME
          </text>
          {/* JVM icon — gear */}
          <circle cx={820} cy={690} r={60} fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            opacity={shimmer} />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 820 + Math.cos(rad) * 52;
            const y1 = 690 + Math.sin(rad) * 52;
            const x2 = 820 + Math.cos(rad) * 72;
            const y2 = 690 + Math.sin(rad) * 72;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" opacity={shimmer} />;
          })}
          <circle cx={820} cy={690} r={20} fill={COLORS.accent} fillOpacity={0.15} />
          <text x={820} y={698} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent}>
            JVM
          </text>
        </g>

        {/* Big question mark */}
        <g opacity={questionE.opacity}
          transform={`translate(540, ${950 + qBounce}) scale(${qScale})`}
          style={{ transformOrigin: '540px 950px' }}>
          <text x={0} y={0} textAnchor="middle" fontFamily={FONT} fontSize={280} fontWeight={800}
            fill={COLORS.accent} fillOpacity={0.08}>
            ?
          </text>
          <text x={0} y={0} textAnchor="middle" fontFamily={FONT} fontSize={220} fontWeight={800}
            fill={COLORS.accent}>
            ?
          </text>
        </g>

        {/* Explanation cards */}
        <g opacity={questionE.opacity} transform={`translate(0, ${questionE.translateY})`}>
          <BentoCard x={60} y={1200} w={960} h={140} accent />
          <text x={100} y={1265} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Your code asks the JVM a
          </text>
          <text x={100} y={1315} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            runtime question
          </text>
        </g>

        <g opacity={jvmBoxE.opacity}>
          <BentoCard x={60} y={1370} w={460} h={140} />
          <text x={100} y={1430} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Code says:
          </text>
          <text x={100} y={1475} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>
            "Check this type"
          </text>
          <BentoCard x={560} y={1370} w={460} h={140} />
          <text x={600} y={1430} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            JVM responds:
          </text>
          <text x={600} y={1475} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>
            true or false
          </text>
        </g>

        {/* Floating dots */}
        {[0, 1, 2, 3, 4].map(i => (
          <circle key={i} cx={140 + i * 200} cy={1600 + Math.sin(frame * 0.06 + i * 1.2) * 5}
            r={3} fill={COLORS.accent} fillOpacity={0.2} />
        ))}

        {/* Radial rings around question */}
        {[80, 110, 140].map((r, i) => (
          <circle key={i} cx={540} cy={920} r={r}
            fill="none" stroke={COLORS.accent} strokeWidth={1}
            opacity={0.04 + i * 0.02} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s06.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
