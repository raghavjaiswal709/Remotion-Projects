/**
 * Scene 25 — Outro
 * Outro fade with subscription CTA, series summary, Day 24 preview.
 * Duration: 149 frames (4.97s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { BlackBackground, CaptionBar, GlobalDefs, AIRobot, CornerBrackets } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene25_Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 40], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const robotEnter = interpolate(frame, [20, 60], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const ctaEnter = interpolate(frame, [50, 100], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const day24Enter = interpolate(frame, [80, 130], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const fadeOut = interpolate(frame, [120, 149], [1, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <BlackBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          <CornerBrackets opacity={0.3} color={COLORS.electric_cyan}/>
          {/* Ambient glow */}
          <circle cx={540} cy={960} r={500}
            fill="rgba(0,229,255,0.03)" filter="url(#softGlow)"/>
          {/* Brand line top */}
          <line x1={80} y1={160} x2={1000} y2={160}
            stroke={COLORS.electric_cyan} strokeWidth={2}
            opacity={enter * 0.4}/>
          {/* Brand line bottom */}
          <line x1={80} y1={1760} x2={1000} y2={1760}
            stroke={COLORS.electric_cyan} strokeWidth={2}
            opacity={enter * 0.4}/>
          {/* Robot center-left */}
          <AIRobot cx={260} cy={900} scale={0.8} opacity={robotEnter}
            coreGlow={1} eyeColor={COLORS.electric_cyan} frame={frame} variant="active"/>
        </svg>

        {/* Top label */}
        <div style={{
          position: 'absolute', top: 80, left: 80, right: 80,
          textAlign: 'center', opacity: enter,
        }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(0,229,255,0.1)',
            border: `2px solid rgba(0,229,255,0.3)`,
            borderRadius: 40, padding: '10px 32px',
            fontSize: 24, fontWeight: 700, color: COLORS.electric_cyan,
            letterSpacing: '0.1em',
          }}>
            SERIES: HIDDEN WORLD OF AI
          </div>
        </div>

        {/* Main title block */}
        <div style={{
          position: 'absolute', top: 300, left: 80, right: 80,
          opacity: enter,
        }}>
          <div style={{
            fontSize: 28, color: COLORS.cool_silver, fontWeight: 600,
            letterSpacing: '0.15em', marginBottom: 10,
          }}>
            DAY 23 RECAP
          </div>
          <div style={{
            fontSize: 62, fontWeight: 900, color: '#F5F0E8',
            fontFamily: '"Inter", sans-serif', letterSpacing: '-0.03em',
            lineHeight: 1.1,
          }}>
            Model vs Agent:
            <br/>
            <span style={{ color: COLORS.electric_cyan }}>The Loop</span>
          </div>
        </div>

        {/* Summary points */}
        <div style={{
          position: 'absolute', top: 600, left: 520, right: 80,
          opacity: ctaEnter,
        }}>
          {[
            {
              text: 'A model answers — once.', color: COLORS.warm_blue,
              iconSvg: <svg width={30} height={30} viewBox="0 0 30 30"><polygon points="6,2 24,15 6,28" fill={COLORS.warm_blue}/></svg>,
            },
            {
              text: 'An agent loops — continuously.', color: COLORS.electric_cyan,
              iconSvg: <svg width={30} height={30} viewBox="0 0 30 30"><path d="M 24,15 A 9,9 0 1,1 15,6" fill="none" stroke={COLORS.electric_cyan} strokeWidth={3} strokeLinecap="round"/><polygon points="15,0 21,8 9,8" fill={COLORS.electric_cyan}/></svg>,
            },
            {
              text: 'The loop enables navigation.', color: COLORS.electric_cyan,
              iconSvg: <svg width={30} height={30} viewBox="0 0 30 30"><circle cx={15} cy={15} r={12} fill="none" stroke={COLORS.electric_cyan} strokeWidth={2.5}/><ellipse cx={15} cy={15} rx={5} ry={12} fill="none" stroke={COLORS.electric_cyan} strokeWidth={1.5}/><line x1={3} y1={15} x2={27} y2={15} stroke={COLORS.electric_cyan} strokeWidth={1.5}/></svg>,
            },
            {
              text: 'The loop IS the definition.', color: '#22C55E',
              iconSvg: <svg width={30} height={30} viewBox="0 0 30 30"><circle cx={15} cy={15} r={12} fill="none" stroke="#22C55E" strokeWidth={2.5}/><circle cx={15} cy={15} r={6} fill="none" stroke="#22C55E" strokeWidth={2}/><circle cx={15} cy={15} r={2.5} fill="#22C55E"/></svg>,
            },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 16,
              marginBottom: 28,
              opacity: interpolate(frame, [55 + i * 12, 85 + i * 12], [0, 1], { extrapolateRight: 'clamp' }),
            }}>
              <div style={{ flexShrink: 0 }}>{item.iconSvg}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: item.color }}>
                {item.text}
              </div>
            </div>
          ))}
        </div>

        {/* Subscribe CTA */}
        <div style={{
          position: 'absolute', top: 1160, left: 80, right: 80,
          textAlign: 'center', opacity: ctaEnter,
          background: 'rgba(0,229,255,0.06)',
          border: '2px solid rgba(0,229,255,0.25)',
          borderRadius: 24, padding: '36px 40px',
        }}>
          <div style={{
            fontSize: 24, color: COLORS.cool_silver, fontWeight: 600,
            letterSpacing: '0.08em', marginBottom: 8,
          }}>
            IF THIS CLICKED FOR YOU
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20,
            fontSize: 46, fontWeight: 900, color: '#F5F0E8',
            marginBottom: 12,
          }}>
            {/* Thumbs Up SVG */}
            <svg width={44} height={44} viewBox="0 0 44 44">
              <path d="M 14,20 Q 14,10 22,10 L 22,18 L 28,18 Q 32,18 32,22 L 30,38 Q 30,40 28,40 L 14,40 Z" fill="#F5F0E8"/>
              <rect x={8} y={22} width={6} height={18} rx={2} fill="#F5F0E8" opacity={0.7}/>
            </svg>
            <span>Like</span>
            <span style={{ opacity: 0.4, fontSize: 32 }}>·</span>
            {/* Bell SVG */}
            <svg width={44} height={44} viewBox="0 0 44 44">
              <path d="M 22,6 Q 32,8 32,20 L 34,32 L 10,32 L 12,20 Q 12,8 22,6 Z" fill="#F5F0E8"/>
              <rect x={18} y={32} width={8} height={6} rx={3} fill="#F5F0E8" opacity={0.7}/>
              <circle cx={22} cy={6} r={2.5} fill="#F5F0E8"/>
            </svg>
            <span>Subscribe</span>
          </div>
          <div style={{ fontSize: 26, color: '#8090A0' }}>
            Daily breakdowns of AI concepts that matter.
          </div>
        </div>

        {/* Day 24 preview */}
        <div style={{
          position: 'absolute', top: 1440, left: 80, right: 80,
          opacity: day24Enter,
          background: 'rgba(59,130,246,0.06)',
          border: '2px solid rgba(59,130,246,0.2)',
          borderRadius: 20, padding: '28px 36px',
        }}>
          <div style={{ fontSize: 24, color: COLORS.warm_blue, fontWeight: 700, marginBottom: 8, letterSpacing: '0.08em' }}>
            TOMORROW · DAY 24
          </div>
          <div style={{ fontSize: 38, fontWeight: 900, color: '#F5F0E8' }}>
            Tool Use & Function Calling
          </div>
          <div style={{ fontSize: 24, color: '#6080A0', marginTop: 8 }}>
            How agents connect to the real world.
          </div>
        </div>

        <CaptionBar text="See you on Day 24." opacity={ctaEnter} y={1730}/>
      </BlackBackground>
    </AbsoluteFill>
  );
};
