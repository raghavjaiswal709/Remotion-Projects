/**
 * Scene 16 — CompileTimeResolved
 * "Resolved at compile time."
 * CSV: 50.360s → 51.660s
 * Duration: 63 frames (2.1s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20): Label + hero spring
 *   Phase 2 (frames 12–48): Compiler pipeline: Source → Compiler → Bytecode
 *   Phase 3 (frames 40–end): Pulse, shimmer, stamp
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

export const Scene16_CompileTimeResolved: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const label    = useSpringEntrance(frame, 0);
  const heroA    = useSpringEntrance(frame, 4);
  const heroB    = useSpringEntrance(frame, 8);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const srcCard    = useSpringEntrance(frame, 12);
  const compCard   = useSpringEntrance(frame, 18);
  const byteCard   = useSpringEntrance(frame, 24);
  const arrow1Ent  = useSpringEntrance(frame, 16);
  const arrow2Ent  = useSpringEntrance(frame, 22);
  const stampEnt   = useSpringEntrance(frame, 30);
  const detailRow  = useSpringEntrance(frame, 36);
  const summaryEnt = useSpringEntrance(frame, 42);

  // ── Arrow path draw ────────────────────────────────────────────────────────
  const arrowLen = 120;
  const arrow1D  = usePathDraw(frame, 16, arrowLen, 15);
  const arrow2D  = usePathDraw(frame, 22, arrowLen, 15);

  // ── Compiler gear rotation ─────────────────────────────────────────────────
  const gearAngle = frame * 2;

  // ── Stamp animation ────────────────────────────────────────────────────────
  const stampScale = spring({ frame: Math.max(0, frame - 30), fps, config: SPRING_SNAP });
  const stampScaleVal = interpolate(stampScale, [0, 1], [2.5, 1]);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s16.from);

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
            STATIC DISPATCH · COMPILE TIME
          </text>
        </g>

        {/* ── ZONE B — Hero ─────────────────────────────────────────────── */}
        <g transform={`translate(0, ${heroA.translateY})`} opacity={heroA.opacity}>
          <text x={540} y={310} textAnchor="middle"
            fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.white}>
            Resolved at
          </text>
        </g>
        <g transform={`translate(0, ${heroB.translateY})`} opacity={heroB.opacity}>
          <text x={540} y={420} textAnchor="middle"
            fontFamily={FONT} fontSize={96} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Compile Time
          </text>
        </g>

        {/* ── Pipeline: SOURCE → COMPILER → BYTECODE ─────────────────────── */}

        {/* Source card */}
        <g opacity={srcCard.opacity} transform={`translate(0, ${srcCard.translateY})`}>
          <BentoCard x={60} y={540} w={280} h={320} />
          {/* Code lines */}
          <rect x={90} y={580} width={120} height={8} rx={4} fill={COLORS.text_muted} opacity={0.3} />
          <rect x={90} y={604} width={180} height={8} rx={4} fill={COLORS.accent} opacity={0.4} />
          <rect x={90} y={628} width={150} height={8} rx={4} fill={COLORS.text_muted} opacity={0.3} />
          <rect x={90} y={652} width={200} height={8} rx={4} fill={COLORS.accent} opacity={0.4} />
          <rect x={90} y={676} width={100} height={8} rx={4} fill={COLORS.text_muted} opacity={0.3} />
          <rect x={90} y={700} width={170} height={8} rx={4} fill={COLORS.accent} opacity={0.4} />
          <rect x={90} y={724} width={130} height={8} rx={4} fill={COLORS.text_muted} opacity={0.3} />
          <text x={200} y={800} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            .java
          </text>
        </g>

        {/* Arrow 1 */}
        <line x1={360} y1={700} x2={400} y2={700}
          stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={arrowLen} strokeDashoffset={arrow1D}
          markerEnd="url(#arrow)"
          opacity={arrow1Ent.opacity * 0.7} />

        {/* Compiler card */}
        <g opacity={compCard.opacity} transform={`translate(0, ${compCard.translateY})`}>
          <BentoCard x={400} y={540} w={280} h={320} accent />

          {/* Gear icon */}
          <g transform={`translate(540, 660) rotate(${gearAngle})`}
            style={{ transformOrigin: '0px 0px' }}>
            {Array.from({ length: 8 }, (_, i) => (
              <rect key={i}
                x={-6} y={-50}
                width={12} height={18} rx={3}
                fill={COLORS.accent}
                transform={`rotate(${i * 45})`}
                style={{ transformOrigin: '0px 0px' }} />
            ))}
            <circle cx={0} cy={0} r={20}
              fill={COLORS.bg_secondary}
              stroke={COLORS.accent} strokeWidth={3} />
            <circle cx={0} cy={0} r={8}
              fill={COLORS.accent} fillOpacity={0.3} />
          </g>

          <text x={540} y={760} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>
            javac
          </text>
          <text x={540} y={800} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>
            COMPILER
          </text>
        </g>

        {/* Arrow 2 */}
        <line x1={695} y1={700} x2={735} y2={700}
          stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={arrowLen} strokeDashoffset={arrow2D}
          markerEnd="url(#arrow)"
          opacity={arrow2Ent.opacity * 0.7} />

        {/* Bytecode card */}
        <g opacity={byteCard.opacity} transform={`translate(0, ${byteCard.translateY})`}>
          <BentoCard x={740} y={540} w={280} h={320} />
          {/* Binary blocks */}
          {Array.from({ length: 6 }, (_, row) => (
            <g key={row}>
              {Array.from({ length: 5 }, (_, col) => (
                <rect key={col}
                  x={770 + col * 44} y={580 + row * 30}
                  width={36} height={20} rx={4}
                  fill={COLORS.accent}
                  fillOpacity={(row + col) % 3 === 0 ? 0.3 : 0.1} />
              ))}
            </g>
          ))}
          <text x={880} y={800} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            .class
          </text>
        </g>

        {/* ── RESOLVED stamp ─────────────────────────────────────────────── */}
        <g opacity={stampEnt.opacity}
          transform={`translate(540, 960) scale(${stampScaleVal})`}
          style={{ transformOrigin: '0px 0px' }}>
          <rect x={-160} y={-40} width={320} height={80} rx={12}
            fill="none" stroke={COLORS.accent} strokeWidth={4}
            transform={`rotate(-6)`}
            style={{ transformOrigin: '0px 0px' }} />
          <text x={0} y={14} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.accent}
            transform="rotate(-6)"
            style={{ transformOrigin: '0px 0px' }}>
            RESOLVED
          </text>
        </g>

        {/* ── Detail row ─────────────────────────────────────────────────── */}
        <g opacity={detailRow.opacity} transform={`translate(0, ${detailRow.translateY})`}>
          <BentoCard x={60} y={1060} w={460} h={140} />
          <text x={100} y={1120}
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.white}>
            Before the program runs
          </text>
          <text x={100} y={1165}
            fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.text_muted}>
            No runtime lookup needed
          </text>
        </g>
        <g opacity={detailRow.opacity} transform={`translate(0, ${detailRow.translateY})`}>
          <BentoCard x={560} y={1060} w={460} h={140} accent />
          <text x={600} y={1120}
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>
            Static dispatch
          </text>
          <text x={600} y={1165}
            fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.text_muted}>
            Fixed at compile time
          </text>
        </g>

        {/* ── Summary ────────────────────────────────────────────────────── */}
        <g opacity={summaryEnt.opacity} transform={`translate(0, ${summaryEnt.translateY})`}>
          <BentoCard x={60} y={1260} w={960} h={140} />
          <rect x={60} y={1260} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={540} y={1340} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>
            The method version is <tspan fill={COLORS.accent} fontStyle="italic">locked in</tspan> before execution
          </text>
        </g>

        {/* ── Floating micro ─────────────────────────────────────────────── */}
        <g transform={`translate(150, ${1520 + breathe})`} opacity={shimmer * 0.12}>
          <circle cx={0} cy={0} r={16}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} />
        </g>
        <g transform={`translate(930, ${1540 + breathe * 0.6})`} opacity={0.1}>
          <circle cx={0} cy={0} r={8} fill={COLORS.accent} />
        </g>

        {/* ── Timeline bar ───────────────────────────────────────────────── */}
        <g opacity={summaryEnt.opacity * 0.35}>
          <rect x={120} y={1480} width={840} height={4} rx={2}
            fill="rgba(255,255,255,0.08)" />
          <rect x={120} y={1480} width={420} height={4} rx={2}
            fill={COLORS.accent} opacity={0.6} />
          <circle cx={540} cy={1482} r={8}
            fill={COLORS.accent} fillOpacity={glow_val(frame)}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={120} y={1520}
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.5}>
            COMPILE
          </text>
          <text x={960} y={1520} textAnchor="end"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.5}>
            RUNTIME
          </text>
          <text x={540} y={1520} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent}>
            RESOLVED HERE
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
            sceneDuration={SCENE_TIMING.s16.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};

function glow_val(frame: number): number {
  return interpolate(Math.sin(frame * 0.1), [-1, 1], [0.4, 1]);
}
