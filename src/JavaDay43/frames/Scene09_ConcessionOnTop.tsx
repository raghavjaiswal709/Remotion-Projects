/**
 * Scene 09 — Concession On Top
 * "Sometimes a concession type on top of that."
 * CSV: 33.640s → 36.200s
 * Duration: ~68 frames
 *
 * Animation phases:
 *   Phase 1 (0–30): Label + headline
 *   Phase 2 (20–80): 4-field form with concession highlighted
 *   Phase 3 (70–end): Micro-animations
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

export const Scene09_ConcessionOnTop: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 6);
  const h2 = useSpringEntrance(frame, 12);
  const formEnt = useSpringEntrance(frame, 18);
  const f1 = useSpringEntrance(frame, 26);
  const f2 = useSpringEntrance(frame, 32);
  const f3 = useSpringEntrance(frame, 38);
  const f4 = useSpringEntrance(frame, 46);
  const concTypes = useSpringEntrance(frame, 54);
  const insightEnt = useSpringEntrance(frame, 62);

  const borderLen = 2 * (860 + 65);
  const borderDash = usePathDraw(frame, 46, borderLen, 25);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s09.from);

  const fields = [
    { name: 'passengerId', type: 'int', isNew: false },
    { name: 'routeId', type: 'int', isNew: false },
    { name: 'seatClass', type: 'String', isNew: false },
    { name: 'concessionType', type: 'String', isNew: true },
  ];
  const fieldEnts = [f1, f2, f3, f4];

  const concessionTypes = [
    { label: 'Student', icon: 'S' },
    { label: 'Senior', icon: 'R' },
    { label: 'Veteran', icon: 'V' },
    { label: 'Child', icon: 'C' },
  ];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="SCENARIO 3 · FULL" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Plus a
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={60} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            Concession Type
          </text>
        </g>

        {/* 4-field form */}
        <g opacity={formEnt.opacity} transform={`translate(0, ${formEnt.translateY})`}>
          <BentoCard x={60} y={430} w={960} h={440} accent />
          <text x={100} y={490} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            Booking Form — 4 Fields
          </text>

          {fields.map((fld, i) => {
            const yPos = 520 + i * 80;
            const ent = fieldEnts[i];
            const isLast = fld.isNew;
            return (
              <g key={i} opacity={ent.opacity} transform={`translate(0, ${ent.translateY})`}>
                <rect x={100} y={yPos} width={860} height={65} rx={12}
                  fill={isLast ? COLORS.accent_dim : COLORS.bg_primary}
                  stroke={isLast ? COLORS.accent : 'rgba(255,255,255,0.15)'}
                  strokeWidth={isLast ? 2.5 : 1.5}
                  strokeDasharray={isLast ? borderLen : 'none'}
                  strokeDashoffset={isLast ? borderDash : 0} />
                <text x={130} y={yPos + 42}
                  fontFamily="'Fira Code', monospace" fontSize={26} fontWeight={isLast ? 700 : 500}
                  fill={isLast ? COLORS.accent : COLORS.text_muted}>
                  {fld.name}
                </text>
                <text x={920} y={yPos + 42} textAnchor="end"
                  fontFamily="'Fira Code', monospace" fontSize={22} fontWeight={500}
                  fill={isLast ? COLORS.accent : COLORS.text_muted} opacity={isLast ? 0.7 : 0.4}>
                  {fld.type}
                </text>
                {isLast && (
                  <g>
                    <rect x={800} y={yPos + 4} width={70} height={26} rx={8}
                      fill={COLORS.accent} opacity={0.9} />
                    <text x={835} y={yPos + 22} textAnchor="middle"
                      fontFamily={FONT} fontSize={16} fontWeight={800} fill={COLORS.bg_primary}>
                      NEW
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>

        {/* Concession type illustrations */}
        <g opacity={concTypes.opacity} transform={`translate(0, ${concTypes.translateY})`}>
          <BentoCard x={60} y={910} w={960} h={300} />
          <text x={100} y={970} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Concession Types
          </text>
          {concessionTypes.map((ct, i) => {
            const cx = 180 + i * 220;
            return (
              <g key={i}>
                <circle cx={cx} cy={1080} r={40}
                  fill={COLORS.accent_dim} stroke={COLORS.accent} strokeWidth={2} />
                <text x={cx} y={1090} textAnchor="middle"
                  fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
                  {ct.icon}
                </text>
                <text x={cx} y={1150} textAnchor="middle"
                  fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
                  {ct.label}
                </text>
              </g>
            );
          })}
        </g>

        {/* Insight */}
        <g opacity={insightEnt.opacity} transform={`translate(0, ${insightEnt.translateY})`}>
          <BentoCard x={60} y={1250} w={960} h={120} accent />
          <text x={540} y={1324} textAnchor="middle"
            fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.accent}>
            4 parameters → maximum detail
          </text>
        </g>

        {/* Floating field count badge */}
        <g transform={`translate(540, ${1480 + breathe})`}>
          <circle cx={0} cy={0} r={50} fill={COLORS.accent_dim}
            stroke={COLORS.accent} strokeWidth={2}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
          <text x={0} y={12} textAnchor="middle"
            fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent}>
            4
          </text>
        </g>
        <text x={540} y={1570} textAnchor="middle"
          fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
          fields total
        </text>

        {/* Micro dots */}
        {[140, 340, 740, 940].map((x, i) => (
          <circle key={i} cx={x} cy={1650 + breathe * (1 + i * 0.2)}
            r={6} fill={COLORS.accent} fillOpacity={0.06} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s09.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
