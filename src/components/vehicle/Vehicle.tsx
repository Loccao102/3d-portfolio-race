import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider, RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { useVehicleControls } from '../../hooks/useVehicleControls';
import { useGameStore, MILESTONE_WAYPOINTS } from '../../stores/useGameStore';
import { VehicleEffects } from './VehicleEffects';
import { FerrariModel } from './FerrariModel';
import { ContactShadows } from '@react-three/drei';
import { sound } from '../../lib/soundEngine';

interface VehicleProps {
  initialPosition?: [number, number, number];
}

export const Vehicle = React.forwardRef<RapierRigidBody, VehicleProps>(
  ({ initialPosition = [0, 1.2, 0] }, forwardedRef) => {
    const internalRef = useRef<RapierRigidBody>(null);
    const chassisMeshRef = useRef<THREE.Group>(null);
    const frontWheelsRef = useRef<(THREE.Group | null)[]>([]);
    const rearWheelsRef = useRef<(THREE.Group | null)[]>([]);
    const thrusterRef = useRef<THREE.Mesh>(null);
    const waypointArrowRef = useRef<THREE.Group>(null);
    const getControls = useVehicleControls();

    const playerProfile = useGameStore((state) => state.playerProfile);
    const setVehiclePos = useGameStore((state) => state.setVehiclePos);
    const targetWaypointId = useGameStore((state) => state.targetWaypoint);
    const tickRaceTimer = useGameStore((state) => state.tickRaceTimer);

    // Arcade Kinematic States
    const speedRef = useRef(0);
    const headingRef = useRef(0);
    const steerAngleRef = useRef(0);
    const posSyncCounter = useRef(0);

    const [vehicleFX, setVehicleFX] = useState({
      speed: 0,
      isAccelerating: false,
      isBraking: false,
      isReversing: false,
    });

    // Tuned Realistic Arcade Physics Parameters
    const MAX_FORWARD_SPEED = 24.0;
    const MAX_REVERSE_SPEED = 8.5; // Realistic lower top speed in reverse
    const ACCEL = 25.0;
    const REVERSE_ACCEL = 12.0;   // Progressive, gentle reverse acceleration
    const FORWARD_TURN_SPEED = 2.7;
    const REVERSE_TURN_SPEED = 2.1; // Smooth caster steering in reverse

    useFrame((_, delta) => {
      const body = (forwardedRef as React.RefObject<RapierRigidBody | null>)?.current || internalRef.current;
      if (!body) return;

      const controls = getControls();
      const clampedDelta = Math.min(delta, 0.05);

      // Tick global race timer if race is active
      tickRaceTimer(clampedDelta);

      // 1. Throttle / Acceleration & Realistic Reverse Dynamics
      if (controls.forward > 0) {
        // Forward drive
        speedRef.current = Math.min(speedRef.current + ACCEL * clampedDelta, MAX_FORWARD_SPEED);
      } else if (controls.forward < 0) {
        // Progressive Reverse drive
        speedRef.current = Math.max(speedRef.current - REVERSE_ACCEL * clampedDelta, -MAX_REVERSE_SPEED);
      } else {
        // Natural coasting rolling friction
        speedRef.current *= Math.pow(0.38, clampedDelta);
        if (Math.abs(speedRef.current) < 0.05) speedRef.current = 0;
      }

      // 2. Braking
      if (controls.brake) {
        speedRef.current *= Math.pow(0.015, clampedDelta);
      }

      const currentSpeed = speedRef.current;
      const isReversing = currentSpeed < -0.1 || controls.forward < 0;

      // 3. Realistic Steering Mechanics:
      // In a real car, steering in reverse turns the front wheels. Turning left (A) causes the rear of the car
      // to pivot left and the car's heading (nose) to swing right.
      if (controls.turn !== 0) {
        if (currentSpeed >= 0) {
          // Moving forward: normal steering scaled by forward velocity
          const steerAuthority = Math.min(1.0, currentSpeed / 2.5);
          headingRef.current += -controls.turn * FORWARD_TURN_SPEED * steerAuthority * clampedDelta;
        } else {
          // Moving in reverse: natural reverse turning physics
          const reverseAuthority = Math.min(1.0, Math.abs(currentSpeed) / 1.5);
          // Natural reverse pivot
          headingRef.current += controls.turn * REVERSE_TURN_SPEED * reverseAuthority * clampedDelta;
        }
      }

      // Front wheel steer angle calculation
      const targetSteerAngle = -controls.turn * 0.45;
      steerAngleRef.current = THREE.MathUtils.lerp(steerAngleRef.current, targetSteerAngle, 0.25);

      const heading = headingRef.current;

      // 4. Compute Velocity Vector
      const targetVx = -Math.sin(heading) * currentSpeed;
      const targetVz = -Math.cos(heading) * currentSpeed;

      const currentLinvel = body.linvel();
      body.setLinvel({ x: targetVx, y: Math.max(-20, currentLinvel.y), z: targetVz }, true);

      // Set rotation
      const halfAngle = heading / 2;
      body.setRotation({ x: 0, y: Math.sin(halfAngle), z: 0, w: Math.cos(halfAngle) }, true);

      // 5. Sound Engine Telemetry
      sound.updateEngineSpeed(Math.abs(currentSpeed));

      // 6. Visual Chassis Roll & Pitch Animation
      if (chassisMeshRef.current) {
        const speedRatio = Math.min(1.0, Math.abs(currentSpeed) / 10.0);
        const targetRoll = -controls.turn * speedRatio * (currentSpeed >= 0 ? 0.14 : -0.1);
        const targetPitch = currentSpeed >= 0 ? controls.forward * 0.05 : -0.04;

        chassisMeshRef.current.rotation.z = THREE.MathUtils.lerp(
          chassisMeshRef.current.rotation.z,
          targetRoll,
          0.15
        );
        chassisMeshRef.current.rotation.x = THREE.MathUtils.lerp(
          chassisMeshRef.current.rotation.x,
          targetPitch,
          0.15
        );
      }



      // 8. Visual Thruster Flame Intensity
      if (thrusterRef.current) {
        const isDrivingForward = controls.forward > 0 && currentSpeed > 0;
        const targetScale = isDrivingForward ? 1.0 + Math.random() * 0.4 : 0.2;
        thrusterRef.current.scale.set(1, 1, targetScale);
      }

      // 9. Sync Vehicle Coordinates to MiniMap Store (every 4 frames)
      posSyncCounter.current += 1;
      if (posSyncCounter.current >= 4) {
        posSyncCounter.current = 0;
        const translation = body.translation();
        setVehiclePos({ x: translation.x, z: translation.z, heading });
      }

      // 10. 3D Waypoint Compass Arrow pointing towards selected milestone
      if (waypointArrowRef.current) {
        const currentPos = body.translation();
        const targetWP = MILESTONE_WAYPOINTS.find((w) => w.id === targetWaypointId) || MILESTONE_WAYPOINTS[0];
        const dx = targetWP.x - currentPos.x;
        const dz = targetWP.z - currentPos.z;
        const targetAngle = Math.atan2(dx, dz);
        waypointArrowRef.current.rotation.y = targetAngle - heading;
      }

      // 11. State Sync for Lighting & Particles
      if (
        Math.abs(vehicleFX.speed - currentSpeed) > 0.8 ||
        (controls.forward > 0) !== vehicleFX.isAccelerating ||
        isReversing !== vehicleFX.isReversing
      ) {
        setVehicleFX({
          speed: Math.abs(currentSpeed),
          isAccelerating: controls.forward > 0,
          isBraking: controls.brake,
          isReversing,
        });
      }
    });

    return (
      <RigidBody
        ref={(node) => {
          (internalRef as any).current = node;
          if (typeof forwardedRef === 'function') forwardedRef(node);
          else if (forwardedRef) (forwardedRef as any).current = node;
        }}
        type="dynamic"
        colliders={false}
        position={initialPosition}
        enabledRotations={[false, true, false]}
        linearDamping={0.1}
        angularDamping={1.0}
        userData={{ type: 'vehicle' }}
      >
        {/* Chassis Box Physics Collider */}
        <CuboidCollider args={[0.85, 0.35, 1.5]} position={[0, 0.45, 0]} friction={0.0} />

        {/* 3D FLOATING CALLSIGN BADGE & WAYPOINT ARROW */}
        <group position={[0, 2.0, 0]}>
          {/* Waypoint Arrow */}
          <group ref={waypointArrowRef} position={[0, 0, 0]}>
            <mesh position={[0, 0, -0.6]} rotation={[-Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.18, 0.5, 4]} />
              <meshStandardMaterial
                color={playerProfile.accentColor}
                emissive={playerProfile.accentColor}
                emissiveIntensity={1.6}
              />
            </mesh>
          </group>

          {/* Floating Callsign Plate */}
          <group position={[0, 0.45, 0]}>
            <mesh>
              <boxGeometry args={[1.8, 0.28, 0.05]} />
              <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
            </mesh>
            <mesh position={[0, 0, 0.03]}>
              <planeGeometry args={[1.7, 0.22]} />
              <meshBasicMaterial color={playerProfile.accentColor} transparent opacity={0.3} />
            </mesh>
            <mesh position={[0, 0, 0.04]}>
              <boxGeometry args={[1.4, 0.04, 0.01]} />
              <meshBasicMaterial color={playerProfile.accentColor} />
            </mesh>
          </group>
        </group>

        {/* HIGH-FIDELITY FERRARI SPORTS CAR 3D MODEL */}
        <group ref={chassisMeshRef} position={[0, 0.02, 0]}>
          <FerrariModel
            bodyColor={playerProfile.bodyColor}
            accentColor={playerProfile.accentColor}
            speedRef={speedRef}
            steerAngleRef={steerAngleRef}
            isReversing={vehicleFX.isReversing}
            scale={0.95}
          />

          {/* Contact Shadows on the road */}
          <ContactShadows
            position={[0, 0.02, 0]}
            opacity={0.65}
            scale={5.5}
            blur={1.8}
            far={1.6}
            color="#000000"
          />

          {/* Thruster Flame when accelerating */}
          <mesh
            ref={thrusterRef}
            position={[0, 0.35, 2.1]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.2, 0.02, 0.8, 8, 1, true]} />
            <meshBasicMaterial
              color={playerProfile.accentColor}
              transparent
              opacity={0.6}
            />
          </mesh>

          {/* Vehicle Micro-Interactions */}
          <VehicleEffects
            speed={vehicleFX.speed}
            isAccelerating={vehicleFX.isAccelerating}
            isBraking={vehicleFX.isBraking}
          />
        </group>
      </RigidBody>
    );
  }
);

Vehicle.displayName = 'Vehicle';
