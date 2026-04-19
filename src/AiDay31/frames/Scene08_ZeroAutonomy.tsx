/**
 * Scene 08 — Zero Autonomy
 * "Zero autonomy. The agent proposes every step...executes."
 * CSV: 24.740s → 31.540s | Duration: 204 frames (longest scene)
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline
 *   Phase 2 (20–120): Human-in-loop flow diagram
 *   Phase 3 (100–end): Micro animations
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
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
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

export const Scene08_ZeroAutonomy: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const label = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 14);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const agentCard = useSpringEntrance(frame, 20);
  const humanCard = useSpringEntrance(frame, 32);
  const flowCard = useSpringEntrance(frame, 44);
  const step1 = useSpringEntrance(frame, 56);
  const step2 = useSpringEntrance(frame, 68);
  const step3 = useSpringEntrance(frame, 80);
  const bottomCard = useSpringEntrance(frame, 92);

  // Flow arrows
  const arrowLen = 100;
  const a1 = usePathDraw(frame, 60, arrowLen, 18);
  const a2 = usePathDraw(frame, 72, arrowLen, 18);
  const a3 = usePathDraw(frame, 84, arrowLen, 18);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s08.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${label.translateY})`} opacity={label.opacity}>
          <SectionLabel text="SPECTRUM · ZERO END" y={160} />
        </g>

        {/* ── ZONE B ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={96} fontWeight={800}
            fill={COLORS.vibrant_red}>
            Zero
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={420} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Autonomy
          </text>
        </g>

        {/* ── ZONE C ──────────────────────────────────────────────────────── */}

        {/* Agent card — small, passive */}
        <g opacity={agentCard.opacity} transform={`translate(0, ${agentCard.translateY})`}>
          <BentoCard x={60} y={500} w={460} h={300} />
          {/* Simple robot — dim, waiting */}
          <rect x={180} y={560} width={160} height={130} rx={20}
            fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={3} />
          <circle cx={230} cy={615} r={10} fill="rgba(255,255,255,0.2)" />
          <circle cx={290} cy={615} r={10} fill="rgba(255,255,255,0.2)" />
          {/* Waiting dots */}
          {[0, 1, 2].map(i => (
            <circle key={i} cx={230 + i * 30} cy={660}
              r={4} fill={COLORS.text_muted}
              opacity={interpolate(
                (frame + i * 8) % 30, [0, 10, 20, 30], [0.2, 0.8, 0.2, 0.2],
                { extrapolateRight: 'clamp' }
              )} />
          ))}
          <text x={140} y={740} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            AGENT PROPOSES
          </text>
          <text x={400} y={570} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.text_muted}>
            0%
          </text>
        </g>

        {/* Human card — large, in control */}
        <g opacity={humanCard.opacity} transform={`translate(0, ${humanCard.translateY})`}>
          <BentoCard x={560} y={500} w={460} h={300} accent />
          {/* Human silhouette */}
          <circle cx={790} cy={570} r={30} fill="none"
            stroke={COLORS.accent} strokeWidth={3} />
          <line x1={790} y1={600} x2={790} y2={680}
            stroke={COLORS.accent} strokeWidth={3} />
          <line x1={750} y1={640} x2={830} y2={640}
            stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" />
          {/* Crown / authority symbol */}
          <path d="M 770,535 L 780,520 L 790,540 L 800,520 L 810,535"
            fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
          <text x={600} y={740} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            HUMAN APPROVES
          </text>
        </g>

        {/* Flow diagram: Propose → Review → Approve → Execute */}
        <g opacity={flowCard.opacity} transform={`translate(0, ${flowCard.translateY})`}>
          <BentoCard x={60} y={840} w={960} h={340} accent />

          {/* Step nodes */}
          {[
            { label: 'PROPOSE', x: 150, color: COLORS.text_muted },
            { label: 'REVIEW', x: 390, color: COLORS.accent },
            { label: 'APPROVE', x: 630, color: COLORS.accent },
            { label: 'EXECUTE', x: 870, color: COLORS.white },
          ].map((node, i) => {
            const nodeEntrance = [step1, step2, step3, bottomCard][Math.min(i, 3)];
            return (
              <g key={node.label} opacity={nodeEntrance.opacity}
                transform={`translate(0, ${nodeEntrance.translateY * 0.3})`}>
                <rect x={node.x - 80} y={900} width={160} height={70} rx={16}
                  fill={COLORS.bg_primary}
                  stroke={node.color} strokeWidth={2} />
                <text x={node.x} y={945} textAnchor="middle" fontFamily={FONT}
                  fontSize={22} fontWeight={800} fill={node.color}>
                  {node.label}
                </text>
                {/* Role label */}
                <text x={node.x} y={1000} textAnchor="middle" fontFamily={FONT}
                  fontSize={18} fontWeight={800}
                  fill={i < 1 ? COLORS.text_muted : (i < 3 ? COLORS.accent : COLORS.text_muted)}>
                  {i === 0 ? 'Agent' : i < 3 ? 'Human' : 'Agent'}
                </text>
              </g>
            );
          })}

          {/* Arrows between nodes */}
          <path d="M 230,935 L 300,935" fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={arrowLen} strokeDashoffset={a1}
            markerEnd="url(#arrow)" strokeLinecap="round" />
          <path d="M 470,935 L 540,935" fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={arrowLen} strokeDashoffset={a2}
            markerEnd="url(#arrow)" strokeLinecap="round" />
          <path d="M 710,935 L 780,935" fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={arrowLen} strokeDashoffset={a3}
            markerEnd="url(#arrow)" strokeLinecap="round" />

          {/* Wait indicators */}
          <text x={540} y={1070} textAnchor="middle" fontFamily={FONT}
            fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Every step requires human sign-off
          </text>

          {/* Hourglass icon */}
          <g transform={`translate(${540 + breathe * 2}, 1120)`}>
            <path d="M -12,-20 L 12,-20 L 4,0 L 12,20 L -12,20 L -4,0 Z"
              fill="none" stroke={COLORS.accent} strokeWidth={2} opacity={0.4} />
          </g>
        </g>

        {/* Bottom summary */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={60} y={1220} w={460} h={180} />
          <text x={100} y={1300} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Maximum safety
          </text>
          <text x={100} y={1350} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Every action vetted
          </text>
        </g>

        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={560} y={1220} w={460} h={180} accent />
          <text x={600} y={1300} fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.vibrant_red}>
            Minimum speed
          </text>
          <text x={600} y={1350} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Bottleneck at human
          </text>
        </g>

        {/* Particles */}
        {[0, 1, 2, 3, 4].map(i => (
          <circle key={i}
            cx={120 + i * 220}
            cy={1480 + Math.sin(frame * 0.05 + i) * 8}
            r={3} fill={COLORS.accent}
            opacity={0.15 * shimmer} />
        ))}

        {/* Separator */}
        <line x1={60} y1={1540} x2={1020} y2={1540}
          stroke="rgba(255,255,255,0.04)" strokeWidth={1} />

        {/* Bottom text */}
        <g opacity={interpolate(frame, [130, 160], [0, 0.35], { extrapolateRight: 'clamp' })}>
          <text x={540} y={1600} textAnchor="middle" fontFamily={FONT}
            fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Agent never acts alone — always waits
          </text>
        </g>

        {/* Floating ring */}
        <g transform={`translate(540, ${1680 + breathe})`}>
          <circle cx={0} cy={0} r={28} fill={COLORS.accent} fillOpacity={0.04 * shimmer} />
          <circle cx={0} cy={0} r={28} fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} opacity={0.2} />
        </g>

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s08.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
