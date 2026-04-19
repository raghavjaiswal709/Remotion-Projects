/**
 * Scene 07 — Not Just The Final Output
 * "Not just the final output,"
 * CSV: 22.000s → 23.880s
 * Duration: 57 frames (1.9s)
 *
 * Animation phases:
 *   Phase 1 (0–15): Label + headline spring
 *   Phase 2 (10–40): Crossed-out output box, emphasis on "NOT JUST"
 *   Phase 3 (35–end): Pulse, shimmer on elements
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

export const Scene07_NotJustOutput: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──
  const labelIn = useSpringEntrance(frame, 0);
  const headlineWords = ['Not', 'just', 'the', 'final', 'output.'];
  const wordSprings = headlineWords.map((_, i) => {
    const f = Math.max(0, frame - i * 5);
    const sp = spring({ frame: f, fps, config: SPRING_SNAP });
    const ty = interpolate(sp, [0, 1], [24, 0]);
    const op = interpolate(sp, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });
    return { ty, op };
  });

  // ── Phase 2 ──
  const outputCard = useSpringEntrance(frame, 14);
  const xLineLen = 240;
  const xLineDash = usePathDraw(frame, 20, xLineLen, 15);
  const xLineDash2 = usePathDraw(frame, 22, xLineLen, 15);

  const beyondCard = useSpringEntrance(frame, 22);
  const processCards = [0, 1, 2].map(i => useSpringEntrance(frame, 28 + i * 8));

  // ── Phase 3 ──
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const breathe = Math.sin(frame * 0.06) * 4;

  // X line animation (the cross-out)
  const xOpacity = interpolate(frame, [20, 28], [0, 0.9], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s07.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ── */}
        <g transform={`translate(0, ${labelIn.translateY})`} opacity={labelIn.opacity}>
          <SectionLabel text="MODULE 5 · TRAJECTORY" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Per-word spring headline ── */}
        {headlineWords.map((word, i) => (
          <g key={i} opacity={wordSprings[i].op} transform={`translate(0, ${wordSprings[i].ty})`}>
            <text
              x={60 + i * (i < 2 ? 180 : i < 4 ? 170 : 210)}
              y={340}
              fontFamily={FONT} fontSize={i === 0 ? 88 : 80} fontWeight={800}
              fill={i === 0 || i === 1 ? COLORS.vibrant_red : COLORS.white}
              fontStyle={i === 4 ? 'italic' : undefined}
            >
              {word}
            </text>
          </g>
        ))}

        {/* ── ZONE C — Output box with cross-out ── */}
        <g opacity={outputCard.opacity} transform={`translate(0, ${outputCard.translateY})`}>
          <BentoCard x={240} y={520} w={600} h={340} />
          {/* Document icon */}
          <rect x={420} y={570} width={240} height={180} rx={12}
            fill={COLORS.bg_primary} stroke="rgba(255,255,255,0.15)" strokeWidth={2} />
          {/* Text lines on document */}
          <rect x={450} y={600} width={180} height={8} rx={4} fill="rgba(255,255,255,0.15)" />
          <rect x={450} y={624} width={140} height={8} rx={4} fill="rgba(255,255,255,0.12)" />
          <rect x={450} y={648} width={160} height={8} rx={4} fill="rgba(255,255,255,0.1)" />
          <rect x={450} y={672} width={120} height={8} rx={4} fill="rgba(255,255,255,0.08)" />
          <rect x={450} y={696} width={150} height={8} rx={4} fill="rgba(255,255,255,0.06)" />

          <text x={540} y={800} textAnchor="middle"
            fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.text_muted}>
            "Final Output"
          </text>

          {/* Red X cross-out lines */}
          <g opacity={xOpacity}>
            <line x1={330} y1={560} x2={750} y2={800}
              stroke={COLORS.vibrant_red} strokeWidth={5} strokeLinecap="round"
              strokeDasharray={xLineLen} strokeDashoffset={xLineDash} />
            <line x1={750} y1={560} x2={330} y2={800}
              stroke={COLORS.vibrant_red} strokeWidth={5} strokeLinecap="round"
              strokeDasharray={xLineLen} strokeDashoffset={xLineDash2} />
          </g>
        </g>

        {/* ── "Look beyond" card ── */}
        <g opacity={beyondCard.opacity} transform={`translate(0, ${beyondCard.translateY})`}>
          <BentoCard x={60} y={920} w={960} h={180} accent />
          <rect x={60} y={920} width={6} height={180} rx={3} fill={COLORS.accent} />
          <text x={100} y={1000} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.white}>
            Look at the
          </text>
          <text x={530} y={1000} fontFamily={FONT} fontSize={48} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            entire journey
          </text>
        </g>

        {/* ── Three process step tiles ── */}
        {['States', 'Actions', 'Observations'].map((label, i) => {
          const tileX = 60 + i * 320;
          const tileFloat = breathe * (i % 2 === 0 ? 1 : -1) * 0.5;
          const pCard = processCards[i];
          return (
            <g key={i} opacity={pCard.opacity} transform={`translate(0, ${pCard.translateY + tileFloat})`}>
              <BentoCard x={tileX} y={1160} w={300} h={240} accent={i === 1} />
              {/* Icon circles */}
              <circle cx={tileX + 150} cy={1250} r={36}
                fill={COLORS.accent} fillOpacity={i === 1 ? 0.2 : 0.08}
                stroke={COLORS.accent} strokeWidth={2} />
              {i === 0 && (
                <>
                  <circle cx={tileX + 150} cy={1250} r={12} fill={COLORS.accent} opacity={0.5} />
                  <circle cx={tileX + 150} cy={1250} r={18} fill="none"
                    stroke={COLORS.accent} strokeWidth={1} opacity={0.3}
                    transform={`scale(${pulse})`} style={{ transformOrigin: `${tileX + 150}px 1250px` }} />
                </>
              )}
              {i === 1 && (
                <path d={`M ${tileX + 135} 1240 L ${tileX + 150} 1260 L ${tileX + 165} 1240`}
                  fill="none" stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" />
              )}
              {i === 2 && (
                <>
                  <circle cx={tileX + 146} cy={1244} r={8} fill="none"
                    stroke={COLORS.accent} strokeWidth={2} />
                  <line x1={tileX + 152} y1={1250} x2={tileX + 162} y2={1260}
                    stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round" />
                </>
              )}
              <text x={tileX + 150} y={1340} textAnchor="middle"
                fontFamily={FONT} fontSize={36} fontWeight={800}
                fill={i === 1 ? COLORS.accent : COLORS.white}>
                {label}
              </text>
              <text x={tileX + 150} y={1380} textAnchor="middle"
                fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
                {i === 0 ? 'Where it was' : i === 1 ? 'What it did' : 'What it saw'}
              </text>
            </g>
          );
        })}

        {/* Connecting dashes between tiles */}
        <g opacity={processCards[1].opacity * 0.3}>
          <line x1={360} y1={1280} x2={380} y2={1280}
            stroke={COLORS.accent} strokeWidth={1.5} strokeDasharray="4 4" />
          <line x1={680} y1={1280} x2={700} y2={1280}
            stroke={COLORS.accent} strokeWidth={1.5} strokeDasharray="4 4" />
        </g>

        {/* Bottom decorative accent */}
        <g opacity={0.08 * shimmer}>
          <circle cx={540} cy={1620} r={40} fill="none" stroke={COLORS.accent} strokeWidth={1} />
          <circle cx={540} cy={1620} r={60} fill="none" stroke={COLORS.accent} strokeWidth={0.5} />
        </g>

        {/* Bottom accent bar */}
        <rect x={60} y={1700} width={960} height={2} rx={1} fill={COLORS.accent} opacity={0.1} />

        {/* ── CAPTION ── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s07.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
