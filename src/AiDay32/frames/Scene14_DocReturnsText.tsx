/**
 * Scene 14 — Document Returns The Text
 * "Document returns the text."
 * CSV: 37.340s → 38.740s
 * Duration: 42 frames (1.4s)
 *
 * Animation phases:
 *   Phase 1 (0–10): Label + headline
 *   Phase 2 (6–30): Document → text block flowing to agent
 *   Phase 3 (25–end): Shimmer, pulse
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

export const Scene14_DocReturnsText: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelIn = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 3);
  const badge = useSpringEntrance(frame, 5);
  const docIn = useSpringEntrance(frame, 6);
  const arrowLen = 300;
  const arrowDash = usePathDraw(frame, 10, arrowLen, 14);
  const textBlock = useSpringEntrance(frame, 14);
  const agentIn = useSpringEntrance(frame, 18);
  const statusCard = useSpringEntrance(frame, 22);
  const seqCard = useSpringEntrance(frame, 26);

  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const breathe = Math.sin(frame * 0.06) * 3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s14.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g transform={`translate(0, ${labelIn.translateY})`} opacity={labelIn.opacity}>
          <SectionLabel text="TRAJECTORY EXAMPLE · OBSERVATION 2" y={160} opacity={0.8} />
        </g>

        {/* ZONE B */}
        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Document Returns
          </text>
          <text x={60} y={400} fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            the Text
          </text>
        </g>

        {/* Badge o₂ */}
        <g opacity={badge.opacity} transform={`translate(0, ${badge.translateY})`}>
          <rect x={820} y={270} width={200} height={80} rx={16}
            fill={COLORS.accent} fillOpacity={0.12} stroke={COLORS.accent} strokeWidth={2} />
          <text x={920} y={320} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            o₂
          </text>
        </g>

        {/* Document (left) */}
        <g opacity={docIn.opacity} transform={`translate(0, ${docIn.translateY})`}>
          <BentoCard x={60} y={520} w={400} h={500} accent />
          {/* Page fold */}
          <polygon points="420,520 420,555 385,520"
            fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
          <text x={100} y={580} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            AI REVIEW PAPER
          </text>
          {/* Text lines */}
          {Array.from({ length: 10 }, (_, i) => (
            <rect key={i} x={100} y={610 + i * 36}
              width={300 + Math.sin(i * 2.3) * 40} height={10} rx={3}
              fill={COLORS.accent} opacity={0.15 + (i % 3 === 0 ? 0.1 : 0)} />
          ))}
          {/* Sparkle effect — data flowing out */}
          {[0, 1, 2].map(i => {
            const flow = interpolate(frame, [12 + i * 3, 26 + i * 3], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            return (
              <circle key={i} cx={460 + flow * 100} cy={680 + i * 40}
                r={4} fill={COLORS.accent} opacity={(1 - flow) * 0.5} />
            );
          })}
        </g>

        {/* Arrow document → text block */}
        <path d="M 470,760 C 520,760 560,760 610,760"
          fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* Extracted text block (right) */}
        <g opacity={textBlock.opacity} transform={`translate(0, ${textBlock.translateY})`}>
          <BentoCard x={620} y={520} w={400} h={500} />
          <text x={660} y={580} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.white} letterSpacing="0.08em">
            EXTRACTED TEXT
          </text>
          {/* Simulated text content */}
          {[
            'The field of artificial',
            'intelligence has evolved',
            'significantly over the',
            'past decade. Modern',
            'language models can',
            'process and generate',
            'text at unprecedented',
            'scale and quality...',
          ].map((line, i) => (
            <text key={i} x={660} y={620 + i * 40}
              fontFamily={FONT} fontSize={24} fontWeight={800}
              fill={i < 4 ? COLORS.white : COLORS.text_muted}
              opacity={0.7 + (i < 4 ? 0.3 : 0)}>
              {line}
            </text>
          ))}
        </g>

        {/* Status card */}
        <g opacity={statusCard.opacity} transform={`translate(0, ${statusCard.translateY})`}>
          <BentoCard x={60} y={1080} w={960} h={160} accent />
          <rect x={60} y={1080} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={100} y={1135} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            OBSERVATION o₂
          </text>
          <text x={100} y={1185} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Full article text received by agent
          </text>
        </g>

        {/* Trajectory sequence */}
        <g opacity={seqCard.opacity} transform={`translate(0, ${seqCard.translateY})`}>
          <BentoCard x={60} y={1300} w={960} h={260} />
          <text x={100} y={1360} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.12em">
            TRAJECTORY SO FAR
          </text>
          {[
            { label: 's₀', x: 120 },
            { label: 'a₁', x: 240 },
            { label: 'o₁', x: 360 },
            { label: 's₁', x: 480 },
            { label: 'a₂', x: 600 },
            { label: 'o₂', x: 720 },
          ].map((item, i) => (
            <g key={i}>
              <circle cx={item.x} cy={1460} r={22}
                fill={i === 5 ? COLORS.accent : COLORS.bg_primary}
                fillOpacity={i === 5 ? 0.2 : 1}
                stroke={i === 5 ? COLORS.accent : 'rgba(255,255,255,0.12)'}
                strokeWidth={1.5} />
              <text x={item.x} y={1467} textAnchor="middle"
                fontFamily={FONT} fontSize={16} fontWeight={800}
                fill={i === 5 ? COLORS.accent : COLORS.text_muted}>
                {item.label}
              </text>
              {i < 5 && (
                <line x1={item.x + 24} y1={1460} x2={[240, 360, 480, 600, 720][i] - 24} y2={1460}
                  stroke="rgba(255,255,255,0.08)" strokeWidth={1} strokeDasharray="4,3" />
              )}
            </g>
          ))}
          {/* Remaining dots */}
          {[0, 1].map(i => (
            <circle key={i} cx={860 + i * 50} cy={1460}
              r={4} fill={COLORS.text_muted} opacity={0.2} />
          ))}
        </g>

        {/* Floating dots */}
        {[100, 540, 980].map((x, i) => (
          <circle key={i} cx={x} cy={1700 + Math.sin(frame * 0.05 + i) * 3}
            r={4} fill={COLORS.accent} opacity={0.07 * shimmer} />
        ))}

        {/* CAPTION */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s14.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
