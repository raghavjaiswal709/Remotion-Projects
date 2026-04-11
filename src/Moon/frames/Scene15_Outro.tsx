/**
 * Scene 15 — Outro
 * Post-audio recap + CTA.
 * Duration: 210 frames (7s)
 *
 * Visual: Pure black. Moon outline (no fill). Three hero stats.
 * Follow CTA button. Corner brackets.
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { C, fadeIn } from '../helpers/timing';
import { StarField, CornerBrackets } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene15_Outro: React.FC = () => {
  const frame = useCurrentFrame();

  const enter      = fadeIn(frame, 0, 20);
  const moonEnter  = interpolate(frame, [4, 26], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const moonScale  = interpolate(frame, [4, 26], [0.8, 1], { extrapolateRight: 'clamp', easing: ease });
  const stat1Enter = interpolate(frame, [14, 36], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const stat2Enter = interpolate(frame, [22, 44], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const stat3Enter = interpolate(frame, [30, 52], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const ctaEnter   = interpolate(frame, [44, 70], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const tagEnter   = interpolate(frame, [54, 78], [0, 1], { extrapolateRight: 'clamp', easing: ease });

  // Moon ring gentle pulse
  const ringPulse = 1 + interpolate(frame % 60, [0, 30, 60], [0, 0.015, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <filter id="mintGlow15" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feFlood floodColor={C.mint} floodOpacity="0.4" result="c" />
            <feComposite in="c" in2="blur" operator="in" result="cb" />
            <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="pinkGlow15" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feFlood floodColor={C.warm_pink} floodOpacity="0.35" result="c" />
            <feComposite in="c" in2="blur" operator="in" result="cb" />
            <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <StarField opacity={enter * 0.7} />

        {/* Orbit rings around Moon */}
        {[180, 220, 260].map((r, i) => (
          <circle key={i}
            cx={540} cy={620}
            r={r * ringPulse}
            fill="none"
            stroke={i === 0 ? C.teal : C.steel_blue}
            strokeWidth={0.7}
            strokeDasharray={i === 2 ? '4,8' : undefined}
            opacity={moonEnter * (0.2 - i * 0.05)}
          />
        ))}

        {/* Moon — outline only (no fill) */}
        <g opacity={moonEnter}
          transform={`translate(540,620) scale(${moonScale}) translate(-540,-620)`}>
          <circle cx={540} cy={620} r={140}
            fill="none" stroke={C.silver} strokeWidth={2.5} />
          {/* Crater outlines */}
          {[
            { dx: -35, dy: -20, r: 16 },
            { dx:  20, dy:  25, r: 12 },
            { dx: -15, dy:  35, r:  8 },
            { dx:  40, dy: -30, r: 10 },
          ].map((c, i) => (
            <circle key={i}
              cx={540 + c.dx} cy={620 + c.dy} r={c.r}
              fill="none" stroke={C.slate} strokeWidth={1.2} opacity={0.5} />
          ))}
          {/* Shadow half */}
          <path d={`M 540,480 Q 420,550 400,620 Q 420,690 540,760`}
            fill={C.muted_blue} opacity={0.18} />
        </g>

        {/* ── Three stat blocks ── */}
        {/* Stat 1 — 45 MINUTES */}
        <g opacity={stat1Enter}>
          <text x={540} y={880}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={110} fontWeight={900}
            fill={C.warm_pink} letterSpacing="-0.02em"
            filter="url(#pinkGlow15)">
            45
          </text>
          <text x={540} y={942}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={600}
            fill={C.silver} letterSpacing="0.18em" opacity={0.75}>
            MINUTES OF SILENCE
          </text>
        </g>

        {/* Divider 1 */}
        <line x1={240} y1={972} x2={840} y2={972}
          stroke={C.slate} strokeWidth={1} opacity={stat2Enter * 0.3} />

        {/* Stat 2 — 1 SECOND */}
        <g opacity={stat2Enter}>
          <text x={540} y={1062}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={110} fontWeight={900}
            fill={C.steel_blue} letterSpacing="-0.02em">
            1
          </text>
          <text x={540} y={1124}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={600}
            fill={C.silver} letterSpacing="0.18em" opacity={0.75}>
            SECOND OF STATIC
          </text>
        </g>

        {/* Divider 2 */}
        <line x1={240} y1={1154} x2={840} y2={1154}
          stroke={C.slate} strokeWidth={1} opacity={stat3Enter * 0.3} />

        {/* Stat 3 — HISTORY MADE */}
        <g opacity={stat3Enter} filter="url(#mintGlow15)">
          <text x={540} y={1246}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={100} fontWeight={900}
            fill={C.mint} letterSpacing="0.02em">
            HISTORY
          </text>
          <text x={540} y={1310}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={600}
            fill={C.silver} letterSpacing="0.22em" opacity={0.75}>
            MADE FOREVER
          </text>
        </g>

        {/* ── CTA ── */}
        <g opacity={ctaEnter}>
          {/* Follow button */}
          <rect x={200} y={1420} width={680} height={88} rx={44}
            fill="none" stroke={C.warm_pink} strokeWidth={2.5} />
          <text x={540} y={1472}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={34} fontWeight={700}
            fill={C.warm_pink} letterSpacing="0.14em">
            FOLLOW FOR DAILY SECRETS
          </text>

          {/* Share line */}
          <rect x={280} y={1530} width={520} height={70} rx={35}
            fill="none" stroke={C.slate} strokeWidth={1.5} opacity={0.4} />
          <text x={540} y={1574}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={500}
            fill={C.silver} letterSpacing="0.12em" opacity={0.55}>
            SHARE IF IT SURPRISED YOU
          </text>
        </g>

        {/* Apollo 8 tag */}
        <g opacity={tagEnter}>
          <text x={540} y={1680}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={400}
            fill={C.slate} letterSpacing="0.3em" opacity={0.5}>
            APOLLO 8 · DECEMBER 1968
          </text>
        </g>

        {/* Dot row decorations */}
        {[0, 1, 2, 3, 4].map(i => (
          <circle key={i}
            cx={440 + i * 50} cy={1740}
            r={3}
            fill={i === 2 ? C.warm_pink : C.steel_blue}
            opacity={ctaEnter * (i === 2 ? 0.8 : 0.25)}
          />
        ))}

        <CornerBrackets opacity={enter * 0.35} />
      </svg>
    </AbsoluteFill>
  );
};
