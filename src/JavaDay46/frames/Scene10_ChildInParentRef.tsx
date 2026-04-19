/**
 * Scene 10 — Child Object In Parent Type Reference
 * "Storing a child object in a parent type reference."
 * CSV: 35.640s → 39.260s
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline spring
 *   Phase 2 (20–90): Memory diagram, object block, reference pointer, type annotations
 *   Phase 3 (80–end): Breathe, pulse on pointer, shimmer
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
const SPRING_SOFT = { damping: 22, stiffness: 120, mass: 1.0 } as const;

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

export const Scene10_ChildInParentRef: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 4);
  const headB = useSpringEntrance(frame, 10);

  // Memory diagram elements
  const stackCard = useSpringEntrance(frame, 18);
  const heapCard = useSpringEntrance(frame, 26);
  const pointerLen = 260;
  const pointerDash = usePathDraw(frame, 32, pointerLen, 24);
  const typeLabel = useSpringEntrance(frame, 36);
  const objectDetail = useSpringEntrance(frame, 42);
  const insightCard = useSpringEntrance(frame, 50);
  const trainIllustration = useSpringEntrance(frame, 56);

  // Phase 3
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s10.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="MEMORY MODEL" y={130} />
        </g>

        {/* Headline */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={280} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Child Object
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.accent}>
            In Parent Type Reference
          </text>
        </g>

        {/* ── STACK section (left side) ─────────────────── */}
        <g opacity={stackCard.opacity} transform={`translate(0, ${stackCard.translateY})`}>
          <BentoCard x={60} y={460} w={420} h={360} accent />
          <text x={100} y={510} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent} letterSpacing="0.1em">
            STACK
          </text>
          <line x1={80} y1={530} x2={460} y2={530} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />

          {/* Variable box */}
          <rect x={100} y={560} width={340} height={100} rx={12}
            fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
          <text x={120} y={605} fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={28} fontWeight={500} fill={COLORS.accent}>
            Train t
          </text>
          <text x={120} y={640} fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={22} fontWeight={500} fill={COLORS.text_muted}>
            type: Train
          </text>

          {/* Pointer origin dot */}
          <circle cx={440} cy={610} r={8} fill={COLORS.accent} opacity={shimmer} />

          {/* Type annotation */}
          <g opacity={typeLabel.opacity} transform={`translate(0, ${typeLabel.translateY})`}>
            <text x={120} y={740} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
              Reference type =
            </text>
            <text x={340} y={740} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent}>
              Train
            </text>
            <text x={120} y={775} fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted} opacity={0.6}>
              (decides what you can access)
            </text>
          </g>
        </g>

        {/* Pointer arrow from stack to heap */}
        <path d="M 480,610 C 520,610 540,610 560,610 L 600,610"
          fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={pointerLen} strokeDashoffset={pointerDash}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        {/* ── HEAP section (right side) ─────────────────── */}
        <g opacity={heapCard.opacity} transform={`translate(0, ${heapCard.translateY})`}>
          <BentoCard x={600} y={460} w={420} h={360} />
          <text x={640} y={510} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.white} letterSpacing="0.1em">
            HEAP
          </text>
          <line x1={620} y1={530} x2={1000} y2={530} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />

          {/* Object block with glow */}
          <rect x={640} y={560} width={340} height={140} rx={14}
            fill={COLORS.accent} fillOpacity={0.06}
            stroke={COLORS.accent} strokeWidth={2} />
          <rect x={640} y={560} width={340} height={40} rx={0}
            fill={COLORS.accent} fillOpacity={0.12} />
          <text x={660} y={590} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent}>
            ExpressTrain
          </text>
          <text x={660} y={635} fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={20} fontWeight={500} fill={COLORS.white}>
            speed: 300
          </text>
          <text x={660} y={665} fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={20} fontWeight={500} fill={COLORS.white}>
            lounge: true
          </text>
          <text x={660} y={690} fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={20} fontWeight={500} fill={COLORS.text_muted}>
            + run(), getLounge()...
          </text>

          {/* Object type annotation */}
          <g opacity={objectDetail.opacity} transform={`translate(0, ${objectDetail.translateY})`}>
            <text x={640} y={740} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
              Actual type =
            </text>
            <text x={850} y={740} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.white}>
              ExpressTrain
            </text>
            <text x={640} y={775} fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted} opacity={0.6}>
              (decides what exists at runtime)
            </text>
          </g>
        </g>

        {/* ── Large train illustration ─────────────────── */}
        <g opacity={trainIllustration.opacity} transform={`translate(0, ${trainIllustration.translateY + breathe})`}>
          {/* Rails */}
          <line x1={100} y1={1170} x2={980} y2={1170} stroke={COLORS.text_muted} strokeWidth={3} />
          <line x1={100} y1={1185} x2={980} y2={1185} stroke={COLORS.text_muted} strokeWidth={2} opacity={0.4} />
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={130 + i * 70} y={1172} width={30} height={10} rx={2}
              fill={COLORS.text_muted} opacity={0.2} />
          ))}

          {/* Locomotive body */}
          <rect x={250} y={1040} width={500} height={120} rx={12}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Cab */}
          <rect x={650} y={990} width={120} height={170} rx={10}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Window */}
          <rect x={670} y={1010} width={80} height={50} rx={6}
            fill={COLORS.accent} fillOpacity={0.15} stroke={COLORS.accent} strokeWidth={1} />
          {/* Smokestack */}
          <rect x={310} y={1000} width={40} height={40} rx={4}
            fill={COLORS.accent} fillOpacity={0.2} stroke={COLORS.accent} strokeWidth={1.5} />
          {/* Wheels */}
          <circle cx={330} cy={1170} r={28} fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={2.5} />
          <circle cx={330} cy={1170} r={10} fill={COLORS.accent} fillOpacity={0.3} />
          <circle cx={500} cy={1170} r={28} fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={2.5} />
          <circle cx={500} cy={1170} r={10} fill={COLORS.accent} fillOpacity={0.3} />
          <circle cx={680} cy={1170} r={28} fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={2.5} />
          <circle cx={680} cy={1170} r={10} fill={COLORS.accent} fillOpacity={0.3} />

          {/* Label on body */}
          <text x={500} y={1110} textAnchor="middle" fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>
            ExpressTrain
          </text>

          {/* Parent tag on reference line */}
          <rect x={250} y={1210} width={180} height={40} rx={8}
            fill={COLORS.accent} fillOpacity={0.1} stroke={COLORS.accent} strokeWidth={1} />
          <text x={340} y={1237} textAnchor="middle" fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.accent}>
            SEEN AS: Train
          </text>
        </g>

        {/* Insight card */}
        <g opacity={insightCard.opacity} transform={`translate(0, ${insightCard.translateY})`}>
          <BentoCard x={60} y={1320} w={960} h={140} accent />
          <rect x={60} y={1320} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={100} y={1375} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            The object IS an ExpressTrain
          </text>
          <text x={100} y={1420} fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.accent}>
            but it's referenced AS a Train
          </text>
        </g>

        {/* Two bottom summary cards */}
        <g opacity={insightCard.opacity * 0.9} transform={`translate(0, ${insightCard.translateY})`}>
          <BentoCard x={60} y={1500} w={460} h={120} />
          <text x={100} y={1555} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            Reference: Narrow
          </text>
          <text x={100} y={1590} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            Only Train API visible
          </text>

          <BentoCard x={560} y={1500} w={460} h={120} />
          <text x={600} y={1555} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.white}>
            Object: Full
          </text>
          <text x={600} y={1590} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            All Express fields intact
          </text>
        </g>

        {/* Floating accent circle */}
        <g transform={`translate(540, ${1700 + breathe * 0.5})`}>
          <circle cx={0} cy={0} r={18} fill={COLORS.accent} fillOpacity={0.05 * shimmer} />
          <circle cx={0} cy={0} r={18} fill="none" stroke={COLORS.accent} strokeWidth={1}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} opacity={0.25} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s10.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
