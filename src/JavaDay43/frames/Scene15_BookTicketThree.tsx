/**
 * Scene 15 — bookTicket(passengerId, routeId, seatClass)
 * "bookTicket(passengerId, routeId, seatClass)."
 * CSV: 51.860s → 56.120s
 * Duration: ~128 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline
 *   Phase 2 (18–70): 3-param card, seat class visual
 *   Phase 3 (65–end): Micro-animations
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

export const Scene15_BookTicketThree: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 6);
  const sigCard = useSpringEntrance(frame, 14);
  const p1 = useSpringEntrance(frame, 22);
  const p2 = useSpringEntrance(frame, 30);
  const p3 = useSpringEntrance(frame, 38);
  const seatVis = useSpringEntrance(frame, 46);
  const ticketEnt = useSpringEntrance(frame, 56);
  const noteEnt = useSpringEntrance(frame, 66);

  const seatBoxPerim = 2 * (700 + 300);
  const seatBoxDash = usePathDraw(frame, 46, seatBoxPerim, 30);

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.012;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s15.from);

  const params = [
    { name: 'passengerId', type: 'int', desc: 'who', isNew: false },
    { name: 'routeId', type: 'int', desc: 'where', isNew: false },
    { name: 'seatClass', type: 'String', desc: 'comfort level', isNew: true },
  ];
  const pEnts = [p1, p2, p3];

  const seatClasses = [
    { label: 'ECONOMY', icon: 'E', active: false },
    { label: 'BUSINESS', icon: 'B', active: true },
    { label: 'FIRST', icon: 'F', active: false },
  ];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="OVERLOAD · VERSION 2" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={540} y={300} textAnchor="middle"
            fontFamily="'Fira Code', monospace" fontSize={34} fontWeight={700} fill={COLORS.accent}>
            bookTicket(id, route, seatClass)
          </text>
        </g>

        {/* Signature card */}
        <g opacity={sigCard.opacity} transform={`translate(0, ${sigCard.translateY})`}>
          <BentoCard x={60} y={360} w={960} h={120} accent />
          <text x={100} y={435}
            fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={600} fill={COLORS.white}>
            void bookTicket(int passengerId, int routeId, String seatClass)
          </text>
        </g>

        {/* Three param cards */}
        {params.map((p, i) => {
          const ent = pEnts[i];
          const pY = 520 + i * 130;
          return (
            <g key={i} opacity={ent.opacity} transform={`translate(0, ${ent.translateY})`}>
              <rect x={60} y={pY} width={960} height={110} rx={16}
                fill={p.isNew ? COLORS.accent_dim : COLORS.bg_secondary}
                stroke={p.isNew ? COLORS.accent : 'rgba(255,255,255,0.1)'}
                strokeWidth={p.isNew ? 2 : 1} />
              {p.isNew && <rect x={60} y={pY} width={6} height={110} rx={3} fill={COLORS.accent} />}
              <text x={100} y={pY + 45}
                fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={700}
                fill={p.isNew ? COLORS.accent : COLORS.white}>
                {p.name}
              </text>
              <text x={100} y={pY + 85}
                fontFamily={FONT} fontSize={24} fontWeight={800}
                fill={COLORS.text_muted}>
                {p.type} — {p.desc}
              </text>
              {p.isNew && (
                <g>
                  <rect x={860} y={pY + 25} width={120} height={36} rx={10}
                    fill={COLORS.accent} opacity={0.2} />
                  <text x={920} y={pY + 50} textAnchor="middle"
                    fontFamily={FONT} fontSize={18} fontWeight={800} fill={COLORS.accent}>
                    + NEW
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Seat class visualization */}
        <g opacity={seatVis.opacity} transform={`translate(0, ${seatVis.translateY})`}>
          <rect x={190} y={920} width={700} height={300} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={seatBoxPerim} strokeDashoffset={seatBoxDash} />
          <text x={540} y={970} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            SEAT CLASS OPTIONS
          </text>

          {seatClasses.map((sc, i) => {
            const scX = 240 + i * 200;
            return (
              <g key={i}>
                {/* Seat shape */}
                <rect x={scX} y={1000} width={120} height={140} rx={16}
                  fill={sc.active ? COLORS.accent_dim : COLORS.bg_primary}
                  stroke={sc.active ? COLORS.accent : 'rgba(255,255,255,0.15)'}
                  strokeWidth={sc.active ? 2.5 : 1} />
                {/* Seat back */}
                <rect x={scX + 10} y={1010} width={100} height={60} rx={10}
                  fill={sc.active ? COLORS.accent : 'rgba(255,255,255,0.06)'}
                  opacity={sc.active ? 0.3 : 1} />
                {/* Seat cushion */}
                <rect x={scX + 10} y={1080} width={100} height={40} rx={8}
                  fill={sc.active ? COLORS.accent : 'rgba(255,255,255,0.04)'}
                  opacity={sc.active ? 0.2 : 1} />
                <text x={scX + 60} y={1180} textAnchor="middle"
                  fontFamily={FONT} fontSize={20} fontWeight={800}
                  fill={sc.active ? COLORS.accent : COLORS.text_muted}>
                  {sc.label}
                </text>
              </g>
            );
          })}
        </g>

        {/* Ticket stub */}
        <g opacity={ticketEnt.opacity} transform={`translate(0, ${ticketEnt.translateY})`}>
          <BentoCard x={60} y={1280} w={960} h={140} accent />
          <text x={100} y={1335}
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            Version 2 Ticket
          </text>
          <text x={100} y={1385}
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Adds comfort preference to the booking
          </text>
          <text x={920} y={1370} textAnchor="middle"
            fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.accent} opacity={shimmer}>
            V2
          </text>
        </g>

        {/* Note */}
        <g opacity={noteEnt.opacity} transform={`translate(0, ${noteEnt.translateY})`}>
          <BentoCard x={60} y={1450} w={960} h={100} />
          <rect x={60} y={1450} width={6} height={100} rx={3} fill={COLORS.accent} />
          <text x={100} y={1510}
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            <tspan fill={COLORS.accent}>3 parameters</tspan> — same method name
          </text>
        </g>

        {/* Track lines */}
        <line x1={60} y1={1660} x2={1020} y2={1660}
          stroke={COLORS.text_muted} strokeWidth={2.5} opacity={0.1} />
        <line x1={60} y1={1676} x2={1020} y2={1676}
          stroke={COLORS.text_muted} strokeWidth={2.5} opacity={0.1} />

        {/* Breathe dots */}
        {[200, 540, 880].map((cx, i) => (
          <circle key={i} cx={cx} cy={1720 + breathe * (1 + i * 0.15)}
            r={6} fill={COLORS.accent} fillOpacity={0.04}
            transform={`scale(${pulse})`} style={{ transformOrigin: `${cx}px 1720px` }} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s15.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
