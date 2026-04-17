/**
 * Scene 16 — bookTicket(passengerId, routeId, seatClass, concessionType)
 * "bookTicket(passengerId, routeId, seatClass, concessionType)."
 * CSV: 56.120s → 62.260s
 * Duration: ~139 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline
 *   Phase 2 (18–80): 4-param card, concession visual
 *   Phase 3 (75–end): Micro
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

export const Scene16_BookTicketFour: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 6);
  const sigCard = useSpringEntrance(frame, 14);
  const params = [
    useSpringEntrance(frame, 22),
    useSpringEntrance(frame, 30),
    useSpringEntrance(frame, 38),
    useSpringEntrance(frame, 46),
  ];
  const concessionVis = useSpringEntrance(frame, 54);
  const ticketEnt = useSpringEntrance(frame, 64);
  const noteEnt = useSpringEntrance(frame, 74);

  const concBoxPerim = 2 * (800 + 240);
  const concBoxDash = usePathDraw(frame, 54, concBoxPerim, 30);

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.012;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s16.from);

  const paramData = [
    { name: 'passengerId', type: 'int', isNew: false },
    { name: 'routeId', type: 'int', isNew: false },
    { name: 'seatClass', type: 'String', isNew: false },
    { name: 'concessionType', type: 'String', isNew: true },
  ];

  const concTypes = [
    { label: 'SENIOR', icon: 'Sr' },
    { label: 'STUDENT', icon: 'St' },
    { label: 'MILITARY', icon: 'Mi' },
    { label: 'CHILD', icon: 'Ch' },
  ];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="OVERLOAD · VERSION 3" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={540} y={300} textAnchor="middle"
            fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={700} fill={COLORS.accent}>
            bookTicket(id, route, seat, concession)
          </text>
        </g>

        {/* Signature */}
        <g opacity={sigCard.opacity} transform={`translate(0, ${sigCard.translateY})`}>
          <BentoCard x={60} y={340} w={960} h={100} accent />
          <text x={100} y={405}
            fontFamily="'Fira Code', monospace" fontSize={20} fontWeight={600} fill={COLORS.white}>
            void bookTicket(int, int, String, String)
          </text>
        </g>

        {/* 4 param rows */}
        {paramData.map((p, i) => {
          const ent = params[i];
          const pY = 470 + i * 100;
          return (
            <g key={i} opacity={ent.opacity} transform={`translate(0, ${ent.translateY})`}>
              <rect x={60} y={pY} width={960} height={80} rx={14}
                fill={p.isNew ? COLORS.accent_dim : COLORS.bg_secondary}
                stroke={p.isNew ? COLORS.accent : 'rgba(255,255,255,0.1)'}
                strokeWidth={p.isNew ? 2 : 1} />
              {p.isNew && <rect x={60} y={pY} width={6} height={80} rx={3} fill={COLORS.accent} />}
              {/* Number badge */}
              <circle cx={110} cy={pY + 40} r={18}
                fill={p.isNew ? COLORS.accent : 'rgba(255,255,255,0.08)'}
                opacity={p.isNew ? 0.3 : 1} />
              <text x={110} y={pY + 46} textAnchor="middle"
                fontFamily={FONT} fontSize={18} fontWeight={800}
                fill={p.isNew ? COLORS.accent : COLORS.text_muted}>
                {i + 1}
              </text>
              <text x={150} y={pY + 48}
                fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={700}
                fill={p.isNew ? COLORS.accent : COLORS.white}>
                {p.name}
              </text>
              <text x={920} y={pY + 48} textAnchor="end"
                fontFamily={FONT} fontSize={20} fontWeight={800}
                fill={COLORS.text_muted}>
                {p.type}
              </text>
              {p.isNew && (
                <g>
                  <rect x={700} y={pY + 18} width={80} height={30} rx={8}
                    fill={COLORS.accent} opacity={0.2} />
                  <text x={740} y={pY + 39} textAnchor="middle"
                    fontFamily={FONT} fontSize={16} fontWeight={800} fill={COLORS.accent}>
                    + NEW
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Concession type visualization */}
        <g opacity={concessionVis.opacity} transform={`translate(0, ${concessionVis.translateY})`}>
          <rect x={140} y={900} width={800} height={240} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={concBoxPerim} strokeDashoffset={concBoxDash} />
          <text x={540} y={950} textAnchor="middle"
            fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted}>
            CONCESSION TYPES
          </text>

          {concTypes.map((ct, i) => {
            const ctX = 190 + i * 180;
            return (
              <g key={i}>
                <circle cx={ctX + 40} cy={1020} r={30}
                  fill={COLORS.accent_dim} stroke={COLORS.accent} strokeWidth={1.5} />
                <text x={ctX + 40} y={1028} textAnchor="middle"
                  fontFamily={FONT} fontSize={20} fontWeight={800} fill={COLORS.accent}>
                  {ct.icon}
                </text>
                <text x={ctX + 40} y={1080} textAnchor="middle"
                  fontFamily={FONT} fontSize={16} fontWeight={800} fill={COLORS.text_muted}>
                  {ct.label}
                </text>
              </g>
            );
          })}
        </g>

        {/* Ticket card */}
        <g opacity={ticketEnt.opacity} transform={`translate(0, ${ticketEnt.translateY})`}>
          <BentoCard x={60} y={1180} w={960} h={140} accent />
          <text x={100} y={1240}
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            Version 3 — Full Booking
          </text>
          <text x={100} y={1290}
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            All passenger details captured in one call
          </text>
          <text x={920} y={1270} textAnchor="middle"
            fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.accent} opacity={shimmer}>
            V3
          </text>
        </g>

        {/* Note */}
        <g opacity={noteEnt.opacity} transform={`translate(0, ${noteEnt.translateY})`}>
          <BentoCard x={60} y={1350} w={960} h={100} />
          <rect x={60} y={1350} width={6} height={100} rx={3} fill={COLORS.accent} />
          <text x={100} y={1410}
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            <tspan fill={COLORS.accent}>4 parameters</tspan> — maximum detail
          </text>
        </g>

        {/* Track */}
        <line x1={60} y1={1600} x2={1020} y2={1600}
          stroke={COLORS.text_muted} strokeWidth={2.5} opacity={0.1} />
        <line x1={60} y1={1616} x2={1020} y2={1616}
          stroke={COLORS.text_muted} strokeWidth={2.5} opacity={0.1} />

        {/* Breathe */}
        {[200, 540, 880].map((cx, i) => (
          <circle key={i} cx={cx} cy={1680 + breathe * (1 + i * 0.15)}
            r={8} fill={COLORS.accent} fillOpacity={0.04}
            transform={`scale(${pulse})`} style={{ transformOrigin: `${cx}px 1680px` }} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s16.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
