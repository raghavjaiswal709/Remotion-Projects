/**
 * Scene 06 — Reference Sees Only Train
 * "but the reference sees it only as a train."
 * CSV: 23.200s → 25.520s
 *
 * Animation phases:
 *   Phase 1 (0–30): Label + headline spring
 *   Phase 2 (20–90): Lens/filter metaphor, method visibility diagram
 *   Phase 3 (80–end): Pulse, breathe, shimmer
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

export const Scene06_ReferenceSeesOnlyTrain: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // Phase 1
  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 12);

  // Phase 2
  const fullObj = useSpringEntrance(frame, 18);
  const lens = useSpringEntrance(frame, 28);
  const visibleCard = useSpringEntrance(frame, 36);
  const hiddenCard = useSpringEntrance(frame, 46);
  const arrowEnt = useSpringEntrance(frame, 54);
  const insightCard = useSpringEntrance(frame, 62);

  // Path draws
  const lensArc = 400;
  const lensDash = usePathDraw(frame, 30, lensArc, 30);
  const dividerLen = 560;
  const dividerDash = usePathDraw(frame, 40, dividerLen, 25);

  // Phase 3
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const lensGlow = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.06, 0.14]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s06.from);

  // Methods data
  const trainMethods = ['depart()', 'getRoute()', 'stop()'];
  const expressMethods = ['getLounge()', 'getSpeed()', 'expressService()'];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="UPCASTING · VISIBILITY" y={160} />
        </g>

        {/* ZONE B */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Reference Sees
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={390} fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            Only Train
          </text>
        </g>

        {/* Full object block — left side */}
        <g opacity={fullObj.opacity} transform={`translate(0, ${fullObj.translateY})`}>
          <BentoCard x={60} y={470} w={460} h={640} />
          <text x={290} y={520} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            ACTUAL OBJECT
          </text>
          <line x1={80} y1={545} x2={500} y2={545} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />

          {/* ExpressTrain header */}
          <rect x={100} y={565} width={380} height={50} rx={10}
            fill={COLORS.accent} fillOpacity={0.1} />
          <text x={290} y={598} textAnchor="middle" fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.accent}>
            ExpressTrain
          </text>

          {/* Train methods — visible */}
          <text x={120} y={660} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted}>
            Train Methods:
          </text>
          {trainMethods.map((m, i) => (
            <g key={`tm${i}`}>
              <circle cx={130} cy={700 + i * 44} r={8} fill={COLORS.accent} fillOpacity={0.3} />
              <text x={150} y={708 + i * 44} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.white}>
                {m}
              </text>
            </g>
          ))}

          {/* Divider */}
          <line x1={100} y1={845} x2={460} y2={845}
            stroke={COLORS.accent} strokeWidth={1} strokeDasharray="8,6"
            strokeDashoffset={dividerDash} opacity={0.5} />

          {/* Express methods — hidden from reference */}
          <text x={120} y={880} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted}>
            Express-Only:
          </text>
          {expressMethods.map((m, i) => (
            <g key={`em${i}`} opacity={hiddenCard.opacity * 0.5}>
              <circle cx={130} cy={920 + i * 44} r={8} fill={COLORS.vibrant_red} fillOpacity={0.3} />
              <text x={150} y={928 + i * 44} fontFamily={FONT} fontSize={28} fontWeight={800}
                fill={COLORS.text_muted} opacity={0.4} textDecoration="line-through">
                {m}
              </text>
            </g>
          ))}
        </g>

        {/* Lens / filter metaphor — center */}
        <g opacity={lens.opacity} transform={`translate(540, ${800 + breathe})`}>
          {/* Lens circle */}
          <circle cx={0} cy={0} r={120} fill={COLORS.accent} fillOpacity={lensGlow} />
          <circle cx={0} cy={0} r={120} fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={lensArc} strokeDashoffset={lensDash}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
          {/* Lens label */}
          <text x={0} y={-10} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            Train
          </text>
          <text x={0} y={25} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            Reference
          </text>
          <text x={0} y={55} textAnchor="middle" fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
            Filter
          </text>
        </g>

        {/* Right side — what reference sees */}
        <g opacity={visibleCard.opacity} transform={`translate(0, ${visibleCard.translateY})`}>
          <BentoCard x={580} y={470} w={440} h={400} accent />
          <text x={800} y={520} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            VISIBLE THROUGH REF
          </text>
          <line x1={600} y1={545} x2={1000} y2={545} stroke={COLORS.accent} strokeWidth={1} opacity={0.3} />

          <rect x={620} y={565} width={360} height={50} rx={10}
            fill={COLORS.accent} fillOpacity={0.08} />
          <text x={800} y={598} textAnchor="middle" fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.white}>
            Train (type)
          </text>

          {trainMethods.map((m, i) => (
            <g key={`v${i}`}>
              <rect x={620} y={635 + i * 60} width={360} height={46} rx={8}
                fill={COLORS.accent} fillOpacity={0.05} />
              <circle cx={645} cy={658 + i * 60} r={8} fill={COLORS.accent} />
              <text x={670} y={666 + i * 60} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.white}>
                {m}
              </text>
            </g>
          ))}
        </g>

        {/* Hidden methods card */}
        <g opacity={hiddenCard.opacity} transform={`translate(0, ${hiddenCard.translateY})`}>
          <BentoCard x={580} y={900} w={440} h={210} />
          <text x={800} y={945} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.vibrant_red}>
            HIDDEN FROM REFERENCE
          </text>
          {expressMethods.map((m, i) => (
            <text key={`h${i}`} x={620} y={990 + i * 38} fontFamily={FONT} fontSize={26} fontWeight={800}
              fill={COLORS.text_muted} opacity={0.4}>
              {m}
            </text>
          ))}
        </g>

        {/* Arrow from lens to visible */}
        <g opacity={arrowEnt.opacity}>
          <path d="M 660,800 L 580,680" fill="none" stroke={COLORS.accent} strokeWidth={2}
            markerEnd="url(#arrow)" opacity={0.6} />
        </g>

        {/* Bottom insight card */}
        <g opacity={insightCard.opacity} transform={`translate(0, ${insightCard.translateY})`}>
          <BentoCard x={60} y={1180} w={960} h={280} accent />
          <rect x={60} y={1180} width={6} height={280} rx={3} fill={COLORS.accent} />

          <text x={100} y={1240} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            The object is 100% intact
          </text>
          <text x={100} y={1295} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            But the reference acts like a window —
          </text>
          <text x={100} y={1345} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            it only lets you see Train-level features
          </text>
          <text x={100} y={1395} fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.text_muted}>
            ExpressTrain methods still exist, just unreachable
          </text>
        </g>

        {/* Decorative track */}
        <g opacity={insightCard.opacity * shimmer * 0.3}>
          <line x1={60} y1={1520} x2={1020} y2={1520} stroke={COLORS.accent} strokeWidth={2} />
          <line x1={60} y1={1530} x2={1020} y2={1530} stroke={COLORS.accent} strokeWidth={2} opacity={0.5} />
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={100 + i * 75} y={1515} width={30} height={20} rx={2}
              fill={COLORS.accent} fillOpacity={0.08} />
          ))}
        </g>

        {/* Floating accent */}
        <g transform={`translate(100, ${1600 + breathe})`}>
          <circle cx={0} cy={0} r={14} fill={COLORS.accent} fillOpacity={0.04 * shimmer} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s06.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
