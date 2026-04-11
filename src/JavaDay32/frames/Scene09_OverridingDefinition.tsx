/**
 * Scene09 — Method Overriding Definition
 * "Method overriding lets a child class write its own version of a method it inherited from the parent."
 * CSV: 30.84s → 36.58s
 * Duration: 192 frames (6.4s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):   Scene reveal — label, per-word headline
 *   Phase 2 (frames 20–100): Three-layer diagram: Parent → Inheritance → Child, path-draw arrows
 *   Phase 3 (frames 90–end): Micro — breathe, pulse on override glow, shimmer on connectors
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
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;
const SPRING_SOFT = { damping: 22, stiffness: 120, mass: 1.0 } as const;

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

export const Scene09_OverridingDefinition: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);

  // Per-word headline spring
  const words = ['Method', 'Overriding'];
  const wordSprings = words.map((_, i) => {
    const f = Math.max(0, frame - 6 - i * 8);
    const sp = spring({ frame: f, fps, config: SPRING_SNAP });
    const ty = interpolate(sp, [0, 1], [24, 0]);
    const op = interpolate(sp, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });
    return { sp, ty, op };
  });

  const subtitleEntrance = useSpringEntrance(frame, 18);

  // ── Phase 2: Diagram build ─────────────────────────────────────────────────
  // Parent class box
  const parentBox = useSpringEntrance(frame, 24);
  const parentPerimeter = 2 * (460 + 200);
  const parentBorder = usePathDraw(frame, 24, parentPerimeter, 28);

  // Inheritance arrow (parent → child)
  const inheritArrowLen = 160;
  const inheritArrowDash = usePathDraw(frame, 38, inheritArrowLen, 20);

  // "extends" label
  const extendsLabel = useSpringEntrance(frame, 42);

  // Child class box
  const childBox = useSpringEntrance(frame, 46);
  const childPerimeter = 2 * (460 + 260);
  const childBorder = usePathDraw(frame, 46, childPerimeter, 28);

  // Method highlight in parent
  const parentMethodHighlight = useSpringEntrance(frame, 32);
  // Method highlight in child — override emphasis
  const childMethodHighlight = useSpringEntrance(frame, 54);

  // Override glow ring
  const overrideGlow = spring({ frame: Math.max(0, frame - 58), fps, config: SPRING_SOFT });

  // Definition card at bottom
  const defCard = useSpringEntrance(frame, 64);
  const defPerimeter = 2 * (960 + 200);
  const defBorder = usePathDraw(frame, 64, defPerimeter, 26);

  // Bullet points in definition card
  const bullet1 = useSpringEntrance(frame, 70);
  const bullet2 = useSpringEntrance(frame, 80);
  const bullet3 = useSpringEntrance(frame, 90);

  // Side annotation arrows
  const sideArrow1Draw = usePathDraw(frame, 36, 100, 16);
  const sideArrow2Draw = usePathDraw(frame, 56, 100, 16);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const overridePulse = interpolate(Math.sin(frame * 0.12), [-1, 1], [0.06, 0.14]);
  const connectorGlow = interpolate(Math.sin(frame * 0.07), [-1, 1], [0.5, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s09.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="CORE CONCEPT · DEFINITION" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B — Per-word headline ───────────────────────────────────── */}
        {words.map((word, i) => (
          <text
            key={word}
            x={60 + i * 350} y={260}
            opacity={wordSprings[i].op}
            transform={`translate(0, ${wordSprings[i].ty})`}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={72} fontWeight={900}
            fill={i === 1 ? COLORS.orange : COLORS.deep_black}
          >
            {word}
          </text>
        ))}

        {/* Subtitle */}
        <g transform={`translate(0, ${subtitleEntrance.translateY})`} opacity={subtitleEntrance.opacity}>
          <text
            x={60} y={340}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={34} fontWeight={400}
            fill={COLORS.cool_silver}
          >
            A child class rewrites an inherited method
          </text>
        </g>

        {/* ── PARENT CLASS BOX ────────────────────────────────────────────── */}
        <rect
          x={310} y={420} width={460} height={200} rx={16}
          fill="none"
          stroke={COLORS.cool_silver}
          strokeWidth={2}
          strokeDasharray={parentPerimeter}
          strokeDashoffset={parentBorder}
        />
        <rect
          x={310} y={420} width={460} height={200} rx={16}
          fill={COLORS.cool_silver}
          fillOpacity={parentBox.opacity * 0.03}
        />

        {/* Parent header */}
        <g opacity={parentBox.opacity} transform={`translate(0, ${parentBox.translateY * 0.3})`}>
          <rect x={310} y={420} width={460} height={48} rx={16} ry={0} fill={COLORS.cool_silver} fillOpacity={0.06} />
          <text
            x={540} y={452}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={700}
            fill={COLORS.cool_silver}
          >
            Parent Class (Train)
          </text>
        </g>

        {/* Parent method */}
        <g opacity={parentMethodHighlight.opacity} transform={`translate(0, ${parentMethodHighlight.translateY * 0.2})`}>
          <rect
            x={340} y={490} width={400} height={48} rx={8}
            fill={COLORS.cool_silver}
            fillOpacity={0.06}
          />
          <text
            x={540} y={522}
            textAnchor="middle"
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={26} fontWeight={600}
            fill={COLORS.deep_black}
          >
            calculateFare()
          </text>
        </g>

        {/* Parent → "Original implementation" annotation */}
        <path
          d="M 770,520 L 870,520"
          fill="none"
          stroke={COLORS.cool_silver}
          strokeWidth={1.5}
          strokeDasharray={100}
          strokeDashoffset={sideArrow1Draw}
          strokeLinecap="round"
          opacity={0.4}
        />
        <g opacity={parentMethodHighlight.opacity * 0.5}>
          <text
            x={890} y={527}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={500}
            fill={COLORS.cool_silver}
          >
            Original
          </text>
        </g>

        {/* ── INHERITANCE ARROW ────────────────────────────────────────────── */}
        <path
          d="M 540,620 L 540,780"
          fill="none"
          stroke={COLORS.sky_blue}
          strokeWidth={2.5}
          strokeDasharray={inheritArrowLen}
          strokeDashoffset={inheritArrowDash}
          strokeLinecap="round"
          markerEnd="url(#arrowBlue)"
          opacity={connectorGlow}
        />

        {/* "extends" label */}
        <g opacity={extendsLabel.opacity} transform={`translate(0, ${extendsLabel.translateY * 0.3})`}>
          <rect
            x={460} y={686} width={160} height={36} rx={18}
            fill={COLORS.bg_paper}
            stroke={COLORS.sky_blue}
            strokeWidth={1.5}
          />
          <text
            x={540} y={712}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={700}
            fill={COLORS.sky_blue}
            letterSpacing="0.12em"
          >
            EXTENDS
          </text>
        </g>

        {/* ── CHILD CLASS BOX ─────────────────────────────────────────────── */}
        <rect
          x={310} y={780} width={460} height={260} rx={16}
          fill="none"
          stroke={COLORS.orange}
          strokeWidth={2.5}
          strokeDasharray={childPerimeter}
          strokeDashoffset={childBorder}
        />
        <rect
          x={310} y={780} width={460} height={260} rx={16}
          fill={COLORS.orange}
          fillOpacity={childBox.opacity * 0.04}
        />

        {/* Child header */}
        <g opacity={childBox.opacity} transform={`translate(0, ${childBox.translateY * 0.3})`}>
          <rect x={310} y={780} width={460} height={48} rx={16} ry={0} fill={COLORS.orange} fillOpacity={0.1} />
          <text
            x={540} y={812}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={700}
            fill={COLORS.orange}
          >
            Child Class (ExpressTrain)
          </text>
        </g>

        {/* Child method — overridden */}
        <g opacity={childMethodHighlight.opacity} transform={`translate(0, ${childMethodHighlight.translateY * 0.2})`}>
          <rect
            x={340} y={850} width={400} height={48} rx={8}
            fill={COLORS.orange}
            fillOpacity={overridePulse}
          />
          <rect
            x={340} y={850} width={400} height={48} rx={8}
            fill="none"
            stroke={COLORS.orange}
            strokeWidth={1.5}
          />
          <text
            x={540} y={882}
            textAnchor="middle"
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={26} fontWeight={700}
            fill={COLORS.orange}
          >
            calculateFare()
          </text>
        </g>

        {/* Override glow ring */}
        <circle
          cx={540} cy={874}
          r={interpolate(overrideGlow, [0, 1], [0, 240])}
          fill="none"
          stroke={COLORS.orange}
          strokeWidth={1}
          opacity={interpolate(overrideGlow, [0, 0.5, 1], [0, 0.12, 0])}
        />

        {/* "Own version" label inside child */}
        <g opacity={childMethodHighlight.opacity * 0.7}>
          <text
            x={540} y={940}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={24} fontWeight={500}
            fill={COLORS.cool_silver}
          >
            Its own version of the method
          </text>

          {/* Override badge */}
          <rect
            x={440} y={960} width={200} height={40} rx={20}
            fill={COLORS.orange} fillOpacity={0.1}
            stroke={COLORS.orange} strokeWidth={1.5}
          />
          <text
            x={540} y={988}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={20} fontWeight={700}
            fill={COLORS.orange}
            letterSpacing="0.12em"
          >
            OVERRIDES
          </text>
        </g>

        {/* Child → "New implementation" annotation */}
        <path
          d="M 770,880 L 870,880"
          fill="none"
          stroke={COLORS.orange}
          strokeWidth={1.5}
          strokeDasharray={100}
          strokeDashoffset={sideArrow2Draw}
          strokeLinecap="round"
          opacity={0.4}
        />
        <g opacity={childMethodHighlight.opacity * 0.5}>
          <text
            x={890} y={887}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={22} fontWeight={500}
            fill={COLORS.orange}
          >
            Rewritten
          </text>
        </g>

        {/* ── Definition card ──────────────────────────────────────────────── */}
        <rect
          x={60} y={1090} width={960} height={280} rx={16}
          fill="none"
          stroke={COLORS.sky_blue}
          strokeWidth={1.5}
          strokeDasharray={defPerimeter}
          strokeDashoffset={defBorder}
        />
        <rect
          x={60} y={1090} width={960} height={280} rx={16}
          fill={COLORS.sky_blue}
          fillOpacity={defCard.opacity * 0.03}
        />
        <g opacity={defCard.opacity}>
          <rect x={60} y={1090} width={6} height={280} rx={3} fill={COLORS.sky_blue} />
          <text
            x={100} y={1135}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={30} fontWeight={700}
            fill={COLORS.sky_blue}
          >
            Key Properties
          </text>
        </g>

        {/* Bullet 1 */}
        <g opacity={bullet1.opacity} transform={`translate(0, ${bullet1.translateY * 0.3})`}>
          <circle cx={120} cy={1185} r={5} fill={COLORS.orange} />
          <text
            x={145} y={1193}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={500}
            fill={COLORS.deep_black}
          >
            Same method signature in parent and child
          </text>
        </g>

        {/* Bullet 2 */}
        <g opacity={bullet2.opacity} transform={`translate(0, ${bullet2.translateY * 0.3})`}>
          <circle cx={120} cy={1240} r={5} fill={COLORS.orange} />
          <text
            x={145} y={1248}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={500}
            fill={COLORS.deep_black}
          >
            Child provides its own implementation
          </text>
        </g>

        {/* Bullet 3 */}
        <g opacity={bullet3.opacity} transform={`translate(0, ${bullet3.translateY * 0.3})`}>
          <circle cx={120} cy={1295} r={5} fill={COLORS.orange} />
          <text
            x={145} y={1303}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={500}
            fill={COLORS.deep_black}
          >
            Runtime decides which version runs
          </text>
        </g>

        {/* ── Pulse dots at bottom ─────────────────────────────────────────── */}
        {[0, 1, 2, 3].map(i => (
          <circle
            key={i}
            cx={260 + i * 180} cy={1430 + breathe}
            r={4}
            fill={COLORS.orange}
            opacity={0.15 * shimmer}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: `${260 + i * 180}px 1430px` }}
          />
        ))}

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s09.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
