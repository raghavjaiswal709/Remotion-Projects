/**
 * Scene 02 — Static Block Recap
 * "Last day, we learned how a static block runs once"
 * CSV: 6.420s → 9.700s
 * Duration: 98 frames (3.27s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Scene reveal — label + headline spring in
 *   Phase 2 (frames 20–70):  Static block diagram with path-draw, code snippet
 *   Phase 3 (frames 60–end): Micro-animations — block pulse, arrow shimmer
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

export const Scene02_StaticBlockRecap: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 12);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const blockCard = useSpringEntrance(frame, 18);
  const codeCard = useSpringEntrance(frame, 28);
  const arrowDraw = usePathDraw(frame, 35, 160, 20);
  const runOnceCard = useSpringEntrance(frame, 40);
  const recapBadge = useSpringEntrance(frame, 50);

  // Block perimeter draw
  const blockPerimeter = 2 * (400 + 300);
  const blockBorderDash = interpolate(frame, [20, 45], [blockPerimeter, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const flashOpacity = interpolate(Math.sin(frame * 0.12), [-1, 1], [0.4, 0.8]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s02.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="RECAP · YESTERDAY" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Headline ────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.white}>
            Static Block
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={52} fontWeight={800} fill={COLORS.accent}>
            Runs Once at Class Load
          </text>
        </g>

        {/* ── ZONE C — Static block diagram ────────────────────────────── */}

        {/* Main diagram card */}
        <g opacity={blockCard.opacity} transform={`translate(0, ${blockCard.translateY})`}>
          <BentoCard x={60} y={480} w={960} h={420} accent />

          {/* Static block representation */}
          <rect x={140} y={520} width={400} height={300} rx={16}
            fill="none"
            stroke={COLORS.accent}
            strokeWidth={2.5}
            strokeDasharray={blockPerimeter}
            strokeDashoffset={blockBorderDash}
          />
          <rect x={140} y={520} width={400} height={300} rx={16}
            fill={COLORS.accent} fillOpacity={0.06}
          />

          {/* Block header */}
          <rect x={140} y={520} width={400} height={52} rx={16}
            fill={COLORS.accent} fillOpacity={0.15}
          />
          <text x={340} y={556} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}
          >
            static {'{ }'}
          </text>

          {/* Code-like lines inside block */}
          <rect x={180} y={600} width={320} height={8} rx={4}
            fill={COLORS.white} fillOpacity={0.12} />
          <rect x={180} y={630} width={260} height={8} rx={4}
            fill={COLORS.white} fillOpacity={0.08} />
          <rect x={180} y={660} width={300} height={8} rx={4}
            fill={COLORS.white} fillOpacity={0.10} />
          <rect x={180} y={690} width={200} height={8} rx={4}
            fill={COLORS.accent} fillOpacity={0.2} />

          {/* "RUNS ONCE" badge */}
          <g transform={`translate(${breathe * 0.5}, 0)`}>
            <rect x={620} y={540} width={340} height={80} rx={16}
              fill={COLORS.accent} fillOpacity={flashOpacity * 0.15}
              stroke={COLORS.accent} strokeWidth={2}
            />
            <text x={790} y={592} textAnchor="middle"
              fontFamily={FONT} fontSize={40} fontWeight={800}
              fill={COLORS.accent} opacity={shimmer}
            >
              RUNS ONCE
            </text>
          </g>

          {/* Arrow from block to badge */}
          <path
            d="M 540,640 L 620,640"
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={160}
            strokeDashoffset={arrowDraw}
            strokeLinecap="round"
            markerEnd="url(#arrow)"
          />

          {/* "At class load" label */}
          <text x={790} y={670} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}
          >
            At Class Load Time
          </text>

          {/* Clock icon */}
          <circle cx={790} cy={760} r={40}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '790px 760px' }}
          />
          <line x1={790} y1={730} x2={790} y2={760}
            stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
          <line x1={790} y1={760} x2={810} y2={770}
            stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round" />
        </g>

        {/* Code snippet card */}
        <g opacity={codeCard.opacity} transform={`translate(0, ${codeCard.translateY})`}>
          <BentoCard x={60} y={930} w={620} h={260} />
          <rect x={60} y={930} width={6} height={260} rx={3} fill={COLORS.accent} />

          <text x={100} y={980} fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={28} fontWeight={500} fill={COLORS.accent}>
            static {'{'}
          </text>
          <text x={130} y={1020} fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={26} fontWeight={500} fill={COLORS.text_muted}>
            loadRoutes();
          </text>
          <text x={130} y={1060} fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={26} fontWeight={500} fill={COLORS.text_muted}>
            initializeSystem();
          </text>
          <text x={100} y={1100} fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={28} fontWeight={500} fill={COLORS.accent}>
            {'}'}
          </text>

          {/* Line number accents */}
          <text x={78} y={980} fontFamily="'Fira Code', monospace" fontSize={20} fontWeight={500}
            fill={COLORS.text_muted} opacity={0.4}>1</text>
          <text x={78} y={1020} fontFamily="'Fira Code', monospace" fontSize={20} fontWeight={500}
            fill={COLORS.text_muted} opacity={0.4}>2</text>
          <text x={78} y={1060} fontFamily="'Fira Code', monospace" fontSize={20} fontWeight={500}
            fill={COLORS.text_muted} opacity={0.4}>3</text>
          <text x={78} y={1100} fontFamily="'Fira Code', monospace" fontSize={20} fontWeight={500}
            fill={COLORS.text_muted} opacity={0.4}>4</text>
        </g>

        {/* Recap badge card */}
        <g opacity={recapBadge.opacity} transform={`translate(0, ${recapBadge.translateY})`}>
          <BentoCard x={720} y={930} w={300} h={260} accent />
          <text x={870} y={1030} textAnchor="middle"
            fontFamily={FONT} fontSize={48} fontWeight={800}
            fill={COLORS.accent}
          >
            DAY
          </text>
          <text x={870} y={1100} textAnchor="middle"
            fontFamily={FONT} fontSize={96} fontWeight={800}
            fill={COLORS.white}
          >
            40
          </text>
          <text x={870} y={1150} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}
          >
            RECAP
          </text>
        </g>

        {/* Floating accents */}
        <g transform={`translate(540, ${1340 + breathe})`}>
          <circle cx={0} cy={0} r={36} fill={COLORS.accent} fillOpacity={0.04 * shimmer} />
          <circle cx={0} cy={0} r={36} fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {/* ── CAPTION ──────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s02.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
