import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, MeshDistortMaterial, Sphere } from "@react-three/drei";
import * as THREE from "three";

// ✅ Performance checks
const isMobile = window.innerWidth <= 768;
const isLowEnd = navigator.hardwareConcurrency <= 4;
const reduceQuality = isMobile || isLowEnd;

// ============ Color Shifting Morphing Crystal ============
function MorphingCrystal() {
  const meshRef = useRef();
  const colorRef = useRef({ h: 0.45 });

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    colorRef.current.h += 0.0008;
    if (colorRef.current.h > 0.85) colorRef.current.h = 0.45;
    const color = new THREE.Color().setHSL(colorRef.current.h, 0.8, 0.6);
    meshRef.current.material.color = color;
    meshRef.current.material.emissive = color;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.3, 1]} />
        <MeshDistortMaterial
          color="#1D9E75"
          distort={reduceQuality ? 0.2 : 0.4}
          speed={reduceQuality ? 1.5 : 2.5}
          roughness={0} metalness={1}
          transparent opacity={0.9}
          emissive="#1D9E75" emissiveIntensity={0.3}
        />
      </mesh>
      <Sphere args={[0.95, reduceQuality ? 32 : 64, reduceQuality ? 32 : 64]}>
        <meshStandardMaterial color="#c0c0c0" metalness={1} roughness={0} transparent opacity={0.15} />
      </Sphere>
      <Sphere args={[1.55, 32, 32]}>
        <meshStandardMaterial color="#1D9E75" transparent opacity={0.04} roughness={0} metalness={0} />
      </Sphere>
    </Float>
  );
}

// ============ Wireframe Crystal ============
function WireframeCrystal() {
  const meshRef = useRef();
  const colorRef = useRef({ h: 0.45 });

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = -state.clock.elapsedTime * 0.08;
    meshRef.current.rotation.y = -state.clock.elapsedTime * 0.12;
    meshRef.current.rotation.z =  state.clock.elapsedTime * 0.05;
    colorRef.current.h += 0.0008;
    if (colorRef.current.h > 0.85) colorRef.current.h = 0.45;
    const color = new THREE.Color().setHSL(colorRef.current.h, 0.7, 0.6);
    meshRef.current.material.color = color;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.75, 1]} />
      <meshStandardMaterial color="#1D9E75" transparent opacity={0.1} wireframe metalness={1} roughness={0} />
    </mesh>
  );
}

// ============ Neural Network ============
function NeuralNetwork() {
  const groupRef = useRef();
  const nodeCount = reduceQuality ? 10 : 20; // ✅ Reduce on low-end

  const nodes = useMemo(() => {
    const pts = [];
    for (let i = 0; i < nodeCount; i++) {
      pts.push({
        id: i,
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * 7,
          (Math.random() - 0.5) * 7,
          (Math.random() - 0.5) * 3
        ),
        speed: Math.random() * 0.4 + 0.2,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return pts;
  }, []);

  const connections = useMemo(() => {
    const lines = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = nodes[i].pos.distanceTo(nodes[j].pos);
        if (dist < 3.5) lines.push({ from: nodes[i].pos, to: nodes[j].pos, dist });
      }
    }
    return lines;
  }, [nodes]);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.04) * 0.08;
  });

  return (
    <group ref={groupRef}>
      {connections.map((conn, i) => {
        const geo = new THREE.BufferGeometry().setFromPoints([conn.from, conn.to]);
        return (
          <line key={i} geometry={geo}>
            <lineBasicMaterial color="#1D9E75" transparent opacity={Math.max(0.03, 0.18 - conn.dist * 0.04)} />
          </line>
        );
      })}
      {nodes.map((node, i) => <NeuralNode key={i} node={node} />)}
    </group>
  );
}

