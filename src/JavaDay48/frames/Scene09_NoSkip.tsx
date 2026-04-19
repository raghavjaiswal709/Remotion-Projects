/**
 * Scene 09 — If No Skip
 * "If no, skip the block entirely."
 * CSV: 30.020s → 31.980s | Duration: 70 frames
 *
 * Animation phases:
 *   Phase 1 (0–20): Label + headline spring
 *   Phase 2 (15–45): X mark, skip arrow, grayed-out block
 *   Phase 3 (40–end): Floating elements, pulse
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

export const Scene09_NoSkip: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelE = useSpringEntrance(frame, 0);
  const headE = useSpringEntrance(frame, 5);
  const xMarkE = useSpringEntrance(frame, 10);
  const codeBlockE = useSpringEntrance(frame, 16);
  const skipArrowE = useSpringEntrance(frame, 22);
  const resultE = useSpringEntrance(frame, 28);
  const safetyE = useSpringEntrance(frame, 34);

  // X mark draw
  const xLen = 80;
  const xDash1 = usePathDraw(frame, 12, xLen, 12);
  const xDash2 = usePathDraw(frame, 14, xLen, 12);

  // Skip arrow (curved)
  const skipLen = 600;
  const skipDash = usePathDraw(frame, 24, skipLen, 25);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.1) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s09.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="FALSE BRANCH · SKIP" y={160} />
        </g>

        <g transform={`translate(0, ${headE.translateY})`} opacity={headE.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={96} fontWeight={800} fill={COLORS.vibrant_red}>
            NO
          </text>
          <text x={260} y={300} fontFamily={FONT} fontSize={96} fontWeight={800} fill={COLORS.white}>
            — Skip it
          </text>
        </g>

        {/* Large X circle */}
        <g opacity={xMarkE.opacity} transform={`translate(540, ${540 + xMarkE.translateY})`}>
          <circle cx={0} cy={0} r={100} fill={COLORS.vibrant_red} fillOpacity={0.06}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
          <circle cx={0} cy={0} r={80} fill="none" stroke={COLORS.vibrant_red} strokeWidth={3} />
          <line x1={-28} y1={-28} x2={28} y2={28}
            stroke={COLORS.vibrant_red} strokeWidth={5} strokeLinecap="round"
            strokeDasharray={xLen} strokeDashoffset={xDash1} />
          <line x1={28} y1={-28} x2={-28} y2={28}
            stroke={COLORS.vibrant_red} strokeWidth={5} strokeLinecap="round"
            strokeDasharray={xLen} strokeDashoffset={xDash2} />
        </g>

        {/* instanceof = false */}
        <g opacity={xMarkE.opacity}>
          <text x={540} y={690} textAnchor="middle" fontFamily={MONO} fontSize={36} fontWeight={800}
            fill={COLORS.vibrant_red}>
            instanceof == false
          </text>
        </g>

        {/* Grayed-out code block */}
        <g opacity={codeBlockE.opacity * 0.4} transform={`translate(0, ${codeBlockE.translateY})`}>
          <BentoCard x={60} y={740} w={960} h={240} />
          <rect x={60} y={740} width={6} height={240} rx={3} fill={COLORS.vibrant_red} opacity={0.5} />
          <text x={100} y={810} fontFamily={MONO} fontSize={30} fontWeight={500} fill={COLORS.text_muted}>
            {'// SKIPPED — not executed'}
          </text>
          <text x={100} y={860} fontFamily={MONO} fontSize={30} fontWeight={500} fill={COLORS.text_muted}>
            ExpressTrain e = (ExpressTrain) t;
          </text>
          <text x={100} y={910} fontFamily={MONO} fontSize={30} fontWeight={500} fill={COLORS.text_muted}>
            e.activateExpressMode();
          </text>
          <text x={100} y={955} fontFamily={MONO} fontSize={30} fontWeight={500} fill={COLORS.text_muted}>
            {'}'}
          </text>
          {/* Strikethrough lines */}
          <line x1={90} y1={860} x2={700} y2={860} stroke={COLORS.vibrant_red} strokeWidth={2} opacity={0.4} />
          <line x1={90} y1={910} x2={600} y2={910} stroke={COLORS.vibrant_red} strokeWidth={2} opacity={0.4} />
        </g>

        {/* Skip arrow curving around the block */}
        <path d="M 80,740 C 40,850 40,950 80,1000 L 540,1000"
          fill="none" stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round"
          strokeDasharray={skipLen} strokeDashoffset={skipDash}
          markerEnd="url(#arrow)" opacity={skipArrowE.opacity} />
        <text x={60} y={870} fontFamily={FONT} fontSize={28} fontWeight={800}
          fill={COLORS.accent} opacity={skipArrowE.opacity} transform="rotate(-90, 40, 870)">
          SKIP
        </text>

        {/* Result card */}
        <g opacity={resultE.opacity} transform={`translate(0, ${resultE.translateY})`}>
          <BentoCard x={60} y={1040} w={960} h={140} accent />
          <text x={100} y={1100} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Block
          </text>
          <text x={220} y={1100} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            entirely skipped
          </text>
          <text x={100} y={1150} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            Program continues after the if block — safely
          </text>
        </g>

        {/* Safety comparison */}
        <g opacity={safetyE.opacity} transform={`translate(0, ${safetyE.translateY})`}>
          <BentoCard x={60} y={1220} w={460} h={180} />
          <text x={100} y={1280} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.vibrant_red}>
            WITHOUT instanceof
          </text>
          <text x={100} y={1325} fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.text_muted}>
            ClassCastException
          </text>
          <text x={100} y={1368} fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.vibrant_red}>
            CRASH
          </text>

          <BentoCard x={560} y={1220} w={460} h={180} accent />
          <text x={600} y={1280} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            WITH instanceof
          </text>
          <text x={600} y={1325} fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.text_muted}>
            Block skipped
          </text>
          <text x={600} y={1368} fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.accent}>
            SAFE
          </text>
        </g>

        {/* Floating dots */}
        {[0, 1, 2, 3, 4].map(i => (
          <circle key={i} cx={150 + i * 200} cy={1520 + Math.sin(frame * 0.05 + i) * 5}
            r={3} fill={COLORS.accent} fillOpacity={0.15 * shimmer} />
        ))}

        {/* Shield at bottom center */}
        <g opacity={safetyE.opacity * 0.4} transform={`translate(540, ${1600 + breathe})`}>
          <path d="M 0,-30 L 24,-18 L 24,6 C 24,20 0,36 0,36 C 0,36 -24,20 -24,6 L -24,-18 Z"
            fill={COLORS.accent} fillOpacity={0.1} stroke={COLORS.accent} strokeWidth={1.5} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s09.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
