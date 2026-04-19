/**
 * Scene 17 — BookingOfficerCalls
 * "The booking officer always calls calculateFare."
 * CSV: 52.460s → 54.940s
 * Duration: 87 frames (2.9s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20): Label + hero headline
 *   Phase 2 (frames 14–60): Booking officer desk + single method call
 *   Phase 3 (frames 50–end): Pulse, shimmer, floating decorations
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

export const Scene17_BookingOfficerCalls: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const label   = useSpringEntrance(frame, 0);
  const heroA   = useSpringEntrance(frame, 4);
  const heroB   = useSpringEntrance(frame, 8);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const deskEnt    = useSpringEntrance(frame, 14);
  const officerEnt = useSpringEntrance(frame, 18);
  const speechEnt  = useSpringEntrance(frame, 24);
  const methodCard = useSpringEntrance(frame, 30);
  const arrowEnt   = useSpringEntrance(frame, 26);
  const routeCard  = useSpringEntrance(frame, 36);
  const callCard   = useSpringEntrance(frame, 42);
  const noteEnt    = useSpringEntrance(frame, 48);

  // ── Path draws ─────────────────────────────────────────────────────────────
  const speechTail = usePathDraw(frame, 24, 60, 15);
  const arrowLen   = 180;
  const arrowD     = usePathDraw(frame, 28, arrowLen, 20);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s17.from);

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
            BOOKING ENGINE · SINGLE INTERFACE
          </text>
        </g>

        {/* ── ZONE B ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${heroA.translateY})`} opacity={heroA.opacity}>
          <text x={540} y={300} textAnchor="middle"
            fontFamily={FONT} fontSize={68} fontWeight={800}
            fill={COLORS.white}>
            The Booking Officer
          </text>
        </g>
        <g transform={`translate(0, ${heroB.translateY})`} opacity={heroB.opacity}>
          <text x={540} y={400} textAnchor="middle"
            fontFamily={FONT} fontSize={56} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Always Calls calculateFare
          </text>
        </g>

        {/* ── Booking desk illustration ──────────────────────────────────── */}
        <g opacity={deskEnt.opacity} transform={`translate(0, ${deskEnt.translateY})`}>
          {/* Desk surface */}
          <rect x={120} y={640} width={400} height={20} rx={4}
            fill={COLORS.accent} fillOpacity={0.25} />
          {/* Desk front */}
          <rect x={140} y={660} width={360} height={180} rx={8}
            fill={COLORS.bg_secondary}
            stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          {/* Desk legs */}
          <rect x={160} y={840} width={16} height={60} rx={4}
            fill={COLORS.text_muted} opacity={0.3} />
          <rect x={460} y={840} width={16} height={60} rx={4}
            fill={COLORS.text_muted} opacity={0.3} />
          {/* Window/pane */}
          <rect x={210} y={680} width={220} height={100} rx={6}
            fill="rgba(255,255,255,0.04)" stroke={COLORS.accent} strokeWidth={1.5} />
          {/* Counter text */}
          <text x={320} y={740} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} opacity={0.7}>
            TICKET
          </text>
        </g>

        {/* ── Officer silhouette ─────────────────────────────────────────── */}
        <g opacity={officerEnt.opacity} transform={`translate(320, ${560 + officerEnt.translateY})`}>
          {/* Head */}
          <circle cx={0} cy={0} r={32}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Eyes */}
          <circle cx={-10} cy={-4} r={4} fill={COLORS.accent} />
          <circle cx={10} cy={-4} r={4} fill={COLORS.accent} />
          {/* Body */}
          <path d="M -20,32 L -30,80 L 30,80 L 20,32"
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={1.5} />
          {/* Arm reaching */}
          <path d="M 20,50 C 40,45 60,50 70,42"
            fill="none" stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round" />
        </g>

        {/* ── Speech bubble ──────────────────────────────────────────────── */}
        <g opacity={speechEnt.opacity} transform={`translate(0, ${speechEnt.translateY})`}>
          <rect x={440} y={500} width={540} height={80} rx={16}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Tail */}
          <path d="M 460,580 L 400,600 L 470,585"
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={60} strokeDashoffset={speechTail}
            strokeLinecap="round" />
          <text x={710} y={550} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.white}>
            calculateFare(...)
          </text>
        </g>

        {/* ── Arrow from officer to method ────────────────────────────────── */}
        <line x1={540} y1={620} x2={540} y2={720}
          stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={arrowLen} strokeDashoffset={arrowD}
          markerEnd="url(#arrow)"
          opacity={arrowEnt.opacity * 0.7} />

        {/* ── Method routing card ─────────────────────────────────────────── */}
        <g opacity={methodCard.opacity} transform={`translate(0, ${methodCard.translateY})`}>
          <BentoCard x={560} y={680} w={460} h={280} accent />
          <text x={790} y={740} textAnchor="middle"
            fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            ONE METHOD NAME
          </text>

          {/* Three versions stacked */}
          {['(route)', '(route, class)', '(route, class, peak)'].map((sig, i) => {
            const rowY = 770 + i * 60;
            return (
              <g key={i}>
                <rect x={590} y={rowY} width={400} height={48} rx={10}
                  fill={COLORS.accent} fillOpacity={i === 0 ? 0.12 : 0.06}
                  stroke={i === 0 ? COLORS.accent : 'rgba(255,255,255,0.08)'}
                  strokeWidth={i === 0 ? 1.5 : 0.5} />
                <text x={790} y={rowY + 32} textAnchor="middle"
                  fontFamily={FONT} fontSize={24} fontWeight={800}
                  fill={i === 0 ? COLORS.accent : COLORS.text_muted}>
                  {sig}
                </text>
              </g>
            );
          })}
        </g>

        {/* ── "Always the same call" card ─────────────────────────────────── */}
        <g opacity={routeCard.opacity} transform={`translate(0, ${routeCard.translateY})`}>
          <BentoCard x={60} y={980} w={960} h={120} />
          <rect x={60} y={980} width={6} height={120} rx={3} fill={COLORS.accent} />
          <text x={540} y={1050} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>
            One interface — <tspan fill={COLORS.accent} fontStyle="italic">calculateFare()</tspan>
          </text>
        </g>

        {/* ── Two info cards ─────────────────────────────────────────────── */}
        <g opacity={callCard.opacity} transform={`translate(0, ${callCard.translateY})`}>
          <BentoCard x={60} y={1140} w={460} h={160} />
          <text x={80} y={1200}
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.white}>
            Caller never changes
          </text>
          <text x={80} y={1244}
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>
            Same method name every time
          </text>
        </g>
        <g opacity={callCard.opacity} transform={`translate(0, ${callCard.translateY})`}>
          <BentoCard x={560} y={1140} w={460} h={160} accent />
          <text x={580} y={1200}
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>
            Compiler routes it
          </text>
          <text x={580} y={1244}
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>
            Right method selected automatically
          </text>
        </g>

        {/* ── Bottom note ────────────────────────────────────────────────── */}
        <g opacity={noteEnt.opacity} transform={`translate(0, ${noteEnt.translateY})`}>
          <BentoCard x={60} y={1360} w={960} h={120} />
          <text x={540} y={1435} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>
            The officer doesn't pick the method — the <tspan fill={COLORS.accent}>signature</tspan> does
          </text>
        </g>

        {/* ── Floating micro-anim ────────────────────────────────────────── */}
        <g transform={`translate(120, ${1560 + breathe})`} opacity={0.1}>
          <circle cx={0} cy={0} r={12} fill={COLORS.accent}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} />
        </g>
        <g transform={`translate(960, ${1580 + breathe * 0.7})`} opacity={shimmer * 0.1}>
          <circle cx={0} cy={0} r={8} fill={COLORS.accent} />
        </g>

        {/* ── Train wheels decorative ────────────────────────────────────── */}
        <g opacity={noteEnt.opacity * 0.15}>
          <circle cx={200} cy={1680} r={30} fill="none"
            stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={200} cy={1680} r={8} fill={COLORS.accent} />
          <circle cx={340} cy={1680} r={30} fill="none"
            stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={340} cy={1680} r={8} fill={COLORS.accent} />
          <line x1={230} y1={1680} x2={310} y2={1680}
            stroke={COLORS.accent} strokeWidth={2} opacity={0.5} />
        </g>

        {/* ── Corner ─────────────────────────────────────────────────────── */}
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
            sceneDuration={SCENE_TIMING.s17.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
