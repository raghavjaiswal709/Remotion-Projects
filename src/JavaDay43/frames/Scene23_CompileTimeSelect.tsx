/**
 * Scene 23 — Right Version Selected at Compile Time
 * "The right version selected at compile time."
 * CSV: 82.240s → 84.980s
 * Duration: ~82 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline spring
 *   Phase 2 (18–60): Compiler scanning methods, selecting one with checkmark
 *   Phase 3 (50–end): Micro-animations
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

export const Scene23_CompileTimeSelect: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 6);
  const h2 = useSpringEntrance(frame, 12);

  // Three method slots
  const slots = [
    { sig: 'bookTicket(int, int)', selected: false },
    { sig: 'bookTicket(int, int, String)', selected: true },
    { sig: 'bookTicket(int, int, String, String)', selected: false },
  ];
  const slotEnts = slots.map((_, i) => useSpringEntrance(frame, 20 + i * 10));

  // Compiler pointer scanning down
  const scanY = interpolate(frame, [25, 50], [540, 540 + 1 * 260], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  // Checkmark appear on selected
  const checkSpring = spring({ frame: Math.max(0, frame - 45), fps, config: SPRING_SNAP });

  // Arrow from caller to selected method
  const arrowLen = 300;
  const arrowDash = usePathDraw(frame, 35, arrowLen, 20);

  const summaryEnt = useSpringEntrance(frame, 55);
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.012;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s23.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="COMPILE TIME · SELECTION" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Right Version
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={390} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent}>
            Selected at Compile Time
          </text>
        </g>

        {/* Caller box */}
        <g opacity={slotEnts[0].opacity} transform={`translate(0, ${slotEnts[0].translateY})`}>
          <BentoCard x={60} y={460} w={280} h={100} accent />
          <text x={200} y={520} textAnchor="middle"
            fontFamily="'Fira Code', monospace" fontSize={20} fontWeight={700}
            fill={COLORS.white}>
            service.bookTicket
          </text>
          <text x={200} y={545} textAnchor="middle"
            fontFamily="'Fira Code', monospace" fontSize={16} fontWeight={500}
            fill={COLORS.accent}>
            (1, 2, "AC")
          </text>
        </g>

        {/* Arrow from caller to methods area */}
        <path d="M 340,510 L 460,510"
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        {/* Method slots */}
        {slots.map((s, i) => {
          const mY = 460 + i * 180;
          const ent = slotEnts[i];
          const isSelected = s.selected;
          return (
            <g key={i} opacity={ent.opacity} transform={`translate(0, ${ent.translateY})`}>
              <BentoCard x={470} y={mY} w={500} h={140} accent={isSelected} />
              {isSelected && (
                <rect x={470} y={mY} width={6} height={140} rx={3} fill={COLORS.accent} />
              )}
              <text x={500} y={mY + 60}
                fontFamily="'Fira Code', monospace" fontSize={20} fontWeight={700}
                fill={isSelected ? COLORS.accent : COLORS.text_muted}>
                {s.sig}
              </text>
              {isSelected && (
                <text x={500} y={mY + 95}
                  fontFamily={FONT} fontSize={18} fontWeight={800}
                  fill={COLORS.accent} opacity={0.7}>
                  MATCH FOUND
                </text>
              )}
              {/* Checkmark on selected */}
              {isSelected && (
                <g opacity={checkSpring} transform={`translate(930, ${mY + 70})`}>
                  <circle cx={0} cy={0} r={22} fill={COLORS.accent} opacity={0.15} />
                  <path d="M -8,0 L -2,7 L 10,-8"
                    fill="none" stroke={COLORS.accent} strokeWidth={3}
                    strokeLinecap="round" strokeLinejoin="round" />
                </g>
              )}
              {/* X on non-selected */}
              {!isSelected && frame > 48 && (
                <g opacity={0.35} transform={`translate(930, ${mY + 70})`}>
                  <circle cx={0} cy={0} r={18} fill="none"
                    stroke={COLORS.text_muted} strokeWidth={1.5} />
                  <path d="M -6,-6 L 6,6 M 6,-6 L -6,6"
                    fill="none" stroke={COLORS.text_muted} strokeWidth={2}
                    strokeLinecap="round" />
                </g>
              )}
            </g>
          );
        })}

        {/* Compiler pointer */}
        <g opacity={slotEnts[0].opacity}>
          <polygon points={`450,${scanY - 8} 465,${scanY} 450,${scanY + 8}`}
            fill={COLORS.accent} opacity={0.6} />
        </g>

        {/* Compile-time badge */}
        <g opacity={summaryEnt.opacity} transform={`translate(0, ${summaryEnt.translateY})`}>
          <BentoCard x={120} y={1140} w={840} h={120} accent />
          <text x={540} y={1210} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Resolved <tspan fill={COLORS.accent} fontStyle="italic">before</tspan> execution
          </text>
        </g>

        {/* Decorative timeline */}
        <g opacity={summaryEnt.opacity}>
          <line x1={120} y1={1350} x2={960} y2={1350}
            stroke={COLORS.accent} strokeWidth={2} opacity={0.15} />
          {/* Compile mark */}
          <circle cx={300} cy={1350} r={8} fill={COLORS.accent} opacity={0.3} />
          <text x={300} y={1390} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.accent} opacity={0.5}>
            COMPILE
          </text>
          {/* Run mark */}
          <circle cx={750} cy={1350} r={8} fill={COLORS.text_muted} opacity={0.2} />
          <text x={750} y={1390} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted} opacity={0.4}>
            RUN
          </text>
        </g>

        {/* Tracks */}
        <line x1={60} y1={1560} x2={1020} y2={1560}
          stroke={COLORS.text_muted} strokeWidth={2.5} opacity={0.08} />
        <line x1={60} y1={1576} x2={1020} y2={1576}
          stroke={COLORS.text_muted} strokeWidth={2.5} opacity={0.08} />

        <g transform={`translate(540, ${1680 + breathe})`}>
          <circle cx={0} cy={0} r={6} fill={COLORS.accent} opacity={0.06}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s23.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
