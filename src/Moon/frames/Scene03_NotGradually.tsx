/**
 * Scene 03 — Not Gradually
 * "not gradually, not fading out. One second, the signal is strong and clear."
 * Duration: 262 frames (~8.7s) — audio 5.800s → 14.540s
 *
 * Visual: Signal strength comparison — LEFT: 5 full bars (strong, steel blue)
 * vs RIGHT: 5 empty bars (instant cut, rose coral). INSTANT dividing line.
 * Oscilloscope waveform animates from active → flat.
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { C, fadeIn, easeSnap, clamp } from '../helpers/timing';
import { StarField, CornerBrackets, CaptionBar } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// Waveform points for "active" signal
const WAVE_PTS = Array.from({ length: 60 }, (_, i) => ({
  x: 80 + i * 8,
  amp: 40 + Math.sin(i * 0.9) * 28 + Math.sin(i * 2.1) * 14,
}));

export const Scene03_NotGradually: React.FC = () => {
  const frame = useCurrentFrame();

  const enter      = fadeIn(frame, 0, 18);
  const captionOp  = fadeIn(frame, 10, 20);
  const barEnter   = interpolate(frame, [8, 32], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const lineEnter  = interpolate(frame, [16, 36], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const labelEnter = interpolate(frame, [22, 42], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const xEnter     = interpolate(frame, [28, 48], [0, 1], { extrapolateRight: 'clamp', easing: ease });

  // Waveform: active on left half, flatline on right half
  const waveProgress = clamp((frame - 80) / 60);
  const flatlineY    = 640;

  const BAR_HEIGHTS = [80, 130, 185, 240, 300];
  const barBaseY    = 780;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <filter id="blueGlow03" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feFlood floodColor={C.steel_blue} floodOpacity="0.4" result="c" />
            <feComposite in="c" in2="blur" operator="in" result="cb" />
            <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="redGlow03" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feFlood floodColor={C.rose_coral} floodOpacity="0.4" result="c" />
            <feComposite in="c" in2="blur" operator="in" result="cb" />
            <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Stars — subtle background */}
        <StarField opacity={enter * 0.3} />

        {/* Background panels — two halves */}
        <rect x={0} y={0} width={540} height={1920} fill={C.steel_blue} opacity={enter * 0.04} />
        <rect x={540} y={0} width={540} height={1920} fill={C.rose_coral} opacity={enter * 0.04} />

        {/* Oscilloscope grid — faint horizontal lines */}
        {[300, 400, 500, 600, 700, 800].map(y => (
          <line key={y} x1={60} y1={y} x2={1020} y2={y}
            stroke={C.slate} strokeWidth={0.5} opacity={enter * 0.25} />
        ))}
        {[200, 340, 480, 620, 760, 900].map(x => (
          <line key={x} x1={x} y1={280} x2={x} y2={820}
            stroke={C.slate} strokeWidth={0.5} opacity={enter * 0.2} />
        ))}

        {/* ───── LEFT: STRONG signal ───── */}
        {/* Oscilloscope waveform — active signal */}
        <g opacity={barEnter}>
          <polyline
            points={WAVE_PTS.map(p => {
              const y = flatlineY + interpolate(waveProgress, [0, 1], [p.amp, 0]) - 160;
              return `${p.x},${y}`;
            }).join(' ')}
            fill="none"
            stroke={C.steel_blue}
            strokeWidth={2.5}
            strokeLinecap="round"
            filter="url(#blueGlow03)"
            opacity={1 - waveProgress * 0.5}
          />
          {/* Signal bars — LEFT side */}
          {BAR_HEIGHTS.map((h, i) => {
            const bx = 110 + i * 58;
            const fillH = h * barEnter;
            return (
              <g key={i}>
                {/* Filled bar */}
                <rect
                  x={bx} y={barBaseY - fillH}
                  width={40} height={fillH}
                  rx={4}
                  fill={C.steel_blue}
                  opacity={0.9}
                  filter="url(#blueGlow03)"
                />
                {/* Outline */}
                <rect
                  x={bx} y={barBaseY - h}
                  width={40} height={h}
                  rx={4}
                  fill="none"
                  stroke={C.powder_blue}
                  strokeWidth={1.5}
                  opacity={0.5}
                />
              </g>
            );
          })}
          {/* "STRONG" label */}
          <text x={240} y={870}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={700}
            fill={C.steel_blue} letterSpacing="0.15em"
            opacity={labelEnter}>
            STRONG
          </text>
          {/* t=0 timestamp */}
          <text x={240} y={310}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500}
            fill={C.powder_blue} letterSpacing="0.2em"
            opacity={labelEnter * 0.8}>
            t = 0s
          </text>
        </g>

        {/* ───── CENTER: Instant divider ───── */}
        <g opacity={lineEnter}>
          <line x1={540} y1={250} x2={540} y2={900}
            stroke={C.warm_pink} strokeWidth={4} strokeLinecap="round" />
          {/* "INSTANT" label */}
          <rect x={430} y={920} width={220} height={56} rx={28}
            fill={C.warm_pink} opacity={0.15} />
          <rect x={430} y={920} width={220} height={56} rx={28}
            fill="none" stroke={C.warm_pink} strokeWidth={2} />
          <text x={540} y={957}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={800}
            fill={C.warm_pink} letterSpacing="0.22em">
            INSTANT
          </text>
          {/* Arrowheads */}
          <polygon points="540,248 531,268 549,268" fill={C.warm_pink} />
          <polygon points="540,902 531,882 549,882" fill={C.warm_pink} />
        </g>

        {/* ───── RIGHT: GONE signal ───── */}
        <g opacity={barEnter}>
          {/* Flatline */}
          <line x1={590} y1={flatlineY - 160} x2={1010} y2={flatlineY - 160}
            stroke={C.rose_coral} strokeWidth={2.5}
            filter="url(#redGlow03)"
            opacity={0.9}
          />
          {/* Empty bars — just outlines */}
          {BAR_HEIGHTS.map((h, i) => {
            const bx = 610 + i * 58;
            return (
              <rect key={i}
                x={bx} y={barBaseY - h}
                width={40} height={h}
                rx={4}
                fill="none"
                stroke={C.rose_coral}
                strokeWidth={2}
                opacity={0.7}
              />
            );
          })}
          {/* "GONE" label */}
          <text x={840} y={870}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={700}
            fill={C.rose_coral} letterSpacing="0.15em"
            opacity={labelEnter}
            filter="url(#redGlow03)">
            GONE
          </text>
          {/* t=1s timestamp */}
          <text x={840} y={310}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500}
            fill={C.rose_coral} letterSpacing="0.2em"
            opacity={labelEnter * 0.8}>
            t = 1s
          </text>
        </g>

        {/* "NOT GRADUALLY" cross-out label */}
        <g opacity={xEnter}>
          <text x={540} y={1100}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={44} fontWeight={700}
            fill={C.slate} letterSpacing="0.06em"
            opacity={0.6}>
            NOT GRADUALLY
          </text>
          {/* Strikethrough */}
          <line x1={230} y1={1085} x2={850} y2={1085}
            stroke={C.rose_coral} strokeWidth={3.5} strokeLinecap="round" opacity={0.8} />
          <text x={540} y={1165}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={44} fontWeight={700}
            fill={C.slate} letterSpacing="0.06em"
            opacity={0.6}>
            NOT FADING OUT
          </text>
          <line x1={230} y1={1150} x2={850} y2={1150}
            stroke={C.rose_coral} strokeWidth={3.5} strokeLinecap="round" opacity={0.8} />
        </g>

        {/* Corner brackets */}
        <CornerBrackets opacity={enter * 0.3} />
      </svg>

      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }} opacity={captionOp}>
        <CaptionBar
          text="not gradually, not fading out. One second, the signal is strong and clear."
          highlight={['gradually', 'strong', 'clear']}
        />
      </svg>
    </AbsoluteFill>
  );
};
