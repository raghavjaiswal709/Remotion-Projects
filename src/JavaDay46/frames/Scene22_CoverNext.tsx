/**
 * Scene 22 — Exactly What We Cover Next
 * "And that is exactly what we will cover next."
 * CSV: 75.400s → 77.460s
 *
 * Animation phases:
 *   Phase 1 (0–16): Label + headline
 *   Phase 2 (12–40): Tomorrow preview, forward arrow
 *   Phase 3 (35–end): Pulse
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

export const Scene22_CoverNext: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 3);
  const headB = useSpringEntrance(frame, 7);

  // Today recap card
  const todayEnt = useSpringEntrance(frame, 10);

  // Arrow forward
  const arrowLen = 200;
  const arrowDash = usePathDraw(frame, 16, arrowLen, 20);

  // Tomorrow card
  const tomorrowEnt = useSpringEntrance(frame, 20);
  const tomorrowPerim = 2 * (960 + 280);
  const tomorrowDash = usePathDraw(frame, 22, tomorrowPerim, 26);

  // Key concepts checklist
  const concepts = [
    'Upcasting — child stored in parent reference',
    'Implicit & automatic — compiler ensures safety',
    'Enables generic processing with one method',
    'Subtype methods hidden behind parent type',
  ];
  const conceptEnts = concepts.map((_, i) => useSpringEntrance(frame, 28 + i * 5));

  // CTA
  const ctaEnt = useSpringEntrance(frame, 42);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s22.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="COMING NEXT" y={130} />
        </g>

        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={280} fontFamily={FONT} fontSize={64} fontWeight={800} fill={COLORS.white}>
            What We Cover
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={370} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            Next
          </text>
        </g>

        {/* Today recap */}
        <g opacity={todayEnt.opacity} transform={`translate(0, ${todayEnt.translateY})`}>
          <BentoCard x={60} y={440} w={960} h={100} />
          <text x={100} y={475} fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.accent} letterSpacing="0.1em">
            TODAY — DAY 46
          </text>
          <text x={100} y={515} fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.white}>
            Upcasting — Storing subtypes in parent references
          </text>
        </g>

        {/* Forward arrow */}
        <path d="M 540,540 L 540,600"
          fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        {/* Tomorrow preview */}
        <g opacity={tomorrowEnt.opacity} transform={`translate(0, ${tomorrowEnt.translateY})`}>
          <rect x={60} y={620} width={960} height={140} rx={20}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={tomorrowPerim} strokeDashoffset={tomorrowDash} />
          <text x={100} y={665} fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.accent} letterSpacing="0.1em">
            TOMORROW — DAY 47
          </text>
          <text x={100} y={710} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Downcasting — Recovering subtype features
          </text>
          <text x={100} y={745} fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
            Explicit casts, ClassCastException, instanceof guard
          </text>
        </g>

        {/* Key concepts checklist */}
        <g>
          <text x={60} y={830} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted} letterSpacing="0.1em"
            opacity={conceptEnts[0].opacity}>
            KEY CONCEPTS TODAY
          </text>
        </g>
        {concepts.map((c, i) => {
          const ent = conceptEnts[i];
          const y = 860 + i * 70;
          return (
            <g key={i} opacity={ent.opacity} transform={`translate(0, ${ent.translateY})`}>
              <BentoCard x={60} y={y} w={960} h={55} />
              <circle cx={95} cy={y + 28} r={10} fill={COLORS.accent} fillOpacity={0.15} />
              <text x={95} y={y + 34} textAnchor="middle" fontFamily={FONT} fontSize={16} fontWeight={800} fill={COLORS.accent}>
                {i + 1}
              </text>
              <text x={120} y={y + 36} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.white}>
                {c}
              </text>
            </g>
          );
        })}

        {/* CTA */}
        <g opacity={ctaEnt.opacity} transform={`translate(0, ${ctaEnt.translateY + breathe})`}>
          <BentoCard x={260} y={1180} w={560} h={80} accent />
          <text x={540} y={1230} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            See you in Day 47
          </text>
          {/* Arrow glyph */}
          <path d="M 740,1220 L 770,1220 L 760,1210 M 770,1220 L 760,1230"
            fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
        </g>

        {/* Rail */}
        <g opacity={0.1}>
          <line x1={60} y1={1370} x2={1020} y2={1370} stroke={COLORS.text_muted} strokeWidth={2} />
        </g>

        {/* Float */}
        <g transform={`translate(540, ${1500 + breathe})`}>
          <circle cx={0} cy={0} r={14} fill="none" stroke={COLORS.accent} strokeWidth={1}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} opacity={0.12} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s22.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
