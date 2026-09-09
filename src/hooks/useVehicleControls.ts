import { useEffect, useRef } from 'react';
import { useGameStore } from '../stores/useGameStore';

export interface VehicleControlsState {
  forward: number; // -1 (reverse) to +1 (forward)
  turn: number;    // -1 (left) to +1 (right)
  brake: boolean;
  boost: boolean;  // Nitro turbo boost
  reset: boolean;  // R key reset to track
}

export function useVehicleControls() {
  const keyboardState = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    brake: false,
    boost: false,
    reset: false,
  });

  const controls = useRef<VehicleControlsState>({
    forward: 0,
    turn: 0,
    brake: false,
    boost: false,
    reset: false,
  });

  const joystickInput = useGameStore((state) => state.joystickInput);
  const setIntroFinished = useGameStore((state) => state.setIntroFinished);

  useEffect(() => {
    const resetKeyboard = () => {
      keyboardState.current.forward = false;
      keyboardState.current.backward = false;
      keyboardState.current.left = false;
      keyboardState.current.right = false;
      keyboardState.current.brake = false;
      keyboardState.current.boost = false;
      keyboardState.current.reset = false;
    };

    const isEditableTarget = (target: EventTarget | null): boolean => {
      const element = target as HTMLElement | null;
      if (!element) return false;
      return (
        element.isContentEditable ||
        element.tagName === 'INPUT' ||
        element.tagName === 'TEXTAREA' ||
        element.tagName === 'SELECT'
      );
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target)) return;

      // Any driving key immediately finishes intro to avoid any input delay
      if (['KeyW', 'KeyS', 'KeyA', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyR'].includes(e.code)) {
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
        case 'ShiftLeft':
        case 'ShiftRight':
          keyboardState.current.boost = true;
          break;
        case 'KeyR':
          keyboardState.current.reset = true;
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
        case 'ShiftLeft':
        case 'ShiftRight':
          keyboardState.current.boost = false;
          break;
        case 'KeyR':
          keyboardState.current.reset = false;
          break;
      }
    };

    const handleBlur = () => resetKeyboard();
    const handleVisibilityChange = () => {
      if (document.hidden) resetKeyboard();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      resetKeyboard();
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
    const isMobileBoost = joystickInput.y > 0.95;
    controls.current.boost = keyboardState.current.boost || isMobileBoost;
    controls.current.reset = keyboardState.current.reset;

    return controls.current;
  };

  return getControls;
}
