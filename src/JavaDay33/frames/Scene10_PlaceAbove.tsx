/**
 * Scene10 — PlaceAbove
 * "You place it directly above the overriding method."
 * CSV: 38.48s -> 41.14s
 * Duration: 98 frames (3.27s)
 *
 * Animation phases:
 *   Phase 1 (frames 0-20):  Label + headline spring in
 *   Phase 2 (frames 15-65): Code block with @Override above method, pointer arrow, highlight zone
 *   Phase 3 (frames 60-end): Micro-pulse on annotation, breathe on arrow
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

export const Scene10_PlaceAbove: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 5);
  const headlineB = useSpringEntrance(frame, 10);

  // ── Phase 2: Code + annotation ─────────────────────────────────────────────
  const codeBlock = useSpringEntrance(frame, 14);
  const classHeader = useSpringEntrance(frame, 18);
  const annotationLine = useSpringEntrance(frame, 24);
  const methodLine = useSpringEntrance(frame, 30);
  const bodyLine = useSpringEntrance(frame, 36);
  const closingBrace = useSpringEntrance(frame, 40);
  const pointerArrow = useSpringEntrance(frame, 28);
  const highlightZone = useSpringEntrance(frame, 32);
  const explainCard1 = useSpringEntrance(frame, 44);
  const explainCard2 = useSpringEntrance(frame, 50);
  const summaryCard = useSpringEntrance(frame, 56);

  // Annotation snap
  const annoSnap = spring({ frame: Math.max(0, frame - 24), fps: 30, config: SPRING_SNAP });
  const annoScale = interpolate(annoSnap, [0, 1], [0.7, 1]);

  // Path draws
  const arrowLen = 80;
  const arrowDash = usePathDraw(frame, 28, arrowLen, 14);
  const highlightPerim = 2 * (920 + 52);
  const highlightBorder = usePathDraw(frame, 32, highlightPerim, 20);
  const codeBlockPerim = 2 * (960 + 420);
  const codeBlockBorder = interpolate(frame, [16, 36], [codeBlockPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const card1Perim = 2 * (440 + 120);
  const card1Border = interpolate(frame, [46, 60], [card1Perim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const card2Perim = 2 * (440 + 120);
  const card2Border = interpolate(frame, [52, 66], [card2Perim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const annoPulse = interpolate(Math.sin(frame * 0.12), [-1, 1], [0.06, 0.15]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s10.from);

  // Code lines
  const codeY0 = 500;
  const lineH = 56;

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>

        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="OVERRIDE · PLACEMENT" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B — Headline ───────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={250} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={60} fontWeight={800} fill={COLORS.deep_black}>
            Place It
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={340} fontFamily="'Inter', system-ui, sans-serif"
            fontSize={64} fontWeight={800} fill={COLORS.orange}>
            Directly Above
          </text>
        </g>

        {/* ── ZONE C — Code block ─────────────────────────────────────────── */}
        {/* Code block background */}
        <g opacity={codeBlock.opacity} transform={`translate(0, ${codeBlock.translateY * 0.5})`}>
          <rect x={60} y={codeY0 - 30} width={960} height={420} rx={12}
            fill={COLORS.deep_black} fillOpacity={0.03} />
          <rect x={60} y={codeY0 - 30} width={960} height={420} rx={12}
            fill="none" stroke={COLORS.sky_blue} strokeWidth={1.5}
            strokeDasharray={codeBlockPerim} strokeDashoffset={codeBlockBorder} opacity={0.2} />
          <rect x={60} y={codeY0 - 30} width={6} height={420} rx={3} fill={COLORS.sky_blue} />
        </g>

        {/* Highlight zone behind @Override line */}
        <g opacity={highlightZone.opacity}>
          <rect x={70} y={codeY0 + lineH * 1 - 6} width={920} height={52} rx={6}
            fill={COLORS.green} fillOpacity={annoPulse}
            stroke={COLORS.green} strokeWidth={1.5}
            strokeDasharray={highlightPerim} strokeDashoffset={highlightBorder} opacity={0.4} />
        </g>

        {/* Line 1: class header */}
        <g opacity={classHeader.opacity} transform={`translate(0, ${classHeader.translateY * 0.3})`}>
          <text x={100} y={codeY0 + lineH * 0 + 36} fontFamily="'Fira Code', monospace"
            fontSize={30} fontWeight={400}>
            <tspan fill={COLORS.sky_blue}>class </tspan>
            <tspan fill={COLORS.deep_black}>ExpressTrain </tspan>
            <tspan fill={COLORS.sky_blue}>extends </tspan>
            <tspan fill={COLORS.deep_black}>Train {'{'}</tspan>
          </text>
        </g>

        {/* Line 2: @Override annotation — animated snap */}
        <g opacity={annotationLine.opacity}
          transform={`translate(0, ${annotationLine.translateY * 0.3}) scale(${annoScale})`}
          style={{ transformOrigin: `140px ${codeY0 + lineH * 1 + 36}px` }}>
          <text x={140} y={codeY0 + lineH * 1 + 36} fontFamily="'Fira Code', monospace"
            fontSize={32} fontWeight={700} fill={COLORS.green}>
            @Override
          </text>
        </g>

        {/* Line 3: method signature */}
        <g opacity={methodLine.opacity} transform={`translate(0, ${methodLine.translateY * 0.3})`}>
          <text x={140} y={codeY0 + lineH * 2 + 36} fontFamily="'Fira Code', monospace"
            fontSize={30} fontWeight={400}>
            <tspan fill={COLORS.sky_blue}>int </tspan>
            <tspan fill={COLORS.deep_black}>calculateFare(</tspan>
            <tspan fill={COLORS.sky_blue}>int </tspan>
            <tspan fill={COLORS.deep_black}>dist) {'{'}</tspan>
          </text>
        </g>

        {/* Line 4: method body */}
        <g opacity={bodyLine.opacity} transform={`translate(0, ${bodyLine.translateY * 0.3})`}>
          <text x={180} y={codeY0 + lineH * 3 + 36} fontFamily="'Fira Code', monospace"
            fontSize={30} fontWeight={400}>
            <tspan fill={COLORS.sky_blue}>return </tspan>
            <tspan fill={COLORS.deep_black}>dist * 15;</tspan>
          </text>
        </g>

        {/* Line 5: closing braces */}
        <g opacity={closingBrace.opacity} transform={`translate(0, ${closingBrace.translateY * 0.3})`}>
          <text x={140} y={codeY0 + lineH * 4 + 36} fontFamily="'Fira Code', monospace"
            fontSize={30} fontWeight={400} fill={COLORS.deep_black}>
            {'}'}
          </text>
          <text x={100} y={codeY0 + lineH * 5 + 36} fontFamily="'Fira Code', monospace"
            fontSize={30} fontWeight={400} fill={COLORS.deep_black}>
            {'}'}
          </text>
        </g>

        {/* ── Pointer arrow from left ─────────────────────────────────────── */}
        <g opacity={pointerArrow.opacity} transform={`translate(0, ${breathe * 0.5})`}>
          <path d={`M 40,${codeY0 + lineH * 1 + 20} L 68,${codeY0 + lineH * 1 + 20}`}
            fill="none" stroke={COLORS.green} strokeWidth={3}
            strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
            strokeLinecap="round" markerEnd="url(#arrow)" />
          <text x={30} y={codeY0 + lineH * 1 - 4} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={18} fontWeight={600}
            fill={COLORS.green} opacity={0.6}>
            HERE
          </text>
        </g>

        {/* ── Line numbers ────────────────────────────────────────────────── */}
        {[1, 2, 3, 4, 5, 6].map((num, i) => (
          <text key={num} x={82} y={codeY0 + lineH * i + 36} fontFamily="'Fira Code', monospace"
            fontSize={22} fontWeight={400} fill={COLORS.cool_silver} opacity={codeBlock.opacity * 0.35}
            textAnchor="right">
            {num}
          </text>
        ))}

        {/* ── Explanation cards ────────────────────────────────────────────── */}
        <g opacity={explainCard1.opacity} transform={`translate(60, ${960 + explainCard1.translateY})`}>
          <rect x={0} y={0} width={440} height={120} rx={10}
            fill={COLORS.green} fillOpacity={0.04} />
          <rect x={0} y={0} width={440} height={120} rx={10}
            fill="none" stroke={COLORS.green} strokeWidth={1.5}
            strokeDasharray={card1Perim} strokeDashoffset={card1Border} opacity={0.3} />
          <rect x={0} y={0} width={6} height={120} rx={3} fill={COLORS.green} />
          <text x={28} y={42} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={500} fill={COLORS.cool_silver}>
            POSITION
          </text>
          <text x={28} y={80} fontFamily="'Inter', sans-serif" fontSize={30} fontWeight={700} fill={COLORS.deep_black}>
            Directly above method
          </text>
          <text x={28} y={108} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={400} fill={COLORS.cool_silver}>
            On the line before signature
          </text>
        </g>

        <g opacity={explainCard2.opacity} transform={`translate(540, ${960 + explainCard2.translateY})`}>
          <rect x={0} y={0} width={440} height={120} rx={10}
            fill={COLORS.orange} fillOpacity={0.04} />
          <rect x={0} y={0} width={440} height={120} rx={10}
            fill="none" stroke={COLORS.orange} strokeWidth={1.5}
            strokeDasharray={card2Perim} strokeDashoffset={card2Border} opacity={0.3} />
          <rect x={0} y={0} width={6} height={120} rx={3} fill={COLORS.orange} />
          <text x={28} y={42} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={500} fill={COLORS.cool_silver}>
            SCOPE
          </text>
          <text x={28} y={80} fontFamily="'Inter', sans-serif" fontSize={30} fontWeight={700} fill={COLORS.deep_black}>
            One per method
          </text>
          <text x={28} y={108} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={400} fill={COLORS.cool_silver}>
            Each override gets its own
          </text>
        </g>

        {/* ── Summary card ────────────────────────────────────────────────── */}
        <g opacity={summaryCard.opacity} transform={`translate(60, ${1130 + summaryCard.translateY})`}>
          <rect x={0} y={0} width={960} height={100} rx={10}
            fill={COLORS.sky_blue} fillOpacity={0.04}
            stroke={COLORS.sky_blue} strokeWidth={1} opacity={0.2} />
          <rect x={0} y={0} width={6} height={100} rx={3} fill={COLORS.sky_blue} />
          <text x={32} y={42} fontFamily="'Inter', sans-serif" fontSize={30} fontWeight={700} fill={COLORS.sky_blue}>
            One line of code, maximum protection
          </text>
          <text x={32} y={78} fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={400} fill={COLORS.deep_black}>
            The compiler now formally verifies your override intent.
          </text>
        </g>

        {/* ── Phase 3: Decorative breathing pulse ─────────────────────────── */}
        <g transform={`translate(950, ${420 + breathe})`} opacity={0.06 * shimmer}>
          <circle cx={0} cy={0} r={20} fill="none" stroke={COLORS.green} strokeWidth={1}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0 0' }} />
        </g>
        <g transform={`translate(80, ${920 + breathe * -1})`} opacity={0.04 * shimmer}>
          <circle cx={0} cy={0} r={14} fill="none" stroke={COLORS.orange} strokeWidth={1}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0 0' }} />
        </g>

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s10.duration}
          />
        )}

      </svg>
    </AbsoluteFill>
  );
};
