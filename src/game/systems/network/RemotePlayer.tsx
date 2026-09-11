import React, { useEffect, useRef } from 'react';
import { ContactShadows, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import {
  CuboidCollider,
  RigidBody,
  type RapierRigidBody,
  useBeforePhysicsStep,
} from '@react-three/rapier';
import * as THREE from 'three';
import type { RemotePlayer as RemotePlayerState } from '@/stores/useNetworkStore';
import { FerrariModel } from '@/game/entities/vehicle/FerrariModel';
import { EmoteBubble } from './EmoteBubble';

interface RemotePlayerProps {
  id: string;
  player: RemotePlayerState;
}

const INTERPOLATION_FACTOR = 0.3;

export function RemotePlayer({ id, player }: RemotePlayerProps) {
  const bodyRef = useRef<RapierRigidBody>(null);
  const speedRef = useRef(0);
  const steerAngleRef = useRef(0);
  const targetPos = useRef(new THREE.Vector3(0, -100, 0));
  const targetQuat = useRef(new THREE.Quaternion());
  const thrusterRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!player.pose) return;
    targetPos.current.set(player.pose.x, player.pose.y, player.pose.z);
    targetQuat.current.set(player.pose.rx, player.pose.ry, player.pose.rz, player.pose.rw);
    speedRef.current = player.pose.speed;
    steerAngleRef.current = 0;
  }, [player.pose]);

  useBeforePhysicsStep(() => {
    const body = bodyRef.current;
    if (!body || !player.pose) return;

    const currentPos = body.translation();
    const currentQuat = body.rotation();
    const interpolatedPos = new THREE.Vector3(currentPos.x, currentPos.y, currentPos.z);
    const interpolatedQuat = new THREE.Quaternion(
      currentQuat.x,
      currentQuat.y,
      currentQuat.z,
      currentQuat.w,
    );

    interpolatedPos.lerp(targetPos.current, INTERPOLATION_FACTOR);
    interpolatedQuat.slerp(targetQuat.current, INTERPOLATION_FACTOR);
    body.setNextKinematicTranslation(interpolatedPos);
    body.setNextKinematicRotation(interpolatedQuat);
  });

  useFrame(() => {
    if (!thrusterRef.current) return;
    const isBoosting = player.pose?.isBoosting || false;
    const targetScale = isBoosting ? 2.4 + Math.random() * 0.8 : 0.2;
    thrusterRef.current.scale.set(
      isBoosting ? 1.4 : 1,
      isBoosting ? 1.4 : 1,
      targetScale,
    );
  });

  return (
    <RigidBody
      ref={bodyRef}
      type="kinematicPosition"
      colliders={false}
      position={[0, -100, 0]}
      userData={{ type: 'remote_vehicle', id }}
    >
      <CuboidCollider
        args={[0.85, 0.35, 1.5]}
        position={[0, 0.45, 0]}
        friction={0}
        restitution={0.4}
      />

      <EmoteBubble id={id} />

      <Text
        position={[0, 1.8, 0]}
        fontSize={0.25}
        color={player.accentColor}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#000000"
      >
        {player.name || id.substring(0, 4)}
      </Text>

      <group position={[0, 0.02, 0]}>
        <FerrariModel
          bodyColor={player.bodyColor}
          accentColor={player.accentColor}
          speedRef={speedRef}
          steerAngleRef={steerAngleRef}
          isReversing={player.pose?.isReversing || false}
          scale={0.95}
        />

        {player.pose?.isBoosting && (
          <mesh ref={thrusterRef} position={[0, 0.35, 2.1]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.02, 0.8, 8, 1, true]} />
            <meshBasicMaterial color={player.accentColor} transparent opacity={0.6} />
          </mesh>
        )}

        <ContactShadows
          position={[0, 0.02, 0]}
          opacity={0.65}
          scale={5.5}
          blur={1.8}
          far={1.6}
          color="#000000"
        />
      </group>
    </RigidBody>
  );
}
