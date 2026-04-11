/**
 * Scene 11 — Give It a Prompt, Transaction Over
 * "You give it a prompt. Transaction is over."
 * Hero: Receipt-style animation — prompt sent, transaction printed, DONE stamp.
 * Duration: 135 frames (4.5s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground, CaptionBar, GlobalDefs, CornerBrackets } from '../helpers/components';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const Scene11_PromptDone: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const receiptUnroll = interpolate(frame, [20, 90], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const stampEnter = interpolate(frame, [85, 110], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const stampRotate = interpolate(frame, [85, 100], [-20, -6], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      <PaperBackground>
        <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
          <GlobalDefs/>
          <CornerBrackets opacity={0.25}/>
        </svg>

        {/* Title */}
        <div style={{
          position: 'absolute', top: 100, left: 80, right: 80,
          textAlign: 'center', opacity: enter,
        }}>
          <div style={{
            fontSize: 66, fontWeight: 900, color: COLORS.deep_black,
            fontFamily: '"Inter", sans-serif', letterSpacing: '-0.03em',
          }}>
            Transaction
            <span style={{ color: COLORS.warm_blue }}> Complete</span>
          </div>
          <div style={{ fontSize: 30, color: COLORS.light_gray, marginTop: 10 }}>
            Input → Output. Nothing more.
          </div>
        </div>

        {/* Transaction receipt */}
        <div style={{
          position: 'absolute', top: 300, left: 140, right: 140,
          background: '#FFFEF0',
          borderRadius: 8,
          boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
          padding: '36px 40px',
          opacity: enter,
          height: receiptUnroll * 860,
          overflow: 'hidden',
          border: '1px solid #D0C8A0',
        }}>
          {/* Serrated top */}
          <div style={{
            height: 24, margin: '-36px -40px 24px',
            background: 'repeating-linear-gradient(90deg, #FFFEF0 0px, #FFFEF0 18px, #F5F0E8 18px, #F5F0E8 20px)',
          }}/>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 22, letterSpacing: '0.12em', color: '#8080A0', marginBottom: 4 }}>
              TRANSACTION RECEIPT
            </div>
            <div style={{ fontSize: 18, color: '#A0A0C0' }}>Model: gpt-4 · Session #23-001</div>
          </div>
          {/* Divider */}
          <div style={{ borderTop: '2px dashed #D0C8A0', margin: '16px 0' }}/>
          {/* Prompt line */}
          {receiptUnroll > 0.2 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 20, color: '#A0A8B0', letterSpacing: '0.08em' }}>PROMPT RECEIVED:</div>
              <div style={{
                marginTop: 8, padding: '14px 16px',
                background: '#F0EDE0',
                borderRadius: 6,
                fontFamily: '"Courier New", monospace',
                fontSize: 26, color: '#404050',
              }}>
                "What is the capital of France?"
              </div>
            </div>
          )}
          {receiptUnroll > 0.45 && (
            <>
              <div style={{ borderTop: '2px dashed #D0C8A0', margin: '16px 0' }}/>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 20, color: '#A0A8B0', letterSpacing: '0.08em' }}>COMPLETION:</div>
                <div style={{
                  marginTop: 8, padding: '14px 16px',
                  background: '#E8F4E0',
                  borderRadius: 6,
                  fontFamily: '"Courier New", monospace',
                  fontSize: 26, color: '#204030',
                }}>
                  "Paris is the capital of France."
                </div>
              </div>
            </>
          )}
          {receiptUnroll > 0.7 && (
            <>
              <div style={{ borderTop: '2px dashed #D0C8A0', margin: '16px 0' }}/>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, color: '#808090' }}>
                <span>Tokens used:</span><span>44</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, color: '#808090', marginTop: 8 }}>
                <span>Context retained:</span>
                <span style={{ color: '#EF4444', fontWeight: 700 }}>NONE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, color: '#808090', marginTop: 8 }}>
                <span>Loop iterations:</span>
                <span style={{ color: '#EF4444', fontWeight: 700 }}>0</span>
              </div>
              <div style={{ borderTop: '2px dashed #D0C8A0', margin: '16px 0' }}/>
              <div style={{
                textAlign: 'center', fontSize: 26, fontWeight: 800,
                color: '#404050', letterSpacing: '0.1em',
              }}>
                TRANSACTION CLOSED
              </div>
            </>
          )}
        </div>

        {/* DONE stamp */}
        {stampEnter > 0 && (
          <div style={{
            position: 'absolute', top: 680, right: 120,
            width: 200, height: 200,
            border: '8px solid #EF4444',
            borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: stampEnter * 0.9,
            transform: `rotate(${stampRotate}deg) scale(${interpolate(frame, [85, 100], [1.4, 1], { extrapolateRight: 'clamp' })})`,
            zIndex: 10,
          }}>
            <div style={{
              fontSize: 56, fontWeight: 900, color: '#EF4444',
              letterSpacing: '-0.02em',
            }}>DONE</div>
          </div>
        )}

        {/* Key point */}
        <div style={{
          position: 'absolute', top: 1200, left: 80, right: 80,
          opacity: interpolate(frame, [90, 125], [0, 1], { extrapolateRight: 'clamp' }),
          background: 'rgba(59,130,246,0.07)',
          border: '2px solid rgba(59,130,246,0.2)',
          borderRadius: 16, padding: '24px 36px',
        }}>
          <div style={{ fontSize: 30, color: COLORS.light_gray, lineHeight: 1.6 }}>
            The model doesn't watch what happens next.
            It doesn't adjust. It doesn't revisit.
            <span style={{ color: COLORS.warm_blue, fontWeight: 700 }}> The transaction is over.</span>
          </div>
        </div>

        {/* Model vs Agent contrast */}
        <div style={{
          position: 'absolute', top: 1440, left: 80, right: 80,
          display: 'flex', gap: 14,
          opacity: interpolate(frame, [108, 132], [0, 1], { extrapolateRight: 'clamp' }),
        }}>
          <div style={{
            flex: 1, background: 'rgba(239,68,68,0.06)',
            border: '1.5px solid rgba(239,68,68,0.2)', borderRadius: 14,
            padding: '18px 22px',
          }}>
            <div style={{ fontSize: 20, color: '#EF4444', fontWeight: 800, marginBottom: 8 }}>MODEL</div>
            {['1 prompt → 1 response', 'No loop', 'No memory'].map((t, i) => (
              <div key={i} style={{ fontSize: 22, color: '#906060', marginBottom: 4 }}>· {t}</div>
            ))}
          </div>
          <div style={{
            flex: 1, background: 'rgba(0,229,255,0.06)',
            border: '1.5px solid rgba(0,229,255,0.2)', borderRadius: 14,
            padding: '18px 22px',
          }}>
            <div style={{ fontSize: 20, color: COLORS.electric_cyan, fontWeight: 800, marginBottom: 8 }}>AGENT</div>
            {['Loops continuously', 'Observes results', 'Adapts approach'].map((t, i) => (
              <div key={i} style={{ fontSize: 22, color: '#408088', marginBottom: 4 }}>· {t}</div>
            ))}
          </div>
        </div>

        <CaptionBar text="You give it a prompt. Transaction is over." opacity={enter} y={1730}/>
      </PaperBackground>
    </AbsoluteFill>
  );
};
