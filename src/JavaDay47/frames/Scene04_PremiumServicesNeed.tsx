/**
 * Scene 04 — Premium Services Need
 * "Now the Premium Services module needs the Express-specific behaviour back."
 * CSV: 16.240s → 22.000s
 * Duration: ~173 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline spring in
 *   Phase 2 (frames 20–80):  Premium module card, express features cards stagger
 *   Phase 3 (frames 70–end): Micro-animations, pulse, breathing
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
import { DarkBackground, GlobalDefs, Caption, SectionLabel, BentoCard, CornerAccents } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
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

export const Scene04_PremiumServicesNeed: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // Phase 1
  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 12);

  // Phase 2 — cards
  const moduleCard = useSpringEntrance(frame, 20);
  const featureCards = [
    useSpringEntrance(frame, 32),
    useSpringEntrance(frame, 44),
    useSpringEntrance(frame, 56),
  ];
  const arrowEnt = useSpringEntrance(frame, 40);

  // Arrow path draw
  const arrowLen = 180;
  const arrowDash = usePathDraw(frame, 35, arrowLen, 25);

  // Connection lines
  const connLen1 = 300;
  const connDash1 = usePathDraw(frame, 50, connLen1, 25);
  const connDash2 = usePathDraw(frame, 55, connLen1, 25);
  const connDash3 = usePathDraw(frame, 60, connLen1, 25);

  // Phase 3
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Station illustration
  const stationRoof = useSpringEntrance(frame, 24);
  const trainBody = useSpringEntrance(frame, 30);

  const caption = CAPTIONS[3];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="MODULE 3 · PREMIUM SERVICES" y={160} opacity={0.8} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Premium Module
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent}>
            Needs Express Behaviour Back
          </text>
        </g>

        {/* Zone C — Premium Services module card */}
        <g opacity={moduleCard.opacity} transform={`translate(0, ${moduleCard.translateY})`}>
          <BentoCard x={60} y={520} w={960} h={200} accent />
          <rect x={60} y={520} width={8} height={200} rx={4} fill={COLORS.accent} />
          {/* Station icon */}
          <rect x={100} y={560} width={80} height={60} rx={8}
            fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <polygon points="140,545 100,570 180,570"
            fill={COLORS.accent} fillOpacity={0.2} />
          <text x={200} y={595} fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.white}>
            PremiumServicesModule
          </text>
          <text x={200} y={660} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Handles first-class, dining, reserved seating
          </text>
        </g>

        {/* Arrow — module needs express features */}
        <path d="M 540,740 L 540,860"
          fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          strokeLinecap="round" markerEnd="url(#arrow)" opacity={arrowEnt.opacity} />
        <text x={565} y={810} fontFamily={FONT} fontSize={26} fontWeight={800}
          fill={COLORS.accent} opacity={arrowEnt.opacity}>
          NEEDS
        </text>

        {/* Express feature cards */}
        <g opacity={featureCards[0].opacity} transform={`translate(0, ${featureCards[0].translateY})`}>
          <BentoCard x={60} y={880} w={300} h={260} accent />
          {/* Dining car icon */}
          <rect x={120} y={920} width={180} height={60} rx={12}
            fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <circle cx={155} cy={1000} r={12} fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={265} cy={1000} r={12} fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <text x={210} y={960} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            DINING
          </text>
          <text x={100} y={1060} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            serveLunch()
          </text>
          <text x={100} y={1100} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted}>
            Express only
          </text>
        </g>

        <g opacity={featureCards[1].opacity} transform={`translate(0, ${featureCards[1].translateY})`}>
          <BentoCard x={390} y={880} w={300} h={260} accent />
          {/* Seat icon */}
          <rect x={450} y={920} width={50} height={60} rx={8}
            fill={COLORS.accent} fillOpacity={0.15} />
          <rect x={505} y={920} width={50} height={60} rx={8}
            fill={COLORS.accent} fillOpacity={0.15} />
          <rect x={560} y={920} width={50} height={60} rx={8}
            fill={COLORS.accent} fillOpacity={0.15} />
          <text x={540} y={960} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent}>
            SEATS
          </text>
          <text x={420} y={1060} fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.white}>
            reserveSeat()
          </text>
          <text x={420} y={1100} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted}>
            Express only
          </text>
        </g>

        <g opacity={featureCards[2].opacity} transform={`translate(0, ${featureCards[2].translateY})`}>
          <BentoCard x={720} y={880} w={300} h={260} accent />
          {/* Lounge icon */}
          <rect x={780} y={920} width={180} height={60} rx={12}
            fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={870} y={960} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent}>
            LOUNGE
          </text>
          <text x={750} y={1060} fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.white}>
            accessLounge()
          </text>
          <text x={750} y={1100} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted}>
            Express only
          </text>
        </g>

        {/* Connection lines from module card to feature cards */}
        <path d="M 260,740 L 210,880" fill="none" stroke={COLORS.accent} strokeWidth={1.5}
          strokeDasharray={connLen1} strokeDashoffset={connDash1}
          strokeLinecap="round" opacity={0.4} />
        <path d="M 540,740 L 540,880" fill="none" stroke={COLORS.accent} strokeWidth={1.5}
          strokeDasharray={connLen1} strokeDashoffset={connDash2}
          strokeLinecap="round" opacity={0.4} />
        <path d="M 820,740 L 870,880" fill="none" stroke={COLORS.accent} strokeWidth={1.5}
          strokeDasharray={connLen1} strokeDashoffset={connDash3}
          strokeLinecap="round" opacity={0.4} />

        {/* Summary card */}
        <g opacity={featureCards[2].opacity} transform={`translate(0, ${featureCards[2].translateY + 10})`}>
          <BentoCard x={60} y={1180} w={960} h={180} />
          <rect x={60} y={1180} width={6} height={180} rx={3} fill={COLORS.accent} />
          <text x={100} y={1260} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            The parent reference hides these features.
          </text>
          <text x={100} y={1315} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            Premium Services needs them back.
          </text>
        </g>

        {/* Train illustration at bottom */}
        <g opacity={trainBody.opacity * shimmer} transform={`translate(0, ${trainBody.translateY})`}>
          {/* Rail tracks */}
          <line x1={100} y1={1580} x2={980} y2={1580} stroke={COLORS.text_muted} strokeWidth={3} opacity={0.3} />
          <line x1={100} y1={1595} x2={980} y2={1595} stroke={COLORS.text_muted} strokeWidth={3} opacity={0.3} />
          {/* Cross ties */}
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={140 + i * 70} y={1575} width={8} height={25} rx={2}
              fill={COLORS.text_muted} opacity={0.2} />
          ))}
          {/* Express train body */}
          <rect x={200} y={1480} width={500} height={90} rx={16}
            fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={2} />
          <polygon points="700,1480 740,1525 700,1570" fill={COLORS.accent} fillOpacity={0.15} />
          {/* Wheels */}
          <circle cx={280} cy={1580} r={18} fill="none" stroke={COLORS.accent} strokeWidth={2.5} opacity={0.7} />
          <circle cx={450} cy={1580} r={18} fill="none" stroke={COLORS.accent} strokeWidth={2.5} opacity={0.7} />
          <circle cx={620} cy={1580} r={18} fill="none" stroke={COLORS.accent} strokeWidth={2.5} opacity={0.7} />
          {/* Windows */}
          <rect x={240} y={1500} width={60} height={40} rx={6}
            fill={COLORS.accent} fillOpacity={0.08} stroke={COLORS.accent} strokeWidth={1} />
          <rect x={330} y={1500} width={60} height={40} rx={6}
            fill={COLORS.accent} fillOpacity={0.08} stroke={COLORS.accent} strokeWidth={1} />
          <rect x={420} y={1500} width={60} height={40} rx={6}
            fill={COLORS.accent} fillOpacity={0.08} stroke={COLORS.accent} strokeWidth={1} />
          <text x={540} y={1535} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            EXPRESS
          </text>
        </g>

        {/* Floating accents */}
        <circle cx={180} cy={800 + breathe} r={5} fill={COLORS.accent} opacity={0.2 * shimmer} />
        <circle cx={900} cy={790 + breathe * 0.7} r={6} fill={COLORS.accent} opacity={0.15 * shimmer} />

        <CornerAccents opacity={labelEnt.opacity * 0.3} />

        {/* Caption */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s04.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
