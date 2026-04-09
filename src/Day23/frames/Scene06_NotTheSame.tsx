/**
 * Scene 06 — Model vs Agent (Not the Same)
 * "Now, a model and an agent are not the same thing."
 * Hero: Split comparison panel — MODEL box vs AGENT box, connecting slash.
 * Duration: 101 frames (3.37s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, CaptionBar, GlobalDefs, CornerBrackets, SlashMark } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene06_NotTheSame: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const slashEnter = interpolate(frame, [35, 65], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const slashLen = Math.sqrt((700-380)**2 + (1400-820)**2);
  const slashDash = interpolate(frame, [35, 70], [slashLen, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          <CornerBrackets opacity={0.3}/>
          {/* Central divider */}
          <line x1={540} y1={280} x2={540} y2={1660}
            stroke={COLORS.light_gray} strokeWidth={2}
            strokeDasharray="8 6" opacity={enter * 0.35}/>
          {/* Ambience left */}
          <ellipse cx={270} cy={960} rx={240} ry={480}
            fill={COLORS.warm_blue} opacity={0.03}/>
          {/* Ambience right */}
          <ellipse cx={810} cy={960} rx={240} ry={480}
            fill={COLORS.electric_cyan} opacity={0.03}/>
          {/* Top headline underline */}
          <line x1={200} y1={270} x2={880} y2={270}
            stroke={COLORS.electric_cyan} strokeWidth={3} opacity={enter * 0.4}/>
          {/* Slash mark through equals sign */}
          <SlashMark x1={380} y1={820} x2={700} y2={1400}
            dashOffset={slashDash} opacity={slashEnter} sw={12}/>
        </svg>

        {/* Headline */}
        <div style={{
          position: 'absolute', top: 100, left: 80, right: 80,
          textAlign: 'center', opacity: enter,
        }}>
          <div style={{ fontSize: 64, fontWeight: 900, color: COLORS.deep_black,
            fontFamily: '"Inter", sans-serif', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Not The <span style={{ color: COLORS.vibrant_red }}>Same</span> Thing
          </div>
          <div style={{ marginTop: 14, fontSize: 32, color: COLORS.light_gray }}>
            A critical architectural distinction
          </div>
        </div>

        {/* MODEL box — left */}
        <div style={{
          position: 'absolute', top: 320, left: 80, width: 420, height: 680,
          background: 'linear-gradient(160deg, #1A1A2E 0%, #12121E 100%)',
          borderRadius: 28,
          border: `3px solid ${COLORS.warm_blue}40`,
          boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
          padding: '40px 36px',
          opacity: enter,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{
            width: '100%',
            paddingBottom: 24,
            borderBottom: `2px solid rgba(59,130,246,0.3)`,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 52, fontWeight: 900, color: COLORS.warm_blue,
              letterSpacing: '0.04em' }}>MODEL</div>
          </div>
          {/* Icon */}
          <div style={{
            width: 140, height: 140, borderRadius: '50%',
            background: 'rgba(59,130,246,0.1)',
            border: `3px solid rgba(59,130,246,0.4)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* Brain SVG */}
            <svg width={80} height={80} viewBox="0 0 80 80">
              <ellipse cx={40} cy={36} rx={26} ry={22} fill="none" stroke="rgba(59,130,246,0.6)" strokeWidth={2.5}/>
              <line x1={40} y1={14} x2={40} y2={58} stroke="rgba(59,130,246,0.4)" strokeWidth={1.5}/>
              <path d="M 26,28 Q 18,32 20,42 Q 22,50 30,50" fill="none" stroke="rgba(59,130,246,0.5)" strokeWidth={2}/>
              <path d="M 54,28 Q 62,32 60,42 Q 58,50 50,50" fill="none" stroke="rgba(59,130,246,0.5)" strokeWidth={2}/>
              <circle cx={40} cy={60} r={4} fill="rgba(59,130,246,0.5)"/>
            </svg>
          </div>
          {/* Properties */}
          {['One input', 'One output', 'No loop', 'No memory', 'Stateless'].map((prop, i) => (
            <div key={i} style={{
              width: '100%', padding: '12px 20px',
              background: 'rgba(59,130,246,0.07)',
              borderRadius: 10,
              fontSize: 26, color: '#8090C0',
              display: 'flex', alignItems: 'center', gap: 12,
              opacity: interpolate(frame, [15 + i*10, 35 + i*10], [0, 1], { extrapolateRight: 'clamp' }),
            }}>
              <span style={{ color: COLORS.warm_blue }}>›</span> {prop}
            </div>
          ))}
        </div>

        {/* AGENT box — right */}
        <div style={{
          position: 'absolute', top: 320, right: 80, width: 420, height: 680,
          background: 'linear-gradient(160deg, #001A20 0%, #001215 100%)',
          borderRadius: 28,
          border: `3px solid ${COLORS.electric_cyan}40`,
          boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
          padding: '40px 36px',
          opacity: enter,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{
            width: '100%',
            paddingBottom: 24,
            borderBottom: `2px solid rgba(0,229,255,0.3)`,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 52, fontWeight: 900, color: COLORS.electric_cyan,
              letterSpacing: '0.04em' }}>AGENT</div>
          </div>
          {/* Icon */}
          <div style={{
            width: 140, height: 140, borderRadius: '50%',
            background: 'rgba(0,229,255,0.08)',
            border: `3px solid rgba(0,229,255,0.4)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* Robot SVG */}
            <svg width={80} height={80} viewBox="0 0 80 80">
              <rect x={20} y={26} width={40} height={30} rx={6} fill="none" stroke="rgba(0,229,255,0.6)" strokeWidth={2.5}/>
              <circle cx={32} cy={40} r={5} fill="rgba(0,229,255,0.7)"/>
              <circle cx={48} cy={40} r={5} fill="rgba(0,229,255,0.7)"/>
              <rect x={34} y={48} width={12} height={3} rx={1.5} fill="rgba(0,229,255,0.5)"/>
              <rect x={36} y={16} width={8} height={10} rx={3} fill="none" stroke="rgba(0,229,255,0.5)" strokeWidth={2}/>
              <line x1={16} y1={32} x2={20} y2={32} stroke="rgba(0,229,255,0.5)" strokeWidth={3} strokeLinecap="round"/>
              <line x1={60} y1={32} x2={64} y2={32} stroke="rgba(0,229,255,0.5)" strokeWidth={3} strokeLinecap="round"/>
              <line x1={28} y1={56} x2={28} y2={66} stroke="rgba(0,229,255,0.4)" strokeWidth={3} strokeLinecap="round"/>
              <line x1={52} y1={56} x2={52} y2={66} stroke="rgba(0,229,255,0.4)" strokeWidth={3} strokeLinecap="round"/>
            </svg>
          </div>
          {/* Properties */}
          {['Looping', 'Observes output', 'Adapts', 'Has memory', 'Autonomous'].map((prop, i) => (
            <div key={i} style={{
              width: '100%', padding: '12px 20px',
              background: 'rgba(0,229,255,0.05)',
              borderRadius: 10,
              fontSize: 26, color: '#6090A0',
              display: 'flex', alignItems: 'center', gap: 12,
              opacity: interpolate(frame, [20 + i*10, 40 + i*10], [0, 1], { extrapolateRight: 'clamp' }),
            }}>
              <span style={{ color: COLORS.electric_cyan }}>›</span> {prop}
            </div>
          ))}
        </div>

        {/* "≠" divider */}
        <div style={{
          position: 'absolute', top: 620, left: 0, right: 0,
          display: 'flex', justifyContent: 'center',
          opacity: slashEnter,
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: COLORS.vibrant_red,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 48, fontWeight: 900, color: 'white',
            boxShadow: '0 0 30px rgba(239,68,68,0.5)',
            zIndex: 10,
          }}>
            ≠
          </div>
        </div>

        {/* Key insight */}
        <div style={{
          position: 'absolute', top: 1060, left: 80, right: 80,
          opacity: interpolate(frame, [50, 80], [0, 1], { extrapolateRight: 'clamp' }),
          background: 'rgba(239,68,68,0.07)',
          border: '2px solid rgba(239,68,68,0.3)',
          borderRadius: 18, padding: '28px 36px',
        }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#EF4444', marginBottom: 12 }}>
            The Confusion
          </div>
          <div style={{ fontSize: 28, color: COLORS.light_gray, lineHeight: 1.6 }}>
            Most people use these words interchangeably.
            <span style={{ color: COLORS.vibrant_red, fontWeight: 700 }}> They are not</span>.
            The difference is architectural.
          </div>
        </div>

        <CaptionBar
          text="Now, a model and an agent are not the same thing."
          opacity={enter} y={1730}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
