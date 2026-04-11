/**
 * Scene 15 — Browser Tool
 * "A browser tool gives it access to any website on Earth."
 * Paper background. Globe icon + browser window visual.
 * Duration: 106 frames (~3.5s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, GlobalDefs, CaptionBar } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene15_BrowserTool: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn     = interpolate(frame, [0, 12], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const browserOp  = interpolate(frame, [5, 22], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const browserScale = interpolate(frame, [5, 22], [0.7, 1], { easing: ease, extrapolateRight: 'clamp' });
  const globeOp    = interpolate(frame, [18, 35], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const globeSpin  = frame * 0.4;
  const connectOp  = interpolate(frame, [30, 48], [0, 1], { easing: ease, extrapolateRight: 'clamp' });
  const labelOp    = interpolate(frame, [45, 60], [0, 1], { easing: ease, extrapolateRight: 'clamp' });

  const websites = ['wikipedia.org', 'github.com', 'news.api', 'docs.dev', 'data.gov'];
  const webAnims = websites.map((_, i) => (
    interpolate(frame, [40 + i * 8, 55 + i * 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  ));

  return (
    <AbsoluteFill>
      <PaperBackground />
      <GlobalDefs />
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        {/* Header */}
        <text x={540} y={180} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500}
          fill={COLORS.purple} letterSpacing="0.2em" opacity={fadeIn * 0.7}>
          BROWSER TOOL
        </text>

        {/* Browser window */}
        <g opacity={browserOp} transform={`translate(540, 460) scale(${browserScale})`}>
          <rect x={-220} y={-130} width={440} height={260} rx={16}
            fill={COLORS.deep_black} opacity={0.92} />
          <rect x={-220} y={-130} width={440} height={260} rx={16}
            fill="none" stroke={COLORS.purple} strokeWidth={3} />
          {/* Title bar */}
          <rect x={-220} y={-130} width={440} height={40} rx={16}
            fill={COLORS.deep_black} />
          <circle cx={-190} cy={-110} r={6} fill="#EF4444" opacity={0.7} />
          <circle cx={-170} cy={-110} r={6} fill="#F59E0B" opacity={0.7} />
          <circle cx={-150} cy={-110} r={6} fill="#22C55E" opacity={0.7} />
          {/* URL bar */}
          <rect x={-120} y={-120} width={300} height={24} rx={6}
            fill="rgba(255,255,255,0.08)" />
          <text x={-110} y={-103} fontFamily="monospace" fontSize={14} fill={COLORS.cool_silver} opacity={0.6}>
            https://any-website.com
          </text>
          {/* Content placeholder lines */}
          {Array.from({ length: 5 }, (_, i) => (
            <rect key={i} x={-190} y={-60 + i * 30} width={160 + (i % 3) * 60} height={12} rx={3}
              fill={COLORS.cool_silver} opacity={0.15} />
          ))}
        </g>

        {/* Connection line */}
        <g opacity={connectOp}>
          <line x1={540} y1={600} x2={540} y2={680} stroke={COLORS.purple} strokeWidth={3} strokeDasharray="6,4" />
          <polygon points="528,670 540,695 552,670" fill={COLORS.purple} />
        </g>

        {/* Globe */}
        <g opacity={globeOp} transform="translate(540, 820)">
          <circle cx={0} cy={0} r={100} fill="none" stroke={COLORS.purple} strokeWidth={3} />
          {/* Globe lines */}
          <ellipse cx={0} cy={0} rx={60} ry={100} fill="none" stroke={COLORS.purple} strokeWidth={1.5} opacity={0.4}
            transform={`rotate(${globeSpin}, 0, 0)`} />
          <ellipse cx={0} cy={0} rx={100} ry={40} fill="none" stroke={COLORS.purple} strokeWidth={1.5} opacity={0.4} />
          <line x1={-100} y1={0} x2={100} y2={0} stroke={COLORS.purple} strokeWidth={1} opacity={0.3} />
          <line x1={0} y1={-100} x2={0} y2={100} stroke={COLORS.purple} strokeWidth={1} opacity={0.3} />
          <text x={0} y={10} textAnchor="middle" fontSize={50}>🌍</text>
        </g>

        {/* Website labels around globe */}
        {websites.map((site, i) => {
          const angle = (i / websites.length) * Math.PI * 2 - Math.PI / 2;
          const rx = Math.cos(angle) * 220;
          const ry = Math.sin(angle) * 160;
          return (
            <g key={site} opacity={webAnims[i]}>
              <text x={540 + rx} y={820 + ry} textAnchor="middle" fontFamily="monospace"
                fontSize={18} fontWeight={500} fill={COLORS.purple} opacity={0.7}>
                {site}
              </text>
              <line x1={540 + rx * 0.55} y1={820 + ry * 0.55} x2={540 + rx * 0.8} y2={820 + ry * 0.8}
                stroke={COLORS.purple} strokeWidth={1} opacity={0.3} strokeDasharray="3,3" />
            </g>
          );
        })}

        {/* Label */}
        <text x={540} y={1100} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={38} fontWeight={700}
          fill={COLORS.deep_black} opacity={labelOp}>
          Access to any website on Earth
        </text>

        <rect x={160} y={1700} width={760} height={6} rx={3} fill={COLORS.purple} opacity={fadeIn * 0.2} />
      </svg>

      <CaptionBar text="A browser tool gives it access to any website on Earth."
        opacity={interpolate(frame, [4, 14], [0, 1], { extrapolateRight: 'clamp' })}
        highlightWords={['browser', 'tool', 'any', 'website', 'Earth']} />
    </AbsoluteFill>
  );
};
