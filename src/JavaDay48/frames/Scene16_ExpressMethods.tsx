/**
 * Scene 16 — Access Express Specific Methods
 * "Access Express specific methods."
 * CSV: 47.280s → 49.720s | Duration: 73 frames
 *
 * Animation phases:
 *   Phase 1 (0–20): Label + headline
 *   Phase 2 (15–50): Method cards staggered
 *   Phase 3 (45–end): Pulse, float
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const MONO = "'Fira Code', 'Courier New', monospace";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
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

export const Scene16_ExpressMethods: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelE = useSpringEntrance(frame, 0);
  const headE = useSpringEntrance(frame, 5);
  const objE = useSpringEntrance(frame, 10);
  const m1E = useSpringEntrance(frame, 16);
  const m2E = useSpringEntrance(frame, 24);
  const m3E = useSpringEntrance(frame, 32);
  const m4E = useSpringEntrance(frame, 40);
  const noteE = useSpringEntrance(frame, 46);

  const connLen = 100;
  const c1Dash = usePathDraw(frame, 18, connLen, 14);
  const c2Dash = usePathDraw(frame, 26, connLen, 14);
  const c3Dash = usePathDraw(frame, 34, connLen, 14);
  const c4Dash = usePathDraw(frame, 42, connLen, 14);

  const breathe = Math.sin(frame * 0.05) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s16.from);

  const methods = [
    { name: 'activateExpressMode()', desc: 'High-speed mode' },
    { name: 'getPriorityLevel()', desc: 'Returns priority int' },
    { name: 'getExpressRoute()', desc: 'Express-only routes' },
    { name: 'enableFirstClass()', desc: 'Premium seating' },
  ];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="INSTANCEOF · EXPRESS" y={160} />
        </g>

        <g transform={`translate(0, ${headE.translateY})`} opacity={headE.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Express Methods
          </text>
          <text x={60} y={380} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}>
            Now accessible after safe cast
          </text>
        </g>

        {/* Object reference card */}
        <g opacity={objE.opacity} transform={`translate(0, ${objE.translateY})`}>
          <BentoCard x={60} y={450} w={960} h={110} accent />
          <text x={100} y={510} fontFamily={MONO} fontSize={28} fontWeight={500} fill={COLORS.accent}>
            ExpressTrain e = (ExpressTrain) t;
          </text>
          <text x={920} y={515} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}
            textAnchor="end">✓ safe</text>
        </g>

        {/* Method cards */}
        {methods.map((m, i) => {
          const entrances = [m1E, m2E, m3E, m4E];
          const ent = entrances[i];
          const dashes = [c1Dash, c2Dash, c3Dash, c4Dash];
          const cardY = 620 + i * 170;
          return (
            <g key={i}>
              {/* Connector from top */}
              <line x1={540} y1={560} x2={540} y2={cardY}
                stroke={COLORS.accent} strokeWidth={1.5} strokeLinecap="round"
                strokeDasharray={connLen} strokeDashoffset={dashes[i]}
                opacity={ent.opacity * 0.4} />
              <g opacity={ent.opacity} transform={`translate(0, ${ent.translateY})`}>
                <BentoCard x={60} y={cardY} w={960} h={140} accent={i === 0} />
                <rect x={60} y={cardY} width={6} height={140} rx={3} fill={COLORS.accent}
                  opacity={i === 0 ? 1 : 0.5} />
                {/* Dot indicator */}
                <circle cx={100} cy={cardY + 50} r={8}
                  fill={COLORS.accent} fillOpacity={0.2 * shimmer}
                  stroke={COLORS.accent} strokeWidth={1.5}
                  transform={`scale(${i === 0 ? pulse : 1})`}
                  style={{ transformOrigin: `100px ${cardY + 50}px` }} />
                <text x={130} y={cardY + 58} fontFamily={MONO} fontSize={28} fontWeight={500}
                  fill={COLORS.white}>e.{m.name}</text>
                <text x={130} y={cardY + 105} fontFamily={FONT} fontSize={28} fontWeight={800}
                  fill={COLORS.text_muted}>{m.desc}</text>
              </g>
            </g>
          );
        })}

        {/* Note */}
        <g opacity={noteE.opacity} transform={`translate(0, ${noteE.translateY})`}>
          <BentoCard x={60} y={1310} w={960} h={120} />
          <text x={540} y={1380} textAnchor="middle" fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.text_muted}>
            These methods are
          </text>
          <text x={540} y={1415} textAnchor="middle" fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            only available on ExpressTrain — not on Train
          </text>
        </g>

        {/* Floating accents */}
        {[0, 1, 2, 3].map(i => (
          <circle key={i} cx={200 + i * 220} cy={1540 + Math.sin(frame * 0.04 + i * 0.8) * breathe}
            r={3} fill={COLORS.accent} fillOpacity={0.12} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s16.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
