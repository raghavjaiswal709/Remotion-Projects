/**
 * Scene 13 — Doesn't Need To Know Express Or Freight
 * "It doesn't need to know if it's express or freight."
 * CSV: 45.140s → 49.080s
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline spring
 *   Phase 2 (20–80): Before/after comparison, hidden details, abstraction shield
 *   Phase 3 (70–end): Pulse, breathe
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
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

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

export const Scene13_DoesntNeedToKnow: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 4);
  const headB = useSpringEntrance(frame, 10);

  // Shield illustration
  const shieldEnt = useSpringEntrance(frame, 14);
  const shieldBorderLen = 500;
  const shieldBorderDash = usePathDraw(frame, 18, shieldBorderLen, 28);

  // Two comparison columns
  const leftCol = useSpringEntrance(frame, 24);
  const rightCol = useSpringEntrance(frame, 34);

  // Detail items with X marks
  const details = ['Lounge access', 'Max speed', 'Cargo weight', 'Express service'];
  const detailEnts = details.map((_, i) => useSpringEntrance(frame, 40 + i * 8));

  // Bottom cards
  const resultCard = useSpringEntrance(frame, 64);
  const insightCard = useSpringEntrance(frame, 72);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s13.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="ABSTRACTION" y={130} />
        </g>

        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={280} fontFamily={FONT} fontSize={68} fontWeight={800} fill={COLORS.white}>
            Doesn't Need
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={370} fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.accent}>
            To Know Express Or Freight
          </text>
        </g>

        {/* Shield illustration — central */}
        <g opacity={shieldEnt.opacity} transform={`translate(540, ${520 + shieldEnt.translateY})`}>
          {/* Shield shape */}
          <path d="M 0,-80 L 60,-60 L 60,30 Q 60,80 0,100 Q -60,80 -60,30 L -60,-60 Z"
            fill={COLORS.accent} fillOpacity={0.06}
            stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={shieldBorderLen} strokeDashoffset={shieldBorderDash} />
          {/* Shield label */}
          <text x={0} y={10} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>
            Train
          </text>
          <text x={0} y={50} textAnchor="middle" fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted}>
            interface
          </text>
        </g>

        {/* Left column — WHAT IT SEES */}
        <g opacity={leftCol.opacity} transform={`translate(0, ${leftCol.translateY})`}>
          <BentoCard x={60} y={680} w={460} h={380} accent />
          <text x={100} y={730} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.accent} letterSpacing="0.1em">
            WHAT CONTROL ROOM SEES
          </text>
          <line x1={80} y1={750} x2={500} y2={750} stroke={COLORS.accent} strokeWidth={1} opacity={0.3} />

          {/* Visible methods with checkmarks */}
          {['depart()', 'arrive()', 'passengers()'].map((m, i) => (
            <g key={i}>
              <text x={100} y={800 + i * 60} fontFamily="'Fira Code', 'Courier New', monospace"
                fontSize={26} fontWeight={500} fill={COLORS.white}>
                {m}
              </text>
              {/* Green check */}
              <circle cx={420} cy={800 + i * 60 - 8} r={14} fill="#22C55E" fillOpacity={0.15} />
              <path d={`M ${406},${800 + i * 60 - 8} L ${416},${800 + i * 60} L ${434},${800 + i * 60 - 18}`}
                fill="none" stroke="#22C55E" strokeWidth={2.5} strokeLinecap="round" />
            </g>
          ))}

          <text x={100} y={1010} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent}>
            Standard Train API only
          </text>
        </g>

        {/* Right column — WHAT IS HIDDEN */}
        <g opacity={rightCol.opacity} transform={`translate(0, ${rightCol.translateY})`}>
          <BentoCard x={560} y={680} w={460} h={380} />
          <text x={600} y={730} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted} letterSpacing="0.1em">
            HIDDEN FROM VIEW
          </text>
          <line x1={580} y1={750} x2={1000} y2={750} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />

          {details.map((d, i) => {
            const ent = detailEnts[i];
            return (
              <g key={i} opacity={ent.opacity} transform={`translate(0, ${ent.translateY})`}>
                <text x={600} y={800 + i * 60} fontFamily={FONT} fontSize={26} fontWeight={800}
                  fill={COLORS.text_muted} textDecoration="line-through" opacity={0.5}>
                  {d}
                </text>
                {/* Red X */}
                <g transform={`translate(960, ${800 + i * 60 - 8})`}>
                  <circle cx={0} cy={0} r={14} fill={COLORS.vibrant_red} fillOpacity={0.12} />
                  <line x1={-6} y1={-6} x2={6} y2={6} stroke={COLORS.vibrant_red} strokeWidth={2} strokeLinecap="round" />
                  <line x1={6} y1={-6} x2={-6} y2={6} stroke={COLORS.vibrant_red} strokeWidth={2} strokeLinecap="round" />
                </g>
              </g>
            );
          })}

          <text x={600} y={1040} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted} opacity={0.6}>
            Subtype-specific features
          </text>
        </g>

        {/* Result card */}
        <g opacity={resultCard.opacity} transform={`translate(0, ${resultCard.translateY})`}>
          <BentoCard x={60} y={1120} w={960} h={120} accent />
          <text x={100} y={1175} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Control room only calls
          </text>
          <text x={640} y={1175} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            Train-level methods
          </text>
          <text x={100} y={1215} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted}>
            Subtype details are abstracted away
          </text>
        </g>

        {/* Insight */}
        <g opacity={insightCard.opacity} transform={`translate(0, ${insightCard.translateY})`}>
          <BentoCard x={60} y={1290} w={960} h={120} />
          <rect x={60} y={1290} width={6} height={120} rx={3} fill={COLORS.accent} />
          <text x={100} y={1345} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            This is the power of programming to an interface
          </text>
          <text x={100} y={1385} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.accent}>
            Loose coupling through upcasting
          </text>
        </g>

        {/* Rail decoration */}
        <g opacity={insightCard.opacity * 0.2}>
          <line x1={60} y1={1500} x2={1020} y2={1500} stroke={COLORS.accent} strokeWidth={2} />
          <line x1={60} y1={1510} x2={1020} y2={1510} stroke={COLORS.accent} strokeWidth={1} opacity={0.4} />
        </g>

        {/* Floating element */}
        <g transform={`translate(540, ${1620 + breathe})`}>
          <circle cx={0} cy={0} r={16} fill="none" stroke={COLORS.accent} strokeWidth={1}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} opacity={0.2} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s13.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
