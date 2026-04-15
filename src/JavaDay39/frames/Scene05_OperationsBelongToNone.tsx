/**
 * Scene 05 — Operations Belong To None
 * "But some operations in the railway system do not belong to any single object."
 * CSV: 24.240s → 29.240s | Duration: 150 frames
 * Animation: Phase 1 headline → Phase 2 network diagram → Phase 3 pulse
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, FPS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, start: number, len: number, dur = 30) {
  const p = interpolate(frame, [start, start + dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.4, 0, 0.2, 1) });
  return len * (1 - p);
}

export const Scene05_OperationsBelongToNone: React.FC = () => {
  const frame = useCurrentFrame();

  const label = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 12);
  const card1 = useSpringEntrance(frame, 20);
  const card2 = useSpringEntrance(frame, 34);

  // Network nodes
  const nodes = [
    { cx: 540, cy: 780, r: 50, lbl: '?' },
    { cx: 260, cy: 960, r: 40, lbl: 'train1' },
    { cx: 540, cy: 1060, r: 40, lbl: 'train2' },
    { cx: 820, cy: 960, r: 40, lbl: 'train3' },
  ];

  const connLen = 250;
  const conns = [
    usePathDraw(frame, 40, connLen, 25),
    usePathDraw(frame, 45, connLen, 25),
    usePathDraw(frame, 50, connLen, 25),
  ];

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s05.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <DarkBackground />
        <GlobalDefs />

        <g opacity={label.opacity} transform={`translate(0,${label.translateY})`}>
          <SectionLabel text="THE PROBLEM · NO OWNER" y={160} />
        </g>

        <g opacity={headA.opacity} transform={`translate(0,${headA.translateY})`}>
          <text x={60} y={320} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>Some Operations</text>
        </g>
        <g opacity={headB.opacity} transform={`translate(0,${headB.translateY})`}>
          <text x={60} y={420} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.accent}>Belong to No Object</text>
        </g>

        {/* Network diagram */}
        <g opacity={card1.opacity} transform={`translate(0,${card1.translateY})`}>
          <BentoCard x={60} y={500} w={960} h={700} />

          {/* Central question node */}
          <circle cx={nodes[0].cx} cy={nodes[0].cy} r={nodes[0].r} fill={COLORS.accent} fillOpacity={0.12} stroke={COLORS.accent} strokeWidth={3} />
          <text x={nodes[0].cx} y={nodes[0].cy + 14} textAnchor="middle" fontFamily={FONT} fontSize={52} fontWeight={800} fill={COLORS.accent}>{nodes[0].lbl}</text>

          {/* Instance nodes */}
          {nodes.slice(1).map((n, i) => {
            const ent = useSpringEntrance(frame, 35 + i * 8);
            return (
              <g key={i} opacity={ent.opacity}>
                <circle cx={n.cx} cy={n.cy} r={n.r} fill={COLORS.bg_primary} stroke={COLORS.text_muted} strokeWidth={2} strokeDasharray="8,4" />
                <text x={n.cx} y={n.cy + 10} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>{n.lbl}</text>
              </g>
            );
          })}

          {/* Dashed connectors — showing "does not belong" */}
          <line x1={540} y1={830} x2={260} y2={920} stroke={COLORS.vibrant_red} strokeWidth={2} strokeDasharray={connLen} strokeDashoffset={conns[0]} opacity={0.5} />
          <line x1={540} y1={830} x2={540} y2={1020} stroke={COLORS.vibrant_red} strokeWidth={2} strokeDasharray={connLen} strokeDashoffset={conns[1]} opacity={0.5} />
          <line x1={540} y1={830} x2={820} y2={920} stroke={COLORS.vibrant_red} strokeWidth={2} strokeDasharray={connLen} strokeDashoffset={conns[2]} opacity={0.5} />

          {/* X marks on connections */}
          {[{ x: 400, y: 870 }, { x: 540, y: 930 }, { x: 680, y: 870 }].map((pos, i) => {
            const xOp = interpolate(frame, [55 + i * 5, 65 + i * 5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            return (
              <g key={i} opacity={xOp}>
                <line x1={pos.x - 12} y1={pos.y - 12} x2={pos.x + 12} y2={pos.y + 12} stroke={COLORS.vibrant_red} strokeWidth={3} />
                <line x1={pos.x + 12} y1={pos.y - 12} x2={pos.x - 12} y2={pos.y + 12} stroke={COLORS.vibrant_red} strokeWidth={3} />
              </g>
            );
          })}
        </g>

        {/* Bottom takeaway */}
        <g opacity={card2.opacity} transform={`translate(0,${card2.translateY})`}>
          <BentoCard x={60} y={1240} w={960} h={160} accent />
          <rect x={60} y={1240} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={540} y={1340} textAnchor="middle" fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            Network-level, not object-level
          </text>
        </g>

        <g transform={`translate(540, ${1520 + breathe})`}>
          <circle cx={0} cy={0} r={32} fill={COLORS.accent} fillOpacity={0.06} />
          <circle cx={0} cy={0} r={32} fill="none" stroke={COLORS.accent} strokeWidth={1.5} transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {caption && <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s05.duration} />}
      </svg>
    </AbsoluteFill>
  );
};
