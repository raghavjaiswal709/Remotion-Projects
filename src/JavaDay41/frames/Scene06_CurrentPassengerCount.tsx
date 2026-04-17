/**
 * Scene 06 — Current Passenger Count
 * "Private int currentPassengerCount, instance variable,"
 * CSV: 20.980s → 24.340s
 * Duration: 101 frames (3.37s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Code declaration scene — shows the actual Java field declaration
 * with highlighted syntax and an instance variable explanation card.
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):  Label + headline spring entrance
 *   Phase 2 (frames 15–70): Code card border-draw, syntax highlighting,
 *                            instance variable badge, memory illustration
 *   Phase 3 (frames 60–end): Pulse on INSTANCE badge, shimmer, float
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
const MONO = "'Fira Code', 'Courier New', monospace";

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

export const Scene06_CurrentPassengerCount: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntry = useSpringEntrance(frame, 0);
  const headlineEntry = useSpringEntrance(frame, 6);
  const sublineEntry = useSpringEntrance(frame, 10);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  // Code card
  const codeCardEntry = useSpringEntrance(frame, 14);
  const codeCardW = 960;
  const codeCardH = 280;
  const codePerimeter = 2 * (codeCardW + codeCardH);
  const codeBorderDash = interpolate(frame, [14, 44], [codePerimeter, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Code tokens (staggered typewriter-ish)
  const tokens = [
    { text: 'private', color: COLORS.accent, delay: 18 },
    { text: ' int', color: COLORS.text_muted, delay: 22 },
    { text: ' currentPassengerCount', color: COLORS.white, delay: 26 },
    { text: ';', color: COLORS.text_muted, delay: 32 },
  ];
  const tokenOpacities = tokens.map(t =>
    interpolate(frame, [t.delay, t.delay + 8], [0, 1], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    })
  );

  // Line number
  const lineNumOp = interpolate(frame, [16, 22], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Comment line
  const commentOp = interpolate(frame, [34, 42], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Instance variable badge card
  const badgeEntry = useSpringEntrance(frame, 36);
  const badgePerimeter = 2 * (400 + 120);
  const badgeBorderDash = interpolate(frame, [36, 56], [badgePerimeter, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Memory illustration — object boxes
  const obj1Entry = useSpringEntrance(frame, 42);
  const obj2Entry = useSpringEntrance(frame, 48);
  const obj3Entry = useSpringEntrance(frame, 54);

  // Arrow connectors
  const arrowLen = 80;
  const arrow1Dash = usePathDraw(frame, 46, arrowLen, 14);
  const arrow2Dash = usePathDraw(frame, 52, arrowLen, 14);
  const arrow3Dash = usePathDraw(frame, 58, arrowLen, 14);

  // Explanation card
  const explainEntry = useSpringEntrance(frame, 50);

  // Bottom accent decoration
  const accentBarEntry = useSpringEntrance(frame, 40);
  const accentBarLen = 960;
  const accentBarDash = usePathDraw(frame, 40, accentBarLen, 20);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.09) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s06.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntry.translateY})`} opacity={labelEntry.opacity}>
          <SectionLabel text="INSTANCE VARIABLE · DECLARATION" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineEntry.translateY})`} opacity={headlineEntry.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.white}>
            Field Declaration
          </text>
        </g>
        <g transform={`translate(0, ${sublineEntry.translateY})`} opacity={sublineEntry.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            instance variable
          </text>
        </g>

        {/* ── ZONE C — Code card ───────────────────────────────────────── */}
        <g opacity={codeCardEntry.opacity} transform={`translate(0, ${codeCardEntry.translateY})`}>
          <BentoCard x={60} y={460} w={codeCardW} h={codeCardH} accent />
          <rect x={60} y={460} width={codeCardW} height={codeCardH} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={codePerimeter} strokeDashoffset={codeBorderDash}
          />

          {/* Left accent bar */}
          <rect x={60} y={460} width={6} height={codeCardH} rx={3}
            fill={COLORS.accent} />

          {/* Line number */}
          <text x={100} y={560} fontFamily={MONO} fontSize={28} fontWeight={500}
            fill={COLORS.text_muted} opacity={lineNumOp * 0.4}>
            7
          </text>

          {/* Code tokens */}
          <text y={560} fontFamily={MONO} fontSize={36} fontWeight={500}>
            {tokens.map((t, i) => (
              <tspan key={i} x={i === 0 ? 140 : undefined} fill={t.color}
                opacity={tokenOpacities[i]}>
                {t.text}
              </tspan>
            ))}
          </text>

          {/* Comment */}
          <text x={140} y={620} fontFamily={MONO} fontSize={26} fontWeight={500}
            fill={COLORS.text_muted} opacity={commentOp * 0.5}>
            // each Train object gets its own copy
          </text>

          {/* Additional code context */}
          <text x={100} y={690} fontFamily={MONO} fontSize={28} fontWeight={500}
            fill={COLORS.text_muted} opacity={commentOp * 0.3}>
            8
          </text>
          <text x={140} y={690} fontFamily={MONO} fontSize={32} fontWeight={500}
            fill={COLORS.text_muted} opacity={commentOp * 0.5}>
            private String trainId;
          </text>
        </g>

        {/* ── Instance variable badge ──────────────────────────────────── */}
        <g opacity={badgeEntry.opacity} transform={`translate(0, ${badgeEntry.translateY})`}>
          <rect x={340} y={790} width={400} height={120} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={badgePerimeter} strokeDashoffset={badgeBorderDash}
          />
          <text x={540} y={862} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.accent}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '540px 850px' }}>
            INSTANCE
          </text>
        </g>

        {/* ── Memory illustration — 3 object boxes ─────────────────────── */}
        {[
          { x: 100, label: 'Train A', entry: obj1Entry, arrowDash: arrow1Dash, val: '0' },
          { x: 400, label: 'Train B', entry: obj2Entry, arrowDash: arrow2Dash, val: '0' },
          { x: 700, label: 'Train C', entry: obj3Entry, arrowDash: arrow3Dash, val: '0' },
        ].map((obj, i) => (
          <g key={i}>
            {/* Arrow from badge to object */}
            <line x1={540} y1={910} x2={obj.x + 120} y2={990}
              stroke={COLORS.accent} strokeWidth={2}
              strokeDasharray={arrowLen} strokeDashoffset={obj.arrowDash}
              strokeLinecap="round" strokeOpacity={0.4}
              markerEnd="url(#arrow)"
            />

            {/* Object box */}
            <g opacity={obj.entry.opacity} transform={`translate(0, ${obj.entry.translateY})`}>
              <rect x={obj.x} y={990} width={240} height={180} rx={16}
                fill={COLORS.bg_secondary}
                stroke={COLORS.accent} strokeWidth={1.5} strokeOpacity={0.5}
              />

              {/* Object label */}
              <text x={obj.x + 120} y={1036} textAnchor="middle"
                fontFamily={FONT} fontSize={28} fontWeight={800}
                fill={COLORS.accent}>
                {obj.label}
              </text>

              {/* Divider */}
              <line x1={obj.x + 20} y1={1055} x2={obj.x + 220} y2={1055}
                stroke={COLORS.text_muted} strokeWidth={1} strokeOpacity={0.2} />

              {/* Field name */}
              <text x={obj.x + 20} y={1096} fontFamily={MONO} fontSize={22} fontWeight={500}
                fill={COLORS.text_muted}>
                count:
              </text>
              <text x={obj.x + 130} y={1096} fontFamily={MONO} fontSize={24} fontWeight={800}
                fill={COLORS.white}>
                {obj.val}
              </text>

              {/* OWN COPY label */}
              <text x={obj.x + 120} y={1146} textAnchor="middle"
                fontFamily={FONT} fontSize={20} fontWeight={800}
                fill={COLORS.accent} opacity={0.6}>
                OWN COPY
              </text>
            </g>
          </g>
        ))}

        {/* ── Explanation card ─────────────────────────────────────────── */}
        <g opacity={explainEntry.opacity} transform={`translate(0, ${explainEntry.translateY})`}>
          <BentoCard x={60} y={1230} w={960} h={140} />
          <rect x={60} y={1230} width={6} height={140} rx={3}
            fill={COLORS.accent} />
          <text x={100} y={1290} fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.white}>
            Each object allocates its own memory
          </text>
          <text x={100} y={1340} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>
            Changing one does not affect others
          </text>
        </g>

        {/* ── Accent bar at bottom ─────────────────────────────────────── */}
        <g opacity={accentBarEntry.opacity}>
          <line x1={60} y1={1420} x2={1020} y2={1420}
            stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={accentBarLen} strokeDashoffset={accentBarDash}
            strokeLinecap="round" strokeOpacity={0.15}
          />
        </g>

        {/* Floating accents */}
        <g transform={`translate(100, ${1520 + breathe})`}>
          <circle cx={0} cy={0} r={18} fill={COLORS.accent} fillOpacity={0.04 * shimmer} />
        </g>
        <g transform={`translate(980, ${1580 + breathe * 0.6})`}>
          <circle cx={0} cy={0} r={22} fill={COLORS.accent} fillOpacity={0.03 * shimmer} />
        </g>

        {/* ── CAPTION ──────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s06.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
