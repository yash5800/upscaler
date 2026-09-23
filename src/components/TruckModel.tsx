import { useGLTF } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

// Meshes that roll (left/right wheels of all four axles)
const WHEEL_NAMES = [
  'tire_01_1', 'tire_01_3',
  'tire_02_1', 'tire_02_3',
  'tire_03_1', 'tire_03_3',
  'tire_04_1', 'tire_04_3',
]

// Offsets that put the truck's geometric center on the group origin
// and its wheels on the floor. (Model spans -2.76..16.6 on z, -0.03..4.02 on y)
const CENTER_OFFSET: [number, number, number] = [0, 0, -6.923]

export interface TruckModelProps {
  travelStart?: number
  travelEnd?: number
  duration?: number
  yaw?: number
  pathZ?: number
  scale?: number
  isActive?: boolean
  triggerId?: number
}

/**
 * Scroll-triggered 3D Truck Model:
 * Drives smoothly from right to left across the scene when triggered by scrolling into view.
 */
function TruckModel({
  travelStart = 48,
  travelEnd = -48,
  duration = 10,
  yaw = Math.PI / 2,
  pathZ = 0,
  scale = 1.55,
  isActive = false,
  triggerId = 0,
}: TruckModelProps) {
  const { scene } = useGLTF('/truck.glb')
  const groupRef = useRef<any>(null)
  const wheelsRef = useRef<any[]>([])

  // Collect wheel meshes from model
  useEffect(() => {
    if (!scene) return
    const wheels: any[] = []
    scene.traverse((child: any) => {
      if (child.isMesh && WHEEL_NAMES.includes(child.name)) {
        wheels.push(child)
      }
    })
    wheelsRef.current = wheels
  }, [scene])

  // Keep group at travelStart initially
  useEffect(() => {
    const group = groupRef.current
    if (!group) return
    group.position.x = travelStart
    group.position.z = pathZ
  }, [travelStart, pathZ])

  // Trigger drive from right to left when isActive becomes true or triggerId changes
  useEffect(() => {
    const group = groupRef.current
    if (!group || !scene) return

    // Scrolled out of view: reset to start
    if (!isActive) {
      gsap.killTweensOf(group.position)
      wheelsRef.current.forEach((wheel) => gsap.killTweensOf(wheel.rotation))
      group.position.x = travelStart
      wheelsRef.current.forEach((wheel) => {
        wheel.rotation.x = 0
      })
      return
    }

    // Scrolled into view: trigger drive animation from right to left
    gsap.killTweensOf(group.position)
    wheelsRef.current.forEach((wheel) => gsap.killTweensOf(wheel.rotation))

    group.position.x = travelStart
    wheelsRef.current.forEach((wheel) => {
      wheel.rotation.x = 0
    })

    const distance = Math.abs(travelEnd - travelStart)
    const wheelAngle = 45.6 * (distance / 50)
    // When moving right to left (+X to -X) with yaw = Math.PI/2, positive wheel rotation rolls forward
    const direction = travelEnd < travelStart ? -1 : 1

    // Smooth drive across viewport - loops continuously as long as user remains on the section
    gsap.fromTo(
      group.position,
      { x: travelStart },
      {
        x: travelEnd,
        duration,
        delay: 0.2, // Small cinematic pause when first scrolled into view
        ease: 'none',
        repeat: -1,
        repeatDelay: 0.8, // Brief realistic gap between passes
      }
    )

    // Wheels rolling synchronously on loop
    wheelsRef.current.forEach((wheel) => {
      gsap.fromTo(
        wheel.rotation,
        { x: 0 },
        {
          x: wheelAngle * direction,
          duration,
          delay: 0.2,
          ease: 'none',
          repeat: -1,
          repeatDelay: 0.8,
        }
      )
    })

    return () => {
      gsap.killTweensOf(group.position)
      wheelsRef.current.forEach((wheel) => gsap.killTweensOf(wheel.rotation))
    }
  }, [isActive, triggerId, scene, travelStart, travelEnd, duration])

  return (
    <group ref={groupRef} position={[travelStart, -2.2, pathZ]} rotation={[0, yaw, 0]} scale={scale}>
      <group position={CENTER_OFFSET}>
        <primitive object={scene} />
      </group>
    </group>
  )
}

export default TruckModel