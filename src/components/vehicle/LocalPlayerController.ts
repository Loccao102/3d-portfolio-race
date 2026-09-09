/**
 * Fixed-step arcade vehicle controller.
 *
 * This module intentionally has no React or R3F imports. Keeping the step
 * function small and dependency free lets the browser controller and the
 * headless Rapier checks exercise the same movement rules.
 */

export const VEHICLE_FIXED_TIMESTEP = 1 / 60;

export interface VehicleControlInput {
  forward: number;
  turn: number;
  brake: boolean;
  boost: boolean;
}

export interface VehicleVectorLike {
  x: number;
  y: number;
  z: number;
}

export interface VehicleQuaternionLike {
  x: number;
  y: number;
  z: number;
  w: number;
}

export interface VehicleBodyLike {
  linvel: () => VehicleVectorLike;
  rotation: () => VehicleQuaternionLike;
  translation: () => VehicleVectorLike;
  setLinvel: (velocity: VehicleVectorLike, wakeUp: boolean) => void;
  setAngvel: (velocity: VehicleVectorLike, wakeUp: boolean) => void;
  angvel?: () => VehicleVectorLike;
}

export interface VehicleControllerState {
  driveSpeed: number;
  heading: number;
  steerAngle: number;
  initialized: boolean;
}

export const VEHICLE_TUNING = {
  baseMaxSpeed: 24,
  boostMaxSpeed: 36,
  maxReverseSpeed: 8.5,
  baseAcceleration: 25,
  boostAcceleration: 48,
  reverseAcceleration: 12,
  brakeAcceleration: 65,
  coastDeceleration: 9,
  forwardTurnSpeed: 2.7,
  reverseTurnSpeed: 2.1,
  yawResponse: 14,
  lateralGrip: 7,
  maxLongitudinalCorrection: 48,
} as const;

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

const moveTowards = (current: number, target: number, maxDelta: number): number => {
  if (Math.abs(target - current) <= maxDelta) return target;
  return current + Math.sign(target - current) * maxDelta;
};

const headingFromRotation = (rotation: VehicleQuaternionLike): number => {
  // Rapier uses a normalized quaternion. This is the Y-axis Euler angle for
  // the same forward vector used by FerrariModel: (x,z)=(-sin(yaw),-cos(yaw)).
  return Math.atan2(
    2 * (rotation.w * rotation.y + rotation.x * rotation.z),
    1 - 2 * (rotation.y * rotation.y + rotation.z * rotation.z)
  );
};

export const getVehicleHeading = (body: VehicleBodyLike): number =>
  headingFromRotation(body.rotation());

export const createVehicleControllerState = (): VehicleControllerState => ({
  driveSpeed: 0,
  heading: 0,
  steerAngle: 0,
  initialized: false,
});

/** Returns signed velocity along the body's current forward vector. */
export const getVehicleForwardSpeed = (
  body: VehicleBodyLike,
  heading = headingFromRotation(body.rotation())
): number => {
  const velocity = body.linvel();
  const forwardX = -Math.sin(heading);
  const forwardZ = -Math.cos(heading);
  return velocity.x * forwardX + velocity.z * forwardZ;
};

/**
 * Advance one fixed physics tick. The controller only changes velocity and
 * angular velocity; Rapier remains responsible for gravity, integration, and
 * collision resolution.
 */
