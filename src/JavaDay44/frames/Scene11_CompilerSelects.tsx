/**
 * Scene 11 — CompilerSelects
 * "The compiler reads the arguments you passed and selects the correct version."
 * CSV: 37.860s → 41.480s
 * Duration: 124 frames (4.13s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25): Label + headline spring
 *   Phase 2 (frames 15–80): Compiler flow diagram — args → compiler → selected method
 *   Phase 3 (frames 70–end): Pulse on selected method, breathing accents
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
import { DarkBackground, GlobalDefs, Caption, BentoCard } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;

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

export const Scene11_CompilerSelects: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const label    = useSpringEntrance(frame, 0);
  const headline = useSpringEntrance(frame, 5);
  const subline  = useSpringEntrance(frame, 10);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const argsNode   = useSpringEntrance(frame, 15);
  const compNode   = useSpringEntrance(frame, 25);
  const meth1      = useSpringEntrance(frame, 35);
  const meth2      = useSpringEntrance(frame, 42);
  const meth3      = useSpringEntrance(frame, 49);
  const selectCard = useSpringEntrance(frame, 58);
  const infoCard   = useSpringEntrance(frame, 65);

  // ── Path draws ─────────────────────────────────────────────────────────────
  const arrowToComp   = usePathDraw(frame, 20, 140, 18);
  const arrowToMeth1  = usePathDraw(frame, 30, 200, 18);
  const arrowToMeth2  = usePathDraw(frame, 37, 200, 18);
  const arrowToMeth3  = usePathDraw(frame, 44, 200, 18);

  // ── Compiler gear rotation ─────────────────────────────────────────────────
  const gearRot = interpolate(frame, [25, 80], [0, 360], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // ── Selection highlight ────────────────────────────────────────────────────
  const selectProgress = interpolate(frame, [55, 72], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.05) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const checkGlow = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.5, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s11.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${label.translateY})`} opacity={label.opacity}>
          <text x={60} y={160}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.15em" opacity={0.8}>
            COMPILE-TIME RESOLUTION
          </text>
        </g>

        {/* ── ZONE B ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headline.translateY})`} opacity={headline.opacity}>
          <text x={60} y={295}
            fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.white}>
            Compiler Reads
          </text>
        </g>
        <g transform={`translate(0, ${subline.translateY})`} opacity={subline.opacity}>
          <text x={60} y={380}
            fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.accent}>
            Arguments
          </text>
        </g>

        {/* ── FLOW DIAGRAM ───────────────────────────────────────────────── */}

        {/* Arguments node (left) */}
        <g opacity={argsNode.opacity} transform={`translate(0, ${argsNode.translateY})`}>
          <BentoCard x={60} y={500} w={340} h={200} accent />
          <text x={230} y={575} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent}>
            ARGUMENTS
          </text>
          <text x={230} y={625} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>
            (route, class)
          </text>
          <text x={230} y={668} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.5}>
            passed at call site
          </text>
        </g>

        {/* Arrow: args → compiler */}
        <path d="M 400,600 L 500,600"
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={140} strokeDashoffset={arrowToComp}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        {/* Compiler node (center) */}
        <g opacity={compNode.opacity} transform={`translate(0, ${compNode.translateY})`}>
          <BentoCard x={500} y={500} w={240} h={200} accent />

          {/* Gear icon */}
          <g transform={`translate(620, 580) rotate(${gearRot})`}
            style={{ transformOrigin: '0px 0px' }}>
            {Array.from({ length: 8 }, (_, i) => {
              const a = (i * 45) * (Math.PI / 180);
              return (
                <rect key={i}
                  x={-5} y={-32} width={10} height={14} rx={2}
                  fill={COLORS.accent} fillOpacity={0.8}
                  transform={`rotate(${i * 45})`}
                  style={{ transformOrigin: '0px 0px' }} />
              );
            })}
            <circle cx={0} cy={0} r={15}
              fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2.5} />
          </g>

          <text x={620} y={660} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.white}>
            COMPILER
          </text>
        </g>

        {/* Arrows: compiler → methods (three branching) */}
        <path d="M 740,560 L 850,560"
          fill="none" stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={200} strokeDashoffset={arrowToMeth1}
          markerEnd="url(#arrow)" strokeLinecap="round" />
        <path d="M 740,600 L 850,760"
          fill="none" stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={200} strokeDashoffset={arrowToMeth2}
          markerEnd="url(#arrow)" strokeLinecap="round" />
        <path d="M 740,640 L 850,960"
          fill="none" stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={200} strokeDashoffset={arrowToMeth3}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        {/* Method 1 — not selected (dimmed) */}
        <g opacity={meth1.opacity * (1 - selectProgress * 0.5)}
          transform={`translate(0, ${meth1.translateY})`}>
          <BentoCard x={830} y={500} w={210} h={120} />
          <text x={935} y={555} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            fare(route)
          </text>
          <text x={935} y={595} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.5}>
            1 param
          </text>
        </g>

        {/* Method 2 — SELECTED (highlighted) */}
        <g opacity={meth2.opacity}
          transform={`translate(0, ${meth2.translateY})`}>
          <rect x={830} y={700} width={210} height={120} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={selectProgress * 3 + 1}
            opacity={1} />
          {/* Selection glow */}
          <rect x={830} y={700} width={210} height={120} rx={20}
            fill={COLORS.accent} fillOpacity={selectProgress * 0.08 * checkGlow}
            stroke="none" />
          <text x={935} y={755} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={selectProgress > 0.5 ? COLORS.accent : COLORS.white}>
            fare(r, c)
          </text>
          <text x={935} y={795} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent} opacity={selectProgress}>
            2 params
          </text>
          {/* Checkmark */}
          {selectProgress > 0.7 && (
            <g opacity={selectProgress}>
              <circle cx={960} cy={715} r={12}
                fill={COLORS.accent} fillOpacity={checkGlow * 0.6} />
              <path d="M 952,715 L 958,721 L 970,709"
                fill="none" stroke={COLORS.white} strokeWidth={2.5}
                strokeLinecap="round" strokeLinejoin="round" />
            </g>
          )}
        </g>

        {/* Method 3 — not selected (dimmed) */}
        <g opacity={meth3.opacity * (1 - selectProgress * 0.5)}
          transform={`translate(0, ${meth3.translateY})`}>
          <BentoCard x={830} y={900} w={210} h={120} />
          <text x={935} y={955} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            fare(r, c, p)
          </text>
          <text x={935} y={995} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.5}>
            3 params
          </text>
        </g>

        {/* ── Selection result card ──────────────────────────────────────── */}
        <g opacity={selectCard.opacity} transform={`translate(0, ${selectCard.translateY})`}>
          <BentoCard x={60} y={1100} w={960} h={160} accent />
          <rect x={60} y={1100} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={540} y={1170} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.white}>
            Compiler matches <tspan fill={COLORS.accent} fontStyle="italic">2 arguments</tspan> &#x2192; <tspan fill={COLORS.accent}>fare(r, c)</tspan>
          </text>
          <text x={540} y={1220} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            Selection happens before the program runs
          </text>
        </g>

        {/* ── Info card ──────────────────────────────────────────────────── */}
        <g opacity={infoCard.opacity} transform={`translate(0, ${infoCard.translateY})`}>
          <BentoCard x={60} y={1320} w={960} h={140} />
          <text x={100} y={1400}
            fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.text_muted}>
            Static dispatch — the compiler resolves before runtime
          </text>
        </g>

        {/* ── Floating micro ─────────────────────────────────────────────── */}
        <g transform={`translate(200, ${1560 + breathe})`} opacity={shimmer * 0.4}>
          <circle cx={0} cy={0} r={16} fill={COLORS.accent} fillOpacity={0.06} />
        </g>
        <g transform={`translate(880, ${1580 + breathe * 0.6})`} opacity={shimmer * 0.3}>
          <circle cx={0} cy={0} r={22}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} />
        </g>

        {/* ── Sub note ───────────────────────────────────────────────────── */}
        <g opacity={infoCard.opacity * 0.4}>
          <text x={540} y={1600} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            The developer never chooses a version — the compiler does
          </text>
        </g>

        {/* ── Corner accents ─────────────────────────────────────────────── */}
        <g opacity={label.opacity * 0.3}>
          <path d="M 60,60 L 60,130 M 60,60 L 130,60" fill="none"
            stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
          <path d="M 1020,1740 L 1020,1670 M 1020,1740 L 950,1740" fill="none"
            stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s11.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