function NeuralNode({ node }) {
  const meshRef = useRef();
  const colorRef = useRef({ h: 0.45 + Math.random() * 0.3 });

  useFrame((state) => {
    if (!meshRef.current) return;
    const pulse = Math.sin(state.clock.elapsedTime * node.speed + node.phase);
    meshRef.current.scale.setScalar(0.7 + pulse * 0.35);
    meshRef.current.material.opacity = 0.3 + pulse * 0.4;
    colorRef.current.h += 0.001;
    if (colorRef.current.h > 0.85) colorRef.current.h = 0.45;
    const color = new THREE.Color().setHSL(colorRef.current.h, 0.8, 0.65);
    meshRef.current.material.color = color;
    meshRef.current.material.emissive = color;
  });

  return (
    <mesh ref={meshRef} position={node.pos}>
      <sphereGeometry args={[0.06, 16, 16]} />
      <meshStandardMaterial
        color="#4ecba0" transparent opacity={0.6}
        metalness={1} roughness={0}
        emissive="#1D9E75" emissiveIntensity={0.6}
      />
    </mesh>
  );
}

// ============ Energy Rings ============
function EnergyRing({ radius, tilt, speed, hueOffset = 0 }) {
  const ringRef = useRef();
  const colorRef = useRef({ h: 0.45 + hueOffset });

  useFrame((state) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.z = state.clock.elapsedTime * speed;
    colorRef.current.h += 0.0006;
    if (colorRef.current.h > 0.85) colorRef.current.h = 0.45;
    const color = new THREE.Color().setHSL(colorRef.current.h, 0.8, 0.6);
    ringRef.current.material.color = color;
    ringRef.current.material.emissive = color;
  });

  return (
    <mesh ref={ringRef} rotation={tilt}>
      <torusGeometry args={[radius, 0.013, 16, 100]} />
      <meshStandardMaterial
        color="#1D9E75" transparent opacity={0.3}
        metalness={1} roughness={0}
        emissive="#1D9E75" emissiveIntensity={0.4}
      />
    </mesh>
  );
}

// ============ Particles ============
function Particles() {
  const points = useRef();
  const count = reduceQuality ? 60 : 150; // ✅ Reduce on low-end

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 11;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 11;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
      const c = new THREE.Color().setHSL(0.45 + Math.random() * 0.35, 0.8, 0.65);
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((state) => {
    if (!points.current) return;
    points.current.rotation.y = state.clock.elapsedTime * 0.025;
    points.current.rotation.x = state.clock.elapsedTime * 0.01;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color"    count={count} array={colors}    itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.045} vertexColors transparent opacity={0.75} sizeAttenuation />
    </points>
  );
}

// ============ Main Export ============
export default function Scene3D() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 52 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: !reduceQuality }}  // ✅ antialias off on low-end
        dpr={[1, reduceQuality ? 1 : 1.5]}               // ✅ DPR limit
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
        <pointLight position={[0, 0, 4]}    intensity={2}   color="#1D9E75" />
        <pointLight position={[-4, -4, -2]} intensity={0.8} color="#7c3aed" />
        <pointLight position={[4, 4, 2]}    intensity={0.6} color="#0066ff" />

        <NeuralNetwork />
        <MorphingCrystal />
        <WireframeCrystal />

        <EnergyRing radius={1.95} tilt={[0, 0, 0]}                    speed={0.4}   hueOffset={0}   />
        <EnergyRing radius={2.15} tilt={[Math.PI/3, 0, 0]}            speed={-0.3}  hueOffset={0.1} />
        <EnergyRing radius={2.35} tilt={[Math.PI/6, Math.PI/4, 0]}    speed={0.2}   hueOffset={0.2} />
        <EnergyRing radius={2.55} tilt={[Math.PI/2, Math.PI/6, 0]}    speed={-0.15} hueOffset={0.3} />

        <Particles />

        <OrbitControls
          enableZoom={false} enablePan={false}
          autoRotate autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 1.7}
          minPolarAngle={Math.PI / 3.5}
        />
      </Canvas>
    </div>
  );
}