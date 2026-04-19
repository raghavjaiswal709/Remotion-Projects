/**
 * Scene 11 — Agent Calls The Search Tool
 * "Agent calls the search tool."
 * CSV: 31.640s → 33.600s
 * Duration: 60 frames (2.0s)
 *
 * Animation phases:
 *   Phase 1 (0–15): Label + headline spring entrance
 *   Phase 2 (10–40): Agent node → arrow path-draw → search tool node
 *   Phase 3 (35–end): Pulse, glow ring on search icon, breathing
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
const SPRING_SOFT = { damping: 22, stiffness: 120, mass: 1.0 } as const;

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

export const Scene11_AgentCallsSearch: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // Phase 1
  const labelIn = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 4);
  const badge = useSpringEntrance(frame, 8);

  // Phase 2
  const agentNode = useSpringEntrance(frame, 10);
  const arrowLen = 400;
  const arrowDash = usePathDraw(frame, 16, arrowLen, 18);
  const searchNode = useSpringEntrance(frame, 22);
  const callLabel = useSpringEntrance(frame, 26);
  const statusCard = useSpringEntrance(frame, 30);
  const detailCard = useSpringEntrance(frame, 34);

  // Phase 3
  const pulse = 1 + Math.sin(frame * 0.08) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.8, 1]);
  const breathe = Math.sin(frame * 0.06) * 3;
  const glowR = interpolate(Math.sin(frame * 0.1), [-1, 1], [55, 70]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s11.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g transform={`translate(0, ${labelIn.translateY})`} opacity={labelIn.opacity}>
          <SectionLabel text="TRAJECTORY EXAMPLE · ACTION 1" y={160} opacity={0.8} />
        </g>

        {/* ZONE B */}
        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={84} fontWeight={800} fill={COLORS.white}>
            Agent Calls
          </text>
          <text x={60} y={405} fontFamily={FONT} fontSize={84} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Search Tool
          </text>
        </g>

        {/* Badge a₁ */}
        <g opacity={badge.opacity} transform={`translate(0, ${badge.translateY})`}>
          <rect x={820} y={270} width={200} height={80} rx={16}
            fill={COLORS.accent} fillOpacity={0.12} stroke={COLORS.accent} strokeWidth={2} />
          <text x={920} y={320} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            a₁
          </text>
        </g>

        {/* ZONE C — Agent node (left) */}
        <g opacity={agentNode.opacity} transform={`translate(200, ${680 + agentNode.translateY + breathe})`}>
          {/* Robot head */}
          <rect x={-80} y={-60} width={160} height={120} rx={20}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2.5} />
          <circle cx={-30} cy={0} r={12} fill={COLORS.accent} opacity={0.5} />
          <circle cx={30} cy={0} r={12} fill={COLORS.accent} opacity={0.5} />
          <line x1={0} y1={-60} x2={0} y2={-85}
            stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round" />
          <circle cx={0} cy={-90} r={7} fill={COLORS.accent} fillOpacity={0.4 * shimmer}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px -90px' }} />
          {/* Body */}
          <rect x={-70} y={70} width={140} height={100} rx={16}
            fill={COLORS.bg_secondary} stroke="rgba(255,255,255,0.1)" strokeWidth={1.5} />
          {/* Arms pointing right */}
          <line x1={70} y1={100} x2={120} y2={80}
            stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" opacity={0.6} />
          <text x={0} y={220} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            AGENT
          </text>
        </g>

        {/* Arrow agent → search */}
        <path
          d="M 320,680 C 420,680 530,680 630,680"
          fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* Call label on arrow */}
        <g opacity={callLabel.opacity} transform={`translate(0, ${callLabel.translateY})`}>
          <rect x={400} y={620} width={200} height={40} rx={8}
            fill={COLORS.accent} fillOpacity={0.1} />
          <text x={500} y={648} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent}>
            search("article")
          </text>
        </g>

        {/* Search tool node (right) */}
        <g opacity={searchNode.opacity} transform={`translate(830, ${680 + searchNode.translateY})`}>
          {/* Glow ring */}
          <circle cx={0} cy={0} r={glowR} fill="none"
            stroke={COLORS.accent} strokeWidth={1.5} opacity={0.15 * shimmer} />
          {/* Main circle */}
          <circle cx={0} cy={0} r={56} fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2.5} />
          {/* Magnifying glass icon */}
          <circle cx={-8} cy={-8} r={20} fill="none"
            stroke={COLORS.white} strokeWidth={3} opacity={0.7} />
          <line x1={8} y1={8} x2={22} y2={22}
            stroke={COLORS.white} strokeWidth={3} strokeLinecap="round" opacity={0.7} />
          <text x={0} y={100} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            SEARCH
          </text>
        </g>

        {/* Status card */}
        <g opacity={statusCard.opacity} transform={`translate(0, ${statusCard.translateY})`}>
          <BentoCard x={60} y={980} w={960} h={200} accent />
          <rect x={60} y={980} width={6} height={200} rx={3} fill={COLORS.accent} />
          <text x={100} y={1040} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            ACTION a₁
          </text>
          <text x={100} y={1090} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            search("summarize article")
          </text>
          <text x={100} y={1140} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Agent selected the search tool with query
          </text>
        </g>

        {/* Trajectory sequence so far */}
        <g opacity={detailCard.opacity} transform={`translate(0, ${detailCard.translateY})`}>
          <BentoCard x={60} y={1240} w={960} h={260} />
          <text x={100} y={1300} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.12em">
            TRAJECTORY SO FAR
          </text>

          {/* s₀ → a₁ chain */}
          {[
            { label: 's₀', desc: 'Goal received', x: 140, active: false },
            { label: 'a₁', desc: 'Call search', x: 520, active: true },
          ].map((item, i) => (
            <g key={i}>
              <circle cx={item.x} cy={1400} r={28}
                fill={item.active ? COLORS.accent : COLORS.bg_primary}
                fillOpacity={item.active ? 0.2 : 1}
                stroke={item.active ? COLORS.accent : 'rgba(255,255,255,0.2)'}
                strokeWidth={2} />
              <text x={item.x} y={1408} textAnchor="middle"
                fontFamily={FONT} fontSize={20} fontWeight={800}
                fill={item.active ? COLORS.accent : COLORS.text_muted}>
                {item.label}
              </text>
              <text x={item.x} y={1450} textAnchor="middle"
                fontFamily={FONT} fontSize={24} fontWeight={800}
                fill={item.active ? COLORS.white : COLORS.text_muted}>
                {item.desc}
              </text>
            </g>
          ))}

          {/* Arrow between */}
          <line x1={175} y1={1400} x2={485} y2={1400}
            stroke={COLORS.accent} strokeWidth={2} opacity={0.4}
            strokeDasharray="6,4" markerEnd="url(#arrow)" />

          {/* Remaining dots */}
          {[0, 1, 2].map(i => (
            <circle key={i} cx={700 + i * 60} cy={1400}
              r={5} fill={COLORS.text_muted} opacity={0.3} />
          ))}
        </g>

        {/* Floating accent circles */}
        {[
          { x: 100, y: 1650, r: 6, phase: 0 },
          { x: 540, y: 1680, r: 8, phase: 1.2 },
          { x: 980, y: 1660, r: 5, phase: 2.4 },
        ].map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y + Math.sin(frame * 0.05 + c.phase) * 4}
            r={c.r} fill={COLORS.accent} opacity={0.1 * shimmer} />
        ))}

        {/* CAPTION */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s11.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
