/**
 * Scene 03 — Before Object Exists
 * "when the class loads before any object ever exists."
 * CSV: 9.700s → 13.080s
 * Duration: 127 frames (4.23s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline spring entrance
 *   Phase 2 (frames 18–80):  Class-to-object timeline diagram with path-draw
 *   Phase 3 (frames 70–end): Timeline pulse, ghost objects shimmer
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
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene03_BeforeObjectExists: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 12);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const timelineCard = useSpringEntrance(frame, 18);
  const classNode = useSpringEntrance(frame, 24);
  const timelineDraw = usePathDraw(frame, 28, 600, 30);
  const blockNode = useSpringEntrance(frame, 36);
  const ghostObj1 = useSpringEntrance(frame, 50);
  const ghostObj2 = useSpringEntrance(frame, 58);
  const ghostObj3 = useSpringEntrance(frame, 66);
  const bottomCard = useSpringEntrance(frame, 44);

  // Timeline marker draw
  const markerDraw = usePathDraw(frame, 32, 80, 20);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const ghostFlicker = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.03, 0.08]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s03.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="CLASS LOADING · LIFECYCLE" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Headline ────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={84} fontWeight={800} fill={COLORS.white}>
            Before Any
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={84} fontWeight={800} fill={COLORS.accent}>
            Object Exists
          </text>
        </g>

        {/* ── ZONE C — Timeline diagram ────────────────────────────────── */}

        {/* Main timeline card */}
        <g opacity={timelineCard.opacity} transform={`translate(0, ${timelineCard.translateY})`}>
          <BentoCard x={60} y={480} w={960} h={600} accent />

          {/* Timeline horizontal line */}
          <line x1={140} y1={700} x2={940} y2={700}
            stroke={COLORS.accent}
            strokeWidth={3}
            strokeDasharray={600}
            strokeDashoffset={timelineDraw}
            strokeLinecap="round"
          />

          {/* Timeline arrow at end */}
          <path d="M 930,690 L 950,700 L 930,710"
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={80}
            strokeDashoffset={markerDraw}
          />

          {/* "TIME" label on timeline */}
          <text x={950} y={740} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted} opacity={timelineCard.opacity * 0.6}>
            TIME
          </text>
        </g>

        {/* Class loads node */}
        <g opacity={classNode.opacity} transform={`translate(0, ${classNode.translateY})`}>
          {/* Vertical marker */}
          <line x1={260} y1={660} x2={260} y2={740}
            stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />

          {/* Class node */}
          <rect x={180} y={600} width={160} height={60} rx={12}
            fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={2}
          />
          <text x={260} y={640} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}
          >
            CLASS
          </text>
          <text x={260} y={580} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted}
          >
            LOADS HERE
          </text>
        </g>

        {/* Static block fires */}
        <g opacity={blockNode.opacity} transform={`translate(0, ${blockNode.translateY})`}>
          <line x1={440} y1={660} x2={440} y2={740}
            stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />

          <rect x={360} y={760} width={160} height={60} rx={12}
            fill={COLORS.accent} fillOpacity={0.2}
            stroke={COLORS.accent} strokeWidth={2}
          />
          <text x={440} y={800} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800} fontStyle="italic"
            fill={COLORS.accent}
          >
            static {'{}'}
          </text>
          <text x={440} y={840} textAnchor="middle"
            fontFamily={FONT} fontSize={20} fontWeight={800}
            fill={COLORS.text_muted}
          >
            RUNS NOW
          </text>
        </g>

        {/* Ghost objects (not yet created) */}
        <g opacity={ghostObj1.opacity * ghostFlicker} transform={`translate(0, ${ghostObj1.translateY})`}>
          <rect x={600} y={610} width={100} height={80} rx={12}
            fill="none"
            stroke={COLORS.text_muted}
            strokeWidth={1.5}
            strokeDasharray="6,4"
          />
          <text x={650} y={655} textAnchor="middle"
            fontFamily={FONT} fontSize={20} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.4}
          >
            obj?
          </text>
        </g>

        <g opacity={ghostObj2.opacity * ghostFlicker} transform={`translate(0, ${ghostObj2.translateY})`}>
          <rect x={720} y={610} width={100} height={80} rx={12}
            fill="none"
            stroke={COLORS.text_muted}
            strokeWidth={1.5}
            strokeDasharray="6,4"
          />
          <text x={770} y={655} textAnchor="middle"
            fontFamily={FONT} fontSize={20} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.4}
          >
            obj?
          </text>
        </g>

        <g opacity={ghostObj3.opacity * ghostFlicker} transform={`translate(0, ${ghostObj3.translateY})`}>
          <rect x={840} y={610} width={100} height={80} rx={12}
            fill="none"
            stroke={COLORS.text_muted}
            strokeWidth={1.5}
            strokeDasharray="6,4"
          />
          <text x={890} y={655} textAnchor="middle"
            fontFamily={FONT} fontSize={20} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.4}
          >
            obj?
          </text>
          {/* "NOT YET" label over ghost objects */}
          <text x={770} y={580} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.vibrant_red} opacity={0.7}
          >
            NOT YET CREATED
          </text>
        </g>

        {/* Bottom summary card */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={60} y={1120} w={960} h={200} />
          <rect x={60} y={1120} width={6} height={200} rx={3} fill={COLORS.accent} />

          {/* Key insight */}
          <text x={100} y={1200} fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.white}>
            The class loads
          </text>
          <text x={100} y={1260} fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            before any object is born
          </text>
        </g>

        {/* Floating pulse accents */}
        <g transform={`translate(540, ${1450 + breathe})`}>
          <circle cx={0} cy={0} r={38} fill={COLORS.accent} fillOpacity={0.04 * shimmer} />
          <circle cx={0} cy={0} r={38} fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        <g transform={`translate(180, ${1520 + breathe * 0.6})`}>
          <circle cx={0} cy={0} r={24} fill={COLORS.accent} fillOpacity={0.03 * shimmer} />
        </g>
        <g transform={`translate(900, ${1480 + breathe * 0.8})`}>
          <circle cx={0} cy={0} r={28} fill={COLORS.accent} fillOpacity={0.03 * shimmer} />
        </g>

        {/* ── CAPTION ──────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s03.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
