/**
 * Scene 10 — Delete DB Dangerous
 * "Full autonomy on...deletes database records is dangerous."
 * CSV: 34.710s → 39.320s | Duration: 138 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline
 *   Phase 2 (20–90): Danger illustration
 *   Phase 3 (80–end): Micro animations
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

function usePathDraw(frame: number, startFrame: number, totalLength: number, dur = 30) {
  const p = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - p);
}

export const Scene10_DeleteDBDangerous: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const label = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 14);
  const card1 = useSpringEntrance(frame, 22);
  const card2 = useSpringEntrance(frame, 34);
  const card3 = useSpringEntrance(frame, 46);
  const card4 = useSpringEntrance(frame, 58);
  const card5 = useSpringEntrance(frame, 70);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.1) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Warning flash
  const warningFlash = interpolate(Math.sin(frame * 0.15), [-1, 1], [0.4, 1]);

  // Explosion lines
  const explLen = 60;
  const explDash = usePathDraw(frame, 40, explLen, 15);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s10.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A */}
        <g transform={`translate(0, ${label.translateY})`} opacity={label.opacity}>
          <SectionLabel text="DANGER · FULL AUTONOMY" y={160} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={310} fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.vibrant_red}>
            Dangerous
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={420} fontFamily={FONT} fontSize={64} fontWeight={800} fill={COLORS.white}>
            Full Autonomy Here
          </text>
        </g>

        {/* Zone C — Database illustration */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={500} w={960} h={420} accent />

          {/* Database cylinder */}
          <g transform="translate(300, 600)">
            {/* Cylinder body */}
            <rect x={-80} y={0} width={160} height={180} rx={0}
              fill={COLORS.bg_primary} stroke={COLORS.vibrant_red} strokeWidth={3} />
            {/* Top ellipse */}
            <ellipse cx={0} cy={0} rx={80} ry={24}
              fill={COLORS.bg_secondary} stroke={COLORS.vibrant_red} strokeWidth={3} />
            {/* Bottom ellipse */}
            <ellipse cx={0} cy={180} rx={80} ry={24}
              fill={COLORS.bg_secondary} stroke={COLORS.vibrant_red} strokeWidth={3} />
            {/* Data rows */}
            {[40, 80, 120].map((dy, i) => (
              <line key={i} x1={-50} y1={dy} x2={50} y2={dy}
                stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
            ))}
            <text x={0} y={100} textAnchor="middle" fontFamily={FONT}
              fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
              DB
            </text>
          </g>

          {/* Delete action — trash icon */}
          <g transform="translate(600, 640)" opacity={card2.opacity}>
            <rect x={-50} y={-30} width={100} height={110} rx={8}
              fill="none" stroke={COLORS.vibrant_red} strokeWidth={2.5} />
            <line x1={-50} y1={-10} x2={50} y2={-10}
              stroke={COLORS.vibrant_red} strokeWidth={2.5} />
            <rect x={-20} y={-40} width={40} height={14} rx={3}
              fill="none" stroke={COLORS.vibrant_red} strokeWidth={2} />
            {/* Lines inside trash */}
            {[-15, 0, 15].map(dx => (
              <line key={dx} x1={dx} y1={10} x2={dx} y2={60}
                stroke={COLORS.vibrant_red} strokeWidth={2} opacity={0.5} />
            ))}
            <text x={0} y={110} textAnchor="middle" fontFamily={FONT}
              fontSize={24} fontWeight={800} fill={COLORS.vibrant_red}>
              DELETE
            </text>
          </g>

          {/* Explosion lines from DB */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 300 + Math.cos(rad) * 100;
            const y1 = 690 + Math.sin(rad) * 40;
            const x2 = 300 + Math.cos(rad) * 140;
            const y2 = 690 + Math.sin(rad) * 60;
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={COLORS.vibrant_red} strokeWidth={2}
                strokeDasharray={explLen} strokeDashoffset={explDash}
                opacity={warningFlash * 0.5} strokeLinecap="round" />
            );
          })}

          {/* Warning triangle */}
          <g transform={`translate(800, 600)`} opacity={card2.opacity}>
            <polygon points="0,-50 -45,30 45,30"
              fill="none" stroke={COLORS.vibrant_red}
              strokeWidth={3} opacity={warningFlash} />
            <text x={0} y={18} textAnchor="middle" fontFamily={FONT}
              fontSize={44} fontWeight={800} fill={COLORS.vibrant_red}
              opacity={warningFlash}>
              !
            </text>
          </g>
        </g>

        {/* Consequence cards */}
        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={60} y={960} w={460} h={180} />
          <text x={100} y={1040} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.vibrant_red}>
            Data Lost Forever
          </text>
          <text x={100} y={1090} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            No undo available
          </text>
        </g>
        <g opacity={card4.opacity} transform={`translate(0, ${card4.translateY})`}>
          <BentoCard x={560} y={960} w={460} h={180} />
          <text x={600} y={1040} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.vibrant_red}>
            Irreversible
          </text>
          <text x={600} y={1090} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            Cannot be rolled back
          </text>
        </g>

        {/* Bottom message */}
        <g opacity={card5.opacity} transform={`translate(0, ${card5.translateY})`}>
          <BentoCard x={60} y={1180} w={960} h={160} accent />
          <rect x={60} y={1180} width={6} height={160} rx={3} fill={COLORS.vibrant_red} />
          <text x={120} y={1270} fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.white}>
            Agent must NOT act alone here
          </text>
        </g>

        {/* Floating warning dots */}
        {[0, 1, 2, 3].map(i => (
          <circle key={i} cx={200 + i * 200}
            cy={1450 + Math.sin(frame * 0.05 + i) * 6}
            r={4} fill={COLORS.vibrant_red}
            opacity={0.12 * shimmer} />
        ))}

        {/* Pulsing ring */}
        <g transform={`translate(540, ${1580 + breathe})`}>
          <circle cx={0} cy={0} r={30} fill={COLORS.vibrant_red} fillOpacity={0.04} />
          <circle cx={0} cy={0} r={30} fill="none" stroke={COLORS.vibrant_red}
            strokeWidth={1.5} transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} opacity={0.2} />
        </g>

        {/* Subtle text */}
        <g opacity={interpolate(frame, [80, 110], [0, 0.3], { extrapolateRight: 'clamp' })}>
          <text x={540} y={1680} textAnchor="middle" fontFamily={FONT}
            fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Critical operations need human oversight
          </text>
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s10.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
