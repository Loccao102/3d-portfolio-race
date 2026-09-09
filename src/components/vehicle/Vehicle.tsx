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
import { LOCAL_VEHICLE_TYPE } from './localPhysics';

interface VehicleProps {
  initialPosition?: [number, number, number];
}

export const Vehicle = React.forwardRef<RapierRigidBody, VehicleProps>(
  ({ initialPosition = [0, 1.2, 14] }, forwardedRef) => {
    const internalRef = useRef<RapierRigidBody>(null);
    const chassisMeshRef = useRef<THREE.Group>(null);
    const thrusterRef = useRef<THREE.Mesh>(null);
    const waypointArrowRef = useRef<THREE.Group>(null);
    const getControls = useVehicleControls();

    const playerProfile = useGameStore((state) => state.playerProfile);
    const setVehiclePos = useGameStore((state) => state.setVehiclePos);
    const setVehicleSpeed = useGameStore((state) => state.setVehicleSpeed);
    const setIsBoosting = useGameStore((state) => state.setIsBoosting);
    const targetWaypointId = useGameStore((state) => state.targetWaypoint);
    const tickRaceTimer = useGameStore((state) => state.tickRaceTimer);
    const quality = useGameStore((state) => state.quality);

    // Arcade Kinematic States
    const speedRef = useRef(0);
    const headingRef = useRef(0);
    const yawRateRef = useRef(0);
    const steerAngleRef = useRef(0);
    const posSyncCounter = useRef(0);
    const wasBoostingRef = useRef(false);

    const [vehicleFX, setVehicleFX] = useState({
      speed: 0,
      isAccelerating: false,
      isBraking: false,
      isReversing: false,
      isBoosting: false,
    });

    // Tuned Realistic Arcade Physics Parameters with Nitro Boost
    const BASE_MAX_SPEED = 24.0;
    const BOOST_MAX_SPEED = 36.0;
    const MAX_REVERSE_SPEED = 8.5; // Realistic lower top speed in reverse
    const BASE_ACCEL = 25.0;
    const BOOST_ACCEL = 48.0;     // Instant acceleration burst during Nitro
    const REVERSE_ACCEL = 12.0;   // Progressive, gentle reverse acceleration

    useFrame((_, delta) => {
      const body = (forwardedRef as React.RefObject<RapierRigidBody | null>)?.current || internalRef.current;
      if (!body) return;

      const controls = getControls();
      const clampedDelta = Math.min(delta, 0.05);

      // 0. Quick Respawn / Reset to track
      if (controls.reset) {
        body.setTranslation({ x: 0, y: 1.2, z: 14 }, true);
        body.setLinvel({ x: 0, y: 0, z: 0 }, true);
        body.setAngvel({ x: 0, y: 0, z: 0 }, true);
        speedRef.current = 0;
        headingRef.current = 0;
        yawRateRef.current = 0;
        body.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
        sound.playClick();
        return;
      }

      // Tick global race timer if race is active
      tickRaceTimer(clampedDelta);

      // 1. Throttle / Acceleration & Realistic Reverse Dynamics (with Nitro Boost)
      const isBoosting = controls.boost && controls.forward > 0;
      const maxSpeed = isBoosting ? BOOST_MAX_SPEED : BASE_MAX_SPEED;
      const currentAccel = isBoosting ? BOOST_ACCEL : BASE_ACCEL;

      if (controls.forward > 0) {
        // Forward drive
        speedRef.current = Math.min(speedRef.current + currentAccel * clampedDelta, maxSpeed);
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

      // 3. Cornering Drag & Tire Scrub (Loss of speed when turning)
      // When tires turn, lateral tire scrub naturally dissipates speed
      const turnAmount = Math.abs(controls.turn);
      if (turnAmount > 0.05 && Math.abs(speedRef.current) > 1.0) {
        const scrubIntensity = isBoosting ? 8.0 : 13.5;
        const corneringDecel = turnAmount * scrubIntensity * Math.min(1.0, Math.abs(speedRef.current) / 10.0);
        const sign = Math.sign(speedRef.current);
        const newSpeedMag = Math.max(0, Math.abs(speedRef.current) - corneringDecel * clampedDelta);
        speedRef.current = sign * newSpeedMag;
      }

      const currentSpeed = speedRef.current;
      const isReversing = currentSpeed < -0.1 || controls.forward < 0;

      // 4. Smooth, Progressive Steering Mechanics (Eliminates snappy / twitchy instant pivots)
      // Speed-sensitive steering: at higher speeds, steering rate is lower for stability (~1.15 rad/s);
      // at lower speeds, steering rate is higher for nimble parking/maneuvering (~1.85 rad/s).
      const speedRatio = Math.min(1.0, Math.abs(currentSpeed) / 24.0);
      const dynamicTurnSpeed = THREE.MathUtils.lerp(1.85, 1.15, speedRatio);
      const steerAuthority = currentSpeed >= 0
        ? Math.min(1.0, Math.max(0.4, currentSpeed / 3.0))
        : Math.min(1.0, Math.max(0.4, Math.abs(currentSpeed) / 2.0));

      const targetYawRate = (currentSpeed >= 0 ? -controls.turn : controls.turn) * dynamicTurnSpeed * steerAuthority;

      // Smooth yaw rate interpolation gives vehicle rotation mass, weight, and inertia
      yawRateRef.current = THREE.MathUtils.lerp(yawRateRef.current, targetYawRate, clampedDelta * 12.0);
      headingRef.current += yawRateRef.current * clampedDelta;

      // Front wheel steer angle calculation
      const targetSteerAngle = -controls.turn * 0.42;
      steerAngleRef.current = THREE.MathUtils.lerp(steerAngleRef.current, targetSteerAngle, 0.2);

      const heading = headingRef.current;

      // 5. Compute Lateral Momentum / Drift & Forward Velocity
      const fwdX = -Math.sin(heading);
      const fwdZ = -Math.cos(heading);
      const rightX = Math.cos(heading);
      const rightZ = -Math.sin(heading);

      const currentLinvel = body.linvel();
      const currentLateralSpeed = currentLinvel.x * rightX + currentLinvel.z * rightZ;
      // Lateral grip damps sideways sliding smoothly (creates authentic sportscar drift feel)
      const lateralGrip = 9.0;
      const newLateralSpeed = currentLateralSpeed * Math.exp(-lateralGrip * clampedDelta);

      const targetVx = fwdX * currentSpeed + rightX * newLateralSpeed;
      const targetVz = fwdZ * currentSpeed + rightZ * newLateralSpeed;

      body.setLinvel({ x: targetVx, y: Math.max(-20, currentLinvel.y), z: targetVz }, true);

      // Direct, responsive yaw heading rotation
      const halfAngle = heading / 2;
      body.setRotation({ x: 0, y: Math.sin(halfAngle), z: 0, w: Math.cos(halfAngle) }, true);

      // 6. Sound Engine Telemetry & Nitro Sound Trigger
      sound.updateEngineSpeed(Math.abs(currentSpeed));
      if (isBoosting && !wasBoostingRef.current) {
        sound.playNitroBoost();
      }
      wasBoostingRef.current = isBoosting;

      // 7. Visual Chassis Roll & Pitch Animation
      if (chassisMeshRef.current) {
        const targetRoll = -yawRateRef.current * 0.08 * (currentSpeed >= 0 ? 1 : -1);
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

      // 8. Visual Thruster Flame Intensity (Amplified during Nitro Boost)
      if (thrusterRef.current) {
        const isDrivingForward = controls.forward > 0 && currentSpeed > 0;
        const targetScale = isBoosting
          ? 2.4 + Math.random() * 0.8
          : isDrivingForward
          ? 1.0 + Math.random() * 0.4
          : 0.2;
        thrusterRef.current.scale.set(isBoosting ? 1.4 : 1, isBoosting ? 1.4 : 1, targetScale);
      }

      // 9. Sync Vehicle Coordinates to MiniMap & Speedometer Store (every 4 frames)
      posSyncCounter.current += 1;
      if (posSyncCounter.current >= 4) {
        posSyncCounter.current = 0;
        const translation = body.translation();
        setVehiclePos({ x: translation.x, z: translation.z, heading });
        // km/h = m/s × 3.6; clamp to 0
        setVehicleSpeed(Math.max(0, Math.round(Math.abs(currentSpeed) * 3.6)));
        setIsBoosting(isBoosting);
      }

      // 10. 3D Waypoint Compass Arrow pointing towards selected milestone
      if (waypointArrowRef.current) {
        const currentPos = body.translation();
        const targetWP = MILESTONE_WAYPOINTS.find((w) => w.id === targetWaypointId) || MILESTONE_WAYPOINTS[0];
        const dx = targetWP.x - currentPos.x;
        const dz = targetWP.z - currentPos.z;
        // Transform direction vector into vehicle's local frame
        const localRight = dx * Math.cos(heading) - dz * Math.sin(heading);
        const localForward = -dx * Math.sin(heading) - dz * Math.cos(heading);
        waypointArrowRef.current.rotation.y = -Math.atan2(localRight, localForward);
      }

      // 11. State Sync for Lighting & Particles
      if (
        Math.abs(vehicleFX.speed - Math.abs(currentSpeed)) > 0.8 ||
        (controls.forward > 0) !== vehicleFX.isAccelerating ||
        controls.brake !== vehicleFX.isBraking ||
        isReversing !== vehicleFX.isReversing ||
        isBoosting !== vehicleFX.isBoosting
      ) {
        setVehicleFX({
          speed: Math.abs(currentSpeed),
          isAccelerating: controls.forward > 0,
          isBraking: controls.brake,
          isReversing,
          isBoosting,
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
        ccd={true}
        position={initialPosition}
        enabledRotations={[false, true, false]}
        linearDamping={0.1}
        angularDamping={1.0}
        userData={{ type: LOCAL_VEHICLE_TYPE, localPlayer: true }}
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

          {/* Contact Shadows on the road (High quality only for mobile performance) */}
          {quality !== 'low' ? (
            <ContactShadows
              position={[0, 0.02, 0]}
              opacity={0.65}
              scale={5.5}
              blur={1.8}
              far={1.6}
              color="#000000"
            />
          ) : (
            <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[2.4, 4.4]} />
              <meshBasicMaterial color="#000000" transparent opacity={0.35} />
            </mesh>
          )}

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
            isBoosting={vehicleFX.isBoosting}
          />
        </group>
      </RigidBody>
    );
  }
);

Vehicle.displayName = 'Vehicle';
