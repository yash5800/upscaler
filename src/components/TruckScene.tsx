import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { Suspense, useEffect, useRef, useState } from 'react'
import TruckModel from './TruckModel'

/**
 * 3D Background Scene: The truck animation is triggered when the user scrolls
 * down to this section, driving smoothly from right to left across the screen.
 */
function Scene({ isActive, triggerId }: { isActive: boolean; triggerId: number }) {
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
        <TruckModel
          travelStart={50}
          travelEnd={-50}
          duration={10}
          yaw={Math.PI / 2}
          pathZ={0}
          scale={1.55}
          isActive={isActive}
          triggerId={triggerId}
        />
        <Environment preset="city" />
      </Suspense>
    </>
  )
}

export default function TruckScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [triggerId, setTriggerId] = useState(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          setTriggerId((prev) => prev + 1)
        } else {
          setIsInView(false)
        }
      },
      {
        threshold: 0.15, // Trigger when 15% of the section is visible in the viewport
        rootMargin: '0px 0px -40px 0px',
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleReplay = () => {
    setTriggerId((prev) => prev + 1)
  }

  return (
    <div
      ref={containerRef}
      className="truck-scene w-full h-full relative cursor-pointer"
      onClick={handleReplay}
      title="Click to replay drive"
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 3.2, 18.5], fov: 40, near: 0.1, far: 400 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Scene isActive={isInView} triggerId={triggerId} />
      </Canvas>
    </div>
  )
}