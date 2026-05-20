import { useRef, useEffect, Suspense, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, Sparkles } from "@react-three/drei";
import * as THREE from "three";

useGLTF.preload("/models/crystal.glb");

function CrystalMouseTracker({ groupRef }) {
  const { size } = useThree();
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const autoY = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / size.width - 0.5) * 2;
      const y = -(e.clientY / size.height - 0.5) * 2;
      targetRotation.current = { x: y * 0.3, y: x * 0.45 };
    };
    const handleTouchMove = (e) => {
      if (!e.touches[0]) return;
      const x = (e.touches[0].clientX / size.width - 0.5) * 2;
      const y = -(e.touches[0].clientY / size.height - 0.5) * 2;
      targetRotation.current = { x: y * 0.3, y: x * 0.45 };
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [size]);

  useFrame((state) => {
    if (!groupRef.current) return;
    currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.04;
    currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.04;
    autoY.current += 0.007;
    groupRef.current.rotation.x = currentRotation.current.x;
    groupRef.current.rotation.y = autoY.current + currentRotation.current.y;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
  });

  return null;
}

function CrystalModel({ glowIntensity, isMobile }) {
  const { scene } = useGLTF("/models/crystal.glb");
  const groupRef = useRef();
  const meshesRef = useRef([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!scene) return;
    const cloned = scene.clone(true);
    const box = new THREE.Box3().setFromObject(cloned);
    const center = box.getCenter(new THREE.Vector3());
    cloned.position.set(-center.x, -center.y, -center.z);
    const sz = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(sz.x, sz.y, sz.z);
    const targetSize = isMobile ? 3.2 : 4.5;
    cloned.scale.setScalar(targetSize / maxDim);

    meshesRef.current = [];
    cloned.traverse((child) => {
      if (child.isMesh) {
        meshesRef.current.push(child);
        child.material = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color("#1D9E75"),
          emissive: new THREE.Color("#0d7a5a"),
          emissiveIntensity: 0.6,
          metalness: 0.3,
          roughness: 0.1,
          transmission: 0.6,
          thickness: 1.5,
          clearcoat: 1,
          clearcoatRoughness: 0.05,
          ior: 2.0,
          envMapIntensity: 1.5,
          transparent: true,
          opacity: 0.95,
        });
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    if (groupRef.current) {
      while (groupRef.current.children.length > 0) {
        groupRef.current.remove(groupRef.current.children[0]);
      }
      groupRef.current.add(cloned);
    }
    setReady(true);
  }, [scene, isMobile]);

  useFrame(() => {
    meshesRef.current.forEach((mesh) => {
      if (mesh.material) {
        const target = 0.6 + glowIntensity.current * 5;
        mesh.material.emissiveIntensity +=
          (target - mesh.material.emissiveIntensity) * 0.15;
      }
    });
    // ✅ Slower decay
    glowIntensity.current *= 0.97;
  });

  return (
    <>
      <group ref={groupRef} position={[0, 0, 0]} />
      {ready && <CrystalMouseTracker groupRef={groupRef} />}
    </>
  );
}

// ✅ Glow fix — direct opacity set
function BoundaryGlow({ glowIntensity, isMobile }) {
  const innerRef = useRef();
  const outerRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (innerRef.current) {
      // ✅ Direct set — visible immediately on hover
      innerRef.current.material.opacity = glowIntensity.current * 0.8;
      innerRef.current.scale.setScalar(
        1 + Math.sin(t * 2) * 0.04 + glowIntensity.current * 0.2
      );
    }
    if (outerRef.current) {
      outerRef.current.material.opacity = glowIntensity.current * 0.4;
      outerRef.current.scale.setScalar(
        1 + Math.sin(t * 1.5) * 0.03 + glowIntensity.current * 0.15
      );
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={innerRef}>
        <sphereGeometry args={[isMobile ? 2.5 : 3.2, 32, 32]} />
        <meshBasicMaterial
          color="#1D9E75" transparent opacity={0}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide} depthWrite={false}
        />
      </mesh>
      <mesh ref={outerRef}>
        <sphereGeometry args={[isMobile ? 3.5 : 4.5, 32, 32]} />
        <meshBasicMaterial
          color="#4ecba0" transparent opacity={0}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide} depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function CinematicLights({ glowIntensity }) {
  const glowLightRef = useRef();
  useFrame(() => {
    if (glowLightRef.current) {
      // ✅ Dramatic glow on interaction
      glowLightRef.current.intensity = 1.5 + glowIntensity.current * 8;
    }
  });
  return (
    <>
      <ambientLight intensity={0.4} color="#1D9E75" />
      <directionalLight position={[5, 8, 5]} intensity={1} color="#ffffff" castShadow />
      <directionalLight position={[-5, -3, 3]} intensity={0.5} color="#4ecba0" />
      <pointLight ref={glowLightRef} position={[0, 0, 4]} intensity={1.5} color="#4ecba0" distance={12} />
      <pointLight position={[-4, 3, -3]} intensity={1} color="#1D9E75" distance={8} />
      <pointLight position={[4, -3, -3]} intensity={0.8} color="#ffffff" distance={6} />
    </>
  );
}

function FallbackOrb() {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
    }
  });
  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2, 1]} />
      <meshStandardMaterial color="#1D9E75" emissive="#1D9E75" emissiveIntensity={0.8} wireframe transparent opacity={0.5} />
    </mesh>
  );
}

export default function Scene3D({ isMobile = false }) {
  const glowIntensity = useRef(0);
  const containerRef = useRef(null);

  // ✅ Bigger radius + higher intensity
  const handleInteraction = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const cx = rect.left + rect.width * 0.5;
    const cy = rect.top + rect.height * 0.5;
    const dist = Math.sqrt((clientX - cx) ** 2 + (clientY - cy) ** 2);
    // ✅ 70% of container — easy to trigger
    const radius = Math.min(rect.width, rect.height) * 0.7;
    if (dist < radius) {
      const proximity = 1 - dist / radius;
      glowIntensity.current = Math.max(glowIntensity.current, proximity * 2.0);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", touchAction: "none" }}
      onMouseMove={handleInteraction}
      onTouchMove={handleInteraction}
      onTouchStart={handleInteraction}
    >
      <Canvas
        camera={{ position: [0, 0, 9], fov: 48 }}
        style={{ background: "transparent" }}
        gl={{
          alpha: true, antialias: !isMobile,
          powerPreference: isMobile ? "low-power" : "high-performance",
          stencil: false, depth: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.3,
        }}
        dpr={[1, Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2)]}
        shadows
      >
        <CinematicLights glowIntensity={glowIntensity} />
        <Environment preset="night" background={false} />
        <BoundaryGlow glowIntensity={glowIntensity} isMobile={isMobile} />
        <Suspense fallback={<FallbackOrb />}>
          <CrystalModel glowIntensity={glowIntensity} isMobile={isMobile} />
        </Suspense>
        <Sparkles
          count={isMobile ? 15 : 45}
          scale={isMobile ? 5 : 8}
          size={isMobile ? 1 : 1.8}
          speed={0.25} opacity={0.35}
          color="#4ecba0" position={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}