import React from 'react';
import { PerformanceMonitor } from '@/components/three/PerformanceMonitor';

/**
 * Canonical performance-system boundary.
 * Adaptive quality policy can move here later without coupling it to lighting.
 */
export function PerformanceSystem() {
  return <PerformanceMonitor />;
}
