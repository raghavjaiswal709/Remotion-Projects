/**
 * Scene 05 — instanceof Code
 * "If T instance of Express Train."
 * CSV: 19.470s → 22.560s | Duration: 93 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline spring
 *   Phase 2 (20–65): Code block with syntax highlighting, keyword reveal
 *   Phase 3 (55–end): Keyword pulse, bracket glow
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const MONO = "'Fira Code', 'Courier New', monospace";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, dur = 30) {
  const p = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - p);
}

export const Scene05_InstanceofCode: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // Phase 1
  const labelE = useSpringEntrance(frame, 0);
  const headE = useSpringEntrance(frame, 6);

  // Phase 2
  const codeCard = useSpringEntrance(frame, 14);
  const keywordE = useSpringEntrance(frame, 22);
  const highlightE = useSpringEntrance(frame, 28);
  const annotCard = useSpringEntrance(frame, 36);
  const breakdownE = useSpringEntrance(frame, 44);

  // Border draw on code card
  const cardPerimeter = 2 * (960 + 300);
  const cardBorderDash = usePathDraw(frame, 16, cardPerimeter, 30);

  // Underline draw for keyword
  const underlineLen = 300;
  const underlineDash = usePathDraw(frame, 24, underlineLen, 20);

  // Phase 3
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.1) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const keywordGlow = interpolate(Math.sin(frame * 0.12), [-1, 1], [0.6, 1]);

  // Bracket glow highlights
  const bracketFlash = interpolate(Math.sin(frame * 0.15), [-1, 1], [0.3, 0.7]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s05.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A */}
        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="SYNTAX · INSTANCEOF" y={160} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headE.translateY})`} opacity={headE.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            The Check
          </text>
          <text x={60} y={380} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent}>
            if (t instanceof ExpressTrain)
          </text>
        </g>

        {/* Zone C — Main code block */}
        <g opacity={codeCard.opacity} transform={`translate(0, ${codeCard.translateY})`}>
          {/* Card background */}
          <BentoCard x={60} y={460} w={960} h={300} />
          {/* Animated border */}
          <rect x={60} y={460} width={960} height={300} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={cardPerimeter} strokeDashoffset={cardBorderDash} />
          {/* Left accent bar */}
          <rect x={60} y={460} width={6} height={300} rx={3} fill={COLORS.accent} />

          {/* Code lines */}
          <text x={100} y={530} fontFamily={MONO} fontSize={36} fontWeight={500} fill={COLORS.text_muted}>
            {'if ('}
          </text>
          <text x={165} y={530} fontFamily={MONO} fontSize={36} fontWeight={500} fill={COLORS.white}>
            t
          </text>
          <text x={195} y={530} fontFamily={MONO} fontSize={36} fontWeight={700} fill={COLORS.accent}
            opacity={keywordGlow}>
            {' instanceof '}
          </text>
          <text x={520} y={530} fontFamily={MONO} fontSize={36} fontWeight={500} fill={COLORS.white}>
            ExpressTrain
          </text>
          <text x={790} y={530} fontFamily={MONO} fontSize={36} fontWeight={500} fill={COLORS.text_muted}>
            {') {'}
          </text>

          <text x={140} y={590} fontFamily={MONO} fontSize={34} fontWeight={500} fill={COLORS.text_muted}>
            {'// safe to cast'}
          </text>
          <text x={140} y={640} fontFamily={MONO} fontSize={34} fontWeight={500} fill={COLORS.white}>
            {'ExpressTrain e = (ExpressTrain) t;'}
          </text>
          <text x={140} y={690} fontFamily={MONO} fontSize={34} fontWeight={500} fill={COLORS.white}>
            {'e.activateExpressMode();'}
          </text>
          <text x={100} y={740} fontFamily={MONO} fontSize={36} fontWeight={500} fill={COLORS.text_muted}>
            {'}'}
          </text>
        </g>

        {/* Keyword underline */}
        <line x1={195} y1={540} x2={495} y2={540}
          stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round"
          strokeDasharray={underlineLen} strokeDashoffset={underlineDash}
          opacity={keywordE.opacity} />

        {/* Keyword highlight callout */}
        <g opacity={highlightE.opacity} transform={`translate(0, ${highlightE.translateY})`}>
          <BentoCard x={60} y={800} w={960} h={140} accent />
          <text x={100} y={860} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            instanceof
          </text>
          <text x={400} y={860} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            — Java keyword
          </text>
          <text x={100} y={910} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            Returns true or false — is this object of this type?
          </text>
        </g>

        {/* Breakdown: three parts */}
        <g opacity={breakdownE.opacity} transform={`translate(0, ${breakdownE.translateY})`}>
          {/* Part 1: reference */}
          <BentoCard x={60} y={970} w={300} h={200} />
          <text x={100} y={1040} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            t
          </text>
          <text x={100} y={1080} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Reference
          </text>
          <text x={100} y={1120} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            The variable
          </text>
          <text x={100} y={1155} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            being checked
          </text>

          {/* Part 2: keyword */}
          <BentoCard x={390} y={970} w={300} h={200} accent />
          <text x={430} y={1040} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            instanceof
          </text>
          <text x={430} y={1080} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Operator
          </text>
          <text x={430} y={1120} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Runtime type
          </text>
          <text x={430} y={1155} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            check
          </text>

          {/* Part 3: type */}
          <BentoCard x={720} y={970} w={300} h={200} />
          <text x={760} y={1040} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            ExpressTrain
          </text>
          <text x={760} y={1080} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Target Type
          </text>
          <text x={760} y={1120} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            The class to
          </text>
          <text x={760} y={1155} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            verify against
          </text>
        </g>

        {/* Arrows between parts */}
        {[340, 670].map((x, i) => (
          <g key={i} opacity={breakdownE.opacity * 0.5}>
            <line x1={x + 10} y1={1070} x2={x + 40} y2={1070}
              stroke={COLORS.accent} strokeWidth={2} markerEnd="url(#arrow)" />
          </g>
        ))}

        {/* Result indicator */}
        <g opacity={annotCard.opacity} transform={`translate(540, ${1300 + breathe})`}>
          <circle cx={0} cy={0} r={44} fill={COLORS.accent} fillOpacity={0.08}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
          <text x={0} y={10} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent} opacity={shimmer}>
            boolean
          </text>
        </g>

        {/* Bottom info */}
        <g opacity={annotCard.opacity}>
          <BentoCard x={60} y={1400} w={960} h={120} />
          <text x={100} y={1470} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Returns
          </text>
          <text x={270} y={1470} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            true
          </text>
          <text x={350} y={1470} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            or
          </text>
          <text x={410} y={1470} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.vibrant_red}>
            false
          </text>
          <text x={510} y={1470} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            — no exception thrown
          </text>
        </g>

        {/* Bracket decorations */}
        <g opacity={codeCard.opacity * bracketFlash}>
          <text x={80} y={620} fontFamily={MONO} fontSize={120} fontWeight={800}
            fill={COLORS.accent} fillOpacity={0.04}>
            {'{ }'}
          </text>
        </g>

        {/* Floating dots */}
        {[0, 1, 2, 3].map(i => (
          <circle key={i} cx={200 + i * 220} cy={1600 + Math.sin(frame * 0.05 + i) * 6}
            r={4} fill={COLORS.accent} fillOpacity={0.2 * shimmer} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s05.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
