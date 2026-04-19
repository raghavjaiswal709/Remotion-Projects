/**
 * Scene 12 — NeverExplicitly
 * "You never explicitly choose."
 * CSV: 42.000s → 43.640s
 * Duration: 59 frames (1.97s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20): Section label, hero text springs
 *   Phase 2 (frames 15–45): Crossed-out manual selector, automated path visual
 *   Phase 3 (frames 40–end): Pulse, breathing accents
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

export const Scene12_NeverExplicitly: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const label    = useSpringEntrance(frame, 0);
  const heroLine = useSpringEntrance(frame, 4);
  const heroBold = useSpringEntrance(frame, 8);
  const subtext  = useSpringEntrance(frame, 12);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const manualCard = useSpringEntrance(frame, 14);
  const autoCard   = useSpringEntrance(frame, 20);
  const crossLine  = usePathDraw(frame, 18, 480, 14);
  const devCard    = useSpringEntrance(frame, 26);
  const arrowPath  = usePathDraw(frame, 28, 200, 16);
  const codeCard   = useSpringEntrance(frame, 32);
  const bottomCard = useSpringEntrance(frame, 38);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s12.from);

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
            AUTOMATIC DISPATCH
          </text>
        </g>

        {/* ── ZONE B — Hero statement ────────────────────────────────────── */}
        <g transform={`translate(0, ${heroLine.translateY})`} opacity={heroLine.opacity}>
          <text x={540} y={310} textAnchor="middle"
            fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.white}>
            You Never
          </text>
        </g>
        <g transform={`translate(0, ${heroBold.translateY})`} opacity={heroBold.opacity}>
          <text x={540} y={420} textAnchor="middle"
            fontFamily={FONT} fontSize={96} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Choose
          </text>
        </g>
        <g transform={`translate(0, ${subtext.translateY})`} opacity={subtext.opacity}>
          <text x={540} y={490} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.text_muted}>
            The compiler decides for you
          </text>
        </g>

        {/* ── Manual selector (crossed out) ──────────────────────────────── */}
        <g opacity={manualCard.opacity} transform={`translate(0, ${manualCard.translateY})`}>
          <BentoCard x={60} y={560} w={460} h={280} />
          <text x={290} y={640} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.5}>
            MANUAL SELECT
          </text>
          {/* Fake dropdown */}
          <rect x={120} y={670} width={340} height={60} rx={12}
            fill="rgba(255,255,255,0.03)"
            stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          <text x={140} y={710}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.3}>
            Pick a method version...
          </text>
          {/* Dropdown arrow */}
          <path d="M 430,695 L 440,705 L 450,695"
            fill="none" stroke={COLORS.text_muted} strokeWidth={2}
            opacity={0.3} />
          {/* Radio buttons */}
          <circle cx={140} cy={760} r={8}
            fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} />
          <text x={160} y={768}
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.3}>fare(route)</text>
          <circle cx={300} cy={760} r={8}
            fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} />
          <text x={320} y={768}
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.3}>fare(r,c)</text>

          {/* Big red cross-out line */}
          <line x1={80} y1={580} x2={500} y2={820}
            stroke={COLORS.vibrant_red} strokeWidth={4}
            strokeDasharray={480} strokeDashoffset={crossLine}
            strokeLinecap="round" opacity={0.8} />
          <line x1={500} y1={580} x2={80} y2={820}
            stroke={COLORS.vibrant_red} strokeWidth={4}
            strokeDasharray={480} strokeDashoffset={crossLine}
            strokeLinecap="round" opacity={0.8} />
        </g>

        {/* ── Automatic card (highlighted) ───────────────────────────────── */}
        <g opacity={autoCard.opacity} transform={`translate(0, ${autoCard.translateY})`}>
          <BentoCard x={560} y={560} w={460} h={280} accent />
          <rect x={560} y={560} width={6} height={280} rx={3} fill={COLORS.accent} />
          <text x={790} y={640} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.accent}>
            AUTO DISPATCH
          </text>
          {/* Gear icon */}
          <g transform={`translate(790, 740)`}>
            <circle cx={0} cy={0} r={40}
              fill={COLORS.accent} fillOpacity={0.08}
              stroke={COLORS.accent} strokeWidth={2}
              transform={`scale(${pulse})`}
              style={{ transformOrigin: '0px 0px' }} />
            {Array.from({ length: 6 }, (_, i) => {
              const angle = (i * 60) * (Math.PI / 180);
              return (
                <rect key={i}
                  x={-4} y={-42} width={8} height={12} rx={2}
                  fill={COLORS.accent} fillOpacity={0.6}
                  transform={`rotate(${i * 60})`}
                  style={{ transformOrigin: '0px 0px' }} />
              );
            })}
            <circle cx={0} cy={0} r={12}
              fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          </g>
          <text x={790} y={810} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            Compiler chooses
          </text>
        </g>

        {/* ── Developer → Code flow ──────────────────────────────────────── */}
        <g opacity={devCard.opacity} transform={`translate(0, ${devCard.translateY})`}>
          <BentoCard x={60} y={900} w={420} h={180} />
          {/* Person silhouette */}
          <circle cx={150} cy={965} r={24}
            fill="none" stroke={COLORS.text_muted} strokeWidth={2} />
          <path d="M 120,1000 Q 150,1040 180,1000"
            fill="none" stroke={COLORS.text_muted} strokeWidth={2} />
          <text x={195} y={975}
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.white}>
            Developer
          </text>
          <text x={195} y={1020}
            fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.text_muted}>
            calls calculateFare()
          </text>
          <text x={195} y={1055}
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.5}>
            passes arguments only
          </text>
        </g>

        {/* Arrow */}
        <path d="M 480,990 L 580,990"
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={200} strokeDashoffset={arrowPath}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        {/* Compiler auto-resolves */}
        <g opacity={codeCard.opacity} transform={`translate(0, ${codeCard.translateY})`}>
          <BentoCard x={600} y={900} w={420} h={180} accent />
          <text x={810} y={975} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>
            Compiler
          </text>
          <text x={810} y={1020} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.white}>
            resolves version
          </text>
          <text x={810} y={1055} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.5}>
            parameter signature match
          </text>
        </g>

        {/* ── Bottom summary ─────────────────────────────────────────────── */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={60} y={1150} w={960} h={140} />
          <text x={540} y={1235} textAnchor="middle"
            fontFamily={FONT} fontSize={38} fontWeight={800}
            fill={COLORS.text_muted}>
            Explicit selection is <tspan fill={COLORS.vibrant_red}>eliminated</tspan> — the type system handles it
          </text>
        </g>

        {/* ── Decorative blocks ──────────────────────────────────────────── */}
        <g opacity={bottomCard.opacity * shimmer * 0.3}>
          <rect x={60} y={1360} width={460} height={100} rx={20}
            fill={COLORS.bg_secondary}
            stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
          <text x={100} y={1420}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.5}>
            No if-else branching needed
          </text>
        </g>
        <g opacity={bottomCard.opacity * shimmer * 0.3}>
          <rect x={560} y={1360} width={460} height={100} rx={20}
            fill={COLORS.bg_secondary}
            stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
          <text x={600} y={1420}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.5}>
            Arguments are the key
          </text>
        </g>

        {/* ── Floating micro ─────────────────────────────────────────────── */}
        <g transform={`translate(160, ${1580 + breathe})`} opacity={0.3}>
          <circle cx={0} cy={0} r={14} fill={COLORS.accent} fillOpacity={0.06} />
        </g>
        <g transform={`translate(920, ${1620 + breathe * 0.7})`} opacity={shimmer * 0.3}>
          <circle cx={0} cy={0} r={18}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} />
        </g>
        <g opacity={shimmer * 0.15}>
          <text x={540} y={1560} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            Zero developer intervention — pure compiler logic
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
            sceneDuration={SCENE_TIMING.s12.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
