/**
 * Scene 03 — WhatChanged
 * "What changed and what never did?"
 * CSV: 6.660s → 8.860s
 * Duration: 84 frames (2.8s)
 *
 * Animation phases:
 *   Phase 1 (0–25): Text springs in word-by-word
 *   Phase 2 (20–60): Split comparison — "CHANGED" vs "NEVER DID" panels draw in
 *   Phase 3 (50–end): Question mark pulses, divider breathes
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
import { PaperBackground, GlobalDefs, Caption, SectionLabel, CornerAccents, Divider } from '../helpers/components';

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SOFT = { damping: 22, stiffness: 120, mass: 1.0 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
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

export const Scene03_WhatChanged: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Word-by-word headline ──
  const labelEntrance = useSpringEntrance(frame, 0);
  const words = ['What', 'changed', 'and', 'what', 'never', 'did?'];
  const wordSprings = words.map((_, i) => {
    const f = Math.max(0, frame - i * 5);
    const sp = spring({ frame: f, fps, config: SPRING_SNAP });
    const ty = interpolate(sp, [0, 1], [24, 0]);
    const op = interpolate(sp, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });
    return { ty, op };
  });

  // ── Phase 2: Comparison panels ──
  const leftPanel = useSpringEntrance(frame, 25);
  const rightPanel = useSpringEntrance(frame, 35);
  const dividerDash = usePathDraw(frame, 20, 1100, 30);

  // Left items (what changed)
  const leftItems = [
    { text: 'Computers', delay: 30 },
    { text: 'Radiation sensors', delay: 38 },
    { text: 'Communication speed', delay: 46 },
    { text: 'Navigation systems', delay: 54 },
  ];
  const leftSprings = leftItems.map(item => useSpringEntrance(frame, item.delay));

  // Right items (what stayed)
  const rightItems = [
    { text: 'Free return trajectory', delay: 34 },
    { text: 'Human courage', delay: 42 },
    { text: 'The question', delay: 50 },
    { text: 'Can we survive?', delay: 58 },
  ];
  const rightSprings = rightItems.map(item => useSpringEntrance(frame, item.delay));

  // ── Phase 3: Micro-animations ──
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.8, 1]);

  // Question mark animation
  const qScale = spring({ frame: Math.max(0, frame - 20), fps, config: SPRING_SNAP });
  const qFloat = Math.sin(frame * 0.07) * 6;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s03.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />
        <CornerAccents color={COLORS.sky_blue} />

        {/* Ghost background question mark */}
        <text x={900} y={480} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={400} fontWeight={900} fill={COLORS.sky_blue} opacity={0.03}>
          ?
        </text>

        {/* Zone A */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="ARTEMIS II · APOLLO 8 COMPARISON" y={260} opacity={0.55} />
        </g>

        {/* Zone B — Word-by-word headline */}
        {words.map((word, i) => {
          const isHighlight = word === 'changed' || word === 'never' || word === 'did?';
          // Layout: 3 words per line
          const lineIdx = Math.floor(i / 3);
          const wordIdx = i % 3;
          const xOffsets = [
            [60, 320, 600],
            [60, 280, 530],
          ];
          const xPos = (xOffsets[lineIdx] || xOffsets[0])[wordIdx] || 60;
          const yPos = 380 + lineIdx * 100;
          return (
            <g key={i} opacity={wordSprings[i].op} transform={`translate(0, ${wordSprings[i].ty})`}>
              <text
                x={xPos} y={yPos}
                fontFamily="'Inter', system-ui, sans-serif"
                fontSize={80} fontWeight={900}
                fill={isHighlight ? COLORS.sky_blue : COLORS.deep_black}
              >
                {word}
              </text>
            </g>
          );
        })}

        {/* Large question mark — floating */}
        <g transform={`translate(900, ${340 + qFloat})`} opacity={shimmer * 0.15}>
          <text
            x={0} y={0} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={280} fontWeight={900}
            fill={COLORS.sky_blue}
            transform={`scale(${interpolate(qScale, [0, 1], [0.5, 1])})`}
            style={{ transformOrigin: '0px 0px' }}
          >
            ?
          </text>
        </g>

        {/* Vertical divider */}
        <line
          x1={540} y1={560} x2={540} y2={1660}
          stroke={COLORS.deep_black} strokeWidth={1.5}
          strokeDasharray={1100}
          strokeDashoffset={dividerDash}
          opacity={0.12}
        />

        {/* Left panel header — WHAT CHANGED */}
        <g opacity={leftPanel.opacity} transform={`translate(0, ${leftPanel.translateY})`}>
          <text x={270} y={630} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={700} fill={COLORS.sky_blue}>
            WHAT CHANGED
          </text>
          {/* Underline */}
          <rect x={120} y={645} width={300} height={3} rx={1.5} fill={COLORS.sky_blue} opacity={0.3} />
        </g>

        {/* Right panel header — WHAT NEVER DID */}
        <g opacity={rightPanel.opacity} transform={`translate(0, ${rightPanel.translateY})`}>
          <text x={810} y={630} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={700} fill={COLORS.cool_silver}>
            WHAT NEVER DID
          </text>
          <rect x={660} y={645} width={300} height={3} rx={1.5} fill={COLORS.cool_silver} opacity={0.3} />
        </g>

        {/* Left items */}
        {leftItems.map((item, i) => (
          <g key={i} opacity={leftSprings[i].opacity} transform={`translate(0, ${leftSprings[i].translateY})`}>
            <rect x={80} y={700 + i * 120} width={6} height={52} rx={3} fill={COLORS.sky_blue} />
            <text x={110} y={736 + i * 120} fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={600} fill={COLORS.deep_black}>
              {item.text}
            </text>
            {/* Animated arrow icon */}
            <path
              d={`M 420,${718 + i * 120} L 445,${718 + i * 120}`}
              fill="none" stroke={COLORS.sky_blue} strokeWidth={2}
              opacity={leftSprings[i].opacity * 0.5}
              markerEnd="url(#arrow)"
            />
          </g>
        ))}

        {/* Right items */}
        {rightItems.map((item, i) => (
          <g key={i} opacity={rightSprings[i].opacity} transform={`translate(0, ${rightSprings[i].translateY})`}>
            <rect x={580} y={700 + i * 120} width={6} height={52} rx={3} fill={COLORS.cool_silver} />
            <text x={610} y={736 + i * 120} fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={600} fill={COLORS.deep_black}>
              {item.text}
            </text>
          </g>
        ))}

        {/* Bottom connector — orbit path between the two sides */}
        <g opacity={leftPanel.opacity * 0.4}>
          <path
            d="M 270,1280 C 270,1450 810,1450 810,1280"
            fill="none" stroke={COLORS.sky_blue} strokeWidth={2}
            strokeDasharray={500}
            strokeDashoffset={usePathDraw(frame, 55, 500, 30)}
            strokeLinecap="round"
          />
          {/* Center label on the curve */}
          <text x={540} y={1420} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.cool_silver} opacity={shimmer}>
            SAME DESTINATION
          </text>
        </g>

        {/* Floating stars — decorative */}
        {[
          { cx: 120, cy: 1550, r: 2.5, delay: 0.02 },
          { cx: 300, cy: 1600, r: 2, delay: 0.03 },
          { cx: 780, cy: 1520, r: 3, delay: 0.04 },
          { cx: 950, cy: 1580, r: 2, delay: 0.05 },
          { cx: 540, cy: 1680, r: 2.5, delay: 0.06 },
          { cx: 160, cy: 1700, r: 1.8, delay: 0.07 },
          { cx: 880, cy: 1700, r: 2.2, delay: 0.035 },
        ].map((star, i) => (
          <circle
            key={i}
            cx={star.cx}
            cy={star.cy + Math.sin(frame * star.delay * 3 + i) * 3}
            r={star.r}
            fill={COLORS.sky_blue}
            opacity={interpolate(Math.sin(frame * star.delay * 5 + i * 2), [-1, 1], [0.15, 0.4])}
          />
        ))}

        {/* Caption */}
        {/* Bottom divider + note */}
        <Divider y={1780} opacity={0.12} />
        <text x={540} y={1820} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.cool_silver} opacity={shimmer * 0.6} letterSpacing="0.12em">
          CHANGED · UNCHANGED · 56 YEARS
        </text>

        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s03.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
