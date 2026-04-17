/**
 * Scene 19 — Before The Program Runs
 * "This happens before the program runs."
 * CSV: 72.020s → 74.220s
 * Duration: ~66 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline
 *   Phase 2 (18–50): Timeline: compile phase vs run phase
 *   Phase 3 (45–end): Micro animations
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

export const Scene19_BeforeProgramRuns: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 6);
  const h2 = useSpringEntrance(frame, 12);

  const timelineEnt = useSpringEntrance(frame, 16);
  const compileBox = useSpringEntrance(frame, 22);
  const dividerEnt = useSpringEntrance(frame, 28);
  const runBox = useSpringEntrance(frame, 34);
  const arrowEnt = useSpringEntrance(frame, 20);

  const arrowLen = 860;
  const arrowDash = usePathDraw(frame, 22, arrowLen, 35);

  const heroEnt = useSpringEntrance(frame, 40);

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.012;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s19.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="TIMING · COMPILE PHASE" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={76} fontWeight={800} fill={COLORS.white}>
            Before It Runs
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}>
            Decision Already Made
          </text>
        </g>

        {/* Timeline arrow */}
        <g opacity={arrowEnt.opacity}>
          <path d="M 100,560 L 960,560"
            fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
            markerEnd="url(#arrow)" strokeLinecap="round" />
          <text x={100} y={540}
            fontFamily={FONT} fontSize={20} fontWeight={800} fill={COLORS.text_muted}>
            TIME
          </text>
        </g>

        {/* Compile phase — left */}
        <g opacity={compileBox.opacity} transform={`translate(0, ${compileBox.translateY})`}>
          <rect x={100} y={600} width={380} height={480} rx={20}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2.5} />
          <rect x={100} y={600} width={380} height={60} rx={20}
            fill={COLORS.accent} opacity={0.12} />
          <rect x={100} y={640} width={380} height={20}
            fill={COLORS.bg_secondary} />
          <text x={290} y={640} textAnchor="middle"
            fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.accent}>
            COMPILE TIME
          </text>

          {/* Compiler activities */}
          {['Parse .java', 'Type check', 'Resolve overloads', 'Generate .class'].map((t, i) => (
            <g key={i}>
              <circle cx={135} cy={720 + i * 80} r={8}
                fill={COLORS.accent} opacity={0.3 + i * 0.15} />
              <text x={160} y={728 + i * 80}
                fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.white}>
                {t}
              </text>
            </g>
          ))}

          {/* Checkmark badge */}
          <rect x={340} y={1010} width={120} height={40} rx={12}
            fill={COLORS.accent} opacity={0.15} />
          <text x={400} y={1037} textAnchor="middle"
            fontFamily={FONT} fontSize={16} fontWeight={800} fill={COLORS.accent}>
            DECIDED
          </text>
        </g>

        {/* Divider line */}
        <g opacity={dividerEnt.opacity}>
          <line x1={540} y1={600} x2={540} y2={1080}
            stroke="rgba(255,255,255,0.12)" strokeWidth={2}
            strokeDasharray="8 6" />
          <text x={540} y={1120} textAnchor="middle"
            fontFamily={FONT} fontSize={18} fontWeight={800} fill={COLORS.text_muted}>
            BOUNDARY
          </text>
        </g>

        {/* Run phase — right (dimmed) */}
        <g opacity={runBox.opacity * 0.4} transform={`translate(0, ${runBox.translateY})`}>
          <rect x={600} y={600} width={380} height={480} rx={20}
            fill={COLORS.bg_secondary} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
          <text x={790} y={640} textAnchor="middle"
            fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted}>
            RUN TIME
          </text>
          <text x={790} y={840} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            Too late
          </text>
          <text x={790} y={890} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
            Already resolved
          </text>
        </g>

        {/* Hero stat */}
        <g opacity={heroEnt.opacity} transform={`translate(0, ${heroEnt.translateY})`}>
          <BentoCard x={60} y={1200} w={960} h={200} accent />
          <text x={540} y={1300} textAnchor="middle"
            fontFamily={FONT} fontSize={60} fontWeight={800} fill={COLORS.accent}>
            .java → .class
          </text>
          <text x={540} y={1360} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Overload resolved during compilation
          </text>
        </g>

        {/* Track */}
        <line x1={60} y1={1560} x2={1020} y2={1560}
          stroke={COLORS.text_muted} strokeWidth={2.5} opacity={0.1} />
        <line x1={60} y1={1576} x2={1020} y2={1576}
          stroke={COLORS.text_muted} strokeWidth={2.5} opacity={0.1} />

        {/* Ties */}
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x={100 + i * 80} y={1553} width={30} height={30}
            fill="rgba(255,255,255,0.02)" rx={2} />
        ))}

        <circle cx={540} cy={1680 + breathe} r={10}
          fill="none" stroke={COLORS.accent} strokeWidth={2}
          opacity={0.06}
          transform={`scale(${pulse})`}
          style={{ transformOrigin: '540px 1680px' }} />

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s19.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
