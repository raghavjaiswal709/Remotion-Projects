/**
 * Scene 21 — That Is Downcasting
 * "That is downcasting."
 * CSV: 73.760s → 75.400s
 *
 * Animation phases:
 *   Phase 1 (0–20): Label + headline
 *   Phase 2 (14–50): Giant word reveal, arrow pointing down, type hierarchy
 *   Phase 3 (40–end): Pulse, glow
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

export const Scene21_ThatIsDowncasting: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headEnt = useSpringEntrance(frame, 4);

  // Giant word "DOWNCASTING" — dramatic entrance
  const wordPop = spring({ frame: Math.max(0, frame - 8), fps, config: SPRING_SNAP });
  const wordScale = interpolate(wordPop, [0, 1], [0.6, 1]);
  const wordOp = interpolate(wordPop, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' });

  // Ghost behind
  const ghostOp = interpolate(frame, [10, 20], [0, 0.06], { extrapolateRight: 'clamp' });

  // Down arrow
  const arrowLen = 300;
  const arrowDash = usePathDraw(frame, 14, arrowLen, 22);

  // Type hierarchy — Train on top, ExpressTrain below
  const topBox = useSpringEntrance(frame, 18);
  const botBox = useSpringEntrance(frame, 24);
  const hierArrow = usePathDraw(frame, 26, 140, 20);

  // Definition card
  const defEnt = useSpringEntrance(frame, 30);

  // Insight
  const insightEnt = useSpringEntrance(frame, 36);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s21.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="KEY CONCEPT" y={130} />
        </g>

        <g transform={`translate(0, ${headEnt.translateY})`} opacity={headEnt.opacity}>
          <text x={60} y={280} fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.white}>
            That is
          </text>
        </g>

        {/* Giant DOWNCASTING word */}
        <g opacity={wordOp} transform={`translate(540, 460) scale(${wordScale})`}
          style={{ transformOrigin: '0px 0px' }}>
          <text x={0} y={0} textAnchor="middle" fontFamily={FONT} fontSize={100} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            DOWNCASTING
          </text>
        </g>

        {/* Ghost layer */}
        <text x={540} y={470} textAnchor="middle" fontFamily={FONT} fontSize={160} fontWeight={800}
          fill={COLORS.accent} opacity={ghostOp}>
          DOWNCASTING
        </text>

        {/* Down arrow */}
        <path d="M 540,510 L 540,700"
          fill="none" stroke={COLORS.accent} strokeWidth={4}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        {/* Type hierarchy */}
        <g opacity={topBox.opacity} transform={`translate(0, ${topBox.translateY})`}>
          <BentoCard x={340} y={730} w={400} h={90} />
          <text x={540} y={785} textAnchor="middle" fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Train
          </text>
          <text x={540} y={810} textAnchor="middle" fontFamily={FONT} fontSize={18} fontWeight={800} fill={COLORS.text_muted}>
            PARENT TYPE
          </text>
        </g>

        <line x1={540} y1={820} x2={540} y2={880}
          stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={140} strokeDashoffset={hierArrow}
          markerEnd="url(#arrow)" />

        <g opacity={botBox.opacity} transform={`translate(0, ${botBox.translateY})`}>
          <BentoCard x={340} y={880} w={400} h={90} accent />
          <text x={540} y={935} textAnchor="middle" fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>
            ExpressTrain
          </text>
          <text x={540} y={960} textAnchor="middle" fontFamily={FONT} fontSize={18} fontWeight={800} fill={COLORS.text_muted}>
            CHILD TYPE — cast DOWN to reach
          </text>
        </g>

        {/* "DOWN" label on arrow */}
        <g opacity={topBox.opacity}>
          <text x={570} y={860} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            DOWN
          </text>
        </g>

        {/* Definition card */}
        <g opacity={defEnt.opacity} transform={`translate(0, ${defEnt.translateY})`}>
          <BentoCard x={60} y={1030} w={960} h={140} accent />
          <rect x={60} y={1030} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={100} y={1080} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent} letterSpacing="0.08em">
            DEFINITION
          </text>
          <text x={100} y={1120} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.white}>
            Casting a parent reference back down to the
          </text>
          <text x={100} y={1155} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.white}>
            child type to access subtype-specific features
          </text>
        </g>

        {/* Insight */}
        <g opacity={insightEnt.opacity} transform={`translate(0, ${insightEnt.translateY})`}>
          <BentoCard x={60} y={1230} w={960} h={100} />
          <text x={540} y={1290} textAnchor="middle" fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.text_muted}>
            Upcasting goes UP the hierarchy — downcasting goes
            <tspan fill={COLORS.accent}> DOWN</tspan>
          </text>
        </g>

        {/* Rail */}
        <g opacity={0.1}>
          <line x1={60} y1={1420} x2={1020} y2={1420} stroke={COLORS.text_muted} strokeWidth={2} />
        </g>

        {/* Float */}
        <g transform={`translate(540, ${1540 + breathe})`}>
          <circle cx={0} cy={0} r={16} fill="none" stroke={COLORS.accent} strokeWidth={1}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} opacity={0.12} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s21.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
