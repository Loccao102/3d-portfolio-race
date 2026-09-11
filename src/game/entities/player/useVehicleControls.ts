import { useEffect, useRef } from 'react';
import { useGameStore } from '@/stores/useGameStore';
import { useExperienceStore } from '@/game/features/portfolio/useExperienceStore';

export interface VehicleControlsState {
  forward: number;
  turn: number;
  brake: boolean;
  boost: boolean;
  reset: boolean;
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
  const mobileActions = useGameStore((state) => state.mobileActions);
  const setIntroFinished = useGameStore((state) => state.setIntroFinished);
  const toggleZenMode = useGameStore((state) => state.toggleZenMode);

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

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return;

      if (
        ['KeyW', 'KeyS', 'KeyA', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyR'].includes(
          event.code,
        )
      ) {
        setIntroFinished(true);
      }

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) {
        event.preventDefault();
      }

      switch (event.code) {
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
        case 'KeyH':
          toggleZenMode();
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
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
  }, [setIntroFinished, toggleZenMode]);

  return (): VehicleControlsState => {
    if (useExperienceStore.getState().mode === 'tour') {
      controls.current.forward = 0;
      controls.current.turn = 0;
      controls.current.brake = false;
      controls.current.boost = false;
      controls.current.reset = false;
      return controls.current;
    }

    let forward = 0;
    let turn = 0;

    if (keyboardState.current.forward) forward += 1;
    if (keyboardState.current.backward) forward -= 1;
    if (keyboardState.current.left) turn -= 1;
    if (keyboardState.current.right) turn += 1;

    if (Math.abs(joystickInput.y) > 0.05) forward += joystickInput.y;
    if (Math.abs(joystickInput.x) > 0.05) turn += joystickInput.x;

    controls.current.forward = Math.max(-1, Math.min(1, forward));
    controls.current.turn = Math.max(-1, Math.min(1, turn));
    controls.current.brake = keyboardState.current.brake || mobileActions.brake;
    controls.current.boost =
      keyboardState.current.boost || joystickInput.y > 0.95 || mobileActions.boost;
    controls.current.reset = keyboardState.current.reset || mobileActions.reset;

    return controls.current;
  };
}
