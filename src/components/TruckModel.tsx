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
const LIFT = 2.03

/**
 * The trucking animation: the truck drives in a straight line and loops,
 * with its wheels rolling to match. Drop it inside a Canvas.
 *
 * Props
 * - travelStart/travelEnd: x-positions the truck cruises between (defaults
 *   drive nose-first right to left, fully out of frame at each end so the
 *   loop wrap is invisible)
 * - duration: seconds for one full pass
 * - yaw: rotation around Y, pointing the truck down its path
 * - pathZ: z-position of the drive path
 */
function TruckModel({
  travelStart = 55,
  travelEnd = -55,
  duration = 22,
  yaw = Math.PI / 2,
  pathZ = 0,
  scale = 1.6,
}: {
  travelStart?: number
  travelEnd?: number
  duration?: number
  yaw?: number
  pathZ?: number
  scale?: number
}) {
  const { scene } = useGLTF('/truck.glb')
  const groupRef = useRef<any>(null)

  useEffect(() => {
    const group = groupRef.current
    if (!group) return

    gsap.killTweensOf(group.position)
    group.position.x = travelStart
    group.position.z = pathZ

    const wheels: any[] = []
    scene?.traverse((child: any) => {
      if (child.isMesh && WHEEL_NAMES.includes(child.name)) {
        wheels.push(child)
      }
    })
    wheels.forEach((wheel) => gsap.killTweensOf(wheel.rotation))

    const distance = Math.abs(travelEnd - travelStart)
    const wheelAngle = 45.6 * (distance / 50)
    // When moving right to left (+X to -X) with yaw = Math.PI/2, positive wheel rotation rolls forward
    const direction = travelEnd < travelStart ? -1 : 1

    gsap.to(group.position, {
      x: travelEnd,
      duration,
      ease: 'none',
      repeat: -1,
    })

    wheels.forEach((wheel) => {
      gsap.to(wheel.rotation, {
        x: wheelAngle * direction,
        duration,
        ease: 'none',
        repeat: -1,
      })
    })

    return () => {
      gsap.killTweensOf(group.position)
      wheels.forEach((wheel) => gsap.killTweensOf(wheel.rotation))
    }
  }, [scene, travelStart, travelEnd, duration, pathZ])

  return (
    <group ref={groupRef} position={[0, -2.2, pathZ]} rotation={[0, yaw, 0]} scale={scale}>
      <group position={CENTER_OFFSET}>
        <primitive object={scene} />
      </group>
    </group>
  )
}

export default TruckModel