/**
 * Scene 17 — LoopExecutable
 * "That sequence is the agent loop made executable."
 * CSV: 46.980s → 50.480s
 * Duration: 105 frames (3.5s)
 *
 * Animation phases:
 *   Phase 1 (0–20): headline reveal
 *   Phase 2 (14–70): circular agent loop diagram with 6 nodes
 *   Phase 3 (60–end): micro-animations, breathing
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
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
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

const LOOP_STEPS = [
  { label: 'RECEIVE', angle: -90 },
  { label: 'FORMAT', angle: -30 },
  { label: 'CALL API', angle: 30 },
  { label: 'PARSE', angle: 90 },
  { label: 'EXECUTE', angle: 150 },
  { label: 'APPEND', angle: 210 },
];

export const Scene17_LoopExecutable: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 4);
  const h2 = useSpringEntrance(frame, 10);

  // Each loop node staggered
  const nodeEnts = LOOP_STEPS.map((_, i) => useSpringEntrance(frame, 16 + i * 6));

  // Circle ring for the loop
  const ringCircumference = 2 * Math.PI * 240;
  const ringDash = usePathDraw(frame, 14, ringCircumference, 40);

  // Arc arrows between nodes
  const arcLen = 140;
  const arcDashes = LOOP_STEPS.map((_, i) => usePathDraw(frame, 20 + i * 5, arcLen, 18));

  // Center "AGENT LOOP" label
  const centerEnt = useSpringEntrance(frame, 50);

  // Summary cards
  const summaryCard = useSpringEntrance(frame, 62);
  const summaryCard2 = useSpringEntrance(frame, 70);

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.012;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Rotating highlight around the loop
  const rotAngle = interpolate(frame, [50, 105], [0, 360], { extrapolateRight: 'clamp' });

  const CX = 540;
  const CY = 880;
  const R = 240;

  const particles = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 + frame * 0.012;
    const pr = R + 60 + Math.sin(frame * 0.02 + i * 1.3) * 20;
    return { x: CX + Math.cos(a) * pr, y: CY + Math.sin(a) * pr };
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s17.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="MODULE 3 · AGENT RUNTIME" y={160} />
        </g>

        {/* Headline — per word */}
        {['Agent', 'Loop'].map((w, i) => {
          const f2 = Math.max(0, frame - 4 - i * 6);
          const sp = spring({ frame: f2, fps, config: SPRING_SNAP });
          const ty = interpolate(sp, [0, 1], [24, 0]);
          const op = interpolate(sp, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });
          return (
            <text key={i} x={60 + i * 300} y={340} opacity={op}
              transform={`translate(0, ${ty})`}
              fontFamily={FONT} fontSize={100} fontWeight={800}
              fill={i === 1 ? COLORS.accent : COLORS.white}>{w}</text>
          );
        })}

        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={430} fontFamily={FONT} fontSize={42} fontWeight={800}
            fill={COLORS.text_muted} fontStyle="italic">Made executable</text>
        </g>

        {/* Outer ring */}
        <circle cx={CX} cy={CY} r={R}
          fill="none" stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={ringCircumference} strokeDashoffset={ringDash}
          opacity={0.3} />

        {/* Inner glow circle */}
        <circle cx={CX} cy={CY} r={R - 40}
          fill={COLORS.accent} opacity={0.02 * shimmer} />

        {/* Loop nodes */}
        {LOOP_STEPS.map((step, i) => {
          const rad = (step.angle * Math.PI) / 180;
          const nx = CX + Math.cos(rad) * R;
          const ny = CY + Math.sin(rad) * R;
          const ent = nodeEnts[i];
          return (
            <g key={i} opacity={ent.opacity} transform={`translate(0, ${ent.translateY * 0.5})`}>
              <circle cx={nx} cy={ny} r={36}
                fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
              <text x={nx} y={ny + 6} textAnchor="middle"
                fontFamily={FONT} fontSize={16} fontWeight={800}
                fill={COLORS.white}>{step.label}</text>
              {/* Number badge */}
              <circle cx={nx + 26} cy={ny - 26} r={12}
                fill={COLORS.accent} opacity={0.9} />
              <text x={nx + 26} y={ny - 22} textAnchor="middle"
                fontFamily={FONT} fontSize={14} fontWeight={800} fill={COLORS.white}>
                {i + 1}
              </text>
            </g>
          );
        })}

        {/* Arc connectors between adjacent nodes */}
        {LOOP_STEPS.map((step, i) => {
          const nextStep = LOOP_STEPS[(i + 1) % LOOP_STEPS.length];
          const r1 = (step.angle * Math.PI) / 180;
          const r2 = (nextStep.angle * Math.PI) / 180;
          const x1 = CX + Math.cos(r1) * (R + 8);
          const y1 = CY + Math.sin(r1) * (R + 8);
          const x2 = CX + Math.cos(r2) * (R + 8);
          const y2 = CY + Math.sin(r2) * (R + 8);
          const mx = CX + Math.cos((r1 + r2) / 2) * (R + 50);
          const my = CY + Math.sin((r1 + r2) / 2) * (R + 50);
          return (
            <path key={`arc-${i}`}
              d={`M ${x1},${y1} Q ${mx},${my} ${x2},${y2}`}
              fill="none" stroke={COLORS.accent} strokeWidth={1.5}
              strokeDasharray={arcLen} strokeDashoffset={arcDashes[i]}
              strokeLinecap="round" markerEnd="url(#arrow)" opacity={0.5} />
          );
        })}

        {/* Center label */}
        <g opacity={centerEnt.opacity}>
          <text x={CX} y={CY - 10} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            AGENT
          </text>
          <text x={CX} y={CY + 26} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            LOOP
          </text>
        </g>

        {/* Rotating highlight dot */}
        {(() => {
          const rad = (rotAngle * Math.PI) / 180;
          const hx = CX + Math.cos(rad) * R;
          const hy = CY + Math.sin(rad) * R;
          return (
            <g opacity={interpolate(frame, [50, 58], [0, 0.8], { extrapolateRight: 'clamp' })}>
              <circle cx={hx} cy={hy} r={8} fill={COLORS.accent} />
              <circle cx={hx} cy={hy} r={18} fill={COLORS.accent} opacity={0.15} />
            </g>
          );
        })()}

        {/* Summary cards */}
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <BentoCard x={60} y={1180} w={460} h={160} />
          <rect x={60} y={1180} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={100} y={1240} fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.accent}>SEQUENCE</text>
          <text x={100} y={1280} fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.white}>Receive → Format → Call</text>
          <text x={100} y={1316} fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.white}>→ Parse → Execute → Append</text>
        </g>

        <g opacity={summaryCard2.opacity} transform={`translate(0, ${summaryCard2.translateY})`}>
          <BentoCard x={560} y={1180} w={460} h={160} accent />
          <text x={600} y={1240} fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.accent}>EXECUTABLE</text>
          <text x={600} y={1280} fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.white}>Pure code, no magic</text>
          <text x={600} y={1316} fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.text_muted}>Repeats until done</text>
        </g>

        {/* Bottom summary */}
        <g opacity={summaryCard2.opacity} transform={`translate(0, ${summaryCard2.translateY})`}>
          <BentoCard x={60} y={1380} w={960} h={100} />
          <text x={540} y={1443} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            The runtime makes the loop <tspan fill={COLORS.accent} fontStyle="italic">real</tspan>
          </text>
        </g>

        {particles.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={2} fill={COLORS.accent} opacity={0.04 * shimmer} />
        ))}

        <g transform={`translate(540, ${1620 + breathe})`}>
          <circle cx={0} cy={0} r={18} fill={COLORS.accent} opacity={0.03} />
          <circle cx={0} cy={0} r={18} fill="none" stroke={COLORS.accent} strokeWidth={1}
            opacity={0.1} transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s17.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
