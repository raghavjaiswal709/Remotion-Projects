/**
 * Scene 17 — The Calling Code
 * "The calling code passes different arguments."
 * CSV: 62.800s → 65.240s
 * Duration: ~73 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline
 *   Phase 2 (18–60): Three caller boxes sending args to method
 *   Phase 3 (55–end): Micro pulse
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

export const Scene17_CallingCode: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 6);
  const h2 = useSpringEntrance(frame, 12);

  const caller1 = useSpringEntrance(frame, 18);
  const caller2 = useSpringEntrance(frame, 28);
  const caller3 = useSpringEntrance(frame, 38);

  const targetBox = useSpringEntrance(frame, 14);

  const arrow1Len = 260;
  const arrow1Dash = usePathDraw(frame, 22, arrow1Len, 20);
  const arrow2Dash = usePathDraw(frame, 32, arrow1Len, 20);
  const arrow3Dash = usePathDraw(frame, 42, arrow1Len, 20);

  const insightEnt = useSpringEntrance(frame, 50);

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.012;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s17.from);

  const callers = [
    { label: 'Call Site A', code: 'bookTicket(1, 42)', args: '2 args', ent: caller1, dashOff: arrow1Dash },
    { label: 'Call Site B', code: 'bookTicket(1, 42, "FIRST")', args: '3 args', ent: caller2, dashOff: arrow2Dash },
    { label: 'Call Site C', code: 'bookTicket(1, 42, "BIZ", "STU")', args: '4 args', ent: caller3, dashOff: arrow3Dash },
  ];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="CALLING CODE · ARGUMENTS" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Calling Code
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.accent}>
            Passes Different Arguments
          </text>
        </g>

        {/* Target method box — right side */}
        <g opacity={targetBox.opacity} transform={`translate(0, ${targetBox.translateY})`}>
          <rect x={680} y={500} width={340} height={700} rx={20}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2.5} />
          <text x={850} y={560} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            BookingService
          </text>
          <line x1={700} y1={580} x2={1000} y2={580}
            stroke={COLORS.accent} strokeWidth={1} opacity={0.3} />
          {/* Three method slots */}
          {['V1 (2p)', 'V2 (3p)', 'V3 (4p)'].map((v, i) => (
            <g key={i}>
              <rect x={710} y={600 + i * 180} width={280} height={140} rx={14}
                fill={COLORS.bg_primary} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
              <text x={850} y={680 + i * 180} textAnchor="middle"
                fontFamily={FONT} fontSize={24} fontWeight={800}
                fill={COLORS.accent}>
                bookTicket
              </text>
              <text x={850} y={715 + i * 180} textAnchor="middle"
                fontFamily={FONT} fontSize={18} fontWeight={800}
                fill={COLORS.text_muted}>
                {v}
              </text>
            </g>
          ))}
        </g>

        {/* Caller boxes — left side with arrows */}
        {callers.map((c, i) => {
          const cY = 560 + i * 210;
          return (
            <g key={i}>
              <g opacity={c.ent.opacity} transform={`translate(0, ${c.ent.translateY})`}>
                <rect x={60} y={cY} width={360} height={170} rx={16}
                  fill={COLORS.bg_secondary}
                  stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
                <text x={80} y={cY + 40}
                  fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
                  {c.label}
                </text>
                <text x={80} y={cY + 85}
                  fontFamily="'Fira Code', monospace" fontSize={18} fontWeight={600}
                  fill={COLORS.white}>
                  {c.code}
                </text>
                <rect x={80} y={cY + 110} width={100} height={30} rx={8}
                  fill={COLORS.accent} opacity={0.15} />
                <text x={130} y={cY + 131} textAnchor="middle"
                  fontFamily={FONT} fontSize={16} fontWeight={800} fill={COLORS.accent}>
                  {c.args}
                </text>
              </g>
              {/* Arrow */}
              <path d={`M 430,${cY + 85} L 680,${670 + i * 180}`}
                fill="none" stroke={COLORS.accent} strokeWidth={2}
                strokeDasharray={arrow1Len} strokeDashoffset={c.dashOff}
                markerEnd="url(#arrow)" strokeLinecap="round"
                opacity={c.ent.opacity} />
            </g>
          );
        })}

        {/* Insight card */}
        <g opacity={insightEnt.opacity} transform={`translate(0, ${insightEnt.translateY})`}>
          <BentoCard x={60} y={1300} w={960} h={130} accent />
          <rect x={60} y={1300} width={6} height={130} rx={3} fill={COLORS.accent} />
          <text x={100} y={1375}
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Each call site sends <tspan fill={COLORS.accent}>different arguments</tspan>
          </text>
        </g>

        {/* Track */}
        <line x1={60} y1={1580} x2={1020} y2={1580}
          stroke={COLORS.text_muted} strokeWidth={2.5} opacity={0.1} />
        <line x1={60} y1={1596} x2={1020} y2={1596}
          stroke={COLORS.text_muted} strokeWidth={2.5} opacity={0.1} />

        {/* Breathe */}
        {[200, 540, 880].map((cx, i) => (
          <circle key={i} cx={cx} cy={1680 + breathe * (1 + i * 0.15)}
            r={8} fill={COLORS.accent} fillOpacity={0.04}
            transform={`scale(${pulse})`} style={{ transformOrigin: `${cx}px 1680px` }} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s17.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
