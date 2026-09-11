# Unified 3D Architecture

`src/game` is the canonical runtime boundary for this project's interactive 3D code and the frontend architecture baseline for `Loccao102/city-of-lies`.

## Runtime flow

```text
app/page.tsx
  -> rendering/GameCanvas
      -> core/GameScene
          -> rendering/SceneLighting
          -> world/PortfolioWorld
              -> world/CityBuildings
          -> world/WorldPhysics
              -> world/Ground
              -> world/InstancedProps
              -> features/portfolio/PortfolioDistricts
                  -> portfolio milestones + districts
              -> features/racing/RacingFeature
                  -> racing/RoadNetwork
                  -> entities/npc/RivalRacers
              -> entities/player/LocalPlayer
                  -> entities/player/PlayerVehicle
              -> systems/network/RemotePlayers
          -> systems/camera/FollowCameraSystem
          -> systems/network/NetworkSystem
          -> systems/performance/PerformanceSystem
```

## Canonical folders

```text
src/game/
  config/       Scene/runtime tuning and look profiles
  core/         Composition roots only
  rendering/    Canvas, lighting, post-processing, renderer concerns
  world/        Environment geometry, placement data and physics shell
  entities/     Stateful actors: player, NPC, vehicle, interactables
  systems/      Cross-entity behavior: camera, networking, performance, AI
  features/     User-facing capabilities: portfolio, racing, investigation, etc.
```

`src/components` is reserved for DOM/UI. Three.js, R3F and Rapier runtime implementations belong under `src/game`.

## Dependency rules

1. `app` may import `game` and DOM UI, but does not compose Three/Rapier objects.
2. `core` orchestrates modules; it does not implement geometry, movement or protocols.
3. `rendering` owns renderer configuration, atmosphere, lights and post effects, not gameplay transitions.
4. `world` owns environment composition, placement/collider data and the physical world shell.
5. `entities` own actor-local state and behavior; they do not own global camera, room lifecycle or scene lighting.
6. `systems` coordinate behavior across entities/world, such as camera, multiplayer replication and adaptive performance.
7. `features` own user-facing capabilities and may compose entities/systems without configuring the renderer.
8. `config` contains authored defaults; scene constants should not be duplicated across components.

## Migration status

The architecture migration is complete for the current portfolio runtime:

- renderer host + scene composition -> `rendering` + `core`
- lighting/look configuration -> `rendering` + `config`
- local driving/input/physics identity -> `entities/player`
- Ferrari presentation + vehicle effects -> `entities/vehicle`
- ambient rival racers -> `entities/npc`
- portfolio districts + milestone sensors -> `features/portfolio`
- race circuit + lap/checkpoint sensors -> `features/racing`
- city buildings, ground and instanced props -> `world`
- authored placement/collider data -> `world/data`
- camera -> `systems/camera`
- PartyKit client lifecycle, pose replication and remote visitors -> `systems/network`
- adaptive quality/FPS telemetry -> `systems/performance`
- legacy Three/R3F/Rapier implementations under `src/components` removed; `components` is UI-only

A few tiny facades remain inside `src/game` to preserve stable relative imports in large migrated scene files. They do not own implementation and can be collapsed later without changing the architecture or runtime ownership.

## Validation gate

The migration branch is protected by `.github/workflows/ci.yml`, which runs `npm ci`, `npm run typecheck` and `npm run build`. The first validation run completed successfully before merge; future pull requests and pushes to `main` use the same gate.

## Multiplayer authority

The local Rapier body is authoritative for immediate local driving feel. `NetworkSystem` samples its real pose and velocity at 15 Hz and sends it through PartyKit. Remote visitors are kinematic bodies that interpolate toward replicated poses. UI may read network state and send explicit social actions, but it does not own socket lifecycle or movement cadence.

This is not yet a server-authoritative competitive racing simulation. If racing becomes authoritative, validation/reconciliation belongs in a dedicated racing/network protocol rather than render components.

## Shared frontend contract with City of Lies

`city-of-lies` keeps its existing Go modular-monolith backend boundaries (`domain / application / game / infrastructure`). This contract applies only to its interactive frontend.

When City of Lies becomes a navigable 3D world, use the same structure:

```text
frontend/src/game/
  config/
  core/GameScene
  rendering/GameCanvas + SceneLighting
  world/CityWorld + WorldPhysics
  entities/player + npc + evidence + interactables
  systems/camera + realtime + ai-presentation + performance
  features/investigation + dialogue + belief + evidence + truth-submission
```

Truth, belief simulation and game outcome remain server-authoritative. The 3D frontend visualizes and interacts with server state; it must not duplicate that simulation as client authority.

Do not extract a generic shared engine package until both projects expose stable duplicated runtime code worth sharing.

## 3D quality workflow

For substantial scene work:

```text
intent -> object reasoning -> choose procedural/GLB/hybrid -> build first view
-> run real scene -> inspect representative frames/interactions -> refine
```

Build success is not visual validation. Keep physics/state authority explicit and decorative animation separate from simulation.
