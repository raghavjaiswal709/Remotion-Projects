/**
 * Scene05_BaseClass — Day 34
 * "The base Train class has a method called getEngine that returns an Engine object."
 * CSV: 16.74s → 23.06s
 * Duration: 208 frames (6.93s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):  Label + headline spring entrance
 *   Phase 2 (frames 20–90): Code block builds line-by-line, class diagram draws
 *   Phase 3 (frames 80–end): Pulse on method signature, floating dots, shimmer
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
import { PaperBackground, GlobalDefs, Caption, SectionLabel } from '../helpers/components';

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 } as const;
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
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

export const Scene05_BaseClass: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 14);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  // UML class box
  const classBoxEntrance = useSpringEntrance(frame, 22);
  const classBoxPerimeter = 2 * (500 + 340);
  const classBoxBorderDash = interpolate(frame, [22, 55], [classBoxPerimeter, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // Class name label
  const classNameEntrance = useSpringEntrance(frame, 30);
  // Divider line
  const dividerLen = 460;
  const dividerDash = usePathDraw(frame, 35, dividerLen, 20);
  // Method text
  const methodEntrance = useSpringEntrance(frame, 40);

  // Code block lines (staggered)
  const codeLine1 = useSpringEntrance(frame, 48);
  const codeLine2 = useSpringEntrance(frame, 54);
  const codeLine3 = useSpringEntrance(frame, 60);
  const codeLine4 = useSpringEntrance(frame, 66);
  const codeLine5 = useSpringEntrance(frame, 72);

  // Arrow from class box to code block
  const arrowLen = 160;
  const arrowDash = usePathDraw(frame, 50, arrowLen, 25);

  // Return type highlight box
  const highlightEntrance = useSpringEntrance(frame, 75);
  const highlightPerimeter = 2 * (200 + 50);
  const highlightBorderDash = interpolate(frame, [75, 95], [highlightPerimeter, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // Engine class box (right side)
  const engineBoxEntrance = useSpringEntrance(frame, 55);
  const enginePerimeter = 2 * (260 + 120);
  const engineBorderDash = interpolate(frame, [55, 80], [enginePerimeter, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // Connector from Train to Engine
  const connectorLen = 200;
  const connectorDash = usePathDraw(frame, 65, connectorLen, 25);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const methodGlow = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.6, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s05.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A — Label ─────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="BASE CLASS · TRAIN" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B — Headlines ─────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={240} fontFamily="'Inter', system-ui, sans-serif" fontSize={72} fontWeight={800} fill={COLORS.deep_black}>
            Train Class
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={320} fontFamily="'Inter', system-ui, sans-serif" fontSize={44} fontWeight={500} fill={COLORS.orange}>
            getEngine() returns Engine
          </text>
        </g>

        {/* ── ZONE C — UML Class Box (left half) ─────────────────────────── */}
        {/* Border draw */}
        <rect
          x={60} y={400} width={500} height={340} rx={14}
          fill="none"
          stroke={COLORS.sky_blue} strokeWidth={2.5}
          strokeDasharray={classBoxPerimeter}
          strokeDashoffset={classBoxBorderDash}
        />
        {/* Fill */}
        <g opacity={classBoxEntrance.opacity} transform={`translate(0, ${classBoxEntrance.translateY})`}>
          <rect x={60} y={400} width={500} height={340} rx={14}
            fill={COLORS.sky_blue} fillOpacity={0.04}
          />
          {/* Class name header */}
          <rect x={60} y={400} width={500} height={80} rx={14}
            fill={COLORS.sky_blue} fillOpacity={0.08}
          />
        </g>

        {/* Class name */}
        <g opacity={classNameEntrance.opacity} transform={`translate(0, ${classNameEntrance.translateY})`}>
          <text x={310} y={453} textAnchor="middle" fontFamily="'Fira Code', monospace" fontSize={38} fontWeight={800} fill={COLORS.sky_blue}>
            Train
          </text>
        </g>

        {/* Divider in class box */}
        <line
          x1={80} y1={490} x2={540} y2={490}
          stroke={COLORS.sky_blue}
          strokeWidth={1.5}
          strokeDasharray={dividerLen}
          strokeDashoffset={dividerDash}
          opacity={0.3}
        />

        {/* Method signature in class box */}
        <g opacity={methodEntrance.opacity} transform={`translate(0, ${methodEntrance.translateY})`}>
          <text x={100} y={550} fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={400} fill={COLORS.cool_silver}>
            + getEngine()
          </text>
          <text x={100} y={600} fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={600} fill={COLORS.deep_black}>
            {'  '}returns{' '}
          </text>
          <text x={280} y={600} fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={800} fill={COLORS.orange} opacity={methodGlow}>
            Engine
          </text>

          {/* Return type highlight */}
          <rect
            x={260} y={575} width={160} height={38} rx={8}
            fill="none"
            stroke={COLORS.orange} strokeWidth={2}
            strokeDasharray={highlightPerimeter}
            strokeDashoffset={highlightBorderDash}
            opacity={highlightEntrance.opacity}
          />
        </g>

        {/* ── Engine class box (right side) ───────────────────────────────── */}
        <rect
          x={640} y={430} width={380} height={120} rx={14}
          fill="none"
          stroke={COLORS.orange} strokeWidth={2.5}
          strokeDasharray={enginePerimeter}
          strokeDashoffset={engineBorderDash}
        />
        <g opacity={engineBoxEntrance.opacity} transform={`translate(0, ${engineBoxEntrance.translateY})`}>
          <rect x={640} y={430} width={380} height={120} rx={14}
            fill={COLORS.orange} fillOpacity={0.06}
          />
          <text x={830} y={480} textAnchor="middle" fontFamily="'Fira Code', monospace" fontSize={36} fontWeight={800} fill={COLORS.orange}>
            Engine
          </text>
          <text x={830} y={525} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={400} fill={COLORS.cool_silver}>
            General type
          </text>
        </g>

        {/* ── Connector from Train method to Engine box ───────────────────── */}
        <path
          d="M 560,590 L 640,490"
          fill="none"
          stroke={COLORS.orange}
          strokeWidth={2}
          strokeDasharray={connectorLen}
          strokeDashoffset={connectorDash}
          strokeLinecap="round"
          markerEnd="url(#arrow)"
          opacity={0.4}
        />
        <g opacity={engineBoxEntrance.opacity * 0.5}>
          <text x={610} y={545} fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={500} fill={COLORS.cool_silver} transform="rotate(-25, 610, 545)">
            returns
          </text>
        </g>

        {/* ── Code block ─────────────────────────────────────────────────── */}
        <g opacity={codeLine1.opacity}>
          <rect x={60} y={800} width={960} height={340} rx={12}
            fill={COLORS.deep_black} fillOpacity={0.04}
          />
          <rect x={60} y={800} width={6} height={340} rx={3} fill={COLORS.sky_blue} />
        </g>

        {/* Line 1 */}
        <g opacity={codeLine1.opacity} transform={`translate(0, ${codeLine1.translateY})`}>
          <text x={90} y={850} fontFamily="'Fira Code', monospace" fontSize={30} fontWeight={400} fill={COLORS.sky_blue}>
            class
          </text>
          <text x={165} y={850} fontFamily="'Fira Code', monospace" fontSize={30} fontWeight={700} fill={COLORS.deep_black}>
            {' Train '}
          </text>
          <text x={310} y={850} fontFamily="'Fira Code', monospace" fontSize={30} fontWeight={400} fill={COLORS.cool_silver}>
            {'{'}
          </text>
        </g>

        {/* Line 2 — method signature */}
        <g opacity={codeLine2.opacity} transform={`translate(0, ${codeLine2.translateY})`}>
          <text x={130} y={900} fontFamily="'Fira Code', monospace" fontSize={30} fontWeight={400} fill={COLORS.orange}>
            Engine
          </text>
          <text x={270} y={900} fontFamily="'Fira Code', monospace" fontSize={30} fontWeight={700} fill={COLORS.deep_black}>
            {' getEngine'}
          </text>
          <text x={520} y={900} fontFamily="'Fira Code', monospace" fontSize={30} fontWeight={400} fill={COLORS.cool_silver}>
            {'() {'}
          </text>
        </g>

        {/* Line 3 — return statement */}
        <g opacity={codeLine3.opacity} transform={`translate(0, ${codeLine3.translateY})`}>
          <text x={170} y={950} fontFamily="'Fira Code', monospace" fontSize={30} fontWeight={400} fill={COLORS.sky_blue}>
            return
          </text>
          <text x={310} y={950} fontFamily="'Fira Code', monospace" fontSize={30} fontWeight={400} fill={COLORS.deep_black}>
            {' new '}
          </text>
          <text x={410} y={950} fontFamily="'Fira Code', monospace" fontSize={30} fontWeight={700} fill={COLORS.orange}>
            Engine
          </text>
          <text x={530} y={950} fontFamily="'Fira Code', monospace" fontSize={30} fontWeight={400} fill={COLORS.cool_silver}>
            {'();'}
          </text>
        </g>

        {/* Line 4 — closing braces */}
        <g opacity={codeLine4.opacity} transform={`translate(0, ${codeLine4.translateY})`}>
          <text x={130} y={1000} fontFamily="'Fira Code', monospace" fontSize={30} fontWeight={400} fill={COLORS.cool_silver}>
            {'}'}
          </text>
        </g>

        {/* Line 5 — closing class brace */}
        <g opacity={codeLine5.opacity} transform={`translate(0, ${codeLine5.translateY})`}>
          <text x={90} y={1050} fontFamily="'Fira Code', monospace" fontSize={30} fontWeight={400} fill={COLORS.cool_silver}>
            {'}'}
          </text>
        </g>

        {/* ── Annotation callout ─────────────────────────────────────────── */}
        <g opacity={highlightEntrance.opacity * shimmer} transform={`translate(0, ${breathe * 0.5})`}>
          <rect x={660} y={870} width={340} height={80} rx={12}
            fill={COLORS.orange} fillOpacity={0.06}
            stroke={COLORS.orange} strokeWidth={1.5}
          />
          <text x={680} y={900} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={500} fill={COLORS.cool_silver}>
            RETURN TYPE
          </text>
          <text x={680} y={934} fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={700} fill={COLORS.orange}>
            Engine
          </text>
          {/* Pointer line */}
          <path
            d="M 660,910 L 580,900"
            fill="none" stroke={COLORS.orange} strokeWidth={1.5}
            strokeLinecap="round" opacity={0.4}
          />
        </g>

        {/* ── Key insight card below code ─────────────────────────────────── */}
        <g opacity={codeLine5.opacity} transform={`translate(0, ${codeLine5.translateY})`}>
          <rect x={60} y={1190} width={960} height={120} rx={14}
            fill={COLORS.amber} fillOpacity={0.05}
            stroke={COLORS.amber} strokeWidth={1.5}
          />
          <rect x={60} y={1190} width={6} height={120} rx={3} fill={COLORS.amber} />
          <text x={100} y={1240} fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={500} fill={COLORS.cool_silver}>
            KEY POINT
          </text>
          <text x={100} y={1285} fontFamily="'Inter', sans-serif" fontSize={34} fontWeight={700} fill={COLORS.deep_black}>
            getEngine() returns the general Engine type
          </text>
        </g>

        {/* ── Floating decorative elements ────────────────────────────────── */}
        <g opacity={0.12}>
          <circle cx={120} cy={1420 + breathe} r={5} fill={COLORS.orange} />
          <circle cx={960} cy={1440 - breathe * 0.8} r={4} fill={COLORS.sky_blue} />
          <circle cx={540} cy={1400 + breathe * 0.6} r={6} fill={COLORS.amber} />
        </g>

        {/* ── Bottom rail decoration ──────────────────────────────────────── */}
        <g opacity={codeLine1.opacity * 0.1}>
          <line x1={60} y1={1560} x2={1020} y2={1560} stroke={COLORS.deep_black} strokeWidth={3} />
          <line x1={60} y1={1570} x2={1020} y2={1570} stroke={COLORS.deep_black} strokeWidth={3} />
          {Array.from({ length: 20 }, (_, i) => (
            <rect key={i} x={80 + i * 48} y={1553} width={24} height={4} rx={1} fill={COLORS.deep_black} opacity={0.4} />
          ))}
        </g>

        {/* ── Caption ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s05.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
