/**
 * Shared SVG components for Day 27 — Tools
 * Premium Colored Pencil AI Explainer Style
 */

import React from 'react';
import { COLORS } from './timing';

// ── SVG DEFS — global filters, gradients, patterns ──
export const GlobalDefs: React.FC = () => (
  <defs>
    <filter id="paperGrain" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" result="noise"/>
      <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise"/>
      <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="blended"/>
      <feComponentTransfer in="blended"><feFuncA type="linear" slope="0.05"/></feComponentTransfer>
      <feComposite in="SourceGraphic" in2="blended" operator="over"/>
    </filter>
    <filter id="cyanGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="12" result="blur"/>
      <feFlood floodColor="#00E5FF" floodOpacity="0.6" result="color"/>
      <feComposite in="color" in2="blur" operator="in" result="colorBlur"/>
      <feMerge><feMergeNode in="colorBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#0D0D0D" floodOpacity="0.25"/>
    </filter>
    <linearGradient id="warmBlueGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#60A5FA"/>
      <stop offset="100%" stopColor="#2563EB"/>
    </linearGradient>
    <pattern id="dotGrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="20" cy="20" r="1.5" fill="#0D0D0D" opacity="0.08"/>
    </pattern>
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
    </pattern>
    <linearGradient id="paperGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#F8F4EC"/>
      <stop offset="50%" stopColor="#F5F0E8"/>
      <stop offset="100%" stopColor="#EDE8DE"/>
    </linearGradient>
  </defs>
);

// ── PAPER BACKGROUND ──
export const PaperBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div style={{
    width: 1080, height: 1920,
    background: 'linear-gradient(160deg, #F8F4EC 0%, #F5F0E8 50%, #EDE8DE 100%)',
    overflow: 'hidden',
    position: 'relative',
    fontFamily: '"Inter", "SF Pro Display", sans-serif',
  }}>
    <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} width={1080} height={1920}>
      <GlobalDefs/>
      <rect width={1080} height={1920} fill="url(#dotGrid)"/>
    </svg>
    <div style={{ position: 'relative', zIndex: 2, width: '100%', height: '100%' }}>
      {children}
    </div>
  </div>
);

// ── CAPTION BAR ──
interface CaptionBarProps {
  text: string;
  opacity: number;
  highlightWords?: string[];
}
export const CaptionBar: React.FC<CaptionBarProps> = ({ text, opacity, highlightWords = [] }) => {
  const words = text.split(' ');
  return (
    <div style={{
      position: 'absolute',
      bottom: 100,
      left: 60,
      right: 60,
      opacity,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px 32px',
      background: 'rgba(13,13,13,0.88)',
      borderRadius: 20,
      border: '1px solid rgba(0,229,255,0.15)',
    }}>
      <p style={{
        margin: 0,
        fontSize: 32,
        fontWeight: 600,
        lineHeight: 1.5,
        textAlign: 'center',
        fontFamily: '"Inter", sans-serif',
        color: '#F9FAFB',
        letterSpacing: '0.01em',
      }}>
        {words.map((word, i) => (
          <span key={i} style={{
            color: highlightWords.includes(word.replace(/[.,!?]/g, ''))
              ? '#00E5FF'
              : '#F9FAFB',
          }}>
            {word}{i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </p>
    </div>
  );
};

// ── CORNER BRACKETS ──
export const CornerBrackets: React.FC<{ opacity: number }> = ({ opacity }) => (
  <g opacity={opacity}>
    <path d="M 60,60 L 60,160 M 60,60 L 160,60" fill="none" stroke={COLORS.warm_blue} strokeWidth={3} strokeLinecap="round" opacity={0.45} />
    <path d="M 1020,60 L 1020,160 M 1020,60 L 920,60" fill="none" stroke={COLORS.warm_blue} strokeWidth={3} strokeLinecap="round" opacity={0.45} />
    <path d="M 60,1860 L 60,1760 M 60,1860 L 160,1860" fill="none" stroke={COLORS.warm_blue} strokeWidth={3} strokeLinecap="round" opacity={0.45} />
    <path d="M 1020,1860 L 1020,1760 M 1020,1860 L 920,1860" fill="none" stroke={COLORS.warm_blue} strokeWidth={3} strokeLinecap="round" opacity={0.45} />
  </g>
);
