import React from 'react';
import { AbsoluteFill, useVideoConfig, useCurrentFrame, spring } from 'remotion';

// --- Data Types ---
type Node = { id: string; x: number; y: number; label: string };
type Edge = { from: string; to: string; cost: number };
type Scene = {
    start: number;
    duration: number;
    title: string;
    subtitle: string;
    visited: string[];
    active: string[];
    highlightedEdges: string[];
    selectedEdges: string[];
};

// --- Configuration ---
const NODES: Node[] = [
    { id: 'A', x: 200, y: 300, label: 'Island A' },
    { id: 'B', x: 800, y: 300, label: 'Island B' },
    { id: 'C', x: 500, y: 700, label: 'Island C' },
    { id: 'D', x: 200, y: 900, label: 'Island D' },
    { id: 'E', x: 800, y: 900, label: 'Island E' },
];

const EDGES: Edge[] = [
    { from: 'A', to: 'B', cost: 4 },
    { from: 'A', to: 'C', cost: 2 },
    { from: 'B', to: 'C', cost: 5 },
    { from: 'B', to: 'E', cost: 10 },
    { from: 'C', to: 'D', cost: 3 },
    { from: 'C', to: 'E', cost: 3 },
    { from: 'D', to: 'E', cost: 4 },
    { from: 'A', to: 'D', cost: 7 }, // Added to make it interesting
];

// --- Subcomponents ---

const Island: React.FC<{
    node: Node;
    active: boolean;
    visited: boolean;
    delay: number;
}> = ({ node, active, visited, delay }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scale = spring({
        frame: frame - delay,
        fps,
        config: { damping: 15 },
    });

    const isActive = active ? 1.2 : 1;

    return (
        <div
            style={{
                position: 'absolute',
                left: node.x,
                top: node.y,
                transform: `translate(-50%, -50%) scale(${scale * isActive})`,
                width: 120,
                height: 120,
                borderRadius: '50%',
                backgroundColor: visited ? '#4ade80' : active ? '#facc15' : '#e2e8f0', // Green if visited, Yellow if active/processing, Grey otherwise
                border: '8px solid white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                fontFamily: 'sans-serif',
                fontSize: 32,
                fontWeight: 'bold',
                color: '#334155',
                transition: 'background-color 0.5s ease',
            }}
        >
            {node.id}
            <div style={{ position: 'absolute', bottom: -50, fontSize: 24, fontWeight: 'normal', color: 'white', width: 200, textAlign: 'center' }}>
                {node.label}
            </div>
        </div>
    );
};

const Bridge: React.FC<{
    edge: Edge;
    p1: Node;
    p2: Node;
    highlighted: boolean;
    selected: boolean;
}> = ({ edge, p1, p2, highlighted, selected }) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    return (
        <div
            style={{
                position: 'absolute',
                left: p1.x,
                top: p1.y,
                width: length,
                height: 0,
                transformOrigin: '0 50%',
                transform: `rotate(${angle}deg)`,
                zIndex: 1,
            }}
        >
            {/* The Line */}
            <div
                style={{
                    width: '100%',
                    height: selected ? 12 : 6,
                    backgroundColor: selected ? '#4ade80' : highlighted ? '#facc15' : 'rgba(255,255,255,0.3)',
                    borderRadius: 10,
                    transition: 'all 0.5s ease',
                }}
            />

            {/* Cost Label */}
            <div
                style={{
                    position: 'absolute',
                    left: length / 2,
                    top: -30,
                    transform: `translate(-50%, 0) rotate(${-angle}deg)`, // Keep text upright
                    backgroundColor: selected ? '#4ade80' : '#1e293b',
                    color: selected ? '#064e3b' : 'white',
                    padding: '4px 12px',
                    borderRadius: 20,
                    fontWeight: 'bold',
                    fontSize: 24,
                    border: selected ? '3px solid white' : '2px solid rgba(255,255,255,0.2)',
                }}
            >
                {edge.cost}
            </div>
        </div>
    );
};


