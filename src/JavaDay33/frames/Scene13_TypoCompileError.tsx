/**
 * Scene13 — TypoCompileError
 * "A typo becomes a compile time error. Not a silent runtime bug that only
 *  surfaces when a passenger gets charged the wrong fare."
 * CSV: 50.98s -> 59.08s
 * Duration: 261 frames (8.70s)
 *
 * Animation phases:
 *   Phase 1 (frames 0-25):   Label + headline spring in
 *   Phase 2 (frames 20-140): Split comparison — typo code on left, compile error right.
 *                              Then contrast card: runtime bug scenario below.
 *   Phase 3 (frames 130-end): Micro-animations, glow on compile-time side
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

export const Scene13_TypoCompileError: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 5);
  const headlineB = useSpringEntrance(frame, 10);

  // ── Phase 2: Typo code block ───────────────────────────────────────────────
  const codeBlock = useSpringEntrance(frame, 16);
  const codeLine1 = useSpringEntrance(frame, 22);
  const codeLine2 = useSpringEntrance(frame, 28);
  const codeLine3 = useSpringEntrance(frame, 34);
  const codeLine4 = useSpringEntrance(frame, 40);

  // Red circle + strike on typo
  const typoCircleF = Math.max(0, frame - 44);
  const typoCircleProg = spring({ frame: typoCircleF, fps: 30, config: SPRING_SNAP });
  const typoCircleOp = interpolate(typoCircleF, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

  // Arrow pointing to error
  const errorArrowLen = 120;
  const errorArrowDash = usePathDraw(frame, 48, errorArrowLen, 14);

  // Compile error box
  const errorBox = useSpringEntrance(frame, 52);
  const errorLine1 = useSpringEntrance(frame, 58);
  const errorLine2 = useSpringEntrance(frame, 62);

  // Error border draw
  const errorPerim = 2 * (420 + 180);
  const errorBorderDash = usePathDraw(frame, 54, errorPerim, 18);

  // Versus divider
  const vsEntrance = useSpringEntrance(frame, 70);
  const dividerLen = 960;
  const dividerDash = usePathDraw(frame, 72, dividerLen, 20);

  // Runtime scenario
  const runtimeLabel = useSpringEntrance(frame, 78);
  const scenarioCard1 = useSpringEntrance(frame, 84);
  const scenarioCard2 = useSpringEntrance(frame, 92);
  const scenarioCard3 = useSpringEntrance(frame, 100);

  // Flow arrow between scenario cards
  const flowLen = 80;
  const flow1Dash = usePathDraw(frame, 90, flowLen, 12);
  const flow2Dash = usePathDraw(frame, 98, flowLen, 12);

  // Bottom comparison
  const compileCard = useSpringEntrance(frame, 110);
  const runtimeCard = useSpringEntrance(frame, 118);
  const summaryCard = useSpringEntrance(frame, 126);

  // Comparison card borders
  const compCardPerim = 2 * (440 + 120);
  const compCardBorder = usePathDraw(frame, 112, compCardPerim, 16);
  const runtCardBorder = usePathDraw(frame, 120, compCardPerim, 16);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const errorPulse = interpolate(Math.sin(frame * 0.12), [-1, 1], [0.7, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s13.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>

        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="OVERRIDE · ERROR TYPE" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B — Headline ───────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={230} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={48} fontWeight={800} fill={COLORS.deep_black}>
            A Typo Becomes a
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={310} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={56} fontWeight={800} fill={COLORS.green}>
            Compile-Time Error
          </text>
        </g>

        {/* ── Code block with typo ────────────────────────────────────────── */}
        <g opacity={codeBlock.opacity} transform={`translate(60, ${380 + codeBlock.translateY})`}>
          <rect x={0} y={0} width={540} height={240} rx={10}
            fill={COLORS.deep_black} fillOpacity={0.04} />
          <rect x={0} y={0} width={6} height={240} rx={3} fill={COLORS.orange} />
        </g>

        <g opacity={codeLine1.opacity} transform={`translate(88, ${410 + codeLine1.translateY})`}>
          <text fontFamily="'Fira Code', monospace" fontSize={22} fontWeight={400} fill={COLORS.green}>
            @Override
          </text>
        </g>
        <g opacity={codeLine2.opacity} transform={`translate(88, ${452 + codeLine2.translateY})`}>
          <text fontFamily="'Fira Code', monospace" fontSize={22} fontWeight={400} fill={COLORS.sky_blue}>
            {'public int '}
          </text>
          <text x={170} fontFamily="'Fira Code', monospace" fontSize={22} fontWeight={700} fill={COLORS.vibrant_red}>
            calculatefare
          </text>
          <text x={372} fontFamily="'Fira Code', monospace" fontSize={22} fontWeight={400} fill={COLORS.deep_black}>
            (int d)
          </text>
        </g>
        <g opacity={codeLine3.opacity} transform={`translate(88, ${494 + codeLine3.translateY})`}>
          <text fontFamily="'Fira Code', monospace" fontSize={22} fontWeight={400} fill={COLORS.deep_black}>
            {'  return d * 15;'}
          </text>
        </g>
        <g opacity={codeLine4.opacity} transform={`translate(88, ${536 + codeLine4.translateY})`}>
          <text fontFamily="'Fira Code', monospace" fontSize={22} fontWeight={400} fill={COLORS.deep_black}>
            {'}'}
          </text>
        </g>

        {/* Typo circle on lowercase f */}
        <g opacity={typoCircleOp}>
          <ellipse cx={310} cy={448} rx={64} ry={22}
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={2.5}
            opacity={errorPulse}
            transform={`scale(${interpolate(typoCircleProg, [0, 1], [0.7, 1])})`}
            style={{ transformOrigin: '310px 448px' }} />
          <text x={310} y={420} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={18} fontWeight={700} fill={COLORS.vibrant_red}>
            lowercase f
          </text>
        </g>

        {/* ── Arrow to error box ──────────────────────────────────────────── */}
        <g opacity={errorBox.opacity}>
          <path d="M 610,480 L 640,480"
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={2}
            strokeDasharray={errorArrowLen} strokeDashoffset={errorArrowDash}
            strokeLinecap="round" markerEnd="url(#arrow)" />
        </g>

        {/* ── Compile error box ───────────────────────────────────────────── */}
        <g opacity={errorBox.opacity} transform={`translate(640, ${380 + errorBox.translateY})`}>
          <rect x={0} y={0} width={380} height={240} rx={10}
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={2}
            strokeDasharray={errorPerim} strokeDashoffset={errorBorderDash} />
          <rect x={0} y={0} width={380} height={240} rx={10}
            fill={COLORS.vibrant_red} fillOpacity={0.04} />

          <rect x={0} y={0} width={380} height={44} rx={10}
            fill={COLORS.vibrant_red} fillOpacity={0.08} />
          <text x={20} y={30} fontFamily="'Inter', sans-serif" fontSize={22}
            fontWeight={700} fill={COLORS.vibrant_red}>
            COMPILE ERROR
          </text>
        </g>

        <g opacity={errorLine1.opacity} transform={`translate(660, ${458 + errorLine1.translateY})`}>
          <text fontFamily="'Fira Code', monospace" fontSize={18} fontWeight={400} fill={COLORS.vibrant_red}>
            method does not
          </text>
        </g>
        <g opacity={errorLine2.opacity} transform={`translate(660, ${490 + errorLine2.translateY})`}>
          <text fontFamily="'Fira Code', monospace" fontSize={18} fontWeight={400} fill={COLORS.vibrant_red}>
            override or implement
          </text>
          <text y={30} fontFamily="'Fira Code', monospace" fontSize={18} fontWeight={400} fill={COLORS.vibrant_red}>
            a method from supertype
          </text>
        </g>

        {/* ── VS divider ──────────────────────────────────────────────────── */}
        <g opacity={vsEntrance.opacity}>
          <line x1={60} y1={670} x2={1020} y2={670}
            stroke={COLORS.deep_black} strokeWidth={1} opacity={0.12}
            strokeDasharray={dividerLen} strokeDashoffset={dividerDash} />
          <text x={540} y={660} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={28} fontWeight={700} fill={COLORS.cool_silver}>
            VS
          </text>
        </g>

        {/* ── Runtime scenario label ──────────────────────────────────────── */}
        <g opacity={runtimeLabel.opacity} transform={`translate(0, ${runtimeLabel.translateY})`}>
          <text x={60} y={730} fontFamily="'Inter', sans-serif"
            fontSize={34} fontWeight={700} fill={COLORS.vibrant_red}>
            Without @Override — runtime scenario:
          </text>
        </g>

        {/* ── Scenario flow cards ─────────────────────────────────────────── */}
        <g opacity={scenarioCard1.opacity} transform={`translate(60, ${770 + scenarioCard1.translateY})`}>
          <rect x={0} y={0} width={280} height={100} rx={10}
            fill={COLORS.deep_black} fillOpacity={0.03}
            stroke={COLORS.cool_silver} strokeWidth={1} />
          <text x={140} y={40} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={24} fontWeight={600} fill={COLORS.deep_black}>
            Code compiles
          </text>
          <text x={140} y={72} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={20} fontWeight={400} fill={COLORS.cool_silver}>
            No warnings
          </text>
        </g>

        {/* Flow arrow 1 */}
        <g opacity={scenarioCard2.opacity}>
          <path d="M 350,820 L 400,820"
            fill="none" stroke={COLORS.cool_silver} strokeWidth={2}
            strokeDasharray={flowLen} strokeDashoffset={flow1Dash}
            markerEnd="url(#arrow)" />
        </g>

        <g opacity={scenarioCard2.opacity} transform={`translate(410, ${770 + scenarioCard2.translateY})`}>
          <rect x={0} y={0} width={280} height={100} rx={10}
            fill={COLORS.deep_black} fillOpacity={0.03}
            stroke={COLORS.cool_silver} strokeWidth={1} />
          <text x={140} y={40} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={24} fontWeight={600} fill={COLORS.deep_black}>
            App runs
          </text>
          <text x={140} y={72} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={20} fontWeight={400} fill={COLORS.cool_silver}>
            Looks normal
          </text>
        </g>

        {/* Flow arrow 2 */}
        <g opacity={scenarioCard3.opacity}>
          <path d="M 700,820 L 750,820"
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={2}
            strokeDasharray={flowLen} strokeDashoffset={flow2Dash}
            markerEnd="url(#arrow)" />
        </g>

        <g opacity={scenarioCard3.opacity} transform={`translate(760, ${770 + scenarioCard3.translateY})`}>
          <rect x={0} y={0} width={260} height={100} rx={10}
            fill={COLORS.vibrant_red} fillOpacity={0.04}
            stroke={COLORS.vibrant_red} strokeWidth={1.5} />
          <text x={130} y={40} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={22} fontWeight={700} fill={COLORS.vibrant_red}>
            Wrong fare
          </text>
          <text x={130} y={72} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={20} fontWeight={400} fill={COLORS.vibrant_red}>
            Passenger affected
          </text>
        </g>

        {/* ── Bottom comparison cards ─────────────────────────────────────── */}
        <g opacity={compileCard.opacity} transform={`translate(60, ${930 + compileCard.translateY})`}>
          <rect x={0} y={0} width={440} height={120} rx={12}
            fill="none" stroke={COLORS.green} strokeWidth={2}
            strokeDasharray={compCardPerim} strokeDashoffset={compCardBorder} />
          <rect x={0} y={0} width={440} height={120} rx={12}
            fill={COLORS.green} fillOpacity={0.04} />
          <rect x={0} y={0} width={6} height={120} rx={3} fill={COLORS.green} />
          <text x={28} y={40} fontFamily="'Inter', sans-serif" fontSize={24}
            fontWeight={700} fill={COLORS.green}>
            COMPILE-TIME ERROR
          </text>
          <text x={28} y={72} fontFamily="'Inter', sans-serif" fontSize={22}
            fontWeight={400} fill={COLORS.deep_black}>
            Caught instantly by javac
          </text>
          <text x={28} y={102} fontFamily="'Inter', sans-serif" fontSize={22}
            fontWeight={400} fill={COLORS.cool_silver}>
            Zero users affected
          </text>
        </g>

        <g opacity={runtimeCard.opacity} transform={`translate(540, ${930 + runtimeCard.translateY})`}>
          <rect x={0} y={0} width={440} height={120} rx={12}
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={2}
            strokeDasharray={compCardPerim} strokeDashoffset={runtCardBorder} />
          <rect x={0} y={0} width={440} height={120} rx={12}
            fill={COLORS.vibrant_red} fillOpacity={0.04} />
          <rect x={0} y={0} width={6} height={120} rx={3} fill={COLORS.vibrant_red} />
          <text x={28} y={40} fontFamily="'Inter', sans-serif" fontSize={24}
            fontWeight={700} fill={COLORS.vibrant_red}>
            RUNTIME BUG
          </text>
          <text x={28} y={72} fontFamily="'Inter', sans-serif" fontSize={22}
            fontWeight={400} fill={COLORS.deep_black}>
            Surfaces in production
          </text>
          <text x={28} y={102} fontFamily="'Inter', sans-serif" fontSize={22}
            fontWeight={400} fill={COLORS.cool_silver}>
            Passengers overcharged
          </text>
        </g>

        {/* ── Summary card ────────────────────────────────────────────────── */}
        <g opacity={summaryCard.opacity} transform={`translate(60, ${1090 + summaryCard.translateY})`}>
          <rect x={0} y={0} width={960} height={64} rx={10}
            fill={COLORS.sky_blue} fillOpacity={0.04} />
          <text x={480} y={42} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={28} fontWeight={600} fill={COLORS.sky_blue}>
            Fail early, fail loudly — that is what @Override gives you
          </text>
        </g>

        {/* ── Phase 3: breathing ──────────────────────────────────────────── */}
        <g transform={`translate(100, ${660 + breathe})`} opacity={0.04 * shimmer}>
          <circle cx={0} cy={0} r={8} fill="none" stroke={COLORS.green} strokeWidth={1}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0 0' }} />
        </g>
        <g transform={`translate(980, ${400 + breathe * -1})`} opacity={0.03 * shimmer}>
          <circle cx={0} cy={0} r={10} fill="none" stroke={COLORS.vibrant_red} strokeWidth={1}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0 0' }} />
        </g>

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s13.duration}
          />
        )}

      </svg>
    </AbsoluteFill>
  );
};
