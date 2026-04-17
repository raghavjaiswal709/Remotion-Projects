/**
 * Scene 15 — equals
 * "equals compares two objects by their actual field values."
 * CSV: 59.560s → 66.680s
 * Duration: 213 frames (7.1s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20):   Label + headline spring
 *   Phase 2 (frames 14–90):  Two ticket objects side-by-side, field comparison, verdict badge
 *   Phase 3 (frames 80–end): Checkmark pulse, floaters
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
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene15_Equals: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headA    = useSpringEntrance(frame, 4);
  const headB    = useSpringEntrance(frame, 10);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const leftCard  = useSpringEntrance(frame, 14);
  const rightCard = useSpringEntrance(frame, 22);

  const fields = [
    { label: 'name', left: '"Express"', right: '"Express"', match: true },
    { label: 'number', left: '42', right: '42', match: true },
    { label: 'platform', left: '3', right: '3', match: true },
  ];

  const fieldEnts = fields.map((_, i) => useSpringEntrance(frame, 34 + i * 10));
  const connectors = fields.map((_, i) => usePathDraw(frame, 40 + i * 10, 40, 16));

  const verdictEnt = useSpringEntrance(frame, 70);
  const verdictScale = spring({ frame: Math.max(0, frame - 72), fps, config: SPRING_SNAP });

  // Code card
  const codeEnt = useSpringEntrance(frame, 80);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s15.from);

  const LX = 60, RX = 560, CW = 460, CH = 420;
  const cardY = 480;

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="OBJECT · equals()" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={280} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            equals()
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={370} fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.accent}>
            Field-by-field comparison
          </text>
        </g>

        {/* ── Left card: ticketA ──────────────────────────────────────── */}
        <g opacity={leftCard.opacity} transform={`translate(0, ${leftCard.translateY})`}>
          <BentoCard x={LX} y={cardY} w={CW} h={CH} />
          <text x={LX + 20} y={cardY + 45} fontFamily={MONO} fontSize={22} fontWeight={800}
            fill={COLORS.accent}>ticketA</text>
          {/* Mini ticket icon */}
          <rect x={LX + 340} y={cardY + 18} width={80} height={30} rx={8}
            fill="none" stroke={COLORS.accent} strokeWidth={1} strokeDasharray="4 3" />
        </g>

        {/* ── Right card: ticketB ─────────────────────────────────────── */}
        <g opacity={rightCard.opacity} transform={`translate(0, ${rightCard.translateY})`}>
          <BentoCard x={RX} y={cardY} w={CW} h={CH} />
          <text x={RX + 20} y={cardY + 45} fontFamily={MONO} fontSize={22} fontWeight={800}
            fill={COLORS.accent}>ticketB</text>
          <rect x={RX + 340} y={cardY + 18} width={80} height={30} rx={8}
            fill="none" stroke={COLORS.accent} strokeWidth={1} strokeDasharray="4 3" />
        </g>

        {/* ── Field rows ──────────────────────────────────────────────── */}
        {fields.map((f, i) => {
          const rowY = cardY + 90 + i * 100;
          return (
            <g key={i} opacity={fieldEnts[i].opacity} transform={`translate(0, ${fieldEnts[i].translateY})`}>
              {/* Left value */}
              <text x={LX + 30} y={rowY + 20} fontFamily={FONT} fontSize={24} fontWeight={800}
                fill={COLORS.text_muted}>{f.label}</text>
              <text x={LX + 30} y={rowY + 60} fontFamily={MONO} fontSize={28} fontWeight={800}
                fill={COLORS.white}>{f.left}</text>
              {/* Right value */}
              <text x={RX + 30} y={rowY + 20} fontFamily={FONT} fontSize={24} fontWeight={800}
                fill={COLORS.text_muted}>{f.label}</text>
              <text x={RX + 30} y={rowY + 60} fontFamily={MONO} fontSize={28} fontWeight={800}
                fill={COLORS.white}>{f.right}</text>
              {/* Connector line between cards */}
              <line x1={LX + CW - 20} y1={rowY + 40} x2={RX + 20} y2={rowY + 40}
                stroke={COLORS.accent} strokeWidth={2}
                strokeDasharray={40} strokeDashoffset={connectors[i]}
                strokeLinecap="round" />
              {/* Match checkmark */}
              {f.match && (
                <g opacity={fieldEnts[i].opacity}>
                  <circle cx={540} cy={rowY + 40} r={14}
                    fill={COLORS.accent} fillOpacity={0.15} />
                  <path d={`M ${540 - 6},${rowY + 40} l 4,5 8,-10`}
                    fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
                </g>
              )}
            </g>
          );
        })}

        {/* ── Verdict badge ───────────────────────────────────────────── */}
        <g opacity={verdictEnt.opacity}
          transform={`translate(540, ${cardY + CH + 50}) scale(${verdictScale})`}
          style={{ transformOrigin: '0px 0px' }}>
          <rect x={-160} y={-30} width={320} height={60} rx={30}
            fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={0} y={10} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            equals → true
          </text>
        </g>

        {/* ── Code card ───────────────────────────────────────────────── */}
        <g opacity={codeEnt.opacity} transform={`translate(0, ${codeEnt.translateY})`}>
          <BentoCard x={60} y={1030} w={960} h={280} />
          <rect x={60} y={1030} width={6} height={280} rx={3} fill={COLORS.accent} />
          <text x={80} y={1070} fontFamily={FONT} fontSize={20} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.1em">OVERRIDE</text>

          <text x={100} y={1115} fontFamily={MONO} fontSize={24} fontWeight={500} fill={COLORS.accent}>
            @Override
          </text>
          <text x={100} y={1150} fontFamily={MONO} fontSize={24} fontWeight={500} fill={COLORS.text_muted}>
            public boolean equals(Object o) {'{'}
          </text>
          <text x={140} y={1185} fontFamily={MONO} fontSize={24} fontWeight={500} fill={COLORS.white}>
            Ticket t = (Ticket) o;
          </text>
          <text x={140} y={1220} fontFamily={MONO} fontSize={24} fontWeight={500} fill={COLORS.white}>
            return name.equals(t.name)
          </text>
          <text x={180} y={1255} fontFamily={MONO} fontSize={24} fontWeight={500} fill={COLORS.white}>
            && number == t.number;
          </text>
          <text x={100} y={1290} fontFamily={MONO} fontSize={24} fontWeight={500} fill={COLORS.text_muted}>
            {'}'}
          </text>
        </g>

        {/* ── Floaters ────────────────────────────────────────────────── */}
        <circle cx={90} cy={1450 + breathe} r={3} fill={COLORS.accent} fillOpacity={0.16 * shimmer} />
        <circle cx={990} cy={1500 - breathe} r={2.5} fill={COLORS.accent} fillOpacity={0.12} />

        {/* ── CAPTION ─────────────────────────────────────────────────── */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s15.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
