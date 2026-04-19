/**
 * Scene 04 — Define Trajectory Title
 * "Today, we define the trajectory."
 * CSV: 12.700s → 15.340s
 * Duration: 79 frames (2.63s)
 *
 * Animation phases:
 *   Phase 1 (0–20): Label + headline spring in
 *   Phase 2 (15–50): Large trajectory arc path-draw + title card
 *   Phase 3 (40–end): Micro-pulse, floating nodes along arc
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
const SPRING_SOFT = { damping: 22, stiffness: 120, mass: 1.0 } as const;
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
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene04_DefineTrajectory: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineWords = ['Today,', 'we', 'define', 'the'];
  const wordSprings = headlineWords.map((_, i) => {
    const f = Math.max(0, frame - i * 5);
    const sp = spring({ frame: f, fps, config: SPRING_SNAP });
    const ty = interpolate(sp, [0, 1], [24, 0]);
    const op = interpolate(sp, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });
    return { ty, op };
  });
  const trajectoryWord = useSpringEntrance(frame, 22);

  // ── Phase 2 ──
  const arcLength = 900;
  const arcDash = usePathDraw(frame, 16, arcLength, 30);

  const card1 = useSpringEntrance(frame, 28);
  const card2 = useSpringEntrance(frame, 36);

  // Arc node positions (along the curve)
  const ARC_NODES = [
    { cx: 160, cy: 900 },
    { cx: 340, cy: 720 },
    { cx: 540, cy: 650 },
    { cx: 740, cy: 720 },
    { cx: 920, cy: 900 },
  ];
  const nodeSprings = ARC_NODES.map((_, i) => useSpringEntrance(frame, 20 + i * 5));

  // Border draw
  const borderPerim = 2 * (960 + 220);
  const borderDash = usePathDraw(frame, 30, borderPerim, 25);

  // ── Phase 3 ──
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Traveling dot along arc
  const dotProgress = interpolate(frame, [20, 65], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  // Approximate position on arc
  const dotIdx = dotProgress * (ARC_NODES.length - 1);
  const dotI = Math.min(Math.floor(dotIdx), ARC_NODES.length - 2);
  const dotT = dotIdx - dotI;
  const dotX = ARC_NODES[dotI].cx + (ARC_NODES[dotI + 1].cx - ARC_NODES[dotI].cx) * dotT;
  const dotY = ARC_NODES[dotI].cy + (ARC_NODES[dotI + 1].cy - ARC_NODES[dotI].cy) * dotT - 20;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s04.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="MODULE 5 · TRAJECTORY" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Per-word spring headline ── */}
        {headlineWords.map((word, i) => (
          <g key={i} transform={`translate(0, ${wordSprings[i].ty})`} opacity={wordSprings[i].op}>
            <text
              x={60 + i * 180} y={320}
              fontFamily={FONT} fontSize={72} fontWeight={800}
              fill={COLORS.white}
            >
              {word}
            </text>
          </g>
        ))}

        {/* "trajectory" — large accent word */}
        <g transform={`translate(0, ${trajectoryWord.translateY})`} opacity={trajectoryWord.opacity}>
          <text x={540} y={460} textAnchor="middle"
            fontFamily={FONT} fontSize={100} fontWeight={800} fontStyle="italic"
            fill={COLORS.accent}>
            trajectory
          </text>
          {/* Ghost behind */}
          <text x={540} y={460} textAnchor="middle"
            fontFamily={FONT} fontSize={100} fontWeight={800} fontStyle="italic"
            fill={COLORS.accent} opacity={0.06}>
            trajectory
          </text>
        </g>

        {/* ── ZONE C — Large trajectory arc ── */}
        {/* Arc path */}
        <path
          d="M 160,900 C 160,600 540,540 540,650 C 540,540 920,600 920,900"
          fill="none" stroke={COLORS.accent} strokeWidth={4}
          strokeDasharray={arcLength} strokeDashoffset={arcDash}
          strokeLinecap="round"
        />

        {/* Arc background track */}
        <path
          d="M 160,900 C 160,600 540,540 540,650 C 540,540 920,600 920,900"
          fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={4}
          strokeLinecap="round"
        />

        {/* Nodes along arc */}
        {ARC_NODES.map((node, i) => {
          const ns = nodeSprings[i];
          const isCenter = i === 2;
          const nodeFloat = Math.sin(frame * 0.05 + i * 1.1) * 3;
          return (
            <g key={i} opacity={ns.opacity}
              transform={`translate(${node.cx}, ${node.cy + ns.translateY + nodeFloat})`}>
              <circle cx={0} cy={0} r={isCenter ? 20 : 14}
                fill={COLORS.bg_secondary} stroke={COLORS.accent}
                strokeWidth={isCenter ? 3 : 2} />
              {isCenter && (
                <circle cx={0} cy={0} r={28} fill="none" stroke={COLORS.accent}
                  strokeWidth={1.5} opacity={0.3 * shimmer}
                  transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
              )}
              <circle cx={0} cy={0} r={5} fill={COLORS.accent} opacity={0.7} />
              {/* Node labels */}
              <text x={0} y={isCenter ? 44 : 36} textAnchor="middle"
                fontFamily={FONT} fontSize={24} fontWeight={800}
                fill={isCenter ? COLORS.accent : COLORS.text_muted}>
                {['START', 'S₂', 'PEAK', 'S₄', 'END'][i]}
              </text>
            </g>
          );
        })}

        {/* Traveling dot */}
        {dotProgress > 0 && dotProgress < 1 && (
          <circle cx={dotX} cy={dotY} r={8} fill={COLORS.accent} opacity={0.9}>
          </circle>
        )}

        {/* Definition card */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={1000} w={960} h={220} accent />
          <rect x={60} y={1000} width={960} height={220} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={borderPerim} strokeDashoffset={borderDash} />
          <text x={100} y={1080} fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.white}>
            The complete record of
          </text>
          <text x={100} y={1140} fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.accent}>
            everything that happened
          </text>
          <text x={100} y={1190} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            during a task — from start to finish
          </text>
        </g>

        {/* Three attribute tiles */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          {[
            { label: 'STATES', x: 60, w: 300 },
            { label: 'ACTIONS', x: 380, w: 300 },
            { label: 'OBSERVATIONS', x: 700, w: 320 },
          ].map((tile, i) => {
            const tileFloat = Math.sin(frame * 0.04 + i * 1.5) * 2;
            return (
              <g key={i} transform={`translate(0, ${tileFloat})`}>
                <BentoCard x={tile.x} y={1260} w={tile.w} h={120} accent={i === 1} />
                <text x={tile.x + tile.w / 2} y={1330} textAnchor="middle"
                  fontFamily={FONT} fontSize={32} fontWeight={800}
                  fill={i === 1 ? COLORS.accent : COLORS.white}
                  letterSpacing="0.1em">
                  {tile.label}
                </text>
              </g>
            );
          })}
        </g>

        {/* Connecting lines between tiles */}
        <line x1={360} y1={1320} x2={380} y2={1320}
          stroke={COLORS.accent} strokeWidth={1.5} opacity={card2.opacity * 0.3} />
        <line x1={680} y1={1320} x2={700} y2={1320}
          stroke={COLORS.accent} strokeWidth={1.5} opacity={card2.opacity * 0.3} />

        {/* Floating decoration */}
        {[
          { x: 120, y: 1500 },
          { x: 540, y: 1540 },
          { x: 960, y: 1510 },
        ].map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y + breathe * (i % 2 === 0 ? 1 : -1)}
            r={4} fill={COLORS.accent} opacity={0.1 * shimmer} />
        ))}

        {/* ── CAPTION ── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s04.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
