import * as THREE from 'three';

export const LOCAL_VEHICLE_TYPE = 'vehicle';

export interface LocalVehicleUserData {
  type?: string;
  localPlayer?: boolean;
}

/** Sensors use this guard so ambient/remote bodies cannot open local UI. */
export const isLocalVehicleObject = (object: THREE.Object3D | undefined): boolean => {
  if (!object) return false;
  const userData = object.userData as LocalVehicleUserData;
  return userData.type === LOCAL_VEHICLE_TYPE && userData.localPlayer === true;
};

