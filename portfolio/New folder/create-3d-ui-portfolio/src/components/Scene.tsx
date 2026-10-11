import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, OrbitControls, GradientTexture } from '@react-three/drei';
import * as THREE from 'three';

const AnimatedSphere = () => {
  const sphereRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    sphereRef.current.rotation.x = Math.cos(t / 4) / 2;
    sphereRef.current.rotation.y = Math.sin(t / 4) / 2;
    sphereRef.current.position.y = Math.sin(t / 1.5) / 10;
  });

  return (
    <Float speed={1.4} rotationIntensity={2} floatIntensity={2}>
      <Sphere ref={sphereRef} args={[1, 100, 100]} scale={1.5}>
        <MeshDistortMaterial
          color="#4f46e5"
          attach="material"
          distort={0.5}
          speed={2}
          roughness={0}
        />
      </Sphere>
    </Float>
  );
};

const BackgroundShapes = () => {
  return (
    <>
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <mesh position={[-4, 2, -2]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#818cf8" wireframe />
        </mesh>
      </Float>
      <Float speed={3} rotationIntensity={2} floatIntensity={1}>
        <mesh position={[4, -2, -1]}>
          <torusGeometry args={[0.7, 0.2, 16, 100]} />
          <meshStandardMaterial color="#c084fc" wireframe />
        </mesh>
      </Float>
      <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[0, -3, -3]}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#2dd4bf" wireframe />
        </mesh>
      </Float>
    </>
  );
};

const Scene = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 bg-slate-950">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        
        <AnimatedSphere />
        <BackgroundShapes />
        
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};

export default Scene;
