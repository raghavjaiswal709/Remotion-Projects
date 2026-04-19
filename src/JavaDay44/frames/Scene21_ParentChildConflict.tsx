/**
 * Scene 21 — ParentChildConflict
 * "But what happens when the same method name exists in a parent and a child?"
 * CSV: 62.820s → 66.720s
 * Duration: 130 frames (4.3s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):  Label + hero "But what happens…"
 *   Phase 2 (frames 18–80): Parent/child class boxes with method clash
 *   Phase 3 (frames 70–end): Question mark pulse, breathe, shimmer
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
import { DarkBackground, GlobalDefs, Caption, BentoCard } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;
const SPRING_HEAVY  = { damping: 28, stiffness: 100, mass: 1.4 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
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

export const Scene21_ParentChildConflict: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const label = useSpringEntrance(frame, 0);
  const heroA = useSpringEntrance(frame, 4);
  const heroB = useSpringEntrance(frame, 8);
  const heroC = useSpringEntrance(frame, 12);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const parentBox  = useSpringEntrance(frame, 18);
  const childBox   = useSpringEntrance(frame, 28);
  const inheritArr = usePathDraw(frame, 34, 300, 25);
  const clashInd   = useSpringEntrance(frame, 44);
  const questionE  = useSpringEntrance(frame, 52);
  const detailL    = useSpringEntrance(frame, 58);
  const detailR    = useSpringEntrance(frame, 62);
  const summaryCd  = useSpringEntrance(frame, 70);

  // Question mark border draw
  const qPerim = 2 * (400 + 200);
  const qBorderD = interpolate(frame, [52, 72], [qPerim, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 5;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.018;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const qPulse  = 1 + Math.sin(frame * 0.10) * 0.04;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s21.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${label.translateY})`} opacity={label.opacity}>
          <text x={60} y={160}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.15em" opacity={0.8}>
            INHERITANCE · METHOD CONFLICT
          </text>
        </g>

        {/* ── ZONE B ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${heroA.translateY})`} opacity={heroA.opacity}>
          <text x={540} y={280} textAnchor="middle"
            fontFamily={FONT} fontSize={64} fontWeight={800}
            fill={COLORS.white}>
            But What Happens
          </text>
        </g>
        <g transform={`translate(0, ${heroB.translateY})`} opacity={heroB.opacity}>
          <text x={540} y={370} textAnchor="middle"
            fontFamily={FONT} fontSize={56} fontWeight={800}
            fill={COLORS.text_muted}>
            When the Same Method
          </text>
        </g>
        <g transform={`translate(0, ${heroC.translateY})`} opacity={heroC.opacity}>
          <text x={540} y={450} textAnchor="middle"
            fontFamily={FONT} fontSize={64} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Exists in Parent & Child?
          </text>
        </g>

        {/* ── PARENT CLASS BOX ───────────────────────────────────────────── */}
        <g opacity={parentBox.opacity} transform={`translate(0, ${parentBox.translateY})`}>
          <BentoCard x={60} y={540} w={440} h={360} />
          {/* Header stripe */}
          <rect x={60} y={540} width={440} height={60} rx={20}
            fill={COLORS.accent} fillOpacity={0.12} />
          <rect x={62} y={598} width={436} height={2} fill={COLORS.accent} opacity={0.3} />
          <text x={280} y={580} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>
            Train (Parent)
          </text>
          {/* Fields */}
          <text x={100} y={650}
            fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={500}
            fill={COLORS.text_muted}>
            - route: String
          </text>
          <text x={100} y={690}
            fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={500}
            fill={COLORS.text_muted}>
            - speed: int
          </text>
          {/* Separator */}
          <line x1={100} y1={720} x2={460} y2={720}
            stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          {/* Method — SAME NAME */}
          <rect x={100} y={740} width={360} height={50} rx={10}
            fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={280} y={774} textAnchor="middle"
            fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={700}
            fill={COLORS.accent}>
            calculateFare()
          </text>
          {/* Description */}
          <text x={100} y={830}
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted}>
            Returns base fare
          </text>
          {/* Train icon */}
          <rect x={380} y={820} width={80} height={50} rx={8}
            fill="none" stroke={COLORS.accent} strokeWidth={2} opacity={0.4} />
          <circle cx={395} cy={880} r={10}
            fill="none" stroke={COLORS.accent} strokeWidth={2} opacity={0.4} />
          <circle cx={445} cy={880} r={10}
            fill="none" stroke={COLORS.accent} strokeWidth={2} opacity={0.4} />
        </g>

        {/* ── INHERITANCE ARROW ───────────────────────────────────────────── */}
        <path
          d="M 540,640 L 540,540 L 540,640 C 540,720 600,740 600,740"
          fill="none" stroke={COLORS.accent} strokeWidth={0}
          opacity={0} />
        {/* Vertical inheritance line */}
        <line x1={540} y1={900} x2={540} y2={600}
          stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={300} strokeDashoffset={inheritArr}
          strokeLinecap="round"
          opacity={childBox.opacity * 0.6} />
        {/* Hollow arrowhead (triangle) pointing up */}
        <polygon points="540,590 530,615 550,615"
          fill="none" stroke={COLORS.accent} strokeWidth={2}
          opacity={childBox.opacity * 0.6} />
        {/* "extends" label */}
        <text x={570} y={750} fontFamily={FONT} fontSize={22} fontWeight={800}
          fill={COLORS.text_muted} opacity={childBox.opacity * 0.5}>
          extends
        </text>

        {/* ── CHILD CLASS BOX ────────────────────────────────────────────── */}
        <g opacity={childBox.opacity} transform={`translate(0, ${childBox.translateY})`}>
          <BentoCard x={580} y={540} w={440} h={360} accent />
          {/* Header stripe */}
          <rect x={580} y={540} width={440} height={60} rx={20}
            fill={COLORS.accent} fillOpacity={0.18} />
          <rect x={582} y={598} width={436} height={2} fill={COLORS.accent} opacity={0.5} />
          <text x={800} y={580} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent}>
            ExpressTrain (Child)
          </text>
          {/* Fields */}
          <text x={620} y={650}
            fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={500}
            fill={COLORS.text_muted}>
            - expressCharge: double
          </text>
          <text x={620} y={690}
            fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={500}
            fill={COLORS.text_muted}>
            - priority: boolean
          </text>
          {/* Separator */}
          <line x1={620} y1={720} x2={980} y2={720}
            stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          {/* Method — SAME NAME */}
          <rect x={620} y={740} width={360} height={50} rx={10}
            fill={COLORS.accent} fillOpacity={0.25}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={800} y={774} textAnchor="middle"
            fontFamily="'Fira Code', monospace" fontSize={24} fontWeight={700}
            fill={COLORS.accent}>
            calculateFare()
          </text>
          {/* Description */}
          <text x={620} y={830}
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted}>
            Returns base + surcharge
          </text>
          {/* Express marker */}
          <rect x={880} y={820} width={100} height={40} rx={8}
            fill={COLORS.accent} fillOpacity={0.15} />
          <text x={930} y={848} textAnchor="middle"
            fontFamily={FONT} fontSize={18} fontWeight={800}
            fill={COLORS.accent}>
            EXPRESS
          </text>
        </g>

        {/* ── CLASH INDICATOR ────────────────────────────────────────────── */}
        <g opacity={clashInd.opacity} transform={`translate(0, ${clashInd.translateY})`}>
          {/* Lightning bolt between methods */}
          <path d="M 520,760 L 540,735 L 535,755 L 560,730"
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={3}
            strokeLinecap="round" />
          <path d="M 520,780 L 540,755 L 555,780 L 560,760"
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={3}
            strokeLinecap="round" />
          <text x={540} y={810} textAnchor="middle"
            fontFamily={FONT} fontSize={20} fontWeight={800}
            fill={COLORS.vibrant_red} letterSpacing="0.1em">
            SAME NAME!
          </text>
        </g>

        {/* ── QUESTION MARK ──────────────────────────────────────────────── */}
        <g opacity={questionE.opacity}>
          <rect x={340} y={960} width={400} height={200} rx={24}
            fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={qPerim} strokeDashoffset={qBorderD}
            opacity={0.6} />
          <text x={540} y={1060} textAnchor="middle"
            fontFamily={FONT} fontSize={96} fontWeight={800}
            fill={COLORS.accent}
            transform={`scale(${qPulse})`}
            style={{ transformOrigin: '540px 1060px' }}>
            ?
          </text>
          <text x={540} y={1130} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            Which version runs?
          </text>
        </g>

        {/* ── Detail tiles ───────────────────────────────────────────────── */}
        <g opacity={detailL.opacity} transform={`translate(0, ${detailL.translateY})`}>
          <BentoCard x={60} y={1210} w={460} h={130} />
          <rect x={60} y={1210} width={6} height={130} rx={3}
            fill={COLORS.accent} />
          <text x={100} y={1270}
            fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.white}>
            Parent: calculateFare()
          </text>
          <text x={100} y={1310}
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted}>
            Returns base fare only
          </text>
        </g>
        <g opacity={detailR.opacity} transform={`translate(0, ${detailR.translateY})`}>
          <BentoCard x={560} y={1210} w={460} h={130} accent />
          <rect x={560} y={1210} width={6} height={130} rx={3}
            fill={COLORS.accent} />
          <text x={600} y={1270}
            fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.accent}>
            Child: calculateFare()
          </text>
          <text x={600} y={1310}
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted}>
            Returns base + express surcharge
          </text>
        </g>

        {/* ── Summary card ───────────────────────────────────────────────── */}
        <g opacity={summaryCd.opacity} transform={`translate(0, ${summaryCd.translateY})`}>
          <BentoCard x={100} y={1390} w={880} h={120} />
          <text x={540} y={1462} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>
            Same method — two different <tspan fill={COLORS.accent}>implementations</tspan>
          </text>
        </g>

        {/* ── Bottom note ────────────────────────────────────────────────── */}
        <g opacity={summaryCd.opacity * shimmer}>
          <BentoCard x={120} y={1560} w={840} h={100} />
          <text x={540} y={1622} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            The compiler can't know which <tspan fill={COLORS.vibrant_red}>object type</tspan> is stored at runtime
          </text>
        </g>

        {/* ── Floating micro-anim ────────────────────────────────────────── */}
        <g transform={`translate(120, ${1700 + breathe})`} opacity={0.08}>
          <circle cx={0} cy={0} r={8}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} />
        </g>
        <g transform={`translate(960, ${1710 + breathe * 0.6})`} opacity={shimmer * 0.08}>
          <circle cx={0} cy={0} r={5} fill={COLORS.accent} />
        </g>

        {/* ── Corner accents ─────────────────────────────────────────────── */}
        <g opacity={label.opacity * 0.3}>
          <path d="M 60,60 L 60,130 M 60,60 L 130,60" fill="none"
            stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
          <path d="M 1020,60 L 1020,130 M 1020,60 L 950,60" fill="none"
            stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
          <path d="M 60,1740 L 60,1670 M 60,1740 L 130,1740" fill="none"
            stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
          <path d="M 1020,1740 L 1020,1670 M 1020,1740 L 950,1740" fill="none"
            stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s21.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
