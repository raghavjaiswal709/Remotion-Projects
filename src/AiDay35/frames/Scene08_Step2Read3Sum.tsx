/**
 * Scene 08 — Step 2 Read, Step 3 Summarize
 * "Step 2. Read. Step 3. Summarize."
 * CSV: 31.283s → 34.617s | Duration: 100 frames (3.33s)
 *
 * Theme: Dark #0D0D0D + grid + teal accent #76ABAE
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–22):  Step 2 card slams in with badge + READ icon
 *   Phase 2 (frames 22–50): Step 3 card appears with SUMMARIZE icon
 *   Phase 3 (frames 50–end): Countdown-style pulse on step numbers
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
  const scale    = interpolate(progress, [0, 1], [0.6, 1]);
  return { progress, opacity, scale };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, dur = 18) {
  const progress = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene08_Step2Read3Sum: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // Phase 1
  const labelE  = useSpringEntrance(frame, 0);
  const num2    = useSpringSnap(frame, 4);
  const read2E  = useSpringEntrance(frame, 14);

  // Phase 2
  const num3    = useSpringSnap(frame, 26);
  const sum3E   = useSpringEntrance(frame, 34);
  const arrDash = usePathDraw(frame, 8, 100, 14);

  // Phase 3
  const pulse  = 1 + Math.sin(frame * 0.10) * 0.02;
  const breathe = Math.sin(frame * 0.08) * 3;
  const insightE = useSpringEntrance(frame, 60);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s08.from);

  // Step 1 greyed (already done)
  const CARD_Y  = 560;
  const CARD_H  = 260;
  const CARD1_W = 260;

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g opacity={labelE.opacity} transform={`translate(0,${labelE.translateY})`}>
          <SectionLabel text="AGENTIC AI · PIPELINE" y={120} opacity={0.8} />
        </g>

        {/* ZONE B — headline */}
        <g opacity={labelE.opacity} transform={`translate(0,${labelE.translateY})`}>
          <text x={60} y={280} fontFamily={FONT} fontSize={88} fontWeight={800}
            fill={COLORS.white}>Pipeline Steps</text>
          <text x={60} y={366} fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.text_muted}>fixed at design time</text>
        </g>

        {/* Divider */}
        <line x1={60} y1={400} x2={1020} y2={400}
          stroke={COLORS.accent_mid} strokeWidth={1} opacity={labelE.opacity * 0.4}
          strokeDasharray={960} strokeDashoffset={usePathDraw(frame, 8, 960, 24)} />

        {/* Step 1 — greyed out (already complete) */}
        <g opacity={0.35}>
          <rect x={60} y={CARD_Y} width={CARD1_W} height={CARD_H} rx={18}
            fill={COLORS.bg_secondary} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          <text x={60 + CARD1_W / 2} y={CARD_Y + 80} textAnchor="middle"
            fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted}>STEP 1</text>
          <text x={60 + CARD1_W / 2} y={CARD_Y + 130} textAnchor="middle"
            fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.text_muted}>Search</text>
          <text x={60 + CARD1_W / 2} y={CARD_Y + 218} textAnchor="middle"
            fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.accent} fillOpacity={0.5}>DONE</text>
        </g>

        {/* Arrow 1→2 */}
        <g opacity={num2.opacity}>
          <line x1={320} y1={CARD_Y + CARD_H / 2 + 20} x2={380} y2={CARD_Y + CARD_H / 2 + 20}
            stroke={COLORS.text_muted} strokeWidth={2.5} strokeLinecap="round"
            strokeDasharray={100} strokeDashoffset={arrDash}
            markerEnd="url(#arrow)" />
        </g>

        {/* Step 2 */}
        <g opacity={read2E.opacity} transform={`translate(0, ${read2E.translateY + breathe})`}>
          <rect x={378} y={CARD_Y} width={280} height={CARD_H} rx={18}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          <g opacity={num2.opacity} transform={`scale(${num2.scale})`}
            style={{ transformOrigin: `${378 + 140}px ${CARD_Y + 60}px` }}>
            <text x={378 + 140} y={CARD_Y + 75} textAnchor="middle"
              fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.accent}>STEP 2</text>
          </g>
          {/* Book icon */}
          <rect x={458} y={CARD_Y + 100} width={80} height={68} rx={6}
            fill="none" stroke={COLORS.white} strokeWidth={3} />
          <line x1={498} y1={CARD_Y + 100} x2={498} y2={CARD_Y + 168}
            stroke={COLORS.white} strokeWidth={2} />
          <line x1={458} y1={CARD_Y + 118} x2={498} y2={CARD_Y + 118}
            stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />
          <line x1={458} y1={CARD_Y + 136} x2={498} y2={CARD_Y + 136}
            stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />
          <line x1={498} y1={CARD_Y + 118} x2={538} y2={CARD_Y + 118}
            stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />
          <line x1={498} y1={CARD_Y + 136} x2={538} y2={CARD_Y + 136}
            stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />
          <text x={518} y={CARD_Y + 218} textAnchor="middle"
            fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>Read</text>
        </g>

        {/* Arrow 2→3 */}
        <g opacity={num3.opacity}>
          <line x1={658} y1={CARD_Y + CARD_H / 2 + 20} x2={720} y2={CARD_Y + CARD_H / 2 + 20}
            stroke={COLORS.accent_mid} strokeWidth={2.5} strokeLinecap="round"
            strokeDasharray={100} strokeDashoffset={usePathDraw(frame, 30, 100, 14)}
            markerEnd="url(#arrow)" />
        </g>

        {/* Step 3 */}
        <g opacity={sum3E.opacity} transform={`translate(0, ${sum3E.translateY - breathe})`}>
          <rect x={718} y={CARD_Y} width={302} height={CARD_H} rx={18}
            fill={COLORS.bg_secondary} stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} />
          <g opacity={num3.opacity} transform={`scale(${num3.scale})`}
            style={{ transformOrigin: `${718 + 151}px ${CARD_Y + 60}px` }}>
            <text x={718 + 151} y={CARD_Y + 75} textAnchor="middle"
              fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.text_muted}>STEP 3</text>
          </g>
          {/* Lines icon (summarize) */}
          {[0, 1, 2].map(j => (
            <line key={j}
              x1={780} y1={CARD_Y + 110 + j * 20}
              x2={958} y2={CARD_Y + 110 + j * 20}
              stroke={j === 2 ? COLORS.text_muted : COLORS.white}
              strokeWidth={j === 2 ? 2 : 2.5}
              strokeLinecap="round"
              strokeDasharray={j === 2 ? 100 : 178}
              strokeDashoffset={usePathDraw(frame, 36 + j * 4, j === 2 ? 100 : 178, 14)} />
          ))}
          <text x={718 + 151} y={CARD_Y + 218} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.text_muted}>
            Summarize
          </text>
        </g>

        {/* Insight card */}
        <g opacity={insightE.opacity} transform={`translate(0,${insightE.translateY})`}>
          <BentoCard x={60} y={888} w={960} h={130} accent />
          <rect x={60} y={888} width={6} height={130} rx={3} fill={COLORS.accent} />
          <text x={100} y={942} fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.white}>Fixed sequence, no deviation</text>
          <text x={100} y={990} fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.text_muted}>pipeline always runs 1 → 2 → 3</text>
        </g>

        {/* Steps counter */}
        <g opacity={insightE.opacity} transform={`translate(0,${insightE.translateY})`}>
          {['1','2','3'].map((n, i) => (
            <g key={n}>
              <BentoCard x={60 + i * 340} y={1060} w={300} h={100} />
              <text x={60 + i * 340 + 150} y={1125} textAnchor="middle"
                fontFamily={FONT} fontSize={52} fontWeight={800}
                fill={i === 0 ? COLORS.accent : i === 1 ? COLORS.white : COLORS.text_muted}>
                {n}
              </text>
            </g>
          ))}
        </g>

        {/* CAPTION */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s08.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
