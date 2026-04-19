/**
 * Scene 04 — The Fix Intro
 * "The fix is one check before every cast."
 * CSV: 15.880s → 19.470s | Duration: 108 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline spring
 *   Phase 2 (20–70): Shield + checkmark illustration, bento cards
 *   Phase 3 (60–end): Shield pulse, checkmark glow
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, dur = 30) {
  const p = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - p);
}

export const Scene04_TheFixIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // Phase 1
  const labelE = useSpringEntrance(frame, 0);
  const headE = useSpringEntrance(frame, 6);
  const subE = useSpringEntrance(frame, 12);

  // Phase 2
  const shieldE = useSpringEntrance(frame, 18);
  const checkLen = 80;
  const checkDash = usePathDraw(frame, 30, checkLen, 20);
  const card1E = useSpringEntrance(frame, 36);
  const card2E = useSpringEntrance(frame, 48);
  const card3E = useSpringEntrance(frame, 56);

  // Phase 3
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const glow = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.4, 0.8]);

  // Shield border draw
  const shieldPerimeter = 400;
  const shieldBorderDash = usePathDraw(frame, 20, shieldPerimeter, 35);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s04.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A */}
        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="THE SOLUTION" y={160} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headE.translateY})`} opacity={headE.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.white}>
            One Check
          </text>
        </g>
        <g transform={`translate(0, ${subE.translateY})`} opacity={subE.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={52} fontWeight={800} fill={COLORS.accent}>
            Before every cast
          </text>
        </g>

        {/* Zone C — Large shield illustration */}
        <g opacity={shieldE.opacity} transform={`translate(540, ${720 + shieldE.translateY})`}>
          {/* Shield body */}
          <path d="M0,-120 L100,-70 L100,30 C100,100 0,160 0,160 C0,160 -100,100 -100,30 L-100,-70 Z"
            fill={COLORS.accent} fillOpacity={0.08}
            stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={shieldPerimeter} strokeDashoffset={shieldBorderDash}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />

          {/* Inner shield glow */}
          <path d="M0,-90 L75,-50 L75,20 C75,75 0,120 0,120 C0,120 -75,75 -75,20 L-75,-50 Z"
            fill={COLORS.accent} fillOpacity={0.05 * shimmer} />

          {/* Checkmark */}
          <path d="M -35,10 L -10,40 L 40,-25"
            fill="none" stroke={COLORS.accent} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={checkLen} strokeDashoffset={checkDash} />

          {/* Glow ring */}
          <circle cx={0} cy={20} r={130} fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            opacity={glow * 0.3}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {/* Shield label */}
        <g opacity={shieldE.opacity}>
          <text x={540} y={940} textAnchor="middle" fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}>
            instanceof
          </text>
          <text x={540} y={990} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            Runtime type verification
          </text>
        </g>

        {/* Three step cards */}
        <g opacity={card1E.opacity} transform={`translate(0, ${card1E.translateY})`}>
          <BentoCard x={60} y={1050} w={960} h={140} />
          <rect x={60} y={1050} width={6} height={140} rx={3} fill={COLORS.accent} />
          <circle cx={110} cy={1120} r={24} fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={110} y={1130} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            1
          </text>
          <text x={160} y={1112} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            Check the type
          </text>
          <text x={160} y={1158} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            instanceof verifies at runtime
          </text>
        </g>

        <g opacity={card2E.opacity} transform={`translate(0, ${card2E.translateY})`}>
          <BentoCard x={60} y={1210} w={960} h={140} />
          <rect x={60} y={1210} width={6} height={140} rx={3} fill={COLORS.accent} />
          <circle cx={110} cy={1280} r={24} fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={110} y={1290} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            2
          </text>
          <text x={160} y={1272} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            If true — cast safely
          </text>
          <text x={160} y={1318} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Proceed with downcast
          </text>
        </g>

        <g opacity={card3E.opacity} transform={`translate(0, ${card3E.translateY})`}>
          <BentoCard x={60} y={1370} w={960} h={140} />
          <rect x={60} y={1370} width={6} height={140} rx={3} fill={COLORS.accent} />
          <circle cx={110} cy={1440} r={24} fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={110} y={1450} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            3
          </text>
          <text x={160} y={1432} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            If false — skip entirely
          </text>
          <text x={160} y={1478} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            No crash, no exception
          </text>
        </g>

        {/* Connectors between cards */}
        {[1160, 1320].map((y, i) => (
          <g key={i} opacity={card2E.opacity * 0.4}>
            <line x1={110} y1={y + 30} x2={110} y2={y + 50}
              stroke={COLORS.accent} strokeWidth={2} strokeDasharray="4 4" />
          </g>
        ))}

        {/* Floating circles */}
        <g transform={`translate(900, ${1580 + breathe})`} opacity={card3E.opacity * 0.4}>
          <circle cx={0} cy={0} r={30} fill={COLORS.accent} fillOpacity={0.06} />
          <circle cx={0} cy={0} r={16} fill={COLORS.accent} fillOpacity={0.1} />
        </g>

        <g transform={`translate(180, ${1620 + breathe * 0.7})`} opacity={card3E.opacity * 0.3}>
          <circle cx={0} cy={0} r={22} fill={COLORS.accent} fillOpacity={0.06} />
        </g>

        {/* Bottom tagline */}
        <g opacity={card3E.opacity * 0.7}>
          <text x={540} y={1700} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Safety before speed
          </text>
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s04.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
