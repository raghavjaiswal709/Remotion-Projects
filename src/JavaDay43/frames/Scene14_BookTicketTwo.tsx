/**
 * Scene 14 — bookTicket(passengerId, routeId)
 * "bookTicket(passengerId, routeId)."
 * CSV: 48.600s → 51.320s
 * Duration: ~82 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline
 *   Phase 2 (18–65): Method signature card, param boxes, ticket illustration
 *   Phase 3 (60–end): Micro-animations
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

export const Scene14_BookTicketTwo: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 6);
  const sigCard = useSpringEntrance(frame, 14);
  const param1 = useSpringEntrance(frame, 24);
  const param2 = useSpringEntrance(frame, 34);
  const ticketEnt = useSpringEntrance(frame, 42);
  const arrowEnt = useSpringEntrance(frame, 50);
  const noteEnt = useSpringEntrance(frame, 58);

  const ticketPerimeter = 2 * (700 + 400);
  const ticketDash = usePathDraw(frame, 42, ticketPerimeter, 30);

  const arrowLen = 120;
  const arrowDash = usePathDraw(frame, 50, arrowLen, 20);

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.012;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s14.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="OVERLOAD · VERSION 1" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={540} y={310} textAnchor="middle"
            fontFamily="'Fira Code', monospace" fontSize={42} fontWeight={700} fill={COLORS.accent}>
            bookTicket(passengerId, routeId)
          </text>
        </g>

        {/* Signature card */}
        <g opacity={sigCard.opacity} transform={`translate(0, ${sigCard.translateY})`}>
          <BentoCard x={60} y={380} w={960} h={160} accent />
          <text x={100} y={440}
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            SIGNATURE
          </text>
          <text x={100} y={500}
            fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={600} fill={COLORS.white}>
            void bookTicket(int passengerId, int routeId)
          </text>
        </g>

        {/* Two param boxes */}
        <g opacity={param1.opacity} transform={`translate(0, ${param1.translateY})`}>
          <rect x={60} y={580} width={460} height={200} rx={20}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          <text x={290} y={660} textAnchor="middle"
            fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.accent}>
            passengerId
          </text>
          <text x={290} y={720} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            int — who is booking
          </text>
        </g>

        <g opacity={param2.opacity} transform={`translate(0, ${param2.translateY})`}>
          <rect x={560} y={580} width={460} height={200} rx={20}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          <text x={790} y={660} textAnchor="middle"
            fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.accent}>
            routeId
          </text>
          <text x={790} y={720} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            int — which route
          </text>
        </g>

        {/* Arrow down to ticket */}
        <g opacity={arrowEnt.opacity}>
          <path d="M 540,790 L 540,870"
            fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
            markerEnd="url(#arrow)" strokeLinecap="round" />
        </g>

        {/* Ticket illustration */}
        <g opacity={ticketEnt.opacity} transform={`translate(0, ${ticketEnt.translateY})`}>
          <rect x={190} y={890} width={700} height={400} rx={24}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={ticketPerimeter} strokeDashoffset={ticketDash} />
          {/* Dashed perforation */}
          <line x1={640} y1={910} x2={640} y2={1270}
            stroke={COLORS.text_muted} strokeWidth={2}
            strokeDasharray="10 8" opacity={0.4} />
          {/* TICKET header */}
          <text x={410} y={970} textAnchor="middle"
            fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent}>
            TICKET
          </text>
          {/* Fields */}
          <text x={230} y={1040}
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Passenger
          </text>
          <rect x={400} y={1015} width={200} height={36} rx={8}
            fill={COLORS.accent_dim} />
          <text x={500} y={1040} textAnchor="middle"
            fontFamily="'Fira Code', monospace" fontSize={20} fontWeight={600} fill={COLORS.accent}>
            #12345
          </text>

          <text x={230} y={1100}
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Route
          </text>
          <rect x={400} y={1075} width={200} height={36} rx={8}
            fill={COLORS.accent_dim} />
          <text x={500} y={1100} textAnchor="middle"
            fontFamily="'Fira Code', monospace" fontSize={20} fontWeight={600} fill={COLORS.accent}>
            R-42
          </text>

          {/* Stub side */}
          <text x={720} y={1040} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            STUB
          </text>
          <text x={720} y={1120} textAnchor="middle"
            fontFamily={FONT} fontSize={64} fontWeight={800} fill={COLORS.accent}>
            V1
          </text>

          {/* Train decorations */}
          <circle cx={260} cy={1220} r={20} fill="none" stroke={COLORS.accent} strokeWidth={2} opacity={0.3} />
          <circle cx={340} cy={1220} r={20} fill="none" stroke={COLORS.accent} strokeWidth={2} opacity={0.3} />
          <circle cx={420} cy={1220} r={20} fill="none" stroke={COLORS.accent} strokeWidth={2} opacity={0.3} />
          <line x1={240} y1={1195} x2={440} y2={1195}
            stroke={COLORS.accent} strokeWidth={2} opacity={0.2} />
        </g>

        {/* Note card */}
        <g opacity={noteEnt.opacity} transform={`translate(0, ${noteEnt.translateY})`}>
          <BentoCard x={60} y={1340} w={960} h={120} />
          <rect x={60} y={1340} width={6} height={120} rx={3} fill={COLORS.accent} />
          <text x={100} y={1415}
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            Minimum info — just <tspan fill={COLORS.accent}>who</tspan> and <tspan fill={COLORS.accent}>where</tspan>
          </text>
        </g>

        {/* Micro float */}
        {[160, 540, 920].map((cx, i) => (
          <circle key={i} cx={cx} cy={1580 + breathe * (1 + i * 0.2)}
            r={8} fill={COLORS.accent} fillOpacity={0.05}
            transform={`scale(${pulse})`} style={{ transformOrigin: `${cx}px 1580px` }} />
        ))}

        {/* Track */}
        <line x1={60} y1={1660} x2={1020} y2={1660}
          stroke={COLORS.text_muted} strokeWidth={2.5} opacity={0.1} />
        <line x1={60} y1={1676} x2={1020} y2={1676}
          stroke={COLORS.text_muted} strokeWidth={2.5} opacity={0.1} />

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s14.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
