/**
 * Scene 16 — SystemRuns
 * "The surrounding system runs the actual function."
 * CSV: 50.600s → 53.240s
 * Duration: 99 frames (3.30s)
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20):   Label + headline spring
 *   Phase 2 (frames 12–60):  System box with gear animation, function call arrow,
 *                             execution spinner, result generated
 *   Phase 3 (frames 50–end): Gear rotation, spark effects, status pulse
 *
 * Visual: System box executing a function — gear spinning, code running,
 *         execution indicator, result appearing.
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

export const Scene16_SystemRuns: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──────────────────────────────────────────────────────────────
  const labelEnter = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 4);
  const h2 = useSpringEntrance(frame, 9);

  // ── Phase 2 ──────────────────────────────────────────────────────────────

  // System container
  const sysEnter = useSpringEntrance(frame, 12);
  const sysPerim = 2 * (960 + 380);
  const sysBorder = interpolate(frame, [12, 38], [sysPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Gear icon — rotating
  const gearAngle = frame * 2.4;
  const gearEnter = useSpringEntrance(frame, 16);

  // Function call card
  const fnEnter = useSpringEntrance(frame, 22);
  const fnPerim = 2 * (400 + 160);
  const fnBorder = interpolate(frame, [22, 44], [fnPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Execution progress bar
  const execProgress = interpolate(frame, [30, 62], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.25, 0, 0.75, 1),
  });
  const execBarWidth = execProgress * 360;

  // Result box
  const resultEnter = useSpringEntrance(frame, 50);

  // Arrow from function to result
  const arrowLen = 120;
  const arrowDash = usePathDraw(frame, 42, arrowLen, 16);

  // Status text
  const statusPhase = frame < 30 ? 'IDLE' : frame < 62 ? 'EXECUTING' : 'COMPLETE';
  const statusColor = statusPhase === 'COMPLETE' ? COLORS.accent :
                      statusPhase === 'EXECUTING' ? COLORS.white : COLORS.text_muted;

  // Bottom cards
  const card1 = useSpringEntrance(frame, 40);
  const card2 = useSpringEntrance(frame, 48);
  const card3 = useSpringEntrance(frame, 54);

  // ── Phase 3 ──────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;

  // Spark effects around the gear during execution
  const sparks = Array.from({ length: 6 }, (_, i) => {
    const angle = (frame * 3 + i * 60) * (Math.PI / 180);
    const dist = 55 + Math.sin(frame * 0.15 + i) * 8;
    const visible = frame > 28 && frame < 65;
    return {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      opacity: visible ? 0.4 * shimmer : 0,
    };
  });

  // Data flow particles
  const flowParticles = Array.from({ length: 5 }, (_, i) => {
    const t = ((frame * 3 + i * 40) % 200) / 200;
    return {
      x: interpolate(t, [0, 1], [340, 700]),
      y: 920 + Math.sin(t * Math.PI * 3) * 6,
      opacity: frame > 30 ? interpolate(t, [0, 0.2, 0.8, 1], [0, 0.3, 0.3, 0], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
      }) : 0,
    };
  });

  // Gear drawing helper
  const GEAR_TEETH = 8;
  const GEAR_OUTER = 44;
  const GEAR_INNER = 32;
  const gearPath = Array.from({ length: GEAR_TEETH * 2 }, (_, i) => {
    const angle = (i / (GEAR_TEETH * 2)) * Math.PI * 2;
    const r = i % 2 === 0 ? GEAR_OUTER : GEAR_INNER;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ') + ' Z';

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s16.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="TOOL CALLING · EXECUTION" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={260}
            fontFamily={FONT} fontSize={76} fontWeight={800} fill={COLORS.white}>
            System Runs
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={370}
            fontFamily={FONT} fontSize={64} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            The Actual Function
          </text>
        </g>

        {/* ── ZONE C — System execution ──────────────────────────────────── */}

        {/* System container */}
        <g opacity={sysEnter.opacity} transform={`translate(0, ${sysEnter.translateY})`}>
          <BentoCard x={60} y={480} w={960} h={380} />
          <rect x={60} y={480} width={960} height={380} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={sysPerim} strokeDashoffset={sysBorder} />
          {/* Header bar */}
          <rect x={60} y={480} width={960} height={50} rx={20}
            fill={COLORS.accent} opacity={0.08} />
          <text x={100} y={513}
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.12em">
            RUNTIME ENVIRONMENT
          </text>
          {/* Status badge */}
          <rect x={860} y={490} width={140} height={30} rx={15}
            fill={statusPhase === 'COMPLETE' ? COLORS.accent : 'rgba(255,255,255,0.05)'}
            opacity={statusPhase === 'COMPLETE' ? 0.2 : 1} />
          <text x={930} y={511} textAnchor="middle"
            fontFamily={FONT} fontSize={16} fontWeight={800}
            fill={statusColor} letterSpacing="0.08em">
            {statusPhase}
          </text>

          {/* Spinning gear */}
          <g opacity={gearEnter.opacity}
             transform={`translate(200, 660) rotate(${gearAngle})`}
             style={{ transformOrigin: '0px 0px' }}>
            <path d={gearPath} fill="none" stroke={COLORS.accent} strokeWidth={3}
              strokeLinejoin="round" />
            <circle cx={0} cy={0} r={14} fill="none"
              stroke={COLORS.accent} strokeWidth={2} />
            <circle cx={0} cy={0} r={4} fill={COLORS.accent} />

            {/* Sparks */}
            {sparks.map((sp, i) => (
              <circle key={i} cx={sp.x} cy={sp.y} r={2}
                fill={COLORS.accent} opacity={sp.opacity} />
            ))}
          </g>

          {/* FUNCTION label */}
          <text x={200} y={740} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            FUNCTION
          </text>
        </g>

        {/* Function call card */}
        <g opacity={fnEnter.opacity} transform={`translate(0, ${fnEnter.translateY})`}>
          <rect x={320} y={570} width={400} height={160} rx={16}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={fnPerim} strokeDashoffset={fnBorder} />
          {/* Code snippet */}
          <text x={350} y={620}
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={24} fontWeight={500} fill={COLORS.accent}>
            search(
          </text>
          <text x={370} y={654}
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={22} fontWeight={500} fill={COLORS.text_muted}>
            query="tool calling"
          </text>
          <text x={350} y={688}
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={24} fontWeight={500} fill={COLORS.accent}>
            )
          </text>
        </g>

        {/* Execution progress bar */}
        <g opacity={fnEnter.opacity}>
          <rect x={340} y={750} width={360} height={8} rx={4}
            fill="rgba(255,255,255,0.06)" />
          <rect x={340} y={750} width={execBarWidth} height={8} rx={4}
            fill={COLORS.accent} opacity={0.8} />
          {/* Progress label */}
          <text x={340 + execBarWidth} y={778}
            fontFamily={FONT} fontSize={18} fontWeight={800}
            fill={COLORS.accent} opacity={execProgress > 0.1 ? 0.7 : 0}>
            {Math.round(execProgress * 100)}%
          </text>
        </g>

        {/* Arrow to result */}
        <line x1={730} y1={660} x2={850} y2={660}
          stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        {/* Flow particles */}
        {flowParticles.map((pt, i) => (
          <circle key={i} cx={pt.x} cy={pt.y} r={2}
            fill={COLORS.accent} opacity={pt.opacity} />
        ))}

        {/* Result box */}
        <g opacity={resultEnter.opacity} transform={`translate(0, ${resultEnter.translateY})`}>
          <rect x={860} y={580} width={140} height={160} rx={14}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Checkmark */}
          <g transform={`translate(930, 640) scale(${pulse})`}
             style={{ transformOrigin: '0px 0px' }}>
            <circle cx={0} cy={0} r={24} fill={COLORS.accent} opacity={0.15} />
            <path d="M -10,2 L -3,10 L 12,-8" fill="none"
              stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round"
              strokeLinejoin="round" />
          </g>
          <text x={930} y={700} textAnchor="middle"
            fontFamily={FONT} fontSize={20} fontWeight={800}
            fill={COLORS.accent}>
            RESULT
          </text>
        </g>

        {/* ── Bottom cards ───────────────────────────────────────────────── */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={920} w={460} h={140} accent />
          <rect x={60} y={920} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={100} y={1002}
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Real code executes
          </text>
        </g>

        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={560} y={920} w={460} h={140} />
          <text x={600} y={1002}
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>
            Outside the model
          </text>
        </g>

        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={60} y={1100} w={960} h={160} />
          <text x={540} y={1164} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Function call produces a
          </text>
          <text x={540} y={1218} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            concrete result from the real world
          </text>
        </g>

        {/* ── Large descriptive card ─────────────────────────────────────── */}
        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY + 10})`}>
          <BentoCard x={60} y={1310} w={620} h={160} />
          <text x={100} y={1388}
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            API call, database query, or
          </text>
          <text x={100} y={1434}
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            file system operation
          </text>
        </g>

        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY + 10})`}>
          <BentoCard x={720} y={1310} w={300} h={160} accent />
          <text x={870} y={1380} textAnchor="middle"
            fontFamily={FONT} fontSize={64} fontWeight={800} fill={COLORS.accent}>
            f(x)
          </text>
          <text x={870} y={1432} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            actual call
          </text>
        </g>

        {/* ── Floating particles ─────────────────────────────────────────── */}
        {[
          { x: 100, y: 1560 }, { x: 980, y: 1580 },
          { x: 300, y: 1620 }, { x: 760, y: 1640 },
          { x: 540, y: 1680 }, { x: 180, y: 1710 },
          { x: 880, y: 1720 },
        ].map((pt, i) => (
          <circle key={i}
            cx={pt.x} cy={pt.y + Math.sin(frame * 0.04 + i * 0.8) * 4}
            r={2.5} fill={COLORS.accent} opacity={0.07 * shimmer} />
        ))}

        {/* ── CAPTION ──────────────────────────────────────────────────── */}
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
