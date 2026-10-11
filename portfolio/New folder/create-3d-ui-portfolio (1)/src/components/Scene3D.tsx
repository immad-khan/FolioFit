import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Sparkles, Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function Rig() {
  useFrame((state, delta) => {
    const { pointer } = state;
    const targetX = pointer.x * 1.6;
    const targetY = pointer.y * 1.0;
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, targetX, 2.2, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetY, 2.2, delta);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

function Core() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.18;
      meshRef.current.rotation.x = Math.sin(t * 0.25) * 0.25;
      meshRef.current.position.y = Math.sin(t * 0.7) * 0.12;
    }
    if (wireRef.current) {
      wireRef.current.rotation.y = -t * 0.1;
      wireRef.current.rotation.z = t * 0.06;
    }
    if (ring1.current) {
      ring1.current.rotation.x = Math.PI / 2.4 + Math.sin(t * 0.3) * 0.12;
      ring1.current.rotation.z = t * 0.22;
    }
    if (ring2.current) {
      ring2.current.rotation.x = Math.PI / 1.8 + Math.cos(t * 0.22) * 0.1;
      ring2.current.rotation.y = -t * 0.16;
    }
  });

  return (
    <group position={[2.4, 0.1, 0]}>
      {/* Main distorted orb */}
      <Float speed={2.2} rotationIntensity={0.4} floatIntensity={0.9}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.55, 64]} />
          <MeshDistortMaterial
            color="#15152e"
            roughness={0.15}
            metalness={0.95}
            distort={0.42}
            speed={2.4}
            emissive="#4c1d95"
            emissiveIntensity={0.28}
          />
        </mesh>
      </Float>

      {/* Wireframe shell */}
      <mesh ref={wireRef} scale={1.32}>
        <icosahedronGeometry args={[1.55, 1]} />
        <meshBasicMaterial color="#8b5cf6" wireframe transparent opacity={0.14} />
      </mesh>

      {/* Orbit rings */}
      <mesh ref={ring1}>
        <torusGeometry args={[2.6, 0.016, 16, 140]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.55} />
      </mesh>
      <mesh ref={ring2}>
        <torusGeometry args={[3.1, 0.012, 16, 140]} />
        <meshBasicMaterial color="#e879f9" transparent opacity={0.4} />
      </mesh>

      {/* Satellite gems */}
      <Satellite position={[2.6, 0.4, 0.8]} color="#22d3ee" size={0.14} speed={1.4} />
      <Satellite position={[-2.2, -1.1, 1.2]} color="#e879f9" size={0.11} speed={1.1} />
      <Satellite position={[0.6, 2.4, -1.4]} color="#a78bfa" size={0.09} speed={1.7} />
    </group>
  );
}

function Satellite({ position, color, size, speed }: { position: [number, number, number]; color: string; size: number; speed: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    if (ref.current) {
      ref.current.rotation.x = t;
      ref.current.rotation.y = t * 1.3;
      ref.current.position.y = position[1] + Math.sin(t * 0.9) * 0.35;
    }
  });
  return (
    <mesh ref={ref} position={position}>
      <octahedronGeometry args={[size, 0]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.4} roughness={0.2} metalness={0.6} />
    </mesh>
  );
}

function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const { positions, colors } = useMemo(() => {
    const count = 700;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [new THREE.Color("#8b5cf6"), new THREE.Color("#22d3ee"), new THREE.Color("#e879f9")];
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2;
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.015;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.045} vertexColors transparent opacity={0.75} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Hologrid() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      const mat = ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.03;
    }
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.4, 0]}>
      <planeGeometry args={[40, 40, 48, 48]} />
      <meshBasicMaterial color="#8b5cf6" wireframe transparent opacity={0.1} />
    </mesh>
  );
}

export default function Scene3D() {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 42 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[6, 4, 4]} intensity={1.1} color="#c4b5fd" />
        <pointLight position={[4, 2, 3]} intensity={28} color="#8b5cf6" distance={20} />
        <pointLight position={[-3, -1, 2]} intensity={20} color="#22d3ee" distance={18} />
        <pointLight position={[0, 3, -2]} intensity={14} color="#e879f9" distance={16} />
        <Stars radius={90} depth={50} count={2800} factor={4} saturation={0.4} fade speed={0.8} />
        <Sparkles count={90} scale={[16, 9, 6]} size={2.4} speed={0.35} color="#a78bfa" opacity={0.55} position={[0, 0, -2]} />
        <Core />
        <ParticleField />
        <Hologrid />
        <Rig />
      </Canvas>
      {/* vignette + gradient masks */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_30%_45%,transparent_40%,#050508_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#050508] to-transparent" />
    </div>
  );
}
