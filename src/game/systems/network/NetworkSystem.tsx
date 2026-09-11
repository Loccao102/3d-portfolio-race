'use client';

import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { useGameStore } from '@/stores/useGameStore';
import { useNetworkStore } from './useNetworkStore';

const SEND_INTERVAL_SECONDS = 1 / 15;
const forward = new THREE.Vector3();
const quaternion = new THREE.Quaternion();

interface NetworkSystemProps {
  playerRef: React.RefObject<RapierRigidBody | null>;
}

/**
 * Owns client multiplayer lifecycle and local pose replication.
 * UI can read the network store, but it does not open sockets or schedule pose sends.
 */
export function NetworkSystem({ playerRef }: NetworkSystemProps) {
  const playerProfile = useGameStore((state) => state.playerProfile);
  const connect = useNetworkStore((state) => state.connect);
  const disconnect = useNetworkStore((state) => state.disconnect);
  const sendMove = useNetworkStore((state) => state.sendMove);
  const accumulator = useRef(0);

  useEffect(() => {
    connect({
      name: playerProfile.name,
      bodyColor: playerProfile.bodyColor,
      accentColor: playerProfile.accentColor,
    });

    return () => disconnect();
  }, [
    playerProfile.id,
    playerProfile.name,
    playerProfile.bodyColor,
    playerProfile.accentColor,
    connect,
    disconnect,
  ]);

  useFrame((_, delta) => {
    accumulator.current += delta;
    if (accumulator.current < SEND_INTERVAL_SECONDS) return;
    accumulator.current %= SEND_INTERVAL_SECONDS;

    const body = playerRef.current;
    if (!body) return;

    const position = body.translation();
    const rotation = body.rotation();
    const velocity = body.linvel();

    quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
    forward.set(0, 0, -1).applyQuaternion(quaternion);
    const signedForwardSpeed = velocity.x * forward.x + velocity.z * forward.z;

    sendMove({
      x: position.x,
      y: position.y,
      z: position.z,
      rx: rotation.x,
      ry: rotation.y,
      rz: rotation.z,
      rw: rotation.w,
      speed: Math.hypot(velocity.x, velocity.z),
      isReversing: signedForwardSpeed < -0.25,
      isBoosting: useGameStore.getState().isBoosting,
    });
  });

  return null;
}
