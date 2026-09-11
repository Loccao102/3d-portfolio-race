# Unified 3D Architecture

This folder is the canonical runtime architecture for the interactive 3D frontends in this account.
The same top-level shape is intended to be reused by `Loccao102/city-of-lies`; only domain entities,
world content and product features should differ.

## Runtime flow

```text
app/page.tsx
  -> rendering/GameCanvas
      -> core/GameScene
          -> rendering/SceneLighting
          -> world/PortfolioWorld
          -> world/WorldPhysics
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
  config/       Static scene/runtime tuning and look profiles
  core/         Composition roots only; no domain implementation
  rendering/    Canvas, lighting, post-processing, renderer concerns
  world/        Environment composition, world geometry and physics shell
  entities/     Stateful actors: player, NPC, vehicle, interactable object
  systems/      Cross-entity behavior: camera, networking, audio, AI, telemetry
  features/     Product/game features built on entities + systems
```

## Dependency rules

1. `app` may import `game` and DOM UI, but must not compose Three/Rapier objects itself.
2. `core` orchestrates modules; it must not contain object geometry, movement logic or networking protocol details.
3. `rendering` owns renderer configuration, atmosphere, lights and post effects. It must not own gameplay state transitions.
4. `world` owns environment composition and the authoritative physics shell. Visual-only assets and colliders must be deliberately separated.
5. `entities` own actor-local state/behavior. They must not own global camera, room lifecycle or scene lighting.
6. `systems` coordinate behavior across entities/world. Examples: camera, multiplayer replication, AI director, performance adaptation.
7. `features` own user-facing capabilities such as portfolio milestones, racing, dialogue or investigation. A feature may combine systems/entities but should not configure the renderer.
8. `config` contains authored defaults. Do not duplicate lighting/camera/physics constants across components.

## Migration status

Phase 2 moves implementation ownership into canonical folders while leaving tiny compatibility exports at old import paths only where they reduce migration risk.

Completed:

- renderer host and scene composition -> `rendering` + `core`
- lighting/look configuration -> `rendering` + `config`
- camera implementation -> `systems/camera`
- performance adaptation -> `systems/performance`
- local player driving implementation -> `entities/player/PlayerVehicle`
- local input handling -> `entities/player/useVehicleControls`
- player physics identity -> `entities/player/localPhysics`
- Ferrari presentation + vehicle FX -> `entities/vehicle`
- PartyKit client state/socket ownership -> `systems/network/useNetworkStore`
- socket lifecycle + 15 Hz local pose replication -> `systems/network/NetworkSystem`
- replicated visitor rendering/interpolation/emotes -> `systems/network`
- portfolio feature composition boundary -> `features/portfolio`

Remaining:

- portfolio district/milestone implementations -> `features/portfolio`
- race checkpoints/timing -> `features/racing`
- ambient rival racers -> `entities/npc` or `features/racing`, depending on final ownership
- world placement/collider data -> `world/data`
- world geometry implementations -> `world`
- remove temporary compatibility exports after all imports point to canonical paths

## Multiplayer authority

The local Rapier body remains authoritative for immediate local driving feel. `NetworkSystem` samples the real rigid-body pose and velocity at 15 Hz and sends it through PartyKit. Remote visitors are rendered as kinematic bodies that interpolate toward received poses. UI may read network state and send explicit social actions, but it must not own connection lifecycle or movement replication cadence.

This is intentionally not a server-authoritative racing simulation yet. If competitive racing becomes authoritative, validation/reconciliation belongs in a dedicated network/racing protocol rather than inside render components.

## Shared frontend contract with City of Lies

`city-of-lies` already has a separate Go modular-monolith architecture. Do **not** flatten or replace its
`domain / application / game / infrastructure` backend boundaries. This contract applies to its interactive
3D frontend only.

When the City of Lies frontend becomes a navigable 3D world, use the same vocabulary and dependency direction:

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

The architecture is shared; the domain and server authority are not. City of Lies keeps server-side truth,
belief simulation and game outcome authoritative. The 3D frontend visualizes and interacts with that state;
it must not duplicate the simulation as client authority.

Do not create a generic shared engine package until both projects expose stable duplicated runtime code worth extracting.

## 3D quality workflow

For substantial scene work follow the same loop used by the 3D visualization workflow:

```text
intent -> object reasoning -> choose procedural/GLB/hybrid -> build first view
-> run real scene -> inspect representative frames/interactions -> refine
```

Build success is not visual validation. Keep physics/state authority explicit and keep decorative animation clearly separate from simulation.
