# Unified 3D Architecture

This folder is the canonical runtime architecture for all interactive 3D projects in this account.
The same top-level shape is intended to be reused by `lies`; only domain entities, world content and features should differ.

## Runtime flow

```text
app/page.tsx
  -> rendering/GameCanvas
      -> core/GameScene
          -> rendering/SceneLighting
          -> world/PortfolioWorld
          -> world/WorldPhysics
              -> entities/player/LocalPlayer
          -> systems/camera/FollowCameraSystem
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

## Migration strategy

The first migration preserves the existing tested implementations behind canonical boundaries. For example `LocalPlayer` currently adapts the existing `Vehicle`, and `PortfolioWorld` adapts existing city components. This allows architecture changes without simultaneously rewriting driving physics, GLB assets and portfolio content.

Next migrations should move implementation files behind these boundaries in this order:

- player vehicle/controller/effects -> `entities/player` and `entities/vehicle`
- portfolio districts/milestones -> `features/portfolio`
- race checkpoints/timing -> `features/racing`
- PartyKit transport/remote players -> `systems/network`
- world placement/collider data -> `world/data`
- camera implementation -> `systems/camera`
- performance adaptation -> `systems/performance`

After a module is migrated, delete the old `src/components/*` implementation path rather than keeping duplicate ownership.

## Shared architecture with Lies

`lies` should reuse the same folder vocabulary and dependency direction:

```text
core/GameScene
rendering/GameCanvas + SceneLighting
world/<game-world> + WorldPhysics
entities/player + npc + interactables
systems/camera + network + ai + performance
features/investigation + dialogue + belief-system
config/
```

The architecture is shared; the domain is not. Do not create a generic engine package until both projects expose stable duplicated code worth extracting.

## 3D quality workflow

For substantial scene work follow the same loop used by the 3D visualization workflow:

```text
intent -> object reasoning -> choose procedural/GLB/hybrid -> build first view
-> run real scene -> inspect representative frames/interactions -> refine
```

Build success is not visual validation. Keep physics state authoritative and keep decorative animation clearly separate from simulation.
