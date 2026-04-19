/**
 * Scene 19 — Output Alone Doesn't Tell Full Story
 * "The final output alone doesn't tell the full story."
 * CSV: 46.200s → 48.860s
 * Duration: 80 frames (2.67s)
 *
 * Animation phases:
 *   Phase 1 (0–15): Label + headline
 *   Phase 2 (10–55): Output card with X, hidden process card, comparison
 *   Phase 3 (45–end): Shimmer, breathe
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

export const Scene19_OutputAlone: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelIn = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 3);
  const h2 = useSpringEntrance(frame, 8);

  const outputCard = useSpringEntrance(frame, 12);
  const hiddenCard = useSpringEntrance(frame, 22);
  const xMarkLen = 60;
  const xDash = usePathDraw(frame, 16, xMarkLen, 10);

  const compLeft = useSpringEntrance(frame, 32);
  const compRight = useSpringEntrance(frame, 38);
  const bottomCard = useSpringEntrance(frame, 48);

  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s19.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g transform={`translate(0, ${labelIn.translateY})`} opacity={labelIn.opacity}>
          <SectionLabel text="TRAJECTORY · LIMITATION" y={160} opacity={0.8} />
        </g>

        {/* ZONE B */}
        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            The final output
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.vibrant_red} fontStyle="italic">
            doesn't tell the full story
          </text>
        </g>

        {/* OUTPUT card — large with X overlay */}
        <g opacity={outputCard.opacity} transform={`translate(0, ${outputCard.translateY})`}>
          <BentoCard x={60} y={500} w={960} h={280} />
          <text x={100} y={560} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.1em">
            FINAL OUTPUT
          </text>
          <text x={100} y={620} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            "This article covers recent advances
          </text>
          <text x={100} y={674} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            in AI language models..."
          </text>
          {/* Checkmark — looks correct */}
          <circle cx={920} y={560} r={24} fill={COLORS.accent} opacity={0.15} />
          <path d="M 908,560 L 916,568 L 932,552"
            fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
          <text x={100} y={730} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} opacity={0.5}>
            Looks correct...
          </text>
        </g>

        {/* Big X overlay */}
        <line x1={100} y1={520} x2={980} y2={760}
          stroke={COLORS.vibrant_red} strokeWidth={4} opacity={0.15}
          strokeDasharray={xMarkLen * 15} strokeDashoffset={xDash * 15} />
        <line x1={980} y1={520} x2={100} y2={760}
          stroke={COLORS.vibrant_red} strokeWidth={4} opacity={0.15}
          strokeDasharray={xMarkLen * 15} strokeDashoffset={xDash * 15} />

        {/* Hidden process card */}
        <g opacity={hiddenCard.opacity} transform={`translate(0, ${hiddenCard.translateY})`}>
          <BentoCard x={60} y={820} w={960} h={200} accent />
          <rect x={60} y={820} width={6} height={200} rx={3} fill={COLORS.vibrant_red} />
          <text x={100} y={880} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.vibrant_red} letterSpacing="0.1em">
            BUT HOW DID IT GET THERE?
          </text>
          <text x={100} y={940} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            The reasoning process is invisible
          </text>
          <text x={100} y={985} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>
            without the trajectory record
          </text>
        </g>

        {/* Two-column comparison */}
        <g opacity={compLeft.opacity} transform={`translate(0, ${compLeft.translateY})`}>
          <BentoCard x={60} y={1060} w={460} h={320} />
          <text x={100} y={1120} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.1em">
            OUTPUT ONLY
          </text>
          {/* Mystery box */}
          <rect x={180} y={1150} width={240} height={180} rx={16}
            fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={1.5}
            strokeDasharray="8,8" />
          <text x={300} y={1260} textAnchor="middle"
            fontFamily={FONT} fontSize={60} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.3}>
            ?
          </text>
          <text x={300} y={1350} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            Black box
          </text>
        </g>

        <g opacity={compRight.opacity} transform={`translate(0, ${compRight.translateY})`}>
          <BentoCard x={560} y={1060} w={460} h={320} accent />
          <text x={600} y={1120} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            WITH TRAJECTORY
          </text>
          {/* Visible chain */}
          {['s₀', 'a₁', 'o₁', '...', 'o₃'].map((lbl, i) => (
            <g key={i}>
              <circle cx={640 + i * 70} cy={1240} r={16}
                fill={COLORS.accent} fillOpacity={0.12}
                stroke={COLORS.accent} strokeWidth={1} />
              <text x={640 + i * 70} y={1246} textAnchor="middle"
                fontFamily={FONT} fontSize={12} fontWeight={800} fill={COLORS.accent}>
                {lbl}
              </text>
            </g>
          ))}
          <text x={780} y={1350} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent}>
            Full transparency
          </text>
        </g>

        {/* Bottom summary */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={60} y={1440} w={960} h={160} accent />
          <text x={540} y={1536} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            You need the <tspan fill={COLORS.accent} fontStyle="italic">how</tspan>, not just the <tspan fill={COLORS.text_muted}>what</tspan>
          </text>
        </g>

        {/* Floating accents */}
        {[80, 540, 1000].map((x, i) => (
          <circle key={i} cx={x} cy={1700 + Math.sin(frame * 0.05 + i) * 3}
            r={4} fill={COLORS.accent} opacity={0.06 * shimmer} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s19.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
