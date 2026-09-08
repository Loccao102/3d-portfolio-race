import { useEffect, useRef } from 'react';
import { useGameStore } from '../stores/useGameStore';

export interface VehicleControlsState {
  forward: number; // -1 (reverse) to +1 (forward)
  turn: number;    // -1 (left) to +1 (right)
  brake: boolean;
}

export function useVehicleControls() {
  const keyboardState = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    brake: false,
  });

  const controls = useRef<VehicleControlsState>({
    forward: 0,
    turn: 0,
    brake: false,
  });

  const joystickInput = useGameStore((state) => state.joystickInput);
  const setIntroFinished = useGameStore((state) => state.setIntroFinished);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Any driving key immediately finishes intro to avoid any input delay
      if (['KeyW', 'KeyS', 'KeyA', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        setIntroFinished(true);
      }

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keyboardState.current.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keyboardState.current.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keyboardState.current.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keyboardState.current.right = true;
          break;
        case 'Space':
          keyboardState.current.brake = true;
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keyboardState.current.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keyboardState.current.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keyboardState.current.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keyboardState.current.right = false;
          break;
        case 'Space':
          keyboardState.current.brake = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setIntroFinished]);

  const getControls = (): VehicleControlsState => {
    let forward = 0;
    let turn = 0;

    // Keyboard inputs
    if (keyboardState.current.forward) forward += 1;
    if (keyboardState.current.backward) forward -= 1;
    if (keyboardState.current.left) turn -= 1;
    if (keyboardState.current.right) turn += 1;

    // Virtual Joystick inputs (Mobile)
    if (Math.abs(joystickInput.y) > 0.05) {
      forward += joystickInput.y;
    }
    if (Math.abs(joystickInput.x) > 0.05) {
      turn += joystickInput.x;
    }

    controls.current.forward = Math.max(-1, Math.min(1, forward));
    controls.current.turn = Math.max(-1, Math.min(1, turn));
    controls.current.brake = keyboardState.current.brake;

    return controls.current;
  };

  return getControls;
}
