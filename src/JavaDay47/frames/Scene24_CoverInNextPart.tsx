/**
 * Scene 24 — Cover In The Next Part
 * "And that is exactly what we cover in the next part."
 * CSV: 85.360s → 88.020s
 * Duration: ~80 frames
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):  Label + headline
 *   Phase 2 (frames 20–55): Today recap + next part preview
 *   Phase 3 (frames 50–end): Micro-pulse
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
const MONO = "'Fira Code', 'Courier New', monospace";

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

export const Scene24_CoverInNextPart: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headEnt = useSpringEntrance(frame, 6);
  const todayEnt = useSpringEntrance(frame, 18);
  const item1Ent = useSpringEntrance(frame, 26);
  const item2Ent = useSpringEntrance(frame, 34);
  const item3Ent = useSpringEntrance(frame, 42);
  const nextEnt = useSpringEntrance(frame, 50);
  const arrowEnt = useSpringEntrance(frame, 56);

  // Forward arrow path draw
  const arrowLen = 200;
  const arrowDash = usePathDraw(frame, 54, arrowLen, 22);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS[23];

  const todayItems = [
    { label: 'Downcasting', desc: 'Narrowing parent → child' },
    { label: 'ClassCastException', desc: 'Runtime crash risk' },
    { label: 'Verify first', desc: 'Never cast blindly' },
  ];
  const itemEnts = [item1Ent, item2Ent, item3Ent];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="NEXT · PART 48" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${headEnt.translateY})`} opacity={headEnt.opacity}>
          <text x={60} y={280} fontFamily={FONT} fontSize={64} fontWeight={800} fill={COLORS.white}>
            Next part:
          </text>
          <text x={60} y={380} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            instanceof
          </text>
        </g>

        {/* TODAY badge */}
        <g opacity={todayEnt.opacity} transform={`translate(0, ${todayEnt.translateY})`}>
          <rect x={60} y={460} width={140} height={44} rx={10}
            fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={130} y={490} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent}>
            TODAY
          </text>
        </g>

        {/* Today recap items */}
        {todayItems.map((item, i) => {
          const ent = itemEnts[i];
          const y = 540 + i * 170;
          return (
            <g key={i} opacity={ent.opacity} transform={`translate(0, ${ent.translateY})`}>
              <BentoCard x={60} y={y} w={960} h={150} accent={i === 0} />
              <rect x={60} y={y} width={6} height={150} rx={3} fill={COLORS.accent} opacity={0.6} />

              {/* Number badge */}
              <circle cx={120} cy={y + 75} r={22}
                fill={COLORS.accent} fillOpacity={0.12}
                stroke={COLORS.accent} strokeWidth={1.5} />
              <text x={120} y={y + 83} textAnchor="middle"
                fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent}>
                {i + 1}
              </text>

              <text x={170} y={y + 65}
                fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
                {item.label}
              </text>
              <text x={170} y={y + 105}
                fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
                {item.desc}
              </text>
            </g>
          );
        })}

        {/* Divider arrow leading to NEXT */}
        <g opacity={arrowEnt.opacity}>
          <path d="M 540,1070 L 540,1130"
            fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeLinecap="round" markerEnd="url(#arrow)"
            strokeDasharray={arrowLen} strokeDashoffset={arrowDash} />
        </g>

        {/* NEXT PART card */}
        <g opacity={nextEnt.opacity} transform={`translate(0, ${nextEnt.translateY})`}>
          <BentoCard x={60} y={1160} w={960} h={340} accent />
          <rect x={60} y={1160} width={8} height={340} rx={4} fill={COLORS.accent} />

          {/* TOMORROW badge */}
          <rect x={100} y={1180} width={200} height={44} rx={10}
            fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={200} y={1210} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent}>
            DAY 48
          </text>

          <text x={540} y={1280} textAnchor="middle"
            fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.white}>
            The instanceof
          </text>
          <text x={540} y={1340} textAnchor="middle"
            fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent}>
            Keyword
          </text>

          {/* Preview items */}
          <text x={540} y={1400} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Type-check before you cast — the safe pattern
          </text>

          {/* Forward arrow icon */}
          <g transform={`translate(540, 1460)`}>
            <path d="M -20,0 L 20,0 M 10,-10 L 20,0 L 10,10"
              fill="none" stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" />
          </g>
        </g>

        {/* Micro-animations */}
        <circle cx={120} cy={1580 + breathe} r={3} fill={COLORS.accent} opacity={0.08 * shimmer} />
        <circle cx={960} cy={1620 - breathe} r={4} fill={COLORS.accent} opacity={0.06} />

        <g transform={`translate(540, ${1680 + breathe})`}>
          <circle cx={0} cy={0} r={24} fill={COLORS.accent} fillOpacity={0.04 * shimmer} />
          <circle cx={0} cy={0} r={24} fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            opacity={0.12} transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        <CornerAccents opacity={labelEnt.opacity * 0.3} />

        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s24.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
