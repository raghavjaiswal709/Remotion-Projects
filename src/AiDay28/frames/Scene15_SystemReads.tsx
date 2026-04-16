/**
 * Scene 15 — SystemReads
 * "The surrounding system reads it."
 * CSV: 48.420s → 50.140s
 * Duration: 65 frames (2.17s)
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–18):  Label + headline reveal
 *   Phase 2 (frames 10–45): System box with eye/scanner icon, spec document
 *                            arrives from left, scan beam sweeps spec
 *   Phase 3 (frames 40–end): Parsing lines highlight, data flow pulses
 *
 * Visual: A system representation "reading" the spec document with an
 *         animated scanner beam sweeping across the document lines.
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
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 } as const;
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, start: number, len: number, dur = 30) {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return len * (1 - p);
}

export const Scene15_SystemReads: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──────────────────────────────────────────────────────────────
  const labelEnter = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 3);
  const h2 = useSpringEntrance(frame, 7);

  // ── Phase 2 ──────────────────────────────────────────────────────────────

  // Spec document (left side — arrives from offscreen)
  const specSlide = spring({
    frame: Math.max(0, frame - 10), fps, config: SPRING_SOFT,
  });
  const specX = interpolate(specSlide, [0, 1], [-200, 80]);
  const specOpacity = interpolate(frame, [10, 18], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // System box (right side)
  const sysEnter = useSpringEntrance(frame, 14);
  const sysPerim = 2 * (480 + 500);
  const sysBorder = interpolate(frame, [14, 38], [sysPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Arrow from spec to system
  const arrowLen = 160;
  const arrowDash = usePathDraw(frame, 16, arrowLen, 16);

  // Scanner beam inside system box — sweeps top to bottom
  const scanProgress = interpolate(frame, [22, 50], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });
  const scanY = interpolate(scanProgress, [0, 1], [560, 880]);

  // Eye/scanner icon at top of system box
  const eyeEnter = useSpringEntrance(frame, 18);

  // Doc lines becoming highlighted one by one
  const docLines = [
    { y: 600, w: 360, highlight: 22 },
    { y: 640, w: 300, highlight: 28 },
    { y: 680, w: 340, highlight: 34 },
    { y: 720, w: 280, highlight: 40 },
    { y: 760, w: 320, highlight: 45 },
  ];

  // Bottom cards
  const card1 = useSpringEntrance(frame, 34);
  const card2 = useSpringEntrance(frame, 40);
  const card3 = useSpringEntrance(frame, 46);

  // ── Phase 3 ──────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const pulse = 1 + Math.sin(frame * 0.08) * 0.012;

  // Data flow particles along the arrow
  const flowParticles = Array.from({ length: 6 }, (_, i) => {
    const offset = (frame * 4 + i * 30) % 180;
    const progress = offset / 180;
    return {
      x: interpolate(progress, [0, 1], [380, 530]),
      y: 740 + Math.sin(progress * Math.PI * 2) * 8,
      opacity: interpolate(progress, [0, 0.2, 0.8, 1], [0, 0.4, 0.4, 0], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
      }),
    };
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s15.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="TOOL CALLING · HANDOFF" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={260}
            fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            System
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={370}
            fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            Reads It
          </text>
        </g>

        {/* ── ZONE C — Spec → System reading ─────────────────────────────── */}

        {/* SPEC DOCUMENT (left side) */}
        <g opacity={specOpacity}
           transform={`translate(${specX}, ${breathe * 0.5})`}>
          <BentoCard x={0} y={540} w={320} h={320} accent />
          {/* Document icon at top */}
          <rect x={120} y={560} width={80} height={100} rx={6}
            fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <rect x={120} y={560} width={80} height={24} rx={6}
            fill={COLORS.accent} opacity={0.2} />
          <text x={160} y={578} textAnchor="middle"
            fontFamily={FONT} fontSize={14} fontWeight={800} fill={COLORS.accent}>
            SPEC
          </text>
          {/* Content lines */}
          {docLines.map((ln, i) => {
            const highlighted = frame >= ln.highlight;
            return (
              <g key={i}>
                <line x1={40} y1={ln.y} x2={40 + ln.w * 0.85} y2={ln.y}
                  stroke={highlighted ? COLORS.accent : COLORS.text_muted}
                  strokeWidth={highlighted ? 3 : 2}
                  opacity={highlighted ? 0.8 : 0.25}
                  strokeLinecap="round" />
              </g>
            );
          })}
          {/* JSON bracket decorations */}
          <text x={30} y={594}
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.accent} opacity={0.3}>
            {'{'}
          </text>
          <text x={30} y={800}
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.accent} opacity={0.3}>
            {'}'}
          </text>
        </g>

        {/* ARROW — Spec → System */}
        <line x1={410} y1={740} x2={570} y2={740}
          stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        {/* Flow particles */}
        {flowParticles.map((pt, i) => (
          <circle key={i} cx={pt.x} cy={pt.y} r={2.5}
            fill={COLORS.accent} opacity={pt.opacity} />
        ))}

        {/* SYSTEM BOX (right side) */}
        <g opacity={sysEnter.opacity} transform={`translate(0, ${sysEnter.translateY})`}>
          <BentoCard x={560} y={520} w={480} h={500} />
          {/* Animated border */}
          <rect x={560} y={520} width={480} height={500} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={sysPerim} strokeDashoffset={sysBorder} />
          {/* SYSTEM label */}
          <text x={800} y={565} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.12em">
            RUNTIME
          </text>

          {/* Eye / scanner icon */}
          <g opacity={eyeEnter.opacity}
             transform={`translate(800, 650) scale(${pulse})`}
             style={{ transformOrigin: '0px 0px' }}>
            {/* Eye outline */}
            <ellipse cx={0} cy={0} rx={50} ry={30}
              fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
            {/* Iris */}
            <circle cx={0} cy={0} r={16}
              fill={COLORS.accent} opacity={0.3} />
            {/* Pupil */}
            <circle cx={0} cy={0} r={7}
              fill={COLORS.accent} opacity={0.8} />
            {/* Scan beam radiating lines */}
            {Array.from({ length: 5 }, (_, i) => {
              const angle = ((i - 2) / 2) * 0.3;
              const x2 = Math.sin(angle) * 80;
              const y2 = Math.cos(angle) * 80;
              return (
                <line key={i} x1={0} y1={0} x2={x2} y2={y2}
                  stroke={COLORS.accent} strokeWidth={1}
                  opacity={0.12 * shimmer} />
              );
            })}
          </g>

          {/* Scanner beam line */}
          <line x1={590} y1={scanY} x2={1010} y2={scanY}
            stroke={COLORS.accent} strokeWidth={2}
            opacity={scanProgress > 0 && scanProgress < 1 ? 0.4 : 0}
            strokeDasharray="6,4" />

          {/* Parsed data indicators */}
          {[
            { y: 760, label: 'tool_name', delay: 28 },
            { y: 810, label: 'arguments', delay: 34 },
            { y: 860, label: 'values', delay: 40 },
          ].map((item, i) => {
            const show = interpolate(frame, [item.delay, item.delay + 8], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            return (
              <g key={i} opacity={show}>
                <circle cx={610} cy={item.y} r={6}
                  fill={COLORS.accent} opacity={0.5} />
                <text x={632} y={item.y + 6}
                  fontFamily={FONT} fontSize={28} fontWeight={800}
                  fill={COLORS.text_muted}>
                  {item.label}
                </text>
                <text x={990} y={item.y + 6} textAnchor="end"
                  fontFamily={FONT} fontSize={28} fontWeight={800}
                  fill={COLORS.accent}>
                  parsed
                </text>
              </g>
            );
          })}

          {/* Status indicator */}
          <g opacity={interpolate(frame, [42, 48], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          })}>
            <rect x={740} y={920} width={120} height={36} rx={18}
              fill={COLORS.accent} opacity={0.15} />
            <text x={800} y={944} textAnchor="middle"
              fontFamily={FONT} fontSize={18} fontWeight={800}
              fill={COLORS.accent}>
              READING
            </text>
          </g>
        </g>

        {/* ── Bottom cards ───────────────────────────────────────────────── */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={1100} w={300} h={130} accent />
          <text x={100} y={1178}
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Receives spec
          </text>
        </g>

        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={390} y={1100} w={300} h={130} />
          <text x={430} y={1178}
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            Parses fields
          </text>
        </g>

        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={720} y={1100} w={300} h={130} />
          <text x={760} y={1178}
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Extracts data
          </text>
        </g>

        {/* ── Big descriptive card ───────────────────────────────────────── */}
        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={60} y={1280} w={960} h={160} />
          <rect x={60} y={1280} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={100} y={1350}
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            The system interprets the model's
          </text>
          <text x={100} y={1400}
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            structured decision as an action plan
          </text>
        </g>

        {/* ── Floating particles ─────────────────────────────────────────── */}
        {[
          { x: 120, y: 1520 }, { x: 950, y: 1540 },
          { x: 320, y: 1600 }, { x: 760, y: 1580 },
          { x: 540, y: 1660 }, { x: 180, y: 1680 },
          { x: 860, y: 1700 }, { x: 440, y: 1710 },
        ].map((pt, i) => (
          <circle key={i}
            cx={pt.x} cy={pt.y + Math.sin(frame * 0.04 + i * 0.7) * 4}
            r={2.5} fill={COLORS.accent} opacity={0.06 * shimmer} />
        ))}

        {/* ── CAPTION ──────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s15.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
