/**
 * Scene 02 — Downcasting Recap
 * "Last day, we learned how downcasting retrieves the specific subclass from a general reference,"
 * CSV: 6.080s → 12.240s | Duration: 185 frames
 *
 * Animation phases:
 *   Phase 1 (0–30): Label + headline spring entrance
 *   Phase 2 (20–90): Inheritance diagram with path-draw connectors
 *   Phase 3 (80–end): Micro pulse, downward arrow breathing
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
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

export const Scene02_DowncastingRecap: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // Phase 1
  const labelE = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 12);

  // Phase 2 — Diagram
  const parentBox = useSpringEntrance(frame, 20);
  const childBox = useSpringEntrance(frame, 32);
  const arrowLen = 200;
  const arrowDash = usePathDraw(frame, 36, arrowLen, 25);
  const castLabel = useSpringEntrance(frame, 44);
  const refCard = useSpringEntrance(frame, 50);
  const resultCard = useSpringEntrance(frame, 60);

  // Phase 3
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const arrowBounce = Math.sin(frame * 0.1) * 3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s02.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A */}
        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="RECAP · DOWNCASTING" y={160} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Downcasting
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent}>
            Retrieving the specific subclass
          </text>
        </g>

        {/* Zone C — Inheritance diagram */}
        {/* Parent class box */}
        <g opacity={parentBox.opacity} transform={`translate(0, ${parentBox.translateY})`}>
          <BentoCard x={300} y={520} w={480} h={140} accent />
          <rect x={300} y={520} width={480} height={40} rx={20} fill={COLORS.accent} fillOpacity={0.15} />
          <text x={540} y={552} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            PARENT
          </text>
          <text x={540} y={610} textAnchor="middle" fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            Train
          </text>
          <text x={540} y={648} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            General reference
          </text>
        </g>

        {/* Downward arrow */}
        <path d={`M 540,660 L 540,${780}`}
          fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* Cast label on arrow */}
        <g opacity={castLabel.opacity} transform={`translate(0, ${castLabel.translateY})`}>
          <text x={580} y={728} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            (ExpressTrain) t
          </text>
        </g>

        {/* Downward arrow bounce indicator */}
        <g transform={`translate(540, ${740 + arrowBounce})`} opacity={castLabel.opacity * 0.5}>
          <polygon points="0,0 -10,-12 10,-12" fill={COLORS.accent} fillOpacity={0.4} />
        </g>

        {/* Child class box */}
        <g opacity={childBox.opacity} transform={`translate(0, ${childBox.translateY})`}>
          <BentoCard x={300} y={790} w={480} h={140} accent />
          <rect x={300} y={790} width={480} height={40} rx={20} fill={COLORS.accent} fillOpacity={0.15} />
          <text x={540} y={822} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            CHILD
          </text>
          <text x={540} y={880} textAnchor="middle" fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            ExpressTrain
          </text>
          <text x={540} y={918} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Specific subclass
          </text>
        </g>

        {/* Reference card */}
        <g opacity={refCard.opacity} transform={`translate(0, ${refCard.translateY})`}>
          <BentoCard x={60} y={980} w={960} h={160} />
          <rect x={60} y={980} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={100} y={1050} fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={36} fontWeight={500} fill={COLORS.text_muted}>
            Train t = new ExpressTrain();
          </text>
          <text x={100} y={1100} fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={36} fontWeight={500} fill={COLORS.accent}>
            ExpressTrain e = (ExpressTrain) t;
          </text>
        </g>

        {/* Result card */}
        <g opacity={resultCard.opacity} transform={`translate(0, ${resultCard.translateY})`}>
          <BentoCard x={60} y={1180} w={460} h={180} />
          <text x={100} y={1260} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Downcast
          </text>
          <text x={100} y={1310} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Narrow from parent to child
          </text>
          <text x={100} y={1350} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            Access child-specific methods
          </text>
        </g>

        <g opacity={resultCard.opacity} transform={`translate(0, ${resultCard.translateY})`}>
          <BentoCard x={560} y={1180} w={460} h={180} accent />
          <text x={600} y={1260} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            Risk
          </text>
          <text x={600} y={1310} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Wrong cast = crash
          </text>
          <text x={600} y={1350} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.vibrant_red}>
            ClassCastException
          </text>
        </g>

        {/* Floating danger indicator */}
        <g transform={`translate(790, ${1480 + breathe})`} opacity={resultCard.opacity * 0.6}>
          <circle cx={0} cy={0} r={36} fill={COLORS.vibrant_red} fillOpacity={0.08} />
          <circle cx={0} cy={0} r={36} fill="none" stroke={COLORS.vibrant_red} strokeWidth={2}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
          <text x={0} y={12} textAnchor="middle" fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.vibrant_red} opacity={shimmer}>!</text>
        </g>

        {/* Bottom summary */}
        <g opacity={resultCard.opacity * 0.7} transform={`translate(0, ${resultCard.translateY})`}>
          <text x={540} y={1580} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.text_muted}>
            Yesterday: learned the mechanism
          </text>
          <text x={540} y={1630} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent}>
            Today: learn the safety check
          </text>
        </g>

        {/* Decorative connector dots */}
        {[1, 2, 3].map(i => (
          <circle key={i} cx={540} cy={1680 + i * 18} r={3}
            fill={COLORS.accent} fillOpacity={0.3 - i * 0.08} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s02.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
