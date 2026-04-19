/**
 * Scene 02 — Recap Task
 * "Last day, we learned what a task is,"
 * CSV: 5.380s → 7.880s | Duration: 84 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline spring in
 *   Phase 2 (20–70): Recap card with task icon builds
 *   Phase 3 (60–end): Micro pulse/float
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
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 } as const;
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

export const Scene02_RecapTask: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const label = useSpringEntrance(frame, 0);
  const headline = useSpringEntrance(frame, 6);
  const subline = useSpringEntrance(frame, 12);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const card1 = useSpringEntrance(frame, 18);
  const card2 = useSpringEntrance(frame, 30);
  const card3 = useSpringEntrance(frame, 42);

  // Task icon path draw
  const checkLen = 120;
  const checkDash = usePathDraw(frame, 25, checkLen, 20);

  // Clipboard path draw
  const clipLen = 600;
  const clipDash = usePathDraw(frame, 20, clipLen, 30);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.012;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s02.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${label.translateY})`} opacity={label.opacity}>
          <SectionLabel text="RECAP · DAY 30" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Headline ───────────────────────────────────────────── */}
        <g transform={`translate(0, ${headline.translateY})`} opacity={headline.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.white}>
            What Is a
          </text>
          <text x={60} y={400} fontFamily={FONT} fontSize={96} fontWeight={800}
            fontStyle="italic" fill={COLORS.accent}>
            Task?
          </text>
        </g>
        <g transform={`translate(0, ${subline.translateY})`} opacity={subline.opacity}>
          <text x={60} y={470} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            Yesterday&apos;s core concept
          </text>
        </g>

        {/* ── ZONE C — Large clipboard illustration ───────────────────────── */}
        <g opacity={card1.opacity} transform={`translate(540, ${750 + card1.translateY + breathe})`}>
          {/* Clipboard body */}
          <rect x={-160} y={-200} width={320} height={440} rx={24}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2.5} />
          {/* Clipboard clip */}
          <rect x={-50} y={-220} width={100} height={50} rx={12}
            fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={2} />
          <rect x={-30} y={-230} width={60} height={30} rx={8}
            fill={COLORS.accent} opacity={0.3} />
          {/* Lines on clipboard (text placeholder) */}
          <rect x={-120} y={-130} width={180} height={10} rx={5} fill={COLORS.accent} opacity={0.4} />
          <rect x={-120} y={-100} width={240} height={10} rx={5} fill="rgba(255,255,255,0.15)" />
          <rect x={-120} y={-70} width={200} height={10} rx={5} fill="rgba(255,255,255,0.15)" />
          <rect x={-120} y={-40} width={220} height={10} rx={5} fill="rgba(255,255,255,0.15)" />
          {/* Divider */}
          <line x1={-120} y1={0} x2={120} y2={0} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          {/* Checkmark at bottom */}
          <path d="M -30,40 L -10,65 L 40,20"
            fill="none" stroke={COLORS.accent} strokeWidth={5}
            strokeDasharray={checkLen} strokeDashoffset={checkDash}
            strokeLinecap="round" strokeLinejoin="round" />
          {/* Status label */}
          <rect x={-60} y={100} width={120} height={40} rx={10}
            fill={COLORS.accent} opacity={0.15} />
          <text x={0} y={127} textAnchor="middle" fontFamily={FONT}
            fontSize={24} fontWeight={800} fill={COLORS.accent}>
            DEFINED
          </text>
          {/* Decorative path around clipboard */}
          <path d={`M -160,-200 L -160,240 L 160,240 L 160,-200 L -50,-200`}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            strokeDasharray={clipLen} strokeDashoffset={clipDash}
            opacity={0.3} />
        </g>

        {/* Accent ring */}
        <circle cx={540} cy={750 + breathe} r={260} fill="none"
          stroke={COLORS.accent} strokeWidth={1.5} opacity={0.08 * shimmer}
          transform={`scale(${pulse})`} style={{ transformOrigin: '540px 750px' }} />

        {/* Detail bento cards below */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={1100} w={460} h={160} />
          <text x={100} y={1160} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            TASK
          </text>
          <text x={100} y={1205} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            A goal with structure
          </text>
        </g>

        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={560} y={1100} w={460} h={160} accent />
          <text x={600} y={1160} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            TODAY
          </text>
          <text x={600} y={1205} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            Autonomy levels
          </text>
        </g>

        {/* Floating dots */}
        {[0, 1, 2, 3].map(i => (
          <circle key={i}
            cx={120 + i * 260}
            cy={1350 + Math.sin(frame * 0.05 + i * 1.2) * 15}
            r={5} fill={COLORS.accent}
            opacity={interpolate(frame, [50 + i * 6, 65 + i * 6], [0, 0.25], { extrapolateRight: 'clamp' }) * shimmer} />
        ))}

        {/* Connector line between cards */}
        <line x1={520} y1={1140} x2={560} y2={1140}
          stroke={COLORS.accent} strokeWidth={2} opacity={card3.opacity * 0.5}
          strokeDasharray="6 4" />

        {/* Additional visual: "Day 30" badge */}
        <g opacity={label.opacity * 0.6}>
          <rect x={820} y={80} width={180} height={50} rx={25}
            fill={COLORS.accent} opacity={0.12} />
          <text x={910} y={113} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent}>
            DAY 30
          </text>
        </g>

        {/* Bottom decoration */}
        <g opacity={interpolate(frame, [55, 70], [0, 0.4], { extrapolateRight: 'clamp' })}>
          <line x1={60} y1={1560} x2={1020} y2={1560}
            stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
          <text x={540} y={1620} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            A task needs three precise components
          </text>
        </g>

        {/* More decorative elements to fill Zone C */}
        {[0, 1, 2].map(i => {
          const dotX = 200 + i * 280;
          const dotY = 1680 + Math.sin(frame * 0.04 + i) * 8;
          const dotOp = interpolate(frame, [60 + i * 10, 75 + i * 10], [0, 0.3], { extrapolateRight: 'clamp' });
          return (
            <g key={`d${i}`} opacity={dotOp}>
              <circle cx={dotX} cy={dotY} r={6} fill={COLORS.accent} opacity={0.4} />
              <circle cx={dotX} cy={dotY} r={12} fill="none" stroke={COLORS.accent} strokeWidth={1} opacity={0.2 * shimmer} />
            </g>
          );
        })}

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s02.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
