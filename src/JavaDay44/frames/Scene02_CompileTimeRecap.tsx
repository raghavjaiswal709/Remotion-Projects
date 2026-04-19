/**
 * Scene 02 — Compile-Time Polymorphism Recap
 * "Last day, we learned how compile-time polymorphism lets the system resolve method calls before the program ever runs."
 * CSV: 5.820s → 12.960s
 * Duration: 237 frames (7.90s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–30): Label + headline spring in
 *   Phase 2 (frames 20–90): Compiler flow diagram builds — source code → compiler → resolved call
 *   Phase 3 (frames 80–end): Pulse on compiler node, connector breathing
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
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 } as const;
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

export const Scene02_CompileTimeRecap: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA     = useSpringEntrance(frame, 6);
  const headlineB     = useSpringEntrance(frame, 12);

  // ── Phase 2: Flow diagram ──────────────────────────────────────────────────
  const sourceNode  = useSpringEntrance(frame, 22);
  const compilerNode = useSpringEntrance(frame, 34);
  const resolvedNode = useSpringEntrance(frame, 46);
  const arrow1Draw  = usePathDraw(frame, 36, 200, 25);
  const arrow2Draw  = usePathDraw(frame, 50, 200, 25);

  // ── Cards ──────────────────────────────────────────────────────────────────
  const recapCard   = useSpringEntrance(frame, 58);
  const detailCard  = useSpringEntrance(frame, 68);

  // ── Phase 3: Micro-animations ─────────────────────────────────────────────
  const breathe     = Math.sin(frame * 0.06) * 4;
  const pulse       = 1 + Math.sin(frame * 0.08) * 0.02;
  const shimmer     = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const gearRotation = frame * 2;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s02.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A — Section label ─────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <text x={60} y={160}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.15em" opacity={0.8}>
            MODULE 3 · TICKETING ENGINE
          </text>
        </g>

        {/* ── ZONE B — Headline ──────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={290}
            fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.white}>
            Compile-Time
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={390}
            fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.accent}>
            Polymorphism
          </text>
          <text x={60} y={450}
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.text_muted}>
            YESTERDAY&apos;S FOUNDATION
          </text>
        </g>

        {/* ── ZONE C — Flow diagram: Source → Compiler → Resolved ────────── */}

        {/* Source code node */}
        <g opacity={sourceNode.opacity} transform={`translate(0, ${sourceNode.translateY})`}>
          <BentoCard x={100} y={540} w={260} h={200} />
          {/* Code file icon */}
          <rect x={175} y={580} width={100} height={120} rx={8}
            fill="none" stroke={COLORS.text_muted} strokeWidth={2} />
          <rect x={175} y={580} width={100} height={30} rx={8}
            fill={COLORS.accent} fillOpacity={0.15} />
          <line x1={195} y1={625} x2={255} y2={625}
            stroke={COLORS.text_muted} strokeWidth={2} opacity={0.5} />
          <line x1={195} y1={645} x2={245} y2={645}
            stroke={COLORS.accent} strokeWidth={2} opacity={0.6} />
          <line x1={195} y1={665} x2={260} y2={665}
            stroke={COLORS.text_muted} strokeWidth={2} opacity={0.4} />
          <line x1={195} y1={685} x2={235} y2={685}
            stroke={COLORS.text_muted} strokeWidth={2} opacity={0.3} />
          <text x={230} y={770} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.white}>
            SOURCE
          </text>
        </g>

        {/* Arrow 1: Source → Compiler */}
        <path d="M 360,640 L 430,640"
          fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={200} strokeDashoffset={arrow1Draw}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        {/* Compiler node — large gear */}
        <g opacity={compilerNode.opacity} transform={`translate(0, ${compilerNode.translateY})`}>
          <BentoCard x={430} y={540} w={260} h={200} accent />
          {/* Gear illustration */}
          <g transform={`translate(560, 630) rotate(${gearRotation})`}>
            {Array.from({ length: 8 }, (_, i) => {
              const angle = (i * 45) * Math.PI / 180;
              const innerR = 30;
              const outerR = 48;
              return (
                <rect key={i}
                  x={-8} y={-outerR}
                  width={16} height={outerR - innerR + 8}
                  rx={4}
                  fill={COLORS.accent} fillOpacity={0.5}
                  transform={`rotate(${i * 45})`}
                  style={{ transformOrigin: '0px 0px' }}
                />
              );
            })}
            <circle cx={0} cy={0} r={30}
              fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2.5} />
            <circle cx={0} cy={0} r={10}
              fill={COLORS.accent} fillOpacity={0.6} />
          </g>
          <text x={560} y={770} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>
            COMPILER
          </text>
        </g>

        {/* Arrow 2: Compiler → Resolved */}
        <path d="M 690,640 L 760,640"
          fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={200} strokeDashoffset={arrow2Draw}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        {/* Resolved call node */}
        <g opacity={resolvedNode.opacity} transform={`translate(0, ${resolvedNode.translateY})`}>
          <BentoCard x={760} y={540} w={260} h={200} />
          {/* Checkmark */}
          <circle cx={890} cy={620} r={36}
            fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={2.5}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '890px 620px' }} />
          <path d="M 870,620 L 883,636 L 912,604"
            fill="none" stroke={COLORS.accent} strokeWidth={4}
            strokeLinecap="round" strokeLinejoin="round" />
          <text x={890} y={770} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.white}>
            RESOLVED
          </text>
        </g>

        {/* ── Recap card ─────────────────────────────────────────────────── */}
        <g opacity={recapCard.opacity} transform={`translate(0, ${recapCard.translateY})`}>
          <BentoCard x={60} y={830} w={960} h={180} />
          <rect x={60} y={830} width={6} height={180} rx={3} fill={COLORS.accent} />
          <text x={100} y={900}
            fontFamily={FONT} fontSize={38} fontWeight={800}
            fill={COLORS.white}>
            Method calls resolved
          </text>
          <text x={100} y={955}
            fontFamily={FONT} fontSize={38} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            before the program ever runs
          </text>
        </g>

        {/* ── Detail card ────────────────────────────────────────────────── */}
        <g opacity={detailCard.opacity} transform={`translate(0, ${detailCard.translateY})`}>
          <BentoCard x={60} y={1050} w={460} h={240} />
          <text x={100} y={1120}
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>
            APPROACH
          </text>
          <text x={100} y={1170}
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.white}>
            Static Dispatch
          </text>
          <text x={100} y={1225}
            fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.accent}>
            Compile-time binding
          </text>

          <BentoCard x={560} y={1050} w={460} h={240} accent />
          <text x={600} y={1120}
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>
            TODAY
          </text>
          <text x={600} y={1170}
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.accent}>
            Method Overloading
          </text>
          <text x={600} y={1225}
            fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.white}>
            Same name, diff params
          </text>
        </g>

        {/* ── Floating accents ───────────────────────────────────────────── */}
        <g transform={`translate(540, ${1430 + breathe})`}>
          <circle cx={0} cy={0} r={32}
            fill={COLORS.accent} fillOpacity={0.05 * shimmer} />
          <circle cx={0} cy={0} r={32}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} />
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s02.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
