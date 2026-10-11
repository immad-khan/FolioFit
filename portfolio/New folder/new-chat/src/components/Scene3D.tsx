import { useEffect, useRef, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";

/* Follows the global pointer with damped rotation */
function Rig({ children }: { children: ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, target.current.x * 0.35, 2.2, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, target.current.y * 0.22, 2.2, delta);
  });

  return <group ref={group}>{children}</group>;
}

/* Hero centerpiece — liquid chrome torus knot */
function ChromeKnot() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += delta * 0.1;
    mesh.current.rotation.z += delta * 0.16;
  });
  return (
    <Float speed={1.6} rotationIntensity={0.55} floatIntensity={1.15}>
      <mesh ref={mesh} position={[0.9, 0.15, 0]}>
        <torusKnotGeometry args={[1.05, 0.34, 260, 44]} />
        <MeshDistortMaterial
          color="#17171f"
          metalness={0.55}
          roughness={0.16}
          distort={0.42}
          speed={1.7}
        />
      </mesh>
    </Float>
  );
}

/* Oversized wireframe icosahedron for depth */
function WireCage() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.y -= delta * 0.05;
    mesh.current.rotation.x -= delta * 0.03;
  });
  return (
    <mesh ref={mesh} position={[0.9, 0.15, -0.6]}>
      <icosahedronGeometry args={[2.7, 1]} />
      <meshBasicMaterial wireframe color="#c9f31d" transparent opacity={0.1} />
    </mesh>
  );
}

function Orb({ position, size }: { position: [number, number, number]; size: number }) {
  return (
    <Float speed={2.2} rotationIntensity={1.4} floatIntensity={2}>
      <mesh position={position}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial color="#dcdce8" metalness={0.9} roughness={0.15} />
      </mesh>
    </Float>
  );
}

export default function Scene3D() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <Canvas camera={{ position: [0, 0, 6.5], fov: 42 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 3, 6]} intensity={2.6} color="#c9f31d" />
        <directionalLight position={[-5, -2, 3]} intensity={1.9} color="#7c5cff" />
        <directionalLight position={[0, -4, -4]} intensity={0.7} color="#ffffff" />
        <Rig>
          <ChromeKnot />
          <WireCage />
          <Orb position={[-2.7, 1.3, -1]} size={0.17} />
          <Orb position={[3.1, -1.5, -2]} size={0.26} />
          <Orb position={[-2.1, -1.9, -0.4]} size={0.13} />
          <Sparkles count={130} scale={[11, 6.5, 5]} size={2} speed={0.35} color="#c9f31d" opacity={0.55} />
          <Sparkles count={80} scale={[12, 7, 6]} size={1.2} speed={0.25} color="#ffffff" opacity={0.4} />
        </Rig>
      </Canvas>
    </div>
  );
}
