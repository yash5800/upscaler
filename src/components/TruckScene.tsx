import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { Suspense } from 'react'
import TruckModel from './TruckModel'

/**
 * Full-screen 3D background: the trucking animation drives the truck
 * continuously across the scene behind the landing page UI.
 */
function Floor() {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -0.02, 0]} receiveShadow>
      <planeGeometry args={[220, 90]} />
      <meshStandardMaterial color="#050507" metalness={0.2} roughness={0.8} />
    </mesh>
  )
}

function Scene() {
  return (
    <>
      <color attach="background" args={['#050507']} />
      <fog attach="fog" args={['#050507', 35, 120]} />

      {/* Base ambient light */}
      <ambientLight intensity={0.6} />

      {/* Main Front Headlight / Front Key light highlighting the oncoming truck */}
      <directionalLight
        position={[25, 18, 20]}
        intensity={2.2}
        color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-camera-near={1}
        shadow-camera-far={120}
      />

      {/* Electric Mint Accent Rim light matching Pixelify theme */}
      <directionalLight position={[0, 8, 25]} intensity={1.5} color="#00FF85" />

      {/* Side fill light */}
      <directionalLight position={[-25, 12, -15]} intensity={0.8} color="#7db8ff" />

      {/* Rear fill light */}
      <directionalLight position={[-15, 6, -20]} intensity={0.5} color="#ffb020" />

      <Suspense fallback={null}>
        <TruckModel travelStart={55} travelEnd={-55} duration={18} yaw={Math.PI / 2} pathZ={0} scale={1.55} />
        <Environment preset="city" />
      </Suspense>
    </>
  )
}

export default function TruckScene() {
  return (
    <div className="truck-scene w-full h-full">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 3.2, 18.5], fov: 40, near: 0.1, far: 400 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}