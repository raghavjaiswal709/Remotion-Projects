/**
 * Scene 09 — Total Passengers Static
 * "Static int totalPassengersInSystem, class variable,"
 * CSV: 38.060s → 40.660s
 * Duration: 135 frames (4.50s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Code declaration card showing `static int totalPassengersInSystem;`
 * with each token appearing sequentially. CLASS VARIABLE badge.
 * Memory diagram showing single class-level box (contrasted
 * with the per-object boxes from previous scenes).
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):  Label + headline spring entrance
 *   Phase 2 (frames 20–90): Code card token cascade, class
 *                            memory block, connector path-draw
 *   Phase 3 (frames 80–end): Pulse on STATIC badge, shimmer, float
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

export const Scene09_TotalPassengersStatic: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntry = useSpringEntrance(frame, 0);
  const headEntry = useSpringEntrance(frame, 6);
  const subEntry = useSpringEntrance(frame, 12);

  // ── Phase 2 — Code card ────────────────────────────────────────────────────
  const codeCard = useSpringEntrance(frame, 18);
  const codePerim = 2 * (960 + 280);
  const codeBorderDash = interpolate(frame, [18, 48], [codePerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Code tokens staggered
  const codeTokens = [
    { text: 'static', color: COLORS.accent, isKeyword: true },
    { text: ' int', color: COLORS.text_muted, isKeyword: true },
    { text: ' totalPassengersInSystem', color: COLORS.white, isKeyword: false },
    { text: ';', color: COLORS.text_muted, isKeyword: false },
  ];
  const tokenEntries = codeTokens.map((_, i) => useSpringEntrance(frame, 26 + i * 6));

  // Comment line
  const commentEntry = useSpringEntrance(frame, 52);

  // Line numbers
  const lineNumEntry = useSpringEntrance(frame, 22);

  // STATIC badge
  const staticBadge = useSpringEntrance(frame, 44);
  const staticPerim = 2 * (200 + 56);
  const staticBorderDash = interpolate(frame, [44, 64], [staticPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // CLASS VARIABLE badge
  const classBadge = useSpringEntrance(frame, 56);
  const classPerim = 2 * (320 + 56);
  const classBorderDash = interpolate(frame, [56, 76], [classPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ── Class memory diagram ──────────────────────────────────────────────────
  const memCard = useSpringEntrance(frame, 48);
  const memPerim = 2 * (960 + 340);
  const memBorderDash = interpolate(frame, [48, 78], [memPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Train class header
  const classHeader = useSpringEntrance(frame, 52);

  // Memory field
  const memField = useSpringEntrance(frame, 60);

  // Arrow from code card to memory
  const arrowLen = 80;
  const arrowDash = usePathDraw(frame, 54, arrowLen, 16);

  // Emphasis ring
  const ringEntry = useSpringEntrance(frame, 66);

  // Bottom info card
  const infoCard = useSpringEntrance(frame, 70);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const glow = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.6, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s09.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntry.translateY})`} opacity={labelEntry.opacity}>
          <SectionLabel text="CLASS VARIABLE · STATIC" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headEntry.translateY})`} opacity={headEntry.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.white}>
            Static Variable
          </text>
        </g>
        <g transform={`translate(0, ${subEntry.translateY})`} opacity={subEntry.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Belongs to the class, not any object
          </text>
        </g>

        {/* ── ZONE C — Code card ───────────────────────────────────────── */}
        <g opacity={codeCard.opacity} transform={`translate(0, ${codeCard.translateY})`}>
          <rect x={60} y={450} width={960} height={280} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={codePerim} strokeDashoffset={codeBorderDash}
          />
          {/* Left accent bar */}
          <rect x={60} y={450} width={6} height={280} rx={3}
            fill={COLORS.accent} />

          {/* Line numbers */}
          <g opacity={lineNumEntry.opacity}>
            <text x={90} y={530} fontFamily={MONO} fontSize={28} fontWeight={500}
              fill={COLORS.text_muted} opacity={0.35}>
              14
            </text>
            <text x={90} y={590} fontFamily={MONO} fontSize={28} fontWeight={500}
              fill={COLORS.text_muted} opacity={0.35}>
              15
            </text>
            <text x={90} y={650} fontFamily={MONO} fontSize={28} fontWeight={500}
              fill={COLORS.text_muted} opacity={0.35}>
              16
            </text>
          </g>

          {/* Comment line */}
          <g opacity={commentEntry.opacity} transform={`translate(0, ${commentEntry.translateY * 0.2})`}>
            <text x={140} y={530} fontFamily={MONO} fontSize={26} fontWeight={500}
              fill={COLORS.text_muted} opacity={0.5}>
              {'// Class-level: shared across all trains'}
            </text>
          </g>

          {/* Code tokens on line 15 */}
          {codeTokens.map((token, i) => (
            <text key={i}
              x={140 + codeTokens.slice(0, i).reduce((acc, t) => acc + t.text.length * 16, 0)}
              y={590}
              fontFamily={MONO} fontSize={28} fontWeight={token.isKeyword ? 700 : 500}
              fill={token.color}
              opacity={tokenEntries[i].opacity}
              transform={`translate(0, ${tokenEntries[i].translateY * 0.2})`}
            >
              {token.text}
            </text>
          ))}

          {/* Blank line 16 hint */}
          <g opacity={commentEntry.opacity * 0.3}>
            <rect x={140} y={640} width={80} height={4} rx={2}
              fill={COLORS.text_muted} />
          </g>
        </g>

        {/* ── STATIC keyword badge ─────────────────────────────────────── */}
        <g opacity={staticBadge.opacity} transform={`translate(0, ${staticBadge.translateY})`}>
          <rect x={60} y={760} width={200} height={56} rx={14}
            fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={staticPerim} strokeDashoffset={staticBorderDash}
          />
          <text x={160} y={796} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic"
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '160px 790px' }}>
            static
          </text>
        </g>

        {/* ── CLASS VARIABLE badge ─────────────────────────────────────── */}
        <g opacity={classBadge.opacity} transform={`translate(0, ${classBadge.translateY})`}>
          <rect x={300} y={760} width={320} height={56} rx={14}
            fill={COLORS.accent} fillOpacity={0.08}
            stroke={COLORS.accent} strokeWidth={1.5}
            strokeDasharray={classPerim} strokeDashoffset={classBorderDash}
          />
          <text x={460} y={796} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.white}>
            CLASS VARIABLE
          </text>
        </g>

        {/* ── Arrow from badges to memory ──────────────────────────────── */}
        <line x1={540} y1={830} x2={540} y2={910}
          stroke={COLORS.accent} strokeWidth={2} strokeOpacity={0.4}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)" strokeLinecap="round"
        />

        {/* ── Class memory diagram ─────────────────────────────────────── */}
        <g opacity={memCard.opacity} transform={`translate(0, ${memCard.translateY})`}>
          <rect x={60} y={930} width={960} height={340} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={memPerim} strokeDashoffset={memBorderDash}
          />

          {/* Class header */}
          <g opacity={classHeader.opacity}>
            <rect x={60} y={930} width={960} height={64} rx={20}
              fill={COLORS.accent} fillOpacity={0.1} />
            <text x={540} y={972} textAnchor="middle"
              fontFamily={FONT} fontSize={30} fontWeight={800}
              fill={COLORS.accent} letterSpacing="0.12em">
              TRAIN CLASS MEMORY
            </text>
          </g>

          {/* Divider under header */}
          <line x1={100} y1={1004} x2={980} y2={1004}
            stroke={COLORS.accent} strokeWidth={1} strokeOpacity={0.15} />

          {/* Static field row */}
          <g opacity={memField.opacity} transform={`translate(0, ${memField.translateY * 0.2})`}>
            {/* Label */}
            <text x={100} y={1060} fontFamily={FONT} fontSize={28} fontWeight={800}
              fill={COLORS.text_muted}>
              totalPassengersInSystem
            </text>
            {/* Value */}
            <text x={940} y={1060} textAnchor="end"
              fontFamily={FONT} fontSize={52} fontWeight={800}
              fill={COLORS.white}>
              0
            </text>
            {/* SHARED indicator */}
            <rect x={100} y={1080} width={840} height={4} rx={2}
              fill={COLORS.accent} fillOpacity={0.12} />
          </g>

          {/* ONE COPY emphasis */}
          <g opacity={memField.opacity}>
            <rect x={340} y={1110} width={300} height={48} rx={12}
              fill={COLORS.accent} fillOpacity={0.08} />
            <text x={490} y={1142} textAnchor="middle"
              fontFamily={FONT} fontSize={24} fontWeight={800}
              fill={COLORS.accent} fontStyle="italic">
              SINGLE COPY
            </text>
          </g>

          {/* Ring animation around "ONE COPY" */}
          <g opacity={ringEntry.opacity * glow}>
            <rect x={330} y={1100} width={320} height={68} rx={16}
              fill="none" stroke={COLORS.accent} strokeWidth={1.5} strokeOpacity={0.25}
              transform={`scale(${pulse})`}
              style={{ transformOrigin: '490px 1134px' }}
            />
          </g>

          {/* Gear icon — class-level process */}
          <g opacity={memField.opacity} transform={`translate(940, 1180)`}>
            <circle cx={0} cy={0} r={24} fill="none"
              stroke={COLORS.accent} strokeWidth={1.5} strokeOpacity={0.2} />
            <circle cx={0} cy={0} r={12} fill="none"
              stroke={COLORS.accent} strokeWidth={1} strokeOpacity={0.3} />
            {/* Teeth */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
              <line key={a}
                x1={0} y1={-24}
                x2={0} y2={-32}
                stroke={COLORS.accent} strokeWidth={4} strokeLinecap="round"
                strokeOpacity={0.2}
                transform={`rotate(${a + frame * 0.5}, 0, 0)`}
              />
            ))}
          </g>
        </g>

        {/* ── Bottom info card ─────────────────────────────────────────── */}
        <g opacity={infoCard.opacity} transform={`translate(0, ${infoCard.translateY})`}>
          <BentoCard x={60} y={1340} w={960} h={120} />
          <rect x={60} y={1340} width={6} height={120} rx={3}
            fill={COLORS.accent} />
          <text x={100} y={1390} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.white}>
            Not stored in any object — stored once at class level
          </text>
          <text x={100} y={1430} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            All train objects share this single value
          </text>
        </g>

        {/* Floating accents */}
        <g transform={`translate(120, ${1540 + breathe})`}>
          <circle cx={0} cy={0} r={14} fill={COLORS.accent} fillOpacity={0.04 * shimmer} />
        </g>
        <g transform={`translate(960, ${1600 + breathe * 0.7})`}>
          <circle cx={0} cy={0} r={18} fill={COLORS.accent} fillOpacity={0.03 * shimmer} />
        </g>

        {/* ── CAPTION ──────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s09.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
