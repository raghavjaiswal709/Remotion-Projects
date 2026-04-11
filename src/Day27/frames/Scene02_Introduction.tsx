/**
 * Scene 02 — Introduction
 * "This is day 27 of learning Agentic AI from first principles."
 * Black background, large "27" watermark, word-by-word reveal, particles, DNA helix.
 * Duration: 142 frames (~4.7s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

const particles = Array.from({ length: 45 }, (_, i) => ({
  id: i,
  x: ((i * 149.371) % 1080),
  y: ((i * 197.413) % 1920),
  r: 1.2 + (i % 5) * 0.6,
  speed: 0.2 + (i % 4) * 0.12,
  phase: (i * 0.9) % (Math.PI * 2),
}));

const helixNodes = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  baseY: 350 + i * 65,
  phase: i * 0.6,
  radius: 100,
}));

const words = 'This is day 27 of learning Agentic AI from first principles.'.split(' ');

export const Scene02_Introduction: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 18], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const bigNumberScale = interpolate(frame, [5, 30], [0.2, 1], { easing: ease, extrapolateRight: 'clamp' });
  const bigNumberOpacity = interpolate(frame, [5, 20], [0, 0.12], { easing: ease, extrapolateRight: 'clamp' });
  const helixRotation = frame * 0.06;
  const progressWidth = interpolate(frame, [0, 142], [0, 900], { easing: Easing.linear, extrapolateRight: 'clamp' });
  const textBlockOpacity = interpolate(frame, [10, 25], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const glowPulse = interpolate(frame, [0, 60, 142], [4, 12, 8], { extrapolateRight: 'clamp' });
  const particleFade = interpolate(frame, [0, 15], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const helixOpacity = interpolate(frame, [8, 28], [0, 0.7], { easing: ease, extrapolateRight: 'clamp' });
  const dayLabelY = interpolate(frame, [10, 28], [20, 0], { easing: ease, extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg_black }}>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920">
        <defs>
          <filter id="cyanGlowS02" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={glowPulse} result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="softGlowS02" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="progressGradS02" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={COLORS.electric_cyan} stopOpacity="0.8" />
            <stop offset="100%" stopColor={COLORS.warm_blue} stopOpacity="0.6" />
          </linearGradient>
          <radialGradient id="bgGlow27" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor={COLORS.warm_blue} stopOpacity="0.06" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width="1080" height="1920" fill="url(#bgGlow27)" opacity={fadeIn} />

        {/* Grid */}
        {Array.from({ length: 10 }, (_, i) => (
          <line key={`vg-${i}`} x1={i * 108 + 54} y1="0" x2={i * 108 + 54} y2="1920"
            stroke={COLORS.electric_cyan} strokeWidth="0.3" opacity={fadeIn * 0.12} />
        ))}

        {/* Huge 27 watermark */}
        <text x="540" y="1050" textAnchor="middle" fontFamily="monospace" fontSize="600" fontWeight="900"
          fill={COLORS.electric_cyan} opacity={bigNumberOpacity}
          transform={`scale(${bigNumberScale})`} style={{ transformOrigin: '540px 900px' }}>
          27
        </text>

        {/* DNA helix */}
        <g opacity={helixOpacity}>
          {helixNodes.map((node) => {
            const leftX = 540 + Math.sin(helixRotation + node.phase) * node.radius;
            const rightX = 540 - Math.sin(helixRotation + node.phase) * node.radius;
            const depth = Math.cos(helixRotation + node.phase);
            const leftR = 5 + depth * 3;
            const rightR = 5 - depth * 3;
            return (
              <g key={`helix-${node.id}`}>
                <line x1={leftX} y1={node.baseY} x2={rightX} y2={node.baseY}
                  stroke={COLORS.electric_cyan} strokeWidth="1" opacity={0.3} />
                <circle cx={leftX} cy={node.baseY} r={Math.max(2, leftR)}
                  fill={depth > 0 ? COLORS.electric_cyan : COLORS.warm_blue} opacity={0.6 + depth * 0.3} />
                <circle cx={rightX} cy={node.baseY} r={Math.max(2, rightR)}
                  fill={depth < 0 ? COLORS.electric_cyan : COLORS.warm_blue} opacity={0.6 - depth * 0.3} />
                {node.id < helixNodes.length - 1 && (
                  <>
                    <line x1={leftX} y1={node.baseY}
                      x2={540 + Math.sin(helixRotation + helixNodes[node.id + 1].phase) * node.radius}
                      y2={helixNodes[node.id + 1].baseY}
                      stroke={COLORS.electric_cyan} strokeWidth="0.8" opacity={0.2} />
                    <line x1={rightX} y1={node.baseY}
                      x2={540 - Math.sin(helixRotation + helixNodes[node.id + 1].phase) * node.radius}
                      y2={helixNodes[node.id + 1].baseY}
                      stroke={COLORS.warm_blue} strokeWidth="0.8" opacity={0.2} />
                  </>
                )}
              </g>
            );
          })}
        </g>

        {/* Particles */}
        {particles.map((p) => {
          const px = p.x + Math.sin(frame * 0.03 + p.phase) * 18;
          const py = (p.y - frame * p.speed * 2 + 1920) % 1920;
          return (
            <circle key={`p-${p.id}`} cx={px} cy={py} r={p.r}
              fill={p.id % 4 === 0 ? COLORS.warm_blue : COLORS.electric_cyan}
              opacity={particleFade * (0.2 + (p.id % 3) * 0.1)} />
          );
        })}

        {/* DAY 27 label */}
        <text x="540" y={280 + dayLabelY} textAnchor="middle" fontFamily="monospace" fontSize="42" fontWeight="700"
          fill={COLORS.electric_cyan} opacity={textBlockOpacity} letterSpacing="8" filter="url(#cyanGlowS02)">
          DAY 27
        </text>

        {/* Word-by-word reveal */}
        <g>
          {words.map((word, i) => {
            const wordStart = 18 + i * 8;
            const wordOpacity = interpolate(frame, [wordStart, wordStart + 10], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            const wordY = interpolate(frame, [wordStart, wordStart + 10], [10, 0],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

            const line1 = words.slice(0, 6);
            const line2 = words.slice(6);
            const isLine1 = i < 6;
            const lineWords = isLine1 ? line1 : line2;
            const idx = isLine1 ? i : i - 6;
            const lineText = lineWords.slice(0, idx).join(' ');
            const baseX = 140;
            const charWidth = 22;
            const xPos = baseX + lineText.length * charWidth + (idx > 0 ? charWidth : 0);
            const yPos = isLine1 ? 920 : 970;

            return (
              <text key={`w-${i}`} x={xPos} y={yPos + wordY} fontFamily="monospace" fontSize="36" fontWeight="500"
                fill={word === '27' ? COLORS.electric_cyan : COLORS.soft_white} opacity={wordOpacity}>
                {word}
              </text>
            );
          })}
        </g>

        {/* Text bracket */}
        <rect x="100" y="880" width="880" height="130" rx="8" fill="none"
          stroke={COLORS.electric_cyan} strokeWidth="1" opacity={textBlockOpacity * 0.2} strokeDasharray="8,6" />

        {/* Floating squares */}
        {Array.from({ length: 8 }, (_, i) => {
          const sqOp = interpolate(frame, [15 + i * 5, 30 + i * 5], [0, 0.3],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const sqX = 100 + ((i * 137) % 880);
          const sqY = 1100 + ((i * 97) % 300);
          const sqSize = 8 + (i % 3) * 4;
          const sqRot = frame * (0.5 + i * 0.2);
          return (
            <rect key={`sq-${i}`} x={sqX - sqSize / 2} y={sqY - sqSize / 2}
              width={sqSize} height={sqSize} fill="none" stroke={COLORS.electric_cyan}
              strokeWidth="1" opacity={sqOp} transform={`rotate(${sqRot}, ${sqX}, ${sqY})`} />
          );
        })}

        {/* Progress bar */}
        <g>
          <rect x="90" y="1760" width="900" height="4" rx="2" fill={COLORS.cool_silver} opacity={fadeIn * 0.2} />
          <rect x="90" y="1760" width={progressWidth} height="4" rx="2" fill="url(#progressGradS02)" opacity={fadeIn * 0.8} />
          <circle cx={90 + progressWidth} cy="1762" r="8" fill={COLORS.electric_cyan} opacity={fadeIn} filter="url(#softGlowS02)" />
          <text x="90" y="1800" fontFamily="monospace" fontSize="58" fill={COLORS.cool_silver} opacity={fadeIn * 0.5}>00:00</text>
          <text x="920" y="1800" fontFamily="monospace" fontSize="58" fill={COLORS.cool_silver} opacity={fadeIn * 0.5} textAnchor="end">FIRST PRINCIPLES</text>
        </g>

        {/* Corner marks */}
        {[
          { x: 40, y: 40, sx: 1, sy: 1 },
          { x: 1040, y: 40, sx: -1, sy: 1 },
          { x: 40, y: 1880, sx: 1, sy: -1 },
          { x: 1040, y: 1880, sx: -1, sy: -1 },
        ].map((c, i) => (
          <g key={`cm-${i}`} transform={`translate(${c.x},${c.y}) scale(${c.sx},${c.sy})`} opacity={fadeIn * 0.4}>
            <line x1="0" y1="0" x2="30" y2="0" stroke={COLORS.cool_silver} strokeWidth="1.5" />
            <line x1="0" y1="0" x2="0" y2="30" stroke={COLORS.cool_silver} strokeWidth="1.5" />
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};
