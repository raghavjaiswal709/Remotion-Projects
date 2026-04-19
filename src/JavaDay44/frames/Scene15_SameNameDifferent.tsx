/**
 * Scene 15 — SameNameDifferent
 * "Same name, different parameters."
 * CSV: 48.360s → 49.940s
 * Duration: 60 frames (2.0s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20): Label + split headline spring
 *   Phase 2 (frames 14–48): Visual split — same name left, different params right
 *   Phase 3 (frames 40–end): Pulse, breathing
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

export const Scene15_SameNameDifferent: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const label    = useSpringEntrance(frame, 0);
  const heroLeft = useSpringEntrance(frame, 4);
  const heroRight = useSpringEntrance(frame, 8);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const divider  = useSpringEntrance(frame, 10);
  const leftCard = useSpringEntrance(frame, 14);
  const method1  = useSpringEntrance(frame, 20);
  const method2  = useSpringEntrance(frame, 26);
  const method3  = useSpringEntrance(frame, 32);
  const rightDetail1 = useSpringEntrance(frame, 22);
  const rightDetail2 = useSpringEntrance(frame, 28);
  const rightDetail3 = useSpringEntrance(frame, 34);
  const bottomCard = useSpringEntrance(frame, 40);

  // ── Vertical divider draw ──────────────────────────────────────────────────
  const divLineLen = 900;
  const divLineDash = usePathDraw(frame, 12, divLineLen, 20);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s15.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${label.translateY})`} opacity={label.opacity}>
          <text x={60} y={160}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.15em" opacity={0.8}>
            CORE PRINCIPLE · OVERLOADING
          </text>
        </g>

        {/* ── ZONE B — Split headline ────────────────────────────────────── */}
        <g transform={`translate(0, ${heroLeft.translateY})`} opacity={heroLeft.opacity}>
          <text x={270} y={350} textAnchor="middle"
            fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.white}>
            Same Name
          </text>
        </g>
        <g transform={`translate(0, ${heroRight.translateY})`} opacity={heroRight.opacity}>
          <text x={810} y={350} textAnchor="middle"
            fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Different
          </text>
          <text x={810} y={440} textAnchor="middle"
            fontFamily={FONT} fontSize={64} fontWeight={800}
            fill={COLORS.accent}>
            Parameters
          </text>
        </g>

        {/* ── Center divider (vertical) ──────────────────────────────────── */}
        <line x1={540} y1={500} x2={540} y2={1400}
          stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={divLineLen} strokeDashoffset={divLineDash}
          strokeLinecap="round" opacity={divider.opacity * 0.4} />

        {/* ── Left side: SAME NAME ───────────────────────────────────────── */}
        <g opacity={leftCard.opacity} transform={`translate(0, ${leftCard.translateY})`}>
          <BentoCard x={60} y={520} w={440} h={100} />
          <text x={280} y={582} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>
            SHARED NAME
          </text>
        </g>

        {/* Three method labels — same name */}
        {[
          { y: 660, ent: method1 },
          { y: 810, ent: method2 },
          { y: 960, ent: method3 },
        ].map((item, i) => (
          <g key={i} opacity={item.ent.opacity} transform={`translate(0, ${item.ent.translateY})`}>
            <BentoCard x={60} y={item.y} w={440} h={110} accent={i === 0} />
            <text x={280} y={item.y + 68} textAnchor="middle"
              fontFamily={FONT} fontSize={36} fontWeight={800}
              fill={COLORS.white}>
              calculateFare
            </text>
          </g>
        ))}

        {/* ── Right side: DIFFERENT PARAMS ───────────────────────────────── */}
        <g opacity={rightDetail1.opacity} transform={`translate(0, ${rightDetail1.translateY})`}>
          <BentoCard x={580} y={660} w={440} h={110} />
          <text x={800} y={710} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>
            (String route)
          </text>
          <text x={800} y={748} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>
            1 parameter
          </text>
        </g>

        <g opacity={rightDetail2.opacity} transform={`translate(0, ${rightDetail2.translateY})`}>
          <BentoCard x={580} y={810} w={440} h={110} accent />
          <text x={800} y={860} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>
            (String, String)
          </text>
          <text x={800} y={898} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>
            2 parameters
          </text>
        </g>

        <g opacity={rightDetail3.opacity} transform={`translate(0, ${rightDetail3.translateY})`}>
          <BentoCard x={580} y={960} w={440} h={110} />
          <text x={800} y={1010} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>
            (String, String, boolean)
          </text>
          <text x={800} y={1048} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>
            3 parameters
          </text>
        </g>

        {/* ── Connecting arrows left→right ────────────────────────────────── */}
        {[715, 865, 1015].map((cy, i) => {
          const arrowDash = usePathDraw(frame, 22 + i * 6, 100, 15);
          return (
            <line key={i}
              x1={510} y1={cy} x2={570} y2={cy}
              stroke={COLORS.accent} strokeWidth={2}
              strokeDasharray={100} strokeDashoffset={arrowDash}
              markerEnd="url(#arrow)"
              opacity={0.6} />
          );
        })}

        {/* ── Bottom summary ─────────────────────────────────────────────── */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={60} y={1160} w={960} h={160} accent />
          <rect x={60} y={1160} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={540} y={1230} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.white}>
            Name is <tspan fill={COLORS.accent}>constant</tspan>, params are <tspan fill={COLORS.accent}>variable</tspan>
          </text>
          <text x={540} y={1285} textAnchor="middle"
            fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.text_muted}>
            That's the essence of overloading
          </text>
        </g>

        {/* ── Equals / Not-equals badges ─────────────────────────────────── */}
        <g opacity={bottomCard.opacity}>
          <BentoCard x={60} y={1390} w={460} h={100} />
          <text x={290} y={1452} textAnchor="middle"
            fontFamily={FONT} fontSize={48} fontWeight={800}
            fill={COLORS.white}>
            =
          </text>
          <text x={210} y={1452}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            Name
          </text>
        </g>
        <g opacity={bottomCard.opacity}>
          <BentoCard x={560} y={1390} w={460} h={100} />
          <text x={790} y={1452} textAnchor="middle"
            fontFamily={FONT} fontSize={48} fontWeight={800}
            fill={COLORS.accent}>
            ≠
          </text>
          <text x={710} y={1452}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            Params
          </text>
        </g>

        {/* ── Floating accents ───────────────────────────────────────────── */}
        <g transform={`translate(270, ${1600 + breathe})`} opacity={shimmer * 0.15}>
          <circle cx={0} cy={0} r={18}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} />
        </g>
        <g transform={`translate(810, ${1630 + breathe * 0.7})`} opacity={0.12}>
          <circle cx={0} cy={0} r={10} fill={COLORS.accent} />
        </g>

        {/* ── Muted sub-label ────────────────────────────────────────────── */}
        <g opacity={bottomCard.opacity * 0.35}>
          <text x={540} y={1570} textAnchor="middle"
            fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.text_muted}>
            The compiler distinguishes overloads by parameter type and count
          </text>
        </g>

        {/* ── Corner accents ─────────────────────────────────────────────── */}
        <g opacity={label.opacity * 0.3}>
          <path d="M 60,60 L 60,130 M 60,60 L 130,60" fill="none"
            stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
          <path d="M 1020,1740 L 1020,1670 M 1020,1740 L 950,1740" fill="none"
            stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s15.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