export const stepVehicleController = (
  body: VehicleBodyLike,
  controls: VehicleControlInput,
  state: VehicleControllerState,
  delta = VEHICLE_FIXED_TIMESTEP
): void => {
  const dt = clamp(delta, 1 / 240, 1 / 30);
  const inputForward = clamp(controls.forward, -1, 1);
  const inputTurn = clamp(controls.turn, -1, 1);
  const rotation = body.rotation();

  if (!state.initialized) {
    state.heading = headingFromRotation(rotation);
    state.initialized = true;
  } else {
    // Physics owns orientation. Read it back so collision impulses and
    // contact spin are reflected by steering and telemetry.
    state.heading = headingFromRotation(rotation);
  }

  const velocity = body.linvel();
  const forwardX = -Math.sin(state.heading);
  const forwardZ = -Math.cos(state.heading);
  const rightX = Math.cos(state.heading);
  const rightZ = -Math.sin(state.heading);
  const actualForwardSpeed = velocity.x * forwardX + velocity.z * forwardZ;
  const actualLateralSpeed = velocity.x * rightX + velocity.z * rightZ;

  // A solid wall can hold the body at zero while the previous throttle has
  // built a high drive demand. Rebase that stale demand from measured speed;
  // this keeps braking, reversing, and throttle release responsive after a
  // collision instead of unwinding an invisible speed target.
  if (
    (Math.abs(actualForwardSpeed) < 1 && Math.abs(state.driveSpeed) > 4) ||
    (state.driveSpeed * actualForwardSpeed < 0 && Math.abs(state.driveSpeed - actualForwardSpeed) > 4)
  ) {
    state.driveSpeed = actualForwardSpeed;
  }

  const isBoosting = controls.boost && inputForward > 0;
  const maxDriveSpeed = isBoosting
    ? VEHICLE_TUNING.boostMaxSpeed
    : VEHICLE_TUNING.baseMaxSpeed;

  if (inputForward > 0) {
    const acceleration = isBoosting
      ? VEHICLE_TUNING.boostAcceleration
      : VEHICLE_TUNING.baseAcceleration;
    state.driveSpeed = moveTowards(
      state.driveSpeed,
      inputForward * maxDriveSpeed,
      acceleration * dt
    );
  } else if (inputForward < 0) {
    const directionChangeAcceleration = state.driveSpeed > 0 ? 45 : VEHICLE_TUNING.reverseAcceleration;
    state.driveSpeed = moveTowards(
      state.driveSpeed,
      inputForward * VEHICLE_TUNING.maxReverseSpeed,
      directionChangeAcceleration * Math.abs(inputForward) * dt
    );
  } else {
    state.driveSpeed = moveTowards(
      state.driveSpeed,
      0,
      VEHICLE_TUNING.coastDeceleration * dt
    );
  }

  if (controls.brake) {
    state.driveSpeed = moveTowards(
      state.driveSpeed,
      0,
      VEHICLE_TUNING.brakeAcceleration * dt
    );
  }

  const movingForward = actualForwardSpeed >= -0.05;
  const steeringAuthority = clamp(
    Math.abs(actualForwardSpeed) / (movingForward ? 2.5 : 1.5),
    0,
    1
  );
  const targetYawRate =
    inputTurn *
    (movingForward ? -VEHICLE_TUNING.forwardTurnSpeed : VEHICLE_TUNING.reverseTurnSpeed) *
    steeringAuthority;
  const currentYawRate = body.angvel?.().y ?? 0;
  const yawRate = moveTowards(
    currentYawRate,
    targetYawRate,
    VEHICLE_TUNING.yawResponse * dt
  );
  body.setAngvel({ x: 0, y: yawRate, z: 0 }, true);

  // Apply only a bounded longitudinal correction. If the car is against a
  // wall, Rapier can keep the actual velocity at zero instead of having this
  // controller overwrite the collision response every render frame.
  const desiredForwardSpeed = state.driveSpeed;
  const forwardCorrection = clamp(
    desiredForwardSpeed - actualForwardSpeed,
    -VEHICLE_TUNING.maxLongitudinalCorrection * dt,
    VEHICLE_TUNING.maxLongitudinalCorrection * dt
  );
  const lateralVelocity = actualLateralSpeed * Math.exp(-VEHICLE_TUNING.lateralGrip * dt);
  body.setLinvel(
    {
      x: (actualForwardSpeed + forwardCorrection) * forwardX + lateralVelocity * rightX,
      y: velocity.y,
      z: (actualForwardSpeed + forwardCorrection) * forwardZ + lateralVelocity * rightZ,
    },
    true
  );

  state.steerAngle = state.steerAngle + (-inputTurn * 0.45 - state.steerAngle) * (1 - Math.exp(-18 * dt));
};
