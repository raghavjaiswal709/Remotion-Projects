/**
 * Shared SVG components for Day 23 — Premium Pencil Art AI Style
 * Ultra-detailed AI robot, rich paper background, premium captions, glow filters.
 */

import React from 'react';
import { COLORS } from './timing';

// ────────────────────────────────────────────────────────────────────────────
// SVG DEFS — global filters, gradients, patterns (render once at top of scene)
// ────────────────────────────────────────────────────────────────────────────
export const GlobalDefs: React.FC = () => (
  <defs>
    {/* Paper grain */}
    <filter id="paperGrain" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" result="noise"/>
      <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise"/>
      <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="blended"/>
      <feComponentTransfer in="blended"><feFuncA type="linear" slope="0.05"/></feComponentTransfer>
      <feComposite in="SourceGraphic" in2="blended" operator="over"/>
    </filter>
    {/* Cyan glow */}
    <filter id="cyanGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="12" result="blur"/>
      <feFlood floodColor="#00E5FF" floodOpacity="0.6" result="color"/>
      <feComposite in="color" in2="blur" operator="in" result="colorBlur"/>
      <feMerge><feMergeNode in="colorBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    {/* Soft glow */}
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    {/* Deep shadow */}
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#0D0D0D" floodOpacity="0.25"/>
    </filter>
    {/* Inner glow cyan */}
    <filter id="innerCyan" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feFlood floodColor="#00E5FF" floodOpacity="0.4" result="color"/>
      <feComposite in="color" in2="blur" operator="in" result="glow"/>
      <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    {/* Red glow */}
    <filter id="redGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="10" result="blur"/>
      <feFlood floodColor="#EF4444" floodOpacity="0.5" result="color"/>
      <feComposite in="color" in2="blur" operator="in" result="colorBlur"/>
      <feMerge><feMergeNode in="colorBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>

    {/* Robot body gradient */}
    <linearGradient id="robotBodyGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#4A90D4"/>
      <stop offset="40%" stopColor="#3B82F6"/>
      <stop offset="100%" stopColor="#1E40AF"/>
    </linearGradient>
    {/* Robot head gradient */}
    <linearGradient id="robotHeadGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#D8DDE0"/>
      <stop offset="50%" stopColor="#C8D0D4"/>
      <stop offset="100%" stopColor="#A8B0B4"/>
    </linearGradient>
    {/* Eye gradient */}
    <radialGradient id="eyeGrad" cx="30%" cy="30%" r="70%">
      <stop offset="0%" stopColor="#80F0FF"/>
      <stop offset="50%" stopColor="#00E5FF"/>
      <stop offset="100%" stopColor="#00AACC"/>
    </radialGradient>
    {/* Core ring gradient */}
    <radialGradient id="coreGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.9"/>
      <stop offset="60%" stopColor="#00AACC" stopOpacity="0.4"/>
      <stop offset="100%" stopColor="#00E5FF" stopOpacity="0"/>
    </radialGradient>
    {/* Panel gradient */}
    <linearGradient id="panelGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#1A2840"/>
      <stop offset="100%" stopColor="#0D1A2E"/>
    </linearGradient>
    {/* Paper gradient overlay */}
    <linearGradient id="paperGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#F8F4EC"/>
      <stop offset="50%" stopColor="#F5F0E8"/>
      <stop offset="100%" stopColor="#EDE8DE"/>
    </linearGradient>
    {/* Warm blue gradient */}
    <linearGradient id="warmBlueGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#60A5FA"/>
      <stop offset="100%" stopColor="#2563EB"/>
    </linearGradient>
    {/* Silver gradient */}
    <linearGradient id="silverGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#E2E8EA"/>
      <stop offset="50%" stopColor="#C8D0D4"/>
      <stop offset="100%" stopColor="#A0A8AC"/>
    </linearGradient>
    {/* Processor gradient */}
    <linearGradient id="processorGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#D0D8DC"/>
      <stop offset="50%" stopColor="#B8C2C8"/>
      <stop offset="100%" stopColor="#909CA0"/>
    </linearGradient>
    {/* Circuit pattern */}
    <pattern id="circuitPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
      <rect width="80" height="80" fill="none"/>
      <line x1="0" y1="40" x2="30" y2="40" stroke="#00E5FF" strokeWidth="0.8" opacity="0.15"/>
      <line x1="30" y1="40" x2="30" y2="10" stroke="#00E5FF" strokeWidth="0.8" opacity="0.15"/>
      <line x1="30" y1="10" x2="70" y2="10" stroke="#00E5FF" strokeWidth="0.8" opacity="0.15"/>
      <line x1="50" y1="40" x2="80" y2="40" stroke="#00E5FF" strokeWidth="0.8" opacity="0.15"/>
      <line x1="50" y1="40" x2="50" y2="70" stroke="#00E5FF" strokeWidth="0.8" opacity="0.15"/>
      <line x1="10" y1="70" x2="50" y2="70" stroke="#00E5FF" strokeWidth="0.8" opacity="0.15"/>
      <circle cx="30" cy="40" r="3" fill="#00E5FF" opacity="0.2"/>
      <circle cx="50" cy="40" r="3" fill="#00E5FF" opacity="0.2"/>
      <circle cx="30" cy="10" r="2" fill="#00E5FF" opacity="0.15"/>
      <circle cx="50" cy="70" r="2" fill="#00E5FF" opacity="0.15"/>
    </pattern>
    {/* Dot grid pattern */}
    <pattern id="dotGrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="20" cy="20" r="1.5" fill="#0D0D0D" opacity="0.08"/>
    </pattern>
  </defs>
);

