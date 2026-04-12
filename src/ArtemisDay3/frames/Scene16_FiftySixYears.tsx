/**
 * Scene 16 — FiftySixYears
 * "That is what 56 years of refusing to stop looks like."
 * CSV: 76.640s → 81.880s
 * Duration: 161 frames (5.37s)
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline spring
 *   Phase 2 (20–80): Giant "56" counter, timeline path, milestone cards
 *   Phase 3 (70–end): Pulse, float, shimmer
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
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;
const SPRING_HEAVY = { damping: 28, stiffness: 100, mass: 1.4 } as const;

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

function useCounter(frame: number, startFrame: number, endValue: number, durationFrames = 45) {
  const raw = interpolate(frame, [startFrame, startFrame + durationFrames], [0, endValue], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(raw);
}

export const Scene16_FiftySixYears: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 12);

  // ── Phase 2 ──
  const bigNum = useSpringEntrance(frame, 8);
  const yearCounter = useCounter(frame, 10, 56, 50);
  const timelinePath = useSpringEntrance(frame, 20);
  const milestone1 = useSpringEntrance(frame, 30);
  const milestone2 = useSpringEntrance(frame, 40);
  const milestone3 = useSpringEntrance(frame, 50);
  const milestone4 = useSpringEntrance(frame, 60);
  const bottomCard = useSpringEntrance(frame, 72);

  // Timeline path draw
  const timelineLen = 900;
  const timelineDash = usePathDraw(frame, 22, timelineLen, 40);

  // Milestone connector draws
  const connLen = 60;
  const conn1 = usePathDraw(frame, 32, connLen, 15);
  const conn2 = usePathDraw(frame, 42, connLen, 15);
  const conn3 = usePathDraw(frame, 52, connLen, 15);
  const conn4 = usePathDraw(frame, 62, connLen, 15);

  // ── Phase 3 ──
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s16.from);

  const milestones = [
    { year: '1968', label: 'Apollo 8', sub: 'First lunar orbit', color: COLORS.cool_silver, x: 135 },
    { year: '1972', label: 'Apollo 17', sub: 'Last lunar mission', color: COLORS.cool_silver, x: 375 },
    { year: '2022', label: 'Artemis I', sub: 'Uncrewed test', color: COLORS.amber, x: 680 },
    { year: '2025', label: 'Artemis II', sub: 'Crewed return', color: COLORS.sky_blue, x: 920 },
  ];

  const milestoneEntrances = [milestone1, milestone2, milestone3, milestone4];
  const milestoneConns = [conn1, conn2, conn3, conn4];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* Corner accents */}
        <CornerAccents opacity={0.35} color={COLORS.amber} />

        {/* Zone A */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="PERSISTENCE · 56 YEARS" y={260} opacity={0.55} />
        </g>

        {/* Zone B — Giant number */}
        <g opacity={bigNum.opacity} transform={`translate(0, ${bigNum.translateY})`}>
          {/* Ghost layer */}
          <text x={540} y={560} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={320} fontWeight={900}
            fill={COLORS.sky_blue} opacity={0.06}>
            {yearCounter}
          </text>
          {/* Primary number */}
          <text x={540} y={560} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={280} fontWeight={900}
            fill={COLORS.sky_blue}>
            {yearCounter}
          </text>
          <text x={540} y={620} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={44} fontWeight={500}
            fill={COLORS.cool_silver}>
            YEARS
          </text>
        </g>

        {/* Subtitle */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={540} y={700} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={40} fontWeight={700} fill={COLORS.deep_black}>
            Refusing to Stop
          </text>
        </g>

        {/* Zone C — Timeline */}
        <g opacity={timelinePath.opacity}>
          {/* Main horizontal timeline */}
          <line x1={90} y1={870} x2={990} y2={870}
            stroke={COLORS.deep_black} strokeWidth={2} opacity={0.1}
            strokeDasharray={timelineLen} strokeDashoffset={timelineDash}
          />
          {/* Active portion */}
          <line x1={90} y1={870} x2={990} y2={870}
            stroke={COLORS.sky_blue} strokeWidth={3} opacity={0.3}
            strokeDasharray={timelineLen} strokeDashoffset={timelineDash}
          />
        </g>

        {/* Milestone markers on timeline */}
        {milestones.map((m, i) => (
          <g key={i} opacity={milestoneEntrances[i].opacity}>
            {/* Vertical connector */}
            <line x1={m.x} y1={870} x2={m.x} y2={930}
              stroke={m.color} strokeWidth={1.5}
              strokeDasharray={connLen} strokeDashoffset={milestoneConns[i]}
            />
            {/* Dot on timeline */}
            <circle cx={m.x} cy={870} r={i === 3 ? 10 : 6}
              fill={m.color} fillOpacity={i === 3 ? 0.2 : 0.1}
              stroke={m.color} strokeWidth={2}
            />
            {i === 3 && (
              <circle cx={m.x} cy={870} r={10} fill="none" stroke={m.color} strokeWidth={1.5}
                opacity={0.2 * shimmer}
                transform={`scale(${pulse})`}
                style={{ transformOrigin: `${m.x}px 870px` }}
              />
            )}
            {/* Year label */}
            <text x={m.x} y={960} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={800}
              fill={m.color} transform={`translate(0, ${milestoneEntrances[i].translateY})`}>
              {m.year}
            </text>
            {/* Event label */}
            <text x={m.x} y={995} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={600}
              fill={COLORS.deep_black} opacity={0.7} transform={`translate(0, ${milestoneEntrances[i].translateY})`}>
              {m.label}
            </text>
            {/* Sub label */}
            <text x={m.x} y={1025} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={400}
              fill={COLORS.cool_silver} opacity={0.5} transform={`translate(0, ${milestoneEntrances[i].translateY})`}>
              {m.sub}
            </text>
          </g>
        ))}

        {/* Gap marker — "53 YEAR GAP" */}
        <g opacity={milestone3.opacity * 0.6}>
          <line x1={375} y1={840} x2={680} y2={840}
            stroke={COLORS.vibrant_red} strokeWidth={1} strokeDasharray="6 4" opacity={0.3} />
          <text x={527} y={830} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={700}
            fill={COLORS.vibrant_red} opacity={0.4}>
            53 YEAR GAP
          </text>
        </g>

        {/* Info cards below timeline */}
        <g opacity={milestone1.opacity} transform={`translate(60, ${1100 + milestone1.translateY})`}>
          <rect x={0} y={0} width={460} height={130} rx={12} fill={COLORS.cool_silver} fillOpacity={0.03}
            stroke={COLORS.cool_silver} strokeWidth={1} />
          <rect x={0} y={0} width={6} height={130} rx={3} fill={COLORS.cool_silver} />
          <text x={30} y={40} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.cool_silver}>
            1968–1972
          </text>
          <text x={30} y={78} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.deep_black} opacity={0.6}>
            6 crewed Apollo missions
          </text>
          <text x={30} y={110} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.deep_black} opacity={0.6}>
            Then silence for 53 years
          </text>
        </g>

        <g opacity={milestone4.opacity} transform={`translate(560, ${1100 + milestone4.translateY})`}>
          <rect x={0} y={0} width={460} height={130} rx={12} fill={COLORS.sky_blue} fillOpacity={0.03}
            stroke={COLORS.sky_blue} strokeWidth={1.5} />
          <rect x={0} y={0} width={6} height={130} rx={3} fill={COLORS.sky_blue} />
          <text x={30} y={40} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.sky_blue}>
            2022–2025
          </text>
          <text x={30} y={78} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.deep_black}>
            Artemis program returns
          </text>
          <text x={30} y={110} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.deep_black}>
            Humans back to deep space
          </text>
        </g>

        {/* Bottom quote */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY + breathe})`}>
          <text x={540} y={1340} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={800}
            fill={COLORS.deep_black} opacity={shimmer}>
            56 Years of Refusing to Stop
          </text>
          <text x={540} y={1385} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={400}
            fill={COLORS.cool_silver} opacity={0.5}>
            From Apollo to Artemis — the journey never ended
          </text>
        </g>

        {/* Divider + bottom note */}
        <Divider y={1780} opacity={0.12} />
        <text x={540} y={1810} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={400} fill={COLORS.cool_silver} letterSpacing="0.15em" opacity={0.45}>
          1968 → 2025 · 56 YEARS · NEVER GAVE UP
        </text>

        {/* Caption */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s16.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
