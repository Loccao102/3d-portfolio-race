import React, { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { CuboidCollider, RigidBody, type RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { useGameStore, MILESTONE_WAYPOINTS } from '@/stores/useGameStore';
import { sound } from '@/lib/soundEngine';
import { FerrariModel } from '@/game/entities/vehicle/FerrariModel';
import { VehicleEffects } from '@/game/entities/vehicle/VehicleEffects';
import { LOCAL_VEHICLE_TYPE } from './localPhysics';
import { useVehicleControls } from './useVehicleControls';

export interface PlayerVehicleProps {
  initialPosition?: [number, number, number];
}

export const PlayerVehicle = React.forwardRef<RapierRigidBody, PlayerVehicleProps>(
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

    const speedRef = useRef(0);
    const headingRef = useRef(0);
    const yawRateRef = useRef(0);
    const steerAngleRef = useRef(0);
    const posSyncCounter = useRef(0);
    const wasBoostingRef = useRef(false);

    const shadowTexture = useMemo(() => {
      if (typeof document === 'undefined') return null;
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(64, 64, 8, 64, 64, 60);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.75)');
        gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.35)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 128, 128);
      }
      return new THREE.CanvasTexture(canvas);
    }, []);

    const [vehicleFX, setVehicleFX] = useState({
      isAccelerating: false,
      isBraking: false,
      isReversing: false,
      isBoosting: false,
    });

    useFrame((_, delta) => {
      const body =
        (forwardedRef as React.RefObject<RapierRigidBody | null>)?.current || internalRef.current;
      if (!body) return;

      const controls = getControls();
      const clampedDelta = Math.min(delta, 0.05);

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

      tickRaceTimer(clampedDelta);

      const isBoosting = controls.boost && controls.forward > 0;
      const maxSpeed = isBoosting ? 36 : 24;
      const acceleration = isBoosting ? 48 : 25;

      if (controls.forward > 0) {
        speedRef.current = Math.min(speedRef.current + acceleration * clampedDelta, maxSpeed);
      } else if (controls.forward < 0) {
        speedRef.current = Math.max(speedRef.current - 12 * clampedDelta, -8.5);
      } else {
        speedRef.current *= Math.pow(0.38, clampedDelta);
        if (Math.abs(speedRef.current) < 0.05) speedRef.current = 0;
      }

      if (controls.brake) speedRef.current *= Math.pow(0.015, clampedDelta);

      const turnAmount = Math.abs(controls.turn);
      if (turnAmount > 0.05 && Math.abs(speedRef.current) > 1) {
        const scrubIntensity = isBoosting ? 8 : 13.5;
        const corneringDecel =
          turnAmount * scrubIntensity * Math.min(1, Math.abs(speedRef.current) / 10);
        const sign = Math.sign(speedRef.current);
        speedRef.current =
          sign * Math.max(0, Math.abs(speedRef.current) - corneringDecel * clampedDelta);
      }

      const currentSpeed = speedRef.current;
      const isReversing = currentSpeed < -0.1 || controls.forward < 0;
      const speedRatio = Math.min(1, Math.abs(currentSpeed) / 24);
      const dynamicTurnSpeed = THREE.MathUtils.lerp(1.85, 1.15, speedRatio);
      const steerAuthority =
        currentSpeed >= 0
          ? Math.min(1, Math.max(0.4, currentSpeed / 3))
          : Math.min(1, Math.max(0.4, Math.abs(currentSpeed) / 2));

      const targetYawRate =
        (currentSpeed >= 0 ? -controls.turn : controls.turn) * dynamicTurnSpeed * steerAuthority;
      yawRateRef.current = THREE.MathUtils.lerp(
        yawRateRef.current,
        targetYawRate,
        clampedDelta * 12,
      );
      headingRef.current += yawRateRef.current * clampedDelta;
      steerAngleRef.current = THREE.MathUtils.lerp(
        steerAngleRef.current,
        -controls.turn * 0.42,
        0.2,
      );

      const heading = headingRef.current;
      const fwdX = -Math.sin(heading);
      const fwdZ = -Math.cos(heading);
      const rightX = Math.cos(heading);
      const rightZ = -Math.sin(heading);
      const currentLinvel = body.linvel();
      const lateralSpeed = currentLinvel.x * rightX + currentLinvel.z * rightZ;
      const dampedLateralSpeed = lateralSpeed * Math.exp(-9 * clampedDelta);

      body.setLinvel(
        {
          x: fwdX * currentSpeed + rightX * dampedLateralSpeed,
          y: Math.max(-20, currentLinvel.y),
          z: fwdZ * currentSpeed + rightZ * dampedLateralSpeed,
        },
        true,
      );

      const halfAngle = heading / 2;
      body.setRotation(
        { x: 0, y: Math.sin(halfAngle), z: 0, w: Math.cos(halfAngle) },
        true,
      );

      sound.updateEngineSpeed(Math.abs(currentSpeed));
      if (isBoosting && !wasBoostingRef.current) sound.playNitroBoost();
      wasBoostingRef.current = isBoosting;

      if (chassisMeshRef.current) {
        chassisMeshRef.current.rotation.z = THREE.MathUtils.lerp(
          chassisMeshRef.current.rotation.z,
          -yawRateRef.current * 0.08 * (currentSpeed >= 0 ? 1 : -1),
          0.15,
        );
        chassisMeshRef.current.rotation.x = THREE.MathUtils.lerp(
          chassisMeshRef.current.rotation.x,
          currentSpeed >= 0 ? controls.forward * 0.05 : -0.04,
          0.15,
        );
      }

      if (thrusterRef.current) {
        const isDrivingForward = controls.forward > 0 && currentSpeed > 0;
        const targetScale = isBoosting
          ? 2.4 + Math.random() * 0.8
          : isDrivingForward
            ? 1 + Math.random() * 0.4
            : 0.2;
        thrusterRef.current.scale.set(
          isBoosting ? 1.4 : 1,
          isBoosting ? 1.4 : 1,
          targetScale,
        );
      }

      posSyncCounter.current += 1;
      if (posSyncCounter.current >= 4) {
        posSyncCounter.current = 0;
        const translation = body.translation();
        setVehiclePos({ x: translation.x, z: translation.z, heading });
        setVehicleSpeed(Math.round(Math.abs(currentSpeed) * 3.6));
        setIsBoosting(isBoosting);
      }

      if (waypointArrowRef.current) {
        const currentCoord = body.translation();
        const targetWP =
          MILESTONE_WAYPOINTS.find((waypoint) => waypoint.id === targetWaypointId) ||
          MILESTONE_WAYPOINTS[0];
        const dx = targetWP.x - currentCoord.x;
        const dz = targetWP.z - currentCoord.z;
        const localRight = dx * Math.cos(heading) - dz * Math.sin(heading);
        const localForward = -dx * Math.sin(heading) - dz * Math.cos(heading);
        waypointArrowRef.current.rotation.y = -Math.atan2(localRight, localForward);
      }

      const isDrivingForward = controls.forward > 0;
      if (
        isDrivingForward !== vehicleFX.isAccelerating ||
        controls.brake !== vehicleFX.isBraking ||
        isReversing !== vehicleFX.isReversing ||
        isBoosting !== vehicleFX.isBoosting
      ) {
        setVehicleFX({
          isAccelerating: isDrivingForward,
          isBraking: controls.brake,
          isReversing,
          isBoosting,
        });
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
        ccd
        position={initialPosition}
        enabledRotations={[false, true, false]}
        linearDamping={0.1}
        angularDamping={1}
        userData={{ type: LOCAL_VEHICLE_TYPE, localPlayer: true }}
      >
        <CuboidCollider args={[0.85, 0.35, 1.5]} position={[0, 0.45, 0]} friction={0} />

        <group ref={waypointArrowRef} position={[0, 1.8, 0]}>
          <mesh position={[0, 0, -0.6]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.16, 0.45, 4]} />
            <meshStandardMaterial
              color={playerProfile.accentColor}
              emissive={playerProfile.accentColor}
              emissiveIntensity={1.8}
            />
          </mesh>
        </group>

        <group ref={chassisMeshRef} position={[0, 0.02, 0]}>
          <FerrariModel
            bodyColor={playerProfile.bodyColor}
            accentColor={playerProfile.accentColor}
            speedRef={speedRef}
            steerAngleRef={steerAngleRef}
            isReversing={vehicleFX.isReversing}
            scale={0.95}
          />

          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.5, 4.6]} />
            {shadowTexture ? (
              <meshBasicMaterial map={shadowTexture} transparent opacity={0.75} depthWrite={false} />
            ) : (
              <meshBasicMaterial color="#000000" transparent opacity={0.4} depthWrite={false} />
            )}
          </mesh>

          <mesh ref={thrusterRef} position={[0, 0.35, 2.1]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.02, 0.8, 8, 1, true]} />
            <meshBasicMaterial color={playerProfile.accentColor} transparent opacity={0.6} />
          </mesh>

          <VehicleEffects
            speedRef={speedRef}
            isAccelerating={vehicleFX.isAccelerating}
            isBraking={vehicleFX.isBraking}
            isBoosting={vehicleFX.isBoosting}
          />
        </group>
      </RigidBody>
    );
  },
);

PlayerVehicle.displayName = 'PlayerVehicle';
