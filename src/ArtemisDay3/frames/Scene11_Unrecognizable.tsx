/**
 * Scene 11 — Unrecognizable
 * "But almost everything else is unrecognizable."
 * CSV: 53.240s → 55.900s
 * Duration: 98 frames (3.27s) — short dramatic scene
 *
 * Animation phases:
 *   Phase 1 (0–20): Word-by-word headline spring
 *   Phase 2 (15–55): Old vs New side-by-side, transform paths
 *   Phase 3 (45–end): Shimmer, pulse, glow pulse on "unrecognizable"
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

// Comparison items
const ITEMS = [
  { old: 'Analog dials', newItem: 'Glass cockpit displays', color: COLORS.sky_blue },
  { old: '2 KB memory', newItem: 'Terabytes of data', color: COLORS.green },
  { old: 'Ground-only nav', newItem: 'Autonomous navigation', color: COLORS.purple },
  { old: 'No life support AI', newItem: 'Real-time monitoring', color: COLORS.orange },
] as const;

export const Scene11_Unrecognizable: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Headline ──
  const labelEntrance = useSpringEntrance(frame, 0);
  const words = ['But', 'almost', 'everything', 'else', 'is'];
  const wordSprings = words.map((_, i) => {
    const f = Math.max(0, frame - i * 5);
    const sp = spring({ frame: f, fps, config: SPRING_SNAP });
    const ty = interpolate(sp, [0, 1], [24, 0]);
    const op = interpolate(sp, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });
    return { ty, op };
  });
  const bigWord = useSpringEntrance(frame, 28);

  // ── Phase 2: Comparison columns ──
  const dividerSpring = useSpringEntrance(frame, 18);
  const leftHeader = useSpringEntrance(frame, 22);
  const rightHeader = useSpringEntrance(frame, 26);
  const itemSprings = ITEMS.map((_, i) => useSpringEntrance(frame, 30 + i * 10));
  const arrowSprings = ITEMS.map((_, i) => {
    const arrowLen = 60;
    return usePathDraw(frame, 34 + i * 10, arrowLen, 15);
  });

  // ── Phase 3 ──
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s11.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />
        <CornerAccents color={COLORS.sky_blue} />

        {/* Zone A */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="APOLLO 8 VS ARTEMIS II" y={260} opacity={0.55} />
        </g>

        {/* Zone B — Word-by-word headline */}
        {words.map((word, i) => (
          <text
            key={i}
            x={60 + i * 100}
            y={380}
            opacity={wordSprings[i].op}
            transform={`translate(0, ${wordSprings[i].ty})`}
            fontFamily="'Inter', sans-serif"
            fontSize={52}
            fontWeight={600}
            fill={COLORS.cool_silver}
          >
            {word}
          </text>
        ))}

        {/* Big keyword */}
        <g opacity={bigWord.opacity} transform={`translate(0, ${bigWord.translateY})`}>
          {/* Ghost layer */}
          <text x={540} y={520} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={88} fontWeight={900} fill={COLORS.sky_blue} opacity={0.08}>
            UNRECOGNIZABLE
          </text>
          {/* Main */}
          <text
            x={540} y={520}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif"
            fontSize={80}
            fontWeight={900}
            fill={COLORS.deep_black}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '540px 520px' }}
          >
            UNRECOGNIZABLE
          </text>
        </g>

        {/* Vertical divider */}
        <g opacity={dividerSpring.opacity}>
          <line x1={540} y1={600} x2={540} y2={1360} stroke={COLORS.deep_black} strokeWidth={1} opacity={0.12} />
        </g>

        {/* Left column header: 1968 */}
        <g opacity={leftHeader.opacity} transform={`translate(0, ${leftHeader.translateY})`}>
          <text x={270} y={650} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={44} fontWeight={800} fill={COLORS.cool_silver} letterSpacing="0.05em">
            1968
          </text>
          <text x={270} y={690} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.cool_silver} opacity={0.6}>
            APOLLO 8
          </text>
        </g>

        {/* Right column header: 2025 */}
        <g opacity={rightHeader.opacity} transform={`translate(0, ${rightHeader.translateY})`}>
          <text x={810} y={650} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={44} fontWeight={800} fill={COLORS.sky_blue} letterSpacing="0.05em">
            2025
          </text>
          <text x={810} y={690} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.sky_blue} opacity={0.6}>
            ARTEMIS II
          </text>
        </g>

        {/* Comparison rows */}
        {ITEMS.map((item, i) => {
          const rowY = 760 + i * 150;
          return (
            <g key={i}>
              {/* OLD (left) */}
              <g opacity={itemSprings[i].opacity} transform={`translate(0, ${itemSprings[i].translateY})`}>
                <rect x={60} y={rowY} width={440} height={60} rx={10}
                  fill={COLORS.deep_black} fillOpacity={0.02}
                  stroke={COLORS.cool_silver} strokeWidth={1} opacity={0.3}
                />
                <text x={80} y={rowY + 40} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.cool_silver}>
                  {item.old}
                </text>
              </g>

              {/* Arrow */}
              <line
                x1={510} y1={rowY + 30} x2={570} y2={rowY + 30}
                stroke={item.color} strokeWidth={2.5}
                strokeDasharray={60}
                strokeDashoffset={arrowSprings[i]}
                markerEnd="url(#arrow)"
                opacity={0.5}
              />

              {/* NEW (right) */}
              <g opacity={itemSprings[i].opacity} transform={`translate(0, ${itemSprings[i].translateY})`}>
                <rect x={580} y={rowY} width={440} height={60} rx={10}
                  fill={item.color} fillOpacity={0.04}
                  stroke={item.color} strokeWidth={1.5}
                />
                <rect x={580} y={rowY} width={6} height={60} rx={3} fill={item.color} />
                <text x={604} y={rowY + 40} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.deep_black}>
                  {item.newItem}
                </text>
              </g>

              {/* Row divider */}
              <line x1={60} y1={rowY + 80} x2={1020} y2={rowY + 80} stroke={COLORS.deep_black} strokeWidth={1} opacity={0.04} />
            </g>
          );
        })}

        {/* Bottom emphasis */}
        <g opacity={itemSprings[3].opacity * shimmer}>
          <text x={540} y={1420} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={700} fill={COLORS.sky_blue}>
            Completely different machine
          </text>
          <text x={540} y={1465} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={400} fill={COLORS.cool_silver}>
            Same destination — same question
          </text>
        </g>

        {/* Decorative corner brackets */}
        <g opacity={itemSprings[3].opacity * 0.4}>
          <path d="M 60,570 L 60,600 M 60,570 L 90,570" fill="none" stroke={COLORS.cool_silver} strokeWidth={2} strokeLinecap="round" />
          <path d="M 1020,570 L 1020,600 M 1020,570 L 990,570" fill="none" stroke={COLORS.sky_blue} strokeWidth={2} strokeLinecap="round" />
          <path d="M 60,1360 L 60,1330 M 60,1360 L 90,1360" fill="none" stroke={COLORS.cool_silver} strokeWidth={2} strokeLinecap="round" />
          <path d="M 1020,1360 L 1020,1330 M 1020,1360 L 990,1360" fill="none" stroke={COLORS.sky_blue} strokeWidth={2} strokeLinecap="round" />
        </g>

        {/* Hovering years at bottom */}
        <g opacity={itemSprings[3].opacity * 0.2}>
          <text x={270} y={1560 + breathe} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={160} fontWeight={900} fill={COLORS.cool_silver}>
            68
          </text>
          <text x={810} y={1560 + breathe * -1} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={160} fontWeight={900} fill={COLORS.sky_blue}>
            25
          </text>
        </g>

        {/* Divider + bottom note */}
        <Divider y={1780} opacity={0.12} />
        <text x={540} y={1810} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={400} fill={COLORS.cool_silver} letterSpacing="0.15em" opacity={0.45}>
          1968 → 2025 · UNRECOGNIZABLE
        </text>

        {/* Caption */}
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
