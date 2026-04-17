/**
 * Scene 18 — Compiler Picks
 * "The compiler looks at what was passed and at compile time picks the correct version."
 * CSV: 65.760s → 71.300s
 * Duration: ~94 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline
 *   Phase 2 (18–70): Compiler magnifying glass scanning method signatures
 *   Phase 3 (60–end): Selected method glows, micro pulse
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

export const Scene18_CompilerPicks: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 6);
  const h2 = useSpringEntrance(frame, 12);

  const compilerEnt = useSpringEntrance(frame, 18);
  const methodsEnt = useSpringEntrance(frame, 14);

  const scanProgress = interpolate(frame, [25, 60], [0, 2], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const selectedIdx = scanProgress >= 2 ? 1 : -1;

  const checkDash = usePathDraw(frame, 58, 60, 18);

  const card1 = useSpringEntrance(frame, 50);
  const card2 = useSpringEntrance(frame, 60);

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.012;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s18.from);

  const methods = [
    { sig: 'bookTicket(int, int)', params: '2 params' },
    { sig: 'bookTicket(int, int, String)', params: '3 params' },
    { sig: 'bookTicket(int, int, String, String)', params: '4 params' },
  ];

  // Magnifying glass scan position
  const scanY = interpolate(scanProgress, [0, 1, 2], [0, 1, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const glassY = 620 + scanY * 200;

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="COMPILE TIME · RESOLUTION" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Compiler Picks
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}>
            The Correct Version
          </text>
        </g>

        {/* Method signatures stack */}
        <g opacity={methodsEnt.opacity} transform={`translate(0, ${methodsEnt.translateY})`}>
          {methods.map((m, i) => {
            const isSelected = selectedIdx === i;
            const mY = 520 + i * 200;
            return (
              <g key={i}>
                <rect x={200} y={mY} width={680} height={160} rx={20}
                  fill={COLORS.bg_secondary}
                  stroke={isSelected ? COLORS.accent : 'rgba(255,255,255,0.1)'}
                  strokeWidth={isSelected ? 3 : 1} />
                {isSelected && (
                  <rect x={200} y={mY} width={680} height={160} rx={20}
                    fill={COLORS.accent} opacity={0.06} />
                )}
                <text x={240} y={mY + 65}
                  fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={600}
                  fill={isSelected ? COLORS.accent : COLORS.white}>
                  {m.sig}
                </text>
                <text x={240} y={mY + 110}
                  fontFamily={FONT} fontSize={22} fontWeight={800}
                  fill={COLORS.text_muted}>
                  {m.params}
                </text>
                {/* Checkmark on selected */}
                {isSelected && (
                  <path d={`M 830,${mY + 55} L 845,${mY + 75} L 865,${mY + 45}`}
                    fill="none" stroke={COLORS.accent} strokeWidth={4}
                    strokeLinecap="round" strokeLinejoin="round"
                    strokeDasharray={60} strokeDashoffset={checkDash} />
                )}
              </g>
            );
          })}
        </g>

        {/* Magnifying glass */}
        <g opacity={compilerEnt.opacity} transform={`translate(130, ${glassY + breathe})`}>
          <circle cx={0} cy={0} r={34} fill="none" stroke={COLORS.accent} strokeWidth={3}
            opacity={shimmer} />
          <line x1={24} y1={24} x2={48} y2={48}
            stroke={COLORS.accent} strokeWidth={4} strokeLinecap="round" />
          <text x={-20} y={-50}
            fontFamily={FONT} fontSize={16} fontWeight={800} fill={COLORS.accent}>
            COMPILER
          </text>
        </g>

        {/* Bottom insight cards */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={1200} w={460} h={200} accent />
          <text x={80} y={1270} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            COMPILE TIME
          </text>
          <text x={80} y={1320} fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.white}>
            Decision made before
          </text>
          <text x={80} y={1360} fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.white}>
            program runs
          </text>
        </g>
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={560} y={1200} w={460} h={200} />
          <text x={580} y={1270} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            SIGNATURE MATCH
          </text>
          <text x={580} y={1320} fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.white}>
            Arguments matched to
          </text>
          <text x={580} y={1360} fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.white}>
            parameter types
          </text>
        </g>

        {/* Track decoration */}
        <line x1={60} y1={1540} x2={1020} y2={1540}
          stroke={COLORS.text_muted} strokeWidth={2.5} opacity={0.1} />
        <line x1={60} y1={1556} x2={1020} y2={1556}
          stroke={COLORS.text_muted} strokeWidth={2.5} opacity={0.1} />

        {/* Pulse circles */}
        {[180, 540, 900].map((cx, i) => (
          <circle key={i} cx={cx} cy={1660 + breathe * (0.8 + i * 0.12)}
            r={6} fill={COLORS.accent} fillOpacity={0.05}
            transform={`scale(${pulse})`} style={{ transformOrigin: `${cx}px 1660px` }} />
        ))}

        {/* Gear at bottom */}
        <g transform={`translate(540, ${1700 + breathe})`} opacity={0.08}>
          <circle cx={0} cy={0} r={35} fill="none" stroke={COLORS.accent} strokeWidth={2} />
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI * 2) / 8;
            return (
              <rect key={i} x={-5} y={-42} width={10} height={14} rx={2}
                fill={COLORS.accent}
                transform={`rotate(${(i * 360) / 8})`}
                style={{ transformOrigin: '0px 0px' }} />
            );
          })}
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s18.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