// --- Step Logic ---
// We'll define a simple timeline manually for this visualizer
const SCENES: Scene[] = [
    { start: 0, duration: 60, title: "Prim's Algorithm", subtitle: "Connecting Islands efficiently", visited: [], active: [], highlightedEdges: [], selectedEdges: [] },
    { start: 60, duration: 60, title: "Start at Island A", subtitle: "We begin our network here.", visited: ['A'], active: ['A'], highlightedEdges: [], selectedEdges: [] },
    { start: 120, duration: 90, title: "Check Bridges", subtitle: "Look at all bridges from Island A.", visited: ['A'], active: ['A'], highlightedEdges: ['A-B', 'A-C', 'A-D'], selectedEdges: [] },
    { start: 210, duration: 60, title: "Choose Cheapest", subtitle: "Bridge to C costs 2. It's the cheapest!", visited: ['A', 'C'], active: ['C'], highlightedEdges: [], selectedEdges: ['A-C'] },
    { start: 270, duration: 90, title: "Check Neighbors", subtitle: "Now check bridges from A and C.", visited: ['A', 'C'], active: ['C'], highlightedEdges: ['A-B', 'A-D', 'C-B', 'C-D', 'C-E'], selectedEdges: ['A-C'] },
    { start: 360, duration: 60, title: "Choose Next", subtitle: "Bridge C-D costs 3. Cheap!", visited: ['A', 'C', 'D'], active: ['D'], highlightedEdges: [], selectedEdges: ['A-C', 'C-D'] },
    { start: 420, duration: 90, title: "Expand Network", subtitle: "Evaluating bridges from {A, C, D}...", visited: ['A', 'C', 'D'], active: [], highlightedEdges: ['A-B', 'C-B', 'C-E', 'D-E'], selectedEdges: ['A-C', 'C-D'] },
    { start: 510, duration: 60, title: "Found It", subtitle: "Bridge C-E costs 3. Let's build it.", visited: ['A', 'C', 'D', 'E'], active: ['E'], highlightedEdges: [], selectedEdges: ['A-C', 'C-D', 'C-E'] },
    { start: 570, duration: 90, title: "Final Stretch", subtitle: "Only Island B is left.", visited: ['A', 'C', 'D', 'E'], active: [], highlightedEdges: ['A-B', 'C-B', 'B-E'], selectedEdges: ['A-C', 'C-D', 'C-E'] },
    { start: 660, duration: 60, title: "Connect B", subtitle: "A-B is 4. That completes the set!", visited: ['A', 'C', 'D', 'E', 'B'], active: ['B'], highlightedEdges: [], selectedEdges: ['A-C', 'C-D', 'C-E', 'A-B'] },
    { start: 720, duration: 180, title: "Complete!", subtitle: "Minimum Spanning Tree Created.", visited: ['A', 'C', 'D', 'E', 'B'], active: [], highlightedEdges: [], selectedEdges: ['A-C', 'C-D', 'C-E', 'A-B'] },
];

export const PrimsAlgorithm: React.FC = () => {
    const frame = useCurrentFrame();

    // Determine current scene based on frame
    const currentSceneIndex = SCENES.findIndex((s, i) => {
        const next = SCENES[i + 1];
        if (!next) return true;
        return frame >= s.start && frame < next.start;
    });

    const currentScene = SCENES[currentSceneIndex] || SCENES[SCENES.length - 1];

    // Helpers
    const isVisited = (id: string) => currentScene.visited.includes(id);
    const isActive = (id: string) => currentScene.active.includes(id);
    const isEdgeSelected = (from: string, to: string) =>
        currentScene.selectedEdges.includes(`${from}-${to}`) || currentScene.selectedEdges.includes(`${to}-${from}`);
    const isEdgeHighlighted = (from: string, to: string) =>
        (currentScene.highlightedEdges || []).includes(`${from}-${to}`) || (currentScene.highlightedEdges || []).includes(`${to}-${from}`);


    return (
        <AbsoluteFill style={{ backgroundColor: '#0f172a', overflow: 'hidden' }}>

            {/* Background Grid/Decorations */}
            <AbsoluteFill style={{ opacity: 0.1, backgroundImage: 'radial-gradient(#334155 2px, transparent 2px)', backgroundSize: '40px 40px' }} />

            {/* Header */}
            <AbsoluteFill style={{ top: 150, height: 200, alignItems: 'center' }}>
                <h1 style={{ color: '#f8fafc', fontSize: 70, marginBottom: 20, fontFamily: 'sans-serif', textAlign: 'center' }}>
                    {currentScene.title}
                </h1>
                <h2 style={{ color: '#94a3b8', fontSize: 36, fontFamily: 'sans-serif', fontWeight: 'normal', textAlign: 'center', maxWidth: '80%' }}>
                    {currentScene.subtitle}
                </h2>
            </AbsoluteFill>

            {/* Graph Area */}
            <div style={{ position: 'relative', width: '100%', height: '100%', top: 100 }}>
                {/* Edges */}
                {EDGES.map((edge, i) => {
                    const p1 = NODES.find(n => n.id === edge.from)!;
                    const p2 = NODES.find(n => n.id === edge.to)!;
                    return (
                        <Bridge
                            key={i}
                            edge={edge}
                            p1={p1}
                            p2={p2}
                            selected={isEdgeSelected(edge.from, edge.to)}
                            highlighted={isEdgeHighlighted(edge.from, edge.to)}
                        />
                    );
                })}

                {/* Nodes */}
                {NODES.map((node, i) => (
                    <Island
                        key={node.id}
                        node={node}
                        visited={isVisited(node.id)}
                        active={isActive(node.id)}
                        delay={i * 5}
                    />
                ))}
            </div>

        </AbsoluteFill>
    );
};
