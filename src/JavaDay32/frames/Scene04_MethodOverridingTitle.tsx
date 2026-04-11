/**
 * Scene04 — Method Overriding Title
 * "Today, we are looking at method overriding."
 * CSV: 10.50s → 13.18s
 * Duration: 98 frames (3.3s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Title reveal — per-word spring entrance, label slide
 *   Phase 2 (frames 20–60):  Decorative elements — underline draw, accent bars, definition card
 *   Phase 3 (frames 55–end): Micro — breathing glow, floating accent dots
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
import { PaperBackground, GlobalDefs, Caption, SectionLabel } from '../helpers/components';

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

export const Scene04_MethodOverridingTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Per-word title entrance ───────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);

  const titleWords = ['Method', 'Overriding'];
  const wordSprings = titleWords.map((_, i) => {
    const f = Math.max(0, frame - i * 8);
    const sp = spring({ frame: f, fps, config: SPRING_SNAP });
    const ty = interpolate(sp, [0, 1], [28, 0]);
    const op = interpolate(sp, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });
    return { translateY: ty, opacity: op };
  });

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const underlineDraw = usePathDraw(frame, 16, 700, 22);
  const defCard = useSpringEntrance(frame, 24);
  const accentBar1 = useSpringEntrance(frame, 32);
  const accentBar2 = useSpringEntrance(frame, 40);
  const accentBar3 = useSpringEntrance(frame, 48);
  const badge = useSpringEntrance(frame, 36);

  // ── Border draw for definition card ────────────────────────────────────────
  const defPerimeter = 2 * (960 + 200);
  const defBorderDraw = usePathDraw(frame, 24, defPerimeter, 28);

  // ── Railway track pattern draw ─────────────────────────────────────────────
  const trackDraw = usePathDraw(frame, 40, 960, 25);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.018;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Floating accent particles
  const particles = Array.from({ length: 5 }, (_, i) => {
    const px = 160 + i * 200;
    const py = 520 + Math.sin((frame + i * 15) * 0.05) * 8;
    const pop = interpolate(frame, [28 + i * 5, 40 + i * 5], [0, 0.25], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return { x: px, y: py, opacity: pop * shimmer };
  });

  // ── Ghost text behind title ────────────────────────────────────────────────
  const ghostOp = interpolate(frame, [0, 14], [0, 0.05], {
    extrapolateRight: 'clamp',
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s04.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="MODULE 2 · NETWORK EXPANSION" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B — Ghost text layer ───────────────────────────────────── */}
        <text
          x={540} y={500}
          textAnchor="middle"
          fontFamily="'Inter', system-ui, sans-serif"
          fontSize={160} fontWeight={900}
          fill={COLORS.orange}
          opacity={ghostOp}
        >
          OVERRIDE
        </text>

        {/* ── ZONE B — Per-word title ─────────────────────────────────────── */}
        {titleWords.map((word, i) => (
          <g key={i}>
            <text
              x={540}
              y={380 + i * 120}
              textAnchor="middle"
              fontFamily="'Inter', system-ui, sans-serif"
              fontSize={96}
              fontWeight={900}
              fill={i === 1 ? COLORS.orange : COLORS.deep_black}
              opacity={wordSprings[i].opacity}
              transform={`translate(0, ${wordSprings[i].translateY})`}
            >
              {word}
            </text>
          </g>
        ))}

        {/* ── Underline draw ──────────────────────────────────────────────── */}
        <line
          x1={190} y1={530} x2={890} y2={530}
          stroke={COLORS.orange}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={700}
          strokeDashoffset={underlineDraw}
        />

        {/* ── Floating particles ──────────────────────────────────────────── */}
        {particles.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={6} fill={COLORS.orange} opacity={p.opacity} />
        ))}

        {/* ── Definition card ─────────────────────────────────────────────── */}
        <rect
          x={60} y={620} width={960} height={200} rx={16}
          fill="none"
          stroke={COLORS.sky_blue}
          strokeWidth={2}
          strokeDasharray={defPerimeter}
          strokeDashoffset={defBorderDraw}
        />
        <rect
          x={60} y={620} width={960} height={200} rx={16}
          fill={COLORS.sky_blue}
          fillOpacity={defCard.opacity * 0.05}
        />
        <g opacity={defCard.opacity} transform={`translate(0, ${defCard.translateY * 0.4})`}>
          <text
            x={540} y={700}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={36} fontWeight={700}
            fill={COLORS.deep_black}
          >
            A child class redefines a method
          </text>
          <text
            x={540} y={758}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={36} fontWeight={700}
            fill={COLORS.deep_black}
          >
            inherited from the parent
          </text>
        </g>

        {/* ── OOP badge ───────────────────────────────────────────────────── */}
        <g opacity={badge.opacity} transform={`translate(0, ${badge.translateY + breathe})`}>
          <rect
            x={350} y={870} width={380} height={60} rx={30}
            fill={COLORS.purple} fillOpacity={0.08}
            stroke={COLORS.purple} strokeWidth={1.5}
          />
          <text
            x={540} y={910}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={28} fontWeight={700}
            fill={COLORS.purple}
          >
            POLYMORPHISM
          </text>
        </g>

        {/* ── Three concept bars ──────────────────────────────────────────── */}
        <g opacity={accentBar1.opacity} transform={`translate(0, ${accentBar1.translateY})`}>
          <rect x={60} y={1000} width={6} height={52} rx={3} fill={COLORS.orange} />
          <text x={90} y={1036} fontFamily="'Inter', system-ui, sans-serif" fontSize={36} fontWeight={600} fill={COLORS.deep_black}>
            Same method name
          </text>
        </g>
        <g opacity={accentBar2.opacity} transform={`translate(0, ${accentBar2.translateY})`}>
          <rect x={60} y={1090} width={6} height={52} rx={3} fill={COLORS.sky_blue} />
          <text x={90} y={1126} fontFamily="'Inter', system-ui, sans-serif" fontSize={36} fontWeight={600} fill={COLORS.deep_black}>
            Different implementation
          </text>
        </g>
        <g opacity={accentBar3.opacity} transform={`translate(0, ${accentBar3.translateY})`}>
          <rect x={60} y={1180} width={6} height={52} rx={3} fill={COLORS.green} />
          <text x={90} y={1216} fontFamily="'Inter', system-ui, sans-serif" fontSize={36} fontWeight={600} fill={COLORS.deep_black}>
            Runtime decides which runs
          </text>
        </g>

        {/* ── Railway track decoration ────────────────────────────────────── */}
        <g opacity={0.2}>
          <line
            x1={60} y1={1380} x2={1020} y2={1380}
            stroke={COLORS.brown}
            strokeWidth={3}
            strokeDasharray={960}
            strokeDashoffset={trackDraw}
          />
          <line
            x1={60} y1={1392} x2={1020} y2={1392}
            stroke={COLORS.brown}
            strokeWidth={3}
            strokeDasharray={960}
            strokeDashoffset={trackDraw}
          />
          {Array.from({ length: 16 }, (_, i) => {
            const tx = 80 + i * 60;
            const top = interpolate(frame, [44 + i * 2, 54 + i * 2], [0, 0.35], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <rect key={i} x={tx} y={1375} width={30} height={22} rx={2} fill={COLORS.brown} opacity={top} />
            );
          })}
        </g>

        {/* ── Corner accents ──────────────────────────────────────────────── */}
        <g opacity={0.35 * shimmer}>
          <path d="M 60,70 L 60,150 M 60,70 L 140,70" fill="none" stroke={COLORS.orange} strokeWidth={3} strokeLinecap="round" />
          <path d="M 1020,70 L 1020,150 M 1020,70 L 940,70" fill="none" stroke={COLORS.orange} strokeWidth={3} strokeLinecap="round" />
        </g>

        {/* ── Pulsing dot on definition card ──────────────────────────────── */}
        <circle
          cx={1000} cy={640} r={6}
          fill={COLORS.sky_blue}
          opacity={0.5 * shimmer}
          transform={`scale(${pulse})`}
          style={{ transformOrigin: '1000px 640px' }}
        />

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s04.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
