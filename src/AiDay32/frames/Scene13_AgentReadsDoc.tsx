/**
 * Scene 13 — Agent Reads A Document
 * "Agent reads a document."
 * CSV: 35.440s → 37.340s
 * Duration: 57 frames (1.9s)
 *
 * Animation phases:
 *   Phase 1 (0–12): Label + headline
 *   Phase 2 (8–40): Agent → read arrow → document with scan lines
 *   Phase 3 (35–end): Scan line sweeps, pulse
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

export const Scene13_AgentReadsDoc: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelIn = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 4);
  const badge = useSpringEntrance(frame, 6);
  const agentIn = useSpringEntrance(frame, 8);
  const arrowLen = 350;
  const arrowDash = usePathDraw(frame, 14, arrowLen, 16);
  const docIn = useSpringEntrance(frame, 18);
  const scanLine = interpolate(frame, [22, 45], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const statusCard = useSpringEntrance(frame, 28);
  const seqCard = useSpringEntrance(frame, 34);

  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const breathe = Math.sin(frame * 0.06) * 3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s13.from);

  // Document text lines (simulated)
  const docLines = 12;
  const scannedLines = Math.floor(scanLine * docLines);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g transform={`translate(0, ${labelIn.translateY})`} opacity={labelIn.opacity}>
          <SectionLabel text="TRAJECTORY EXAMPLE · ACTION 2" y={160} opacity={0.8} />
        </g>

        {/* ZONE B */}
        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={84} fontWeight={800} fill={COLORS.white}>
            Agent Reads
          </text>
          <text x={60} y={405} fontFamily={FONT} fontSize={84} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            a Document
          </text>
        </g>

        {/* Badge a₂ */}
        <g opacity={badge.opacity} transform={`translate(0, ${badge.translateY})`}>
          <rect x={820} y={270} width={200} height={80} rx={16}
            fill={COLORS.accent} fillOpacity={0.12} stroke={COLORS.accent} strokeWidth={2} />
          <text x={920} y={320} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            a₂
          </text>
        </g>

        {/* Agent node */}
        <g opacity={agentIn.opacity} transform={`translate(180, ${660 + agentIn.translateY + breathe})`}>
          <rect x={-65} y={-50} width={130} height={100} rx={18}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={-22} cy={0} r={10} fill={COLORS.accent} opacity={0.5} />
          <circle cx={22} cy={0} r={10} fill={COLORS.accent} opacity={0.5} />
          <line x1={0} y1={-50} x2={0} y2={-72}
            stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round" />
          <circle cx={0} cy={-76} r={6} fill={COLORS.accent} opacity={0.3 * shimmer} />
          <text x={0} y={90} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            AGENT
          </text>
        </g>

        {/* Arrow */}
        <path d="M 280,660 C 380,660 460,660 520,660"
          fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* Read label */}
        <g opacity={interpolate(frame, [16, 24], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}>
          <rect x={350} y={612} width={140} height={36} rx={8}
            fill={COLORS.accent} fillOpacity={0.1} />
          <text x={420} y={637} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.accent}>
            read(doc)
          </text>
        </g>

        {/* Document */}
        <g opacity={docIn.opacity} transform={`translate(0, ${docIn.translateY})`}>
          <BentoCard x={560} y={520} w={460} h={540} accent />
          {/* Page fold */}
          <polygon points="980,520 980,560 940,520"
            fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          {/* Title */}
          <text x={600} y={580} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>
            AI Review Paper
          </text>
          {/* Text lines with scan */}
          {Array.from({ length: docLines }, (_, i) => {
            const lineWidth = 340 + Math.sin(i * 1.7) * 60;
            const scanned = i < scannedLines;
            return (
              <g key={i}>
                <rect x={600} y={600 + i * 34} width={lineWidth} height={10} rx={3}
                  fill={scanned ? COLORS.accent : 'rgba(255,255,255,0.08)'}
                  opacity={scanned ? 0.25 : 0.6} />
              </g>
            );
          })}
          {/* Scan indicator line */}
          {scanLine < 1 && (
            <line
              x1={596} y1={600 + scannedLines * 34}
              x2={960} y2={600 + scannedLines * 34}
              stroke={COLORS.accent} strokeWidth={2} opacity={0.6} />
          )}
        </g>

        {/* Status card */}
        <g opacity={statusCard.opacity} transform={`translate(0, ${statusCard.translateY})`}>
          <BentoCard x={60} y={1120} w={960} h={160} accent />
          <rect x={60} y={1120} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={100} y={1175} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            ACTION a₂
          </text>
          <text x={100} y={1225} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            read("AI Review Paper")
          </text>
        </g>

        {/* Trajectory seq */}
        <g opacity={seqCard.opacity} transform={`translate(0, ${seqCard.translateY})`}>
          <BentoCard x={60} y={1340} w={960} h={260} />
          <text x={100} y={1400} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.12em">
            TRAJECTORY SO FAR
          </text>
          {[
            { label: 's₀', x: 140 },
            { label: 'a₁', x: 300 },
            { label: 'o₁', x: 460 },
            { label: 's₁', x: 620 },
            { label: 'a₂', x: 780 },
          ].map((item, i) => (
            <g key={i}>
              <circle cx={item.x} cy={1500} r={24}
                fill={i === 4 ? COLORS.accent : COLORS.bg_primary}
                fillOpacity={i === 4 ? 0.2 : 1}
                stroke={i === 4 ? COLORS.accent : 'rgba(255,255,255,0.15)'}
                strokeWidth={1.5} />
              <text x={item.x} y={1507} textAnchor="middle"
                fontFamily={FONT} fontSize={18} fontWeight={800}
                fill={i === 4 ? COLORS.accent : COLORS.text_muted}>
                {item.label}
              </text>
              {i < 4 && (
                <line x1={item.x + 28} y1={1500} x2={[300, 460, 620, 780][i] - 28} y2={1500}
                  stroke="rgba(255,255,255,0.1)" strokeWidth={1} strokeDasharray="4,3" />
              )}
            </g>
          ))}
          {/* Remaining dot */}
          <circle cx={920} cy={1500} r={4} fill={COLORS.text_muted} opacity={0.25} />
        </g>

        {/* Decorative dots */}
        {[120, 540, 960].map((x, i) => (
          <circle key={i} cx={x} cy={1700 + Math.sin(frame * 0.05 + i) * 3}
            r={4} fill={COLORS.accent} opacity={0.08 * shimmer} />
        ))}

        {/* CAPTION */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s13.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
