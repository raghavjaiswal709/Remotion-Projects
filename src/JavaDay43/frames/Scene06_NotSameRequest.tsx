/**
 * Scene 06 — Not Every Request Same
 * "but not every booking request looks the same."
 * CSV: 24.560s → 27.020s
 * Duration: ~80 frames
 *
 * Animation phases:
 *   Phase 1 (0–30): Label + headline
 *   Phase 2 (20–70): Three different request forms
 *   Phase 3 (60–end): Pulse, shimmer
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

export const Scene06_NotSameRequest: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA     = useSpringEntrance(frame, 6);
  const headlineB     = useSpringEntrance(frame, 12);

  const form1 = useSpringEntrance(frame, 22);
  const form2 = useSpringEntrance(frame, 34);
  const form3 = useSpringEntrance(frame, 46);
  const insightCard = useSpringEntrance(frame, 58);

  const connLen = 120;
  const conn1Dash = usePathDraw(frame, 28, connLen, 20);
  const conn2Dash = usePathDraw(frame, 40, connLen, 20);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s06.from);

  const forms = [
    { title: 'Request A', fields: ['passengerId', 'routeId'], color: COLORS.accent, accent: true },
    { title: 'Request B', fields: ['passengerId', 'routeId', 'seatClass'], color: COLORS.text_muted, accent: false },
    { title: 'Request C', fields: ['passengerId', 'routeId', 'seatClass', 'concession'], color: COLORS.text_muted, accent: false },
  ];
  const entrances = [form1, form2, form3];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="TICKETING ENGINE · REQUESTS" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={76} fontWeight={800} fill={COLORS.white}>
            Not the Same
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent}>
            Every request differs
          </text>
        </g>

        {/* Three request forms stacked */}
        {forms.map((formDef, i) => {
          const ent = entrances[i];
          const cardY = 440 + i * 310;
          const fieldH = 44;
          return (
            <g key={i} opacity={ent.opacity} transform={`translate(0, ${ent.translateY})`}>
              <BentoCard x={60} y={cardY} w={960} h={280} accent={formDef.accent} />
              <rect x={60} y={cardY} width={6} height={280} rx={3} fill={COLORS.accent} />
              <text x={100} y={cardY + 50} fontFamily={FONT} fontSize={38} fontWeight={800}
                fill={formDef.accent ? COLORS.accent : COLORS.white}>
                {formDef.title}
              </text>
              {/* Field lines */}
              {formDef.fields.map((field, fi) => (
                <g key={fi}>
                  <circle cx={120} cy={cardY + 90 + fi * fieldH} r={6} fill={COLORS.accent} opacity={0.7} />
                  <text x={145} y={cardY + 97 + fi * fieldH}
                    fontFamily="'Fira Code', 'Courier New', monospace"
                    fontSize={30} fontWeight={500} fill={COLORS.text_muted}>
                    {field}
                  </text>
                </g>
              ))}
              {/* Field count badge */}
              <rect x={860} y={cardY + 30} width={120} height={50} rx={12}
                fill={COLORS.accent_dim} stroke={COLORS.accent_mid} strokeWidth={1.5} />
              <text x={920} y={cardY + 63} textAnchor="middle"
                fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
                {formDef.fields.length} fields
              </text>
            </g>
          );
        })}

        {/* Connectors between forms */}
        <line x1={540} y1={720} x2={540} y2={750}
          stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={connLen} strokeDashoffset={conn1Dash}
          markerEnd="url(#arrow)" opacity={form2.opacity} />
        <line x1={540} y1={1030} x2={540} y2={1060}
          stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={connLen} strokeDashoffset={conn2Dash}
          markerEnd="url(#arrow)" opacity={form3.opacity} />

        {/* Insight card */}
        <g opacity={insightCard.opacity} transform={`translate(0, ${insightCard.translateY})`}>
          <BentoCard x={60} y={1380} w={960} h={140} accent />
          <text x={540} y={1460} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}>
            Same goal, different data
          </text>
        </g>

        {/* Floating accents */}
        {[{ x: 200, y: 1580 }, { x: 880, y: 1620 }, { x: 540, y: 1660 }].map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y + breathe * (1 + i * 0.2)}
            r={16 + i * 4} fill={COLORS.accent} fillOpacity={0.05 * shimmer}
            transform={`scale(${pulse})`} style={{ transformOrigin: `${p.x}px ${p.y}px` }} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s06.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
