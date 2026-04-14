/**
 * Scene 03 — Observation Recap
 * "Last day, we learned what an observation is."
 * CSV: 5.320s → 8.300s
 * Duration: 107 frames (3.6s)
 *
 * Theme: Dark (#1D1D1C) + grid + series accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):  Label + headline spring in
 *   Phase 2 (frames 20–70): Bento cards with observation diagram build
 *   Phase 3 (frames 60–end): Pulse on eye icon, connector breathing
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

export const Scene03_ObservationRecap: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 14);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const card1 = useSpringEntrance(frame, 22);
  const card2 = useSpringEntrance(frame, 34);
  const card3 = useSpringEntrance(frame, 46);

  // ── Path draws ─────────────────────────────────────────────────────────────
  const arrowLen = 180;
  const arrowDash1 = usePathDraw(frame, 30, arrowLen, 25);
  const arrowDash2 = usePathDraw(frame, 42, arrowLen, 25);
  const loopLen = 400;
  const loopDash = usePathDraw(frame, 50, loopLen, 35);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const eyePulse = 1 + Math.sin(frame * 0.1) * 0.06;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s03.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A — Topic anchor ───────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="RECAP · DAY 26" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Headline ───────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.white}>
            Observation
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent}>
            What the agent sees after acting
          </text>
        </g>

        {/* ── ZONE C — Agent Loop Diagram ─────────────────────────────────── */}

        {/* Card 1: Action node */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={520} w={400} h={200} accent />
          <text x={260} y={600} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            ACTION
          </text>
          {/* Lightning bolt icon */}
          <path d="M 250,640 L 230,670 L 260,665 L 240,700"
            fill="none" stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round"
            opacity={shimmer} />
          <text x={260} y={685} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Agent acts
          </text>
        </g>

        {/* Arrow: Action → Environment */}
        <path
          d="M 460,620 L 620,620"
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash1}
          strokeLinecap="round" markerEnd="url(#arrow)"
        />

        {/* Card 2: Environment node */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={620} y={520} w={400} h={200} />
          <text x={820} y={600} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            ENVIRONMENT
          </text>
          {/* Globe icon */}
          <circle cx={820} cy={665} r={22} fill="none"
            stroke={COLORS.text_muted} strokeWidth={2} />
          <ellipse cx={820} cy={665} rx={22} ry={10} fill="none"
            stroke={COLORS.text_muted} strokeWidth={1.5} />
          <line x1={798} y1={665} x2={842} y2={665}
            stroke={COLORS.text_muted} strokeWidth={1.5} />
          <text x={820} y={710} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            World responds
          </text>
        </g>

        {/* Arrow: Environment → Observation */}
        <path
          d="M 820,720 L 820,800"
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash2}
          strokeLinecap="round" markerEnd="url(#arrow)"
        />

        {/* Card 3: Observation - the highlighted result */}
        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={200} y={820} w={680} h={240} accent />
          {/* Accent left bar */}
          <rect x={200} y={820} width={6} height={240} rx={3} fill={COLORS.accent} />

          {/* Large eye icon for observation */}
          <g transform={`translate(540, ${940 + breathe}) scale(${eyePulse})`}
             style={{ transformOrigin: '540px 940px' }}>
            <ellipse cx={0} cy={0} rx={60} ry={36} fill="none"
              stroke={COLORS.accent} strokeWidth={3} />
            <circle cx={0} cy={0} r={18} fill={COLORS.accent} opacity={0.7} />
            <circle cx={0} cy={0} r={8} fill={COLORS.white} opacity={0.9} />
          </g>

          <text x={540} y={900} textAnchor="middle"
            fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent}>
            OBSERVATION
          </text>
          <text x={540} y={1020} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            Data returned to the agent
          </text>
        </g>

        {/* Feedback loop arrow: Observation → back to Action */}
        <path
          d="M 200,940 C 120,940 80,780 80,620 C 80,520 120,500 160,520"
          fill="none" stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={loopLen} strokeDashoffset={loopDash}
          strokeLinecap="round" opacity={0.5}
          markerEnd="url(#arrow)"
        />
        <text x={60} y={750} fontFamily={FONT} fontSize={28} fontWeight={800}
          fill={COLORS.accent} opacity={card3.opacity * 0.6}
          transform="rotate(-90, 60, 750)">
          LOOP
        </text>

        {/* ── Bottom info cards ───────────────────────────────────────────── */}
        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={60} y={1120} w={460} h={260} />
          <text x={100} y={1190} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            EXAMPLES
          </text>
          <text x={100} y={1240} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            API response
          </text>
          <text x={100} y={1290} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Error message
          </text>
          <text x={100} y={1340} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            File contents
          </text>
        </g>

        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={560} y={1120} w={460} h={260} accent />
          <text x={600} y={1190} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            KEY IDEA
          </text>
          <text x={600} y={1250} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Agent learns
          </text>
          <text x={600} y={1310} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            from results
          </text>
          {/* Pulse circle */}
          <circle cx={900} cy={1300} r={28} fill={COLORS.accent} fillOpacity={0.1 * shimmer} />
          <circle cx={900} cy={1300} r={28} fill="none" stroke={COLORS.accent} strokeWidth={2}
            transform={`scale(${pulse})`} style={{ transformOrigin: '900px 1300px' }} />
        </g>

        {/* ── Today's focus teaser ────────────────────────────────────────── */}
        <g opacity={card3.opacity}>
          <BentoCard x={60} y={1420} w={960} h={160} />
          <rect x={60} y={1420} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={100} y={1490} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            TODAY
          </text>
          <text x={280} y={1490} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            What Is a Tool?
          </text>
          {/* Arrow pointing forward */}
          <path d="M 900,1500 L 950,1500 L 930,1480 M 950,1500 L 930,1520"
            fill="none" stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round"
            opacity={shimmer} />
        </g>

        {/* ── Connector lines between sections ────────────────────────────── */}
        <line x1={540} y1={1085} x2={540} y2={1120}
          stroke={COLORS.accent} strokeWidth={1.5} opacity={card3.opacity * 0.3} />

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
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
