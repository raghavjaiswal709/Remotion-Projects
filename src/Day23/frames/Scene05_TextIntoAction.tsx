/**
 * Scene 05 — Text Into Action
 * "...is what turns text into something a program can actually act on."
 * Hero: Animated transform pipeline — text → parse → act — with glowing arrows.
 * Duration: 130 frames (4.33s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, CaptionBar, GlobalDefs, CornerBrackets } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

const PIPELINE_STEPS = [
  { label: 'LANGUAGE', sub: 'Natural text', color: '#C8D0D4', bg: '#1A1A2E',
    iconSvg: <svg width={36} height={36} viewBox="0 0 36 36"><rect x={4} y={8} width={28} height={4} rx={2} fill="#C8D0D4"/><rect x={4} y={16} width={22} height={4} rx={2} fill="#C8D0D4" opacity={0.7}/><rect x={4} y={24} width={16} height={4} rx={2} fill="#C8D0D4" opacity={0.45}/></svg> },
  { label: 'STRUCTURE', sub: 'Typed schema', color: '#3B82F6', bg: '#0A1428',
    iconSvg: <svg width={36} height={36} viewBox="0 0 36 36"><rect x={4} y={4} width={28} height={28} rx={4} fill="none" stroke="#3B82F6" strokeWidth={2.5}/><line x1={4} y1={13} x2={32} y2={13} stroke="#3B82F6" strokeWidth={1.5}/><line x1={14} y1={13} x2={14} y2={32} stroke="#3B82F6" strokeWidth={1.5}/></svg> },
  { label: 'ACTION', sub: 'Program acts', color: '#00E5FF', bg: '#00131A',
    iconSvg: <svg width={36} height={36} viewBox="0 0 36 36"><polygon points="8,4 28,18 8,32" fill="#00E5FF"/></svg> },
  { label: 'RESULT', sub: 'Real-world effect', color: '#22C55E', bg: '#051A0E',
    iconSvg: <svg width={36} height={36} viewBox="0 0 36 36"><polyline points="5,18 14,27 31,9" fill="none" stroke="#22C55E" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round"/></svg> },
];

export const Scene05_TextIntoAction: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const flowPulse = (Math.sin(frame * 0.12) + 1) / 2;

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          <CornerBrackets opacity={0.25}/>
          {/* Ambient glow */}
          <ellipse cx={540} cy={960} rx={480} ry={600}
            fill={COLORS.electric_cyan} opacity={0.025}/>
          {/* Top circuit */}
          <path d="M 80,180 L 300,180 L 300,220 L 780,220 L 780,180 L 1000,180"
            fill="none" stroke={COLORS.electric_cyan} strokeWidth={1.5}
            opacity={0.12 * enter} strokeLinecap="round"/>
        </svg>

        {/* Title */}
        <div style={{
          position: 'absolute', top: 100, left: 80, right: 80,
          textAlign: 'center', opacity: enter,
        }}>
          <div style={{
            fontSize: 60, fontWeight: 900,
            color: COLORS.deep_black,
            fontFamily: '"Inter", sans-serif',
            letterSpacing: '-0.02em',
          }}>
            Text Into
            <span style={{ color: COLORS.electric_cyan }}> Action</span>
          </div>
          <div style={{ fontSize: 30, color: COLORS.light_gray, marginTop: 12 }}>
            The pipeline that makes AI useful
          </div>
        </div>

        {/* Pipeline steps */}
        {PIPELINE_STEPS.map((step, i) => {
          const stepEnter = interpolate(frame, [15 + i * 22, 40 + i * 22], [0, 1], { extrapolateRight: 'clamp', easing: ease });
          const stepY = 340 + i * 330;
          const isLast = i === PIPELINE_STEPS.length - 1;
          const arrowEnter = interpolate(frame, [30 + i * 22, 50 + i * 22], [0, 1], { extrapolateRight: 'clamp' });
          return (
            <div key={i}>
              {/* Step card */}
              <div style={{
                position: 'absolute',
                top: stepY, left: 80, right: 80, height: 240,
                background: step.bg,
                borderRadius: 24,
                border: `2px solid ${step.color}30`,
                boxShadow: `0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 ${step.color}10`,
                opacity: stepEnter,
                transform: `translateX(${interpolate(frame, [15+i*22, 40+i*22], [i % 2 === 0 ? -60 : 60, 0], { extrapolateRight: 'clamp' })}px)`,
                display: 'flex', alignItems: 'center', gap: 32, padding: '0 40px',
              }}>
                {/* Step number */}
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: `${step.color}18`,
                  border: `3px solid ${step.color}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: `0 0 20px ${step.color}30`,
                }}>
                  {step.iconSvg}
                </div>

                {/* Step info */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 40, fontWeight: 900,
                    color: step.color,
                    letterSpacing: '0.04em',
                    fontFamily: '"Inter", sans-serif',
                  }}>
                    {step.label}
                  </div>
                  <div style={{
                    fontSize: 28, color: '#8090A0',
                    marginTop: 6,
                    fontFamily: '"Inter", sans-serif',
                  }}>
                    {step.sub}
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{
                  width: 12, height: 160, borderRadius: 6,
                  background: '#1A2030',
                  position: 'relative', overflow: 'hidden', flexShrink: 0,
                }}>
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: `${(stepEnter * 100)}%`,
                    background: step.color,
                    borderRadius: 6,
                    boxShadow: `0 0 12px ${step.color}`,
                    transition: 'height 0.3s',
                  }}/>
                </div>
              </div>

              {/* Arrow between steps */}
              {!isLast && (
                <div style={{
                  position: 'absolute',
                  top: stepY + 248, left: 0, right: 0,
                  display: 'flex', justifyContent: 'center',
                  opacity: arrowEnter,
                }}>
                  <svg
                    width={40} height={48}
                    viewBox="0 0 40 48"
                    style={{
                      filter: `drop-shadow(0 0 12px ${COLORS.electric_cyan})`,
                      transform: `scale(${0.8 + flowPulse * 0.2})`,
                    }}
                  >
                    <line x1={20} y1={2} x2={20} y2={36} stroke={COLORS.electric_cyan} strokeWidth={4} strokeLinecap="round"/>
                    <polyline points="8,26 20,40 32,26" fill="none" stroke={COLORS.electric_cyan} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          );
        })}

        {/* Key insight callout */}
        <div style={{
          position: 'absolute', top: 1686, left: 80, right: 80,
          opacity: interpolate(frame, [90, 120], [0, 1], { extrapolateRight: 'clamp' }),
          background: 'rgba(0,229,255,0.06)',
          border: '2px solid rgba(0,229,255,0.25)',
          borderRadius: 16, padding: '20px 32px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: 30, fontWeight: 700,
            color: COLORS.electric_cyan,
          }}>
            Structure is the bridge between language and action.
          </div>
        </div>

        <CaptionBar
          text="is what turns text into something a program can actually act on"
          opacity={enter} y={1800}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
