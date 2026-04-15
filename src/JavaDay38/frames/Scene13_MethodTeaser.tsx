/**
 * Scene 13 — Method Teaser
 * "Now, a variable at the class level is useful, but what about a method
 *  that also belongs to the class? One that needs no object to run?"
 * CSV: 70.200s → 79.520s
 * Duration: 280 frames (9.3s)
 *
 * Animation phases:
 *   Phase 1 (0–25):  Label + headline
 *   Phase 2 (20–80): Method silhouette card, question, arrow
 *   Phase 3 (75–end): Pulse, float
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, FPS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
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

export const Scene13_MethodTeaser: React.FC = () => {
  const frame = useCurrentFrame();

  const label    = useSpringEntrance(frame, 0);
  const headline = useSpringEntrance(frame, 6);
  const subline  = useSpringEntrance(frame, 14);
  const varCard  = useSpringEntrance(frame, 22);
  const arrow    = useSpringEntrance(frame, 40);
  const methodCard = useSpringEntrance(frame, 48);
  const question = useSpringEntrance(frame, 60);
  const summary  = useSpringEntrance(frame, 75);

  const breathe = Math.sin(frame * 0.05) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const arrowLen = 250;
  const arrowDash = usePathDraw(frame, 45, arrowLen, 25);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s13.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0,${label.translateY})`} opacity={label.opacity}>
          <SectionLabel text="STATIC KEYWORD · WHAT'S NEXT" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0,${headline.translateY})`} opacity={headline.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Variable ✓
          </text>
        </g>
        <g transform={`translate(0,${subline.translateY})`} opacity={subline.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={64} fontWeight={800} fill={COLORS.accent}>
            Method ?
          </text>
        </g>

        {/* Static variable card (completed) */}
        <g opacity={varCard.opacity} transform={`translate(0,${varCard.translateY})`}>
          <BentoCard x={60} y={480} w={960} h={180} />
          <rect x={60} y={480} width={6} height={180} rx={3} fill={COLORS.accent} opacity={0.5} />
          <text x={100} y={545} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            DONE
          </text>
          <text x={100} y={600} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            static int totalActiveTrains
          </text>
          <text x={960} y={580} textAnchor="end"
            fontFamily={FONT} fontSize={52} fontWeight={800} fill={COLORS.accent} opacity={0.3}>
            ✓
          </text>
        </g>

        {/* Arrow down */}
        <g opacity={arrow.opacity}>
          <path d="M 540,680 L 540,820"
            fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
            strokeLinecap="round" markerEnd="url(#arrow)" />
        </g>

        {/* Static method card (upcoming — mysterious) */}
        <g opacity={methodCard.opacity} transform={`translate(0,${methodCard.translateY})`}>
          <BentoCard x={60} y={840} w={960} h={260} accent />
          <text x={100} y={920} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            NEXT
          </text>
          <text x={100} y={990} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            static ??? methodName()
          </text>
          <text x={100} y={1048} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            No object needed. Called on the class.
          </text>

          {/* Dashed placeholder lines */}
          {[0, 1, 2].map(i => (
            <line key={i} x1={100} y1={1070 + i * 5} x2={500} y2={1070 + i * 5}
              stroke={COLORS.accent} strokeWidth={1} opacity={0.15}
              strokeDasharray="8 4" />
          ))}
        </g>

        {/* Big question mark */}
        <g transform={`translate(540,${1300 + breathe})`} opacity={question.opacity}>
          <text textAnchor="middle"
            fontFamily={FONT} fontSize={360} fontWeight={800}
            fill={COLORS.accent} opacity={0.06}
            style={{ transform: `scale(${pulse})`, transformOrigin: '0px 0px' }}>
            ?
          </text>
          <text textAnchor="middle"
            fontFamily={FONT} fontSize={200} fontWeight={800}
            fill={COLORS.accent} opacity={shimmer * 0.35}>
            ?
          </text>
        </g>

        {/* Summary */}
        <g opacity={summary.opacity} transform={`translate(0,${summary.translateY})`}>
          <BentoCard x={60} y={1480} w={960} h={100} />
          <text x={540} y={1542} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            A method that belongs to the <tspan fill={COLORS.accent}>class</tspan>, not the object.
          </text>
        </g>

        {/* Decorative track */}
        <line x1={100} y1={1640} x2={980} y2={1640}
          stroke={COLORS.text_muted} strokeWidth={2} opacity={0.08} />
        <line x1={100} y1={1655} x2={980} y2={1655}
          stroke={COLORS.text_muted} strokeWidth={2} opacity={0.08} />

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s13.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
