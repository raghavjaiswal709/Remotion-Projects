/**
 * Scene 08 — Static Int Declaration
 * "Train.totalActiveTrains is declared as static int."
 * CSV: 42.880s → 48.010s
 * Duration: 154 frames (5.1s)
 *
 * Animation phases:
 *   Phase 1 (0–25):  Label + headline spring
 *   Phase 2 (18–70): Code declaration with syntax highlighting
 *   Phase 3 (60–end): Keyword pulse, cursor blink
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, FPS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const MONO = "'Fira Code', 'Courier New', monospace";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
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

export const Scene08_StaticIntDeclaration: React.FC = () => {
  const frame = useCurrentFrame();

  const label    = useSpringEntrance(frame, 0);
  const headline = useSpringEntrance(frame, 6);
  const subline  = useSpringEntrance(frame, 12);

  // Code card
  const codeCard = useSpringEntrance(frame, 20);
  const codeBorderLen = 2 * (960 + 500);
  const codeBorderDash = usePathDraw(frame, 20, codeBorderLen, 35);

  // Code lines staggered
  const line1 = useSpringEntrance(frame, 30);
  const line2 = useSpringEntrance(frame, 38);
  const line3 = useSpringEntrance(frame, 46);
  const line4 = useSpringEntrance(frame, 54);

  // Annotation arrow
  const arrowLen = 150;
  const arrowDash = usePathDraw(frame, 56, arrowLen, 20);

  // Phase 3 micro
  const breathe = Math.sin(frame * 0.05) * 3;
  const keyPulse = 1 + Math.sin(frame * 0.08) * 0.02;
  const cursorBlink = Math.sin(frame * 0.2) > 0 ? 1 : 0;

  // Explanation cards
  const exp1 = useSpringEntrance(frame, 62);
  const exp2 = useSpringEntrance(frame, 74);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s08.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${label.translateY})`} opacity={label.opacity}>
          <SectionLabel text="DECLARATION · SYNTAX" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${headline.translateY})`} opacity={headline.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Static Int
          </text>
        </g>
        <g transform={`translate(0, ${subline.translateY})`} opacity={subline.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}>
            totalActiveTrains
          </text>
        </g>

        {/* Code card with animated border */}
        <g opacity={codeCard.opacity} transform={`translate(0, ${codeCard.translateY})`}>
          <BentoCard x={60} y={440} w={960} h={500} />
          <rect x={60} y={440} width={960} height={500} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={codeBorderLen} strokeDashoffset={codeBorderDash} />
          {/* Accent left bar */}
          <rect x={60} y={440} width={6} height={500} rx={3} fill={COLORS.accent} />

          {/* Code line 1: class declaration */}
          <g opacity={line1.opacity}>
            <text x={110} y={520} fontFamily={MONO} fontSize={32} fontWeight={500} fill={COLORS.accent}>
              {'public class '}
            </text>
            <text x={395} y={520} fontFamily={MONO} fontSize={32} fontWeight={500} fill={COLORS.white}>
              Train {'{'}
            </text>
          </g>

          {/* Code line 2: the key static declaration */}
          <g opacity={line2.opacity}>
            <rect x={110} y={570} width={820} height={56} rx={8}
              fill={COLORS.accent} fillOpacity={0.08} />
            <text x={150} y={608} fontFamily={MONO} fontSize={32} fontWeight={700}>
              <tspan fill={COLORS.accent}
                style={{ transform: `scale(${keyPulse})`, transformOrigin: '200px 608px' }}>
                static
              </tspan>
              <tspan fill={COLORS.text_muted}>{' int '}</tspan>
              <tspan fill={COLORS.white}>totalActiveTrains</tspan>
              <tspan fill={COLORS.text_muted}>{' = 0;'}</tspan>
            </text>
          </g>

          {/* Code line 3: empty line / comment */}
          <g opacity={line3.opacity}>
            <text x={150} y={680} fontFamily={MONO} fontSize={28} fontWeight={500}
              fill={COLORS.text_muted} opacity={0.5}>
              {'// shared across ALL Train instances'}
            </text>
          </g>

          {/* Code line 4: closing brace */}
          <g opacity={line4.opacity}>
            <text x={110} y={750} fontFamily={MONO} fontSize={32} fontWeight={500} fill={COLORS.white}>
              {'}'}
            </text>
            {/* Cursor blink */}
            <rect x={140} y={728} width={3} height={28} rx={1}
              fill={COLORS.accent} opacity={cursorBlink} />
          </g>
        </g>

        {/* Annotation arrow */}
        <path d="M 940,598 L 990,598 L 990,700 L 960,700"
          fill="none" stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          strokeLinecap="round" />
        <g opacity={line3.opacity}>
          <text x={950} y={740} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} textAnchor="end">
            KEY LINE
          </text>
        </g>

        {/* Explanation cards */}
        <g opacity={exp1.opacity} transform={`translate(0, ${exp1.translateY + breathe})`}>
          <BentoCard x={60} y={1000} w={460} h={220} accent />
          <text x={100} y={1060} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            static
          </text>
          <text x={100} y={1110} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.white}>
            Belongs to the class,
          </text>
          <text x={100} y={1150} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            not any single object
          </text>
        </g>
        <g opacity={exp2.opacity} transform={`translate(0, ${exp2.translateY})`}>
          <BentoCard x={560} y={1000} w={460} h={220} />
          <text x={600} y={1060} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            int
          </text>
          <text x={600} y={1110} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.white}>
            Whole number counter
          </text>
          <text x={600} y={1150} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            starts at 0
          </text>
        </g>

        {/* Bottom summary */}
        <g opacity={exp2.opacity} transform={`translate(0, ${exp2.translateY})`}>
          <BentoCard x={60} y={1280} w={960} h={140} />
          <text x={540} y={1365} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            One declaration — shared across the entire railway network
          </text>
        </g>

        {/* Decorative dots */}
        {[0,1,2,3,4].map(i => (
          <circle key={i} cx={310 + i * 120} cy={1500} r={3}
            fill={COLORS.accent} opacity={0.2 + Math.sin(frame * 0.05 + i) * 0.15} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s08.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
