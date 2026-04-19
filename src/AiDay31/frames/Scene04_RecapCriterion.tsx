/**
 * Scene 04 — Recap Criterion
 * "and a measurable success criterion."
 * CSV: 10.840s → 12.460s | Duration: 73 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline spring
 *   Phase 2 (20–60): Checkmark gauge illustration builds
 *   Phase 3 (50–end): Pulse, shimmer
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

function useCounter(frame: number, startFrame: number, endValue: number, durationFrames = 45) {
  const raw = interpolate(frame, [startFrame, startFrame + durationFrames], [0, endValue], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(raw);
}

export const Scene04_RecapCriterion: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const label = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 12);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const gaugeCard = useSpringEntrance(frame, 18);
  const detailCard = useSpringEntrance(frame, 30);
  const bottomCard = useSpringEntrance(frame, 42);

  // Gauge arc
  const arcLen = 400;
  const arcDash = usePathDraw(frame, 22, arcLen, 30);

  // Checkmark
  const checkLen = 150;
  const checkDash = usePathDraw(frame, 35, checkLen, 20);

  // Counter
  const pctCounter = useCounter(frame, 28, 100, 35);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s04.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${label.translateY})`} opacity={label.opacity}>
          <SectionLabel text="TASK ANATOMY · CRITERION" y={160} />
        </g>

        {/* ── ZONE B ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={76} fontWeight={800} fill={COLORS.white}>
            Measurable
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={88} fontWeight={800}
            fontStyle="italic" fill={COLORS.accent}>
            Success Criterion
          </text>
        </g>

        {/* ── ZONE C — Gauge illustration ─────────────────────────────────── */}
        <g opacity={gaugeCard.opacity} transform={`translate(0, ${gaugeCard.translateY})`}>
          <BentoCard x={60} y={500} w={960} h={500} accent />

          {/* Semi-circle gauge */}
          <g transform={`translate(540, ${750 + breathe})`}>
            {/* Background arc */}
            <path d="M -180,0 A 180,180 0 0,1 180,0"
              fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={20}
              strokeLinecap="round" />
            {/* Animated fill arc */}
            <path d="M -180,0 A 180,180 0 0,1 180,0"
              fill="none" stroke={COLORS.accent} strokeWidth={20}
              strokeLinecap="round"
              strokeDasharray={arcLen} strokeDashoffset={arcDash}
              opacity={shimmer} />
            {/* Tick marks */}
            {Array.from({ length: 11 }, (_, i) => {
              const angle = Math.PI + (i / 10) * Math.PI;
              const inner = 195;
              const outer = 210;
              return (
                <line key={i}
                  x1={Math.cos(angle) * inner} y1={Math.sin(angle) * inner}
                  x2={Math.cos(angle) * outer} y2={Math.sin(angle) * outer}
                  stroke="rgba(255,255,255,0.2)" strokeWidth={2} strokeLinecap="round" />
              );
            })}
            {/* Needle */}
            {(() => {
              const needleAngle = Math.PI + (pctCounter / 100) * Math.PI;
              return (
                <line
                  x1={0} y1={0}
                  x2={Math.cos(needleAngle) * 150} y2={Math.sin(needleAngle) * 150}
                  stroke={COLORS.white} strokeWidth={4} strokeLinecap="round" />
              );
            })()}
            {/* Center dot */}
            <circle cx={0} cy={0} r={12} fill={COLORS.accent}
              transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
            {/* Percentage text */}
            <text x={0} y={-50} textAnchor="middle" fontFamily={FONT}
              fontSize={80} fontWeight={800} fill={COLORS.white}>
              {pctCounter}%
            </text>
            <text x={0} y={-5} textAnchor="middle" fontFamily={FONT}
              fontSize={32} fontWeight={800} fill={COLORS.accent}>
              SUCCESS
            </text>
          </g>
        </g>

        {/* Detail cards */}
        <g opacity={detailCard.opacity} transform={`translate(0, ${detailCard.translateY})`}>
          <BentoCard x={60} y={1040} w={460} h={200} />
          {/* Checkmark icon */}
          <path d="M 110,1120 L 140,1155 L 200,1090"
            fill="none" stroke={COLORS.accent} strokeWidth={5}
            strokeDasharray={checkLen} strokeDashoffset={checkDash}
            strokeLinecap="round" strokeLinejoin="round" />
          <text x={230} y={1130} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Pass / Fail
          </text>
          <text x={110} y={1190} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Binary or quantitative
          </text>
        </g>

        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={560} y={1040} w={460} h={200} accent />
          <text x={600} y={1120} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            Measurable
          </text>
          <text x={600} y={1170} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            No ambiguity allowed
          </text>
          {/* Small bar chart icon */}
          {[0, 1, 2].map(i => (
            <rect key={i} x={600 + i * 35} y={1200 - i * 15}
              width={25} height={30 + i * 15} rx={4}
              fill={COLORS.accent} opacity={0.3 + i * 0.15} />
          ))}
        </g>

        {/* Bottom emphasis */}
        <g opacity={interpolate(frame, [50, 65], [0, 0.5], { extrapolateRight: 'clamp' })}>
          <line x1={60} y1={1320} x2={1020} y2={1320}
            stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
          <text x={540} y={1380} textAnchor="middle" fontFamily={FONT}
            fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            Without a criterion, you cannot judge completion
          </text>
        </g>

        {/* Floating accents */}
        {[0, 1, 2, 3, 4].map(i => (
          <circle key={i}
            cx={100 + i * 220}
            cy={1460 + Math.sin(frame * 0.05 + i * 1.3) * 12}
            r={4} fill={COLORS.accent}
            opacity={interpolate(frame, [55 + i * 5, 68 + i * 5], [0, 0.2], { extrapolateRight: 'clamp' }) * shimmer} />
        ))}

        {/* Additional visual detail — measurement scale */}
        <g opacity={interpolate(frame, [45, 60], [0, 0.4], { extrapolateRight: 'clamp' })}>
          <line x1={200} y1={1540} x2={880} y2={1540}
            stroke={COLORS.accent} strokeWidth={2} opacity={0.3} />
          {[0, 1, 2, 3, 4, 5].map(i => (
            <g key={`tick${i}`}>
              <line x1={200 + i * 136} y1={1530} x2={200 + i * 136} y2={1550}
                stroke={COLORS.accent} strokeWidth={2} opacity={0.3} />
              <text x={200 + i * 136} y={1575} textAnchor="middle"
                fontFamily={FONT} fontSize={20} fontWeight={800} fill={COLORS.text_muted}>
                {i * 20}%
              </text>
            </g>
          ))}
        </g>

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s04.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
