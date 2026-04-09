/**
 * Scene 08 — Model: One Input, One Output
 * "A model takes one input. It produces one output. That is it."
 * Hero: Clean single-step diagram — Input box → MODEL chip → Output box. 
 * Duration: 170 frames (5.67s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, CaptionBar, GlobalDefs, ProcessorUnit, CornerBrackets } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene08_ModelIO: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const chipEnter = interpolate(frame, [30, 70], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const outputEnter = interpolate(frame, [80, 120], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const arrowPulse = 0.5 + Math.sin(frame * 0.1) * 0.5;

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          <CornerBrackets opacity={0.25}/>

          {/* Arrow 1: Input → Model */}
          {chipEnter > 0.1 && (
            <g opacity={chipEnter * arrowPulse}>
              <line x1={540} y1={560} x2={540} y2={700}
                stroke={COLORS.warm_blue} strokeWidth={6} strokeLinecap="round"/>
              <polygon points="520,695 540,740 560,695"
                fill={COLORS.warm_blue}/>
            </g>
          )}

          {/* Arrow 2: Model → Output */}
          {outputEnter > 0.1 && (
            <g opacity={outputEnter * arrowPulse}>
              <line x1={540} y1={1140} x2={540} y2={1280}
                stroke={COLORS.electric_cyan} strokeWidth={6} strokeLinecap="round"
                filter="url(#cyanGlow)"/>
              <polygon points="520,1275 540,1320 560,1275"
                fill={COLORS.electric_cyan} filter="url(#cyanGlow)"/>
            </g>
          )}

          {/* ProcessorUnit SVG */}
          <ProcessorUnit cx={540} cy={920} size={340}
            opacity={chipEnter} scale={interpolate(frame, [30, 60], [0.7, 1], { extrapolateRight: 'clamp' })}
            variant="active" label="MODEL" frame={frame}/>
        </svg>

        {/* Title */}
        <div style={{
          position: 'absolute', top: 100, left: 80, right: 80,
          textAlign: 'center', opacity: enter,
        }}>
          <div style={{
            fontSize: 68, fontWeight: 900, color: COLORS.deep_black,
            fontFamily: '"Inter", sans-serif', letterSpacing: '-0.03em',
          }}>
            The <span style={{ color: COLORS.warm_blue }}>Model</span>
          </div>
          <div style={{ fontSize: 32, color: COLORS.light_gray, marginTop: 8 }}>
            One input. One output. That is it.
          </div>
        </div>

        {/* INPUT box */}
        <div style={{
          position: 'absolute', top: 300, left: 140, right: 140,
          background: '#0A1428',
          borderRadius: 22,
          border: `3px solid ${COLORS.warm_blue}50`,
          padding: '32px 36px',
          opacity: enter,
          transform: `translateY(${interpolate(frame, [0, 30], [-30, 0], { extrapolateRight: 'clamp' })}px)`,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 22, fontWeight: 800, letterSpacing: '0.1em',
            color: COLORS.warm_blue, marginBottom: 16,
          }}>
            INPUT
            <svg width={18} height={18} viewBox="0 0 18 18"><line x1={9} y1={2} x2={9} y2={14} stroke={COLORS.warm_blue} strokeWidth={2.5} strokeLinecap="round"/><polyline points="4,10 9,16 14,10" fill="none" stroke={COLORS.warm_blue} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div style={{
            fontFamily: '"Courier New", monospace',
            fontSize: 28, color: '#8090C0', lineHeight: 1.6,
          }}>
            "What is the capital of France?"
          </div>
        </div>

        {/* OUTPUT box */}
        <div style={{
          position: 'absolute', top: 1330, left: 140, right: 140,
          background: '#001A0A',
          borderRadius: 22,
          border: `3px solid ${COLORS.electric_cyan}50`,
          padding: '32px 36px',
          opacity: outputEnter,
          boxShadow: `0 0 40px rgba(0,229,255,0.1)`,
        }}>
          <div style={{
            fontSize: 22, fontWeight: 800, letterSpacing: '0.1em',
            color: COLORS.electric_cyan, marginBottom: 16,
          }}>
            OUTPUT ↑
          </div>
          <div style={{
            fontFamily: '"Courier New", monospace',
            fontSize: 28, color: '#609080', lineHeight: 1.6,
          }}>
            "Paris is the capital of France."
          </div>
        </div>

        {/* Properties row */}
        <div style={{
          position: 'absolute', top: 1580, left: 80, right: 80,
          display: 'flex', gap: 16, justifyContent: 'center',
          opacity: interpolate(frame, [120, 155], [0, 1], { extrapolateRight: 'clamp' }),
        }}>
          {['STATELESS', 'SINGLE STEP', 'NO LOOP', 'NO MEMORY'].map((tag, i) => (
            <div key={i} style={{
              background: 'rgba(59,130,246,0.1)',
              border: '2px solid rgba(59,130,246,0.3)',
              borderRadius: 12, padding: '10px 20px',
              fontSize: 22, fontWeight: 800, color: COLORS.warm_blue,
              letterSpacing: '0.04em',
            }}>
              {tag}
            </div>
          ))}
        </div>

        <CaptionBar
          text="A model takes one input. It produces one output. That is it."
          opacity={enter} y={1700}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
