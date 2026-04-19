/**
 * Scene 15 — Agent Produces Summary
 * "Agent produces a summary."
 * CSV: 38.740s → 40.040s
 * Duration: 39 frames (1.3s)
 *
 * Animation phases:
 *   Phase 1 (0–10): Label + headline
 *   Phase 2 (6–28): Agent node → summary document output
 *   Phase 3 (22–end): Micro-animations
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

export const Scene15_AgentProducesSummary: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelIn = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 3);
  const badge = useSpringEntrance(frame, 5);
  const agentIn = useSpringEntrance(frame, 6);
  const arrowLen = 280;
  const arrowDash = usePathDraw(frame, 10, arrowLen, 12);
  const summaryIn = useSpringEntrance(frame, 14);
  const statusCard = useSpringEntrance(frame, 18);
  const seqCard = useSpringEntrance(frame, 22);

  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const breathe = Math.sin(frame * 0.06) * 3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s15.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g transform={`translate(0, ${labelIn.translateY})`} opacity={labelIn.opacity}>
          <SectionLabel text="TRAJECTORY EXAMPLE · ACTION 3" y={160} opacity={0.8} />
        </g>

        {/* ZONE B */}
        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Agent Produces
          </text>
          <text x={60} y={400} fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            a Summary
          </text>
        </g>

        {/* Badge a₃ */}
        <g opacity={badge.opacity} transform={`translate(0, ${badge.translateY})`}>
          <rect x={820} y={270} width={200} height={80} rx={16}
            fill={COLORS.accent} fillOpacity={0.12} stroke={COLORS.accent} strokeWidth={2} />
          <text x={920} y={320} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            a₃
          </text>
        </g>

        {/* AGENT robot (left) */}
        <g opacity={agentIn.opacity} transform={`translate(140, ${620 + agentIn.translateY})`}>
          <circle cx={0} cy={0} r={70} fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2.5} />
          {/* Head */}
          <rect x={-30} y={-50} width={60} height={45} rx={10}
            fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={1.5} />
          {/* Eyes */}
          <circle cx={-12} cy={-32} r={5} fill={COLORS.accent} opacity={pulse} />
          <circle cx={12} cy={-32} r={5} fill={COLORS.accent} opacity={pulse} />
          {/* Antenna */}
          <line x1={0} y1={-50} x2={0} y2={-65} stroke={COLORS.accent} strokeWidth={1.5} />
          <circle cx={0} cy={-68} r={3} fill={COLORS.accent} />
          {/* Body */}
          <rect x={-25} y={0} width={50} height={35} rx={6}
            fill={COLORS.bg_primary} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          <text x={0} y={82} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent}>
            AGENT
          </text>
        </g>

        {/* Processing gear */}
        <g opacity={agentIn.opacity * shimmer} transform={`translate(140, ${640 + breathe})`}>
          <circle cx={0} cy={0} r={16} fill="none" stroke={COLORS.accent} strokeWidth={1} />
          {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            return (
              <rect key={i} x={Math.cos(rad) * 16 - 3} y={Math.sin(rad) * 16 - 3}
                width={6} height={6} rx={1}
                fill={COLORS.accent} opacity={0.3}
                transform={`rotate(${angle + frame * 2}, ${Math.cos(rad) * 16}, ${Math.sin(rad) * 16})`} />
            );
          })}
        </g>

        {/* Arrow agent → summary */}
        <path d="M 230,640 C 340,640 440,640 550,640"
          fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* Label on arrow */}
        {arrowDash < arrowLen * 0.5 && (
          <text x={390} y={618} textAnchor="middle"
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={20} fontWeight={500} fill={COLORS.accent}
            opacity={interpolate(frame, [14, 20], [0, 0.7], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}>
            summarize()
          </text>
        )}

        {/* Summary document (right) */}
        <g opacity={summaryIn.opacity} transform={`translate(0, ${summaryIn.translateY})`}>
          <BentoCard x={570} y={520} w={440} h={340} accent />
          {/* Checkmark icon */}
          <circle cx={790} cy={570} r={22} fill={COLORS.accent} opacity={0.15} />
          <path d="M 778,570 L 786,578 L 802,562"
            fill="none" stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" />
          <text x={610} y={580} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            SUMMARY OUTPUT
          </text>
          {/* Summary lines */}
          {[
            'This article reviews the',
            'evolution of AI language',
            'models, highlighting key',
            'advances in scale and',
            'capability over the...',
          ].map((line, i) => (
            <text key={i} x={610} y={625 + i * 38}
              fontFamily={FONT} fontSize={24} fontWeight={800}
              fill={i < 3 ? COLORS.white : COLORS.text_muted}
              opacity={0.7 + (i < 3 ? 0.3 : 0)}>
              {line}
            </text>
          ))}
        </g>

        {/* Status card */}
        <g opacity={statusCard.opacity} transform={`translate(0, ${statusCard.translateY})`}>
          <BentoCard x={60} y={920} w={960} h={160} accent />
          <rect x={60} y={920} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={100} y={980} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            ACTION a₃
          </text>
          <text x={100} y={1030} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Agent generates condensed summary
          </text>
        </g>

        {/* Trajectory so far */}
        <g opacity={seqCard.opacity} transform={`translate(0, ${seqCard.translateY})`}>
          <BentoCard x={60} y={1140} w={960} h={260} />
          <text x={100} y={1200} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.12em">
            TRAJECTORY SO FAR
          </text>
          {[
            { label: 's₀', x: 110 },
            { label: 'a₁', x: 210 },
            { label: 'o₁', x: 310 },
            { label: 's₁', x: 410 },
            { label: 'a₂', x: 510 },
            { label: 'o₂', x: 610 },
            { label: 's₂', x: 710 },
            { label: 'a₃', x: 810 },
          ].map((item, i) => (
            <g key={i}>
              <circle cx={item.x} cy={1300} r={22}
                fill={i === 7 ? COLORS.accent : COLORS.bg_primary}
                fillOpacity={i === 7 ? 0.2 : 1}
                stroke={i === 7 ? COLORS.accent : 'rgba(255,255,255,0.12)'}
                strokeWidth={1.5} />
              <text x={item.x} y={1307} textAnchor="middle"
                fontFamily={FONT} fontSize={14} fontWeight={800}
                fill={i === 7 ? COLORS.accent : COLORS.text_muted}>
                {item.label}
              </text>
              {i < 7 && (
                <line x1={item.x + 24} y1={1300}
                  x2={[210, 310, 410, 510, 610, 710, 810][i] - 24} y2={1300}
                  stroke="rgba(255,255,255,0.08)" strokeWidth={1} strokeDasharray="4,3" />
              )}
            </g>
          ))}
          {/* Remaining dots */}
          <circle cx={910} cy={1300} r={4} fill={COLORS.text_muted} opacity={0.2} />
        </g>

        {/* Final output preview card */}
        <g opacity={summaryIn.opacity * 0.6} transform={`translate(0, ${summaryIn.translateY * 0.5})`}>
          <BentoCard x={60} y={1460} w={960} h={140} />
          <text x={100} y={1540} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Final output delivered to user
          </text>
          <path d="M 940,1520 L 970,1540 L 940,1560"
            fill="none" stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round" opacity={0.4} />
        </g>

        {/* Floating accents */}
        {[80, 540, 1000].map((x, i) => (
          <circle key={i} cx={x} cy={1700 + Math.sin(frame * 0.05 + i) * 3}
            r={4} fill={COLORS.accent} opacity={0.06 * shimmer} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s15.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
