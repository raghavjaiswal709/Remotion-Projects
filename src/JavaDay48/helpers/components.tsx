/**
 * Shared components for Day 48
 * RULE: DarkBackground must be the first child of every SVG in EVERY scene.
 * FONT: 'Galaxie Copernicus ExtraBold', Georgia, serif — used on ALL text elements.
 */
import React from 'react';
import { COLORS } from './timing';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

export const DarkBackground: React.FC = () => (
  <g>
    <rect width={1080} height={1920} fill={COLORS.bg_primary} />
    {Array.from({ length: Math.ceil(1920 / 120) + 1 }, (_, i) => (
      <line key={`h${i}`} x1={0} y1={i * 120} x2={1080} y2={i * 120} stroke={COLORS.grid_line} strokeWidth={1} />
    ))}
    {Array.from({ length: Math.ceil(1080 / 120) + 1 }, (_, i) => (
      <line key={`v${i}`} x1={i * 120} y1={0} x2={i * 120} y2={1920} stroke={COLORS.grid_line} strokeWidth={1} />
    ))}
  </g>
);

export const PaperBackground = DarkBackground;

export const GlobalDefs: React.FC = () => (
  <defs>
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill={COLORS.accent} />
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
    if (lineLength + word.length + 1 > 48 && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = [word];
      lineLength = word.length;
    } else {
      currentLine.push(word);
      lineLength += word.length + 1;
    }
  });
  if (currentLine.length > 0) lines.push(currentLine);

  const baseY = lines.length === 1 ? 1860 : 1836;
  const lineGap = 48;

  return (
    <g opacity={opacity}>
      {lines.map((lineWords, lineIdx) => (
        <text
          key={lineIdx}
          x={540}
          y={baseY + lineIdx * lineGap}
          textAnchor="middle"
          fontFamily={FONT}
          fontSize={44}
          fontWeight={800}
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

interface BentoCardProps {
  x: number; y: number; w: number; h: number;
  accent?: boolean; rx?: number; opacity?: number;
}
export const BentoCard: React.FC<BentoCardProps> = ({
  x, y, w, h, accent = false, rx = 20, opacity = 1,
}) => (
  <rect
    x={x} y={y} width={w} height={h} rx={rx}
    fill={COLORS.bg_secondary}
    stroke={accent ? COLORS.accent : 'rgba(255,255,255,0.1)'}
    strokeWidth={accent ? 2 : 1}
    opacity={opacity}
  />
);

export const CornerAccents: React.FC<{ opacity?: number; color?: string }> = ({
  opacity = 0.5, color = COLORS.accent,
}) => (
  <g opacity={opacity}>
    <path d="M 60,60 L 60,140 M 60,60 L 140,60" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    <path d="M 1020,60 L 1020,140 M 1020,60 L 940,60" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    <path d="M 60,1740 L 60,1660 M 60,1740 L 140,1740" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    <path d="M 1020,1740 L 1020,1660 M 1020,1740 L 940,1740" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
  </g>
);

export const Divider: React.FC<{ y: number; opacity?: number }> = ({ y, opacity = 0.2 }) => (
  <line x1={60} y1={y} x2={1020} y2={y} stroke="rgba(255,255,255,0.2)" strokeWidth={1} opacity={opacity} />
);

export const SectionLabel: React.FC<{ text: string; y?: number; opacity?: number }> = ({
  text, y = 160, opacity = 0.7,
}) => (
  <text
    x={60} y={y}
    fontFamily={FONT}
    fontSize={28} fontWeight={800}
    fill={COLORS.accent}
    letterSpacing="0.15em"
    opacity={opacity}
  >
    {text.toUpperCase()}
  </text>
);
