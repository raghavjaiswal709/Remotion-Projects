/**
 * Scene 04 — Instance vs Static Intro
 * "Today, we learn the difference between instance variables and static variables."
 * CSV: 13.920s → 18.060s
 * Duration: 143 frames (4.77s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):   Headline springs in with per-word animation
 *   Phase 2 (frames 20–90):  Two-column comparison — INSTANCE vs STATIC bento cards
 *   Phase 3 (frames 80–end): Column pulse, divider shimmer, floating accents
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

export const Scene04_InstanceVsStaticIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);

  const headWords = ['INSTANCE', 'vs', 'STATIC'];
  const wordSprings = headWords.map((_, i) => {
    const f = Math.max(0, frame - 6 - i * 6);
    const sp = spring({ frame: f, fps, config: SPRING_SNAP });
    const ty = interpolate(sp, [0, 1], [28, 0]);
    const op = interpolate(sp, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });
    return { ty, op };
  });

  const subtitleEntry = useSpringEntrance(frame, 24);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const leftCard = useSpringEntrance(frame, 28);
  const rightCard = useSpringEntrance(frame, 36);
  const dividerDraw = usePathDraw(frame, 30, 700, 25);
  const leftItem1 = useSpringEntrance(frame, 44);
  const leftItem2 = useSpringEntrance(frame, 52);
  const leftItem3 = useSpringEntrance(frame, 60);
  const rightItem1 = useSpringEntrance(frame, 48);
  const rightItem2 = useSpringEntrance(frame, 56);
  const rightItem3 = useSpringEntrance(frame, 64);
  const vsCircle = useSpringEntrance(frame, 40);

  // Left card border
  const leftPerimeter = 2 * (460 + 700);
  const leftBorderDash = interpolate(frame, [28, 58], [leftPerimeter, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Right card border
  const rightPerimeter = 2 * (440 + 700);
  const rightBorderDash = interpolate(frame, [36, 66], [rightPerimeter, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s04.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="TODAY'S TOPIC · VARIABLES" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Per-word headline ───────────────────────────────── */}
        {headWords.map((word, i) => (
          <text
            key={word}
            x={i === 0 ? 60 : i === 1 ? 560 : 650}
            y={340}
            fontFamily={FONT}
            fontSize={i === 1 ? 64 : 96}
            fontWeight={800}
            fill={i === 1 ? COLORS.text_muted : (i === 0 ? COLORS.white : COLORS.accent)}
            opacity={wordSprings[i].op}
            transform={`translate(0, ${wordSprings[i].ty})`}
          >
            {word}
          </text>
        ))}

        <g transform={`translate(0, ${subtitleEntry.translateY})`} opacity={subtitleEntry.opacity}>
          <text x={60} y={420} fontFamily={FONT} fontSize={38} fontWeight={800}
            fill={COLORS.text_muted}>
            The difference that defines how data lives
          </text>
        </g>

        {/* ── ZONE C — Two-column comparison ───────────────────────────── */}

        {/* Left column — INSTANCE */}
        <g opacity={leftCard.opacity} transform={`translate(0, ${leftCard.translateY})`}>
          <BentoCard x={60} y={500} w={460} h={700} />
          <rect x={60} y={500} width={460} height={700} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={leftPerimeter} strokeDashoffset={leftBorderDash}
          />

          {/* Header */}
          <rect x={60} y={500} width={460} height={70} rx={20}
            fill={COLORS.accent} fillOpacity={0.12} />
          <text x={290} y={548} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent}>
            INSTANCE
          </text>

          {/* Icon — single object box */}
          <rect x={220} y={600} width={140} height={100} rx={16}
            fill={COLORS.accent} fillOpacity={0.08}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={290} y={660} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>
            obj
          </text>
        </g>

        {/* Left column items */}
        {[
          { text: 'Per Object', y: 740 },
          { text: 'Own Copy', y: 810 },
          { text: 'Born with new()', y: 880 },
        ].map((item, i) => {
          const ent = [leftItem1, leftItem2, leftItem3][i];
          return (
            <g key={i} opacity={ent.opacity} transform={`translate(0, ${ent.translateY})`}>
              <circle cx={120} cy={item.y + 18} r={8}
                fill={COLORS.accent} fillOpacity={0.3} />
              <text x={150} y={item.y + 26}
                fontFamily={FONT} fontSize={36} fontWeight={800}
                fill={COLORS.white}>
                {item.text}
              </text>
            </g>
          );
        })}

        {/* Divider line — vertical center */}
        <line x1={540} y1={520} x2={540} y2={1180}
          stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={700} strokeDashoffset={dividerDraw}
          strokeLinecap="round" opacity={0.4}
        />

        {/* VS circle */}
        <g opacity={vsCircle.opacity}>
          <circle cx={540} cy={850} r={36}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2}
          />
          <text x={540} y={860} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '540px 855px' }}
          >
            VS
          </text>
        </g>

        {/* Right column — STATIC */}
        <g opacity={rightCard.opacity} transform={`translate(0, ${rightCard.translateY})`}>
          <BentoCard x={580} y={500} w={440} h={700} />
          <rect x={580} y={500} width={440} height={700} rx={20}
            fill="none" stroke={COLORS.text_muted} strokeWidth={1}
            strokeDasharray={rightPerimeter} strokeDashoffset={rightBorderDash}
          />

          {/* Header */}
          <rect x={580} y={500} width={440} height={70} rx={20}
            fill={COLORS.white} fillOpacity={0.05} />
          <text x={800} y={548} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>
            STATIC
          </text>

          {/* Icon — class-level shared box */}
          <rect x={740} y={600} width={120} height={80} rx={12}
            fill={COLORS.white} fillOpacity={0.06}
            stroke={COLORS.white} strokeWidth={1.5} strokeOpacity={0.3} />
          <text x={800} y={650} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>
            CLASS
          </text>
        </g>

        {/* Right column items */}
        {[
          { text: 'Per Class', y: 740 },
          { text: 'One Copy', y: 810 },
          { text: 'Born with class', y: 880 },
        ].map((item, i) => {
          const ent = [rightItem1, rightItem2, rightItem3][i];
          return (
            <g key={i} opacity={ent.opacity} transform={`translate(0, ${ent.translateY})`}>
              <circle cx={640} cy={item.y + 18} r={8}
                fill={COLORS.white} fillOpacity={0.25} />
              <text x={670} y={item.y + 26}
                fontFamily={FONT} fontSize={36} fontWeight={800}
                fill={COLORS.text_muted}>
                {item.text}
              </text>
            </g>
          );
        })}

        {/* Floating accents */}
        <g transform={`translate(200, ${1340 + breathe})`}>
          <circle cx={0} cy={0} r={28} fill={COLORS.accent} fillOpacity={0.04 * shimmer} />
        </g>
        <g transform={`translate(880, ${1400 + breathe * 0.7})`}>
          <circle cx={0} cy={0} r={32} fill={COLORS.accent} fillOpacity={0.03 * shimmer} />
        </g>

        {/* ── CAPTION ──────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s04.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
