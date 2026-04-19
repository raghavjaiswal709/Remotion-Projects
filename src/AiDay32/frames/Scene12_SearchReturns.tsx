/**
 * Scene 12 — Search Returns A List Of Results
 * "Search returns a list of results."
 * CSV: 33.600s → 35.400s
 * Duration: 54 frames (1.8s)
 *
 * Animation phases:
 *   Phase 1 (0–12): Label + headline spring
 *   Phase 2 (8–35): Search node → results list cards staggered
 *   Phase 3 (30–end): Shimmer, pulse
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

export const Scene12_SearchReturns: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelIn = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 4);
  const badge = useSpringEntrance(frame, 6);

  // Search icon
  const searchIn = useSpringEntrance(frame, 8);

  // Arrow
  const arrowLen = 200;
  const arrowDash = usePathDraw(frame, 12, arrowLen, 14);

  // Results
  const results = [
    { title: 'Result 1: AI Review Paper', url: 'arxiv.org/paper-1023' },
    { title: 'Result 2: Agent Summaries', url: 'blog.ai/summaries' },
    { title: 'Result 3: NLP Overview', url: 'nlp-overview.net/2024' },
    { title: 'Result 4: Deep Dive Article', url: 'deepdive.io/article' },
  ];
  const resultEntrances = results.map((_, i) => useSpringEntrance(frame, 18 + i * 4));
  const statusCard = useSpringEntrance(frame, 36);
  const seqCard = useSpringEntrance(frame, 40);

  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const breathe = Math.sin(frame * 0.06) * 3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s12.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g transform={`translate(0, ${labelIn.translateY})`} opacity={labelIn.opacity}>
          <SectionLabel text="TRAJECTORY EXAMPLE · OBSERVATION 1" y={160} opacity={0.8} />
        </g>

        {/* ZONE B */}
        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Search Returns
          </text>
          <text x={60} y={400} fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Results
          </text>
        </g>

        {/* Badge o₁ */}
        <g opacity={badge.opacity} transform={`translate(0, ${badge.translateY})`}>
          <rect x={820} y={270} width={200} height={80} rx={16}
            fill={COLORS.accent} fillOpacity={0.12} stroke={COLORS.accent} strokeWidth={2} />
          <text x={920} y={320} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            o₁
          </text>
        </g>

        {/* Search icon */}
        <g opacity={searchIn.opacity} transform={`translate(160, ${560 + searchIn.translateY + breathe})`}>
          <circle cx={0} cy={0} r={48} fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={-6} cy={-6} r={16} fill="none"
            stroke={COLORS.white} strokeWidth={2.5} opacity={0.6} />
          <line x1={5} y1={5} x2={16} y2={16}
            stroke={COLORS.white} strokeWidth={2.5} strokeLinecap="round" opacity={0.6} />
          <text x={0} y={80} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            SEARCH
          </text>
        </g>

        {/* Arrow */}
        <path d="M 225,560 L 340,560" fill="none"
          stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* Results list */}
        {results.map((r, i) => {
          const e = resultEntrances[i];
          const cardY = 490 + i * 100;
          return (
            <g key={i} opacity={e.opacity} transform={`translate(0, ${e.translateY})`}>
              <BentoCard x={360} y={cardY} w={660} h={80} accent={i === 0} />
              {/* Number circle */}
              <circle cx={400} cy={cardY + 40} r={16}
                fill={i === 0 ? COLORS.accent : 'rgba(255,255,255,0.08)'}
                fillOpacity={i === 0 ? 0.2 : 1} />
              <text x={400} y={cardY + 46} textAnchor="middle"
                fontFamily={FONT} fontSize={18} fontWeight={800}
                fill={i === 0 ? COLORS.accent : COLORS.text_muted}>
                {i + 1}
              </text>
              <text x={430} y={cardY + 35} fontFamily={FONT} fontSize={28} fontWeight={800}
                fill={COLORS.white}>
                {r.title}
              </text>
              <text x={430} y={cardY + 64} fontFamily={FONT} fontSize={20} fontWeight={800}
                fill={COLORS.text_muted}>
                {r.url}
              </text>
            </g>
          );
        })}

        {/* Status card */}
        <g opacity={statusCard.opacity} transform={`translate(0, ${statusCard.translateY})`}>
          <BentoCard x={60} y={940} w={960} h={180} accent />
          <rect x={60} y={940} width={6} height={180} rx={3} fill={COLORS.accent} />
          <text x={100} y={1000} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            OBSERVATION o₁
          </text>
          <text x={100} y={1050} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            4 search results returned
          </text>
          <text x={100} y={1090} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Environment response recorded in trajectory
          </text>
        </g>

        {/* Trajectory sequence so far */}
        <g opacity={seqCard.opacity} transform={`translate(0, ${seqCard.translateY})`}>
          <BentoCard x={60} y={1180} w={960} h={280} />
          <text x={100} y={1240} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.12em">
            TRAJECTORY SO FAR
          </text>

          {[
            { label: 's₀', desc: 'Goal', x: 160 },
            { label: 'a₁', desc: 'Search', x: 400 },
            { label: 'o₁', desc: 'Results', x: 640 },
          ].map((item, i) => (
            <g key={i}>
              <circle cx={item.x} cy={1360} r={28}
                fill={i === 2 ? COLORS.accent : COLORS.bg_primary}
                fillOpacity={i === 2 ? 0.2 : 1}
                stroke={i === 2 ? COLORS.accent : 'rgba(255,255,255,0.2)'}
                strokeWidth={2} />
              <text x={item.x} y={1368} textAnchor="middle"
                fontFamily={FONT} fontSize={20} fontWeight={800}
                fill={i === 2 ? COLORS.accent : COLORS.text_muted}>
                {item.label}
              </text>
              <text x={item.x} y={1410} textAnchor="middle"
                fontFamily={FONT} fontSize={24} fontWeight={800}
                fill={i === 2 ? COLORS.white : COLORS.text_muted}>
                {item.desc}
              </text>
            </g>
          ))}

          {/* Arrows */}
          <line x1={195} y1={1360} x2={365} y2={1360}
            stroke={COLORS.accent} strokeWidth={2} opacity={0.3} strokeDasharray="6,4" />
          <line x1={435} y1={1360} x2={605} y2={1360}
            stroke={COLORS.accent} strokeWidth={2} opacity={0.3} strokeDasharray="6,4" />

          {/* Remaining dots */}
          {[0, 1, 2].map(i => (
            <circle key={i} cx={800 + i * 50} cy={1360}
              r={4} fill={COLORS.text_muted} opacity={0.25} />
          ))}
        </g>

        {/* Floating accents */}
        {[
          { x: 80, y: 1600 }, { x: 540, y: 1620 }, { x: 1000, y: 1610 },
        ].map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y + Math.sin(frame * 0.05 + i) * 3}
            r={5} fill={COLORS.accent} opacity={0.08 * shimmer} />
        ))}

        {/* CAPTION */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s12.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
