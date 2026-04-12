/**
 * Shared components for ArtemisDay4
 * RULE: PaperBackground must be the first child of AbsoluteFill in EVERY scene.
 */
import React from 'react';
import { COLORS } from './timing';

export const PaperBackground: React.FC = () => (
  <g>
    <rect width={1080} height={1920} fill={COLORS.bg_paper} />
    {Array.from({ length: 12 * 22 }, (_, i) => (
      <circle
        key={i}
        cx={(i % 12) * 90 + 45}
        cy={Math.floor(i / 12) * 88 + 44}
        r={1.4}
        fill={COLORS.deep_black}
        opacity={0.032}
      />
    ))}
  </g>
);

export const GlobalDefs: React.FC = () => (
  <defs>
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill={COLORS.sky_blue} />
    </marker>
    <marker id="arrowRed" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill={COLORS.vibrant_red} />
    </marker>
  </defs>
);

interface CaptionProps {
  text: string;
  keyWords?: string[];
  frame: number;
  sceneFrom: number;
  sceneDuration: number;
}

export const Caption: React.FC<CaptionProps> = ({
  text, keyWords = [], frame, sceneFrom, sceneDuration,
}) => {
  const localFrame = frame - sceneFrom;
  const opacity =
    Math.min(1, localFrame / 8) *
    Math.min(1, (sceneDuration - localFrame) / 8);

  const words = text.split(' ');
  const lowerKeys = keyWords.map(k => k.toLowerCase());

  const lines: string[][] = [];
  let currentLine: string[] = [];
  let lineLength = 0;

  words.forEach(word => {
    if (lineLength + word.length + 1 > 52 && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = [word];
      lineLength = word.length;
    } else {
      currentLine.push(word);
      lineLength += word.length + 1;
    }
  });
  if (currentLine.length > 0) lines.push(currentLine);

  const baseY = lines.length === 1 ? 140 : 116;
  const lineGap = 48;

  return (
    <g opacity={opacity}>
      {lines.map((lineWords, lineIdx) => (
        <text
          key={lineIdx}
          x={540}
          y={baseY + lineIdx * lineGap}
          textAnchor="middle"
          fontFamily="'Inter', system-ui, sans-serif"
          fontSize={38}
          fontWeight={700}
          fill={COLORS.text_caption}
        >
          {lineWords.map((word, i) => {
            const isKey = lowerKeys.some(k =>
              word.toLowerCase().replace(/[.,!?]/g, '').includes(k)
            );
            return (
              <tspan key={i} fill={isKey ? COLORS.text_highlight : COLORS.text_caption}>
                {word}{i < lineWords.length - 1 ? ' ' : ''}
              </tspan>
            );
          })}
        </text>
      ))}
    </g>
  );
};

export const CornerAccents: React.FC<{ opacity?: number; color?: string }> = ({
  opacity = 0.4, color = COLORS.sky_blue,
}) => (
  <g opacity={opacity}>
    <path d="M 60,70 L 60,150 M 60,70 L 140,70" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" />
    <path d="M 1020,70 L 1020,150 M 1020,70 L 940,70" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" />
    <path d="M 60,1850 L 60,1770 M 60,1850 L 140,1850" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" />
    <path d="M 1020,1850 L 1020,1770 M 1020,1850 L 940,1850" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" />
  </g>
);

export const Divider: React.FC<{ y: number; opacity?: number }> = ({ y, opacity = 0.15 }) => (
  <line x1={60} y1={y} x2={1020} y2={y} stroke={COLORS.deep_black} strokeWidth={1} opacity={opacity} />
);

export const SectionLabel: React.FC<{ text: string; y?: number; opacity?: number }> = ({
  text, y = 120, opacity = 0.6,
}) => (
  <text
    x={60} y={y}
    fontFamily="'Inter', system-ui, sans-serif"
    fontSize={24} fontWeight={500}
    fill={COLORS.cool_silver}
    letterSpacing="0.18em"
    opacity={opacity}
  >
    {text.toUpperCase()}
  </text>
);
