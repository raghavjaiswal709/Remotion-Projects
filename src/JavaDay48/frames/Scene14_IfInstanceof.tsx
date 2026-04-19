/**
 * Scene 14 — If T instanceof ExpressTrain
 * "If T instance of Express Train."
 * CSV: 43.960s → 46.020s | Duration: 62 frames
 *
 * Animation phases:
 *   Phase 1 (0–20): Label + headline
 *   Phase 2 (15–45): Code block + check visual
 *   Phase 3 (40–end): Pulse, shimmer
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const MONO = "'Fira Code', 'Courier New', monospace";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

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

export const Scene14_IfInstanceof: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelE = useSpringEntrance(frame, 0);
  const headE = useSpringEntrance(frame, 5);
  const codeE = useSpringEntrance(frame, 12);
  const arrowE = useSpringEntrance(frame, 18);
  const checkE = useSpringEntrance(frame, 22);
  const resultE = useSpringEntrance(frame, 28);
  const trainE = useSpringEntrance(frame, 32);
  const noteE = useSpringEntrance(frame, 36);

  const checkLen = 40;
  const checkDash = usePathDraw(frame, 22, checkLen, 15);
  const underlineLen = 300;
  const underlineDash = usePathDraw(frame, 16, underlineLen, 20);

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s14.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="INSTANCEOF · CHECK" y={160} />
        </g>

        <g transform={`translate(0, ${headE.translateY})`} opacity={headE.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            The If Check
          </text>
          <text x={60} y={390} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent}>
            First branch — ExpressTrain
          </text>
        </g>

        {/* Code block */}
        <g opacity={codeE.opacity} transform={`translate(0, ${codeE.translateY})`}>
          <BentoCard x={60} y={480} w={960} h={180} accent />
          <rect x={60} y={480} width={6} height={180} rx={3} fill={COLORS.accent} />
          <text x={100} y={550} fontFamily={MONO} fontSize={32} fontWeight={500} fill={COLORS.accent}>
            {'if'}
          </text>
          <text x={150} y={550} fontFamily={MONO} fontSize={32} fontWeight={500} fill={COLORS.white}>
            {'(t'}
          </text>
          <text x={220} y={550} fontFamily={MONO} fontSize={32} fontWeight={500} fill={COLORS.accent}
            fontStyle="italic">
            {'instanceof'}
          </text>
          <text x={480} y={550} fontFamily={MONO} fontSize={32} fontWeight={500} fill={COLORS.white}>
            {'ExpressTrain)'}
          </text>
          {/* Underline on instanceof */}
          <line x1={220} y1={560} x2={460} y2={560}
            stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round"
            strokeDasharray={underlineLen} strokeDashoffset={underlineDash} />
          <text x={100} y={630} fontFamily={MONO} fontSize={28} fontWeight={500} fill={COLORS.text_muted}>
            {'  // → checks runtime type of t'}
          </text>
        </g>

        {/* Train illustration — ExpressTrain */}
        <g opacity={trainE.opacity} transform={`translate(0, ${trainE.translateY})`}>
          <BentoCard x={60} y={720} w={960} h={320} />
          {/* Locomotive body */}
          <g transform={`translate(${300 + breathe * 2}, 780)`}>
            <rect x={0} y={40} width={400} height={100} rx={12} fill={COLORS.accent} fillOpacity={0.2}
              stroke={COLORS.accent} strokeWidth={2} />
            <rect x={-60} y={50} width={60} height={80} rx={8} fill={COLORS.accent} fillOpacity={0.15}
              stroke={COLORS.accent} strokeWidth={1.5} />
            {/* Cab window */}
            <rect x={20} y={55} width={80} height={40} rx={6} fill={COLORS.accent} fillOpacity={0.1}
              stroke={COLORS.accent} strokeWidth={1} />
            {/* Smokestack */}
            <rect x={300} y={15} width={30} height={30} rx={4} fill={COLORS.accent} fillOpacity={0.2} />
            {/* Wheels */}
            <circle cx={60} cy={148} r={18} fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
            <circle cx={140} cy={148} r={18} fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
            <circle cx={260} cy={148} r={18} fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
            <circle cx={340} cy={148} r={18} fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
            {/* Track */}
            <line x1={-100} y1={168} x2={500} y2={168} stroke={COLORS.text_muted} strokeWidth={2} />
            <line x1={-100} y1={174} x2={500} y2={174} stroke={COLORS.text_muted} strokeWidth={2} />
            {/* Cross-ties */}
            {Array.from({ length: 12 }, (_, i) => (
              <rect key={i} x={-80 + i * 50} y={168} width={20} height={8} rx={1}
                fill={COLORS.text_muted} fillOpacity={0.3} />
            ))}
            {/* Label */}
            <text x={200} y={100} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
              fill={COLORS.accent}>EXPRESS</text>
          </g>
        </g>

        {/* Checkmark result */}
        <g opacity={checkE.opacity} transform={`translate(0, ${checkE.translateY})`}>
          <BentoCard x={60} y={1080} w={460} h={180} accent />
          <g transform="translate(160, 1170)">
            <circle cx={0} cy={0} r={28} fill={COLORS.accent} fillOpacity={0.15}
              stroke={COLORS.accent} strokeWidth={2}
              transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
            <path d="M -12,0 L -4,10 L 14,-10" fill="none" stroke={COLORS.accent}
              strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray={checkLen} strokeDashoffset={checkDash} />
          </g>
          <text x={210} y={1160} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Type matches
          </text>
          <text x={210} y={1200} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Returns true
          </text>
        </g>

        {/* Arrow */}
        <g opacity={arrowE.opacity}>
          <text x={580} y={1170} fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.accent}>
            →
          </text>
        </g>

        {/* Result action */}
        <g opacity={resultE.opacity} transform={`translate(0, ${resultE.translateY})`}>
          <BentoCard x={620} y={1080} w={400} h={180} />
          <text x={820} y={1160} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>Enter block</text>
          <text x={820} y={1200} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>Safe to cast</text>
        </g>

        {/* Note */}
        <g opacity={noteE.opacity} transform={`translate(0, ${noteE.translateY})`}>
          <BentoCard x={60} y={1310} w={960} h={120} />
          <text x={100} y={1380} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            This single line prevents
          </text>
          <text x={580} y={1380} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.vibrant_red}>
            ClassCastException
          </text>
        </g>

        {/* Floating dots */}
        {[0, 1, 2, 3, 4].map(i => (
          <circle key={i} cx={100 + i * 220} cy={1530 + Math.sin(frame * 0.05 + i * 1.2) * breathe}
            r={3} fill={COLORS.accent} fillOpacity={0.15 * shimmer} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s14.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
