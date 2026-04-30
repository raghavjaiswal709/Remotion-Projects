/**
 * Scene 15 — If Task Needs Six Steps
 * "If the task needs six steps instead of three, the agent adds them."
 * CSV: 55.980s → 61.380s | Duration: 162 frames (5.40s)
 *
 * Theme: Dark #0D0D0D + teal accent
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–28):  "IF task needs 6" big statement
 *   Phase 2 (frames 26–90): 3-step pipeline animation expands → 6-step agent chain
 *   Phase 3 (frames 85–end): "+3 steps" badge bounces, counter ticks
 */
import React from 'react';
import {
  AbsoluteFill, useCurrentFrame, interpolate, spring, Easing,
} from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, SectionLabel, BentoCard } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function useSpringSnap(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_SNAP });
  const opacity  = interpolate(f, [0, 6], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const scale    = interpolate(progress, [0, 1], [0.65, 1]);
  return { progress, opacity, scale };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, dur = 18) {
  const progress = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene15_IfTaskNeedsSix: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // Phase 1
  const labelE   = useSpringEntrance(frame, 0);
  const ifBadge  = useSpringSnap(frame, 4);
  const condText = useSpringEntrance(frame, 12);
  const vsLabel  = useSpringEntrance(frame, 20);

  // First 3 steps (pipeline row)
  const step1 = useSpringEntrance(frame, 28);
  const step2 = useSpringEntrance(frame, 36);
  const step3 = useSpringEntrance(frame, 44);
  const lnk1  = usePathDraw(frame, 32, 60, 14);
  const lnk2  = usePathDraw(frame, 40, 60, 14);

  // Extra 3 steps (agent adds)
  const step4 = useSpringEntrance(frame, 58);
  const step5 = useSpringEntrance(frame, 68);
  const step6 = useSpringEntrance(frame, 78);
  const lnk3  = usePathDraw(frame, 52, 60, 14);
  const lnk4  = usePathDraw(frame, 62, 60, 14);
  const lnk5  = usePathDraw(frame, 72, 60, 14);

  // Plus badge
  const plusBadge = useSpringSnap(frame, 82);
  const insightE  = useSpringEntrance(frame, 94);

  // Phase 3
  const breathe   = Math.sin(frame * 0.08) * 3;
  const counterVal = Math.round(interpolate(frame, [28, 80], [0, 6], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  }));

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s15.from);

  const STEP_W  = 120;
  const STEP_H  = 90;
  const stepY   = 700;
  const stepX3  = [60, 220, 380];               // first 3
  const stepX6  = [60, 210, 360, 510, 660, 810]; // all 6 (tighter)
  const stepLabels3 = ['Search', 'Read', 'Sum'];
  const stepLabels6 = ['Search', 'Read', 'Sum', 'Verify', 'Expand', 'Finalize'];
  const enters3 = [step1, step2, step3];
  const enters6 = [step1, step2, step3, step4, step5, step6];
  const links6Draws = [lnk1, lnk2, lnk3, lnk4, lnk5];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g opacity={labelE.opacity} transform={`translate(0,${labelE.translateY})`}>
          <SectionLabel text="AGENTIC AI · ADAPTATION" y={120} opacity={0.8} />
        </g>

        {/* IF badge */}
        <g transform={`scale(${ifBadge.scale})`}
          style={{ transformOrigin: '60px 250px' }}
          opacity={ifBadge.opacity}>
          <text x={60} y={252} fontFamily={FONT} fontSize={126} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">IF</text>
        </g>

        <g opacity={condText.opacity} transform={`translate(0,${condText.translateY})`}>
          <text x={218} y={244} fontFamily={FONT} fontSize={56} fontWeight={800}
            fill={COLORS.white}>task needs</text>
          <text x={218} y={316} fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.accent}>6 steps</text>
        </g>

        <g opacity={vsLabel.opacity} transform={`translate(0,${vsLabel.translateY})`}>
          <text x={60} y={394} fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.text_muted}>instead of 3, the agent adds them.</text>
        </g>

        {/* PIPELINE row — 3 steps (dims after extra steps appear) */}
        <g opacity={interpolate(step4.opacity, [0, 1], [step1.opacity, 0.35],
          { extrapolateRight: 'clamp' })}>
          <text x={60} y={570} fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.12em">PIPELINE — FIXED AT 3</text>
          {stepLabels3.map((label, i) => {
            const e = enters3[i];
            const sx = stepX3[i];
            return (
              <g key={i} opacity={e.opacity} transform={`translate(0,${e.translateY})`}>
                <rect x={sx} y={600} width={STEP_W} height={STEP_H} rx={14}
                  fill={COLORS.bg_secondary} stroke="rgba(255,255,255,0.18)" strokeWidth={1.5} />
                <text x={sx + STEP_W / 2} y={650} textAnchor="middle"
                  fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
                  {label}
                </text>
              </g>
            );
          })}
          {[lnk1, lnk2].map((d, i) => (
            <line key={i}
              x1={stepX3[i] + STEP_W} y1={600 + STEP_H / 2}
              x2={stepX3[i + 1]} y2={600 + STEP_H / 2}
              stroke={COLORS.text_muted} strokeWidth={2}
              strokeDasharray={60} strokeDashoffset={d}
              markerEnd="url(#arrow)"
              opacity={enters3[i].opacity} />
          ))}
        </g>

        {/* AGENT row — expands to 6 steps */}
        <g>
          <text x={60} y={720} fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.12em"
            opacity={step1.opacity}>AGENT — ADDS STEPS AS NEEDED</text>

          {stepLabels6.map((label, i) => {
            const e = enters6[i];
            const sx = stepX6[i];
            const isNew = i >= 3;
            return (
              <g key={i} opacity={e.opacity} transform={`translate(0,${e.translateY + breathe * (isNew ? 1.2 : 0.5)})`}>
                <rect x={sx} y={750} width={STEP_W} height={STEP_H} rx={14}
                  fill={COLORS.bg_secondary}
                  stroke={isNew ? COLORS.accent : 'rgba(255,255,255,0.18)'}
                  strokeWidth={isNew ? 2 : 1.5} />
                {isNew && (
                  <text x={sx + STEP_W - 16} y={770} fontFamily={FONT}
                    fontSize={18} fontWeight={800} fill={COLORS.accent}>+</text>
                )}
                <text x={sx + STEP_W / 2} y={800} textAnchor="middle"
                  fontFamily={FONT} fontSize={22} fontWeight={800}
                  fill={isNew ? COLORS.accent : COLORS.white}>{label}</text>
              </g>
            );
          })}

          {links6Draws.map((d, i) => (
            <line key={i}
              x1={stepX6[i] + STEP_W} y1={750 + STEP_H / 2}
              x2={stepX6[i + 1]} y2={750 + STEP_H / 2}
              stroke={i >= 2 ? COLORS.accent : COLORS.text_muted}
              strokeWidth={i >= 2 ? 2.5 : 2}
              strokeDasharray={60} strokeDashoffset={d}
              markerEnd="url(#arrow)"
              opacity={enters6[i].opacity} />
          ))}
        </g>

        {/* Counter — "X of 6 steps" */}
        <g opacity={step1.opacity} transform={`translate(540, 905)`}>
          <text textAnchor="middle" fontFamily={FONT} fontSize={52} fontWeight={800}
            fill={COLORS.accent}>{counterVal} of 6 steps planned</text>
        </g>

        {/* +3 STEPS badge */}
        <g transform={`scale(${plusBadge.scale})`}
          style={{ transformOrigin: '540px 990px' }}
          opacity={plusBadge.opacity}>
          <rect x={280} y={960} width={500} height={68} rx={14}
            fill={COLORS.accent} fillOpacity={0.16}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={540} y={1004} textAnchor="middle"
            fontFamily={FONT} fontSize={38} fontWeight={800}
            fill={COLORS.accent}>+ 3 STEPS ADDED AT RUNTIME</text>
        </g>

        {/* Insight */}
        <g opacity={insightE.opacity} transform={`translate(0,${insightE.translateY})`}>
          <BentoCard x={60} y={1070} w={960} h={110} />
          <rect x={60} y={1070} width={6} height={110} rx={3} fill={COLORS.accent} />
          <text x={100} y={1122} fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.white}>Pipeline is fixed at design time.</text>
          <text x={100} y={1162} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>Agent scales to the actual complexity.</text>
        </g>

        {/* CAPTION */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s15.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
