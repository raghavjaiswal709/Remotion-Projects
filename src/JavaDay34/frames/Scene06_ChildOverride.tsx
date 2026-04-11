/**
 * Scene06_ChildOverride — Day 34
 * "BulletTrain extends Train and overrides getEngine, but BulletTrain does not use an ordinary engine."
 * CSV: 23.06s → 30.98s
 * Duration: 256 frames (8.53s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):  Label + headline spring entrance
 *   Phase 2 (frames 20–100): Two-class diagram, inheritance arrow draws, code block
 *   Phase 3 (frames 90–end): Pulse on override, breathing floating elements
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

export const Scene06_ChildOverride: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 14);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  // Parent class box (Train)
  const parentBox = useSpringEntrance(frame, 22);
  const parentPerimeter = 2 * (400 + 160);
  const parentBorderDash = interpolate(frame, [22, 52], [parentPerimeter, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // Child class box (BulletTrain)
  const childBox = useSpringEntrance(frame, 38);
  const childPerimeter = 2 * (400 + 200);
  const childBorderDash = interpolate(frame, [38, 68], [childPerimeter, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // Inheritance arrow (from child to parent)
  const inheritArrowLen = 120;
  const inheritArrowDash = usePathDraw(frame, 50, inheritArrowLen, 20);

  // "extends" label
  const extendsLabel = useSpringEntrance(frame, 55);

  // Override badge
  const overrideBadge = useSpringEntrance(frame, 60);
  const overrideBadgeScale = spring({
    frame: Math.max(0, frame - 60),
    fps,
    config: SPRING_SNAP,
  });

  // Code block lines
  const code1 = useSpringEntrance(frame, 65);
  const code2 = useSpringEntrance(frame, 71);
  const code3 = useSpringEntrance(frame, 77);
  const code4 = useSpringEntrance(frame, 83);
  const code5 = useSpringEntrance(frame, 89);
  const code6 = useSpringEntrance(frame, 95);

  // "Not ordinary" highlight box
  const notOrdinary = useSpringEntrance(frame, 80);
  const notOrdinaryPerimeter = 2 * (380 + 64);
  const notOrdinaryBorderDash = interpolate(frame, [80, 105], [notOrdinaryPerimeter, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // Crossed out "ordinary engine" text effect
  const crossoutWidth = interpolate(frame, [95, 115], [0, 320], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const overridePulse = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.7, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s06.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="INHERITANCE · OVERRIDE" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={240} fontFamily="'Inter', system-ui, sans-serif" fontSize={68} fontWeight={800} fill={COLORS.deep_black}>
            BulletTrain
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={316} fontFamily="'Inter', system-ui, sans-serif" fontSize={42} fontWeight={500} fill={COLORS.orange}>
            extends Train, overrides getEngine
          </text>
        </g>

        {/* ── ZONE C — Class hierarchy diagram ────────────────────────────── */}

        {/* Parent class box: Train (top center) */}
        <rect
          x={340} y={400} width={400} height={160} rx={14}
          fill="none"
          stroke={COLORS.sky_blue} strokeWidth={2.5}
          strokeDasharray={parentPerimeter}
          strokeDashoffset={parentBorderDash}
        />
        <g opacity={parentBox.opacity} transform={`translate(0, ${parentBox.translateY})`}>
          <rect x={340} y={400} width={400} height={160} rx={14}
            fill={COLORS.sky_blue} fillOpacity={0.05}
          />
          <text x={540} y={455} textAnchor="middle" fontFamily="'Fira Code', monospace" fontSize={36} fontWeight={800} fill={COLORS.sky_blue}>
            Train
          </text>
          <text x={540} y={500} textAnchor="middle" fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={400} fill={COLORS.cool_silver}>
            + getEngine(): Engine
          </text>
          {/* Divider */}
          <line x1={360} y1={470} x2={720} y2={470} stroke={COLORS.sky_blue} strokeWidth={1} opacity={0.2} />
        </g>

        {/* Inheritance arrow (child → parent, triangle head) */}
        <line
          x1={540} y1={560} x2={540} y2={680}
          stroke={COLORS.deep_black}
          strokeWidth={2}
          strokeDasharray={inheritArrowLen}
          strokeDashoffset={inheritArrowDash}
          opacity={0.5}
        />
        {/* Triangle arrowhead pointing up */}
        <g opacity={extendsLabel.opacity}>
          <polygon
            points="540,558 530,578 550,578"
            fill="none"
            stroke={COLORS.deep_black}
            strokeWidth={2}
            opacity={0.5}
          />
        </g>

        {/* "extends" label */}
        <g opacity={extendsLabel.opacity * shimmer}>
          <text x={560} y={630} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={600} fill={COLORS.cool_silver}>
            extends
          </text>
        </g>

        {/* Child class box: BulletTrain (below) */}
        <rect
          x={290} y={680} width={500} height={200} rx={14}
          fill="none"
          stroke={COLORS.orange} strokeWidth={2.5}
          strokeDasharray={childPerimeter}
          strokeDashoffset={childBorderDash}
        />
        <g opacity={childBox.opacity} transform={`translate(0, ${childBox.translateY})`}>
          <rect x={290} y={680} width={500} height={200} rx={14}
            fill={COLORS.orange} fillOpacity={0.05}
          />
          <text x={540} y={735} textAnchor="middle" fontFamily="'Fira Code', monospace" fontSize={36} fontWeight={800} fill={COLORS.orange}>
            BulletTrain
          </text>
          {/* Divider */}
          <line x1={310} y1={755} x2={770} y2={755} stroke={COLORS.orange} strokeWidth={1} opacity={0.2} />
          <text x={540} y={800} textAnchor="middle" fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={400} fill={COLORS.deep_black}>
            + getEngine(): ???
          </text>

          {/* @Override badge */}
          <g opacity={overridePulse}>
            <rect
              x={680} y={705} width={100} height={30} rx={6}
              fill={COLORS.vibrant_red} fillOpacity={0.12}
              stroke={COLORS.vibrant_red} strokeWidth={1.5}
              transform={`scale(${interpolate(overrideBadgeScale, [0, 1], [0.6, 1])})`}
              style={{ transformOrigin: '730px 720px' }}
            />
            <text x={730} y={726} textAnchor="middle" fontFamily="'Fira Code', monospace" fontSize={16} fontWeight={700} fill={COLORS.vibrant_red}>
              @Override
            </text>
          </g>
        </g>

        {/* ── Code block ─────────────────────────────────────────────────── */}
        <g opacity={code1.opacity}>
          <rect x={60} y={950} width={960} height={360} rx={12}
            fill={COLORS.deep_black} fillOpacity={0.04}
          />
          <rect x={60} y={950} width={6} height={360} rx={3} fill={COLORS.orange} />
        </g>

        <g opacity={code1.opacity} transform={`translate(0, ${code1.translateY})`}>
          <text x={90} y={1000} fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={400} fill={COLORS.sky_blue}>
            class
          </text>
          <text x={155} y={1000} fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={700} fill={COLORS.orange}>
            {' BulletTrain'}
          </text>
          <text x={405} y={1000} fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={400} fill={COLORS.sky_blue}>
            {' extends'}
          </text>
          <text x={545} y={1000} fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={700} fill={COLORS.sky_blue}>
            {' Train'}
          </text>
          <text x={655} y={1000} fontFamily="'Fira Code', monospace" fontSize={28} fill={COLORS.cool_silver}>
            {' {'}
          </text>
        </g>

        <g opacity={code2.opacity} transform={`translate(0, ${code2.translateY})`}>
          <text x={130} y={1054} fontFamily="'Fira Code', monospace" fontSize={22} fontWeight={400} fill={COLORS.vibrant_red}>
            @Override
          </text>
        </g>

        <g opacity={code3.opacity} transform={`translate(0, ${code3.translateY})`}>
          <text x={130} y={1100} fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={400} fill={COLORS.orange}>
            Engine
          </text>
          <text x={260} y={1100} fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={700} fill={COLORS.deep_black}>
            {' getEngine'}
          </text>
          <text x={490} y={1100} fontFamily="'Fira Code', monospace" fontSize={28} fill={COLORS.cool_silver}>
            {'() {'}
          </text>
        </g>

        <g opacity={code4.opacity} transform={`translate(0, ${code4.translateY})`}>
          <text x={170} y={1150} fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={400} fill={COLORS.sky_blue}>
            return
          </text>
          <text x={310} y={1150} fontFamily="'Fira Code', monospace" fontSize={28} fill={COLORS.deep_black}>
            {' new '}
          </text>
          <text x={420} y={1150} fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={700} fill={COLORS.orange}>
            MaglevEngine
          </text>
          <text x={640} y={1150} fontFamily="'Fira Code', monospace" fontSize={28} fill={COLORS.cool_silver}>
            {'();'}
          </text>
        </g>

        <g opacity={code5.opacity} transform={`translate(0, ${code5.translateY})`}>
          <text x={130} y={1200} fontFamily="'Fira Code', monospace" fontSize={28} fill={COLORS.cool_silver}>
            {'}'}
          </text>
        </g>

        <g opacity={code6.opacity} transform={`translate(0, ${code6.translateY})`}>
          <text x={90} y={1250} fontFamily="'Fira Code', monospace" fontSize={28} fill={COLORS.cool_silver}>
            {'}'}
          </text>
        </g>

        {/* ── "Not ordinary engine" callout ───────────────────────────────── */}
        <rect
          x={620} y={1116} width={380} height={64} rx={10}
          fill="none"
          stroke={COLORS.vibrant_red} strokeWidth={2}
          strokeDasharray={notOrdinaryPerimeter}
          strokeDashoffset={notOrdinaryBorderDash}
          opacity={notOrdinary.opacity}
        />
        <g opacity={notOrdinary.opacity * shimmer} transform={`translate(0, ${notOrdinary.translateY * 0.3})`}>
          <rect x={620} y={1116} width={380} height={64} rx={10}
            fill={COLORS.vibrant_red} fillOpacity={0.04}
          />
          <text x={640} y={1140} fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={500} fill={COLORS.cool_silver}>
            NOT AN ORDINARY ENGINE
          </text>
          <text x={640} y={1167} fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={700} fill={COLORS.orange}>
            MaglevEngine
          </text>
        </g>

        {/* ── Crossed-out "ordinary engine" decoration ────────────────────── */}
        <g opacity={notOrdinary.opacity * 0.5}>
          <text x={120} y={1380} fontFamily="'Inter', sans-serif" fontSize={34} fontWeight={400} fill={COLORS.cool_silver}>
            ordinary Engine
          </text>
          <line
            x1={120} y1={1375} x2={120 + crossoutWidth} y2={1375}
            stroke={COLORS.vibrant_red} strokeWidth={2.5} strokeLinecap="round"
          />
        </g>

        {/* ── Right side — new engine label ────────────────────────────────── */}
        <g opacity={notOrdinary.opacity * shimmer} transform={`translate(0, ${breathe})`}>
          <rect x={540} y={1350} width={440} height={70} rx={12}
            fill={COLORS.orange} fillOpacity={0.06}
            stroke={COLORS.orange} strokeWidth={1.5}
          />
          <text x={560} y={1393} fontFamily="'Fira Code', monospace" fontSize={30} fontWeight={800} fill={COLORS.orange} opacity={pulse}>
            MaglevEngine
          </text>
        </g>

        {/* ── Arrow from crossed out → new ────────────────────────────────── */}
        <path
          d="M 440,1380 L 540,1385"
          fill="none"
          stroke={COLORS.orange}
          strokeWidth={2}
          strokeDasharray={100}
          strokeDashoffset={usePathDraw(frame, 100, 100, 20)}
          strokeLinecap="round"
          markerEnd="url(#arrow)"
          opacity={notOrdinary.opacity * 0.5}
        />

        {/* ── Floating decoration dots ────────────────────────────────────── */}
        <g opacity={0.1}>
          <circle cx={90} cy={1520 + breathe} r={5} fill={COLORS.orange} />
          <circle cx={990} cy={1540 - breathe * 0.8} r={4} fill={COLORS.sky_blue} />
          <circle cx={540} cy={1500 + breathe * 0.5} r={6} fill={COLORS.amber} />
          <circle cx={300} cy={1560 - breathe} r={3} fill={COLORS.vibrant_red} />
          <circle cx={780} cy={1510 + breathe * 1.2} r={5} fill={COLORS.green} />
        </g>

        {/* ── Caption ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s06.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
