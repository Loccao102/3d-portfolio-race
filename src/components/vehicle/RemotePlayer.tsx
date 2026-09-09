import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider, RapierRigidBody, useBeforePhysicsStep } from '@react-three/rapier';
import * as THREE from 'three';
import { RemotePlayer as RemotePlayerType } from '../../stores/useNetworkStore';
import { FerrariModel } from './FerrariModel';
import { EmoteBubble } from './EmoteBubble';
import { ContactShadows, Text } from '@react-three/drei';

interface Props {
  id: string;
  player: RemotePlayerType;
}

const INTERPOLATION_FACTOR = 0.3; // Magic number for network smoothing (adjust based on 15Hz send rate)

export const RemotePlayer: React.FC<Props> = ({ id, player }) => {
  const bodyRef = useRef<RapierRigidBody>(null);
  
  // Fake refs to appease FerrariModel which normally takes these from local inputs
  const speedRef = useRef(0);
  const steerAngleRef = useRef(0);
  
  const targetPos = useRef(new THREE.Vector3(0, -100, 0));
  const targetQuat = useRef(new THREE.Quaternion());

  useEffect(() => {
    if (player.pose) {
      targetPos.current.set(player.pose.x, player.pose.y, player.pose.z);
      targetQuat.current.set(player.pose.rx, player.pose.ry, player.pose.rz, player.pose.rw);
      speedRef.current = player.pose.speed;
      
      // Calculate wheel steering angle (fake it based on turning rate or just default to 0 for now)
      // Since we don't send raw steering input yet, we can deduce it from rotation changes if needed,
      // but for simplicity we keep it 0 or forward it if added to payload later.
      steerAngleRef.current = 0; 
    }
  }, [player.pose]);

  // Interpolate towards the target pose using Rapier kinematic body
  useBeforePhysicsStep(() => {
    const body = bodyRef.current;
    if (!body || !player.pose) return;

    const currentPos = body.translation();
    const currentQuat = body.rotation();

    const vCurrentPos = new THREE.Vector3(currentPos.x, currentPos.y, currentPos.z);
    const vCurrentQuat = new THREE.Quaternion(currentQuat.x, currentQuat.y, currentQuat.z, currentQuat.w);

    // Smooth lerp for visual interpolation
    vCurrentPos.lerp(targetPos.current, INTERPOLATION_FACTOR);
    vCurrentQuat.slerp(targetQuat.current, INTERPOLATION_FACTOR);

    body.setNextKinematicTranslation(vCurrentPos);
    body.setNextKinematicRotation(vCurrentQuat);
  });

  const thrusterRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (thrusterRef.current) {
      const isBoosting = player.pose?.isBoosting || false;
      const targetScale = isBoosting ? 2.4 + Math.random() * 0.8 : 0.2;
      thrusterRef.current.scale.set(isBoosting ? 1.4 : 1, isBoosting ? 1.4 : 1, targetScale);
    }
  });

  return (
    <RigidBody
      ref={bodyRef}
      type="kinematicPosition"
      colliders={false}
      position={[0, -100, 0]} // Initial spawn offscreen until first pose arrives
      userData={{ type: 'remote_vehicle', id }}
    >
      <CuboidCollider 
        args={[0.85, 0.35, 1.5]} 
        position={[0, 0.45, 0]} 
        friction={0.0} 
        restitution={0.4}
      />

      <EmoteBubble id={id} />

      {/* Floating Name Tag */}
      <Text
        position={[0, 1.8, 0]}
        fontSize={0.25}
        color={player.accentColor}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#000000"
        font="/fonts/Inter-Bold.woff" // Optional: specify font if needed, defaults to sans
      >
        {player.name || id.substring(0, 4)}
      </Text>

      {/* 3D Model */}
      <group position={[0, 0.02, 0]}>
        <FerrariModel
          bodyColor={player.bodyColor}
          accentColor={player.accentColor}
          speedRef={speedRef}
          steerAngleRef={steerAngleRef}
          isReversing={player.pose?.isReversing || false}
          scale={0.95}
        />
        
        {/* Thruster Flame when accelerating */}
        {player.pose?.isBoosting && (
          <mesh
            ref={thrusterRef}
            position={[0, 0.35, 2.1]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.2, 0.02, 0.8, 8, 1, true]} />
            <meshBasicMaterial
              color={player.accentColor}
              transparent
              opacity={0.6}
            />
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
};

