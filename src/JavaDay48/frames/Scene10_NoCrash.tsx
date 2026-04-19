/**
 * Scene 10 — No Crash
 * "No crash."
 * CSV: 32.220s → 33.120s | Duration: 38 frames
 *
 * Animation phases:
 *   Phase 1 (0–12): Label + headline spring
 *   Phase 2 (8–25): Shield, checkmark, NO CRASH text
 *   Phase 3 (20–end): Pulse, breathe
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

export const Scene10_NoCrash: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelE = useSpringEntrance(frame, 0);
  const heroE = useSpringEntrance(frame, 4);
  const shieldE = useSpringEntrance(frame, 8);
  const checkE = useSpringEntrance(frame, 10);
  const card1E = useSpringEntrance(frame, 14);
  const card2E = useSpringEntrance(frame, 20);

  const checkLen = 60;
  const checkDash = usePathDraw(frame, 10, checkLen, 10);

  const shieldLen = 180;
  const shieldDash = usePathDraw(frame, 8, shieldLen, 15);

  const pulse = 1 + Math.sin(frame * 0.12) * 0.02;
  const breathe = Math.sin(frame * 0.07) * 3;
  const glow = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.08, 0.18]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s10.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="SAFETY RESULT" y={160} />
        </g>

        {/* Giant "NO CRASH" */}
        <g transform={`translate(0, ${heroE.translateY})`} opacity={heroE.opacity}>
          <text x={540} y={420} textAnchor="middle" fontFamily={FONT} fontSize={160} fontWeight={800}
            fill={COLORS.accent} opacity={0.08}>
            NO CRASH
          </text>
          <text x={540} y={420} textAnchor="middle" fontFamily={FONT} fontSize={140} fontWeight={800}
            fill={COLORS.accent}>
            NO CRASH
          </text>
        </g>

        {/* Shield */}
        <g opacity={shieldE.opacity} transform={`translate(540, ${680 + breathe})`}>
          <circle cx={0} cy={0} r={120} fill={COLORS.accent} fillOpacity={glow}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
          <path d="M 0,-70 L 56,-42 L 56,14 C 56,48 0,84 0,84 C 0,84 -56,48 -56,14 L -56,-42 Z"
            fill="none" stroke={COLORS.accent} strokeWidth={4}
            strokeDasharray={shieldLen} strokeDashoffset={shieldDash}
            strokeLinecap="round" strokeLinejoin="round" />
          {/* Checkmark inside shield */}
          <path d="M -20,5 L -5,22 L 25,-12"
            fill="none" stroke={COLORS.accent} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={checkLen} strokeDashoffset={checkDash} />
        </g>

        {/* Explanation */}
        <g opacity={card1E.opacity} transform={`translate(0, ${card1E.translateY})`}>
          <BentoCard x={60} y={860} w={960} h={160} accent />
          <rect x={60} y={860} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={100} y={930} fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.white}>
            instanceof returned
          </text>
          <text x={630} y={930} fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            false
          </text>
          <text x={100} y={985} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            Block skipped — program continues safely
          </text>
        </g>

        {/* Comparison: crash vs safe */}
        <g opacity={card2E.opacity} transform={`translate(0, ${card2E.translateY})`}>
          <BentoCard x={60} y={1060} w={460} h={200} />
          <text x={100} y={1130} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.vibrant_red}>
            Without Check
          </text>
          {/* Explosion icon */}
          <g transform="translate(300, 1180)">
            {[0, 1, 2, 3, 4, 5].map(i => {
              const angle = (i * 60) * Math.PI / 180;
              return (
                <line key={i} x1={0} y1={0}
                  x2={Math.cos(angle) * 24} y2={Math.sin(angle) * 24}
                  stroke={COLORS.vibrant_red} strokeWidth={2.5} strokeLinecap="round" />
              );
            })}
          </g>
          <text x={340} y={1185} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.vibrant_red}>
            BOOM
          </text>

          <BentoCard x={560} y={1060} w={460} h={200} accent />
          <text x={600} y={1130} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            With instanceof
          </text>
          {/* Check icon */}
          <g transform="translate(820, 1180)">
            <circle cx={0} cy={0} r={16} fill="none" stroke={COLORS.accent} strokeWidth={2} />
            <path d="M -7,0 L -2,6 L 8,-5" fill="none" stroke={COLORS.accent} strokeWidth={2.5}
              strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <text x={850} y={1185} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            SAFE
          </text>
        </g>

        {/* Train track at bottom */}
        <g opacity={card2E.opacity * 0.3}>
          <line x1={60} y1={1400} x2={1020} y2={1400} stroke={COLORS.text_muted} strokeWidth={2} />
          <line x1={60} y1={1412} x2={1020} y2={1412} stroke={COLORS.text_muted} strokeWidth={2} />
          {Array.from({ length: 16 }, (_, i) => (
            <rect key={i} x={80 + i * 60} y={1396} width={28} height={20} rx={2}
              fill={COLORS.text_muted} fillOpacity={0.25} />
          ))}
          {/* Train silhouette */}
          <g transform={`translate(${interpolate(frame, [0, 38], [200, 800], { extrapolateRight: 'clamp' })}, 1370)`}>
            <rect x={0} y={0} width={80} height={24} rx={4} fill={COLORS.accent} fillOpacity={0.5} />
            <rect x={-20} y={4} width={20} height={16} rx={3} fill={COLORS.accent} fillOpacity={0.4} />
            <circle cx={10} cy={28} r={5} fill={COLORS.accent} fillOpacity={0.5} />
            <circle cx={60} cy={28} r={5} fill={COLORS.accent} fillOpacity={0.5} />
          </g>
        </g>

        {/* Bottom summary */}
        <g opacity={card2E.opacity * 0.5} transform={`translate(540, ${1550 + breathe})`}>
          <text textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Runtime type safety — guaranteed
          </text>
        </g>

        {/* Floating accent dots */}
        {[0, 1, 2, 3].map(i => (
          <circle key={i} cx={200 + i * 240} cy={1660 + Math.sin(frame * 0.05 + i * 1.5) * 4}
            r={3} fill={COLORS.accent} fillOpacity={0.12} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s10.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
