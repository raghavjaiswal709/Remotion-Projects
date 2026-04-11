/**
 * Scene 08 — CovariantExplained
 * "Covariant return type allows BulletTrain to override getEngine and return a MaglevEngine instead."
 * CSV: 36.04s → 44.56s
 * Duration: 274 frames (9.1s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):   Section label + COVARIANT headline spring up
 *   Phase 2 (frames 25–120): Two-method comparison builds: parent vs child getEngine
 *   Phase 3 (frames 100–end): Pulse on return types, breathing arrows, shimmer
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
import { PaperBackground, GlobalDefs, Caption, SectionLabel } from '../helpers/components';

// ─── Spring configs ──────────────────────────────────────────────────────────
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 } as const;
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
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

export const Scene08_CovariantExplained: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headWord1     = useSpringEntrance(frame, 6);
  const headWord2     = useSpringEntrance(frame, 12);
  const headWord3     = useSpringEntrance(frame, 18);
  const dividerEntry  = useSpringEntrance(frame, 24);

  // ── Phase 2: Two-column comparison ─────────────────────────────────────────
  const parentHeader  = useSpringEntrance(frame, 30);
  const parentMethod  = useSpringEntrance(frame, 38);
  const parentReturn  = useSpringEntrance(frame, 46);
  const childHeader   = useSpringEntrance(frame, 54);
  const childMethod   = useSpringEntrance(frame, 62);
  const childReturn   = useSpringEntrance(frame, 70);
  const arrowEntry    = useSpringEntrance(frame, 78);
  const insteadBadge  = useSpringEntrance(frame, 86);

  // ── Code block ────────────────────────────────────────────────────────────
  const codeBlock     = useSpringEntrance(frame, 94);
  const codeLine1     = useSpringEntrance(frame, 100);
  const codeLine2     = useSpringEntrance(frame, 106);
  const codeLine3     = useSpringEntrance(frame, 112);

  // ── Summary card ──────────────────────────────────────────────────────────
  const summaryCard   = useSpringEntrance(frame, 118);

  // ── Path draws ────────────────────────────────────────────────────────────
  const vertDividerLen = 600;
  const vertDividerDash = usePathDraw(frame, 28, vertDividerLen, 30);
  const arrowPathLen   = 160;
  const arrowDash      = usePathDraw(frame, 78, arrowPathLen, 22);

  // ── Border draws ──────────────────────────────────────────────────────────
  const parentPerimeter = 2 * (420 + 320);
  const parentBorderDash = interpolate(frame, [30, 58], [parentPerimeter, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const childPerimeter = 2 * (420 + 320);
  const childBorderDash = interpolate(frame, [54, 82], [childPerimeter, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe  = Math.sin(frame * 0.06) * 3;
  const pulse    = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer  = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const returnPulse = 1 + Math.sin(frame * 0.12) * 0.03;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s08.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A — Section label ─────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="INHERITANCE · COVARIANT RETURN" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B — Headline (per-word spring) ────────────────────────── */}
        <g transform={`translate(0, ${headWord1.translateY})`} opacity={headWord1.opacity}>
          <text
            x={60} y={230}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={72} fontWeight={900}
            fill={COLORS.orange}
          >
            Covariant
          </text>
        </g>
        <g transform={`translate(0, ${headWord2.translateY})`} opacity={headWord2.opacity}>
          <text
            x={60} y={310}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={72} fontWeight={900}
            fill={COLORS.deep_black}
          >
            Return Type
          </text>
        </g>
        <g transform={`translate(0, ${headWord3.translateY})`} opacity={headWord3.opacity}>
          <text
            x={60} y={380}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={36} fontWeight={500}
            fill={COLORS.cool_silver}
          >
            Allows child to narrow the return type
          </text>
        </g>

        {/* ── Vertical divider ───────────────────────────────────────────── */}
        <path
          d="M 540,440 L 540,1040"
          fill="none"
          stroke={COLORS.deep_black}
          strokeWidth={1}
          opacity={0.15}
          strokeDasharray={vertDividerLen}
          strokeDashoffset={vertDividerDash}
        />

        {/* ── Left: Parent Train.getEngine() ─────────────────────────────── */}
        <g opacity={parentHeader.opacity} transform={`translate(60, ${460 + parentHeader.translateY})`}>
          <rect
            x={0} y={0} width={420} height={320} rx={14}
            fill={COLORS.sky_blue} fillOpacity={0.04}
            stroke={COLORS.sky_blue} strokeWidth={2}
            strokeDasharray={parentPerimeter}
            strokeDashoffset={parentBorderDash}
          />
        </g>

        <g opacity={parentHeader.opacity} transform={`translate(80, ${490 + parentHeader.translateY})`}>
          <text
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={30} fontWeight={700}
            fill={COLORS.sky_blue}
          >
            Train
          </text>
        </g>

        <g opacity={parentMethod.opacity} transform={`translate(80, ${545 + parentMethod.translateY})`}>
          <text
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={28} fontWeight={500}
            fill={COLORS.deep_black}
          >
            getEngine()
          </text>
        </g>

        <g opacity={parentReturn.opacity} transform={`translate(80, ${610 + parentReturn.translateY})`}>
          <text
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={500}
            fill={COLORS.cool_silver}
          >
            returns:
          </text>
          <text
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={48} fontWeight={800}
            fill={COLORS.sky_blue}
            y={55}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '80px 665px' }}
          >
            Engine
          </text>
          <rect
            x={0} y={70} width={180} height={4} rx={2}
            fill={COLORS.sky_blue}
            opacity={0.3}
          />
        </g>

        {/* ── Right: Child BulletTrain.getEngine() ───────────────────────── */}
        <g opacity={childHeader.opacity} transform={`translate(600, ${460 + childHeader.translateY})`}>
          <rect
            x={0} y={0} width={420} height={320} rx={14}
            fill={COLORS.orange} fillOpacity={0.04}
            stroke={COLORS.orange} strokeWidth={2}
            strokeDasharray={childPerimeter}
            strokeDashoffset={childBorderDash}
          />
        </g>

        <g opacity={childHeader.opacity} transform={`translate(620, ${490 + childHeader.translateY})`}>
          <text
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={30} fontWeight={700}
            fill={COLORS.orange}
          >
            BulletTrain
          </text>
        </g>

        <g opacity={childMethod.opacity} transform={`translate(620, ${545 + childMethod.translateY})`}>
          <text
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={28} fontWeight={500}
            fill={COLORS.deep_black}
          >
            getEngine()
          </text>
        </g>

        <g opacity={childReturn.opacity} transform={`translate(620, ${610 + childReturn.translateY})`}>
          <text
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={500}
            fill={COLORS.cool_silver}
          >
            returns:
          </text>
          <text
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={42} fontWeight={800}
            fill={COLORS.orange}
            y={55}
            transform={`scale(${returnPulse})`}
            style={{ transformOrigin: '620px 665px' }}
          >
            MaglevEngine
          </text>
          <rect
            x={0} y={70} width={280} height={4} rx={2}
            fill={COLORS.orange}
            opacity={0.3}
          />
        </g>

        {/* ── Arrow from parent return to child return with "instead" badge ─ */}
        <path
          d="M 300,700 C 400,700 480,700 590,700"
          fill="none"
          stroke={COLORS.orange}
          strokeWidth={2.5}
          strokeDasharray={arrowPathLen}
          strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)"
          strokeLinecap="round"
        />

        {/* "INSTEAD" badge */}
        <g opacity={insteadBadge.opacity} transform={`translate(460, ${680 + breathe})`}>
          <rect
            x={-50} y={-18}
            width={100} height={36} rx={18}
            fill={COLORS.orange} fillOpacity={0.15}
            stroke={COLORS.orange} strokeWidth={1.5}
          />
          <text
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={20} fontWeight={700}
            fill={COLORS.orange}
            y={5}
          >
            INSTEAD
          </text>
        </g>

        {/* ── Code block ─────────────────────────────────────────────────── */}
        <g opacity={codeBlock.opacity} transform={`translate(60, ${850 + codeBlock.translateY})`}>
          <rect
            x={0} y={0} width={960} height={230} rx={12}
            fill={COLORS.deep_black} fillOpacity={0.04}
          />
          <rect x={0} y={0} width={6} height={230} rx={3} fill={COLORS.orange} />
        </g>

        <g opacity={codeLine1.opacity} transform={`translate(36, ${900 + codeLine1.translateY})`}>
          <text fontFamily="'Fira Code', 'Courier New', monospace" fontSize={28} fontWeight={400} fill={COLORS.cool_silver} x={60}>
            // Parent
          </text>
        </g>
        <g opacity={codeLine2.opacity} transform={`translate(36, ${948 + codeLine2.translateY})`}>
          <text fontFamily="'Fira Code', 'Courier New', monospace" fontSize={28} fontWeight={700} fill={COLORS.sky_blue} x={60}>
            Engine
          </text>
          <text fontFamily="'Fira Code', 'Courier New', monospace" fontSize={28} fontWeight={400} fill={COLORS.deep_black} x={178}>
            {' getEngine() { ... }'}
          </text>
        </g>
        <g opacity={codeLine3.opacity} transform={`translate(36, ${1010 + codeLine3.translateY})`}>
          <text fontFamily="'Fira Code', 'Courier New', monospace" fontSize={28} fontWeight={400} fill={COLORS.cool_silver} x={60}>
            // Child — covariant return
          </text>
        </g>
        <g opacity={codeLine3.opacity} transform={`translate(36, ${1052 + codeLine3.translateY})`}>
          <text fontFamily="'Fira Code', 'Courier New', monospace" fontSize={28} fontWeight={700} fill={COLORS.orange} x={60}>
            MaglevEngine
          </text>
          <text fontFamily="'Fira Code', 'Courier New', monospace" fontSize={28} fontWeight={400} fill={COLORS.deep_black} x={276}>
            {' getEngine() { ... }'}
          </text>
        </g>

        {/* ── Summary insight card ───────────────────────────────────────── */}
        <g opacity={summaryCard.opacity} transform={`translate(60, ${1150 + summaryCard.translateY})`}>
          <rect
            x={0} y={0} width={960} height={140} rx={12}
            fill={COLORS.orange} fillOpacity={0.06}
            stroke={COLORS.orange} strokeWidth={2}
          />
          <rect x={28} y={30} width={8} height={80} rx={4} fill={COLORS.orange} />
          <text
            x={56} y={62}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32} fontWeight={700}
            fill={COLORS.deep_black}
          >
            Child narrows the return type
          </text>
          <text
            x={56} y={108}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={400}
            fill={COLORS.cool_silver}
          >
            Engine → MaglevEngine (more specific)
          </text>
        </g>

        {/* ── Floating decorative elements ───────────────────────────────── */}
        <circle cx={100} cy={1400 + breathe * 1.1} r={5} fill={COLORS.orange} opacity={0.1 * shimmer} />
        <circle cx={980} cy={1380 - breathe * 0.8} r={7} fill={COLORS.sky_blue} opacity={0.08 * shimmer} />
        <circle cx={540} cy={1350 + breathe * 0.6} r={4} fill={COLORS.orange} opacity={0.12} />

        {/* ── Train track decoration ──────────────────────────────────────── */}
        <g opacity={0.05}>
          <line x1={60} y1={1680} x2={1020} y2={1680} stroke={COLORS.deep_black} strokeWidth={2} />
          <line x1={60} y1={1688} x2={1020} y2={1688} stroke={COLORS.deep_black} strokeWidth={2} />
          {Array.from({ length: 20 }, (_, i) => (
            <line
              key={i}
              x1={80 + i * 48} y1={1676}
              x2={80 + i * 48} y2={1692}
              stroke={COLORS.deep_black}
              strokeWidth={3}
            />
          ))}
        </g>

        {/* ── Caption ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s08.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
