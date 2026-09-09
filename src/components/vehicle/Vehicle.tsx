import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  RigidBody,
  CuboidCollider,
  RapierRigidBody,
  useAfterPhysicsStep,
  useBeforePhysicsStep,
} from '@react-three/rapier';
import * as THREE from 'three';
import { useVehicleControls } from '../../hooks/useVehicleControls';
import { useGameStore, MILESTONE_WAYPOINTS } from '../../stores/useGameStore';
import { useNetworkStore } from '../../stores/useNetworkStore';
import { VehicleEffects } from './VehicleEffects';
import { FerrariModel } from './FerrariModel';
import { ContactShadows } from '@react-three/drei';
import { sound } from '../../lib/soundEngine';
import {
  createVehicleControllerState,
  getVehicleHeading,
  getVehicleForwardSpeed,
  stepVehicleController,
  VEHICLE_FIXED_TIMESTEP,
} from './LocalPlayerController';
import { LOCAL_VEHICLE_TYPE } from './localPhysics';

interface VehicleProps {
  initialPosition?: [number, number, number];
}

export const Vehicle = React.forwardRef<RapierRigidBody, VehicleProps>(
  ({ initialPosition = [0, 1.2, 0] }, forwardedRef) => {
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
    const sendMove = useNetworkStore((state) => state.sendMove);

    // Controller state is advanced by Rapier's fixed-step callbacks. The
    // visual model reads these refs each render frame without driving physics.
    const speedRef = useRef(0);
    const headingRef = useRef(0);
    const steerAngleRef = useRef(0);
    const posSyncCounter = useRef(0);
    const controllerStateRef = useRef(createVehicleControllerState());

    const [vehicleFX, setVehicleFX] = useState({
      speed: 0,
      isAccelerating: false,
      isBraking: false,
      isReversing: false,
    });

    useBeforePhysicsStep(() => {
      const body = internalRef.current;
      if (!body) return;
      const controls = getControls();
      stepVehicleController(body, controls, controllerStateRef.current, VEHICLE_FIXED_TIMESTEP);
      tickRaceTimer(VEHICLE_FIXED_TIMESTEP);
    });

    useAfterPhysicsStep(() => {
      const body = internalRef.current;
      if (!body) return;
      const controls = getControls();
      const state = controllerStateRef.current;
      state.heading = getVehicleHeading(body);
      const currentSpeed = getVehicleForwardSpeed(body, state.heading);
      const isBoosting = controls.boost && controls.forward > 0;
      const isReversing = currentSpeed < -0.1;

      speedRef.current = currentSpeed;
      headingRef.current = state.heading;
      steerAngleRef.current = state.steerAngle;
      sound.updateEngineSpeed(Math.abs(currentSpeed));

      posSyncCounter.current += 1;
      if (posSyncCounter.current >= 4) {
        posSyncCounter.current = 0;
        const translation = body.translation();
        const rotation = body.rotation();
        setVehiclePos({ x: translation.x, z: translation.z, heading: state.heading });
        setVehicleSpeed(Math.max(0, Math.round(Math.abs(currentSpeed) * 3.6)));
        setIsBoosting(isBoosting);
        
        sendMove({
          x: translation.x,
          y: translation.y,
          z: translation.z,
          rx: rotation.x,
          ry: rotation.y,
          rz: rotation.z,
          rw: rotation.w,
          speed: currentSpeed,
          isReversing
        });
      }

      if (
        Math.abs(vehicleFX.speed - Math.abs(currentSpeed)) > 0.8 ||
        (controls.forward > 0) !== vehicleFX.isAccelerating ||
        controls.brake !== vehicleFX.isBraking ||
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

    useFrame(() => {
      const body = internalRef.current;
      if (!body) return;
      const controls = getControls();
      const currentSpeed = getVehicleForwardSpeed(body, controllerStateRef.current.heading);
      const heading = controllerStateRef.current.heading;

      if (chassisMeshRef.current) {
        const speedRatio = Math.min(1.0, Math.abs(currentSpeed) / 10.0);
        const targetRoll = -controls.turn * speedRatio * (currentSpeed >= 0 ? 0.14 : -0.1);
        const targetPitch = currentSpeed >= 0 ? controls.forward * 0.05 : -0.04;
        chassisMeshRef.current.rotation.z = THREE.MathUtils.lerp(chassisMeshRef.current.rotation.z, targetRoll, 0.15);
        chassisMeshRef.current.rotation.x = THREE.MathUtils.lerp(chassisMeshRef.current.rotation.x, targetPitch, 0.15);
      }

      if (thrusterRef.current) {
        const isBoosting = controls.boost && controls.forward > 0;
        const isDrivingForward = controls.forward > 0 && currentSpeed > 0;
        const targetScale = isBoosting ? 2.4 + Math.random() * 0.8 : isDrivingForward ? 1.0 + Math.random() * 0.4 : 0.2;
        thrusterRef.current.scale.set(isBoosting ? 1.4 : 1, isBoosting ? 1.4 : 1, targetScale);
      }

      if (waypointArrowRef.current) {
        const currentPos = body.translation();
        const targetWP = MILESTONE_WAYPOINTS.find((w) => w.id === targetWaypointId) || MILESTONE_WAYPOINTS[0];
        const dx = targetWP.x - currentPos.x;
        const dz = targetWP.z - currentPos.z;
        const localRight = dx * Math.cos(heading) - dz * Math.sin(heading);
        const localForward = -dx * Math.sin(heading) - dz * Math.cos(heading);
        waypointArrowRef.current.rotation.y = -Math.atan2(localRight, localForward);
      }
    });

    return (
      <RigidBody
        ref={(node) => {
          internalRef.current = node;
          if (typeof forwardedRef === 'function') forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
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
