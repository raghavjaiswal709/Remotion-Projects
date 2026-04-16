/**
 * Scene 06 — Infrastructure
 * "The runtime is the infrastructure surrounding the model."
 * CSV: 17.800s → 21.140s
 * Duration: 101 frames (3.37s)
 *
 * Animation phases:
 *   Phase 1 (0–25):  Label + headline
 *   Phase 2 (20–70): Central model with surrounding infrastructure layers
 *   Phase 3 (60–end): Micro-anims
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

export const Scene06_Infrastructure: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 5);
  const h2 = useSpringEntrance(frame, 10);

  // Concentric layers: outer runtime, middle services, inner model
  const outerRing = useSpringEntrance(frame, 18);
  const outerCircum = 2 * Math.PI * 280;
  const outerDash = usePathDraw(frame, 18, outerCircum, 30);

  const midRing = useSpringEntrance(frame, 24);
  const midCircum = 2 * Math.PI * 180;
  const midDash = usePathDraw(frame, 24, midCircum, 25);

  const innerBox = useSpringEntrance(frame, 30);
  const innerPerim = 2 * (200 + 100);
  const innerDash = usePathDraw(frame, 30, innerPerim, 20);

  // Layer labels
  const lbl1 = useSpringEntrance(frame, 22);
  const lbl2 = useSpringEntrance(frame, 28);
  const lbl3 = useSpringEntrance(frame, 34);

  // Side cards
  const leftCard = useSpringEntrance(frame, 38);
  const rightCard = useSpringEntrance(frame, 44);

  // Bottom card
  const bottomCard = useSpringEntrance(frame, 50);
  const bottomPerim = 2 * (960 + 180);
  const bottomDash = usePathDraw(frame, 50, bottomPerim, 25);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const rotation = frame * 0.3;

  const particles = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2 + frame * 0.012;
    const r = 380 + Math.sin(frame * 0.03 + i) * 30;
    return { x: 540 + Math.cos(a) * r, y: 870 + Math.sin(a) * r * 0.35, op: 0.1, size: 2 + (i % 3) };
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s06.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="MODULE 3 · AGENT RUNTIME" y={160} />
        </g>

        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={76} fontWeight={800} fill={COLORS.white}>
            Infrastructure
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={390} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}>
            Surrounding the Model
          </text>
        </g>

        {/* Concentric diagram at center */}
        {/* Outer ring — RUNTIME */}
        <g opacity={outerRing.opacity}>
          <circle cx={540} cy={800} r={280} fill="none"
            stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={outerCircum} strokeDashoffset={outerDash} />
          <g opacity={lbl1.opacity} transform={`translate(0, ${lbl1.translateY})`}>
            <text x={540} y={490} textAnchor="middle"
              fontFamily={FONT} fontSize={28} fontWeight={800}
              fill={COLORS.accent} letterSpacing="0.15em">
              RUNTIME LAYER
            </text>
          </g>
        </g>

        {/* Middle ring — SERVICES */}
        <g opacity={midRing.opacity}>
          <circle cx={540} cy={800} r={180} fill={COLORS.bg_secondary} fillOpacity={0.3}
            stroke={COLORS.accent} strokeWidth={1.5} opacity={0.6}
            strokeDasharray={midCircum} strokeDashoffset={midDash} />
          <g opacity={lbl2.opacity} transform={`translate(0, ${lbl2.translateY})`}>
            <text x={540} y={598} textAnchor="middle"
              fontFamily={FONT} fontSize={24} fontWeight={800}
              fill={COLORS.text_muted} letterSpacing="0.1em">
              PROMPT · API · TOOLS
            </text>
          </g>
        </g>

        {/* Inner box — MODEL */}
        <g opacity={innerBox.opacity} transform={`translate(0, ${innerBox.translateY * 0.3})`}>
          <rect x={440} y={750} width={200} height={100} rx={14}
            fill={COLORS.bg_primary} stroke={COLORS.white} strokeWidth={1.5}
            strokeDasharray={innerPerim} strokeDashoffset={innerDash} />
          <g opacity={lbl3.opacity}>
            <text x={540} y={812} textAnchor="middle"
              fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
              MODEL
            </text>
          </g>
        </g>

        {/* Rotating dots on outer ring */}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => {
          const rad = (deg + rotation) * Math.PI / 180;
          const cx = 540 + Math.cos(rad) * 280;
          const cy = 800 + Math.sin(rad) * 280;
          return <circle key={i} cx={cx} cy={cy} r={4} fill={COLORS.accent} opacity={outerRing.opacity * 0.5} />;
        })}

        {/* Left card — Input side */}
        <g opacity={leftCard.opacity} transform={`translate(0, ${leftCard.translateY})`}>
          <BentoCard x={60} y={1140} w={440} h={200} />
          <rect x={60} y={1140} width={6} height={200} rx={3} fill={COLORS.accent} />
          <text x={100} y={1220} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Receives input
          </text>
          <text x={100} y={1270} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Formats prompts
          </text>
        </g>

        {/* Right card — Output side */}
        <g opacity={rightCard.opacity} transform={`translate(0, ${rightCard.translateY})`}>
          <BentoCard x={560} y={1140} w={460} h={200} accent />
          <text x={600} y={1220} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>
            Executes tools
          </text>
          <text x={600} y={1270} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Loops again
          </text>
        </g>

        {/* Bottom card */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={60} y={1400} w={960} h={160} />
          <rect x={60} y={1400} width={960} height={160} rx={20}
            fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1}
            strokeDasharray={bottomPerim} strokeDashoffset={bottomDash} />
          <text x={540} y={1495} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            Everything the model needs to act
          </text>
        </g>

        {/* Particles */}
        {particles.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.size} fill={COLORS.accent} opacity={p.op * shimmer} />
        ))}

        {/* Decorative pulse */}
        <g transform={`translate(540, ${1660 + breathe})`}>
          <circle cx={0} cy={0} r={24} fill={COLORS.accent} opacity={0.05} />
          <circle cx={0} cy={0} r={24} fill="none" stroke={COLORS.accent} strokeWidth={1}
            opacity={0.2} transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s06.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
