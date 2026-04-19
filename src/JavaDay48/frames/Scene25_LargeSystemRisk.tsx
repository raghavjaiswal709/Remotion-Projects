/**
 * Scene 25 — Large System Risk
 * "In a large system, that assumption will eventually be wrong."
 * CSV: 72.540s → 75.500s | Duration: 77 frames
 *
 * Animation phases:
 *   Phase 1 (0–12): Label + headline
 *   Phase 2 (8–45): System grid + failure
 *   Phase 3 (40–end): Pulse, cracks
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, start: number, len: number, dur = 30) {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return len * (1 - p);
}

export const Scene25_LargeSystemRisk: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelE = useSpringEntrance(frame, 0);
  const headE = useSpringEntrance(frame, 4);
  const gridE = useSpringEntrance(frame, 10);
  const crackE = useSpringEntrance(frame, 22);
  const textE = useSpringEntrance(frame, 30);
  const bottomE = useSpringEntrance(frame, 38);

  const crackLen = 300;
  const crackDash = usePathDraw(frame, 24, crackLen, 20);

  const pulse = 1 + Math.sin(frame * 0.1) * 0.012;
  const breathe = Math.sin(frame * 0.06) * 3;

  // Grid of service nodes
  const COLS = 6;
  const ROWS = 4;
  const CELL = 120;
  const gridX = (1080 - COLS * CELL) / 2;
  const gridY = 520;
  const failNode = { r: 3, c: 4 }; // The node that fails

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s25.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="SCALE · FAILURE" y={160} />
        </g>

        <g transform={`translate(0, ${headE.translateY})`} opacity={headE.opacity}>
          <text x={540} y={310} textAnchor="middle" fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.white}>Large System</text>
          <text x={540} y={410} textAnchor="middle" fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.vibrant_red}>Will Be Wrong</text>
        </g>

        {/* Service grid */}
        <g opacity={gridE.opacity} transform={`translate(0, ${gridE.translateY})`}>
          {Array.from({ length: ROWS }, (_, r) =>
            Array.from({ length: COLS }, (_, c) => {
              const cx = gridX + c * CELL + CELL / 2;
              const cy = gridY + r * CELL + CELL / 2;
              const isFail = r === failNode.r && c === failNode.c;
              const nodeDelay = (r * COLS + c) * 1.5;
              const nodeOp = interpolate(frame, [12 + nodeDelay, 18 + nodeDelay], [0, 1], {
                extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
              });
              return (
                <g key={`${r}-${c}`} opacity={nodeOp}>
                  <rect x={cx - 40} y={cy - 28} width={80} height={56} rx={8}
                    fill={isFail ? COLORS.vibrant_red : COLORS.bg_secondary}
                    fillOpacity={isFail ? 0.2 : 1}
                    stroke={isFail ? COLORS.vibrant_red : 'rgba(255,255,255,0.1)'}
                    strokeWidth={isFail ? 2 : 1} />
                  {isFail && (
                    <text x={cx} y={cy + 7} textAnchor="middle" fontFamily={FONT} fontSize={24}
                      fontWeight={800} fill={COLORS.vibrant_red}
                      transform={`scale(${pulse})`} style={{ transformOrigin: `${cx}px ${cy}px` }}>
                      FAIL
                    </text>
                  )}
                  {!isFail && (
                    <circle cx={cx} cy={cy} r={4} fill={COLORS.accent} fillOpacity={0.4} />
                  )}
                </g>
              );
            })
          )}
        </g>

        {/* Crack lines from fail node */}
        <g opacity={crackE.opacity}>
          <path d={`M ${gridX + failNode.c * CELL + CELL / 2},${gridY + failNode.r * CELL + CELL / 2} L ${gridX + failNode.c * CELL + CELL / 2 + 80},${gridY + failNode.r * CELL + CELL / 2 + 120}`}
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={2} strokeLinecap="round"
            strokeDasharray={crackLen} strokeDashoffset={crackDash} />
          <path d={`M ${gridX + failNode.c * CELL + CELL / 2},${gridY + failNode.r * CELL + CELL / 2} L ${gridX + failNode.c * CELL + CELL / 2 - 60},${gridY + failNode.r * CELL + CELL / 2 + 100}`}
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={2} strokeLinecap="round"
            strokeDasharray={crackLen} strokeDashoffset={crackDash} />
        </g>

        {/* Warning text */}
        <g opacity={textE.opacity} transform={`translate(0, ${textE.translateY})`}>
          <BentoCard x={60} y={1060} w={960} h={160} accent />
          <rect x={60} y={1060} width={6} height={160} rx={3} fill={COLORS.vibrant_red} />
          <text x={540} y={1125} textAnchor="middle" fontFamily={FONT} fontSize={38} fontWeight={800}
            fill={COLORS.white}>One unverified cast in thousands</text>
          <text x={540} y={1178} textAnchor="middle" fontFamily={FONT} fontSize={38} fontWeight={800}
            fill={COLORS.vibrant_red}>of lines — system goes down</text>
        </g>

        {/* Bottom note */}
        <g opacity={bottomE.opacity} transform={`translate(0, ${bottomE.translateY})`}>
          <BentoCard x={60} y={1280} w={460} h={140} />
          <text x={290} y={1340} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>Assumption</text>
          <text x={290} y={1385} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.vibrant_red}>Dangerous</text>

          <BentoCard x={560} y={1280} w={460} h={140} />
          <text x={790} y={1340} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>Verification</text>
          <text x={790} y={1385} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent}>Safe</text>
        </g>

        {/* Floating dots */}
        {[0, 1, 2].map(i => (
          <circle key={i} cx={300 + i * 240} cy={1520 + breathe * (i + 1) * 0.3}
            r={3} fill={COLORS.vibrant_red} fillOpacity={0.06} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s25.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
