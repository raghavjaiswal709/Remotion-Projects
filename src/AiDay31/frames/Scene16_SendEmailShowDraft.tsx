/**
 * Scene 16 — Send Email Show Draft
 * "Sending an email to a client? Show the draft. Wait for approval."
 * CSV: 57.300s → 62.100s | Duration: 144 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline
 *   Phase 2 (20–90): Email draft preview + approval flow
 *   Phase 3 (80–end): Micro animations
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

function usePathDraw(frame: number, startFrame: number, totalLength: number, dur = 30) {
  const progress = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene16_SendEmailShowDraft: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const label = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 5);
  const headB = useSpringEntrance(frame, 11);
  const card1 = useSpringEntrance(frame, 22);
  const card2 = useSpringEntrance(frame, 38);
  const card3 = useSpringEntrance(frame, 54);
  const card4 = useSpringEntrance(frame, 68);
  const card5 = useSpringEntrance(frame, 80);

  // Arrow path draw for flow
  const arrowLen = 120;
  const arrow1Dash = usePathDraw(frame, 45, arrowLen, 20);
  const arrow2Dash = usePathDraw(frame, 60, arrowLen, 20);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;

  // Waiting dots animation
  const dot1 = Math.sin(frame * 0.15) > 0 ? 1 : 0.3;
  const dot2 = Math.sin(frame * 0.15 + 1) > 0 ? 1 : 0.3;
  const dot3 = Math.sin(frame * 0.15 + 2) > 0 ? 1 : 0.3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s16.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A */}
        <g transform={`translate(0, ${label.translateY})`} opacity={label.opacity}>
          <SectionLabel text="AUTONOMY · MEDIUM RISK" y={160} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={78} fontWeight={800}
            fill={COLORS.white}>
            Send Email?
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={48} fontWeight={800}
            fill={COLORS.accent}>
            Show the draft first
          </text>
        </g>

        {/* Card 1 — Email draft preview */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={480} w={960} h={400} accent />

          {/* Email icon */}
          <g transform="translate(140, 560)">
            <rect x={-50} y={-30} width={100} height={60} rx={8}
              fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={2.5} />
            <path d="M -50,-30 L 0,10 L 50,-30" fill="none"
              stroke={COLORS.accent} strokeWidth={2.5} strokeLinejoin="round" />
          </g>

          {/* Draft preview */}
          <text x={220} y={540} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            DRAFT PREVIEW
          </text>
          <rect x={220} y={560} width={720} height={2} fill={COLORS.accent}
            fillOpacity={0.3} />

          {/* Mock email content */}
          <text x={240} y={600} fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.text_muted}>
            To: client@company.com
          </text>
          <text x={240} y={636} fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.text_muted}>
            Subject: Project update Q4
          </text>
          <rect x={240} y={654} width={680} height={1} fill="rgba(255,255,255,0.08)" />
          {[0, 1, 2].map(i => (
            <rect key={i} x={240} y={670 + i * 24} width={500 - i * 80}
              height={8} rx={3} fill="rgba(255,255,255,0.06)" />
          ))}

          {/* Warning badge */}
          <rect x={660} y={760} width={280} height={48} rx={24}
            fill={COLORS.accent} fillOpacity={0.08}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={800} y={792} textAnchor="middle" fontFamily={FONT}
            fontSize={20} fontWeight={800} fill={COLORS.accent}>
            REQUIRES APPROVAL
          </text>
        </g>

        {/* Flow: DRAFT → REVIEW → SEND */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          {/* Step 1: Draft */}
          <BentoCard x={60} y={920} w={280} h={120} />
          <text x={200} y={980} textAnchor="middle" fontFamily={FONT}
            fontSize={28} fontWeight={800} fill={COLORS.white}>
            DRAFT
          </text>
          <text x={200} y={1012} textAnchor="middle" fontFamily={FONT}
            fontSize={18} fontWeight={800} fill={COLORS.text_muted}>
            Agent writes
          </text>

          {/* Arrow 1 */}
          <path d="M 350,980 L 420,980" fill="none" stroke={COLORS.accent}
            strokeWidth={2.5} strokeLinecap="round"
            strokeDasharray={arrowLen} strokeDashoffset={arrow1Dash}
            markerEnd="url(#arrow)" />

          {/* Step 2: Review */}
          <BentoCard x={400} y={920} w={280} h={120} accent />
          <text x={540} y={980} textAnchor="middle" fontFamily={FONT}
            fontSize={28} fontWeight={800} fill={COLORS.accent}>
            REVIEW
          </text>
          <text x={540} y={1012} textAnchor="middle" fontFamily={FONT}
            fontSize={18} fontWeight={800} fill={COLORS.text_muted}>
            Human checks
          </text>

          {/* Waiting dots */}
          <g transform="translate(540, 1044)">
            <circle cx={-12} cy={0} r={3} fill={COLORS.accent} opacity={dot1} />
            <circle cx={0} cy={0} r={3} fill={COLORS.accent} opacity={dot2} />
            <circle cx={12} cy={0} r={3} fill={COLORS.accent} opacity={dot3} />
          </g>

          {/* Arrow 2 */}
          <path d="M 690,980 L 760,980" fill="none" stroke={COLORS.accent}
            strokeWidth={2.5} strokeLinecap="round"
            strokeDasharray={arrowLen} strokeDashoffset={arrow2Dash}
            markerEnd="url(#arrow)" />

          {/* Step 3: Send */}
          <BentoCard x={740} y={920} w={280} h={120} />
          <text x={880} y={980} textAnchor="middle" fontFamily={FONT}
            fontSize={28} fontWeight={800} fill={COLORS.white}>
            SEND
          </text>
          <text x={880} y={1012} textAnchor="middle" fontFamily={FONT}
            fontSize={18} fontWeight={800} fill={COLORS.text_muted}>
            After approval
          </text>
        </g>

        {/* Bottom reason cards */}
        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={60} y={1090} w={460} h={200} />
          <text x={100} y={1180} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>
            Semi-reversible
          </text>
          <text x={100} y={1230} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            Can retract, but damage
          </text>
          <text x={100} y={1264} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            may already be done
          </text>
        </g>
        <g opacity={card4.opacity} transform={`translate(0, ${card4.translateY})`}>
          <BentoCard x={560} y={1090} w={460} h={200} accent />
          <text x={600} y={1180} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent}>
            Client-facing
          </text>
          <text x={600} y={1230} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            Reputation at stake
          </text>
          <text x={600} y={1264} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            Human must verify
          </text>
        </g>

        {/* Full width note */}
        <g opacity={card5.opacity} transform={`translate(0, ${card5.translateY})`}>
          <BentoCard x={60} y={1320} w={960} h={120} />
          <text x={540} y={1392} textAnchor="middle" fontFamily={FONT}
            fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Wait for approval — then execute
          </text>
        </g>

        {/* Micro animations */}
        <g transform={`translate(540, ${1540 + breathe})`}>
          <circle cx={0} cy={0} r={24} fill={COLORS.accent}
            fillOpacity={0.03} />
          <circle cx={0} cy={0} r={24} fill="none" stroke={COLORS.accent}
            strokeWidth={1} transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} opacity={0.12} />
        </g>

        {[0, 1, 2].map(i => (
          <circle key={i} cx={300 + i * 220}
            cy={1640 + Math.sin(frame * 0.05 + i) * 4}
            r={2} fill={COLORS.accent} opacity={0.06} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s16.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
