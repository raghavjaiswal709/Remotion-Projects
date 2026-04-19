/**
 * Scene 11 — Explicit Cast Definition
 * "an explicit cast from a parent-type reference back to a specific child type."
 * CSV: 42.680s → 48.200s
 * Duration: ~166 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline
 *   Phase 2 (frames 20–80):  Three-step flow diagram
 *   Phase 3 (frames 70–end): Micro-animations
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

export const Scene11_ExplicitCastDef: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 12);

  const step1 = useSpringEntrance(frame, 20);
  const step2 = useSpringEntrance(frame, 34);
  const step3 = useSpringEntrance(frame, 48);

  const conn1Len = 120;
  const conn2Len = 120;
  const conn1Dash = usePathDraw(frame, 30, conn1Len, 20);
  const conn2Dash = usePathDraw(frame, 44, conn2Len, 20);

  const summaryCard = useSpringEntrance(frame, 60);
  const keywordsCard = useSpringEntrance(frame, 70);

  const breathe = Math.sin(frame * 0.06) * 4;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS[10];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="DEFINITION" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Explicit Cast
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={390} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent}>
            Parent → Child Reference
          </text>
        </g>

        {/* Step 1 — Parent reference */}
        <g opacity={step1.opacity} transform={`translate(0, ${step1.translateY})`}>
          <BentoCard x={60} y={480} w={960} h={200} />
          <circle cx={140} cy={580} r={40} fill={COLORS.text_muted} fillOpacity={0.15}
            stroke={COLORS.text_muted} strokeWidth={2} />
          <text x={140} y={588} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            1
          </text>
          <text x={220} y={560} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Start with parent-type reference
          </text>
          <text x={220} y={610} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Train t — broad, limited access
          </text>
          <text x={220} y={650} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent} opacity={0.6}>
            Only Train methods visible
          </text>
        </g>

        {/* Connector 1 */}
        <path d="M 540,680 L 540,740" fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={conn1Len} strokeDashoffset={conn1Dash}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* Step 2 — Apply cast */}
        <g opacity={step2.opacity} transform={`translate(0, ${step2.translateY})`}>
          <BentoCard x={60} y={760} w={960} h={200} accent />
          <circle cx={140} cy={860} r={40} fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={140} y={868} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            2
          </text>
          <text x={220} y={840} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            Apply explicit cast
          </text>
          <text x={220} y={890} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            (ExpressTrain) t — tell Java to narrow
          </text>
          <text x={220} y={930} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Developer takes responsibility for correctness
          </text>
        </g>

        {/* Connector 2 */}
        <path d="M 540,960 L 540,1020" fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={conn2Len} strokeDashoffset={conn2Dash}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* Step 3 — Child reference */}
        <g opacity={step3.opacity} transform={`translate(0, ${step3.translateY})`}>
          <BentoCard x={60} y={1040} w={960} h={200} />
          <circle cx={140} cy={1140} r={40} fill={COLORS.accent} fillOpacity={0.2}
            stroke={COLORS.accent} strokeWidth={2.5} />
          <text x={140} y={1148} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            3
          </text>
          <text x={220} y={1120} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Result: child-type reference
          </text>
          <text x={220} y={1170} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            ExpressTrain et — full access restored
          </text>
          <text x={220} y={1210} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            serveLunch(), reserveSeat() now callable
          </text>
        </g>

        {/* Keywords card */}
        <g opacity={keywordsCard.opacity} transform={`translate(0, ${keywordsCard.translateY})`}>
          <BentoCard x={60} y={1300} w={460} h={180} />
          <text x={100} y={1360} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            KEY WORDS
          </text>
          <text x={100} y={1410} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Explicit
          </text>
          <text x={300} y={1410} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            — you write it
          </text>
          <text x={100} y={1455} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Narrowing
          </text>
          <text x={330} y={1455} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            — less general
          </text>
        </g>

        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <BentoCard x={560} y={1300} w={460} h={180} accent />
          <rect x={560} y={1300} width={8} height={180} rx={4} fill={COLORS.accent} />
          <text x={610} y={1370} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Upcasting = implicit
          </text>
          <text x={610} y={1420} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            Downcasting = explicit
          </text>
          <text x={610} y={1460} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Java trusts you — verify first
          </text>
        </g>

        <circle cx={960} cy={460 + breathe} r={4} fill={COLORS.accent} opacity={0.15 * shimmer} />

        <CornerAccents opacity={labelEnt.opacity * 0.3} />

        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s11.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
