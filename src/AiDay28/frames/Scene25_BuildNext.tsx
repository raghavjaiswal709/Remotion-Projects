/**
 * Scene 25 — BuildNext
 * "that is exactly what we build next."
 * CSV: 79.780s → 81.760s
 * Duration: 60 frames (2.0s)
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20):  Label + "BUILD NEXT" hero slam with heavy spring
 *   Phase 2 (frames 12–45): Blueprint/construction visual — scaffold rect with
 *                            stacking blocks, progress bar, forward arrow,
 *                            "TOMORROW: Agent Runtime" teaser card
 *   Phase 3 (frames 38–end): Pulse ring, shimmer, floating accents, block float
 *
 * Visual: Construction / forward-looking — stacking blocks forming a structure,
 *         arrow pointing right, teaser for next day
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
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 } as const;
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;
const SPRING_HEAVY  = { damping: 28, stiffness: 100, mass: 1.4 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, start: number, len: number, dur = 30) {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return len * (1 - p);
}

export const Scene25_BuildNext: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──────────────────────────────────────────────────────────────
  const labelEnter = useSpringEntrance(frame, 0);
  const heroSlam = spring({ frame, fps, config: SPRING_HEAVY });
  const heroTy = interpolate(heroSlam, [0, 1], [48, 0]);
  const heroOp = interpolate(heroSlam, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' });
  const heroScale = interpolate(heroSlam, [0, 1], [0.85, 1]);

  const subEnter = useSpringEntrance(frame, 8);

  // ── Phase 2 ──────────────────────────────────────────────────────────────

  // Stacking blocks — represent building components
  const blocks = [
    { x: 240, y: 820, w: 200, h: 80, label: 'TOOLS', delay: 14, accent: false },
    { x: 440, y: 820, w: 200, h: 80, label: 'CALLING', delay: 18, accent: true },
    { x: 640, y: 820, w: 200, h: 80, label: 'SPECS', delay: 22, accent: false },
    { x: 340, y: 730, w: 200, h: 80, label: 'LOOP', delay: 26, accent: true },
    { x: 540, y: 730, w: 200, h: 80, label: 'RUNTIME', delay: 30, accent: true },
    { x: 440, y: 640, w: 200, h: 80, label: 'AGENT', delay: 34, accent: true },
  ];
  const blockEntrances = blocks.map(b => useSpringEntrance(frame, b.delay));

  // Blueprint scaffold outline
  const scaffoldEnter = useSpringEntrance(frame, 12);
  const scaffoldPerim = 2 * (560 + 340);
  const scaffoldDash = usePathDraw(frame, 12, scaffoldPerim, 20);

  // Forward arrow
  const arrowEnter = useSpringEntrance(frame, 36);
  const arrowLen = 300;
  const arrowDash = usePathDraw(frame, 36, arrowLen, 18);

  // Progress bar
  const progressEnter = useSpringEntrance(frame, 28);
  const progressWidth = interpolate(frame, [28, 50], [0, 800], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  // Teaser card
  const teaserEnter = useSpringEntrance(frame, 38);

  // Bottom wide card
  const wideCard = useSpringEntrance(frame, 42);

  // ── Phase 3 ──────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.07) * 3;
  const pulse = 1 + Math.sin(frame * 0.09) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.85, 1]);

  // Pulse ring behind structure
  const ringR = 180 + ((frame * 1.0) % 50);
  const ringOp = interpolate((frame * 1.0) % 50, [0, 50], [0.08, 0], {
    extrapolateRight: 'clamp',
  });

  // Floating particles
  const floatDots = [
    { x: 120, y: 560 }, { x: 960, y: 580 }, { x: 200, y: 1100 },
    { x: 880, y: 1080 }, { x: 500, y: 1160 }, { x: 700, y: 540 },
    { x: 300, y: 1250 }, { x: 780, y: 1230 },
  ];

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s25.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="TOOL CALLING · WHAT'S NEXT" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B — Hero headline ─────────────────────────────────── */}
        <g opacity={heroOp}
           transform={`translate(540, ${310 + heroTy}) scale(${heroScale})`}
           style={{ transformOrigin: '0px 0px' }}>
          <text x={0} y={0} textAnchor="middle"
            fontFamily={FONT} fontSize={110} fontWeight={800} fill={COLORS.white}>
            Build
          </text>
        </g>
        <g opacity={heroOp * 0.95}
           transform={`translate(540, ${430 + heroTy}) scale(${heroScale})`}
           style={{ transformOrigin: '0px 0px' }}>
          <text x={0} y={0} textAnchor="middle"
            fontFamily={FONT} fontSize={88} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Next.
          </text>
        </g>
        <g opacity={subEnter.opacity} transform={`translate(0, ${subEnter.translateY})`}>
          <text x={540} y={510} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            That is exactly what we do
          </text>
        </g>

        {/* ── ZONE C — Construction visual ───────────────────────────── */}

        {/* Pulse ring behind scaffold */}
        {frame > 35 && (
          <circle cx={540} cy={750} r={ringR}
            fill="none" stroke={COLORS.accent} strokeWidth={0.8} opacity={ringOp} />
        )}

        {/* Blueprint scaffold outline */}
        <g opacity={scaffoldEnter.opacity}>
          <rect x={220} y={620} width={640} height={300} rx={16}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            strokeDasharray={scaffoldPerim} strokeDashoffset={scaffoldDash}
            opacity={0.2} />
          {/* Cross hatch lines */}
          <line x1={220} y1={730} x2={860} y2={730}
            stroke={COLORS.accent} strokeWidth={0.5} opacity={scaffoldEnter.opacity * 0.1} />
          <line x1={220} y1={820} x2={860} y2={820}
            stroke={COLORS.accent} strokeWidth={0.5} opacity={scaffoldEnter.opacity * 0.1} />
          <line x1={440} y1={620} x2={440} y2={920}
            stroke={COLORS.accent} strokeWidth={0.5} opacity={scaffoldEnter.opacity * 0.1} />
          <line x1={640} y1={620} x2={640} y2={920}
            stroke={COLORS.accent} strokeWidth={0.5} opacity={scaffoldEnter.opacity * 0.1} />
        </g>

        {/* Stacking blocks */}
        {blocks.map((b, i) => (
          <g key={i} opacity={blockEntrances[i].opacity}
             transform={`translate(0, ${blockEntrances[i].translateY + (i === 5 ? breathe : 0)})`}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={12}
              fill={COLORS.bg_secondary}
              stroke={b.accent ? COLORS.accent : 'rgba(255,255,255,0.12)'}
              strokeWidth={b.accent ? 2 : 1} />
            <text x={b.x + b.w / 2} y={b.y + b.h / 2 + 8} textAnchor="middle"
              fontFamily={FONT} fontSize={22} fontWeight={800}
              fill={b.accent ? COLORS.accent : COLORS.text_muted}
              letterSpacing="0.08em">
              {b.label}
            </text>
          </g>
        ))}

        {/* Top block crown accent */}
        {blockEntrances[5].opacity > 0.5 && (
          <g opacity={blockEntrances[5].opacity * 0.6}>
            <line x1={540} y1={630} x2={540} y2={610}
              stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round" />
            <circle cx={540} cy={604} r={4} fill={COLORS.accent}
              opacity={0.5 + 0.5 * Math.sin(frame * 0.15)} />
          </g>
        )}

        {/* Progress bar */}
        <g opacity={progressEnter.opacity} transform={`translate(0, ${progressEnter.translateY})`}>
          <rect x={140} y={960} width={800} height={10} rx={5}
            fill="rgba(255,255,255,0.06)" />
          <rect x={140} y={960} width={progressWidth} height={10} rx={5}
            fill={COLORS.accent} opacity={0.8} />
          <text x={140} y={998}
            fontFamily={FONT} fontSize={20} fontWeight={800} fill={COLORS.text_muted}>
            Day 28 complete
          </text>
          <text x={940} y={998} textAnchor="end"
            fontFamily={FONT} fontSize={20} fontWeight={800} fill={COLORS.accent}>
            Next: Day 29
          </text>
        </g>

        {/* Forward arrow */}
        <g opacity={arrowEnter.opacity}>
          <line x1={390} y1={1060} x2={390 + arrowLen} y2={1060}
            stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
            strokeLinecap="round" markerEnd="url(#arrow)" />
        </g>

        {/* Teaser card */}
        <g opacity={teaserEnter.opacity} transform={`translate(0, ${teaserEnter.translateY})`}>
          <BentoCard x={60} y={1110} w={960} h={180} accent />
          <rect x={60} y={1110} width={6} height={180} rx={3} fill={COLORS.accent} />
          <text x={100} y={1170}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.1em">
            TOMORROW — DAY 29
          </text>
          <text x={100} y={1218}
            fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            What Is an Agent Runtime?
          </text>
          <text x={100} y={1262}
            fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            The system that reads decisions and turns them into actions
          </text>
        </g>

        {/* Wide summary card */}
        <g opacity={wideCard.opacity} transform={`translate(0, ${wideCard.translateY})`}>
          <BentoCard x={60} y={1320} w={960} h={100} />
          <text x={540} y={1384} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Tool calling understood — now we
            <tspan fill={COLORS.accent} fontStyle="italic"> build the runtime</tspan>
          </text>
        </g>

        {/* ── Key concept recap tiles ────────────────────────────────── */}
        <g opacity={wideCard.opacity * 0.8} transform={`translate(0, ${wideCard.translateY + 4})`}>
          {[
            { x: 60, label: 'MODEL DECIDES', w: 300 },
            { x: 380, label: 'SPEC GENERATED', w: 310 },
            { x: 710, label: 'SYSTEM EXECUTES', w: 310 },
          ].map((item, i) => (
            <g key={i}>
              <rect x={item.x} y={1450} width={item.w} height={48} rx={24}
                fill={COLORS.accent} opacity={0.08} />
              <text x={item.x + item.w / 2} y={1480} textAnchor="middle"
                fontFamily={FONT} fontSize={18} fontWeight={800}
                fill={COLORS.accent} letterSpacing="0.08em">
                {item.label}
              </text>
            </g>
          ))}
        </g>

        {/* ── Floating accent particles ──────────────────────────────── */}
        {floatDots.map((d, i) => (
          <circle key={i}
            cx={d.x} cy={d.y + breathe * (i % 2 === 0 ? 1 : -1)}
            r={2} fill={COLORS.accent} opacity={0.05 * shimmer} />
        ))}

        {/* ── Corner accents ─────────────────────────────────────────── */}
        <g opacity={labelEnter.opacity * 0.3}>
          <line x1={1020} y1={1700} x2={1020} y2={1640}
            stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round" />
          <line x1={1020} y1={1700} x2={960} y2={1700}
            stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round" />
        </g>

        {/* ── CAPTION ──────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s25.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
