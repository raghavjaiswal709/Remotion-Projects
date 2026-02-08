'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Code2,
  FileCode,
  Layers,
  BarChart3,
  ListOrdered,
  Type,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Zap,
  Target,
  Eye,
  Hash,
  Plus,
  Minus,
  ArrowDown,
  Activity,
  GitBranch,
  Sparkles,
  Database,
  Clock,
  TrendingUp,
  Box,
  Grid3x3,
  Cpu,
  Settings,
  Filter,
  Shuffle,
  HelpCircle,
  Code,
  CheckCircle,
  Lightbulb,
  AlertTriangle,
  Calculator,
  X,
  RotateCw,
  Trash2,
  List,
  Trophy
} from 'lucide-react';

// Props interface for external control
interface GFGCodeVisualizationProps {
  externalTime?: number;
  externalPlaying?: boolean;
  orientation?: 'portrait' | 'landscape';
  embedded?: boolean;
  frames?: FrameData[];
}

interface FrameData {
  id: string;
  name: string;
  startTime: number;
  endTime: number;
  content: {
    type: 'scene' | 'text' | 'shape' | 'code' | 'image' | 'jsx';
    data: Record<string, any>;
  };
  color: string;
  jsxCode?: string;
}

const GFGCodeVisualization = ({
  externalTime,
  externalPlaying,
  orientation = 'portrait',
  embedded = false,
  frames = []
}: GFGCodeVisualizationProps) => {
  const [internalPlaying, setInternalPlaying] = useState(false);
  const [internalTime, setInternalTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const requestRef = useRef<number | null>(null);
  const codeContainerRef = useRef<HTMLDivElement | null>(null);

  // Use external time/playing if provided (embedded mode), otherwise use internal state
  const isPlaying = embedded ? (externalPlaying ?? false) : internalPlaying;
  const time = embedded ? (externalTime ?? 0) : internalTime;

  const syncTimeline = () => {
    if (audioRef.current && !embedded) {
      setInternalTime(audioRef.current.currentTime);
    }
    requestRef.current = requestAnimationFrame(syncTimeline);
  };

  useEffect(() => {
    if (!embedded) {
      requestRef.current = requestAnimationFrame(syncTimeline);
      return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
      };
    }
  }, [embedded]);

  const togglePlayback = () => {
    if (embedded || !audioRef.current) return;
    if (internalPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setInternalPlaying(!internalPlaying);
  };

  const resetTimeline = () => {
    if (embedded || !audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.pause();
    setInternalPlaying(false);
    setInternalTime(0);
  };

  // Check if we're in landscape mode
  const isLandscape = orientation === 'landscape';

  // Get current frame from dynamic frames data
  const getCurrentFrame = () => {
    if (frames.length === 0) {
      // Fallback to original time-based logic if no frames provided
      return getOriginalCurrentFrame();
    }
    return frames.find(frame => time >= frame.startTime && time < frame.endTime);
  };

  // Original time-based frame detection for fallback
  const getOriginalCurrentFrame = () => {
    if (time >= 0 && time < 7.605) return { id: '1', name: 'Introduction', startTime: 0, endTime: 7.605, content: { type: 'scene', data: { scene: 'intro' } }, color: '#22c55e' };
    if (time >= 7.605 && time < 12.849) return { id: '2', name: 'Classic Challenge', startTime: 7.605, endTime: 12.849, content: { type: 'scene', data: { scene: 'challenge' } }, color: '#06b6d4' };
    if (time >= 12.849 && time < 20.651) return { id: '3', name: 'Efficient Strategy', startTime: 12.849, endTime: 20.651, content: { type: 'scene', data: { scene: 'strategy' } }, color: '#eab308' };
    if (time >= 20.651 && time < 24.125) return { id: '4', name: 'Problem Understanding', startTime: 20.651, endTime: 24.125, content: { type: 'scene', data: { scene: 'understand' } }, color: '#a855f7' };
    if (time >= 24.125 && time < 28.517) return { id: '5', name: 'Live Stream', startTime: 24.125, endTime: 28.517, content: { type: 'scene', data: { scene: 'stream' } }, color: '#3b82f6' };
    if (time >= 28.517 && time < 37.302) return { id: '6', name: 'The Question', startTime: 28.517, endTime: 37.302, content: { type: 'scene', data: { scene: 'question' } }, color: '#f97316' };
    if (time >= 37.302 && time < 44.972) return { id: '7', name: 'Pound Sign', startTime: 37.302, endTime: 44.972, content: { type: 'scene', data: { scene: 'pound' } }, color: '#eab308' };
    if (time >= 44.972 && time < 51.790) return { id: '8', name: 'Instantly', startTime: 44.972, endTime: 51.790, content: { type: 'scene', data: { scene: 'instant' } }, color: '#ef4444' };
    if (time >= 51.790 && time < 59.919) return { id: '9', name: 'Way Too Slow', startTime: 51.790, endTime: 59.919, content: { type: 'scene', data: { scene: 'slow' } }, color: '#ef4444' };
    if (time >= 59.919 && time < 66.082) return { id: '10', name: 'O(n²)', startTime: 59.919, endTime: 66.082, content: { type: 'scene', data: { scene: 'on2' } }, color: '#f97316' };
    if (time >= 66.082 && time < 71.982) return { id: '11', name: 'Two Tools', startTime: 66.082, endTime: 71.982, content: { type: 'scene', data: { scene: 'tools' } }, color: '#22c55e' };
    if (time >= 71.982 && time < 79.128) return { id: '12', name: 'Frequency Array', startTime: 71.982, endTime: 79.128, content: { type: 'scene', data: { scene: 'freq' } }, color: '#06b6d4' };
    if (time >= 79.128 && time < 84.831) return { id: '13', name: 'Queue Waiting Line', startTime: 79.128, endTime: 84.831, content: { type: 'scene', data: { scene: 'queue' } }, color: '#a855f7' };
    if (time >= 84.831 && time < 90.076) return { id: '14', name: 'Code Walkthrough', startTime: 84.831, endTime: 90.076, content: { type: 'scene', data: { scene: 'code_start' } }, color: '#22c55e' };
    if (time >= 90.076 && time < 98.664) return { id: '15', name: 'int[] freq = new int[26]', startTime: 90.076, endTime: 98.664, content: { type: 'code', data: { line: 3 } }, color: '#06b6d4' };
    if (time >= 98.664 && time < 104.039) return { id: '16', name: 'Queue<Character> q', startTime: 98.664, endTime: 104.039, content: { type: 'code', data: { line: 6 } }, color: '#a855f7' };
    if (time >= 104.039 && time < 111.054) return { id: '17', name: 'StringBuilder ans', startTime: 104.039, endTime: 111.054, content: { type: 'code', data: { line: 9 } }, color: '#22c55e' };
    if (time >= 111.054 && time < 116.364) return { id: '18', name: 'for loop', startTime: 111.054, endTime: 116.364, content: { type: 'scene', data: { line: 12 } }, color: '#eab308' };
    if (time >= 116.364 && time < 121.215) return { id: '19', name: 'char ch', startTime: 116.364, endTime: 121.215, content: { type: 'code', data: { line: 13 } }, color: '#3b82f6' };
    if (time >= 121.215 && time < 143.243) return { id: '20', name: "freq[ch - 'a']++", startTime: 121.215, endTime: 143.243, content: { type: 'code', data: { line: 16 } }, color: '#06b6d4' };
    if (time >= 143.243 && time < 161.533) return { id: '21', name: 'q.offer(ch)', startTime: 143.243, endTime: 161.533, content: { type: 'code', data: { line: 19 } }, color: '#a855f7' };
    if (time >= 161.533 && time < 182.577) return { id: '22', name: 'while (!q.isEmpty()...)', startTime: 161.533, endTime: 182.577, content: { type: 'code', data: { line: 23 } }, color: '#f97316' };
    if (time >= 182.577 && time < 195.557) return { id: '23', name: 'q.poll()', startTime: 182.577, endTime: 195.557, content: { type: 'code', data: { line: 25 } }, color: '#ef4444' };
    if (time >= 195.557 && time < 208.210) return { id: '24', name: 'While Loop Ensures', startTime: 195.557, endTime: 208.210, content: { type: 'scene', data: { scene: 'while_explain' } }, color: '#eab308' };
    if (time >= 208.210 && time < 220.141) return { id: '25', name: 'if (q.isEmpty())', startTime: 208.210, endTime: 220.141, content: { type: 'code', data: { line: 29 } }, color: '#3b82f6' };
    if (time >= 220.141 && time < 223.485) return { id: '26', name: "ans.append('#')", startTime: 220.141, endTime: 223.485, content: { type: 'code', data: { line: 31 } }, color: '#eab308' };
    if (time >= 223.485 && time < 232.204) return { id: '27', name: 'ans.append(q.peek())', startTime: 223.485, endTime: 232.204, content: { type: 'code', data: { line: 34 } }, color: '#22c55e' };
    if (time >= 232.204 && time < 240.726) return { id: '28', name: 'return ans.toString()', startTime: 232.204, endTime: 240.726, content: { type: 'code', data: { line: 39 } }, color: '#a855f7' };
    if (time >= 240.726 && time < 260.000) return { id: '29', name: 'Time Complexity O(n)', startTime: 240.726, endTime: 260.000, content: { type: 'scene', data: { scene: 'complexity' } }, color: '#22c55e' };
    return null;
  };

  const currentFrame = getCurrentFrame();

  // Render scene content based on scene type
  const renderSceneContent = (frame: any) => {
    const sceneType = frame.content.data.scene;

    switch (sceneType) {
      case 'intro':
        return renderIntroScene(frame);
      case 'challenge':
        return renderChallengeScene(frame);
      case 'strategy':
        return renderStrategyScene(frame);
      case 'understand':
        return renderUnderstandScene(frame);
      case 'stream':
        return renderStreamScene(frame);
      case 'question':
        return renderQuestionScene(frame);
      case 'pound':
        return renderPoundScene(frame);
      case 'instant':
        return renderInstantScene(frame);
      case 'slow':
        return renderSlowScene(frame);
      case 'on2':
        return renderOn2Scene(frame);
      case 'tools':
        return renderToolsScene(frame);
      case 'freq':
        return renderFreqScene(frame);
      case 'queue':
        return renderQueueScene(frame);
      case 'code_start':
        return renderCodeStartScene(frame);
      case 'while_explain':
        return renderWhileExplainScene(frame);
      case 'complexity':
        return renderComplexityScene(frame);
      default:
        return renderDefaultScene(frame);
    }
  };

  // Render code content - NOW VISUALIZES THE STATE
  const renderCodeContent = (frame: any) => {
    return renderLiveExecution(frame);
  };

  // Render custom JSX content
  const renderJSXContent = (frame: any) => {
    // If frame has custom JSX code, render it as a React component
    if (frame.jsxCode) {
      try {
        // For stack visualization - detect and render stack frames
        if (frame.jsxCode.includes('Call Stack') || frame.jsxCode.includes('factorial')) {
          // Extract stack data from the code or use default
          const stackFrames = [
            { fn: 'factorial(1)', vars: 'n=1, acc=6', active: false },
            { fn: 'factorial(2)', vars: 'n=2, acc=3', active: false },
            { fn: 'factorial(3)', vars: 'n=3, acc=1', active: true },
            { fn: 'main()', vars: 'n=3', active: false }
          ];
          
          return (
            <div className="flex items-center justify-center h-full bg-zinc-950 p-8">
              <div className="w-96 space-y-4">
                <div className="text-center text-sm uppercase tracking-wider text-zinc-500 mb-6">
                  Call Stack
                </div>
                <div className="space-y-3">
                  {stackFrames.reverse().map((stackFrame, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`border-2 rounded-xl p-4 transition-all ${
                        stackFrame.active
                          ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                          : 'border-zinc-700 bg-zinc-900/50'
                      }`}
                    >
                      <div className="font-mono text-lg font-semibold text-white mb-2">
                        {stackFrame.fn}
                      </div>
                      <div className="text-sm text-zinc-400 font-mono">
                        {stackFrame.vars}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          );
        }
        
        // For other custom JSX, show a preview/placeholder
        return (
          <div className="w-full h-full flex items-center justify-center p-8">
            <div className="text-center space-y-4 max-w-2xl">
              <div className="text-2xl font-bold text-white mb-4">
                Custom JSX Frame
              </div>
              <div className="text-sm text-zinc-400 mb-6">
                Custom JSX rendering is active
              </div>
              <div className="text-xs text-zinc-500 font-mono bg-zinc-900/50 p-6 rounded-lg border border-zinc-800 overflow-auto max-h-96 text-left">
                <pre className="whitespace-pre-wrap">{frame.jsxCode}</pre>
              </div>
            </div>
          </div>
        );
      } catch (e) {
        console.error('Error rendering custom JSX:', e);
        return (
          <div className="w-full h-full flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <div className="text-lg text-red-400">
                Error Rendering JSX
              </div>
              <div className="text-sm text-zinc-500 font-mono bg-zinc-900/50 p-4 rounded-lg border border-red-800/50 max-w-2xl overflow-auto">
                <pre className="text-left text-xs whitespace-pre-wrap">{String(e)}</pre>
              </div>
            </div>
          </div>
        );
      }
    }
    return renderDefaultScene(frame);
  };

  const renderLiveExecution = (frame: any) => (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
      {/* Active State Visualization */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
        {/* Frequency Array State */}
        <div className="bg-zinc-900 border-2 border-green-500/50 rounded-xl p-4 flex flex-col items-center">
          <h3 className="text-green-400 font-bold mb-2 text-sm uppercase tracking-wider">Frequency Map</h3>
          <div className="grid grid-cols-5 gap-1">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="w-6 h-6 bg-zinc-800 rounded flex items-center justify-center text-[10px] text-zinc-400">
                {String.fromCharCode(97 + i)}
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-zinc-500">...</div>
        </div>

        {/* Queue State */}
        <div className="bg-zinc-900 border-2 border-purple-500/50 rounded-xl p-4 flex flex-col items-center">
          <h3 className="text-purple-400 font-bold mb-2 text-sm uppercase tracking-wider">Queue</h3>
          <div className="flex items-center gap-1 overflow-hidden h-8">
            {['a', 'b', 'b', 'c'].map((c, i) => (
              <div key={i} className="w-8 h-8 rounded-lg border border-purple-500 bg-purple-500/20 flex items-center justify-center text-purple-300 font-bold">
                {c}
              </div>
            ))}
          </div>
          <p className="mt-2 text-[10px] text-zinc-400">FIFO Order</p>
        </div>
      </div>

      {/* Current Operation Highlight */}
      <div className="bg-zinc-800 rounded-xl p-4 border-l-4 border-yellow-400 w-full max-w-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Current Step</p>
            <h2 className="text-xl font-bold text-white">{frame.name}</h2>
          </div>
          {frame.content.data.line && (
            <div className="bg-yellow-500 text-black font-bold px-2 py-1 rounded text-xs">
              Line {frame.content.data.line}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Scene rendering functions
  const renderIntroScene = (frame: any) => (
    <>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="relative"
      >
        <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl" />
        <div className="relative w-28 h-28 mx-auto bg-green-900/50 border border-green-500/30 rounded-3xl flex items-center justify-center">
          <Code2 className="w-14 h-14 text-green-400" strokeWidth={2} />
        </div>
      </motion.div>
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="space-y-3"
      >
        <h1 className="text-4xl font-black">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
            {frame.name}
          </span>
        </h1>
        <p className="text-zinc-400 text-lg leading-relaxed">
          Welcome to GFG Code Visualization
        </p>
      </motion.div>
    </>
  );

  const renderDefaultScene = (frame: any) => (
    <>
      <div
        className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: frame.color + '30', borderColor: frame.color, borderWidth: 2 }}
      >
        <Code2 className="w-10 h-10" style={{ color: frame.color }} />
      </div>
      <h2 className="text-2xl font-bold" style={{ color: frame.color }}>
        {frame.name}
      </h2>
      <p className="text-sm text-zinc-400">
        {frame.startTime.toFixed(1)}s - {frame.endTime.toFixed(1)}s
      </p>
    </>
  );

  // Scene rendering functions with EXTREME DEPTH and detail
  const renderChallengeScene = (frame: any) => (
    <div className="w-full space-y-6">
      {/* Animated header with particles */}
      <div className="relative">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 blur-2xl opacity-30"
        >
          <div className="w-32 h-32 mx-auto bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full" />
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative"
        >
          <div className="w-32 h-32 mx-auto rounded-3xl bg-purple-900/30 border-2 border-purple-500/30 backdrop-blur-sm flex items-center justify-center overflow-hidden">
            <AlertCircle className="w-16 h-16 text-purple-300 relative z-10" strokeWidth={1.5} />
          </div>
        </motion.div>
      </div>

      {/* Title with animated gradient */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <h2 className="text-3xl font-black uppercase">
          <motion.span
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-[length:200%_auto]"
          >
            Classic Challenge
          </motion.span>
        </h2>

        {/* Detailed description cards */}
        <div className="grid grid-cols-1 gap-3">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 backdrop-blur-sm"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Target className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-purple-300 mb-1">Real-World Applications</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Used in text editors, chat applications, and data stream processing where finding unique elements is critical
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-pink-500/10 border border-pink-500/30 rounded-xl p-4 backdrop-blur-sm"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-pink-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-pink-300 mb-1">Difficulty Level</h3>
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4].map((level) => (
                    <motion.div
                      key={level}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 + level * 0.1 }}
                      className={`w-6 h-2 rounded-full ${level <= 3 ? 'bg-pink-400' : 'bg-zinc-700'}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-zinc-400">Medium - Requires understanding of data structures</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 backdrop-blur-sm"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Database className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-purple-300 mb-1">Key Concepts</h3>
                <div className="flex flex-wrap gap-1 mt-2">
                  {['Hash Maps', 'Queues', 'Streaming', 'O(n)'].map((concept, i) => (
                    <motion.span
                      key={concept}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1 + i * 0.1 }}
                      className="px-2 py-1 bg-purple-500/20 rounded text-[10px] font-bold text-purple-300"
                    >
                      {concept}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Animated bottom accent */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full"
      />
    </div>
  );

  const renderStrategyScene = (frame: any) => (
    <div className="w-full space-y-6">
      {/* 3D-like animated icon */}
      <div className="relative perspective-1000">
        <motion.div
          animate={{
            rotateY: [0, 360],
            rotateX: [0, 10, 0, -10, 0]
          }}
          transition={{
            rotateY: { duration: 4, repeat: Infinity, ease: "linear" },
            rotateX: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          className="relative"
        >
          <div className="w-36 h-36 mx-auto rounded-2xl bg-gradient-to-br from-yellow-500/30 via-orange-500/30 to-yellow-500/30 border-2 border-yellow-500/50 backdrop-blur-sm flex items-center justify-center overflow-hidden shadow-2xl">
            {/* Animated lightning bolts in background */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.5, 0.5],
                  x: [0, Math.random() * 40 - 20, 0],
                  y: [0, Math.random() * 40 - 20, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Zap className="w-12 h-12 text-yellow-400/30" strokeWidth={3} />
              </motion.div>
            ))}

            {/* Main icon */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              <Zap className="w-20 h-20 text-yellow-300" strokeWidth={2} />
            </motion.div>
          </div>
        </motion.div>

        {/* Orbiting particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0"
            style={{
              transformOrigin: 'center'
            }}
          >
            <div
              className="absolute top-0 left-1/2 w-2 h-2 bg-yellow-400 rounded-full blur-sm"
              style={{
                transform: `translate(-50%, ${-70 - i * 5}px)`
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Animated title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="space-y-4"
      >
        <h2 className="text-4xl font-black uppercase leading-tight">
          <motion.span
            animate={{
              textShadow: [
                '0 0 20px rgba(250,204,21,0)',
                '0 0 20px rgba(250,204,21,0.5)',
                '0 0 20px rgba(250,204,21,0)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300"
          >
            Efficient Strategy
          </motion.span>
        </h2>

        {/* Strategy breakdown */}
        <div className="space-y-3">
          {/* Problem Statement */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-yellow-500/10 border-l-4 border-yellow-500 rounded-r-xl p-4 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-yellow-500/30 flex items-center justify-center">
                <span className="text-yellow-300 text-xs font-bold">1</span>
              </div>
              <h3 className="text-sm font-bold text-yellow-300">The Challenge</h3>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed pl-8">
              Process characters one-by-one from a stream and instantly identify the first non-repeating character at each step
            </p>
          </motion.div>

          {/* Naive Approach */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-red-500/10 border-l-4 border-red-500 rounded-r-xl p-4 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-red-500/30 flex items-center justify-center">
                <XCircle className="w-3 h-3 text-red-400" />
              </div>
              <h3 className="text-sm font-bold text-red-300">Naive: O(n²)</h3>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed pl-8 mb-2">
              Scan entire string for each character - TOO SLOW!
            </p>
            <div className="pl-8 space-y-1">
              <div className="flex items-center gap-2 text-[10px]">
                <Clock className="w-3 h-3 text-red-400" />
                <span className="text-red-300">Time: O(n²) - Unacceptable</span>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <TrendingUp className="w-3 h-3 text-red-400" />
                <span className="text-red-300">Space: O(1) but time kills it</span>
              </div>
            </div>
          </motion.div>

          {/* Optimal Approach */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="bg-green-500/10 border-l-4 border-green-500 rounded-r-xl p-4 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-green-500/30 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
              </div>
              <h3 className="text-sm font-bold text-green-300">Optimal: O(n)</h3>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed pl-8 mb-2">
              Use Frequency Array + Queue for instant lookup!
            </p>
            <div className="pl-8 space-y-1">
              <div className="flex items-center gap-2 text-[10px]">
                <Zap className="w-3 h-3 text-green-400" />
                <span className="text-green-300">Time: O(n) - Perfect!</span>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <Database className="w-3 h-3 text-green-400" />
                <span className="text-green-300">Space: O(26) = O(1) - Constant!</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Key insight */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.1, type: "spring", stiffness: 200 }}
          className="relative mt-4"
        >
          <motion.div
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(250,204,21,0)',
                '0 0 0 10px rgba(250,204,21,0)',
                '0 0 0 0 rgba(250,204,21,0)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-xl p-3 text-center"
          >
            <p className="text-xs font-bold text-yellow-300 mb-1">🎯 KEY INSIGHT</p>
            <p className="text-[10px] text-zinc-300">
              Two data structures working together: Frequency Array for O(1) lookups + Queue for order maintenance!
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );

  const renderUnderstandScene = (frame: any) => (
    <div className="w-full space-y-5">
      {/* Animated eye with scanning effect */}
      <div className="relative">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-40 h-40 bg-blue-500 rounded-full blur-3xl" />
        </motion.div>

        <div className="relative">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-32 h-32 mx-auto rounded-3xl bg-blue-900/30 border-2 border-blue-500/30 flex items-center justify-center backdrop-blur-sm overflow-hidden"
          >
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0.2, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Eye className="w-24 h-24 text-blue-400/30" strokeWidth={1} />
            </motion.div>

            <Eye className="w-16 h-16 text-blue-300 relative z-10" strokeWidth={1.5} />

            {/* Scanning line */}
            <motion.div
              animate={{ y: [-50, 50] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-full h-0.5 bg-blue-400 blur-sm"
            />
          </motion.div>
        </div>
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-3xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
          Problem Analysis
        </h2>
      </motion.div>

      {/* Problem breakdown */}
      <div className="space-y-3">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 space-y-3"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Type className="w-4 h-4 text-blue-400" />
            </div>
            <h3 className="text-sm font-bold text-blue-300">Input Format</h3>
          </div>
          <div className="pl-10 space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-blue-400 text-xs">•</span>
              <p className="text-xs text-zinc-300">A stream of lowercase English characters (a-z)</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400 text-xs">•</span>
              <p className="text-xs text-zinc-300">Characters arrive one at a time sequentially</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400 text-xs">•</span>
              <p className="text-xs text-zinc-300">Can contain duplicates</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 space-y-3"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <Target className="w-4 h-4 text-cyan-400" />
            </div>
            <h3 className="text-sm font-bold text-cyan-300">Output Required</h3>
          </div>
          <div className="pl-10 space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-cyan-400 text-xs">•</span>
              <p className="text-xs text-zinc-300">First non-repeating character at each step</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-cyan-400 text-xs">•</span>
              <p className="text-xs text-zinc-300">Return '#' if all characters have repeated</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-cyan-400 text-xs">•</span>
              <p className="text-xs text-zinc-300">Must update in real-time O(1) per query</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Grid3x3 className="w-4 h-4 text-blue-400" />
            </div>
            <h3 className="text-sm font-bold text-blue-300">Example Walkthrough</h3>
          </div>
          <div className="pl-10 space-y-2 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="text-blue-400">Input:</span>
              <div className="flex gap-1">
                {['a', 'a', 'b', 'c'].map((char, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.2 + i * 0.1 }}
                    className="w-6 h-6 bg-blue-500/20 border border-blue-500/40 rounded flex items-center justify-center text-blue-300"
                  >
                    {char}
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-cyan-400">Output:</span>
              <div className="flex gap-1">
                {['a', '#', 'b', 'b'].map((char, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.6 + i * 0.1 }}
                    className="w-6 h-6 bg-cyan-500/20 border border-cyan-500/40 rounded flex items-center justify-center text-cyan-300"
                  >
                    {char}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderStreamScene = (frame: any) => (
    <div className="w-full space-y-5">
      {/* Animated streaming visualization */}
      <div className="relative">
        {/* Pulsing background */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-48 h-48 bg-red-500 rounded-full blur-3xl" />
        </motion.div>

        {/* Main icon with activity */}
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="w-36 h-36 mx-auto rounded-full border-4 border-dashed border-red-500/30"
          />

          <motion.div
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-red-500/30 to-orange-500/30 border-2 border-red-500/50 flex items-center justify-center backdrop-blur-sm overflow-hidden">
              {/* Flowing data stream effect */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    x: [-100, 100],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "linear"
                  }}
                  className="absolute w-2 h-0.5 bg-red-400"
                  style={{ top: `${20 + i * 10}%` }}
                />
              ))}

              <Activity className="w-14 h-14 text-red-300 relative z-10" strokeWidth={2} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-4xl font-black uppercase">
          <motion.span
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-red-400 bg-[length:200%_auto]"
          >
            Live Data Stream
          </motion.span>
        </h2>
      </motion.div>

      {/* Stream characteristics */}
      <div className="space-y-3">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-red-500/10 border border-red-500/30 rounded-xl p-4"
        >
          <div className="flex items-center gap-3 mb-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center"
            >
              <ArrowRight className="w-5 h-5 text-red-400" />
            </motion.div>
            <h3 className="text-sm font-bold text-red-300">Real-Time Processing</h3>
          </div>
          <div className="space-y-2 pl-13">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-zinc-300">Data arrives continuously, one character at a time</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-orange-400" />
              <span className="text-zinc-300">Cannot look ahead or store entire stream</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-zinc-300">Must process and answer immediately</span>
            </div>
          </div>
        </motion.div>

        {/* Visual stream example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-zinc-900/50 border border-red-500/20 rounded-xl p-4"
        >
          <p className="text-xs text-zinc-400 mb-3">Stream Visualization:</p>
          <div className="flex items-center gap-2 justify-center">
            {['a', 'a', 'b', 'c'].map((char, i) => (
              <motion.div
                key={i}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                  delay: 1 + i * 0.5,
                  type: "spring",
                  stiffness: 200
                }}
                className="relative"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    boxShadow: [
                      '0 0 0 0 rgba(239,68,68,0)',
                      '0 0 0 8px rgba(239,68,68,0)',
                      '0 0 0 0 rgba(239,68,68,0)'
                    ]
                  }}
                  transition={{
                    delay: 1 + i * 0.5,
                    duration: 1
                  }}
                  className="w-10 h-10 bg-red-500/20 border-2 border-red-500/50 rounded-lg flex items-center justify-center font-mono text-sm text-red-300"
                >
                  {char}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 + i * 0.5 }}
                  className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[10px] text-red-400"
                >
                  t={i + 1}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Key constraint */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 3.5, type: "spring", stiffness: 150 }}
          className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/50 rounded-xl p-3 text-center"
        >
          <motion.p
            animate={{
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-xs font-bold text-red-300"
          >
            ⚡ Must answer in O(1) time for each incoming character!
          </motion.p>
        </motion.div>
      </div>
    </div>
  );

  const renderQuestionScene = (frame: any) => (
    <div className="w-full space-y-4">
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: [0.8, 1.1, 1] }}
        transition={{ duration: 1.2, times: [0, 0.6, 1] }}
        className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-5"
      >
        <h2 className="text-2xl font-bold text-orange-300 mb-4">
          The Question
        </h2>
        <div className="space-y-2 text-left">
          <p className="text-sm text-zinc-300">
            Given a stream of characters, find the first non-repeating character.
          </p>
          <div className="bg-zinc-900/50 rounded-lg p-3 font-mono text-xs">
            <p className="text-green-400">Input: "aabc"</p>
            <p className="text-blue-400">Output: "a#bb"</p>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderPoundScene = (frame: any) => (
    <div className="w-full space-y-5">
      {/* 3D Rotating Pound Sign */}
      <div className="relative perspective-1000">
        {/* Orbital rings */}
        {[0, 60, 120].map((rotation, i) => (
          <motion.div
            key={i}
            animate={{ rotate: rotation + 360 }}
            transition={{ duration: 6 + i * 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 w-40 h-40 mx-auto"
          >
            <div
              className="w-full h-full border-2 border-dashed border-yellow-500/20 rounded-full"
              style={{ transform: `rotateX(${60 + i * 20}deg)` }}
            />
          </motion.div>
        ))}

        {/* Main pound sign with 3D effect */}
        <motion.div
          animate={{
            rotateY: [0, 360],
            scale: [1, 1.15, 1]
          }}
          transition={{
            rotateY: { duration: 8, repeat: Infinity, ease: "linear" },
            scale: { duration: 2.5, repeat: Infinity }
          }}
          className="relative z-10 w-32 h-32 mx-auto preserve-3d"
        >
          {/* Layered background */}
          {[0, 8, 16].map((offset, i) => (
            <motion.div
              key={i}
              animate={{
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3
              }}
              className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl border border-yellow-500/30 backdrop-blur-sm"
              style={{
                transform: `translateZ(${-offset}px)`,
                filter: `blur(${offset / 4}px)`
              }}
            />
          ))}

          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{
                textShadow: [
                  '0 0 20px rgba(234,179,8,0.5)',
                  '0 0 40px rgba(234,179,8,0.9)',
                  '0 0 20px rgba(234,179,8,0.5)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Hash className="w-20 h-20 text-yellow-300 relative z-20" strokeWidth={3} />
            </motion.div>
          </div>
        </motion.div>

        {/* Floating particles */}
        {[...Array(16)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: [0, Math.cos(i * 22.5 * Math.PI / 180) * 80],
              y: [0, Math.sin(i * 22.5 * Math.PI / 180) * 80],
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.15
            }}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full blur-sm"
            style={{
              left: '50%',
              top: '50%'
            }}
          />
        ))}
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-4xl font-black uppercase text-center">
          <motion.span
            animate={{
              backgroundPosition: ['0% 50%', '200% 50%', '0% 50%']
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 via-yellow-300 to-yellow-400 bg-[length:200%_auto]"
          >
            The # Symbol
          </motion.span>
        </h2>
      </motion.div>

      {/* Meaning explanation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 120 }}
        className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-xl p-5 space-y-4"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500/30 to-orange-500/30 flex items-center justify-center border-2 border-yellow-500/50"
          >
            <Hash className="w-6 h-6 text-yellow-300" strokeWidth={3} />
          </motion.div>
          <h3 className="text-lg font-bold text-yellow-300">Symbolic Meaning</h3>
        </div>

        <div className="space-y-3 pl-15">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-2"
          >
            <p className="text-sm font-bold text-yellow-300">When does # appear?</p>
            <div className="space-y-1.5">
              {[
                { condition: 'All characters have repeated', example: '"aa" → #' },
                { condition: 'No unique character exists', example: '"aabb" → #' },
                { condition: 'Stream processed, none unique', example: '"abab" → #' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.15 }}
                  className="bg-zinc-900/50 border border-yellow-500/20 rounded-lg p-3"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                    <span className="text-xs text-zinc-300">{item.condition}</span>
                  </div>
                  <code className="text-xs font-mono text-yellow-300 pl-3.5">
                    {item.example}
                  </code>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Visual example */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="bg-zinc-900/50 border border-yellow-500/30 rounded-xl p-4 space-y-3"
      >
        <p className="text-xs font-bold text-yellow-300 text-center">Live Example: "aabb"</p>
        <div className="space-y-2">
          {[
            { step: 1, char: 'a', result: 'a', reason: 'First char, unique' },
            { step: 2, char: 'a', result: '#', reason: 'a now repeats' },
            { step: 3, char: 'b', result: 'b', reason: 'b is unique' },
            { step: 4, char: 'b', result: '#', reason: 'All repeat now' }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.7 + i * 0.2 }}
              className="flex items-center gap-3 bg-yellow-500/5 rounded-lg p-2"
            >
              <div className="flex items-center gap-2 flex-1">
                <span className="text-[10px] text-zinc-500 w-10">Step {item.step}:</span>
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    boxShadow: [
                      '0 0 0 0 rgba(234,179,8,0)',
                      '0 0 10px 3px rgba(234,179,8,0.5)',
                      '0 0 0 0 rgba(234,179,8,0)'
                    ]
                  }}
                  transition={{
                    delay: 1.9 + i * 0.2,
                    duration: 1
                  }}
                  className="w-8 h-8 bg-yellow-500/20 border border-yellow-500/50 rounded flex items-center justify-center font-mono text-xs text-yellow-300"
                >
                  {item.char}
                </motion.div>
                <ArrowRight className="w-3 h-3 text-zinc-500" />
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1]
                  }}
                  transition={{
                    delay: 2.1 + i * 0.2,
                    duration: 0.8
                  }}
                  className={`w-8 h-8 ${item.result === '#'
                      ? 'bg-red-500/20 border-red-500/50'
                      : 'bg-green-500/20 border-green-500/50'
                    } border rounded flex items-center justify-center font-mono text-xs ${item.result === '#' ? 'text-red-300' : 'text-green-300'
                    }`}
                >
                  {item.result}
                </motion.div>
              </div>
              <span className="text-[10px] text-zinc-400 italic flex-1">{item.reason}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Key insight */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 3, type: "spring", stiffness: 150 }}
        className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 rounded-xl p-4 text-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="inline-flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 text-yellow-300" />
          <p className="text-xs font-bold text-yellow-300">
            # means: "No unique character found!"
          </p>
        </motion.div>
      </motion.div>
    </div>
  );

  const renderInstantScene = (frame: any) => (
    <div className="w-full space-y-5">
      {/* Lightning effect background */}
      <div className="relative">
        {/* Electric pulses */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: [0, 3],
              opacity: [0.5, 0],
              rotate: [0, 180]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3
            }}
            className="absolute inset-0 w-32 h-32 mx-auto border-2 border-red-500/30 rounded-full"
          />
        ))}

        {/* Main lightning icon with electric effect */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            boxShadow: [
              '0 0 0px rgba(239, 68, 68, 0)',
              '0 0 60px rgba(239, 68, 68, 0.8)',
              '0 0 0px rgba(239, 68, 68, 0)'
            ],
            filter: [
              'brightness(1) drop-shadow(0 0 0px rgba(239, 68, 68, 0))',
              'brightness(1.5) drop-shadow(0 0 20px rgba(239, 68, 68, 1))',
              'brightness(1) drop-shadow(0 0 0px rgba(239, 68, 68, 0))'
            ]
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="relative z-10 w-32 h-32 mx-auto bg-gradient-to-br from-red-500/30 to-orange-500/30 border-4 border-red-500/50 rounded-2xl flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <Zap className="w-16 h-16 text-red-300" strokeWidth={2.5} fill="currentColor" />
          </motion.div>

          {/* Electric sparks */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                x: Math.cos(i * 45 * Math.PI / 180) * 40,
                y: Math.sin(i * 45 * Math.PI / 180) * 40,
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.1
              }}
              className="absolute w-2 h-2 bg-red-400 rounded-full"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
      >
        <h2 className="text-4xl font-black uppercase text-center">
          <motion.span
            animate={{
              textShadow: [
                '0 0 20px rgba(239,68,68,0.5)',
                '0 0 40px rgba(239,68,68,1)',
                '0 0 20px rgba(239,68,68,0.5)'
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400"
          >
            Instant Response
          </motion.span>
        </h2>
      </motion.div>

      {/* O(1) Time complexity emphasis */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 120 }}
        className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-5 space-y-4"
      >
        <div className="flex items-center justify-center gap-3">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{
              rotate: { duration: 3, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity }
            }}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500/30 to-orange-500/30 border-2 border-red-500/50 flex items-center justify-center"
          >
            <Zap className="w-7 h-7 text-red-300" strokeWidth={2.5} />
          </motion.div>
          <motion.div
            animate={{
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-center"
          >
            <p className="text-4xl font-black text-red-300">O(1)</p>
            <p className="text-xs text-zinc-400">Constant Time</p>
          </motion.div>
        </div>

        <div className="space-y-3">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-sm text-zinc-300 text-center leading-relaxed"
          >
            Every query must be answered <span className="text-red-300 font-bold">instantly</span>, regardless of stream size
          </motion.p>

          {/* Visual comparison */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="bg-zinc-900/50 border border-red-500/20 rounded-lg p-4 space-y-3"
          >
            <p className="text-xs font-bold text-red-300 text-center">Speed Comparison</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <p className="text-[10px] text-zinc-500 text-center">Naive Approach</p>
                <motion.div
                  animate={{
                    width: ['0%', '100%']
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="h-2 bg-gradient-to-r from-orange-500/50 to-red-500/50 rounded"
                />
                <p className="text-[10px] text-red-400 text-center font-mono">O(n) - Slow!</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] text-zinc-500 text-center">Our Approach</p>
                <motion.div
                  animate={{
                    opacity: [0, 1],
                    scale: [0.8, 1]
                  }}
                  transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2.7 }}
                  className="h-2 bg-gradient-to-r from-green-500/50 to-emerald-500/50 rounded"
                  style={{ width: '100%' }}
                />
                <p className="text-[10px] text-green-400 text-center font-mono">O(1) - Fast!</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Why it matters */}
      <div className="space-y-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.3 }}
          className="bg-red-500/10 border border-red-500/30 rounded-lg p-3"
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-red-400" />
            <span className="text-xs font-bold text-red-300">Real-Time Constraint</span>
          </div>
          <p className="text-xs text-zinc-300 pl-6">
            Stream continues flowing - can't afford to wait. Must answer <span className="text-red-300 font-bold">immediately</span> after each character.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5 }}
          className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-bold text-orange-300">Scalability</span>
          </div>
          <p className="text-xs text-zinc-300 pl-6">
            With 10^5 characters, O(n) per query = 10^10 operations total. <span className="text-orange-300 font-bold">Unacceptable!</span>
          </p>
        </motion.div>
      </div>

      {/* Performance metric */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1.7, type: "spring", stiffness: 150 }}
        className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-2 border-red-500/50 rounded-xl p-4"
      >
        <div className="flex items-center justify-center gap-3">
          <Zap className="w-6 h-6 text-red-300" strokeWidth={2.5} fill="currentColor" />
          <motion.p
            animate={{
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-sm font-bold text-red-300"
          >
            Solution must achieve <span className="text-2xl">O(1)</span> query time
          </motion.p>
        </div>
      </motion.div>
    </div>
  );

  const renderSlowScene = (frame: any) => (
    <div className="w-full space-y-5">
      {/* Slow clock animation */}
      <div className="relative">
        {/* Warning pulses */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 2.5, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.7
            }}
            className="absolute inset-0 w-32 h-32 mx-auto border-2 border-red-500/20 rounded-full"
          />
        ))}

        <div className="relative z-10">
          <motion.div
            animate={{
              rotate: [0, -15, 15, -15, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-32 h-32 mx-auto bg-gradient-to-br from-red-500/30 to-orange-500/30 border-4 border-red-500/50 rounded-2xl flex items-center justify-center relative overflow-hidden"
          >
            {/* Slow motion effect lines */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  x: [-100, 100],
                  opacity: [0, 0.5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.4
                }}
                className="absolute w-full h-0.5 bg-red-400/50"
                style={{ top: `${20 + i * 15}%` }}
              />
            ))}

            <Clock className="w-16 h-16 text-red-300 relative z-10" strokeWidth={2.5} />
          </motion.div>

          {/* Warning icon */}
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 10, -10, 0],
              opacity: [1, 0.6, 1]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute -top-3 -right-3 bg-red-600 rounded-full p-2 border-2 border-red-400"
          >
            <XCircle className="w-6 h-6 text-white" strokeWidth={3} />
          </motion.div>
        </div>
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-4xl font-black uppercase text-center">
          <motion.span
            animate={{
              textShadow: [
                '0 0 20px rgba(239,68,68,0.5)',
                '0 0 40px rgba(239,68,68,1)',
                '0 0 20px rgba(239,68,68,0.5)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500"
          >
            Too Slow
          </motion.span>
        </h2>
        <motion.p
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center text-xs text-red-400 mt-1"
        >
          Brute Force = Time Limit Exceeded
        </motion.p>
      </motion.div>

      {/* Naive approach explanation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 120 }}
        className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-5 space-y-4"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              rotate: 360
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center border-2 border-red-500/40"
          >
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </motion.div>
          <h3 className="text-lg font-bold text-red-300">Naive Approach</h3>
        </div>

        <div className="space-y-3 pl-14">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-2"
          >
            <p className="text-sm text-zinc-300">For each query:</p>
            <div className="space-y-1.5">
              {[
                'Scan entire stream from beginning',
                'Count frequency of every character',
                'Find first with count = 1',
                'Repeat for EVERY character added'
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.15 }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.5, 1],
                      backgroundColor: ['rgba(239,68,68,0.5)', 'rgba(249,115,22,0.5)', 'rgba(239,68,68,0.5)']
                    }}
                    transition={{
                      delay: 0.9 + i * 0.15,
                      duration: 2,
                      repeat: Infinity
                    }}
                    className="w-2 h-2 rounded-full"
                  />
                  <span className="text-xs text-zinc-300">{step}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Time complexity visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="bg-zinc-900/50 border border-red-500/30 rounded-xl p-4 space-y-3"
      >
        <p className="text-xs font-bold text-red-300 text-center">Time Complexity Growth</p>

        {/* Visual bar chart */}
        <div className="space-y-2">
          {[
            { n: 100, time: 30, label: 'n=100' },
            { n: 1000, time: 60, label: 'n=1K' },
            { n: 10000, time: 90, label: 'n=10K' },
            { n: 100000, time: 100, label: 'n=100K', danger: true }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5 + i * 0.2 }}
              className="space-y-1"
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-zinc-500">{item.label}</span>
                <span className={item.danger ? 'text-red-400 font-bold' : 'text-zinc-400'}>
                  {item.danger ? 'TOO SLOW!' : 'Slow'}
                </span>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.time}%` }}
                transition={{ delay: 1.7 + i * 0.2, duration: 1 }}
                className={`h-3 ${item.danger
                    ? 'bg-gradient-to-r from-red-500 to-orange-500'
                    : 'bg-gradient-to-r from-orange-500/50 to-red-500/50'
                  } rounded relative overflow-hidden`}
              >
                {item.danger && (
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 w-1/3 bg-white/30"
                  />
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Mathematical breakdown */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2.5, type: "spring", stiffness: 120 }}
        className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 space-y-3"
      >
        <div className="flex items-center justify-center gap-2">
          <Calculator className="w-5 h-5 text-red-400" />
          <p className="text-xs font-bold text-red-300">The Math</p>
        </div>

        <div className="space-y-2">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-zinc-900/50 rounded-lg p-3 text-center"
          >
            <p className="text-xs text-zinc-400 mb-1">Per query cost:</p>
            <p className="text-2xl font-black text-red-300 font-mono">O(n)</p>
          </motion.div>

          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="bg-zinc-900/50 rounded-lg p-3 text-center"
          >
            <p className="text-xs text-zinc-400 mb-1">Total queries:</p>
            <p className="text-2xl font-black text-orange-300 font-mono">n</p>
          </motion.div>

          <div className="flex items-center justify-center gap-2 py-2">
            <div className="w-8 h-0.5 bg-red-400" />
            <X className="w-4 h-4 text-red-400" />
            <div className="w-8 h-0.5 bg-red-400" />
          </div>

          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              boxShadow: [
                '0 0 0 0 rgba(239,68,68,0)',
                '0 0 20px 5px rgba(239,68,68,0.6)',
                '0 0 0 0 rgba(239,68,68,0)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-2 border-red-500/50 rounded-lg p-3 text-center"
          >
            <p className="text-xs text-zinc-400 mb-1">Total time:</p>
            <p className="text-3xl font-black text-red-300 font-mono">O(n²)</p>
            <p className="text-[10px] text-red-400 mt-1">= 10^10 operations!</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Critical warning */}
      <motion.div
        initial={{ scale: 0, rotate: -5 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 3, type: "spring", stiffness: 150 }}
        className="bg-gradient-to-r from-red-600/30 to-orange-600/30 border-2 border-red-500/70 rounded-xl p-4 text-center"
      >
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-flex items-center gap-2"
        >
          <AlertCircle className="w-5 h-5 text-red-300" />
          <p className="text-sm font-bold text-red-300">
            Time Limit Exceeded - Need Better Solution!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );

  const renderOn2Scene = (frame: any) => (
    <div className="w-full space-y-5">
      {/* Nested squares visualization */}
      <div className="relative w-40 h-40 mx-auto">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            animate={{
              rotate: i % 2 ? 360 : -360,
              scale: [1, 1.05, 1]
            }}
            transition={{
              rotate: { duration: 4 + i, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, delay: i * 0.2 }
            }}
            className="absolute inset-0 border-2 border-orange-500/30 rounded-xl"
            style={{
              margin: `${i * 10}px`,
              boxShadow: `0 0 ${20 - i * 3}px rgba(249, 115, 22, ${0.4 - i * 0.05})`
            }}
          />
        ))}

        {/* Center content */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            boxShadow: [
              '0 0 20px rgba(249, 115, 22, 0.3)',
              '0 0 50px rgba(249, 115, 22, 0.8)',
              '0 0 20px rgba(249, 115, 22, 0.3)'
            ]
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute inset-0 m-auto w-24 h-24 bg-gradient-to-br from-orange-500/30 to-red-500/30 border-2 border-orange-500/50 rounded-2xl flex items-center justify-center"
        >
          <div className="text-center">
            <motion.p
              animate={{
                scale: [1, 1.2, 1],
                color: ['#fb923c', '#f97316', '#fb923c']
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-3xl font-black"
            >
              n²
            </motion.p>
          </div>
        </motion.div>

        {/* Danger particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: [0, Math.cos(i * 30 * Math.PI / 180) * 70],
              y: [0, Math.sin(i * 30 * Math.PI / 180) * 70],
              opacity: [0, 0.8, 0],
              scale: [0, 2, 0]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: i * 0.2
            }}
            className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-orange-400 rounded-full"
          />
        ))}
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-4xl font-black uppercase text-center">
          <motion.span
            animate={{
              textShadow: [
                '0 0 20px rgba(249,115,22,0.5)',
                '0 0 40px rgba(249,115,22,1)',
                '0 0 20px rgba(249,115,22,0.5)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400"
          >
            O(n²) Disaster
          </motion.span>
        </h2>
      </motion.div>

      {/* Nested loop visualization */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 120 }}
        className="bg-orange-500/10 border-2 border-orange-500/30 rounded-xl p-5 space-y-4"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center border-2 border-orange-500/40"
          >
            <RotateCw className="w-6 h-6 text-orange-400" />
          </motion.div>
          <h3 className="text-lg font-bold text-orange-300">Nested Loop Hell</h3>
        </div>

        <div className="bg-zinc-900/50 border border-orange-500/20 rounded-lg p-4 font-mono text-xs">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="space-y-1"
          >
            <p className="text-orange-300">for (int i = 0; i &lt; n; i++) {'{'}</p>
            <div className="pl-4 space-y-1">
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-red-300"
              >
                for (int j = 0; j &lt; n; j++) {'{'}
              </motion.p>
              <p className="pl-4 text-zinc-400">// Check every character</p>
              <p className="text-red-300">{'}'}</p>
            </div>
            <p className="text-orange-300">{'}'}</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <p className="text-xs text-orange-300 mb-2">Operations Growth:</p>
          <motion.p
            animate={{
              scale: [1, 1.2, 1],
              color: ['#fb923c', '#ef4444', '#fb923c']
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-3xl font-black"
          >
            n × n = n²
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Growth comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="bg-zinc-900/50 border border-orange-500/30 rounded-xl p-4 space-y-3"
      >
        <p className="text-xs font-bold text-orange-300 text-center">Exponential Growth Chart</p>
        <div className="space-y-2">
          {[
            { n: '10', ops: '100', width: 20 },
            { n: '100', ops: '10K', width: 40 },
            { n: '1K', ops: '1M', width: 70 },
            { n: '10K', ops: '100M', width: 90 },
            { n: '100K', ops: '10B', width: 100, danger: true }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5 + i * 0.15 }}
              className="space-y-1"
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-zinc-500">n={item.n}</span>
                <span className={item.danger ? 'text-red-400 font-bold' : 'text-orange-400'}>
                  {item.ops} ops
                </span>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.width}%` }}
                transition={{ delay: 1.7 + i * 0.15, duration: 0.8 }}
                className={`h-4 rounded relative overflow-hidden ${item.danger
                    ? 'bg-gradient-to-r from-red-500 to-orange-500'
                    : 'bg-gradient-to-r from-orange-500/60 to-red-500/60'
                  }`}
              >
                {item.danger && (
                  <motion.div
                    animate={{ x: ['-100%', '300%'] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 w-1/3 bg-white/40"
                  />
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Critical warning */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 2.5, type: "spring", stiffness: 150 }}
        className="bg-gradient-to-r from-red-500/30 to-orange-500/30 border-2 border-red-500/60 rounded-xl p-4 text-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 3, -3, 0]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-flex items-center gap-2"
        >
          <AlertTriangle className="w-5 h-5 text-red-300" />
          <p className="text-sm font-bold text-red-300">
            10 Billion Operations = UNACCEPTABLE!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );

  const renderToolsScene = (frame: any) => (
    <div className="w-full space-y-5">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-4xl font-black uppercase text-center">
          <motion.span
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-[length:200%_auto]"
          >
            The Power Duo
          </motion.span>
        </h2>
      </motion.div>

      {/* Two tools showcase */}
      <div className="grid grid-cols-2 gap-4">
        {/* Frequency Array Tool */}
        <motion.div
          initial={{ x: -80, opacity: 0, rotate: -10 }}
          animate={{ x: 0, opacity: 1, rotate: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.05 }}
          className="bg-blue-500/10 border-2 border-blue-500/30 rounded-xl p-4 space-y-3 relative overflow-hidden"
        >
          {/* Background animation */}
          <motion.div
            animate={{
              scale: [1, 2, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl"
          />

          <div className="relative z-10">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-20 h-20 mx-auto rounded-xl bg-gradient-to-br from-blue-500/30 to-cyan-500/30 border-2 border-blue-500/50 flex items-center justify-center mb-3"
            >
              <BarChart3 className="w-10 h-10 text-blue-300" strokeWidth={2.5} />
            </motion.div>

            <p className="text-sm font-bold text-blue-300 text-center mb-2">
              Frequency Array
            </p>

            <div className="space-y-2">
              <div className="bg-blue-500/10 rounded-lg p-2">
                <p className="text-[10px] text-blue-200 text-center font-mono">int[26]</p>
              </div>
              <div className="space-y-1 text-[10px] text-blue-300">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>Track counts</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>O(1) lookup</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>Fast updates</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Queue Tool */}
        <motion.div
          initial={{ x: 80, opacity: 0, rotate: 10 }}
          animate={{ x: 0, opacity: 1, rotate: 0 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.05 }}
          className="bg-purple-500/10 border-2 border-purple-500/30 rounded-xl p-4 space-y-3 relative overflow-hidden"
        >
          {/* Background animation */}
          <motion.div
            animate={{
              scale: [1, 2, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            className="absolute inset-0 bg-purple-500/20 rounded-full blur-2xl"
          />

          <div className="relative z-10">
            <motion.div
              animate={{
                rotate: [0, -10, 10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-20 h-20 mx-auto rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-2 border-purple-500/50 flex items-center justify-center mb-3"
            >
              <ListOrdered className="w-10 h-10 text-purple-300" strokeWidth={2.5} />
            </motion.div>

            <p className="text-sm font-bold text-purple-300 text-center mb-2">
              Queue (FIFO)
            </p>

            <div className="space-y-2">
              <div className="bg-purple-500/10 rounded-lg p-2">
                <p className="text-[10px] text-purple-200 text-center font-mono">LinkedList</p>
              </div>
              <div className="space-y-1 text-[10px] text-purple-300">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span>Keep order</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span>O(1) front access</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span>Fast add/remove</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Connection visualization */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        className="relative"
      >
        <div className="flex items-center justify-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-12 h-12 rounded-full bg-blue-500/20 border-2 border-blue-500/50 flex items-center justify-center"
          >
            <BarChart3 className="w-6 h-6 text-blue-400" />
          </motion.div>

          <motion.div
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Plus className="w-6 h-6 text-green-400" strokeWidth={3} />
          </motion.div>

          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="w-12 h-12 rounded-full bg-purple-500/20 border-2 border-purple-500/50 flex items-center justify-center"
          >
            <ListOrdered className="w-6 h-6 text-purple-400" />
          </motion.div>

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <ArrowRight className="w-6 h-6 text-green-400" strokeWidth={3} />
          </motion.div>

          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              boxShadow: [
                '0 0 0 0 rgba(34,197,94,0)',
                '0 0 20px 5px rgba(34,197,94,0.6)',
                '0 0 0 0 rgba(34,197,94,0)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500/30 to-emerald-500/30 border-2 border-green-500/50 flex items-center justify-center"
          >
            <Zap className="w-7 h-7 text-green-300" strokeWidth={2.5} />
          </motion.div>
        </div>
      </motion.div>

      {/* Combined power explanation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10 border-2 border-green-500/30 rounded-xl p-5 space-y-3"
      >
        <div className="flex items-center justify-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-6 h-6 text-green-400" />
          </motion.div>
          <h3 className="text-lg font-bold text-green-300">Combined Power</h3>
        </div>

        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5 }}
            className="bg-zinc-900/50 border border-green-500/20 rounded-lg p-3"
          >
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <p className="text-xs font-bold text-green-300">Frequency Array</p>
            </div>
            <p className="text-[10px] text-zinc-300 pl-6">Knows which characters repeated</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.7 }}
            className="bg-zinc-900/50 border border-green-500/20 rounded-lg p-3"
          >
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <p className="text-xs font-bold text-green-300">Queue</p>
            </div>
            <p className="text-[10px] text-zinc-300 pl-6">Maintains arrival order for O(1) first unique access</p>
          </motion.div>
        </div>

        <motion.div
          animate={{
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 2, repeat: Infinity, delay: 1.9 }}
          className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-lg p-3 text-center"
        >
          <p className="text-sm font-black text-green-300">
            Together = Perfect O(n) Solution! 🎯
          </p>
        </motion.div>
      </motion.div>
    </div>
  );

  const renderFreqScene = (frame: any) => (
    <div className="w-full space-y-5">
      {/* Animated chart icon */}
      <div className="relative">
        {/* Pulsing background */}
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-40 h-40 bg-green-500 rounded-full blur-3xl" />
        </motion.div>

        <motion.div
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="relative z-10 w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br from-green-500/30 to-emerald-500/30 border-2 border-green-500/50 flex items-center justify-center"
        >
          <BarChart3 className="w-16 h-16 text-green-300" strokeWidth={2.5} />

          {/* Animated bars inside */}
          <div className="absolute inset-0 flex items-end justify-center gap-1 p-4">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  height: [`${20 + i * 10}%`, `${60 + i * 8}%`, `${20 + i * 10}%`]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="w-2 bg-green-400/50 rounded-t"
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-4xl font-black uppercase text-center">
          <motion.span
            animate={{
              textShadow: [
                '0 0 20px rgba(34,197,94,0.5)',
                '0 0 40px rgba(34,197,94,0.9)',
                '0 0 20px rgba(34,197,94,0.5)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400"
          >
            Frequency Array
          </motion.span>
        </h2>
      </motion.div>

      {/* Array declaration */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 120 }}
        className="bg-green-500/10 border-2 border-green-500/30 rounded-xl p-5 space-y-4"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{
              rotate: { duration: 4, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity }
            }}
            className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center border-2 border-green-500/40"
          >
            <Code className="w-6 h-6 text-green-400" />
          </motion.div>
          <h3 className="text-lg font-bold text-green-300">Declaration</h3>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-zinc-900/50 border border-green-500/20 rounded-lg p-4 font-mono"
        >
          <motion.p
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-sm text-green-300"
          >
            int[] freq = new int[26];
          </motion.p>
        </motion.div>

        <div className="space-y-2 text-xs text-zinc-300">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span>26 slots for lowercase letters (a-z)</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1 }}
            className="flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span>Each slot counts character frequency</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Visual array representation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="bg-zinc-900/50 border border-green-500/30 rounded-xl p-4 space-y-3"
      >
        <p className="text-xs font-bold text-green-300 text-center">Array Structure (26 elements)</p>

        {/* Index labels */}
        <div className="flex justify-between text-[10px] text-green-400">
          <span>Index: 0</span>
          <span>...</span>
          <span>25</span>
        </div>

        {/* Array visualization */}
        <div className="grid grid-cols-13 gap-1">
          {Array.from({ length: 13 }, (_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 1.5 + i * 0.05,
                type: "spring",
                stiffness: 200
              }}
              className="aspect-square bg-green-500/20 border-2 border-green-500/50 rounded flex flex-col items-center justify-center p-1"
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  delay: 2 + i * 0.05,
                  duration: 0.5
                }}
                className="text-[10px] font-mono text-green-300"
              >
                {String.fromCharCode(97 + i)}
              </motion.span>
              <span className="text-[8px] text-zinc-500">0</span>
            </motion.div>
          ))}
        </div>

        <p className="text-[10px] text-zinc-400 text-center italic">+ 13 more slots (n-z)</p>
      </motion.div>

      {/* Mapping explanation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2.5, type: "spring", stiffness: 120 }}
        className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 space-y-3"
      >
        <div className="flex items-center justify-center gap-2">
          <Lightbulb className="w-5 h-5 text-green-400" />
          <p className="text-xs font-bold text-green-300">Character Mapping</p>
        </div>

        <div className="space-y-2">
          {[
            { char: 'a', calc: "'a' - 'a'", result: '0' },
            { char: 'b', calc: "'b' - 'a'", result: '1' },
            { char: 'z', calc: "'z' - 'a'", result: '25' }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.7 + i * 0.2 }}
              className="bg-zinc-900/50 rounded-lg p-2 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    boxShadow: [
                      '0 0 0 0 rgba(34,197,94,0)',
                      '0 0 10px 3px rgba(34,197,94,0.5)',
                      '0 0 0 0 rgba(34,197,94,0)'
                    ]
                  }}
                  transition={{
                    delay: 2.9 + i * 0.2,
                    duration: 1
                  }}
                  className="w-8 h-8 bg-green-500/20 border border-green-500/50 rounded flex items-center justify-center font-mono text-xs text-green-300"
                >
                  {item.char}
                </motion.div>
                <ArrowRight className="w-3 h-3 text-zinc-500" />
                <code className="text-[10px] text-zinc-400">{item.calc}</code>
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  delay: 3.1 + i * 0.2,
                  duration: 0.8
                }}
                className="px-2 py-1 bg-green-500/20 border border-green-500/50 rounded text-xs font-bold text-green-300"
              >
                [{item.result}]
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Key benefit */}
      <motion.div
        initial={{ scale: 0, rotate: -5 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 3.5, type: "spring", stiffness: 150 }}
        className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 rounded-xl p-4 text-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-flex items-center gap-2"
        >
          <Zap className="w-5 h-5 text-green-300" strokeWidth={2.5} />
          <p className="text-sm font-bold text-green-300">
            O(1) Access - Lightning Fast Lookups!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );

  const renderQueueScene = (frame: any) => (
    <div className="w-full space-y-5">
      {/* Animated queue icon with flow */}
      <div className="relative">
        {/* Flow lines */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: [-100, 100],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "linear"
            }}
            className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
          />
        ))}

        <motion.div
          animate={{
            rotateY: [0, 360]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="relative z-10 w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-2 border-purple-500/50 flex items-center justify-center preserve-3d"
        >
          <ListOrdered className="w-16 h-16 text-purple-300" strokeWidth={2.5} />

          {/* Orbiting dots */}
          {[0, 120, 240].map((angle, i) => (
            <motion.div
              key={i}
              animate={{
                rotate: 360
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.3
              }}
              className="absolute w-full h-full"
              style={{ transform: `rotate(${angle}deg)` }}
            >
              <div className="absolute top-0 left-1/2 w-3 h-3 bg-purple-400 rounded-full -translate-x-1/2" />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-4xl font-black uppercase text-center">
          <motion.span
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-[length:200%_auto]"
          >
            The Queue
          </motion.span>
        </h2>
      </motion.div>

      {/* Queue declaration */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 120 }}
        className="bg-purple-500/10 border-2 border-purple-500/30 rounded-xl p-5 space-y-4"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{
              rotate: { duration: 4, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity }
            }}
            className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center border-2 border-purple-500/40"
          >
            <Code className="w-6 h-6 text-purple-400" />
          </motion.div>
          <h3 className="text-lg font-bold text-purple-300">Declaration</h3>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-zinc-900/50 border border-purple-500/20 rounded-lg p-4 font-mono"
        >
          <motion.p
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-xs text-purple-300"
          >
            Queue&lt;Character&gt; q = new LinkedList&lt;&gt;();
          </motion.p>
        </motion.div>
      </motion.div>

      {/* FIFO visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="bg-zinc-900/50 border border-purple-500/30 rounded-xl p-5 space-y-4"
      >
        <div className="flex items-center justify-center gap-2">
          <ArrowRight className="w-5 h-5 text-purple-400" />
          <p className="text-sm font-bold text-purple-300">FIFO: First In, First Out</p>
        </div>

        {/* Visual queue */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="text-[10px] text-purple-400">Front →</span>
            <div className="flex gap-1">
              {['a', 'b', 'c', 'd'].map((char, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    delay: 1.2 + i * 0.3,
                    type: "spring",
                    stiffness: 200
                  }}
                  className="relative"
                >
                  <motion.div
                    animate={{
                      boxShadow: [
                        '0 0 0 0 rgba(168,85,247,0)',
                        '0 0 15px 3px rgba(168,85,247,0.6)',
                        '0 0 0 0 rgba(168,85,247,0)'
                      ]
                    }}
                    transition={{
                      delay: 1.4 + i * 0.3,
                      duration: 1
                    }}
                    className="w-12 h-12 bg-purple-500/20 border-2 border-purple-500/50 rounded-lg flex items-center justify-center font-mono text-sm text-purple-300"
                  >
                    {char}
                  </motion.div>
                  {i === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2.5 }}
                      className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-[10px] text-green-400 whitespace-nowrap"
                    >
                      ⭐ First Unique
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
            <span className="text-[10px] text-purple-400">← Back</span>
          </div>

          {/* Operations */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.8 }}
              className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 space-y-1"
            >
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-400" />
                <p className="text-xs font-bold text-purple-300">Enqueue</p>
              </div>
              <p className="text-[10px] text-zinc-400">Add to back</p>
              <code className="text-[10px] text-purple-300">q.offer(ch)</code>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 3 }}
              className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-3 space-y-1"
            >
              <div className="flex items-center gap-2">
                <Minus className="w-4 h-4 text-pink-400" />
                <p className="text-xs font-bold text-pink-300">Dequeue</p>
              </div>
              <p className="text-[10px] text-zinc-400">Remove from front</p>
              <code className="text-[10px] text-pink-300">q.poll()</code>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Key purpose */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 3.3, type: "spring", stiffness: 120 }}
        className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 space-y-3"
      >
        <div className="flex items-center justify-center gap-2">
          <Target className="w-5 h-5 text-purple-400" />
          <p className="text-xs font-bold text-purple-300">Why Queue?</p>
        </div>

        <div className="space-y-2">
          {[
            'Maintains insertion order of characters',
            'O(1) access to first non-repeating character',
            'Easy removal of repeated characters from front'
          ].map((reason, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 3.5 + i * 0.15 }}
              className="flex items-center gap-2 bg-zinc-900/50 rounded-lg p-2"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span className="text-xs text-zinc-300">{reason}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Key benefit */}
      <motion.div
        initial={{ scale: 0, rotate: -5 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 4, type: "spring", stiffness: 150 }}
        className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 rounded-xl p-4 text-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-flex items-center gap-2"
        >
          <CheckCircle className="w-5 h-5 text-purple-300" />
          <p className="text-sm font-bold text-purple-300">
            Queue keeps characters in order for instant access!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );

  const renderCodeStartScene = (frame: any) => (
    <div className="w-full space-y-5">
      {/* Animated code icon with sparkles */}
      <div className="relative">
        {/* Sparkle particles */}
        {[...Array(16)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: [0, Math.cos(i * 22.5 * Math.PI / 180) * 60],
              y: [0, Math.sin(i * 22.5 * Math.PI / 180) * 60],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.1
            }}
            className="absolute top-1/2 left-1/2 w-1 h-1 bg-blue-400 rounded-full"
          />
        ))}

        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            rotateY: [0, 360]
          }}
          transition={{
            scale: { duration: 2.5, repeat: Infinity },
            rotateY: { duration: 8, repeat: Infinity, ease: "linear" }
          }}
          className="relative z-10 w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br from-blue-500/30 to-cyan-500/30 border-2 border-blue-500/50 flex items-center justify-center preserve-3d"
        >
          <FileCode className="w-16 h-16 text-blue-300" strokeWidth={2.5} />

          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              rotate: { duration: 4, repeat: Infinity, ease: 'linear' },
              scale: { duration: 2, repeat: Infinity }
            }}
            className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-yellow-400/40 to-orange-400/40 border-2 border-yellow-400/60 rounded-full flex items-center justify-center"
          >
            <Sparkles className="w-5 h-5 text-yellow-300" />
          </motion.div>
        </motion.div>
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-4xl font-black uppercase text-center">
          <motion.span
            animate={{
              textShadow: [
                '0 0 20px rgba(59,130,246,0.5)',
                '0 0 40px rgba(59,130,246,0.9)',
                '0 0 20px rgba(59,130,246,0.5)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"
          >
            Code Walkthrough
          </motion.span>
        </h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-blue-400 mt-2"
        >
          Let's implement our solution step by step
        </motion.p>
      </motion.div>

      {/* Variable declarations */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.7, type: "spring", stiffness: 120 }}
        className="bg-blue-500/10 border-2 border-blue-500/30 rounded-xl p-5 space-y-4"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{
              rotate: { duration: 4, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity }
            }}
            className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center border-2 border-blue-500/40"
          >
            <Code className="w-6 h-6 text-blue-400" />
          </motion.div>
          <h3 className="text-lg font-bold text-blue-300">Initialize Data Structures</h3>
        </div>

        <div className="space-y-3">
          {[
            { code: 'int[] freq = new int[26];', desc: 'Frequency array for 26 letters', delay: 0.9, color: 'green' },
            { code: 'Queue<Character> q = new LinkedList<>();', desc: 'Queue to maintain order', delay: 1.2, color: 'purple' },
            { code: 'StringBuilder ans = new StringBuilder();', desc: 'Build result string efficiently', delay: 1.5, color: 'orange' }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: item.delay }}
              className={`bg-${item.color}-500/10 border border-${item.color}-500/30 rounded-lg p-3 space-y-2`}
            >
              <motion.div
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, delay: item.delay }}
                className="bg-zinc-900/50 rounded p-2 font-mono text-xs"
              >
                <code className={`text-${item.color}-300`}>{item.code}</code>
              </motion.div>
              <div className="flex items-center gap-2">
                <CheckCircle className={`w-3 h-3 text-${item.color}-400`} />
                <p className="text-[10px] text-zinc-300">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Algorithm overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        className="bg-zinc-900/50 border border-blue-500/30 rounded-xl p-5 space-y-3"
      >
        <div className="flex items-center justify-center gap-2">
          <List className="w-5 h-5 text-blue-400" />
          <p className="text-sm font-bold text-blue-300">Algorithm Steps</p>
        </div>

        <div className="space-y-2">
          {[
            { step: '1', text: 'Iterate through each character in stream', icon: ArrowRight },
            { step: '2', text: 'Update frequency count', icon: BarChart3 },
            { step: '3', text: 'Add character to queue', icon: Plus },
            { step: '4', text: 'Remove repeated chars from queue front', icon: Trash2 },
            { step: '5', text: 'Get first unique from queue or #', icon: CheckCircle }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.2 + i * 0.15 }}
              className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3"
            >
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 360]
                }}
                transition={{
                  delay: 2.4 + i * 0.15,
                  duration: 0.8
                }}
                className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center text-xs font-bold text-blue-300"
              >
                {item.step}
              </motion.div>
              <item.icon className="w-4 h-4 text-blue-400" />
              <p className="text-xs text-zinc-300 flex-1">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Ready indicator */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 3.5, type: "spring", stiffness: 150 }}
        className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-2 border-blue-500/50 rounded-xl p-4 text-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-flex items-center gap-3"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Play className="w-6 h-6 text-blue-300" strokeWidth={2.5} />
          </motion.div>
          <p className="text-sm font-bold text-blue-300">
            Ready to Process the Stream!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );

  const renderWhileExplainScene = (frame: any) => (
    <div className="w-full space-y-5">
      {/* Animated loop icon */}
      <div className="relative">
        {/* Circular motion paths */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ rotate: 360 }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 w-36 h-36 mx-auto border-2 border-dashed border-yellow-500/30 rounded-full"
            style={{ margin: `${i * 8}px` }}
          />
        ))}

        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.15, 1]
          }}
          transition={{
            rotate: { duration: 6, repeat: Infinity, ease: "linear" },
            scale: { duration: 2.5, repeat: Infinity }
          }}
          className="relative z-10 w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br from-yellow-500/30 to-orange-500/30 border-2 border-yellow-500/50 flex items-center justify-center"
        >
          <RotateCw className="w-16 h-16 text-yellow-300" strokeWidth={2.5} />

          {/* Loop counter */}
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute -top-3 -right-3 w-10 h-10 bg-yellow-500 rounded-full border-2 border-yellow-300 flex items-center justify-center text-xs font-black text-zinc-900"
          >
            i++
          </motion.div>
        </motion.div>
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-4xl font-black uppercase text-center">
          <motion.span
            animate={{
              textShadow: [
                '0 0 20px rgba(234,179,8,0.5)',
                '0 0 40px rgba(234,179,8,0.9)',
                '0 0 20px rgba(234,179,8,0.5)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400"
          >
            The While Loop
          </motion.span>
        </h2>
      </motion.div>

      {/* Loop code */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 120 }}
        className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-xl p-5 space-y-4"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center border-2 border-yellow-500/40"
          >
            <Code className="w-6 h-6 text-yellow-400" />
          </motion.div>
          <h3 className="text-lg font-bold text-yellow-300">Cleanup Loop</h3>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-zinc-900/50 border border-yellow-500/20 rounded-lg p-4 font-mono text-xs space-y-1"
        >
          <motion.p
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-yellow-300"
          >
            while (!q.isEmpty() && freq[q.peek() - 'a'] &gt; 1) {'{'}
          </motion.p>
          <motion.p
            animate={{
              x: [0, 5, 0],
              color: ['#fb923c', '#ef4444', '#fb923c']
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="pl-4"
          >
            q.poll(); // Remove repeated character
          </motion.p>
          <p className="text-yellow-300">{'}'}</p>
        </motion.div>
      </motion.div>

      {/* Loop logic explanation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="bg-zinc-900/50 border border-yellow-500/30 rounded-xl p-5 space-y-4"
      >
        <div className="flex items-center justify-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
          <p className="text-sm font-bold text-yellow-300">Key Insight</p>
        </div>

        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4 }}
            className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 space-y-2"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-yellow-400" />
              <p className="text-xs font-bold text-yellow-300">Condition Check</p>
            </div>
            <p className="text-xs text-zinc-300 pl-6">
              Loop continues while queue front has frequency &gt; 1
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.6 }}
            className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 space-y-2"
          >
            <div className="flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-orange-400" />
              <p className="text-xs font-bold text-orange-300">Action</p>
            </div>
            <p className="text-xs text-zinc-300 pl-6">
              Remove repeated characters from front
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.8 }}
            className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 space-y-2"
          >
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-green-400" />
              <p className="text-xs font-bold text-green-300">Result</p>
            </div>
            <p className="text-xs text-zinc-300 pl-6">
              Queue front always has first non-repeating character!
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Visual example */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2 }}
        className="bg-zinc-900/50 border border-yellow-500/30 rounded-xl p-4 space-y-3"
      >
        <p className="text-xs font-bold text-yellow-300 text-center">Example: Processing "aabc"</p>

        <div className="space-y-2">
          {[
            { step: 'After "aa"', queue: ['a'], action: 'Remove a (freq=2)', result: 'Empty!' },
            { step: 'After "aab"', queue: ['b'], action: 'b added, unique', result: 'b' },
            { step: 'After "aabc"', queue: ['b', 'c'], action: 'c added, b still first', result: 'b' }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.4 + i * 0.2 }}
              className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3 space-y-2"
            >
              <p className="text-[10px] font-bold text-yellow-300">{item.step}</p>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {item.queue.map((char, idx) => (
                    <motion.div
                      key={idx}
                      animate={{
                        scale: [1, 1.2, 1],
                        boxShadow: idx === 0 ? [
                          '0 0 0 0 rgba(234,179,8,0)',
                          '0 0 10px 3px rgba(234,179,8,0.6)',
                          '0 0 0 0 rgba(234,179,8,0)'
                        ] : undefined
                      }}
                      transition={{
                        delay: 2.6 + i * 0.2,
                        duration: 1
                      }}
                      className="w-8 h-8 bg-yellow-500/20 border border-yellow-500/50 rounded flex items-center justify-center text-xs font-mono text-yellow-300"
                    >
                      {char}
                    </motion.div>
                  ))}
                </div>
                <ArrowRight className="w-3 h-3 text-zinc-500" />
                <span className="text-[10px] text-green-300 font-bold">{item.result}</span>
              </div>
              <p className="text-[10px] text-zinc-400 italic">{item.action}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Performance highlight */}
      <motion.div
        initial={{ scale: 0, rotate: -5 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 3.2, type: "spring", stiffness: 150 }}
        className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 rounded-xl p-4 text-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-flex items-center gap-2"
        >
          <Zap className="w-5 h-5 text-yellow-300" strokeWidth={2.5} fill="currentColor" />
          <p className="text-sm font-bold text-yellow-300">
            Each character removed at most once = O(n) total!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );

  const renderComplexityScene = (frame: any) => (
    <div className="w-full space-y-5">
      {/* Animated checkmark with success effect */}
      <div className="relative">
        {/* Success rings */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 2.5],
              opacity: [0.6, 0]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: i * 0.6
            }}
            className="absolute inset-0 w-36 h-36 mx-auto border-2 border-green-500/50 rounded-full"
          />
        ))}

        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 360],
            boxShadow: [
              '0 0 20px rgba(34,197,94,0.3)',
              '0 0 60px rgba(34,197,94,0.8)',
              '0 0 20px rgba(34,197,94,0.3)'
            ]
          }}
          transition={{
            scale: { duration: 2.5, repeat: Infinity },
            rotate: { duration: 8, repeat: Infinity, ease: "linear" },
            boxShadow: { duration: 2.5, repeat: Infinity }
          }}
          className="relative z-10 w-36 h-36 mx-auto rounded-full bg-gradient-to-br from-green-500/30 to-emerald-500/30 border-4 border-green-500/50 flex items-center justify-center"
        >
          <CheckCircle className="w-20 h-20 text-green-300" strokeWidth={3} fill="currentColor" />
        </motion.div>
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
      >
        <h2 className="text-5xl font-black uppercase text-center">
          <motion.span
            animate={{
              textShadow: [
                '0 0 20px rgba(34,197,94,0.5)',
                '0 0 40px rgba(34,197,94,1)',
                '0 0 20px rgba(34,197,94,0.5)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400"
          >
            Perfect!
          </motion.span>
        </h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-green-400 mt-2"
        >
          Optimal Solution Achieved
        </motion.p>
      </motion.div>

      {/* Time Complexity */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.7, type: "spring", stiffness: 120 }}
        className="bg-green-500/10 border-2 border-green-500/30 rounded-xl p-6 space-y-4"
      >
        <div className="text-center">
          <motion.div
            animate={{
              scale: [1, 1.15, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block"
          >
            <motion.p
              animate={{
                textShadow: [
                  '0 0 10px rgba(34,197,94,0.5)',
                  '0 0 30px rgba(34,197,94,0.9)',
                  '0 0 10px rgba(34,197,94,0.5)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400"
            >
              O(n)
            </motion.p>
          </motion.div>
          <p className="text-green-200 text-sm font-bold mt-2">
            Linear Time Complexity
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="bg-zinc-900/50 border border-green-500/20 rounded-lg p-4 space-y-2"
        >
          <p className="text-xs font-bold text-green-300 text-center mb-3">Time Breakdown:</p>
          {[
            { operation: 'Process each character once', complexity: 'O(n)' },
            { operation: 'Update frequency array', complexity: 'O(1)' },
            { operation: 'Queue operations (offer/poll)', complexity: 'O(1)' },
            { operation: 'Check queue front', complexity: 'O(1)' }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + i * 0.15 }}
              className="flex items-center justify-between bg-green-500/10 rounded-lg p-2"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-400" />
                <span className="text-xs text-zinc-300">{item.operation}</span>
              </div>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  delay: 1.4 + i * 0.15,
                  duration: 0.8
                }}
                className="text-xs font-bold text-green-300 font-mono"
              >
                {item.complexity}
              </motion.span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Space Complexity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        className="bg-blue-500/10 border-2 border-blue-500/30 rounded-xl p-5 space-y-3"
      >
        <div className="flex items-center justify-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <Database className="w-6 h-6 text-blue-400" />
          </motion.div>
          <h3 className="text-lg font-bold text-blue-300">Space Complexity</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.2 }}
            className="bg-zinc-900/50 border border-blue-500/20 rounded-lg p-3 text-center"
          >
            <BarChart3 className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-[10px] text-zinc-400">Frequency Array</p>
            <motion.p
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 2.4 }}
              className="text-xl font-bold text-blue-300 font-mono mt-1"
            >
              O(1)
            </motion.p>
            <p className="text-[10px] text-zinc-500">Fixed 26 slots</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.4 }}
            className="bg-zinc-900/50 border border-purple-500/20 rounded-lg p-3 text-center"
          >
            <ListOrdered className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-[10px] text-zinc-400">Queue</p>
            <motion.p
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 2.6 }}
              className="text-xl font-bold text-purple-300 font-mono mt-1"
            >
              O(n)
            </motion.p>
            <p className="text-[10px] text-zinc-500">At most n chars</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2.8, type: "spring" }}
          className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-3 text-center"
        >
          <p className="text-xs text-zinc-400 mb-1">Total Space:</p>
          <motion.p
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-2xl font-black text-blue-300 font-mono"
          >
            O(n)
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Performance comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.2 }}
        className="bg-zinc-900/50 border border-green-500/30 rounded-xl p-4 space-y-3"
      >
        <p className="text-xs font-bold text-green-300 text-center">Solution Comparison</p>
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.4 }}
            className="flex items-center justify-between bg-red-500/10 border border-red-500/30 rounded-lg p-3"
          >
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-400" />
              <span className="text-xs text-zinc-300">Brute Force</span>
            </div>
            <span className="text-sm font-bold text-red-300 font-mono">O(n²)</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 3.6, type: "spring" }}
            className="flex items-center justify-between bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 rounded-lg p-3"
          >
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <CheckCircle className="w-4 h-4 text-green-400" strokeWidth={2.5} />
              </motion.div>
              <span className="text-xs font-bold text-green-300">Our Solution</span>
            </div>
            <motion.span
              animate={{
                scale: [1, 1.2, 1],
                textShadow: [
                  '0 0 5px rgba(34,197,94,0.5)',
                  '0 0 15px rgba(34,197,94,0.9)',
                  '0 0 5px rgba(34,197,94,0.5)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-lg font-black text-green-300 font-mono"
            >
              O(n)
            </motion.span>
          </motion.div>
        </div>
      </motion.div>

      {/* Success banner */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 4, type: "spring", stiffness: 150 }}
        className="relative overflow-hidden bg-gradient-to-r from-green-500/30 via-emerald-500/30 to-green-500/30 border-2 border-green-500/60 rounded-xl p-5 text-center"
      >
        {/* Animated background shine */}
        <motion.div
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
        />

        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 2, -2, 0]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="relative z-10 space-y-2"
        >
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-green-300" />
            <Trophy className="w-8 h-8 text-yellow-400" />
            <Sparkles className="w-6 h-6 text-green-300" />
          </div>
          <p className="text-xl font-black text-green-300">
            PERFECT SOLUTION!
          </p>
          <p className="text-xs text-green-400">
            Optimal time & space complexity achieved! 🎉
          </p>
        </motion.div>
      </motion.div>
    </div>
  );

  // Complete Java code for the problem
  const fullCode = `class Solution {
    public String firstNonRepeating(String s) {
        // Frequency array to track occurrences
        int[] freq = new int[26];
        
        // Queue to maintain order of characters
        Queue<Character> q = new LinkedList<>();
        
        // StringBuilder to build result efficiently
        StringBuilder ans = new StringBuilder();
        
        // Iterate through each character in string
        for (int i = 0; i < s.length(); i++) {
            char ch = s.charAt(i);
            
            // Update frequency count for this character
            freq[ch - 'a']++;
            
            // Add character to queue
            q.offer(ch);
            
            // Remove characters from queue front
            // that have frequency > 1 (repeated)
            while (!q.isEmpty() && 
                   freq[q.peek() - 'a'] > 1) {
                q.poll();
            }
            
            // Check if queue has valid character
            if (q.isEmpty()) {
                // No non-repeating character exists
                ans.append('#');
            } else {
                // Front of queue is first non-repeating
                ans.append(q.peek());
            }
        }
        
        // Return the result string
        return ans.toString();
    }
}`;

  const codeLines = fullCode.split('\n');

  // Determine which line is currently being executed
  const getCurrentLine = () => {
    if (time < 90.076) return -1; // Before code walkthrough
    if (time >= 90.076 && time < 98.664) return 3; // int[] freq
    if (time >= 98.664 && time < 104.039) return 6; // Queue
    if (time >= 104.039 && time < 111.054) return 9; // StringBuilder
    if (time >= 111.054 && time < 116.364) return 12; // for loop
    if (time >= 116.364 && time < 121.215) return 13; // char ch
    if (time >= 121.215 && time < 143.243) return 16; // freq increment
    if (time >= 143.243 && time < 161.533) return 19; // q.offer
    if (time >= 161.533 && time < 182.577) return 23; // while condition
    if (time >= 182.577 && time < 195.557) return 25; // q.poll
    if (time >= 195.557 && time < 208.210) return 23; // while loop explanation
    if (time >= 208.210 && time < 220.141) return 29; // if isEmpty
    if (time >= 220.141 && time < 223.485) return 31; // append #
    if (time >= 223.485 && time < 232.204) return 34; // append peek
    if (time >= 232.204 && time < 240.726) return 39; // return
    return -1;
  };

  const currentLine = getCurrentLine();

  // Auto-scroll to keep current line visible
  useEffect(() => {
    if (codeContainerRef.current && currentLine >= 0) {
      const lineHeight = 24; // approximate height per line
      const containerHeight = codeContainerRef.current.clientHeight;
      const scrollTop = codeContainerRef.current.scrollTop;
      const lineTop = currentLine * lineHeight;
      const lineBottom = lineTop + lineHeight;

      // Check if line is outside visible area
      if (lineTop < scrollTop || lineBottom > scrollTop + containerHeight) {
        // Center the line in the viewport
        codeContainerRef.current.scrollTop = lineTop - containerHeight / 2 + lineHeight / 2;
      }
    }
  }, [currentLine]);

  return (
    <div className={`${embedded ? 'w-full h-full' : 'flex items-center justify-center min-h-screen p-4'} bg-black text-white font-sans`}>
      {/* Main Container with Dynamic Layout */}
      <div className={`relative ${embedded ? 'w-full h-full' : (isLandscape ? 'w-full max-w-6xl h-[95vh]' : 'w-full max-w-[420px] h-[95vh]')} bg-zinc-950 ${embedded ? '' : 'rounded-xl border border-zinc-800 shadow-[0_0_100px_rgba(0,0,0,1)]'} overflow-hidden ${isLandscape && time >= 84.831 ? 'flex flex-row' : 'flex flex-col'}`}>

        {/* Only render audio in standalone mode */}
        {!embedded && <audio ref={audioRef} src="/audio/gfglong.mp3" preload="auto" />}

        <div className="absolute inset-0 opacity-[0.02] bg-[size:20px_20px] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]" />

        {/* Code Iterator (only show during code walkthrough) */}
        {time >= 84.831 && (
          <div className={`relative ${isLandscape ? 'w-1/2 border-r-2' : 'h-1/2 border-b-2'} border-yellow-500/30 bg-zinc-950/95 backdrop-blur-sm`}>
            <div className="absolute top-2 left-3 flex items-center gap-2 z-10">
              <Code2 className="w-4 h-4 text-yellow-400" />
              <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider">
                Code Execution
              </span>
            </div>

            {/* Scrollable Code Container */}
            <div
              ref={codeContainerRef}
              className="absolute inset-0 pt-10 pb-2 px-3 overflow-y-auto scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-700"
              style={{ scrollBehavior: 'smooth' }}
            >
              <div className={`font-mono ${isLandscape ? 'text-[9px] leading-5' : 'text-[10px] leading-6'} space-y-0`}>
                {codeLines.map((line, idx) => (
                  <div
                    key={idx}
                    className={`relative px-4 py-1 transition-all duration-200 ${currentLine === idx
                        ? 'bg-zinc-800' // Solid highlight
                        : ''
                      }`}
                  >
                    {/* Line Number */}
                    <span className={`inline-block w-8 select-none text-right mr-4 ${currentLine === idx ? 'text-yellow-400 font-bold' : 'text-zinc-700'}`}>
                      {idx + 1}
                    </span>

                    {/* Code Content */}
                    <span className={`${currentLine === idx ? 'text-white font-medium' : 'text-zinc-500'
                      }`}>
                      {line.includes('int') || line.includes('char') || line.includes('Queue') || line.includes('StringBuilder') || line.includes('String') ? (
                        <span className="text-blue-400">{line.split(/(\s+)/)[0]}</span>
                      ) : line.includes('for') || line.includes('while') || line.includes('if') || line.includes('else') || line.includes('return') || line.includes('new') ? (
                        <span className="text-purple-400">{line.split(/(\s+)/)[0]}</span>
                      ) : null}
                      <span>{line.includes('int') || line.includes('char') || line.includes('Queue') || line.includes('for') || line.includes('while') || line.includes('if') || line.includes('else') || line.includes('return') || line.includes('new') || line.includes('StringBuilder') || line.includes('String') ? line.substring(line.split(/(\s+)/)[0].length) : line}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Execution Info Overlay - REMOVED TO REDUCE CLUTTER */}

          </div>
        )}

        {/* Detailed Visualization */}
        <div className={`relative ${time >= 84.831 ? (isLandscape ? 'w-1/2' : 'h-1/2') : 'h-full'} flex flex-col items-center justify-center px-4 text-center overflow-hidden`}>
          <AnimatePresence mode="wait">
            {/* Dynamic Frame Content */}
            {currentFrame && (
              <motion.div
                key={currentFrame.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="w-full space-y-5"
              >
                {currentFrame.content.type === 'scene' && renderSceneContent(currentFrame)}
                {currentFrame.content.type === 'code' && renderCodeContent(currentFrame)}
                {currentFrame.content.type === 'jsx' && renderJSXContent(currentFrame)}
                {currentFrame.content.type !== 'scene' && currentFrame.content.type !== 'code' && currentFrame.content.type !== 'jsx' && renderDefaultScene(currentFrame)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>


        {/* Control Bar - Only show in standalone mode */}
        {!embedded && (
          <div className="relative bg-zinc-950/80 backdrop-blur border-t border-zinc-800 p-3 flex items-center gap-3">
            <button
              onClick={togglePlayback}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <button
              onClick={resetTimeline}
              className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
            </button>

            <div className="flex-1 text-[10px] text-zinc-500 font-mono">
              {time.toFixed(3)}s / 260.000s
            </div>
          </div>
        )}
      </div>

      {/* Debug Timeline - Only show in standalone mode */}
      {!embedded && (
        <div className="bg-zinc-900 rounded-xl p-4 w-72 max-h-screen overflow-y-auto border border-zinc-800">
          <h3 className="text-xs font-bold mb-3 text-zinc-400">Scene Timeline</h3>
          <div className="space-y-1 text-[10px]">
            {[
              { start: 0.000, end: 7.605, label: 'Introduction', line: '' },
              { start: 7.605, end: 12.849, label: 'Classic Challenge', line: '' },
              { start: 12.849, end: 20.651, label: 'Efficient Strategy', line: '' },
              { start: 20.651, end: 24.125, label: 'Problem Understanding', line: '' },
              { start: 24.125, end: 28.517, label: 'Live Stream', line: '' },
              { start: 28.517, end: 37.302, label: 'The Question', line: '' },
              { start: 37.302, end: 44.972, label: 'Pound Sign', line: '' },
              { start: 44.972, end: 51.790, label: 'Instantly', line: '' },
              { start: 51.790, end: 59.919, label: 'Way Too Slow', line: '' },
              { start: 59.919, end: 66.082, label: 'O(n²)', line: '' },
              { start: 66.082, end: 71.982, label: 'Two Tools', line: '' },
              { start: 71.982, end: 79.128, label: 'Frequency Array', line: '' },
              { start: 79.128, end: 84.831, label: 'Queue Waiting Line', line: '' },
              { start: 84.831, end: 90.076, label: 'Code Walkthrough', line: '' },
              { start: 90.076, end: 98.664, label: 'int[] freq = new int[26]', line: 'LINE 1' },
              { start: 98.664, end: 104.039, label: 'Queue<Character> q', line: 'LINE 2' },
              { start: 104.039, end: 111.054, label: 'StringBuilder ans', line: 'LINE 3' },
              { start: 111.054, end: 116.364, label: 'for loop', line: 'LINE 4' },
              { start: 116.364, end: 121.215, label: 'char ch = s.charAt(i)', line: 'LINE 5' },
              { start: 121.215, end: 143.243, label: "freq[ch - 'a']++", line: 'LINE 6' },
              { start: 143.243, end: 161.533, label: 'q.offer(ch)', line: 'LINE 7' },
              { start: 161.533, end: 182.577, label: 'while (!q.isEmpty()...)', line: 'LINE 8' },
              { start: 182.577, end: 195.557, label: 'q.poll()', line: 'LINE 9' },
              { start: 195.557, end: 208.210, label: 'While Loop Ensures', line: '' },
              { start: 208.210, end: 220.141, label: 'if (q.isEmpty())', line: 'LINE 10' },
              { start: 220.141, end: 223.485, label: "ans.append('#')", line: 'LINE 11' },
              { start: 223.485, end: 232.204, label: 'ans.append(q.peek())', line: 'LINE 12' },
              { start: 232.204, end: 240.726, label: 'return ans.toString()', line: 'LINE 13' },
              { start: 240.726, end: 260.000, label: 'Time Complexity O(n)', line: '' }
            ].map((scene, i) => (
              <div
                key={i}
                className={`p-2 rounded ${time >= scene.start && time < scene.end
                    ? 'bg-green-500/20 text-green-300 font-bold'
                    : 'text-zinc-600'
                  }`}
              >
                {scene.line && <div className="text-[8px] text-green-400 mb-1">{scene.line}</div>}
                {scene.label}
                <div className="text-[8px] opacity-60">
                  {scene.start.toFixed(1)}s - {scene.end.toFixed(1)}s
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GFGCodeVisualization;