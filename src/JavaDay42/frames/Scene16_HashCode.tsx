/**
 * Scene 16 — hashCode
 * "hashCode generates a numeric code used by HashMap and HashSet."
 * CSV: 66.680s → 75.980s
 * Duration: 279 frames (9.3s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20):   Label + headline
 *   Phase 2 (frames 14–100): Object → hash function → numeric code → bucket placement
 *   Phase 3 (frames 90–end): Bucket glow, floaters
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
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
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

function useCounter(frame: number, startFrame: number, endValue: number, durationFrames = 45) {
  const raw = interpolate(frame, [startFrame, startFrame + durationFrames], [0, endValue], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(raw);
}

export const Scene16_HashCode: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headA    = useSpringEntrance(frame, 4);
  const headB    = useSpringEntrance(frame, 10);

  // ── Phase 2: flow ──────────────────────────────────────────────────────────
  const objCard  = useSpringEntrance(frame, 14);
  const arrow1   = usePathDraw(frame, 22, 100, 16);
  const funcCard = useSpringEntrance(frame, 24);
  const arrow2   = usePathDraw(frame, 34, 100, 16);
  const codeOut  = useSpringEntrance(frame, 36);

  const hashValue = useCounter(frame, 38, 827364, 40);

  // Bucket row
  const bucketEnt = useSpringEntrance(frame, 50);
  const arrow3    = usePathDraw(frame, 56, 120, 16);
  const BUCKETS = 8;
  const activeBucket = 4; // 827364 % 8 = 4
  const bucketEnts = Array.from({ length: BUCKETS }, (_, i) =>
    useSpringEntrance(frame, 60 + i * 4)
  );

  // Bottom explanation card
  const bottomEnt = useSpringEntrance(frame, 80);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s16.from);

  const flowY = 520;

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="OBJECT · hashCode()" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={280} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            hashCode()
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={370} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}>
            Numeric fingerprint for fast lookup
          </text>
        </g>

        {/* ── FLOW ROW 1: Object → hashCode() → number ───────────────── */}
        {/* Object */}
        <g opacity={objCard.opacity} transform={`translate(0, ${objCard.translateY})`}>
          <BentoCard x={60} y={flowY} w={240} h={90} accent />
          <text x={180} y={flowY + 55} textAnchor="middle"
            fontFamily={MONO} fontSize={26} fontWeight={800} fill={COLORS.white}>Ticket</text>
        </g>

        {/* Arrow */}
        <path d={`M 300,${flowY + 45} L 370,${flowY + 45}`} fill="none"
          stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={100} strokeDashoffset={arrow1}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* Hash function box */}
        <g opacity={funcCard.opacity} transform={`translate(0, ${funcCard.translateY})`}>
          <rect x={380} y={flowY} width={280} height={90} rx={20}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Gear icon */}
          <circle cx={420} cy={flowY + 45} r={18} fill="none"
            stroke={COLORS.accent} strokeWidth={2}
            transform={`rotate(${frame * 2}, 420, ${flowY + 45})`} />
          <circle cx={420} cy={flowY + 45} r={6} fill={COLORS.accent} fillOpacity={0.3} />
          <text x={460} y={flowY + 53} fontFamily={MONO} fontSize={22} fontWeight={800}
            fill={COLORS.accent}>.hashCode()</text>
        </g>

        {/* Arrow */}
        <path d={`M 660,${flowY + 45} L 730,${flowY + 45}`} fill="none"
          stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={100} strokeDashoffset={arrow2}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* Numeric output */}
        <g opacity={codeOut.opacity} transform={`translate(0, ${codeOut.translateY})`}>
          <BentoCard x={740} y={flowY} w={270} h={90} accent />
          <text x={875} y={flowY + 55} textAnchor="middle"
            fontFamily={MONO} fontSize={28} fontWeight={800} fill={COLORS.accent}
            transform={`scale(${pulse})`} style={{ transformOrigin: `875px ${flowY + 45}px` }}>
            {hashValue}
          </text>
        </g>

        {/* ── Arrow down to buckets ────────────────────────────────────── */}
        <path d={`M 875,${flowY + 90} L 875,${flowY + 160} L 540,${flowY + 160} L 540,${flowY + 200}`}
          fill="none" stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={120} strokeDashoffset={arrow3}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* ── Bucket row (HashMap visualization) ──────────────────────── */}
        <g opacity={bucketEnt.opacity}>
          <text x={60} y={flowY + 230} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.1em">HASHMAP BUCKETS</text>

          {Array.from({ length: BUCKETS }, (_, i) => {
            const bx = 60 + i * 120;
            const by = flowY + 250;
            const isActive = i === activeBucket;
            return (
              <g key={i} opacity={bucketEnts[i].opacity}
                transform={`translate(0, ${bucketEnts[i].translateY})`}>
                <rect x={bx} y={by} width={100} height={120} rx={12}
                  fill={isActive ? COLORS.accent : COLORS.bg_secondary}
                  fillOpacity={isActive ? 0.15 : 1}
                  stroke={isActive ? COLORS.accent : 'rgba(255,255,255,0.1)'}
                  strokeWidth={isActive ? 2.5 : 1} />
                <text x={bx + 50} y={by + 50} textAnchor="middle"
                  fontFamily={MONO} fontSize={20} fontWeight={800}
                  fill={isActive ? COLORS.accent : COLORS.text_muted}>
                  [{i}]
                </text>
                {isActive && (
                  <>
                    <rect x={bx + 15} y={by + 65} width={70} height={32} rx={8}
                      fill={COLORS.accent} fillOpacity={0.2} />
                    <text x={bx + 50} y={by + 88} textAnchor="middle"
                      fontFamily={MONO} fontSize={16} fontWeight={800} fill={COLORS.accent}>
                      Ticket
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </g>

        {/* ── Bottom explanation ───────────────────────────────────────── */}
        <g opacity={bottomEnt.opacity} transform={`translate(0, ${bottomEnt.translateY})`}>
          <BentoCard x={60} y={1160} w={960} h={200} />
          <rect x={60} y={1160} width={6} height={200} rx={3} fill={COLORS.accent} />
          <text x={100} y={1220} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            HashMap uses hashCode to pick a bucket
          </text>
          <text x={100} y={1275} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            O(1) lookup instead of O(n) scanning
          </text>
          <text x={100} y={1325} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            Equal objects must have equal hash codes
          </text>
        </g>

        {/* ── Floaters ────────────────────────────────────────────────── */}
        <circle cx={80} cy={1500 + breathe} r={3} fill={COLORS.accent} fillOpacity={0.15 * shimmer} />
        <circle cx={1000} cy={1550 - breathe} r={2.5} fill={COLORS.accent} fillOpacity={0.12} />

        {/* ── CAPTION ─────────────────────────────────────────────────── */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s16.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
