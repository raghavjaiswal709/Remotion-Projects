/**
 * Scene 11 — Cannot Access Instance
 * "They cannot access instance variables because there is no object, no instance, nothing to reach into."
 * CSV: 55.760s → 63.020s | Duration: 218 frames
 * Animation: Phase 1 headline → Phase 2 wall diagram → Phase 3 breathe
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

function usePathDraw(frame: number, start: number, len: number, dur = 25) {
  const p = interpolate(frame, [start, start + dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.4, 0, 0.2, 1) });
  return len * (1 - p);
}

export const Scene11_CannotAccessInstance: React.FC = () => {
  const frame = useCurrentFrame();

  const label = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 12);
  const card1 = useSpringEntrance(frame, 22);
  const card2 = useSpringEntrance(frame, 36);
  const card3 = useSpringEntrance(frame, 48);

  const wallLen = 800;
  const wallDraw = usePathDraw(frame, 30, wallLen, 30);

  const breathe = Math.sin(frame * 0.06) * 4;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s11.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <DarkBackground />
        <GlobalDefs />

        <g opacity={label.opacity} transform={`translate(0,${label.translateY})`}>
          <SectionLabel text="WHY · NO INSTANCE ACCESS" y={160} />
        </g>

        <g opacity={headA.opacity} transform={`translate(0,${headA.translateY})`}>
          <text x={60} y={310} fontFamily={FONT} fontSize={70} fontWeight={800} fill={COLORS.vibrant_red}>Cannot Access</text>
        </g>
        <g opacity={headB.opacity} transform={`translate(0,${headB.translateY})`}>
          <text x={60} y={400} fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.white}>Instance Variables</text>
        </g>

        {/* Static method side */}
        <g opacity={card1.opacity} transform={`translate(0,${card1.translateY})`}>
          <BentoCard x={60} y={470} w={440} h={460} accent />
          <text x={280} y={530} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>STATIC METHOD</text>

          {/* Method box */}
          <rect x={110} y={560} width={340} height={120} rx={12} fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={2} />
          <text x={280} y={618} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>getTotal()</text>
          <text x={280} y={660} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>static context</text>

          {/* Thought bubble */}
          <text x={280} y={740} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            "Where is the object?"
          </text>
          <text x={280} y={780} textAnchor="middle" fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.vibrant_red}>
            NOWHERE
          </text>
        </g>

        {/* Brick wall barrier */}
        <line x1={540} y1={470} x2={540} y2={1100} stroke={COLORS.vibrant_red} strokeWidth={4} strokeDasharray={wallLen} strokeDashoffset={wallDraw} />
        {/* Bricks on wall */}
        {[500, 580, 660, 740, 820, 900, 980].map((y, i) => {
          const brickOp = interpolate(frame, [35 + i * 3, 45 + i * 3], [0, 0.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return (
            <g key={i} opacity={brickOp}>
              <rect x={525} y={y} width={30} height={60} rx={2} fill="none" stroke={COLORS.vibrant_red} strokeWidth={1.5} />
            </g>
          );
        })}

        {/* Instance side */}
        <g opacity={card2.opacity} transform={`translate(0,${card2.translateY})`}>
          <BentoCard x={580} y={470} w={440} h={460} />
          <text x={800} y={530} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>INSTANCE VARS</text>

          {[
            { y: 570, lbl: 'int speed = 120' },
            { y: 660, lbl: 'String route = "A→B"' },
            { y: 750, lbl: 'boolean active = true' },
          ].map((item, i) => {
            const ent = useSpringEntrance(frame, 40 + i * 8);
            return (
              <g key={i} opacity={ent.opacity}>
                <rect x={620} y={item.y} width={360} height={70} rx={10} fill={COLORS.bg_primary} stroke={COLORS.text_muted} strokeWidth={1.5} strokeDasharray="6,4" />
                <text x={800} y={item.y + 46} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>{item.lbl}</text>
              </g>
            );
          })}

          <text x={800} y={880} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.vibrant_red}>UNREACHABLE</text>
        </g>

        {/* Bottom reason */}
        <g opacity={card3.opacity} transform={`translate(0,${card3.translateY})`}>
          <BentoCard x={60} y={970} w={960} h={160} accent />
          <rect x={60} y={970} width={6} height={160} rx={3} fill={COLORS.vibrant_red} />
          <text x={100} y={1040} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>No object exists in static context</text>
          <text x={100} y={1090} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>Nothing to reach into — no "this" reference</text>
        </g>

        <g transform={`translate(540, ${1260 + breathe})`}>
          <circle cx={0} cy={0} r={28} fill={COLORS.vibrant_red} fillOpacity={0.06} />
        </g>

        {caption && <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s11.duration} />}
      </svg>
    </AbsoluteFill>
  );
};
