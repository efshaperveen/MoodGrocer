import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshWobbleMaterial, OrbitControls } from "@react-three/drei";

function FloatingSphere({ mood }) {
  const ref = useRef();
  // color based on mood
  const color = useMemo(() => {
    if (mood === "Tired") return "#6B7280"; // cool slate
    if (mood === "Happy") return "#FDE68A";
    if (mood === "Stressed") return "#FCA5A5";
    if (mood === "Busy") return "#A7F3D0";
    return "#93C5FD";
  }, [mood]);

  useFrame((state, delta) => {
    ref.current.rotation.y += delta * 0.3;
    ref.current.rotation.x += delta * 0.15;
    // gentle bob
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
  });

  return (
    <mesh ref={ref} position={[0, 0.2, 0]}>
      <sphereGeometry args={[1.2, 48, 48]} />
      {/* MeshWobbleMaterial adds subtle animation */}
      <MeshWobbleMaterial factor={0.6} speed={1} attach="material" color={color} metalness={0.4} roughness={0.3} />
    </mesh>
  );
}

export default function LoginScene({ mood }) {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <FloatingSphere mood={mood} />
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
