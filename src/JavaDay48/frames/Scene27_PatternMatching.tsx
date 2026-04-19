/**
 * Scene 27 — Pattern Matching Preview
 * "A newer version checks the type and binds it to a variable in the same line."
 * CSV: 78.820s → 82.720s | Duration: 82 frames
 *
 * Animation phases:
 *   Phase 1 (0–12): Label + headline
 *   Phase 2 (8–50): Code comparison
 *   Phase 3 (45–end): Pulse, highlight
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const MONO = "'Fira Code', 'Courier New', monospace";
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

export const Scene27_PatternMatching: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelE = useSpringEntrance(frame, 0);
  const headE = useSpringEntrance(frame, 4);
  const oldE = useSpringEntrance(frame, 10);
  const arrowE = useSpringEntrance(frame, 20);
  const newE = useSpringEntrance(frame, 26);
  const highlightE = useSpringEntrance(frame, 36);
  const noteE = useSpringEntrance(frame, 44);

  const arrowLen = 160;
  const arrowDash = usePathDraw(frame, 22, arrowLen, 16);

  const pulse = 1 + Math.sin(frame * 0.09) * 0.015;
  const breathe = Math.sin(frame * 0.06) * 3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s27.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="JAVA 16+ · PATTERN" y={160} />
        </g>

        <g transform={`translate(0, ${headE.translateY})`} opacity={headE.opacity}>
          <text x={540} y={310} textAnchor="middle" fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.white}>Check + Bind</text>
          <text x={540} y={410} textAnchor="middle" fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.accent}>Same Line</text>
        </g>

        {/* Old way */}
        <g opacity={oldE.opacity} transform={`translate(0, ${oldE.translateY})`}>
          <BentoCard x={60} y={520} w={960} h={220} />
          <text x={100} y={570} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>OLD WAY (2 steps)</text>
          <text x={100} y={630} fontFamily={MONO} fontSize={26} fontWeight={500}
            fill={COLORS.text_muted}>{'if (t instanceof ExpressTrain) {'}</text>
          <text x={100} y={672} fontFamily={MONO} fontSize={26} fontWeight={500}
            fill={COLORS.text_muted}>{'  ExpressTrain e = (ExpressTrain) t;'}</text>
          <text x={100} y={714} fontFamily={MONO} fontSize={26} fontWeight={500}
            fill={COLORS.text_muted}>{'}'}</text>
        </g>

        {/* Arrow */}
        <path d="M 540,760 L 540,860" fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeLinecap="round" strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)" opacity={arrowE.opacity} />

        {/* New way */}
        <g opacity={newE.opacity} transform={`translate(0, ${newE.translateY})`}>
          <BentoCard x={60} y={880} w={960} h={200} accent />
          <rect x={60} y={880} width={6} height={200} rx={3} fill={COLORS.accent} />
          <text x={100} y={930} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>NEW WAY (1 step — Java 16+)</text>
          <text x={100} y={990} fontFamily={MONO} fontSize={28} fontWeight={500}
            fill={COLORS.white}>{'if (t instanceof ExpressTrain e) {'}</text>
          <text x={100} y={1035} fontFamily={MONO} fontSize={26} fontWeight={500}
            fill={COLORS.text_muted}>{'  // e is already cast!'}</text>
          <text x={100} y={1065} fontFamily={MONO} fontSize={26} fontWeight={500}
            fill={COLORS.text_muted}>{'}'}</text>
        </g>

        {/* Highlight box around the binding variable */}
        <g opacity={highlightE.opacity}>
          <rect x={697} y={965} width={45} height={38} rx={6} fill="none"
            stroke={COLORS.accent} strokeWidth={2}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '720px 984px' }} />
          <text x={840} y={990} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent}>bound variable</text>
        </g>

        {/* Comparison cards */}
        <g opacity={noteE.opacity} transform={`translate(0, ${noteE.translateY})`}>
          <BentoCard x={60} y={1160} w={460} h={160} />
          <text x={290} y={1220} textAnchor="middle" fontFamily={FONT} fontSize={56} fontWeight={800}
            fill={COLORS.text_muted}>2</text>
          <text x={290} y={1270} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>steps before</text>

          <BentoCard x={560} y={1160} w={460} h={160} accent />
          <text x={790} y={1220} textAnchor="middle" fontFamily={FONT} fontSize={56} fontWeight={800}
            fill={COLORS.accent}>1</text>
          <text x={790} y={1270} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>step now</text>
        </g>

        {/* Bottom summary */}
        <g opacity={noteE.opacity} transform={`translate(0, ${noteE.translateY})`}>
          <BentoCard x={120} y={1380} w={840} h={100} />
          <text x={540} y={1442} textAnchor="middle" fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.white}>Type check + variable binding in one expression</text>
        </g>

        {/* Floating dot */}
        <circle cx={540} cy={1560 + breathe} r={4} fill={COLORS.accent} fillOpacity={0.1} />

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s27.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
