/**
 * Scene 14 — Print Ticket
 * "when you print a ticket this runs."
 * CSV: 56.340s → 59.560s
 * Duration: 96 frames (3.2s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–18):   Label + headline spring
 *   Phase 2 (frames 12–60):  Print flow: System.out.println(ticket) → toString() call → console output
 *   Phase 3 (frames 50–end): Console cursor blink, micro floaters
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
const MONO = "'Fira Code', 'Courier New', monospace";

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
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

export const Scene14_PrintTicket: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headA    = useSpringEntrance(frame, 4);
  const headB    = useSpringEntrance(frame, 10);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const codeCard   = useSpringEntrance(frame, 12);
  const arrow1     = usePathDraw(frame, 20, 120, 16);
  const methodCard = useSpringEntrance(frame, 22);
  const arrow2     = usePathDraw(frame, 30, 120, 16);
  const consoleCard = useSpringEntrance(frame, 34);

  // Ticket illustration card
  const ticketEnt  = useSpringEntrance(frame, 42);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;
  const cursorBlink = Math.sin(frame * 0.3) > 0 ? 1 : 0;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s14.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="OBJECT · PRINT" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={280} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Print a Ticket
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={370} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}>
            toString() runs automatically
          </text>
        </g>

        {/* ── Code call card ──────────────────────────────────────────── */}
        <g opacity={codeCard.opacity} transform={`translate(0, ${codeCard.translateY})`}>
          <BentoCard x={60} y={450} w={960} h={130} accent />
          <rect x={60} y={450} width={6} height={130} rx={3} fill={COLORS.accent} />
          <text x={100} y={530} fontFamily={MONO} fontSize={28} fontWeight={800} fill={COLORS.white}>
            System.out.println(ticket);
          </text>
        </g>

        {/* Arrow down */}
        <path d="M 540,580 L 540,640" fill="none"
          stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={120} strokeDashoffset={arrow1}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* ── toString method card ────────────────────────────────────── */}
        <g opacity={methodCard.opacity} transform={`translate(0, ${methodCard.translateY})`}>
          <BentoCard x={180} y={650} w={720} h={100} />
          <text x={540} y={712} textAnchor="middle"
            fontFamily={MONO} fontSize={30} fontWeight={800} fill={COLORS.accent}>
            ticket.toString()  →  called by Java
          </text>
        </g>

        {/* Arrow down */}
        <path d="M 540,750 L 540,820" fill="none"
          stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={120} strokeDashoffset={arrow2}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* ── Console output card ─────────────────────────────────────── */}
        <g opacity={consoleCard.opacity} transform={`translate(0, ${consoleCard.translateY})`}>
          <BentoCard x={60} y={830} w={960} h={180} />
          {/* Console header bar */}
          <rect x={60} y={830} width={960} height={40} rx={20}
            fill="rgba(255,255,255,0.04)" />
          <circle cx={95} cy={850} r={6} fill="#F7374F" fillOpacity={0.6} />
          <circle cx={118} cy={850} r={6} fill="#F7D24F" fillOpacity={0.6} />
          <circle cx={141} cy={850} r={6} fill="#4FF77A" fillOpacity={0.6} />
          <text x={200} y={856} fontFamily={MONO} fontSize={18} fontWeight={500}
            fill={COLORS.text_muted}>Console</text>

          <text x={100} y={920} fontFamily={MONO} fontSize={30} fontWeight={800} fill={COLORS.accent}>
            &gt; Express 42 — Platform 3
          </text>
          {/* Blinking cursor */}
          <rect x={620} y={902} width={14} height={28} rx={2}
            fill={COLORS.accent} opacity={cursorBlink * consoleCard.opacity} />
        </g>

        {/* ── Ticket illustration ─────────────────────────────────────── */}
        <g opacity={ticketEnt.opacity} transform={`translate(0, ${ticketEnt.translateY})`}>
          <BentoCard x={60} y={1070} w={960} h={300} />
          {/* Ticket shape */}
          <rect x={140} y={1100} width={800} height={220} rx={16}
            fill="rgba(255,255,255,0.03)" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray="8 4" />
          {/* Perforation line */}
          <line x1={680} y1={1110} x2={680} y2={1310}
            stroke={COLORS.text_muted} strokeWidth={1} strokeDasharray="6 6" />
          {/* Left: ticket info */}
          <text x={180} y={1160} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Express 42
          </text>
          <text x={180} y={1210} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Platform 3 · Coach B
          </text>
          <text x={180} y={1260} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            Seat 14A · Window
          </text>
          {/* Right: barcode-like lines */}
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={720 + i * 8} y={1140} width={4}
              height={60 + (i % 3) * 20} rx={1}
              fill={COLORS.accent} fillOpacity={0.35}
              transform={`scale(${pulse})`}
              style={{ transformOrigin: `${722 + i * 8}px 1170px` }} />
          ))}
          <text x={740} y={1280} fontFamily={MONO} fontSize={20} fontWeight={500}
            fill={COLORS.text_muted}>TKT-0042</text>
        </g>

        {/* ── Floaters ────────────────────────────────────────────────── */}
        <circle cx={100} cy={1500 + breathe} r={3} fill={COLORS.accent} fillOpacity={0.15} />
        <circle cx={980} cy={1600 - breathe} r={2} fill={COLORS.accent} fillOpacity={0.12} />

        {/* ── CAPTION ─────────────────────────────────────────────────── */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s14.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
