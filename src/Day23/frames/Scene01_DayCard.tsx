/**
 * Scene 01 — Day Card
 * Ultra-premium title card. Dark background, animated particles, "DAY 23" with
 * electric-cyan glow, multi-layer typography, scan-line sweep.
 * Duration: 81 frames (2.7s) — pre-audio title card
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, scaleAnim } from '../helpers/timing';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// Particle seeds
const PARTICLES = Array.from({ length: 44 }, (_, i) => ({
  x: (i * 137.508) % 1080,
  y: (i * 193.731) % 1920,
  r: 1.5 + (i % 4) * 1.2,
  speed: 0.3 + (i % 5) * 0.18,
  phase: i * 0.42,
}));

// Circuit node positions
const NODES = [
  [120, 400], [960, 350], [200, 1500], [880, 1550],
  [540, 200], [100, 960], [980, 960], [540, 1720],
] as [number, number][];

export const Scene01_DayCard: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 40], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const scanX = interpolate(frame, [20, 75], [-80, 1160], { extrapolateRight: 'clamp' });
  const tagSlide = interpolate(frame, [18, 50], [-300, 0], { extrapolateRight: 'clamp', easing: ease });
  const seriesSlide = interpolate(frame, [28, 58], [80, 0], { extrapolateRight: 'clamp', easing: ease });

  return (
    <AbsoluteFill>
      {/* ── Deep black background with radial vignette ── */}
      <div style={{
        width: 1080, height: 1920,
        background: 'radial-gradient(ellipse 80% 60% at 50% 42%, #12182E 0%, #0A0E1C 40%, #060810 100%)',
        overflow: 'hidden', position: 'relative',
      }}>

        {/* ── SVG layer: grid, particles, circuit lines, glow ring ── */}
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <defs>
            <filter id="glowFxD01">
              <feGaussianBlur stdDeviation="14" result="b"/>
              <feFlood floodColor="#00E5FF" floodOpacity="0.55" result="c"/>
              <feComposite in="c" in2="b" operator="in" result="gc"/>
              <feMerge><feMergeNode in="gc"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="glowSoftD01">
              <feGaussianBlur stdDeviation="6" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="shadowD01">
              <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000" floodOpacity="0.4"/>
            </filter>
            <radialGradient id="ringGradD01" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.35"/>
              <stop offset="100%" stopColor="#00E5FF" stopOpacity="0"/>
            </radialGradient>
            <linearGradient id="scanLineD01" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="transparent"/>
              <stop offset="30%" stopColor="#00E5FF" stopOpacity="0.6"/>
              <stop offset="50%" stopColor="#80F0FF" stopOpacity="0.9"/>
              <stop offset="70%" stopColor="#00E5FF" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="transparent"/>
            </linearGradient>
          </defs>

          {/* Faint grid */}
          {Array.from({ length: 14 }, (_, i) => (
            <line key={`v${i}`}
              x1={80 + i * 68} y1={0} x2={80 + i * 68} y2={1920}
              stroke="#00E5FF" strokeWidth={0.5} opacity={enter * 0.06}/>
          ))}
          {Array.from({ length: 32 }, (_, i) => (
            <line key={`h${i}`}
              x1={0} y1={60 + i * 60} x2={1080} y2={60 + i * 60}
              stroke="#00E5FF" strokeWidth={0.5} opacity={enter * 0.05}/>
          ))}

          {/* Particles */}
          {PARTICLES.map((p, i) => {
            const yOff = ((frame * p.speed + p.phase * 60) % 1920) - p.y;
            return (
              <circle key={i} cx={p.x} cy={(p.y + yOff + 1920) % 1920} r={p.r}
                fill="#00E5FF" opacity={enter * (0.2 + Math.sin(frame * 0.04 + p.phase) * 0.1)}/>
            );
          })}

          {/* Circuit connector lines between nodes */}
          {NODES.map(([nx, ny], i) => {
            const [nx2, ny2] = NODES[(i + 3) % NODES.length];
            const lineLen = Math.sqrt((nx2-nx)**2 + (ny2-ny)**2);
            const lineEnter = interpolate(frame, [5 + i*4, 35 + i*4], [lineLen, 0], { extrapolateRight: 'clamp' });
            return (
              <line key={i} x1={nx} y1={ny} x2={nx2} y2={ny2}
                stroke="#3B82F6" strokeWidth={1.2}
                strokeDasharray={`${lineLen}`} strokeDashoffset={lineEnter}
                opacity={0.22}/>
            );
          })}
          {/* Circuit nodes */}
          {NODES.map(([nx, ny], i) => {
            const nEnter = interpolate(frame, [10 + i*3, 30 + i*3], [0, 1], { extrapolateRight: 'clamp' });
            return (
              <g key={i} opacity={nEnter}>
                <circle cx={nx} cy={ny} r={8} fill="#00E5FF" opacity={0.15} filter="url(#glowFxD01)"/>
                <circle cx={nx} cy={ny} r={4} fill="#00E5FF" opacity={0.5}/>
              </g>
            );
          })}

          {/* Large ambient glow behind title */}
          <ellipse cx={540} cy={940} rx={500} ry={300}
            fill="url(#ringGradD01)" opacity={enter * 0.8}/>

          {/* Large outer ring */}
          <circle cx={540} cy={940} r={440}
            fill="none" stroke="#00E5FF" strokeWidth={2}
            opacity={enter * 0.12}/>
          <circle cx={540} cy={940} r={390}
            fill="none" stroke="#00E5FF" strokeWidth={1}
            opacity={enter * 0.06}
            strokeDasharray="30 20"/>

          {/* Scan line sweep */}
          <rect x={scanX - 80} y={0} width={160} height={1920}
            fill="url(#scanLineD01)" opacity={enter * 0.6}/>

          {/* Corner bracket: top-left */}
          <path d="M 60,60 L 60,170 M 60,60 L 170,60"
            fill="none" stroke="#C8D0D4" strokeWidth={3.5} strokeLinecap="round"
            opacity={enter * 0.5}/>
          {/* Corner bracket: top-right */}
          <path d="M 1020,60 L 1020,170 M 1020,60 L 910,60"
            fill="none" stroke="#C8D0D4" strokeWidth={3.5} strokeLinecap="round"
            opacity={enter * 0.5}/>
          {/* Corner bracket: bottom-left */}
          <path d="M 60,1860 L 60,1750 M 60,1860 L 170,1860"
            fill="none" stroke="#C8D0D4" strokeWidth={3.5} strokeLinecap="round"
            opacity={enter * 0.5}/>
          {/* Corner bracket: bottom-right */}
          <path d="M 1020,1860 L 1020,1750 M 1020,1860 L 910,1860"
            fill="none" stroke="#C8D0D4" strokeWidth={3.5} strokeLinecap="round"
            opacity={enter * 0.5}/>

          {/* Thin horizontal accent lines */}
          <line x1={80} y1={740} x2={1000} y2={740}
            stroke="#00E5FF" strokeWidth={1.5} opacity={enter * 0.18}/>
          <line x1={80} y1={1140} x2={1000} y2={1140}
            stroke="#00E5FF" strokeWidth={1.5} opacity={enter * 0.18}/>

          {/* Floating label: top */}
          <text x={540} y={710} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={26} fontWeight={500}
            fill="#C8D0D4" letterSpacing="0.18em" opacity={enter * 0.55}>
            AGENTIC AI · FIRST PRINCIPLES
          </text>
        </svg>

        {/* ── DOM text layer ── */}

        {/* "DAY" label */}
        <div style={{
          position: 'absolute', top: 740, left: 0, right: 0,
          display: 'flex', justifyContent: 'center',
          transform: `translateX(${tagSlide}px)`,
          opacity: enter,
        }}>
          <span style={{
            fontSize: 80, fontWeight: 900, letterSpacing: '0.35em',
            color: COLORS.cool_silver,
            fontFamily: '"Inter", sans-serif',
            textTransform: 'uppercase',
            textShadow: '0 2px 12px rgba(0,0,0,0.6)',
          }}>
            DAY
          </span>
        </div>

        {/* "23" — hero number */}
        <div style={{
          position: 'absolute', top: 800, left: 0, right: 0,
          display: 'flex', justifyContent: 'center',
          opacity: enter,
          transform: `scale(${scaleAnim(frame, 10, 35, 0.82, 1)})`,
        }}>
          <span style={{
            fontSize: 380,
            fontWeight: 900,
            color: COLORS.electric_cyan,
            fontFamily: '"Inter", "SF Pro Display", sans-serif',
            lineHeight: 0.88,
            letterSpacing: '-0.06em',
            filter: `drop-shadow(0 0 60px rgba(0,229,255,0.65)) drop-shadow(0 0 120px rgba(0,229,255,0.3))`,
          }}>
            23
          </span>
        </div>

        {/* Series title below number */}
        <div style={{
          position: 'absolute', top: 1142, left: 0, right: 0,
          display: 'flex', justifyContent: 'center',
          opacity: enter,
          transform: `translateX(${seriesSlide}px)`,
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 40, fontWeight: 700, letterSpacing: '0.08em',
              color: COLORS.warm_blue,
              fontFamily: '"Inter", sans-serif',
            }}>
              AGENTIC AI
            </div>
            <div style={{
              fontSize: 28, fontWeight: 400, letterSpacing: '0.14em',
              color: COLORS.cool_silver,
              marginTop: 8,
              fontFamily: '"Inter", sans-serif',
              opacity: 0.7,
            }}>
              FROM FIRST PRINCIPLES
            </div>
          </div>
        </div>

        {/* Bottom tagline */}
        <div style={{
          position: 'absolute', top: 1640, left: 0, right: 0,
          display: 'flex', justifyContent: 'center',
          opacity: interpolate(frame, [40, 70], [0, 1], { extrapolateRight: 'clamp' }),
        }}>
          <div style={{
            borderTop: `2px solid rgba(0,229,255,0.4)`,
            paddingTop: 18,
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: 34, fontWeight: 800, letterSpacing: '0.12em',
              color: COLORS.electric_cyan,
              fontFamily: '"Inter", sans-serif',
              textTransform: 'uppercase',
            }}>
              MODEL vs AGENT
            </div>
            <div style={{
              fontSize: 24, fontWeight: 400, color: COLORS.cool_silver,
              marginTop: 6, opacity: 0.6,
            }}>
              The loop that changes everything
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
