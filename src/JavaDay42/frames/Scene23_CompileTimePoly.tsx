/**
 * Scene 23 — Compile Time Polymorphism
 * "That is compile time polymorphism."
 * CSV: 102.380s → 105.260s
 * Duration: 86 frames (2.87s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–14): Label + headline
 *   Phase 2 (frames 10–50): Definition card, overload grid, compiler check
 *   Phase 3 (frames 40–end): Micro-animations
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

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, dur = 24) {
  const p = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - p);
}

export const Scene23_CompileTimePoly: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headA    = useSpringEntrance(frame, 3);
  const headB    = useSpringEntrance(frame, 7);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  // Definition card
  const defEnt = useSpringEntrance(frame, 12);

  // Two overload examples
  const overloads = [
    { sig: 'book(int seatNo)', desc: '1 parameter' },
    { sig: 'book(int seat, String coach)', desc: '2 parameters' },
  ];
  const olEnts = overloads.map((_, i) => useSpringEntrance(frame, 18 + i * 8));

  // Compiler badge
  const compEnt = useSpringEntrance(frame, 34);
  const compArrow = usePathDraw(frame, 36, 100, 16);

  // Key fact card
  const factEnt = useSpringEntrance(frame, 42);

  // Bottom card
  const btmEnt = useSpringEntrance(frame, 48);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s23.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="POLYMORPHISM · COMPILE-TIME" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={270} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Compile-Time
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={370} fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Polymorphism
          </text>
        </g>

        {/* ── Definition card ──────────────────────────────────────────── */}
        <g opacity={defEnt.opacity} transform={`translate(0, ${defEnt.translateY})`}>
          <BentoCard x={60} y={440} w={960} h={140} accent />
          <rect x={60} y={440} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={100} y={490} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            Method Overloading
          </text>
          <text x={100} y={540} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Same method name, different parameter lists
          </text>
        </g>

        {/* ── Two overload cards ───────────────────────────────────────── */}
        {overloads.map((ol, i) => {
          const cardY = 620 + i * 180;
          return (
            <g key={i} opacity={olEnts[i].opacity}
              transform={`translate(0, ${olEnts[i].translateY})`}>
              <BentoCard x={60} y={cardY} w={620} h={150} />
              <text x={100} y={cardY + 50} fontFamily={MONO} fontSize={26} fontWeight={800}
                fill={COLORS.white}>{ol.sig}</text>
              <text x={100} y={cardY + 100} fontFamily={FONT} fontSize={24} fontWeight={800}
                fill={COLORS.text_muted}>{ol.desc}</text>
              {/* Check */}
              <g transform={`translate(620, ${cardY + 56})`}>
                <circle cx={0} cy={0} r={16} fill={COLORS.accent} fillOpacity={0.12} />
                <path d="M -6,0 L -2,5 L 7,-5" fill="none" stroke={COLORS.accent}
                  strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </g>
          );
        })}

        {/* ── Compiler badge ───────────────────────────────────────────── */}
        <g opacity={compEnt.opacity} transform={`translate(0, ${compEnt.translateY})`}>
          <BentoCard x={720} y={620} w={300} h={330} accent />
          {/* Gear icon */}
          <circle cx={870} cy={710} r={40} fill={COLORS.accent} fillOpacity={0.08}
            transform={`scale(${pulse})`} style={{ transformOrigin: '870px 710px' }} />
          <circle cx={870} cy={710} r={28} fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
          <circle cx={870} cy={710} r={10} fill={COLORS.accent} fillOpacity={0.3} />
          {/* Teeth */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
            <line key={angle}
              x1={870 + 28 * Math.cos(angle * Math.PI / 180)}
              y1={710 + 28 * Math.sin(angle * Math.PI / 180)}
              x2={870 + 40 * Math.cos(angle * Math.PI / 180)}
              y2={710 + 40 * Math.sin(angle * Math.PI / 180)}
              stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" />
          ))}
          <text x={870} y={790} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>javac</text>
          <text x={870} y={830} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
            Decides at
          </text>
          <text x={870} y={862} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
            compile time
          </text>
          {/* Arrow from overloads to compiler */}
          <line x1={680} y1={745} x2={720} y2={745}
            stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={100} strokeDashoffset={compArrow}
            markerEnd="url(#arrow)" strokeLinecap="round" />
        </g>

        {/* ── Key fact ─────────────────────────────────────────────────── */}
        <g opacity={factEnt.opacity} transform={`translate(0, ${factEnt.translateY})`}>
          <BentoCard x={60} y={1010} w={960} h={160} />
          <rect x={60} y={1010} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={100} y={1060} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>Also called: Static Polymorphism</text>
          <text x={100} y={1110} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.white}>The compiler resolves which method to invoke</text>
          <text x={100} y={1150} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>Based on argument count and types — no ambiguity at runtime</text>
        </g>

        {/* ── Bottom card ──────────────────────────────────────────────── */}
        <g opacity={btmEnt.opacity} transform={`translate(0, ${btmEnt.translateY})`}>
          <BentoCard x={60} y={1210} w={960} h={120} accent />
          <text x={100} y={1282} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Tomorrow: runtime polymorphism (method overriding)
          </text>
        </g>

        {/* ── Floaters ────────────────────────────────────────────────── */}
        <circle cx={100} cy={1460 + breathe} r={3} fill={COLORS.accent} fillOpacity={0.12 * shimmer} />
        <circle cx={980} cy={1500 - breathe} r={2.5} fill={COLORS.accent} fillOpacity={0.08} />

        {/* ── CAPTION ─────────────────────────────────────────────────── */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s23.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
