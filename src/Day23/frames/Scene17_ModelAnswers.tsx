/**
 * Scene 17 — See the Difference: Model Answers
 * "See the difference. The model answers."
 * Hero: Split comparison with MODEL showing linear answer, no feedback.
 * Duration: 65 frames (2.17s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, CaptionBar, GlobalDefs, ProcessorUnit, CornerBrackets } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene17_ModelAnswers: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const modelEnter = interpolate(frame, [15, 50], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const arrowPulse = 0.6 + Math.sin(frame * 0.1) * 0.4;

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          <CornerBrackets opacity={0.25}/>

          {/* Linear flow: INPUT → MODEL → ANSWER */}
          {/* Arrows */}
          <line x1={540} y1={540} x2={540} y2={680}
            stroke={COLORS.warm_blue} strokeWidth={6}
            opacity={modelEnter * arrowPulse}/>
          <polygon points="520,675 540,720 560,675"
            fill={COLORS.warm_blue} opacity={modelEnter}/>
          <line x1={540} y1={1120} x2={540} y2={1260}
            stroke={COLORS.warm_blue} strokeWidth={6}
            opacity={modelEnter * arrowPulse}/>
          <polygon points="520,1255 540,1300 560,1255"
            fill={COLORS.warm_blue} opacity={modelEnter}/>

          {/* Dead end marker — below answer box (box ends ~1430) */}
          <line x1={440} y1={1480} x2={640} y2={1480}
            stroke={COLORS.vibrant_red} strokeWidth={8} strokeLinecap="round"
            opacity={modelEnter}/>
          <text x={540} y={1546} textAnchor="middle"
            fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={800}
            fill={COLORS.vibrant_red} opacity={modelEnter}>
            TRANSACTION ENDS
          </text>

          {/* ProcessorUnit — center at cy=900, size=300 → spans y=750..1050 */}
          <ProcessorUnit cx={540} cy={900} size={300}
            opacity={modelEnter}
            scale={interpolate(frame, [15, 45], [0.7, 1], { extrapolateRight: 'clamp' })}
            variant="dormant" label="" frame={frame}/>
          <text x={540} y={908} textAnchor="middle" dominantBaseline="middle"
            fontFamily="'Inter', sans-serif" fontSize={48} fontWeight={900}
            fill={COLORS.warm_blue} opacity={modelEnter}>MODEL</text>
        </svg>

        {/* Title */}
        <div style={{ position: 'absolute', top: 100, left: 80, right: 80, textAlign: 'center', opacity: enter }}>
          <div style={{
            fontSize: 62, fontWeight: 900, color: COLORS.deep_black,
            fontFamily: '"Inter", sans-serif', letterSpacing: '-0.03em',
          }}>
            The Model <span style={{ color: COLORS.warm_blue }}>Answers</span>
          </div>
        </div>

        {/* INPUT box */}
        <div style={{
          position: 'absolute', top: 300, left: 140, right: 140,
          background: '#0A1428', borderRadius: 16,
          border: `2px solid ${COLORS.warm_blue}40`,
          padding: '28px 32px', opacity: enter,
        }}>
          <div style={{ fontSize: 22, color: COLORS.warm_blue, fontWeight: 800, marginBottom: 8 }}>QUESTION</div>
          <div style={{ fontSize: 28, color: '#8090C0', fontFamily: 'monospace' }}>
            "Book me a flight to Tokyo"
          </div>
        </div>

        {/* ANSWER box */}
        <div style={{
          position: 'absolute', top: 1310, left: 140, right: 140,
          background: '#0A1428', borderRadius: 16,
          border: `2px solid ${COLORS.warm_blue}40`,
          padding: '28px 32px',
          opacity: modelEnter,
        }}>
          <div style={{ fontSize: 22, color: COLORS.warm_blue, fontWeight: 800, marginBottom: 8 }}>ANSWER</div>
          <div style={{ fontSize: 28, color: '#8090C0', fontFamily: 'monospace' }}>
            "Sure! Try booking at flights.com"
          </div>
        </div>

        <CaptionBar text="See the difference. The model answers." opacity={enter} y={1730}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
