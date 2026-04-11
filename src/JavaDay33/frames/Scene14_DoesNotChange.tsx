/**
 * Scene14 — DoesNotChange
 * "@Override does not change what the method does."
 * CSV: 59.78s -> 62.38s
 * Duration: 105 frames (3.50s)
 *
 * Animation phases:
 *   Phase 1 (frames 0-20):  Label + headline
 *   Phase 2 (frames 16-60): Big @Override with equals sign, method diagram, info cards
 *   Phase 3 (frames 55-end): Pulse, shimmer on "identical" label
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

export const Scene14_DoesNotChange: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 5);
  const headlineB = useSpringEntrance(frame, 10);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  // Big @Override hero
  const heroF = Math.max(0, frame - 14);
  const heroProg = spring({ frame: heroF, fps: 30, config: SPRING_SNAP });
  const heroOp = interpolate(heroF, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  const heroScale = interpolate(heroProg, [0, 1], [0.6, 1]);

  // Equals sign
  const equalsEntrance = useSpringEntrance(frame, 22);
  const equalsLineLen = 80;
  const equalsLine1 = usePathDraw(frame, 24, equalsLineLen, 10);
  const equalsLine2 = usePathDraw(frame, 26, equalsLineLen, 10);

  // Not-equals (strike through) decoration
  const strikeLen = 120;
  const strikeDash = usePathDraw(frame, 20, strikeLen, 12);

  // Before / After method boxes
  const beforeBox = useSpringEntrance(frame, 28);
  const afterBox = useSpringEntrance(frame, 36);

  // Box border draws
  const boxPerim = 2 * (420 + 320);
  const beforeBorder = usePathDraw(frame, 30, boxPerim, 18);
  const afterBorder = usePathDraw(frame, 38, boxPerim, 18);

  // Method lines in boxes
  const bLine1 = useSpringEntrance(frame, 32);
  const bLine2 = useSpringEntrance(frame, 36);
  const bLine3 = useSpringEntrance(frame, 40);
  const aLine1 = useSpringEntrance(frame, 40);
  const aLine2 = useSpringEntrance(frame, 44);
  const aLine3 = useSpringEntrance(frame, 48);
  const aLine4 = useSpringEntrance(frame, 50);

  // Identical label
  const identLabel = useSpringEntrance(frame, 52);
  const identLineLen = 300;
  const identLineDash = usePathDraw(frame, 54, identLineLen, 14);

  // Info cards
  const card1 = useSpringEntrance(frame, 56);
  const card2 = useSpringEntrance(frame, 64);
  const summaryCard = useSpringEntrance(frame, 72);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s14.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>

        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="OVERRIDE · BEHAVIOR" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B — Headline ───────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={230} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={52} fontWeight={800} fill={COLORS.orange}>
            @Override
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={320} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={56} fontWeight={800} fill={COLORS.deep_black}>
            Does Not Change
          </text>
          <text x={60} y={390} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={44} fontWeight={400} fill={COLORS.cool_silver}>
            what the method does
          </text>
        </g>

        {/* ── Hero @Override with NOT-EQUALS decoration ───────────────────── */}
        <g opacity={heroOp} transform={`translate(540, 540) scale(${heroScale})`}
          style={{ transformOrigin: '540px 540px' }}>
          {/* Ghost layer */}
          <text x={0} y={0} textAnchor="middle" fontFamily="'Fira Code', monospace"
            fontSize={80} fontWeight={900} fill={COLORS.orange} opacity={0.1}>
            @Override
          </text>
          {/* Main layer */}
          <text x={0} y={0} textAnchor="middle" fontFamily="'Fira Code', monospace"
            fontSize={72} fontWeight={900} fill={COLORS.orange}>
            @Override
          </text>
          {/* Strike-through: NOT behavior change */}
          <line x1={-120} y1={-5} x2={120} y2={-5}
            stroke={COLORS.vibrant_red} strokeWidth={3} opacity={0.3}
            strokeDasharray={strikeLen} strokeDashoffset={strikeDash}
            strokeLinecap="round" />
        </g>

        {/* ── Equals sign ─────────────────────────────────────────────────── */}
        <g opacity={equalsEntrance.opacity} transform={`translate(540, ${600 + equalsEntrance.translateY})`}>
          <line x1={-30} y1={-8} x2={30} y2={-8}
            stroke={COLORS.cool_silver} strokeWidth={4}
            strokeDasharray={equalsLineLen} strokeDashoffset={equalsLine1}
            strokeLinecap="round" />
          <line x1={-30} y1={8} x2={30} y2={8}
            stroke={COLORS.cool_silver} strokeWidth={4}
            strokeDasharray={equalsLineLen} strokeDashoffset={equalsLine2}
            strokeLinecap="round" />
        </g>

        {/* ── Before box (without @Override) ──────────────────────────────── */}
        <g opacity={beforeBox.opacity} transform={`translate(60, ${660 + beforeBox.translateY})`}>
          <rect x={0} y={0} width={440} height={280} rx={12}
            fill="none" stroke={COLORS.cool_silver} strokeWidth={1.5}
            strokeDasharray={boxPerim} strokeDashoffset={beforeBorder} />
          <rect x={0} y={0} width={440} height={280} rx={12}
            fill={COLORS.deep_black} fillOpacity={0.02} />
          <rect x={0} y={0} width={440} height={42} rx={12}
            fill={COLORS.cool_silver} fillOpacity={0.06} />
          <text x={20} y={30} fontFamily="'Inter', sans-serif" fontSize={22}
            fontWeight={700} fill={COLORS.cool_silver}>
            Without @Override
          </text>
        </g>

        <g opacity={bLine1.opacity} transform={`translate(80, ${730 + bLine1.translateY})`}>
          <text fontFamily="'Fira Code', monospace" fontSize={20} fontWeight={400} fill={COLORS.sky_blue}>
            public int calculateFare
          </text>
        </g>
        <g opacity={bLine2.opacity} transform={`translate(80, ${766 + bLine2.translateY})`}>
          <text fontFamily="'Fira Code', monospace" fontSize={20} fontWeight={400} fill={COLORS.deep_black}>
            {'  (int distance) {'}
          </text>
        </g>
        <g opacity={bLine3.opacity} transform={`translate(80, ${802 + bLine3.translateY})`}>
          <text fontFamily="'Fira Code', monospace" fontSize={20} fontWeight={400} fill={COLORS.deep_black}>
            {'  return distance * 15;'}
          </text>
        </g>

        {/* ── After box (with @Override) ──────────────────────────────────── */}
        <g opacity={afterBox.opacity} transform={`translate(540, ${660 + afterBox.translateY})`}>
          <rect x={0} y={0} width={440} height={280} rx={12}
            fill="none" stroke={COLORS.green} strokeWidth={1.5}
            strokeDasharray={boxPerim} strokeDashoffset={afterBorder} />
          <rect x={0} y={0} width={440} height={280} rx={12}
            fill={COLORS.green} fillOpacity={0.02} />
          <rect x={0} y={0} width={440} height={42} rx={12}
            fill={COLORS.green} fillOpacity={0.06} />
          <text x={20} y={30} fontFamily="'Inter', sans-serif" fontSize={22}
            fontWeight={700} fill={COLORS.green}>
            With @Override
          </text>
        </g>

        <g opacity={aLine1.opacity} transform={`translate(560, ${712 + aLine1.translateY})`}>
          <text fontFamily="'Fira Code', monospace" fontSize={20} fontWeight={700} fill={COLORS.green}>
            @Override
          </text>
        </g>
        <g opacity={aLine2.opacity} transform={`translate(560, ${748 + aLine2.translateY})`}>
          <text fontFamily="'Fira Code', monospace" fontSize={20} fontWeight={400} fill={COLORS.sky_blue}>
            public int calculateFare
          </text>
        </g>
        <g opacity={aLine3.opacity} transform={`translate(560, ${784 + aLine3.translateY})`}>
          <text fontFamily="'Fira Code', monospace" fontSize={20} fontWeight={400} fill={COLORS.deep_black}>
            {'  (int distance) {'}
          </text>
        </g>
        <g opacity={aLine4.opacity} transform={`translate(560, ${820 + aLine4.translateY})`}>
          <text fontFamily="'Fira Code', monospace" fontSize={20} fontWeight={400} fill={COLORS.deep_black}>
            {'  return distance * 15;'}
          </text>
        </g>

        {/* ── "IDENTICAL" label between boxes ─────────────────────────────── */}
        <g opacity={identLabel.opacity} transform={`translate(0, ${identLabel.translateY})`}>
          <line x1={200} y1={980} x2={880} y2={980}
            stroke={COLORS.sky_blue} strokeWidth={1.5} opacity={0.3 * shimmer}
            strokeDasharray={identLineLen} strokeDashoffset={identLineDash}
            strokeLinecap="round" />
          <text x={540} y={1010} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={32} fontWeight={700} fill={COLORS.sky_blue} opacity={shimmer}>
            IDENTICAL BEHAVIOR
          </text>
        </g>

        {/* ── Info cards ──────────────────────────────────────────────────── */}
        <g opacity={card1.opacity} transform={`translate(60, ${1060 + card1.translateY})`}>
          <rect x={0} y={0} width={960} height={80} rx={10}
            fill={COLORS.orange} fillOpacity={0.04}
            stroke={COLORS.orange} strokeWidth={1} opacity={0.3} />
          <rect x={0} y={0} width={6} height={80} rx={3} fill={COLORS.orange} />
          <text x={28} y={32} fontFamily="'Inter', sans-serif" fontSize={26}
            fontWeight={700} fill={COLORS.orange}>
            What @Override IS
          </text>
          <text x={28} y={64} fontFamily="'Inter', sans-serif" fontSize={24}
            fontWeight={400} fill={COLORS.deep_black}>
            A compiler instruction — "verify this override is real"
          </text>
        </g>

        <g opacity={card2.opacity} transform={`translate(60, ${1165 + card2.translateY})`}>
          <rect x={0} y={0} width={960} height={80} rx={10}
            fill={COLORS.cool_silver} fillOpacity={0.04}
            stroke={COLORS.cool_silver} strokeWidth={1} opacity={0.3} />
          <rect x={0} y={0} width={6} height={80} rx={3} fill={COLORS.cool_silver} />
          <text x={28} y={32} fontFamily="'Inter', sans-serif" fontSize={26}
            fontWeight={700} fill={COLORS.cool_silver}>
            What @Override IS NOT
          </text>
          <text x={28} y={64} fontFamily="'Inter', sans-serif" fontSize={24}
            fontWeight={400} fill={COLORS.deep_black}>
            A behavior modifier — the method logic stays exactly the same
          </text>
        </g>

        {/* ── Summary ─────────────────────────────────────────────────────── */}
        <g opacity={summaryCard.opacity} transform={`translate(60, ${1280 + summaryCard.translateY})`}>
          <rect x={0} y={0} width={960} height={60} rx={8}
            fill={COLORS.sky_blue} fillOpacity={0.03} />
          <text x={480} y={40} textAnchor="middle" fontFamily="'Inter', sans-serif"
            fontSize={26} fontWeight={500} fill={COLORS.sky_blue}>
            Zero runtime impact — purely a compile-time safety net
          </text>
        </g>

        {/* ── Phase 3 decoration ──────────────────────────────────────────── */}
        <g transform={`translate(100, ${540 + breathe})`} opacity={0.04 * shimmer}>
          <circle cx={0} cy={0} r={8} fill="none" stroke={COLORS.orange} strokeWidth={1}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0 0' }} />
        </g>
        <g transform={`translate(980, ${940 + breathe * -1})`} opacity={0.03 * shimmer}>
          <circle cx={0} cy={0} r={10} fill="none" stroke={COLORS.sky_blue} strokeWidth={1}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0 0' }} />
        </g>

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s14.duration}
          />
        )}

      </svg>
    </AbsoluteFill>
  );
};
