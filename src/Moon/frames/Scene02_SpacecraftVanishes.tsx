/**
 * Scene 02 — Spacecraft Vanishes
 * "When a spacecraft passes behind the moon, it vanishes from Earth completely,"
 * Duration: 174 frames (~5.8s) — audio 0.000s → 5.300s
 *
 * Visual: Earth (lower-left) → teal signal line → Spacecraft approaching Moon limb (right)
 * The spacecraft reaches the Moon's edge and disappears behind it.
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { C, fadeIn, easeSnap, clamp } from '../helpers/timing';
import { StarField, CornerBrackets, MoonCircle, EarthCircle, Spacecraft, CaptionBar } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene02_SpacecraftVanishes: React.FC = () => {
  const frame = useCurrentFrame();

  const enter      = fadeIn(frame, 0, 18);
  const moonEnter  = interpolate(frame, [4, 28], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const earthEnter = interpolate(frame, [0, 22], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const captionOp  = fadeIn(frame, 10, 20);

  // Spacecraft travels from open space (left-center) toward Moon's left limb
  // Moon is at cx=820, cy=780, r=310
  // Spacecraft approaches from cx=200, cy=640 toward cx=510, cy=620 (just at Moon's edge)
  const craftProgress = clamp((frame - 20) / 130);
  const craftEased    = easeSnap(craftProgress);
  const craftX        = interpolate(craftEased, [0, 1], [200, 510]);
  const craftY        = interpolate(craftEased, [0, 1], [660, 615]);
  const craftAngle    = -15; // slight tilt toward Moon

  // Signal line from Earth (180, 1400) to spacecraft, drawn progressively
  const sigLen = interpolate(frame, [10, 40], [0, 1], { extrapolateRight: 'clamp', easing: ease });

  // Label entry
  const labelEnter = fadeIn(frame, 30, 20);

  // Spacecraft approaches Moon — fade it out as it passes behind limb
  const behindMoon = clamp((frame - 110) / 50);
  const craftOpacity = 1 - behindMoon;

  // "VANISHES" label pulse
  const vanishOp = interpolate(frame, [100, 130, 160], [0, 1, 0.6], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <filter id="glow02" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="pinkGlow02" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feFlood floodColor={C.warm_pink} floodOpacity="0.5" result="col" />
            <feComposite in="col" in2="blur" operator="in" result="cblur" />
            <feMerge><feMergeNode in="cblur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Clip craft behind moon */}
          <clipPath id="behindMoonClip">
            <rect x={0} y={0} width={1080} height={1920} />
          </clipPath>
        </defs>

        {/* Background stars */}
        <StarField opacity={enter} />

        {/* Faint background depth band (dark teal band on right) */}
        <rect x={600} y={0} width={480} height={1920}
          fill={C.muted_blue} opacity={enter * 0.06} />

        {/* Background label — deep space context */}
        <text x={540} y={120}
          textAnchor="middle"
          fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={500}
          fill={C.slate} letterSpacing="0.35em"
          opacity={enter * 0.5}>
          DEEP SPACE · LUNAR ORBIT APPROACH
        </text>

        {/* Moon — right-center, dominant */}
        <MoonCircle cx={820} cy={780} r={310} opacity={moonEnter} />

        {/* Moon glow halo */}
        <circle cx={820} cy={780} r={315}
          fill="none" stroke={C.silver} strokeWidth={1}
          opacity={moonEnter * 0.25} filter="url(#glow02)" />

        {/* Earth — lower-left */}
        <EarthCircle cx={160} cy={1460} r={90} opacity={earthEnter} />
        <text x={160} y={1568}
          textAnchor="middle"
          fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={600}
          fill={C.mint} letterSpacing="0.12em"
          opacity={earthEnter * 0.8}>
          EARTH
        </text>

        {/* Signal line from Earth to spacecraft — dashed teal */}
        {sigLen > 0 && (
          <line
            x1={160} y1={1460}
            x2={160 + (craftX - 160) * sigLen}
            y2={1460 + (craftY - 1460) * sigLen}
            stroke={C.teal}
            strokeWidth={2.5}
            strokeDasharray="10,7"
            opacity={enter * 0.8 * (1 - behindMoon * 0.7)}
          />
        )}

        {/* Signal pulse dot traveling along line */}
        {sigLen > 0.8 && (
          <circle
            cx={160 + (craftX - 160) * ((frame % 30) / 30)}
            cy={1460 + (craftY - 1460) * ((frame % 30) / 30)}
            r={5}
            fill={C.powder_blue}
            opacity={enter * 0.9}
            filter="url(#glow02)"
          />
        )}

        {/* Spacecraft */}
        <Spacecraft
          cx={craftX}
          cy={craftY}
          scale={1.1}
          angle={craftAngle}
          opacity={craftOpacity}
        />

        {/* Trajectory path hint (faint arc) */}
        <path
          d={`M 200,660 Q 400,580 510,615`}
          fill="none" stroke={C.powder_blue} strokeWidth={1.5}
          strokeDasharray="5,8" opacity={enter * 0.3}
        />

        {/* "VANISHES" dramatic label */}
        <text
          x={540} y={1150}
          textAnchor="middle"
          fontFamily="'Inter', sans-serif"
          fontSize={88}
          fontWeight={900}
          fill={C.warm_pink}
          letterSpacing="0.12em"
          opacity={vanishOp}
          filter="url(#pinkGlow02)"
        >
          VANISHES
        </text>

        {/* "completely" sub-label */}
        <text
          x={540} y={1230}
          textAnchor="middle"
          fontFamily="'Inter', sans-serif"
          fontSize={30}
          fontWeight={400}
          fill={C.silver}
          letterSpacing="0.2em"
          opacity={vanishOp * 0.7}
        >
          FROM EARTH · COMPLETELY
        </text>

        {/* Horizontal rule above caption */}
        <line x1={80} y1={1745} x2={1000} y2={1745}
          stroke={C.steel_blue} strokeWidth={1} opacity={captionOp * 0.3} />

        {/* Corner brackets */}
        <CornerBrackets opacity={enter * 0.3} />
      </svg>

      {/* Caption */}
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }} opacity={captionOp}>
        <CaptionBar
          text="When a spacecraft passes behind the moon, it vanishes from Earth completely,"
          highlight={['vanishes', 'completely']}
        />
      </svg>
    </AbsoluteFill>
  );
};
