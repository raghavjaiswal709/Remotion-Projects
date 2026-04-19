/**
 * Scene 11 — Read 50 Docs Pointless
 * "Full human approval on...reads 50 documents is pointless,"
 * CSV: 39.320s → 44.060s | Duration: 142 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline
 *   Phase 2 (20–90): Document stack + approval bottleneck
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

export const Scene11_Read50DocsPointless: React.FC = () => {
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

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Stack animation — docs slide in
  const stackProgress = interpolate(frame, [25, 60], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // X over bottleneck
  const xLen = 50;
  const xDash = usePathDraw(frame, 55, xLen, 15);

  // Counter
  const docCount = Math.round(interpolate(frame, [30, 70], [0, 50], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  }));

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s11.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A */}
        <g transform={`translate(0, ${label.translateY})`} opacity={label.opacity}>
          <SectionLabel text="AUTONOMY · OVER-CONTROL" y={160} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={310} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Pointless
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={420} fontFamily={FONT} fontSize={52} fontWeight={800} fill={COLORS.accent}>
            Approval on Safe Actions
          </text>
        </g>

        {/* Document stack */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={500} w={460} h={400} />

          {/* Stack of document rects */}
          {Array.from({ length: 8 }, (_, i) => {
            const docOpacity = interpolate(stackProgress, [i / 8, (i + 1) / 8], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            return (
              <g key={i} opacity={docOpacity}>
                <rect x={120 + i * 3} y={560 + i * 30} width={280} height={36} rx={6}
                  fill={COLORS.bg_primary}
                  stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
                {/* Text lines in doc */}
                <line x1={135 + i * 3} y1={575 + i * 30}
                  x2={320 + i * 3} y2={575 + i * 30}
                  stroke="rgba(255,255,255,0.1)" strokeWidth={2} />
                <line x1={135 + i * 3} y1={585 + i * 30}
                  x2={260 + i * 3} y2={585 + i * 30}
                  stroke="rgba(255,255,255,0.07)" strokeWidth={2} />
              </g>
            );
          })}

          {/* Doc count */}
          <text x={290} y={850} textAnchor="middle" fontFamily={FONT}
            fontSize={56} fontWeight={800} fill={COLORS.accent}>
            {docCount}
          </text>
          <text x={290} y={890} textAnchor="middle" fontFamily={FONT}
            fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            DOCUMENTS
          </text>
        </g>

        {/* Approval bottleneck — crossed out */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={560} y={500} w={460} h={400} />

          {/* Human reviewing — hourglass */}
          <g transform="translate(790, 640)">
            <circle cx={0} cy={-40} r={28} fill="none"
              stroke={COLORS.text_muted} strokeWidth={2.5} />
            <line x1={0} y1={-12} x2={0} y2={40}
              stroke={COLORS.text_muted} strokeWidth={2.5} />
            <line x1={-25} y1={10} x2={25} y2={10}
              stroke={COLORS.text_muted} strokeWidth={2.5} strokeLinecap="round" />

            {/* Clock / waiting */}
            <circle cx={60} cy={-30} r={22} fill="none"
              stroke={COLORS.text_muted} strokeWidth={2} />
            <line x1={60} y1={-30} x2={60} y2={-16}
              stroke={COLORS.text_muted} strokeWidth={2} />
            <line x1={60} y1={-30} x2={72} y2={-26}
              stroke={COLORS.text_muted} strokeWidth={2} />
          </g>

          {/* Red X over approval process */}
          <path d="M 600,530 L 980,870" fill="none" stroke={COLORS.vibrant_red}
            strokeWidth={5} strokeLinecap="round"
            strokeDasharray={xLen * 8} strokeDashoffset={xDash * 8} />
          <path d="M 980,530 L 600,870" fill="none" stroke={COLORS.vibrant_red}
            strokeWidth={5} strokeLinecap="round"
            strokeDasharray={xLen * 8} strokeDashoffset={xDash * 8} />

          <text x={790} y={820} textAnchor="middle" fontFamily={FONT}
            fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            APPROVE EACH?
          </text>
          <text x={790} y={860} textAnchor="middle" fontFamily={FONT}
            fontSize={28} fontWeight={800} fill={COLORS.vibrant_red}>
            POINTLESS
          </text>
        </g>

        {/* Explanation */}
        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={60} y={940} w={960} h={160} accent />
          <rect x={60} y={940} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={120} y={1020} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            Reading is safe — no data changes
          </text>
          <text x={120} y={1070} fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.text_muted}>
            Low risk actions should run autonomously
          </text>
        </g>

        {/* Bottom cards */}
        <g opacity={card4.opacity} transform={`translate(0, ${card4.translateY})`}>
          <BentoCard x={60} y={1140} w={460} h={180} />
          <text x={100} y={1220} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            Read-only action
          </text>
          <text x={100} y={1270} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            Zero side effects
          </text>
        </g>
        <g opacity={card5.opacity} transform={`translate(0, ${card5.translateY})`}>
          <BentoCard x={560} y={1140} w={460} h={180} />
          <text x={600} y={1220} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.vibrant_red}>
            50x approval calls
          </text>
          <text x={600} y={1270} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            Completely unnecessary
          </text>
        </g>

        {/* Floating accents */}
        {[0, 1, 2].map(i => (
          <circle key={i} cx={300 + i * 240}
            cy={1430 + Math.sin(frame * 0.05 + i) * 6}
            r={3} fill={COLORS.accent} opacity={0.12 * shimmer} />
        ))}

        <g transform={`translate(540, ${1560 + breathe})`}>
          <circle cx={0} cy={0} r={24} fill={COLORS.accent} fillOpacity={0.04} />
          <circle cx={0} cy={0} r={24} fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} opacity={0.2} />
        </g>

        <g opacity={interpolate(frame, [90, 120], [0, 0.3], { extrapolateRight: 'clamp' })}>
          <text x={540} y={1680} textAnchor="middle" fontFamily={FONT}
            fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Over-control defeats the purpose of agents
          </text>
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s11.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