// ────────────────────────────────────────────────────────────────────────────
// PAPER BACKGROUND — premium off-white with gradient, grain, dot grid
// ────────────────────────────────────────────────────────────────────────────
export const PaperBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div style={{
    width: 1080, height: 1920,
    background: 'linear-gradient(160deg, #F8F4EC 0%, #F5F0E8 50%, #EDE8DE 100%)',
    overflow: 'hidden',
    position: 'relative',
    fontFamily: '"Inter", "SF Pro Display", sans-serif',
  }}>
    {/* Dot grid overlay */}
    <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} width={1080} height={1920}>
      <GlobalDefs/>
      <rect width={1080} height={1920} fill="url(#dotGrid)"/>
    </svg>
    <div style={{ position: 'relative', zIndex: 2, width: '100%', height: '100%' }}>
      {children}
    </div>
  </div>
);

// ────────────────────────────────────────────────────────────────────────────
// BLACK BACKGROUND — deep black with subtle vignette
// ────────────────────────────────────────────────────────────────────────────
export const BlackBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div style={{
    width: 1080, height: 1920,
    background: 'radial-gradient(ellipse at 50% 40%, #1A1A2E 0%, #0D0D0D 70%)',
    overflow: 'hidden',
    position: 'relative',
    fontFamily: '"Inter", "SF Pro Display", sans-serif',
  }}>
    <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} width={1080} height={1920}>
      <defs>
        <radialGradient id="vignetteGrad" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="transparent"/>
          <stop offset="100%" stopColor="#000000" stopOpacity="0.6"/>
        </radialGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#vignetteGrad)"/>
    </svg>
    <div style={{ position: 'relative', zIndex: 2, width: '100%', height: '100%' }}>
      {children}
    </div>
  </div>
);

// ────────────────────────────────────────────────────────────────────────────
// ULTRA-DETAILED AI ROBOT SVG
// cx, cy = center of robot (head top, not body)
// totalHeight = full robot height including head and legs
// ────────────────────────────────────────────────────────────────────────────
interface RobotProps {
  cx?: number;        // horizontal center
  cy?: number;        // vertical start of head
  scale?: number;
  opacity?: number;
  coreGlow?: number;  // 0-1 glow intensity
  eyeColor?: string;
  frame?: number;     // for animated elements
  variant?: 'active' | 'dormant' | 'frozen';
}

