/**
 * Scene 11 — Auto Insertion
 * "Java inserts this relationship automatically. You cannot opt out."
 * CSV: 40.200s → 45.540s
 * Duration: 157 frames (5.23s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20):   Label + headline
 *   Phase 2 (frames 14–70):  Compiler flow: Source → Compiler gear → Bytecode with auto "extends"
 *   Phase 3 (frames 60–end): Gear rotation, pulse, warning badge
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

// Simple gear path (8-tooth)
function gearPath(cx: number, cy: number, outerR: number, innerR: number, teeth: number) {
  const pts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const aOuter = (i / teeth) * Math.PI * 2 - Math.PI / 2;
    const aMid   = ((i + 0.35) / teeth) * Math.PI * 2 - Math.PI / 2;
    const aMid2  = ((i + 0.65) / teeth) * Math.PI * 2 - Math.PI / 2;
    const aInner = ((i + 1) / teeth) * Math.PI * 2 - Math.PI / 2;
    const ox = cx + Math.cos(aOuter) * outerR;
    const oy = cy + Math.sin(aOuter) * outerR;
    const m1x = cx + Math.cos(aMid) * outerR;
    const m1y = cy + Math.sin(aMid) * outerR;
    const m2x = cx + Math.cos(aMid2) * innerR;
    const m2y = cy + Math.sin(aMid2) * innerR;
    const ix = cx + Math.cos(aInner) * innerR;
    const iy = cy + Math.sin(aInner) * innerR;
    if (i === 0) pts.push(`M ${ox},${oy}`);
    else pts.push(`L ${ox},${oy}`);
    pts.push(`L ${m1x},${m1y}`);
    pts.push(`L ${m2x},${m2y}`);
    pts.push(`L ${ix},${iy}`);
  }
  pts.push('Z');
  return pts.join(' ');
}

export const Scene11_AutoInsertion: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headA    = useSpringEntrance(frame, 4);
  const headB    = useSpringEntrance(frame, 10);

  // ── Phase 2 — compiler flow ────────────────────────────────────────────────
  const srcCard    = useSpringEntrance(frame, 14);
  const gearEnt    = useSpringEntrance(frame, 24);
  const outputCard = useSpringEntrance(frame, 34);
  const arrowLen   = 120;
  const arrow1Dash = usePathDraw(frame, 20, arrowLen, 18);
  const arrow2Dash = usePathDraw(frame, 30, arrowLen, 18);

  // ── Warning badge ──────────────────────────────────────────────────────────
  const warnEnt = useSpringEntrance(frame, 50);

  // ── Bottom card ────────────────────────────────────────────────────────────
  const bottomEnt = useSpringEntrance(frame, 56);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const gearAngle = frame * 1.5;
  const breathe   = Math.sin(frame * 0.06) * 4;
  const pulse     = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer   = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s11.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="COMPILER · AUTO INSERTION" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={280} fontFamily={FONT} fontSize={68} fontWeight={800} fill={COLORS.white}>
            Automatic
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={68} fontWeight={800} fill={COLORS.accent}>
            Inheritance
          </text>
        </g>

        {/* ── SOURCE CODE CARD ────────────────────────────────────────── */}
        <g opacity={srcCard.opacity} transform={`translate(0, ${srcCard.translateY})`}>
          <BentoCard x={60} y={480} w={360} h={340} />
          <text x={80} y={525} fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.1em">YOUR CODE</text>
          <text x={100} y={580} fontFamily={MONO} fontSize={28} fontWeight={500} fill={COLORS.text_muted}>
            class Train {'{'}{' '}
          </text>
          <text x={120} y={620} fontFamily={MONO} fontSize={26} fontWeight={500} fill={COLORS.white}>
            String name;
          </text>
          <text x={120} y={660} fontFamily={MONO} fontSize={26} fontWeight={500} fill={COLORS.white}>
            int speed;
          </text>
          <text x={100} y={700} fontFamily={MONO} fontSize={28} fontWeight={500} fill={COLORS.text_muted}>
            {'}'}
          </text>
          {/* No "extends" visible */}
          <text x={240} y={770} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted} fontStyle="italic">no extends keyword</text>
        </g>

        {/* ── Arrow 1: Source → Gear ──────────────────────────────────── */}
        <path d="M 420,650 L 460,650" fill="none"
          stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={arrowLen} strokeDashoffset={arrow1Dash}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* ── COMPILER GEAR ───────────────────────────────────────────── */}
        <g opacity={gearEnt.opacity} transform={`translate(0, ${gearEnt.translateY})`}>
          <circle cx={540} cy={650} r={80} fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2} />
          <g transform={`rotate(${gearAngle}, 540, 650)`}>
            <path d={gearPath(540, 650, 65, 48, 8)} fill="none"
              stroke={COLORS.accent} strokeWidth={2} />
          </g>
          <circle cx={540} cy={650} r={16} fill={COLORS.accent} fillOpacity={0.3} />
          <text x={540} y={658} textAnchor="middle" fontFamily={FONT}
            fontSize={18} fontWeight={800} fill={COLORS.accent}>javac</text>
        </g>

        {/* ── Arrow 2: Gear → Output ──────────────────────────────────── */}
        <path d="M 620,650 L 660,650" fill="none"
          stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={arrowLen} strokeDashoffset={arrow2Dash}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* ── OUTPUT CARD ─────────────────────────────────────────────── */}
        <g opacity={outputCard.opacity} transform={`translate(0, ${outputCard.translateY})`}>
          <BentoCard x={660} y={480} w={360} h={340} accent />
          <text x={680} y={525} fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">BYTECODE</text>
          <text x={700} y={580} fontFamily={MONO} fontSize={26} fontWeight={500} fill={COLORS.text_muted}>
            class Train
          </text>
          <text x={700} y={620} fontFamily={MONO} fontSize={26} fontWeight={500} fill={COLORS.accent}>
            extends Object {'{'}{' '}
          </text>
          <text x={720} y={660} fontFamily={MONO} fontSize={24} fontWeight={500} fill={COLORS.white}>
            String name;
          </text>
          <text x={720} y={700} fontFamily={MONO} fontSize={24} fontWeight={500} fill={COLORS.white}>
            int speed;
          </text>
          <text x={700} y={740} fontFamily={MONO} fontSize={26} fontWeight={500} fill={COLORS.text_muted}>
            {'}'}
          </text>
          <text x={840} y={788} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">auto-inserted!</text>
        </g>

        {/* ── Warning badge ───────────────────────────────────────────── */}
        <g opacity={warnEnt.opacity} transform={`translate(0, ${warnEnt.translateY})`}>
          <BentoCard x={60} y={880} w={960} h={160} accent />
          <rect x={60} y={880} width={6} height={160} rx={3} fill={COLORS.accent} />

          {/* Warning triangle */}
          <polygon points="120,940 100,970 140,970"
            fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <text x={120} y={966} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.accent}>!</text>

          <text x={170} y={945} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            You cannot opt out
          </text>
          <text x={170} y={1000} fontFamily={FONT} fontSize={30} fontWeight={800} fill={COLORS.text_muted}>
            Every class extends Object — no exceptions
          </text>
        </g>

        {/* ── Bottom explanation card ─────────────────────────────────── */}
        <g opacity={bottomEnt.opacity} transform={`translate(0, ${bottomEnt.translateY})`}>
          <BentoCard x={60} y={1100} w={960} h={200} />
          <text x={100} y={1175} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Java guarantees every object has the
          </text>
          <text x={100} y={1225} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            same foundational methods from{' '}
            <tspan fill={COLORS.accent} fontStyle="italic">Object</tspan>
          </text>
          <text x={100} y={1270} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            toString(), equals(), hashCode()
          </text>
        </g>

        {/* ── Floaters ────────────────────────────────────────────────── */}
        <circle cx={50} cy={1450 + breathe} r={3} fill={COLORS.accent} fillOpacity={0.18 * shimmer} />
        <circle cx={1030} cy={1380 - breathe * 0.6} r={2.5} fill={COLORS.accent} fillOpacity={0.14} />
        <circle cx={540} cy={1600 + breathe * 0.4} r={4} fill={COLORS.accent} fillOpacity={0.1} />

        {/* ── CAPTION ─────────────────────────────────────────────────── */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s11.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
