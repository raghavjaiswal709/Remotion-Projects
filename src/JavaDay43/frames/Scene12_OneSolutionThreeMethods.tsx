/**
 * Scene 12 — One Solution Three Methods
 * "One solution, three methods, all named bookTicket,"
 * CSV: 41.360s → 44.760s
 * Duration: ~83 frames
 *
 * Animation phases:
 *   Phase 1 (0–30): Label + headline
 *   Phase 2 (20–80): BookingService class box with 3 method slots
 *   Phase 3 (70–end): Glow highlight on "bookTicket"
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
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
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

export const Scene12_OneSolutionThreeMethods: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 6);
  const h2 = useSpringEntrance(frame, 12);

  const classBox = useSpringEntrance(frame, 18);
  const header = useSpringEntrance(frame, 22);
  const m1 = useSpringEntrance(frame, 30);
  const m2 = useSpringEntrance(frame, 40);
  const m3 = useSpringEntrance(frame, 50);
  const insightEnt = useSpringEntrance(frame, 60);

  const classBorderLen = 2 * (800 + 700);
  const classBorderDash = usePathDraw(frame, 18, classBorderLen, 35);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const nameGlow = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.7, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s12.from);

  const methods = [
    { sig: 'bookTicket(int, int)', params: '2 params' },
    { sig: 'bookTicket(int, int, String)', params: '3 params' },
    { sig: 'bookTicket(int, int, String, String)', params: '4 params' },
  ];
  const mEnts = [m1, m2, m3];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="METHOD OVERLOADING · SOLUTION" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            One Solution
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={390} fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.accent}>
            Three Methods
          </text>
        </g>

        {/* Class box */}
        <g opacity={classBox.opacity} transform={`translate(0, ${classBox.translateY})`}>
          {/* Border with draw animation */}
          <rect x={140} y={450} width={800} height={700} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={classBorderLen} strokeDashoffset={classBorderDash} />

          {/* Class header */}
          <g opacity={header.opacity}>
            <rect x={140} y={450} width={800} height={80} rx={20}
              fill={COLORS.accent_dim} />
            <rect x={140} y={510} width={800} height={20}
              fill={COLORS.accent_dim} />
            <text x={540} y={505} textAnchor="middle"
              fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}>
              BookingService
            </text>
            {/* Separator */}
            <line x1={160} y1={535} x2={920} y2={535}
              stroke={COLORS.accent} strokeWidth={1.5} opacity={0.4} />
          </g>

          {/* Three method slots */}
          {methods.map((mt, i) => {
            const ent = mEnts[i];
            const mY = 560 + i * 180;
            return (
              <g key={i} opacity={ent.opacity} transform={`translate(0, ${ent.translateY})`}>
                <rect x={180} y={mY} width={720} height={140} rx={14}
                  fill={COLORS.bg_primary} stroke="rgba(255,255,255,0.1)" strokeWidth={1.5} />
                {/* Method icon */}
                <rect x={200} y={mY + 20} width={50} height={50} rx={10}
                  fill={COLORS.accent_dim} stroke={COLORS.accent} strokeWidth={1.5} />
                <text x={225} y={mY + 52} textAnchor="middle"
                  fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent}>
                  M{i + 1}
                </text>
                {/* Method name — same for all, highlighted */}
                <text x={270} y={mY + 52}
                  fontFamily="'Fira Code', monospace" fontSize={22} fontWeight={700}
                  fill={COLORS.accent} opacity={nameGlow}>
                  bookTicket
                </text>
                {/* Full signature */}
                <text x={270} y={mY + 95}
                  fontFamily="'Fira Code', monospace" fontSize={18} fontWeight={500}
                  fill={COLORS.text_muted}>
                  {mt.sig}
                </text>
                {/* Param badge */}
                <rect x={780} y={mY + 45} width={100} height={30} rx={8}
                  fill={COLORS.accent} opacity={0.15} />
                <text x={830} y={mY + 66} textAnchor="middle"
                  fontFamily={FONT} fontSize={18} fontWeight={800} fill={COLORS.accent}>
                  {mt.params}
                </text>
              </g>
            );
          })}
        </g>

        {/* Insight card */}
        <g opacity={insightEnt.opacity} transform={`translate(0, ${insightEnt.translateY})`}>
          <BentoCard x={60} y={1210} w={960} h={160} accent />
          <rect x={60} y={1210} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={100} y={1275}
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            All named
            <tspan fill={COLORS.accent} fontStyle="italic"> bookTicket</tspan>
          </text>
          <text x={100} y={1325}
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Different parameter lists distinguish them
          </text>
        </g>

        {/* Floating breath */}
        {[200, 540, 880].map((x, i) => (
          <circle key={i} cx={x} cy={1500 + breathe * (1 + i * 0.2)}
            r={14} fill={COLORS.accent} fillOpacity={0.05}
            transform={`scale(${pulse})`} style={{ transformOrigin: `${x}px 1500px` }} />
        ))}

        {/* Track */}
        <line x1={60} y1={1620} x2={1020} y2={1620}
          stroke={COLORS.text_muted} strokeWidth={2.5} opacity={0.12} />
        <line x1={60} y1={1636} x2={1020} y2={1636}
          stroke={COLORS.text_muted} strokeWidth={2.5} opacity={0.12} />

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s12.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
