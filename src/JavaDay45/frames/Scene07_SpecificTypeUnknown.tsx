/**
 * Scene 07 — Specific Type Unknown
 * "It does not know the specific type."
 * CSV: 28.520s → 30.760s
 * Duration: 82 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–20): Headline springs in
 *   Phase 2 (frames 15–55): Question mark reveal, hidden type cards
 *   Phase 3 (frames 45–end): Floating question marks, pulse
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
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

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
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene07_SpecificTypeUnknown: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelE = useSpringEntrance(frame, 0);
  const headA  = useSpringEntrance(frame, 4);
  const headB  = useSpringEntrance(frame, 9);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const bigQuestion = useSpringEntrance(frame, 14);
  const card1  = useSpringEntrance(frame, 22);
  const card2  = useSpringEntrance(frame, 32);
  const card3  = useSpringEntrance(frame, 40);
  const summaryCard = useSpringEntrance(frame, 48);

  // ── Path draws ─────────────────────────────────────────────────────────────
  const questionCircle = usePathDraw(frame, 14, 2 * Math.PI * 120, 25);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe  = Math.sin(frame * 0.06) * 5;
  const pulse    = 1 + Math.sin(frame * 0.08) * 0.02;
  const shimmer  = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const float1   = Math.sin(frame * 0.07) * 8;
  const float2   = Math.cos(frame * 0.05) * 6;
  const float3   = Math.sin(frame * 0.09 + 1) * 7;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s07.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ───────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="TICKETING ENGINE · ABSTRACTION" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B ───────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={310} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Does Not Know
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={420} fontFamily={FONT} fontSize={64} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            the specific type
          </text>
        </g>

        {/* ── ZONE C — Big question mark ───────────────────────────────── */}
        <g opacity={bigQuestion.opacity} transform={`translate(0, ${bigQuestion.translateY})`}>
          {/* Circle behind question mark */}
          <circle cx={540} cy={700} r={120}
            fill={COLORS.accent} fillOpacity={0.05}
            stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={2 * Math.PI * 120} strokeDashoffset={questionCircle} />
          {/* Giant question mark */}
          <text x={540} y={750} textAnchor="middle"
            fontFamily={FONT} fontSize={200} fontWeight={800}
            fill={COLORS.accent} opacity={0.9}
            transform={`scale(${pulse})`} style={{ transformOrigin: '540px 700px' }}>
            ?
          </text>
        </g>

        {/* ── Floating mini question marks ─────────────────────────────── */}
        <text x={180} y={600 + float1} fontFamily={FONT} fontSize={48} fontWeight={800}
          fill={COLORS.accent} opacity={bigQuestion.opacity * 0.15}>?</text>
        <text x={850} y={650 + float2} fontFamily={FONT} fontSize={56} fontWeight={800}
          fill={COLORS.accent} opacity={bigQuestion.opacity * 0.12}>?</text>
        <text x={300} y={850 + float3} fontFamily={FONT} fontSize={40} fontWeight={800}
          fill={COLORS.accent} opacity={bigQuestion.opacity * 0.1}>?</text>

        {/* ── Possible types — hidden ──────────────────────────────────── */}
        <g opacity={card1.opacity * 0.4} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={880} w={300} h={140} />
          <text x={90} y={930} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            COULD BE
          </text>
          <text x={90} y={980} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            ExpressFare?
          </text>
        </g>

        <g opacity={card2.opacity * 0.4} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={390} y={880} w={300} h={140} />
          <text x={420} y={930} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            COULD BE
          </text>
          <text x={420} y={980} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            MetroFare?
          </text>
        </g>

        <g opacity={card3.opacity * 0.4} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={720} y={880} w={300} h={140} />
          <text x={750} y={930} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            COULD BE
          </text>
          <text x={750} y={980} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            LocalFare?
          </text>
        </g>

        {/* ── Key insight card ─────────────────────────────────────────── */}
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <BentoCard x={60} y={1080} w={960} h={200} accent />
          <rect x={60} y={1080} width={6} height={200} rx={3} fill={COLORS.accent} />
          <text x={100} y={1145} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.08em">
            ABSTRACTION PRINCIPLE
          </text>
          <text x={100} y={1205} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            Code depends on the parent type
          </text>
          <text x={100} y={1255} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.text_muted}>
            never on the child implementation
          </text>
        </g>

        {/* ── Bottom info tiles ────────────────────────────────────────── */}
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <BentoCard x={60} y={1320} w={460} h={160} />
          <text x={100} y={1380} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            FLEXIBILITY
          </text>
          <text x={100} y={1430} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Swap any child
          </text>

          <BentoCard x={560} y={1320} w={460} h={160} />
          <text x={600} y={1380} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            STABILITY
          </text>
          <text x={600} y={1430} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Caller unchanged
          </text>
        </g>

        {/* ── Track ────────────────────────────────────────────────────── */}
        <g opacity={0.12 * shimmer}>
          <line x1={60} y1={1540} x2={1020} y2={1540} stroke={COLORS.accent} strokeWidth={3} />
          <line x1={60} y1={1550} x2={1020} y2={1550} stroke={COLORS.accent} strokeWidth={3} />
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={100 + i * 75} y={1535} width={28} height={6} rx={2}
              fill={COLORS.accent} opacity={0.3} />
          ))}
        </g>

        {/* ── Caption ─────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s07.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
