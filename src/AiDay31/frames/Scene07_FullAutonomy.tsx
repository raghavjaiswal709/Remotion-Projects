/**
 * Scene 07 — Full Autonomy
 * "Full autonomy. The agent decides and acts without asking."
 * CSV: 20.100s → 24.740s | Duration: 140 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline spring
 *   Phase 2 (20–90): Robot acting alone, decision flow
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

export const Scene07_FullAutonomy: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const label = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 12);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const mainCard = useSpringEntrance(frame, 18);
  const flowCard = useSpringEntrance(frame, 30);
  const actionCard = useSpringEntrance(frame, 42);
  const bottomCard = useSpringEntrance(frame, 54);
  const summaryCard = useSpringEntrance(frame, 66);

  // Arrow connectors
  const arrowLen = 120;
  const arrow1Dash = usePathDraw(frame, 35, arrowLen, 20);
  const arrow2Dash = usePathDraw(frame, 50, arrowLen, 20);
  const arrow3Dash = usePathDraw(frame, 65, arrowLen, 20);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s07.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${label.translateY})`} opacity={label.opacity}>
          <SectionLabel text="SPECTRUM · FULL END" y={160} />
        </g>

        {/* ── ZONE B ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={96} fontWeight={800} fill={COLORS.accent}>
            Full
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={420} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Autonomy
          </text>
        </g>

        {/* ── ZONE C ──────────────────────────────────────────────────────── */}

        {/* Robot in action — large illustration */}
        <g opacity={mainCard.opacity} transform={`translate(0, ${mainCard.translateY})`}>
          <BentoCard x={60} y={500} w={620} h={440} accent />

          {/* Robot head */}
          <rect x={180} y={560} width={200} height={160} rx={24}
            fill="none" stroke={COLORS.accent} strokeWidth={4} />
          {/* Eyes — active, glowing */}
          <circle cx={240} cy={630} r={14} fill={COLORS.accent} opacity={shimmer} />
          <circle cx={320} cy={630} r={14} fill={COLORS.accent} opacity={shimmer} />
          {/* Smile — confident */}
          <path d="M 240,660 Q 280,685 320,660" fill="none"
            stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" />

          {/* Body */}
          <rect x={200} y={740} width={160} height={150} rx={12}
            fill="none" stroke={COLORS.accent} strokeWidth={3} />
          {/* Arms extended — reaching for action */}
          <line x1={200} y1={780} x2={120} y2={780}
            stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" />
          <line x1={360} y1={780} x2={480} y2={740}
            stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" />

          {/* Lightning bolt on chest */}
          <path d="M 270,770 L 260,800 L 290,800 L 280,840"
            fill="none" stroke={COLORS.white} strokeWidth={3}
            strokeLinecap="round" strokeLinejoin="round" />

          {/* "100%" label */}
          <text x={520} y={650} fontFamily={FONT} fontSize={64} fontWeight={800}
            fill={COLORS.accent} opacity={shimmer}>
            100%
          </text>
          <text x={520} y={700} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            INDEPENDENT
          </text>
        </g>

        {/* No human needed badge */}
        <g opacity={mainCard.opacity} transform={`translate(0, ${mainCard.translateY})`}>
          <BentoCard x={720} y={500} w={300} h={200} />
          {/* Human silhouette crossed out */}
          <circle cx={870} cy={570} r={22} fill="none"
            stroke="rgba(255,255,255,0.2)" strokeWidth={2} />
          <line x1={870} y1={592} x2={870} y2={640}
            stroke="rgba(255,255,255,0.2)" strokeWidth={2} />
          {/* X over human */}
          <line x1={840} y1={545} x2={900} y2={650}
            stroke={COLORS.vibrant_red} strokeWidth={3} strokeLinecap="round" opacity={0.6} />
          <text x={870} y={680} textAnchor="middle" fontFamily={FONT}
            fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            NO APPROVAL
          </text>
        </g>

        {/* Flow: Decide → Act → Done */}
        <g opacity={flowCard.opacity} transform={`translate(0, ${flowCard.translateY})`}>
          <BentoCard x={720} y={720} w={300} h={220} accent />

          {/* Three step nodes */}
          {['DECIDE', 'ACT', 'DONE'].map((step, i) => (
            <g key={step}>
              <circle cx={790} cy={770 + i * 60} r={16}
                fill={i === 2 ? COLORS.accent : COLORS.bg_primary}
                stroke={COLORS.accent} strokeWidth={2} />
              <text x={820} y={778 + i * 60} fontFamily={FONT}
                fontSize={26} fontWeight={800}
                fill={i === 2 ? COLORS.accent : COLORS.white}>
                {step}
              </text>
            </g>
          ))}
          {/* Vertical connector line */}
          <line x1={790} y1={790} x2={790} y2={870}
            stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={arrowLen} strokeDashoffset={arrow1Dash}
            strokeLinecap="round" />
        </g>

        {/* Action examples */}
        <g opacity={actionCard.opacity} transform={`translate(0, ${actionCard.translateY})`}>
          <BentoCard x={60} y={980} w={960} h={200} />
          <rect x={60} y={980} width={6} height={200} rx={3} fill={COLORS.accent} />

          <text x={120} y={1060} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Decides
          </text>
          {/* Arrow right */}
          <path d="M 350,1050 L 430,1050" fill="none" stroke={COLORS.accent}
            strokeWidth={3} strokeDasharray={arrowLen} strokeDashoffset={arrow2Dash}
            markerEnd="url(#arrow)" strokeLinecap="round" />
          <text x={460} y={1060} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}>
            Acts
          </text>
          {/* Arrow right */}
          <path d="M 600,1050 L 680,1050" fill="none" stroke={COLORS.accent}
            strokeWidth={3} strokeDasharray={arrowLen} strokeDashoffset={arrow3Dash}
            markerEnd="url(#arrow)" strokeLinecap="round" />
          <text x={710} y={1060} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Without Asking
          </text>
          <text x={120} y={1130} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            No human in the loop at any point
          </text>
        </g>

        {/* Bottom cards */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={60} y={1220} w={460} h={200} accent />
          <text x={100} y={1310} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            Maximum speed
          </text>
          <text x={100} y={1360} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            No waiting, no blocking
          </text>
        </g>

        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <BentoCard x={560} y={1220} w={460} h={200} />
          <text x={600} y={1310} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Maximum risk
          </text>
          <text x={600} y={1360} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Mistakes happen alone
          </text>
        </g>

        {/* Floating accents */}
        {[0, 1, 2, 3].map(i => (
          <circle key={i}
            cx={200 + i * 240}
            cy={1500 + Math.sin(frame * 0.06 + i * 1.5) * 10}
            r={4} fill={COLORS.accent}
            opacity={interpolate(frame, [90 + i * 4, 110 + i * 4], [0, 0.2], { extrapolateRight: 'clamp' }) * shimmer} />
        ))}

        {/* Emphasis line */}
        <g opacity={interpolate(frame, [100, 120], [0, 0.3], { extrapolateRight: 'clamp' })}>
          <text x={540} y={1590} textAnchor="middle" fontFamily={FONT}
            fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            Agent owns every decision end to end
          </text>
        </g>

        {/* Breathing ring */}
        <g transform={`translate(540, ${1680 + breathe})`}>
          <circle cx={0} cy={0} r={32} fill={COLORS.accent} fillOpacity={0.05 * shimmer} />
          <circle cx={0} cy={0} r={32} fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} opacity={0.25} />
        </g>

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s07.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
