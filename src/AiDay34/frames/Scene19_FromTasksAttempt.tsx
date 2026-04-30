/**
 * Scene 19 — From Tasks Attempt
 * "from tasks an agent can only attempt."
 * CSV: 69.180s → 71.680s | Duration: 75 frames (2.50s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–20):  Label + headline spring in
 *   Phase 2 (frames 18–60): "attempt" box with X marks, contrast compare
 *   Phase 3 (frames 60–end): Floating summary card with breathe
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
import { DarkBackground, GlobalDefs, Caption, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30, cfg = SPRING_CONFIG) {
  const f = Math.max(0, frame - delay);
  const progress   = spring({ frame: f, fps, config: cfg });
  const opacity    = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, start: number, len: number, dur = 18) {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return len * (1 - p);
}

export const Scene19_FromTasksAttempt: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  const labelEnter  = useSpringEntrance(frame, 0);
  const headEnter   = useSpringEntrance(frame, 5);
  const attemptCard = useSpringEntrance(frame, 18);
  const xMark1      = useSpringEntrance(frame, 30);
  const xMark2      = useSpringEntrance(frame, 42);
  const compCard    = useSpringEntrance(frame, 50);
  const summCard    = useSpringEntrance(frame, 60);

  const xLen = 36;
  const x1Dash = usePathDraw(frame, 30, xLen, 10);
  const x2Dash = usePathDraw(frame, 42, xLen, 10);

  const breathe = Math.sin(frame * 0.07) * 3;
  const pulse   = 1 + Math.sin(frame * 0.09) * 0.015;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s19.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="AGENTIC AI · TASK DECOMPOSITION · ATTEMPT" y={140} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headEnter.translateY})`} opacity={headEnter.opacity}>
          <text x={60} y={264}
            fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.white}>
            Can only
          </text>
          <text x={60} y={360}
            fontFamily={FONT} fontSize={80} fontWeight={800}
            fill="#F7374F" fontStyle="italic">
            attempt
          </text>
        </g>

        {/* Attempt card with X marks */}
        <g opacity={attemptCard.opacity} transform={`translate(0, ${attemptCard.translateY})`}>
          <rect x={60} y={420} width={960} height={200} rx={20}
            fill={COLORS.bg_secondary}
            stroke="#F7374F" strokeWidth={2} />
          <text x={540} y={490} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.white}>
            Goal: Write full market analysis report
          </text>
          <text x={540} y={546} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>
            (without decomposition — single step)
          </text>
          <text x={540} y={600} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill="#F7374F">
            OUTPUT: incomplete · unfocused · fails
          </text>
        </g>

        {/* X marks on the attempt card */}
        <g opacity={xMark1.opacity}>
          <path d="M 100,450 L 136,486"
            stroke="#F7374F" strokeWidth={3} strokeLinecap="round"
            strokeDasharray={xLen} strokeDashoffset={x1Dash} />
          <path d="M 136,450 L 100,486"
            stroke="#F7374F" strokeWidth={3} strokeLinecap="round"
            strokeDasharray={xLen} strokeDashoffset={x1Dash} />
        </g>

        {/* Contrast comparison — two column */}
        <g opacity={compCard.opacity} transform={`translate(0, ${compCard.translateY})`}>
          {/* Without */}
          <rect x={60} y={680} width={450} height={220} rx={20}
            fill={COLORS.bg_secondary}
            stroke="#F7374F" strokeWidth={1.5} />
          <text x={285} y={720} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill="#F7374F" letterSpacing="0.1em">
            WITHOUT
          </text>
          <text x={285} y={760} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            DECOMPOSITION
          </text>
          <text x={285} y={820} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.white}>
            Can only attempt
          </text>
          <text x={285} y={876} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            Partial, broken output
          </text>

          {/* With */}
          <rect x={570} y={680} width={450} height={220} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={795} y={720} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            WITH
          </text>
          <text x={795} y={760} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            DECOMPOSITION
          </text>
          <text x={795} y={820} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.white}>
            Can complete
          </text>
          <text x={795} y={876} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            Full, structured output
          </text>
        </g>

        {/* Summary card */}
        <g opacity={summCard.opacity}
          transform={`translate(0, ${summCard.translateY + breathe})`}>
          <rect x={60} y={960} width={960} height={130} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2} />
          <rect x={60} y={960} width={6} height={130} rx={3} fill={COLORS.accent} />
          <text x={540} y={1016} textAnchor="middle"
            fontFamily={FONT} fontSize={38} fontWeight={800}
            fill={COLORS.white}>
            The key divide in capability
          </text>
          <text x={540} y={1064} textAnchor="middle"
            fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            attempt vs. complete
          </text>
        </g>

        {/* Round decorative pulsing element */}
        <g transform={`translate(540, 1200)`}>
          <circle cx={0} cy={0} r={48}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            transform={`scale(${pulse})`}
            opacity={summCard.opacity * 0.5} />
          <circle cx={0} cy={0} r={30}
            fill={COLORS.accent} fillOpacity={0.1 * summCard.opacity} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s19.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
