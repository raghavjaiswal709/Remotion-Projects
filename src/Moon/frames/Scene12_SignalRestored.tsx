/**
 * Scene 12 — Signal Restored
 * "Then one crackle came through the headset. Signal restored. Burn successful."
 * Duration: 195 frames (~6.5s) — audio 70.580s → 77.060s
 *
 * Visual: Headset icon (copper). Radio signal waves expanding outward.
 * Signal meter climbing from zero to full. "SIGNAL RESTORED" text reveal.
 * "BURN SUCCESSFUL" in soft mint.
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { C, fadeIn, clamp } from '../helpers/timing';
import { StarField, CornerBrackets, CaptionBar } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene12_SignalRestored: React.FC = () => {
  const frame = useCurrentFrame();

  const enter        = fadeIn(frame, 0, 18);
  const captionOp    = fadeIn(frame, 10, 20);
  const headsetEnter = interpolate(frame, [0, 22], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const crackleOp    = interpolate(frame, [16, 36], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const waveEnter    = interpolate(frame, [20, 50], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const meterFill    = interpolate(frame, [30, 90], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const sigRestored  = interpolate(frame, [60, 90], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const burnSuccess  = interpolate(frame, [80, 115], [0, 1], { extrapolateRight: 'clamp', easing: ease });

  // Wave rings expanding outward from headset center
  const headCX = 540, headCY = 820;
  const numRings = 6;

  // Crackle static lines
  const staticLines = Array.from({ length: 18 }, (_, i) => {
    const h1 = ((i * 2654435761 + 7) >>> 0) / 4294967296;
    const h2 = ((i * 2246822519 + 11) >>> 0) / 4294967296;
    const h3 = ((i * 3266489917 + 13) >>> 0) / 4294967296;
    return {
      x: headCX - 200 + h1 * 400,
      y: headCY - 140 + h2 * 280,
      len: 12 + h3 * 30,
      angle: h1 * 180,
    };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <filter id="mintGlow12" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feFlood floodColor={C.mint} floodOpacity="0.5" result="c" />
            <feComposite in="c" in2="blur" operator="in" result="cb" />
            <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="waveGlow12" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feFlood floodColor={C.powder_blue} floodOpacity="0.3" result="c" />
            <feComposite in="c" in2="blur" operator="in" result="cb" />
            <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="pinkGlow12" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feFlood floodColor={C.warm_pink} floodOpacity="0.4" result="c" />
            <feComposite in="c" in2="blur" operator="in" result="cb" />
            <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <StarField opacity={enter * 0.3} />

        {/* Background: dark before signal, then subtle light fills in */}
        <circle cx={headCX} cy={headCY} r={500}
          fill={C.steel_blue} opacity={waveEnter * 0.05} />

        {/* ── Expanding signal rings ── */}
        {Array.from({ length: numRings }, (_, i) => {
          const delay = i * 18;
          const ringProgress = clamp((frame - 20 - delay) / 60);
          const ringR = interpolate(ringProgress, [0, 1], [40, 420]);
          const ringOp = interpolate(ringProgress, [0, 0.3, 1], [0, 0.7, 0]);
          const ringColor = i % 2 === 0 ? C.powder_blue : C.teal;
          return (
            <circle key={i}
              cx={headCX} cy={headCY}
              r={ringR}
              fill="none"
              stroke={ringColor}
              strokeWidth={2 - i * 0.2}
              opacity={ringOp * waveEnter}
              filter="url(#waveGlow12)"
            />
          );
        })}

        {/* ── Headset illustration ── */}
        <g opacity={headsetEnter}>
          {/* Headband arc */}
          <path d={`M ${headCX - 90},${headCY - 20} Q ${headCX},${headCY - 120} ${headCX + 90},${headCY - 20}`}
            fill="none" stroke={C.copper} strokeWidth={8} strokeLinecap="round" />
          {/* Left ear cup */}
          <rect x={headCX - 120} y={headCY - 30} width={40} height={60} rx={12}
            fill={C.copper} stroke={C.silver} strokeWidth={2} />
          {/* Left ear cup inner */}
          <rect x={headCX - 112} y={headCY - 22} width={24} height={44} rx={8}
            fill={C.muted_blue} opacity={0.6} />
          {/* Right ear cup */}
          <rect x={headCX + 80} y={headCY - 30} width={40} height={60} rx={12}
            fill={C.copper} stroke={C.silver} strokeWidth={2} />
          {/* Right ear cup inner */}
          <rect x={headCX + 88} y={headCY - 22} width={24} height={44} rx={8}
            fill={C.muted_blue} opacity={0.6} />
          {/* Mic arm */}
          <path d={`M ${headCX - 100},${headCY + 20} Q ${headCX - 130},${headCY + 60} ${headCX - 120},${headCY + 90}`}
            fill="none" stroke={C.copper} strokeWidth={4} strokeLinecap="round" />
          <circle cx={headCX - 120} cy={headCY + 96} r={8}
            fill={C.steel_blue} stroke={C.powder_blue} strokeWidth={1.5} />
        </g>

        {/* Crackle static around headset */}
        <g opacity={crackleOp * (1 - meterFill * 0.4)}>
          {staticLines.map((sl, i) => {
            // Flicker effect
            const flickerOp = interpolate(frame % 8, [0, 2, 4, 6, 8], [0.2, 1, 0.4, 0.9, 0.3]);
            return (
              <line key={i}
                x1={sl.x}
                y1={sl.y}
                x2={sl.x + Math.cos((sl.angle * Math.PI) / 180) * sl.len}
                y2={sl.y + Math.sin((sl.angle * Math.PI) / 180) * sl.len}
                stroke={C.silver}
                strokeWidth={1}
                opacity={0.3 + (i % 3) * 0.15}
              />
            );
          })}
        </g>

        {/* ── Signal strength meter (right side) ── */}
        <g opacity={enter}>
          {/* Meter background */}
          <rect x={800} y={640} width={70} height={360} rx={8}
            fill={C.muted_blue} opacity={0.25} />
          <rect x={800} y={640} width={70} height={360} rx={8}
            fill="none" stroke={C.silver} strokeWidth={1.5} opacity={0.4} />

          {/* Fill bar */}
          <rect x={808} y={640 + 360 - 360 * meterFill}
            width={54} height={360 * meterFill}
            rx={4}
            fill={interpolate(meterFill, [0, 0.5, 1], [0, 0, 1]) > 0.5 ? C.mint : C.steel_blue}
            opacity={0.9}
            filter="url(#mintGlow12)"
          />

          {/* Meter ticks */}
          {[0.25, 0.5, 0.75].map(t => (
            <line key={t}
              x1={796} y1={640 + 360 * (1 - t)}
              x2={874} y2={640 + 360 * (1 - t)}
              stroke={C.slate} strokeWidth={1} opacity={0.4} />
          ))}

          {/* Label */}
          <text x={835} y={632}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={16} fontWeight={600}
            fill={C.silver} letterSpacing="0.1em" opacity={0.6}>
            SIG
          </text>
        </g>

        {/* ── SIGNAL RESTORED ── */}
        <g opacity={sigRestored} filter="url(#mintGlow12)">
          <text x={540} y={1120}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={68} fontWeight={900}
            fill={C.mint} letterSpacing="0.08em">
            SIGNAL
          </text>
          <text x={540} y={1196}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={68} fontWeight={900}
            fill={C.mint} letterSpacing="0.08em">
            RESTORED
          </text>
        </g>

        {/* ── BURN SUCCESSFUL ── */}
        <g opacity={burnSuccess} filter="url(#mintGlow12)">
          <text x={540} y={1310}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={48} fontWeight={700}
            fill={C.steel_blue} letterSpacing="0.1em">
            BURN SUCCESSFUL
          </text>
          {/* Checkmarks */}
          <g stroke={C.mint} strokeWidth={4} strokeLinecap="round">
            <path d="M 220,1360 L 248,1388 L 290,1336" fill="none" />
            <path d="M 790,1360 L 818,1388 L 860,1336" fill="none" />
          </g>
        </g>

        {/* ── CRACKLE label ── */}
        <text x={540} y={1440}
          textAnchor="middle"
          fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={500}
          fill={C.silver} letterSpacing="0.2em"
          opacity={crackleOp * (1 - sigRestored * 0.5) * 0.7}>
          ~ ONE CRACKLE ~
        </text>

        <CornerBrackets opacity={enter * 0.3} />
      </svg>

      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }} opacity={captionOp}>
        <CaptionBar
          text="Then one crackle came through the headset. Signal restored. Burn successful."
          highlight={['crackle', 'Signal', 'restored', 'Burn', 'successful']}
        />
      </svg>
    </AbsoluteFill>
  );
};