export const AIRobot: React.FC<RobotProps> = ({
  cx = 540, cy = 420,
  scale = 1, opacity = 1,
  coreGlow = 0.6,
  eyeColor = COLORS.electric_cyan,
  frame = 0,
  variant = 'active',
}) => {
  const eyeOpacity = variant === 'frozen' ? 0.25 : variant === 'dormant' ? 0.4 : 0.95;
  const coreOpacity = variant === 'frozen' ? 0.1 : variant === 'dormant' ? 0.25 : coreGlow;
  const eyePulse = variant === 'active' ? 0.85 + Math.sin(frame * 0.08) * 0.15 : eyeOpacity;

  // Antenna blink
  const antennaBlink = variant === 'active'
    ? (frame % 60 < 6 ? 1.0 : 0.4)
    : 0.2;

  const totalH = 860; // full robot height
  // Layout computed from cy (head top)
  const headTop    = cy;
  const headH      = 160;
  const neckTop    = headTop + headH;
  const neckH      = 30;
  const bodyTop    = neckTop + neckH;
  const bodyH      = 430;
  const legTop     = bodyTop + bodyH;
  const legH       = 140;
  const bodyLeft   = cx - 190;
  const bodyW      = 380;
  const headLeft   = cx - 165;
  const headW      = 330;

  return (
    <g transform={`translate(${cx},${cy + totalH/2}) scale(${scale}) translate(${-cx},${-(cy + totalH/2)})`}
      opacity={opacity} filter="url(#shadow)">

      {/* ── Antenna ───────────────────────────────────────────────────── */}
      <line x1={cx - 30} y1={headTop - 60} x2={cx - 50} y2={headTop - 120}
        stroke={COLORS.cool_silver} strokeWidth={5} strokeLinecap="round"/>
      <circle cx={cx - 50} cy={headTop - 128} r={10}
        fill={eyeColor} opacity={antennaBlink} filter="url(#cyanGlow)"/>
      <line x1={cx + 30} y1={headTop - 50} x2={cx + 60} y2={headTop - 100}
        stroke={COLORS.cool_silver} strokeWidth={4} strokeLinecap="round"/>
      <circle cx={cx + 60} cy={headTop - 108} r={7}
        fill={variant === 'active' ? COLORS.vibrant_green : COLORS.cool_silver}
        opacity={antennaBlink * 0.7}/>

      {/* ── Head ──────────────────────────────────────────────────────── */}
      {/* Head shadow */}
      <rect x={headLeft + 4} y={headTop + 6} width={headW} height={headH} rx={28}
        fill="#0D0D0D" opacity={0.18}/>
      {/* Head main */}
      <rect x={headLeft} y={headTop} width={headW} height={headH} rx={28}
        fill="url(#robotHeadGrad)" stroke={COLORS.deep_black} strokeWidth={4}/>
      {/* Head inset panel */}
      <rect x={headLeft + 14} y={headTop + 14} width={headW - 28} height={headH - 28} rx={18}
        fill="none" stroke={COLORS.deep_black} strokeWidth={1.5} strokeDasharray="6 4" opacity={0.4}/>
      {/* Forehead ridge */}
      <rect x={headLeft + 40} y={headTop + 10} width={headW - 80} height={12} rx={6}
        fill="url(#silverGrad)" stroke={COLORS.deep_black} strokeWidth={2}/>

      {/* ── Eyes ──────────────────────────────────────────────────────── */}
      {/* Left eye socket */}
      <rect x={headLeft + 34} y={headTop + 52} width={96} height={60} rx={12}
        fill="#1A1A2E" stroke={COLORS.deep_black} strokeWidth={3}/>
      {/* Left eye glow fill */}
      <rect x={headLeft + 38} y={headTop + 56} width={88} height={52} rx={9}
        fill={eyeColor} opacity={eyePulse} filter="url(#cyanGlow)"/>
      {/* Left eye iris */}
      <ellipse cx={headLeft + 82} cy={headTop + 82} rx={18} ry={18}
        fill="#0D1020" opacity={0.8}/>
      <circle cx={headLeft + 82} cy={headTop + 82} r={10}
        fill={eyeColor} opacity={eyePulse}/>
      <circle cx={headLeft + 86} cy={headTop + 78} r={4}
        fill="white" opacity={0.5}/>
      {/* Left eye scanline */}
      <line x1={headLeft + 38} y1={headTop + 75} x2={headLeft + 126} y2={headTop + 75}
        stroke="white" strokeWidth={1} opacity={0.15}/>
      <line x1={headLeft + 38} y1={headTop + 85} x2={headLeft + 126} y2={headTop + 85}
        stroke="white" strokeWidth={1} opacity={0.15}/>

      {/* Right eye socket */}
      <rect x={headLeft + headW - 130} y={headTop + 52} width={96} height={60} rx={12}
        fill="#1A1A2E" stroke={COLORS.deep_black} strokeWidth={3}/>
      {/* Right eye glow fill */}
      <rect x={headLeft + headW - 126} y={headTop + 56} width={88} height={52} rx={9}
        fill={eyeColor} opacity={eyePulse} filter="url(#cyanGlow)"/>
      {/* Right eye iris */}
      <ellipse cx={headLeft + headW - 82} cy={headTop + 82} rx={18} ry={18}
        fill="#0D1020" opacity={0.8}/>
      <circle cx={headLeft + headW - 82} cy={headTop + 82} r={10}
        fill={eyeColor} opacity={eyePulse}/>
      <circle cx={headLeft + headW - 78} cy={headTop + 78} r={4}
        fill="white" opacity={0.5}/>
      {/* Right eye scanline */}
      <line x1={headLeft + headW - 126} y1={headTop + 75} x2={headLeft + headW - 38} y2={headTop + 75}
        stroke="white" strokeWidth={1} opacity={0.15}/>
      <line x1={headLeft + headW - 126} y1={headTop + 85} x2={headLeft + headW - 38} y2={headTop + 85}
        stroke="white" strokeWidth={1} opacity={0.15}/>

      {/* Mouth / speaker grille */}
      {[0, 1, 2, 3, 4].map(i => (
        <line key={i}
          x1={cx - 50} y1={headTop + 132 + i * 5}
          x2={cx + 50} y2={headTop + 132 + i * 5}
          stroke={COLORS.deep_black} strokeWidth={2} strokeLinecap="round"
          opacity={variant === 'frozen' ? 0.15 : 0.35}/>
      ))}
      {/* Mouth glow line */}
      <line x1={cx - 48} y1={headTop + 136} x2={cx + 48} y2={headTop + 136}
        stroke={eyeColor} strokeWidth={1.5} opacity={coreOpacity * 0.5}/>

      {/* ── Neck ──────────────────────────────────────────────────────── */}
      <rect x={cx - 40} y={neckTop} width={80} height={neckH} rx={8}
        fill="url(#silverGrad)" stroke={COLORS.deep_black} strokeWidth={3}/>
      {/* Neck bolts */}
      <circle cx={cx - 25} cy={neckTop + 15} r={5} fill={COLORS.deep_black} opacity={0.4}/>
      <circle cx={cx + 25} cy={neckTop + 15} r={5} fill={COLORS.deep_black} opacity={0.4}/>
      {/* Neck indicator light */}
      <circle cx={cx} cy={neckTop + 15} r={4}
        fill={variant === 'active' ? COLORS.vibrant_green : COLORS.cool_silver}
        opacity={0.8}/>

      {/* ── Shoulders ─────────────────────────────────────────────────── */}
      {/* Left shoulder pad */}
      <path d={`M ${bodyLeft - 10},${bodyTop + 20} Q ${bodyLeft - 50},${bodyTop + 10} ${bodyLeft - 60},${bodyTop + 60} L ${bodyLeft},${bodyTop + 80} Z`}
        fill="url(#silverGrad)" stroke={COLORS.deep_black} strokeWidth={3}/>
      <circle cx={bodyLeft - 35} cy={bodyTop + 38} r={8}
        fill={COLORS.deep_black} opacity={0.35}/>
      {/* Right shoulder pad */}
      <path d={`M ${bodyLeft + bodyW + 10},${bodyTop + 20} Q ${bodyLeft + bodyW + 50},${bodyTop + 10} ${bodyLeft + bodyW + 60},${bodyTop + 60} L ${bodyLeft + bodyW},${bodyTop + 80} Z`}
        fill="url(#silverGrad)" stroke={COLORS.deep_black} strokeWidth={3}/>
      <circle cx={bodyLeft + bodyW + 35} cy={bodyTop + 38} r={8}
        fill={COLORS.deep_black} opacity={0.35}/>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      {/* Body shadow */}
      <rect x={bodyLeft + 5} y={bodyTop + 8} width={bodyW} height={bodyH} rx={32}
        fill="#0D0D0D" opacity={0.22}/>
      {/* Body main */}
      <rect x={bodyLeft} y={bodyTop} width={bodyW} height={bodyH} rx={32}
        fill="url(#robotBodyGrad)" stroke={COLORS.deep_black} strokeWidth={5}/>
      {/* Body inset border */}
      <rect x={bodyLeft + 16} y={bodyTop + 16} width={bodyW - 32} height={bodyH - 32} rx={22}
        fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={2}/>

      {/* Chest panel (dark) */}
      <rect x={bodyLeft + 36} y={bodyTop + 34} width={bodyW - 72} height={bodyH - 80} rx={18}
        fill="url(#panelGrad)" stroke={COLORS.deep_black} strokeWidth={2.5}/>
      {/* Panel inset grid */}
      <rect x={bodyLeft + 52} y={bodyTop + 50} width={bodyW - 104} height={bodyH - 112} rx={10}
        fill="url(#circuitPattern)"/>

      {/* ── Core Ring ─────────────────────────────────────────────────── */}
      {/* Outer glow ring */}
      <circle cx={cx} cy={bodyTop + 200} r={90}
        fill="none" stroke={eyeColor} strokeWidth={3}
        opacity={coreOpacity * 0.3} filter="url(#cyanGlow)"/>
      {/* Main ring */}
      <circle cx={cx} cy={bodyTop + 200} r={72}
        fill="none" stroke={eyeColor} strokeWidth={6}
        opacity={coreOpacity} filter="url(#cyanGlow)"
        strokeDasharray={variant === 'active' ? 'none' : '20 8'}/>
      {/* Inner ring */}
      <circle cx={cx} cy={bodyTop + 200} r={52}
        fill="none" stroke={eyeColor} strokeWidth={2.5}
        opacity={coreOpacity * 0.5}/>
      {/* Core fill */}
      <circle cx={cx} cy={bodyTop + 200} r={38}
        fill="url(#coreGrad)" opacity={coreOpacity}/>
      {/* Core center dot */}
      <circle cx={cx} cy={bodyTop + 200} r={16}
        fill={eyeColor} opacity={coreOpacity * 0.8}
        filter="url(#cyanGlow)"/>
      {/* Spinning tick marks (active only) */}
      {variant === 'active' && [0,60,120,180,240,300].map((deg, i) => {
        const rad = ((deg + frame * 1.2) * Math.PI) / 180;
        const r1 = 58, r2 = 66;
        return (
          <line key={i}
            x1={cx + Math.cos(rad) * r1} y1={bodyTop + 200 + Math.sin(rad) * r1}
            x2={cx + Math.cos(rad) * r2} y2={bodyTop + 200 + Math.sin(rad) * r2}
            stroke={eyeColor} strokeWidth={3} strokeLinecap="round"
            opacity={0.7}/>
        );
      })}

      {/* ── Status lights (top of chest) ──────────────────────────────── */}
      {[0,1,2,3,4].map(i => {
        const isOn = variant === 'active' ? (i <= 3) : variant === 'dormant' ? (i <= 1) : false;
        const blinkOffset = i * 8;
        const lightOn = isOn && (variant !== 'active' || frame % 40 > blinkOffset);
        return (
          <g key={i}>
            <rect x={bodyLeft + 52 + i * 54} y={bodyTop + 44} width={28} height={12} rx={6}
              fill={lightOn ? COLORS.vibrant_green : '#1A2030'} stroke={COLORS.deep_black} strokeWidth={1.5}/>
            {lightOn && (
              <rect x={bodyLeft + 54 + i * 54} y={bodyTop + 46} width={24} height={8} rx={4}
                fill={COLORS.vibrant_green} opacity={0.8} filter="url(#softGlow)"/>
            )}
          </g>
        );
      })}

      {/* ── Data readout rows (bottom of chest panel) ─────────────────── */}
      {[0,1,2].map(i => (
        <g key={i}>
          <rect x={bodyLeft + 52} y={bodyTop + 330 + i * 36} width={bodyW - 104} height={24} rx={6}
            fill="rgba(0,229,255,0.06)" stroke="rgba(0,229,255,0.2)" strokeWidth={1}/>
          {/* Data bars */}
          {[0,1,2,3,4,5].map(j => (
            <rect key={j}
              x={bodyLeft + 58 + j * 44} y={bodyTop + 335 + i * 36}
              width={36} height={14} rx={3}
              fill={j < (3 - i + (variant === 'active' ? 2 : 0)) ? eyeColor : 'rgba(0,229,255,0.1)'}
              opacity={0.6}/>
          ))}
        </g>
      ))}

      {/* ── Ventilation ribs (sides of body) ──────────────────────────── */}
      {[0,1,2,3,4].map(i => (
        <g key={i}>
          {/* Left vents */}
          <line x1={bodyLeft + 10} y1={bodyTop + 100 + i * 36}
                x2={bodyLeft + 30} y2={bodyTop + 100 + i * 36}
            stroke={COLORS.cool_silver} strokeWidth={4} strokeLinecap="round" opacity={0.5}/>
          {/* Right vents */}
          <line x1={bodyLeft + bodyW - 10} y1={bodyTop + 100 + i * 36}
                x2={bodyLeft + bodyW - 30} y2={bodyTop + 100 + i * 36}
            stroke={COLORS.cool_silver} strokeWidth={4} strokeLinecap="round" opacity={0.5}/>
        </g>
      ))}

      {/* ── Arms ──────────────────────────────────────────────────────── */}
      {/* Left arm */}
      <rect x={bodyLeft - 68} y={bodyTop + 42} width={68} height={240} rx={20}
        fill="url(#robotBodyGrad)" stroke={COLORS.deep_black} strokeWidth={4}/>
      {/* Left arm detail */}
      <rect x={bodyLeft - 58} y={bodyTop + 60} width={48} height={80} rx={10}
        fill="url(#panelGrad)" stroke="rgba(0,229,255,0.3)" strokeWidth={1}/>
      {[0,1,2].map(i => (
        <line key={i}
          x1={bodyLeft - 52} y1={bodyTop + 72 + i * 22}
          x2={bodyLeft - 16} y2={bodyTop + 72 + i * 22}
          stroke={eyeColor} strokeWidth={1.5} opacity={coreOpacity * 0.4}/>
      ))}
      {/* Left hand */}
      <rect x={bodyLeft - 72} y={bodyTop + 272} width={76} height={50} rx={14}
        fill="url(#silverGrad)" stroke={COLORS.deep_black} strokeWidth={3}/>
      {/* Left knuckle joints */}
      {[0,1,2].map(i => (
        <circle key={i} cx={bodyLeft - 60 + i * 22} cy={bodyTop + 310} r={6}
          fill={COLORS.deep_black} opacity={0.35}/>
      ))}
      {/* Left elbow joint */}
      <circle cx={bodyLeft - 34} cy={bodyTop + 180} r={14}
        fill="url(#silverGrad)" stroke={COLORS.deep_black} strokeWidth={3}/>

      {/* Right arm */}
      <rect x={bodyLeft + bodyW} y={bodyTop + 42} width={68} height={240} rx={20}
        fill="url(#robotBodyGrad)" stroke={COLORS.deep_black} strokeWidth={4}/>
      {/* Right arm detail */}
      <rect x={bodyLeft + bodyW + 10} y={bodyTop + 60} width={48} height={80} rx={10}
        fill="url(#panelGrad)" stroke="rgba(0,229,255,0.3)" strokeWidth={1}/>
      {[0,1,2].map(i => (
        <line key={i}
          x1={bodyLeft + bodyW + 16} y1={bodyTop + 72 + i * 22}
          x2={bodyLeft + bodyW + 52} y2={bodyTop + 72 + i * 22}
          stroke={eyeColor} strokeWidth={1.5} opacity={coreOpacity * 0.4}/>
      ))}
      {/* Right hand */}
      <rect x={bodyLeft + bodyW - 4} y={bodyTop + 272} width={76} height={50} rx={14}
        fill="url(#silverGrad)" stroke={COLORS.deep_black} strokeWidth={3}/>
      {/* Right knuckle joints */}
      {[0,1,2].map(i => (
        <circle key={i} cx={bodyLeft + bodyW + 8 + i * 22} cy={bodyTop + 310} r={6}
          fill={COLORS.deep_black} opacity={0.35}/>
      ))}
      {/* Right elbow joint */}
      <circle cx={bodyLeft + bodyW + 34} cy={bodyTop + 180} r={14}
        fill="url(#silverGrad)" stroke={COLORS.deep_black} strokeWidth={3}/>

      {/* ── Legs ──────────────────────────────────────────────────────── */}
      {/* Left leg */}
      <rect x={bodyLeft + 44} y={legTop} width={110} height={legH} rx={20}
        fill="url(#robotBodyGrad)" stroke={COLORS.deep_black} strokeWidth={4}/>
      {/* Left leg vent */}
      <rect x={bodyLeft + 60} y={legTop + 16} width={78} height={50} rx={10}
        fill="url(#panelGrad)" stroke="rgba(0,229,255,0.2)" strokeWidth={1}/>
      {/* Left knee joint */}
      <circle cx={bodyLeft + 99} cy={legTop + 2} r={16}
        fill="url(#silverGrad)" stroke={COLORS.deep_black} strokeWidth={3}/>
      {/* Left foot */}
      <rect x={bodyLeft + 34} y={legTop + legH - 8} width={130} height={46} rx={16}
        fill="url(#silverGrad)" stroke={COLORS.deep_black} strokeWidth={3}/>

      {/* Right leg */}
      <rect x={bodyLeft + bodyW - 154} y={legTop} width={110} height={legH} rx={20}
        fill="url(#robotBodyGrad)" stroke={COLORS.deep_black} strokeWidth={4}/>
      {/* Right leg vent */}
      <rect x={bodyLeft + bodyW - 138} y={legTop + 16} width={78} height={50} rx={10}
        fill="url(#panelGrad)" stroke="rgba(0,229,255,0.2)" strokeWidth={1}/>
      {/* Right knee joint */}
      <circle cx={bodyLeft + bodyW - 99} cy={legTop + 2} r={16}
        fill="url(#silverGrad)" stroke={COLORS.deep_black} strokeWidth={3}/>
      {/* Right foot */}
      <rect x={bodyLeft + bodyW - 164} y={legTop + legH - 8} width={130} height={46} rx={16}
        fill="url(#silverGrad)" stroke={COLORS.deep_black} strokeWidth={3}/>

      {/* ── Body bottom bolt row ───────────────────────────────────────── */}
      {[-120, -60, 0, 60, 120].map((offset, i) => (
        <circle key={i} cx={cx + offset} cy={bodyTop + bodyH - 20} r={6}
          fill={COLORS.deep_black} opacity={0.25}/>
      ))}

      {/* ── Frozen ice overlay (frozen variant) ───────────────────────── */}
      {variant === 'frozen' && (
        <>
          <rect x={bodyLeft - 70} y={headTop} width={bodyW + 140} height={bodyH + legH + headH + 200} rx={20}
            fill="#A8D8EA" opacity={0.08}/>
          {[0,1,2,3,4,5,6,7].map(i => (
            <line key={i}
              x1={bodyLeft - 60 + i * 80} y1={headTop}
              x2={bodyLeft - 100 + i * 80} y2={headTop + 250}
              stroke="#A8D8EA" strokeWidth={1.5} opacity={0.2}/>
          ))}
        </>
      )}
    </g>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// PROCESSOR UNIT — premium CPU/chip visual
// ────────────────────────────────────────────────────────────────────────────
interface ProcessorProps {
  cx?: number; cy?: number;
  size?: number;
  opacity?: number;
  scale?: number;
  variant?: 'active' | 'dormant' | 'frozen';
  label?: string;
  frame?: number;
}
export const ProcessorUnit: React.FC<ProcessorProps> = ({
  cx = 540, cy = 960,
  size = 380,
  opacity = 1, scale = 1,
  variant = 'active',
  label = 'MODEL',
  frame = 0,
}) => {
  const s = size;
  const x = cx - s / 2;
  const y = cy - s / 2;
  const isActive = variant === 'active';
  const gearSpin = isActive ? frame * 1.5 : 0;

  return (
    <g transform={`translate(${cx},${cy}) scale(${scale}) translate(${-cx},${-cy})`}
      opacity={opacity} filter="url(#shadow)">
      {/* Outer housing shadow */}
      <rect x={x + 6} y={y + 8} width={s} height={s} rx={32} fill="#0D0D0D" opacity={0.2}/>
      {/* Outer housing */}
      <rect x={x} y={y} width={s} height={s} rx={32}
        fill="url(#processorGrad)" stroke={COLORS.deep_black} strokeWidth={variant === 'frozen' ? 3 : 5}
        strokeDasharray={variant === 'frozen' ? '16 8' : 'none'}/>
      {/* Inner panel */}
      <rect x={x+20} y={y+20} width={s-40} height={s-40} rx={20}
        fill="url(#panelGrad)" stroke={COLORS.deep_black} strokeWidth={2}/>
      {/* Circuit fill */}
      <rect x={x+24} y={y+24} width={s-48} height={s-48} rx={16}
        fill="url(#circuitPattern)" opacity={isActive ? 0.8 : 0.3}/>

      {/* Gear */}
      <g transform={`rotate(${gearSpin}, ${cx}, ${cy})`}>
        <circle cx={cx} cy={cy} r={s * 0.28}
          fill="none" stroke={COLORS.cool_silver} strokeWidth={6}/>
        <circle cx={cx} cy={cy} r={s * 0.14}
          fill="url(#processorGrad)" stroke={COLORS.cool_silver} strokeWidth={4}/>
        {[0,45,90,135,180,225,270,315].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const r2 = s * 0.36;;
          const x2 = cx + Math.cos(rad) * r2; const y2 = cy + Math.sin(rad) * r2;
          return (
            <rect key={i}
              x={x2 - 10} y={y2 - 10} width={20} height={20} rx={4}
              fill={COLORS.cool_silver}
              transform={`rotate(${deg}, ${x2}, ${y2})`}
              opacity={isActive ? 0.9 : 0.4}/>
          );
        })}
      </g>

      {/* Center core */}
      <circle cx={cx} cy={cy} r={s * 0.1}
        fill={isActive ? COLORS.electric_cyan : COLORS.cool_silver}
        opacity={isActive ? 0.8 : 0.3}
        filter={isActive ? 'url(#cyanGlow)' : undefined}/>

      {/* Corner heat-pipes */}
      {[
        [x+14, y+14], [x+s-14, y+14],
        [x+14, y+s-14], [x+s-14, y+s-14],
      ].map(([px, py], i) => (
        <circle key={i} cx={px} cy={py} r={10}
          fill={isActive ? COLORS.vibrant_green : '#444'} opacity={isActive ? 0.9 : 0.4}
          filter={isActive ? 'url(#softGlow)' : undefined}/>
      ))}

      {/* Status label below */}
      <text x={cx} y={y + s + 52} textAnchor="middle"
        fontFamily="'Inter', sans-serif"
        fontSize={34} fontWeight={900}
        fill={isActive ? COLORS.warm_blue : COLORS.cool_silver}
        letterSpacing="-0.02em">
        {label}
      </text>

      {/* Frozen overlay */}
      {variant === 'frozen' && (
        <rect x={x} y={y} width={s} height={s} rx={32}
          fill="#A8D8EA" opacity={0.1}/>
      )}
    </g>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// WORLD GLOBE — detailed geographic globe
// ────────────────────────────────────────────────────────────────────────────
interface WorldGlobeProps {
  cx?: number; cy?: number; r?: number;
  opacity?: number; scale?: number;
  glowColor?: string;
}
export const WorldGlobe: React.FC<WorldGlobeProps> = ({
  cx = 540, cy = 960, r = 130,
  opacity = 1, scale = 1,
  glowColor = COLORS.electric_cyan,
}) => (
  <g transform={`translate(${cx},${cy}) scale(${scale}) translate(${-cx},${-cy})`}
    opacity={opacity} filter="url(#shadow)">
    {/* Outer glow ring */}
    <circle cx={cx} cy={cy} r={r + 20}
      fill="none" stroke={glowColor} strokeWidth={2}
      opacity={0.2} filter="url(#cyanGlow)"/>
    {/* Housing */}
    <circle cx={cx} cy={cy} r={r}
      fill="url(#panelGrad)" stroke={COLORS.deep_black} strokeWidth={4}/>
    {/* Globe land masses (simplified arcs) */}
    <circle cx={cx} cy={cy} r={r - 10}
      fill="none" stroke={glowColor} strokeWidth={2} opacity={0.15}/>
    {/* Latitude lines */}
    {[-60, -30, 0, 30, 60].map((lat, i) => {
      const ry = Math.cos((lat * Math.PI) / 180) * (r - 12);
      const yOff = Math.sin((lat * Math.PI) / 180) * (r - 12);
      return (
        <ellipse key={i} cx={cx} cy={cy + yOff} rx={ry} ry={ry * 0.18}
          fill="none" stroke={glowColor} strokeWidth={1.5} opacity={0.2}/>
      );
    })}
    {/* Longitude lines */}
    {[0, 60, 120].map((lon, i) => (
      <ellipse key={i} cx={cx} cy={cy} rx={(r-12) * Math.cos((lon * Math.PI)/180)} ry={r-12}
        fill="none" stroke={glowColor} strokeWidth={1.5} opacity={0.2}
        transform={`rotate(${lon}, ${cx}, ${cy})`}/>
    ))}
    {/* Continent patches */}
    <path d={`M ${cx - 30},${cy - 40} Q ${cx + 20},${cy - 60} ${cx + 50},${cy - 20} Q ${cx + 30},${cy + 10} ${cx - 10},${cy} Z`}
      fill={glowColor} opacity={0.12}/>
    <path d={`M ${cx - 70},${cy + 10} Q ${cx - 40},${cy - 10} ${cx - 20},${cy + 30} Q ${cx - 50},${cy + 50} ${cx - 70},${cy + 30} Z`}
      fill={glowColor} opacity={0.1}/>
    {/* Globe shine */}
    <ellipse cx={cx - r * 0.3} cy={cy - r * 0.3} rx={r * 0.25} ry={r * 0.18}
      fill="white" opacity={0.08}/>
    {/* Center dot */}
    <circle cx={cx} cy={cy} r={5}
      fill={glowColor} opacity={0.6}/>
    {/* Label */}
    <text x={cx} y={cy + r + 44} textAnchor="middle"
      fontFamily="'Inter', sans-serif"
      fontSize={28} fontWeight={800}
      fill={COLORS.deep_black} letterSpacing="0.06em">
      WORLD
    </text>
  </g>
);

// ────────────────────────────────────────────────────────────────────────────
// LOOP ARROW — animated electric cyan circular arc with arrowhead
// ────────────────────────────────────────────────────────────────────────────
interface LoopArrowProps {
  cx?: number; cy?: number; r?: number;
  color?: string; strokeWidth?: number;
  dashOffset?: number; opacity?: number;
  showArrow?: boolean;
  label?: string;
  labelOffset?: number;
}
export const LoopArrow: React.FC<LoopArrowProps> = ({
  cx = 540, cy = 960, r = 200,
  color = COLORS.electric_cyan, strokeWidth = 8,
  dashOffset = 0, opacity = 1,
  showArrow = true,
  label,
  labelOffset = 0,
}) => {
  const circ = 2 * Math.PI * r;
  const prog = Math.max(0, 1 - dashOffset / circ);
  return (
    <g opacity={opacity}>
      {/* Outer glow */}
      <circle cx={cx} cy={cy} r={r + 4}
        fill="none" stroke={color} strokeWidth={strokeWidth + 8}
        strokeDasharray={`${circ} ${circ}`} strokeDashoffset={dashOffset}
        strokeLinecap="round" opacity={0.15}
        transform={`rotate(-90 ${cx} ${cy})`} filter="url(#cyanGlow)"/>
      {/* Main arc */}
      <circle cx={cx} cy={cy} r={r}
        fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={`${circ} ${circ}`} strokeDashoffset={dashOffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}/>
      {/* Arrowhead — only when arc is near complete */}
      {showArrow && prog > 0.85 && (
        <polygon
          points={`${cx - 14},${cy - r - 8} ${cx + 14},${cy - r - 8} ${cx},${cy - r + 22}`}
          fill={color}/>
      )}
      {/* Label on arc */}
      {label && (
        <text x={cx + r + labelOffset + 20} y={cy}
          fontFamily="'Caveat', cursive"
          fontSize={28} fill={color} opacity={0.8}>{label}</text>
      )}
    </g>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// CAPTION BAR — premium frosted glass subtitle
// ────────────────────────────────────────────────────────────────────────────
interface CaptionProps {
  text: string;
  opacity?: number;
  y?: number;
  /** Words to highlight in yellow. Case-insensitive, matched by whole word. */
  highlightWords?: string[];
}
export const CaptionBar: React.FC<CaptionProps> = ({
  text, opacity = 1, y = 1740, highlightWords = [],
}) => {
  const words = text.split(' ');
  const hlSet = new Set(highlightWords.map(w => w.toLowerCase()));
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, top: y,
      display: 'flex', justifyContent: 'center',
      padding: '0 80px', opacity, zIndex: 100,
    }}>
      <div style={{
        maxWidth: 920,
        textAlign: 'center',
        lineHeight: 1.55,
      }}>
        {words.map((word, i) => {
          const clean = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
          const isHL = hlSet.has(clean);
          return (
            <span key={i} style={{
              fontSize: 38,
              fontWeight: isHL ? 800 : 600,
              color: isHL ? '#F5A623' : '#0D0D0D',
              fontFamily: '"Inter", sans-serif',
              letterSpacing: '-0.01em',
              ...(isHL ? {
                background: 'rgba(245,166,35,0.15)',
                borderRadius: 6,
                padding: '0 4px',
              } : {}),
            }}>
              {word}{i < words.length - 1 ? ' ' : ''}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// CORNER BRACKETS — decorative frame corners
// ────────────────────────────────────────────────────────────────────────────
interface CornerBracketsProps {
  opacity?: number;
  color?: string;
  size?: number;
}
export const CornerBrackets: React.FC<CornerBracketsProps> = ({
  opacity = 0.4, color = COLORS.light_gray, size = 70,
}) => (
  <>
    <path d={`M 50,50 L 50,${50+size} M 50,50 L ${50+size},50`}
      fill="none" stroke={color} strokeWidth={3} opacity={opacity} strokeLinecap="round"/>
    <path d={`M ${1030},50 L ${1030},${50+size} M ${1030},50 L ${1030-size},50`}
      fill="none" stroke={color} strokeWidth={3} opacity={opacity} strokeLinecap="round"/>
    <path d={`M 50,${1870} L 50,${1870-size} M 50,${1870} L ${50+size},${1870}`}
      fill="none" stroke={color} strokeWidth={3} opacity={opacity} strokeLinecap="round"/>
    <path d={`M ${1030},${1870} L ${1030},${1870-size} M ${1030},${1870} L ${1030-size},${1870}`}
      fill="none" stroke={color} strokeWidth={3} opacity={opacity} strokeLinecap="round"/>
  </>
);

// ────────────────────────────────────────────────────────────────────────────
// SECTION LABEL — bold label with cyan underline
// ────────────────────────────────────────────────────────────────────────────
interface SectionLabelProps {
  x?: number; y?: number;
  text: string;
  fontSize?: number;
  color?: string;
  opacity?: number;
  underlineColor?: string;
}
export const SectionLabel: React.FC<SectionLabelProps> = ({
  x = 540, y = 200,
  text, fontSize = 52,
  color = COLORS.deep_black,
  opacity = 1,
  underlineColor = COLORS.electric_cyan,
}) => {
  const approxWidth = text.length * fontSize * 0.52;
  return (
    <g opacity={opacity}>
      <text x={x} y={y} textAnchor="middle"
        fontFamily="'Inter', sans-serif"
        fontSize={fontSize} fontWeight={900}
        fill={color} letterSpacing="-0.03em">
        {text}
      </text>
      <rect x={x - approxWidth/2} y={y + 10} width={approxWidth} height={6} rx={3}
        fill={underlineColor} opacity={0.7}/>
    </g>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// SLASH MARK
// ────────────────────────────────────────────────────────────────────────────
interface SlashProps {
  x1: number; y1: number; x2: number; y2: number;
  dashOffset?: number; opacity?: number; color?: string; sw?: number;
}
export const SlashMark: React.FC<SlashProps> = ({
  x1, y1, x2, y2, dashOffset = 0, opacity = 1,
  color = COLORS.vibrant_red, sw = 10,
}) => {
  const len = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
  return (
    <g opacity={opacity}>
      <line x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color} strokeWidth={sw + 8} strokeLinecap="round"
        strokeDasharray={`${len} ${len}`} strokeDashoffset={dashOffset}
        opacity={0.15} filter="url(#redGlow)"/>
      <line x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color} strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={`${len} ${len}`} strokeDashoffset={dashOffset}/>
    </g>
  );
};
