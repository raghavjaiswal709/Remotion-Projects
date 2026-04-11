/**
 * Scene08 — Fare Logic Completely Different
 * "The fare logic is completely different between them."
 * CSV: 27.02s → 29.96s
 * Duration: 104 frames (3.5s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Reveal label + headline
 *   Phase 2 (frames 18–80):  Side-by-side logic boxes, code snippets, vs divider
 *   Phase 3 (frames 70–end): Shimmer, pulse on "DIFFERENT" label, micro float
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

export const Scene08_FareLogicDifferent: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 5);
  const headlineB = useSpringEntrance(frame, 10);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  // Left — Express Logic
  const leftBox = useSpringEntrance(frame, 16);
  const leftPerimeter = 2 * (420 + 520);
  const leftBorder = usePathDraw(frame, 16, leftPerimeter, 26);
  const leftTitle = useSpringEntrance(frame, 20);
  const leftLine1 = useSpringEntrance(frame, 26);
  const leftLine2 = useSpringEntrance(frame, 32);
  const leftLine3 = useSpringEntrance(frame, 38);

  // Right — Metro Logic
  const rightBox = useSpringEntrance(frame, 22);
  const rightPerimeter = 2 * (420 + 520);
  const rightBorder = usePathDraw(frame, 22, rightPerimeter, 26);
  const rightTitle = useSpringEntrance(frame, 26);
  const rightLine1 = useSpringEntrance(frame, 32);
  const rightLine2 = useSpringEntrance(frame, 38);
  const rightLine3 = useSpringEntrance(frame, 44);

  // Divider
  const dividerDraw = usePathDraw(frame, 18, 520, 22);

  // Different badge
  const diffBadge = useSpringEntrance(frame, 46);
  const diffScale = spring({ frame: Math.max(0, frame - 46), fps, config: SPRING_SNAP });

  // "Not Equal" icon
  const neqEntrance = useSpringEntrance(frame, 38);
  const neqDraw = usePathDraw(frame, 38, 60, 18);

  // Bottom summary card
  const summaryCard = useSpringEntrance(frame, 52);
  const summaryPerimeter = 2 * (960 + 140);
  const summaryBorder = usePathDraw(frame, 52, summaryPerimeter, 24);

  // Comparison arrows
  const arrowLeftDraw = usePathDraw(frame, 44, 80, 14);
  const arrowRightDraw = usePathDraw(frame, 44, 80, 14);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.018;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const crossFlash = interpolate(Math.sin(frame * 0.15), [-1, 1], [0.4, 0.8]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s08.from);

  const expressCode = [
    { text: 'baseFare * 2.5', isKey: true },
    { text: '+ surcharge', isKey: false },
    { text: '+ comfortFee', isKey: false },
  ];

  const metroCode = [
    { text: 'if (dist <= 5) 10', isKey: true },
    { text: 'else if (dist <= 15) 25', isKey: false },
    { text: 'else if (dist <= 30) 40', isKey: false },
  ];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="METHOD OVERRIDING · COMPARISON" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text
            x={60} y={240}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={58} fontWeight={800}
            fill={COLORS.deep_black}
          >
            Completely
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text
            x={60} y={310}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={58} fontWeight={800}
            fill={COLORS.vibrant_red}
          >
            Different Logic
          </text>
        </g>

        {/* ── Vertical divider ────────────────────────────────────────────── */}
        <line
          x1={540} y1={380} x2={540} y2={900}
          stroke={COLORS.deep_black}
          strokeWidth={1.5}
          strokeDasharray={520}
          strokeDashoffset={dividerDraw}
          opacity={0.1}
        />

        {/* ── LEFT BOX — ExpressTrain ─────────────────────────────────────── */}
        <rect
          x={60} y={380} width={420} height={520} rx={14}
          fill="none"
          stroke={COLORS.orange}
          strokeWidth={2}
          strokeDasharray={leftPerimeter}
          strokeDashoffset={leftBorder}
        />
        <rect
          x={60} y={380} width={420} height={520} rx={14}
          fill={COLORS.orange}
          fillOpacity={leftBox.opacity * 0.03}
        />

        <g opacity={leftTitle.opacity} transform={`translate(0, ${leftTitle.translateY * 0.3})`}>
          <rect x={60} y={380} width={420} height={52} rx={14} ry={0} fill={COLORS.orange} fillOpacity={0.1} />
          <text
            x={270} y={414}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={700}
            fill={COLORS.orange}
          >
            ExpressTrain
          </text>
        </g>

        <g opacity={leftLine1.opacity} transform={`translate(0, ${leftLine1.translateY * 0.2})`}>
          <text
            x={90} y={482}
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={24} fontWeight={600}
            fill={COLORS.orange}
          >
            {expressCode[0].text}
          </text>
        </g>
        <g opacity={leftLine2.opacity} transform={`translate(0, ${leftLine2.translateY * 0.2})`}>
          <text
            x={90} y={530}
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={24} fontWeight={400}
            fill={COLORS.deep_black}
          >
            {expressCode[1].text}
          </text>
        </g>
        <g opacity={leftLine3.opacity} transform={`translate(0, ${leftLine3.translateY * 0.2})`}>
          <text
            x={90} y={578}
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={24} fontWeight={400}
            fill={COLORS.deep_black}
          >
            {expressCode[2].text}
          </text>
        </g>

        {/* Express fare style label */}
        <g opacity={leftBox.opacity * shimmer}>
          <rect x={100} y={630} width={340} height={48} rx={10} fill={COLORS.orange} fillOpacity={0.08} />
          <text
            x={270} y={662}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={600}
            fill={COLORS.orange}
            letterSpacing="0.1em"
          >
            MULTIPLIER + FEES
          </text>
        </g>

        {/* Express summary box */}
        <g opacity={leftBox.opacity * 0.7}>
          <text
            x={270} y={740}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={44} fontWeight={900}
            fill={COLORS.orange}
          >
            250
          </text>
          <text
            x={270} y={780}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={500}
            fill={COLORS.cool_silver}
          >
            Fixed formula
          </text>
        </g>

        {/* ── RIGHT BOX — MetroTrain ──────────────────────────────────────── */}
        <rect
          x={600} y={380} width={420} height={520} rx={14}
          fill="none"
          stroke={COLORS.green}
          strokeWidth={2}
          strokeDasharray={rightPerimeter}
          strokeDashoffset={rightBorder}
        />
        <rect
          x={600} y={380} width={420} height={520} rx={14}
          fill={COLORS.green}
          fillOpacity={rightBox.opacity * 0.03}
        />

        <g opacity={rightTitle.opacity} transform={`translate(0, ${rightTitle.translateY * 0.3})`}>
          <rect x={600} y={380} width={420} height={52} rx={14} ry={0} fill={COLORS.green} fillOpacity={0.1} />
          <text
            x={810} y={414}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={700}
            fill={COLORS.green}
          >
            MetroTrain
          </text>
        </g>

        <g opacity={rightLine1.opacity} transform={`translate(0, ${rightLine1.translateY * 0.2})`}>
          <text
            x={630} y={482}
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={24} fontWeight={600}
            fill={COLORS.green}
          >
            {metroCode[0].text}
          </text>
        </g>
        <g opacity={rightLine2.opacity} transform={`translate(0, ${rightLine2.translateY * 0.2})`}>
          <text
            x={630} y={530}
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={24} fontWeight={400}
            fill={COLORS.deep_black}
          >
            {metroCode[1].text}
          </text>
        </g>
        <g opacity={rightLine3.opacity} transform={`translate(0, ${rightLine3.translateY * 0.2})`}>
          <text
            x={630} y={578}
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={24} fontWeight={400}
            fill={COLORS.deep_black}
          >
            {metroCode[2].text}
          </text>
        </g>

        {/* Metro fare style label */}
        <g opacity={rightBox.opacity * shimmer}>
          <rect x={640} y={630} width={340} height={48} rx={10} fill={COLORS.green} fillOpacity={0.08} />
          <text
            x={810} y={662}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={600}
            fill={COLORS.green}
            letterSpacing="0.1em"
          >
            DISTANCE BRACKETS
          </text>
        </g>

        {/* Metro summary box */}
        <g opacity={rightBox.opacity * 0.7}>
          <text
            x={810} y={740}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={44} fontWeight={900}
            fill={COLORS.green}
          >
            10–60
          </text>
          <text
            x={810} y={780}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={500}
            fill={COLORS.cool_silver}
          >
            Variable slabs
          </text>
        </g>

        {/* ── Not-Equal icon in center ─────────────────────────────────────── */}
        <g opacity={neqEntrance.opacity} transform={`translate(540, 650)`}>
          <circle cx={0} cy={0} r={30} fill={COLORS.bg_paper} stroke={COLORS.vibrant_red} strokeWidth={2} opacity={crossFlash} />
          <path
            d="M -12,-10 L 12,10 M -12,10 L 12,-10"
            fill="none"
            stroke={COLORS.vibrant_red}
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={60}
            strokeDashoffset={neqDraw}
          />
        </g>

        {/* ── DIFFERENT badge ──────────────────────────────────────────────── */}
        <g
          opacity={diffBadge.opacity}
          transform={`translate(540, ${940 + breathe}) scale(${interpolate(diffScale, [0, 1], [0.5, 1])})`}
          style={{ transformOrigin: '0px 0px' }}
        >
          <rect
            x={-160} y={-30} width={320} height={60} rx={30}
            fill={COLORS.vibrant_red} fillOpacity={0.08}
            stroke={COLORS.vibrant_red} strokeWidth={2}
          />
          <text
            x={0} y={10}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={30} fontWeight={900}
            fill={COLORS.vibrant_red}
            letterSpacing="0.18em"
          >
            DIFFERENT
          </text>
        </g>

        {/* ── Comparison arrows ────────────────────────────────────────────── */}
        <path
          d="M 270,900 L 420,940"
          fill="none"
          stroke={COLORS.orange}
          strokeWidth={2}
          strokeDasharray={80}
          strokeDashoffset={arrowLeftDraw}
          strokeLinecap="round"
          opacity={0.5}
        />
        <path
          d="M 810,900 L 660,940"
          fill="none"
          stroke={COLORS.green}
          strokeWidth={2}
          strokeDasharray={80}
          strokeDashoffset={arrowRightDraw}
          strokeLinecap="round"
          opacity={0.5}
        />

        {/* ── Bottom summary card ──────────────────────────────────────────── */}
        <rect
          x={60} y={1020} width={960} height={140} rx={14}
          fill="none"
          stroke={COLORS.sky_blue}
          strokeWidth={1.5}
          strokeDasharray={summaryPerimeter}
          strokeDashoffset={summaryBorder}
        />
        <rect
          x={60} y={1020} width={960} height={140} rx={14}
          fill={COLORS.sky_blue}
          fillOpacity={summaryCard.opacity * 0.04}
        />
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY * 0.3})`}>
          <rect x={60} y={1020} width={6} height={140} rx={3} fill={COLORS.sky_blue} />
          <text
            x={100} y={1070}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={32} fontWeight={700}
            fill={COLORS.deep_black}
          >
            Same method name, entirely different body
          </text>
          <text
            x={100} y={1118}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={400}
            fill={COLORS.cool_silver}
          >
            The fare logic is completely different between them
          </text>
        </g>

        {/* ── Decorative dots ─────────────────────────────────────────────── */}
        {[0, 1, 2].map(i => (
          <circle
            key={i}
            cx={200 + i * 300} cy={1200}
            r={4}
            fill={COLORS.deep_black}
            opacity={0.08 * shimmer}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: `${200 + i * 300}px 1200px` }}
          />
        ))}

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
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
