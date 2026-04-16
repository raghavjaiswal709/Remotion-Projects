/**
 * Scene 03 — NamedFunction
 * "a named callable function that bridges the model's text output and real world effects."
 * CSV: 8.100s → 13.320s
 * Duration: 180 frames (6.0s)
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):   Label + headline spring in
 *   Phase 2 (frames 20–100): Bridge diagram builds — model box, bridge path, real world box
 *   Phase 3 (frames 90–end): Pulse on bridge, data flowing across
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
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;

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

export const Scene03_NamedFunction: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Reveal ─────────────────────────────────────────────────────────
  const labelEnter = useSpringEntrance(frame, 0);
  const headWord1 = useSpringEntrance(frame, 4);
  const headWord2 = useSpringEntrance(frame, 10);
  const headWord3 = useSpringEntrance(frame, 16);

  // ── Phase 2: Bridge diagram ─────────────────────────────────────────────────
  const modelBox = useSpringEntrance(frame, 22);
  const bridgePath = useSpringEntrance(frame, 34);
  const worldBox = useSpringEntrance(frame, 46);
  const funcLabel = useSpringEntrance(frame, 40);
  const detailCard1 = useSpringEntrance(frame, 56);
  const detailCard2 = useSpringEntrance(frame, 66);
  const detailCard3 = useSpringEntrance(frame, 76);

  // Bridge arc path draw
  const bridgeLen = 480;
  const bridgeDash = usePathDraw(frame, 32, bridgeLen, 35);

  // Model box border draw
  const modelPerim = 2 * (360 + 280);
  const modelBorderDash = interpolate(frame, [22, 46], [modelPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // World box border draw
  const worldPerim = 2 * (360 + 280);
  const worldBorderDash = interpolate(frame, [44, 68], [worldPerim, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ── Phase 3: Micro-animations ───────────────────────────────────────────────
  const dataFlowX = interpolate(frame % 60, [0, 60], [0, 1], { extrapolateRight: 'clamp' });
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const breathe = Math.sin(frame * 0.05) * 3;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.8, 1]);

  // Data dots flowing across bridge
  const dotPositions = [0, 0.33, 0.66].map(offset => {
    const t = ((dataFlowX + offset) % 1);
    return {
      x: interpolate(t, [0, 1], [160, 920]),
      y: interpolate(t, [0, 0.5, 1], [780, 680, 780]),
      opacity: t > 0.05 && t < 0.95 ? 0.7 : 0,
    };
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s03.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="TOOL USE · DEFINITION" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B — Per-word headline ─────────────────────────────────── */}
        {[
          { text: 'Named', enter: headWord1, y: 280 },
          { text: 'Callable', enter: headWord2, y: 370 },
          { text: 'Function', enter: headWord3, y: 460 },
        ].map((w, i) => (
          <g key={i} transform={`translate(0, ${w.enter.translateY})`} opacity={w.enter.opacity}>
            <text
              x={60} y={w.y}
              fontFamily={FONT}
              fontSize={96} fontWeight={800}
              fill={i === 2 ? COLORS.accent : COLORS.white}
              fontStyle={i === 2 ? 'italic' : 'normal'}
            >
              {w.text}
            </text>
          </g>
        ))}

        {/* ── ZONE C — Bridge Diagram ───────────────────────────────────── */}

        {/* Model text output box — left side */}
        <g opacity={modelBox.opacity} transform={`translate(0, ${modelBox.translateY})`}>
          <BentoCard x={60} y={580} w={360} h={280} />
          <rect x={60} y={580} width={360} height={280} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={modelPerim} strokeDashoffset={modelBorderDash} />
          {/* Screen icon */}
          <rect x={140} y={620} width={200} height={120} rx={8}
            fill="none" stroke={COLORS.accent} strokeWidth={2} opacity={0.5} />
          {/* Text lines inside screen */}
          {[0, 1, 2].map(i => (
            <rect key={i} x={160} y={645 + i * 28} width={160 - i * 30} height={8} rx={4}
              fill={COLORS.accent} opacity={0.3 + i * 0.1} />
          ))}
          <text x={240} y={800} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            MODEL
          </text>
          <text x={240} y={840} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Text Output
          </text>
        </g>

        {/* Bridge arc — connecting path */}
        <g opacity={bridgePath.opacity}>
          <path
            d="M 420,720 Q 540,600 660,720"
            fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={bridgeLen} strokeDashoffset={bridgeDash}
            strokeLinecap="round"
          />
          {/* Bridge pillars */}
          <line x1={420} y1={720} x2={420} y2={780} stroke={COLORS.accent}
            strokeWidth={3} opacity={bridgePath.opacity * 0.6} />
          <line x1={660} y1={720} x2={660} y2={780} stroke={COLORS.accent}
            strokeWidth={3} opacity={bridgePath.opacity * 0.6} />
          {/* Bridge deck */}
          <line x1={420} y1={780} x2={660} y2={780} stroke={COLORS.accent}
            strokeWidth={2} opacity={bridgePath.opacity * 0.4} />
        </g>

        {/* "FUNCTION" label on bridge */}
        <g opacity={funcLabel.opacity} transform={`translate(0, ${funcLabel.translateY})`}>
          <text x={540} y={670} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic" opacity={shimmer}>
            function()
          </text>
        </g>

        {/* Data dots flowing across bridge */}
        {dotPositions.map((dot, i) => (
          <circle key={i} cx={dot.x} cy={dot.y} r={6}
            fill={COLORS.accent} opacity={dot.opacity * bridgePath.opacity} />
        ))}

        {/* Real world effects box — right side */}
        <g opacity={worldBox.opacity} transform={`translate(0, ${worldBox.translateY})`}>
          <BentoCard x={660} y={580} w={360} h={280} accent />
          <rect x={660} y={580} width={360} height={280} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={worldPerim} strokeDashoffset={worldBorderDash} />
          {/* Globe icon */}
          <circle cx={840} cy={680} r={50} fill="none"
            stroke={COLORS.accent} strokeWidth={2.5} />
          <ellipse cx={840} cy={680} rx={50} ry={20} fill="none"
            stroke={COLORS.accent} strokeWidth={1.5} opacity={0.5} />
          <line x1={840} y1={630} x2={840} y2={730}
            stroke={COLORS.accent} strokeWidth={1.5} opacity={0.5} />
          <text x={840} y={790} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            WORLD
          </text>
          <text x={840} y={830} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Real Effects
          </text>
        </g>

        {/* ── Detail cards below diagram ────────────────────────────────── */}
        {[
          { enter: detailCard1, y: 920, label: 'NAMED', desc: 'Has an identity the model can reference' },
          { enter: detailCard2, y: 1120, label: 'CALLABLE', desc: 'Can be invoked with arguments' },
          { enter: detailCard3, y: 1320, label: 'BRIDGES', desc: 'Connects text to real-world actions' },
        ].map((card, i) => (
          <g key={i} opacity={card.enter.opacity} transform={`translate(0, ${card.enter.translateY})`}>
            <BentoCard x={60} y={card.y} w={960} h={160} />
            <rect x={60} y={card.y} width={6} height={160} rx={3}
              fill={COLORS.accent} opacity={0.8} />
            <text x={100} y={card.y + 60}
              fontFamily={FONT} fontSize={38} fontWeight={800}
              fill={COLORS.accent} fontStyle="italic">
              {card.label}
            </text>
            <text x={100} y={card.y + 110}
              fontFamily={FONT} fontSize={34} fontWeight={800}
              fill={COLORS.text_muted}>
              {card.desc}
            </text>
          </g>
        ))}

        {/* ── Floating accent particles ─────────────────────────────────── */}
        {[
          { x: 100, y: 1600, r: 4 }, { x: 980, y: 1580, r: 5 },
          { x: 540, y: 1650, r: 3 }, { x: 300, y: 530, r: 4 },
        ].map((p, i) => (
          <circle key={i}
            cx={p.x} cy={p.y + Math.sin(frame * 0.04 + i * 1.5) * 8}
            r={p.r} fill={COLORS.accent} opacity={0.12 * shimmer}
          />
        ))}

        {/* ── Pulse rings on bridge ─────────────────────────────────────── */}
        <circle cx={540} cy={700} r={40 * pulse}
          fill="none" stroke={COLORS.accent} strokeWidth={1} opacity={0.1} />

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
