/**
 * Scene 08 — If Yes Proceed
 * "If yes, proceed."
 * CSV: 27.960s → 29.260s | Duration: 68 frames
 *
 * Animation phases:
 *   Phase 1 (0–20): Label + headline spring
 *   Phase 2 (15–45): Green path, checkmark, proceed arrow
 *   Phase 3 (40–end): Pulse on checkmark, floating elements
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

export const Scene08_YesProceed: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelE = useSpringEntrance(frame, 0);
  const headE = useSpringEntrance(frame, 5);
  const checkE = useSpringEntrance(frame, 10);
  const arrowCardE = useSpringEntrance(frame, 16);
  const castE = useSpringEntrance(frame, 22);
  const methodE = useSpringEntrance(frame, 28);
  const summaryE = useSpringEntrance(frame, 34);

  // Checkmark path draw
  const checkLen = 80;
  const checkDash = usePathDraw(frame, 12, checkLen, 15);

  // Proceed arrow
  const proceedLen = 500;
  const proceedDash = usePathDraw(frame, 18, proceedLen, 25);

  const breathe = Math.sin(frame * 0.07) * 4;
  const pulse = 1 + Math.sin(frame * 0.1) * 0.025;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s08.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="TRUE BRANCH · PROCEED" y={160} />
        </g>

        <g transform={`translate(0, ${headE.translateY})`} opacity={headE.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={96} fontWeight={800} fill={COLORS.accent}>
            YES
          </text>
          <text x={300} y={300} fontFamily={FONT} fontSize={96} fontWeight={800} fill={COLORS.white}>
            — Proceed
          </text>
        </g>

        {/* Large checkmark circle */}
        <g opacity={checkE.opacity} transform={`translate(540, ${550 + checkE.translateY})`}>
          <circle cx={0} cy={0} r={100} fill={COLORS.accent} fillOpacity={0.08}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
          <circle cx={0} cy={0} r={80} fill="none" stroke={COLORS.accent} strokeWidth={3} />
          <path d="M -30,0 L -8,24 L 34,-20"
            fill="none" stroke={COLORS.accent} strokeWidth={5} strokeLinecap="round"
            strokeDasharray={checkLen} strokeDashoffset={checkDash} />
        </g>

        {/* instanceof = true label */}
        <g opacity={checkE.opacity}>
          <text x={540} y={700} textAnchor="middle" fontFamily={MONO} fontSize={36} fontWeight={800}
            fill={COLORS.accent}>
            instanceof == true
          </text>
        </g>

        {/* Proceed arrow — horizontal */}
        <g opacity={arrowCardE.opacity}>
          <BentoCard x={60} y={760} w={960} h={80} accent />
          <line x1={100} y1={800} x2={980} y2={800}
            stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round"
            strokeDasharray={proceedLen} strokeDashoffset={proceedDash}
            markerEnd="url(#arrow)" />
          <text x={540} y={790} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>
            SAFE TO CONTINUE
          </text>
        </g>

        {/* Step 1: Cast */}
        <g opacity={castE.opacity} transform={`translate(0, ${castE.translateY})`}>
          <BentoCard x={60} y={880} w={460} h={220} accent />
          <rect x={60} y={880} width={6} height={220} rx={3} fill={COLORS.accent} />
          <text x={100} y={940} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            STEP 1
          </text>
          <text x={100} y={990} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Downcast safely
          </text>
          <text x={100} y={1050} fontFamily={MONO} fontSize={30} fontWeight={500} fill={COLORS.accent}>
            ExpressTrain e =
          </text>
          <text x={100} y={1085} fontFamily={MONO} fontSize={30} fontWeight={500} fill={COLORS.accent}>
            {'  (ExpressTrain) t;'}
          </text>
        </g>

        {/* Step 2: Use methods */}
        <g opacity={methodE.opacity} transform={`translate(0, ${methodE.translateY})`}>
          <BentoCard x={560} y={880} w={460} h={220} />
          <text x={600} y={940} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            STEP 2
          </text>
          <text x={600} y={990} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Access methods
          </text>
          <text x={600} y={1050} fontFamily={MONO} fontSize={30} fontWeight={500} fill={COLORS.accent}>
            e.activateExpress
          </text>
          <text x={600} y={1085} fontFamily={MONO} fontSize={30} fontWeight={500} fill={COLORS.accent}>
            {'  Mode();'}
          </text>
        </g>

        {/* Arrow between steps */}
        <line x1={520} y1={990} x2={560} y2={990}
          stroke={COLORS.accent} strokeWidth={2} markerEnd="url(#arrow)"
          opacity={methodE.opacity * 0.6} />

        {/* Summary */}
        <g opacity={summaryE.opacity}>
          <BentoCard x={60} y={1140} w={960} h={140} />
          <text x={100} y={1200} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Type confirmed
          </text>
          <text x={500} y={1200} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}>
            → cast is guaranteed safe
          </text>
          <text x={100} y={1252} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            No ClassCastException possible in this branch
          </text>
        </g>

        {/* Green flow visual */}
        <g opacity={summaryE.opacity * 0.3}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
            <rect key={i} x={100 + i * 120} y={1340} width={80} height={8} rx={4}
              fill={COLORS.accent} fillOpacity={0.1 + i * 0.03} />
          ))}
        </g>

        {/* Train moving forward */}
        <g opacity={summaryE.opacity} transform={`translate(${interpolate(frame, [34, 60], [-100, 540], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}, 1450)`}>
          <rect x={-80} y={-20} width={160} height={40} rx={8} fill={COLORS.accent} fillOpacity={0.2} />
          <rect x={-60} y={-30} width={40} height={20} rx={4} fill={COLORS.accent} fillOpacity={0.3} />
          <circle cx={-50} cy={25} r={12} fill={COLORS.accent} fillOpacity={0.4} />
          <circle cx={50} cy={25} r={12} fill={COLORS.accent} fillOpacity={0.4} />
          <line x1={80} y1={0} x2={140} y2={0} stroke={COLORS.accent} strokeWidth={2} opacity={0.3} />
        </g>

        {/* Floating particles */}
        {[0, 1, 2, 3].map(i => (
          <circle key={i} cx={200 + i * 220} cy={1600 + Math.sin(frame * 0.06 + i) * 5}
            r={3} fill={COLORS.accent} fillOpacity={0.15 * shimmer} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s08.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
