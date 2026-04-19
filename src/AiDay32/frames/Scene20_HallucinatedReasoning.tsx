/**
 * Scene 20 — Correct Answer Through Hallucinated Reasoning
 * "A correct answer reached through hallucinated reasoning..."
 * CSV: 48.860s → 52.200s
 * Duration: 100 frames (3.33s)
 *
 * Animation phases:
 *   Phase 1 (0–15): Label + headline
 *   Phase 2 (10–60): Warning illustration, hallucination path vs real path
 *   Phase 3 (50–end): Pulse, breathe
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
  const p = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - p);
}

export const Scene20_HallucinatedReasoning: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const lbl = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 3);
  const h2 = useSpringEntrance(frame, 8);

  const warningCard = useSpringEntrance(frame, 14);
  const pathReal = useSpringEntrance(frame, 22);
  const pathHalluc = useSpringEntrance(frame, 30);
  const botCard = useSpringEntrance(frame, 40);
  const summaryCard = useSpringEntrance(frame, 55);

  const realPathLen = 400;
  const hallPathLen = 400;
  const realDash = usePathDraw(frame, 26, realPathLen, 20);
  const hallDash = usePathDraw(frame, 34, hallPathLen, 20);

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s20.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${lbl.translateY})`} opacity={lbl.opacity}>
          <SectionLabel text="TRAJECTORY · WARNING" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={64} fontWeight={800} fill={COLORS.white}>
            A correct answer
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={395} fontFamily={FONT} fontSize={56} fontWeight={800}
            fill={COLORS.vibrant_red} fontStyle="italic">
            through hallucinated reasoning
          </text>
        </g>

        {/* Warning triangle */}
        <g opacity={warningCard.opacity} transform={`translate(0, ${warningCard.translateY})`}>
          <BentoCard x={60} y={480} w={960} h={200} />
          <polygon points="540,510 580,580 500,580"
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={3} />
          <text x={540} y={572} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.vibrant_red}>
            !
          </text>
          <text x={540} y={640} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Same output — different reasoning quality
          </text>
        </g>

        {/* Two paths side by side */}
        {/* Real Path */}
        <g opacity={pathReal.opacity} transform={`translate(0, ${pathReal.translateY})`}>
          <BentoCard x={60} y={720} w={460} h={440} accent />
          <text x={100} y={780} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            VALID REASONING
          </text>
          {/* Straight clear path */}
          <line x1={140} y1={840} x2={140} y2={1100}
            stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={realPathLen} strokeDashoffset={realDash}
            strokeLinecap="round" />
          {['Goal', 'Search', 'Read', 'Summarize'].map((s, i) => (
            <g key={i}>
              <circle cx={140} cy={840 + i * 87} r={14}
                fill={COLORS.accent} fillOpacity={0.12}
                stroke={COLORS.accent} strokeWidth={1.5} />
              <text x={170} y={846 + i * 87} fontFamily={FONT}
                fontSize={28} fontWeight={800} fill={COLORS.white}>
                {s}
              </text>
            </g>
          ))}
          <circle cx={360} cy={1130} r={20} fill={COLORS.accent} fillOpacity={0.1} />
          <path d="M 350,1130 L 356,1138 L 370,1122"
            fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
        </g>

        {/* Hallucinated Path */}
        <g opacity={pathHalluc.opacity} transform={`translate(0, ${pathHalluc.translateY})`}>
          <BentoCard x={560} y={720} w={460} h={440} />
          <rect x={560} y={720} width={6} height={440} rx={3} fill={COLORS.vibrant_red} />
          <text x={600} y={780} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.vibrant_red} letterSpacing="0.1em">
            HALLUCINATED PATH
          </text>
          {/* Wobbly path */}
          <path d="M 640,840 C 620,890 680,920 640,960 C 600,1000 700,1040 640,1100"
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={3}
            strokeDasharray={hallPathLen} strokeDashoffset={hallDash}
            strokeLinecap="round" opacity={0.6} />
          {['Goal', '???', 'Guess', 'Lucky'].map((s, i) => (
            <g key={i}>
              <circle cx={640} cy={840 + i * 87} r={14}
                fill={COLORS.vibrant_red} fillOpacity={0.08}
                stroke={COLORS.vibrant_red} strokeWidth={1}
                strokeDasharray={i > 0 ? '4,4' : 'none'} />
              <text x={670} y={846 + i * 87} fontFamily={FONT}
                fontSize={28} fontWeight={800}
                fill={i === 0 ? COLORS.white : COLORS.vibrant_red}
                opacity={i > 0 ? 0.6 : 1}>
                {s}
              </text>
            </g>
          ))}
          <circle cx={860} cy={1130} r={20} fill={COLORS.vibrant_red} fillOpacity={0.08} />
          <path d="M 850,1130 L 856,1138 L 870,1122"
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={2.5} opacity={0.4} />
        </g>

        {/* Same output label between both */}
        <g opacity={botCard.opacity} transform={`translate(0, ${botCard.translateY})`}>
          <rect x={420} y={1090} width={240} height={56} rx={28}
            fill={COLORS.bg_secondary} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          <text x={540} y={1126} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            Same output ✓
          </text>
        </g>

        {/* Bottom summary */}
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <BentoCard x={60} y={1220} w={960} h={160} accent />
          <text x={540} y={1316} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Without the trajectory, <tspan fill={COLORS.vibrant_red}>you can't tell the difference</tspan>
          </text>
        </g>

        {/* Floating dots */}
        {[120, 540, 960].map((x, i) => (
          <circle key={i} cx={x} cy={1500 + breathe + i * 40}
            r={4} fill={COLORS.accent} opacity={0.06 * shimmer} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s20.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
