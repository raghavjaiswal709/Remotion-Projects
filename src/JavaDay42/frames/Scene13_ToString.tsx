/**
 * Scene 13 — toString
 * "toString converts the object to a readable string."
 * CSV: 51.540s → 56.340s
 * Duration: 143 frames (4.77s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20):   Label + headline
 *   Phase 2 (frames 14–70):  Object → toString() → "Express 42" flow diagram
 *   Phase 3 (frames 60–end): String output pulse, micro floaters
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

export const Scene13_ToString: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headA    = useSpringEntrance(frame, 4);
  const headB    = useSpringEntrance(frame, 10);

  // ── Phase 2 — flow ─────────────────────────────────────────────────────────
  const objBox    = useSpringEntrance(frame, 14);
  const arrowEnt1 = usePathDraw(frame, 20, 140, 18);
  const methodBox = useSpringEntrance(frame, 24);
  const arrowEnt2 = usePathDraw(frame, 32, 140, 18);
  const resultBox = useSpringEntrance(frame, 36);

  // ── Code card ──────────────────────────────────────────────────────────────
  const codeEnt = useSpringEntrance(frame, 44);

  // ── Bottom card ────────────────────────────────────────────────────────────
  const bottomEnt = useSpringEntrance(frame, 52);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Typewriter on output string
  const outputText = '"Express 42"';
  const charsVisible = Math.floor(interpolate(frame, [38, 58], [0, outputText.length], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  }));

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s13.from);

  const flowY = 620;

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="OBJECT · toString()" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={280} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            toString()
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent}>
            Object → Readable String
          </text>
        </g>

        {/* ── FLOW DIAGRAM ────────────────────────────────────────────── */}
        {/* Step 1: Object node */}
        <g opacity={objBox.opacity} transform={`translate(0, ${objBox.translateY})`}>
          <BentoCard x={60} y={flowY - 50} w={260} h={100} accent />
          {/* Train mini icon */}
          <rect x={80} y={flowY - 15} width={60} height={30} rx={6}
            fill={COLORS.accent} fillOpacity={0.2} stroke={COLORS.accent} strokeWidth={1} />
          <circle cx={95} cy={flowY + 20} r={6} fill="none" stroke={COLORS.accent} strokeWidth={1} />
          <circle cx={125} cy={flowY + 20} r={6} fill="none" stroke={COLORS.accent} strokeWidth={1} />
          <text x={155} y={flowY + 10} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.white}>Train</text>
        </g>

        {/* Arrow 1 */}
        <path d="M 320,620 L 390,620" fill="none"
          stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={140} strokeDashoffset={arrowEnt1}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* Step 2: Method node */}
        <g opacity={methodBox.opacity} transform={`translate(0, ${methodBox.translateY})`}>
          <rect x={400} y={flowY - 50} width={260} height={100} rx={20}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          <text x={530} y={flowY + 12} textAnchor="middle"
            fontFamily={MONO} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            .toString()
          </text>
        </g>

        {/* Arrow 2 */}
        <path d="M 660,620 L 730,620" fill="none"
          stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={140} strokeDashoffset={arrowEnt2}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* Step 3: Result node */}
        <g opacity={resultBox.opacity} transform={`translate(0, ${resultBox.translateY})`}>
          <rect x={740} y={flowY - 50} width={270} height={100} rx={20}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2.5} />
          <text x={875} y={flowY + 12} textAnchor="middle"
            fontFamily={MONO} fontSize={26} fontWeight={800} fill={COLORS.accent}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '875px 620px' }}>
            {outputText.slice(0, charsVisible)}
          </text>
        </g>

        {/* ── Code example card ───────────────────────────────────────── */}
        <g opacity={codeEnt.opacity} transform={`translate(0, ${codeEnt.translateY})`}>
          <BentoCard x={60} y={780} w={960} h={340} />
          <rect x={60} y={780} width={6} height={340} rx={3} fill={COLORS.accent} />
          <text x={80} y={825} fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.1em">OVERRIDE EXAMPLE</text>

          <text x={100} y={880} fontFamily={MONO} fontSize={26} fontWeight={500} fill={COLORS.accent}>
            @Override
          </text>
          <text x={100} y={920} fontFamily={MONO} fontSize={26} fontWeight={500} fill={COLORS.text_muted}>
            public String toString() {'{'}
          </text>
          <text x={140} y={960} fontFamily={MONO} fontSize={26} fontWeight={500} fill={COLORS.white}>
            return name + " " + number;
          </text>
          <text x={100} y={1000} fontFamily={MONO} fontSize={26} fontWeight={500} fill={COLORS.text_muted}>
            {'}'}
          </text>

          {/* Output preview */}
          <rect x={100} y={1030} width={400} height={50} rx={10}
            fill={COLORS.accent} fillOpacity={0.1} />
          <text x={120} y={1063} fontFamily={MONO} fontSize={24} fontWeight={800} fill={COLORS.accent}>
            → "Express 42"
          </text>
        </g>

        {/* ── Bottom card ─────────────────────────────────────────────── */}
        <g opacity={bottomEnt.opacity} transform={`translate(0, ${bottomEnt.translateY})`}>
          <BentoCard x={60} y={1180} w={960} h={140} />
          <text x={100} y={1260} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Without override: returns{' '}
            <tspan fill={COLORS.text_muted} fontFamily={MONO} fontSize={30}>Train@4a3b2c</tspan>
          </text>
        </g>

        {/* ── Floaters ────────────────────────────────────────────────── */}
        <circle cx={50} cy={1450 + breathe} r={3} fill={COLORS.accent} fillOpacity={0.18 * shimmer} />
        <circle cx={1030} cy={1400 - breathe * 0.5} r={2.5} fill={COLORS.accent} fillOpacity={0.14} />

        {/* ── CAPTION ─────────────────────────────────────────────────── */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s13.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
