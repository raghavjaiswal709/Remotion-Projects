/**
 * Scene 22 — Same Name Different Signatures
 * "Same method name, different parameter signatures."
 * CSV: 78.940s → 81.600s
 * Duration: ~80 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline
 *   Phase 2 (18–60): Three method boxes, same name highlighted, different params
 *   Phase 3 (50–end): Micro pulse
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

export const Scene22_SameNameDiffSig: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 6);
  const h2 = useSpringEntrance(frame, 12);

  const methods = [
    { name: 'bookTicket', params: '(int pid, int rid)', paramCount: '2', color: COLORS.accent },
    { name: 'bookTicket', params: '(int pid, int rid, String seat)', paramCount: '3', color: COLORS.accent },
    { name: 'bookTicket', params: '(int pid, int rid, String seat, String conc)', paramCount: '4', color: COLORS.accent },
  ];

  const mEnts = methods.map((_, i) => useSpringEntrance(frame, 18 + i * 12));

  const bracketLen = 600;
  const bracketDash = usePathDraw(frame, 50, bracketLen, 25);

  const summaryEnt = useSpringEntrance(frame, 55);

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.012;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s22.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="OVERLOADING · DEFINITION" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={64} fontWeight={800} fill={COLORS.white}>
            Same Name
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={390} fontFamily={FONT} fontSize={52} fontWeight={800} fill={COLORS.accent}>
            Different Signatures
          </text>
        </g>

        {/* Method cards */}
        {methods.map((m, i) => {
          const mY = 500 + i * 260;
          const ent = mEnts[i];
          return (
            <g key={i} opacity={ent.opacity} transform={`translate(0, ${ent.translateY})`}>
              <BentoCard x={60} y={mY} w={860} h={220} accent={false} />
              {/* Accent left bar */}
              <rect x={60} y={mY} width={6} height={220} rx={3} fill={COLORS.accent} />

              {/* Method name — highlighted as SAME */}
              <text x={100} y={mY + 60}
                fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={700}
                fill={COLORS.accent}>
                {m.name}
              </text>

              {/* SAME badge */}
              <rect x={350} y={mY + 35} width={80} height={30} rx={8}
                fill={COLORS.accent} opacity={0.12} />
              <text x={390} y={mY + 57} textAnchor="middle"
                fontFamily={FONT} fontSize={14} fontWeight={800} fill={COLORS.accent}>
                SAME
              </text>

              {/* Params — highlighted as DIFFERENT */}
              <text x={100} y={mY + 120}
                fontFamily="'Fira Code', monospace" fontSize={22} fontWeight={500}
                fill={COLORS.white}>
                {m.params}
              </text>

              {/* Param count badge */}
              <rect x={100} y={mY + 150} width={110} height={36} rx={10}
                fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={1.5} />
              <text x={155} y={mY + 175} textAnchor="middle"
                fontFamily={FONT} fontSize={18} fontWeight={800} fill={COLORS.accent}>
                {m.paramCount} params
              </text>

              {/* DIFFERENT badge */}
              <rect x={240} y={mY + 150} width={120} height={36} rx={10}
                fill={COLORS.vibrant_red} opacity={0.1} />
              <text x={300} y={mY + 175} textAnchor="middle"
                fontFamily={FONT} fontSize={14} fontWeight={800} fill={COLORS.vibrant_red}>
                DIFFERENT
              </text>
            </g>
          );
        })}

        {/* Right brace connecting all three */}
        <path d={`M 940,520 C 980,520 980,760 960,760 C 980,760 980,1000 940,1000`}
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={bracketLen} strokeDashoffset={bracketDash}
          strokeLinecap="round" />

        {/* Summary card */}
        <g opacity={summaryEnt.opacity} transform={`translate(0, ${summaryEnt.translateY})`}>
          <BentoCard x={60} y={1320} w={960} h={140} accent />
          <text x={540} y={1400} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            <tspan fill={COLORS.accent}>Same name</tspan> + <tspan fill={COLORS.white}>different params</tspan> = overloading
          </text>
        </g>

        {/* Track */}
        <line x1={60} y1={1580} x2={1020} y2={1580}
          stroke={COLORS.text_muted} strokeWidth={2.5} opacity={0.1} />
        <line x1={60} y1={1596} x2={1020} y2={1596}
          stroke={COLORS.text_muted} strokeWidth={2.5} opacity={0.1} />

        <g transform={`translate(540, ${1700 + breathe})`}>
          <circle cx={0} cy={0} r={10} fill="none" stroke={COLORS.accent}
            strokeWidth={2} opacity={0.05}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s22.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
