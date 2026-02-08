import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { AbsoluteFill, useCurrentFrame } from "remotion";

// --- Shaders ---

const diskVertexShader = `
varying vec2 vUv;
varying vec3 vPos;
void main() {
  vUv = uv;
  vPos = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const diskFragmentShader = `
uniform float uTime;
uniform vec3 uColorInner;
uniform vec3 uColorOuter;
varying vec2 vUv;
varying vec3 vPos;

// Simplex noise function (simplified for this use case)
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(random(i + vec2(0.0,0.0)), random(i + vec2(1.0,0.0)), u.x),
               mix(random(i + vec2(0.0,1.0)), random(i + vec2(1.0,1.0)), u.x), u.y);
}

void main() {
  float dist = length(vUv - 0.5) * 2.0; 
  
  if (dist < 0.25) discard; 
  if (dist > 1.0) discard;

  float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
  float swirl = noise(vec2(dist * 10.0 - uTime * 2.0, angle * 4.0 + uTime * 0.5));
  
  vec3 color = mix(uColorInner, uColorOuter, dist);
  
  float intensity = (1.0 - smoothstep(0.25, 0.3, dist)) * 5.0 + 
                    (swirl * 2.0) * (1.0 - dist);
  
  float alpha = smoothstep(0.0, 0.2, intensity) * (1.0 - smoothstep(0.9, 1.0, dist));

  gl_FragColor = vec4(color * intensity, alpha);
}
`;

// --- Components ---

const BlackHole = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    useCurrentFrame(); // Subscribe to frame updates if needed for other logic, or remove if purely time-based

    useFrame(({ clock }) => {
        if (meshRef.current) {
            meshRef.current.rotation.z = clock.getElapsedTime() * 0.1;
        }
    });

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColorInner: { value: new THREE.Color("#ffaa00") },
        uColorOuter: { value: new THREE.Color("#cc3300") },
    }), []);

    useFrame(({ clock }) => {
        uniforms.uTime.value = clock.getElapsedTime();
    });

    return (
        <group rotation={[Math.PI / 3, 0, 0]}>
            <mesh>
                <sphereGeometry args={[1.2, 64, 64]} />
                <meshBasicMaterial color="black" />
            </mesh>
            <mesh position={[0, 0, -0.1]}>
                <sphereGeometry args={[1.25, 64, 64]} />
                <meshBasicMaterial color="#ff6600" transparent opacity={0.5} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
            </mesh>
            <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[12, 12, 128, 128]} />
                <shaderMaterial
                    vertexShader={diskVertexShader}
                    fragmentShader={diskFragmentShader}
                    uniforms={uniforms}
                    transparent
                    side={THREE.DoubleSide}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>
        </group>
    );
};

const StarField = () => {
    const count = 2000;
    const mesh = useRef<THREE.Points>(null);

    const points = useMemo(() => {
        const p = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            p[i * 3] = (Math.random() - 0.5) * 50;
            p[i * 3 + 1] = (Math.random() - 0.5) * 50;
            p[i * 3 + 2] = (Math.random() - 0.5) * 50;
        }
        return p;
    }, []);

    useFrame(() => {
        if (mesh.current) {
            mesh.current.rotation.y += 0.001;
        }
    })

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[points, 3]}
                />
            </bufferGeometry>
            <pointsMaterial size={0.1} color="white" transparent opacity={0.8} />
        </points>
    );
};

const CameraController = () => {
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        state.camera.position.x = Math.sin(t * 0.1) * 8;
        state.camera.position.z = Math.cos(t * 0.1) * 8;
        state.camera.position.y = Math.sin(t * 0.15) * 2 + 2;
        state.camera.lookAt(0, 0, 0);
    });
    return null;
}

export const BlackHoleScene: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: "black" }}>
            <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
                <CameraController />
                <ambientLight intensity={0.5} />
                <BlackHole />
                <StarField />
            </Canvas>
        </AbsoluteFill>
    );
};
