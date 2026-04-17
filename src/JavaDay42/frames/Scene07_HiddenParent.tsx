/**
 * Scene 07 — Hidden Parent
 * "Even if you never write extends, there is still a parent."
 * CSV: 24.420s → 28.380s
 * Duration: 119 frames (3.97s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline entrance
 *   Phase 2 (frames 20–80):  Code comparison — "class Train {}" becomes "class Train extends Object {}"
 *   Phase 3 (frames 70–end): Ghost parent reveal, shimmer, pulse rings
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
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene07_HiddenParent: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEnt  = useSpringEntrance(frame, 0);
  const headA     = useSpringEntrance(frame, 5);
  const headB     = useSpringEntrance(frame, 10);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const codeCard1 = useSpringEntrance(frame, 16);
  const codeCard2 = useSpringEntrance(frame, 28);
  const arrowEnt  = useSpringEntrance(frame, 36);
  const ghostEnt  = useSpringEntrance(frame, 42);
  const infoCard  = useSpringEntrance(frame, 50);

  // ── Arrow path draw ────────────────────────────────────────────────────────
  const arrowLen = 200;
  const arrowDash = usePathDraw(frame, 36, arrowLen, 20);

  // ── "extends Object" reveal — typewriter ───────────────────────────────────
  const extendsText = " extends Object";
  const charsVisible = Math.floor(
    interpolate(frame, [30, 30 + extendsText.length * 1.5], [0, extendsText.length], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    })
  );
  const revealedText = extendsText.slice(0, charsVisible);

  // ── Border draw ────────────────────────────────────────────────────────────
  const perim1 = 2 * (440 + 120);
  const perim2 = 2 * (440 + 120);
  const border1 = interpolate(frame, [16, 40], [perim1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const border2 = interpolate(frame, [28, 52], [perim2, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe  = Math.sin(frame * 0.06) * 4;
  const pulse    = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer  = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.85, 1]);

  // ── Ghost parent floating ──────────────────────────────────────────────────
  const ghostFloat = Math.sin(frame * 0.04) * 6;
  const ghostOpacity = interpolate(frame, [42, 60], [0, 0.15], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s07.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="MODULE 2 · IMPLICIT INHERITANCE" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Never Write
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            extends?
          </text>
          <text x={420} y={400} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            Still There.
          </text>
        </g>

        {/* ── Ghost parent silhouette ─────────────────────────────────────── */}
        <g opacity={ghostOpacity} transform={`translate(540, ${480 + ghostFloat})`}>
          <rect x={-200} y={-60} width={400} height={120} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            strokeDasharray="8 6" />
          <text x={0} y={10} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            Object
          </text>
        </g>

        {/* ── Code card 1 — what you write ────────────────────────────────── */}
        <g opacity={codeCard1.opacity} transform={`translate(0, ${codeCard1.translateY})`}>
          <rect x={60} y={560} width={440} height={120} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={perim1} strokeDashoffset={border1} />
          <BentoCard x={60} y={560} w={440} h={120} />
          <text x={80} y={590} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.text_muted}>WHAT YOU WRITE</text>
          <text x={80} y={648}
            fontFamily={MONO} fontSize={32} fontWeight={500} fill={COLORS.white}>
            class Train {'{ }'}
          </text>
        </g>

        {/* ── Arrow ───────────────────────────────────────────────────────── */}
        <g opacity={arrowEnt.opacity}>
          <path d="M 500,620 Q 540,630 580,620"
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
            markerEnd="url(#arrow)" strokeLinecap="round" />
        </g>

        {/* ── Code card 2 — what Java sees ────────────────────────────────── */}
        <g opacity={codeCard2.opacity} transform={`translate(0, ${codeCard2.translateY})`}>
          <rect x={580} y={560} width={440} height={120} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={perim2} strokeDashoffset={border2} />
          <BentoCard x={580} y={560} w={440} h={120} accent />
          <text x={600} y={590} fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent}>WHAT JAVA SEES</text>
          <text x={600} y={648}
            fontFamily={MONO} fontSize={28} fontWeight={500} fill={COLORS.white}>
            class Train
          </text>
          <text x={600 + 28 * 7} y={648}
            fontFamily={MONO} fontSize={28} fontWeight={500} fill={COLORS.accent}>
            {revealedText}
          </text>
          <text x={600 + 28 * (7 + extendsText.length)} y={648}
            fontFamily={MONO} fontSize={28} fontWeight={500} fill={COLORS.white}>
            {' { }'}
          </text>
          {/* Cursor blink */}
          {charsVisible < extendsText.length && frame % 16 < 8 && (
            <rect x={600 + 28 * (7 + charsVisible)} y={626} width={3} height={28}
              fill={COLORS.accent} />
          )}
        </g>

        {/* ── Large "IMPLICIT" text ───────────────────────────────────────── */}
        <g opacity={ghostEnt.opacity} transform={`translate(0, ${ghostEnt.translateY})`}>
          <text x={540} y={800} textAnchor="middle"
            fontFamily={FONT} fontSize={120} fontWeight={800}
            fill={COLORS.accent} opacity={0.08}>
            IMPLICIT
          </text>
        </g>

        {/* ── Info card ───────────────────────────────────────────────────── */}
        <g opacity={infoCard.opacity} transform={`translate(0, ${infoCard.translateY})`}>
          <BentoCard x={60} y={860} w={960} h={320} />
          <rect x={60} y={860} width={6} height={320} rx={3} fill={COLORS.accent} />

          <text x={100} y={930} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            The compiler inserts
          </text>
          <text x={100} y={980} fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            extends Object
          </text>
          <text x={100} y={1040} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            automatically for any class that does
          </text>
          <text x={100} y={1084} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            not already extend something else.
          </text>
          <text x={100} y={1140} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}
            opacity={0.6}>
            This is invisible in your source code.
          </text>
        </g>

        {/* ── Pulse rings ─────────────────────────────────────────────────── */}
        <g transform={`translate(540, ${1340 + breathe})`} opacity={0.12}>
          <circle cx={0} cy={0} r={60} fill="none"
            stroke={COLORS.accent} strokeWidth={1.5}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} />
        </g>

        {/* ── Floating dots ───────────────────────────────────────────────── */}
        <circle cx={120} cy={780 + breathe * 0.6} r={3} fill={COLORS.accent} fillOpacity={0.2} />
        <circle cx={960} cy={900 - breathe * 0.4} r={2.5} fill={COLORS.accent} fillOpacity={0.15} />
        <circle cx={200} cy={1200 + breathe * 0.3} r={4} fill={COLORS.accent} fillOpacity={0.1} />

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s07.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
