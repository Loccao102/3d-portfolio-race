# CURRENT ARCHITECTURE REPORT

Ngày audit: 2026-09-09. Baseline: commit `af8d66d`, working tree ban đầu sạch.

**Trạng thái: hoàn tất audit, chờ người dùng review kế hoạch trước implementation.** Chỉ bổ sung tài liệu này; không sửa code ứng dụng, dependency hay assets. Báo cáo phân biệt quan sát source, kết quả chạy lệnh và đề xuất chưa triển khai.

## 1. Kết luận kiến trúc

Giữ Next.js/R3F/Rapier/Zustand hiện có. Đây đã là portfolio có local physics; không phải scene chỉ dùng mesh. Khoảng trống chính là collider của kiến trúc thành phố, cách điều khiển physics theo render frame, identity kết nối, và toàn bộ networking. Không cần rewrite world hoặc chuyển framework.

Đề xuất: local physics 60Hz, gửi trạng thái đã đọc từ rigidbody khoảng 15Hz; Node.js + Colyseus quản lý room, membership và kiểm tra transform; remote dùng snapshot buffer, kinematic body và FerrariModel hiện có. Server không mô phỏng Rapier. Player-player collision là tùy chọn, environment collision bắt buộc.

## 2. Existing stack và deployment

| Thành phần | Thực tế trong repository |
|---|---|
| Framework | Next.js App Router; package.json khai báo `^15.1.7`, lockfile/node_modules hiện là 15.5.25 |
| UI | React 19.2.8 trong lockfile; Tailwind CSS 3, lucide-react |
| Rendering | R3F 9.7.0, Drei 10.7.8, Three 0.174.0 |
| Physics | @react-three/rapier 2.2.0, WASM phía browser |
| State | Zustand 5.0.15; một store useGameStore |
| Language | TypeScript strict; lockfile 5.9.3; moduleResolution bundler |
| Scripts | dev, build, start, lint; chưa có script typecheck/test |
| Backend | Không có server multiplayer, API route multiplayer, Colyseus hay WebSocket client |
| Deployment | next.config.mjs có transpilePackages và asyncWebAssembly; README có nút Vercel. Không có cấu hình triển khai backend/CI/container trong file được kiểm tra; không suy ra hosting thực tế từ README |

`develop.md` có roadmap PartyKit/WebRTC, không phải implementation. Các chuỗi WebSockets trong data/projects.ts là nội dung portfolio, không phải kết nối mạng.

## 3. Existing scene architecture

```text
app/layout.tsx → app/page.tsx (client)
  ├─ OverlayUI → Intro/HUD/RaceHUD/Nitro/MilestoneCard/QuickView/MiniMap/Joystick
  └─ dynamic SceneCanvas (ssr:false)
       └─ Canvas → Suspense → Experience
            ├─ Environment city + lights + PerformanceMonitor
            ├─ Suspense → CityBuildings (ngoài Physics)
            ├─ Suspense → Physics(gravity [0,-26,0], timeStep="vary")
            │    ├─ Ground → RoadNetwork
            │    ├─ InstancedProps + RivalRacers
            │    ├─ About/Tech/ProjectGarage/Experiment/Contact
            │    └─ Vehicle(ref, spawn [0,1.2,14])
            └─ CameraFollow(ref của Vehicle duy nhất)
```

Nguồn: src/app/page.tsx:9; src/components/three/Experience.tsx:20,109–147. Canvas bật shadows/antialias, DPR tối đa 1.5, camera far 450, fog đổi theo theme. Các Suspense boundary hiện có phải được giữ về mục đích: không để asset loading làm mất toàn scene. Vehicle GLTF và TechReactor có thể suspend bên trong nhánh physics; cần kiểm tra cold load khi tách component, không dựa vào preload để đảm bảo thứ tự collider/player.

## 4. Existing player và movement

Nguồn chính: src/components/vehicle/Vehicle.tsx:16–211; hooks/useVehicleControls.ts; vehicle/FerrariModel.tsx.

1. Input keyboard WASD/arrows, Space phanh, Shift boost được giữ trong refs. Joystick lấy từ Zustand, cộng với keyboard rồi clamp [-1,1]; đẩy tiến >0.95 kích boost. Listener keyboard/touch có cleanup, nhưng keyboard chưa reset khi blur/hidden và chưa bỏ qua editable DOM.
2. `useFrame` clamp delta tối đa 0.05. `speedRef` tích phân acceleration, coast và brake; giới hạn tiến 24 m/s, boost 36 m/s, lùi 8.5 m/s. Throttle/turn hiện chủ yếu dùng dấu/nonzero, không tỷ lệ đầy đủ với độ nghiêng joystick.
3. `headingRef` tích phân yaw theo hướng lái và dấu tốc độ; reverse đảo hướng đánh lái.
4. `setLinvel({x:-sin(heading)*speed,y:max(-20,currentY),z:-cos(heading)*speed})` mỗi render frame. `setRotation(quaternionYaw)` mỗi frame. Không có position += hoặc setTranslation cho driving; không dùng impulse/force/raycast vehicle/character controller.
5. Body thực tế **dynamic**, CCD bật, khóa pitch/roll, yaw cho phép. Explicit cuboid half-extents [0.85,0.35,1.5], offset [0,0.45,0], friction 0. Comment “Arcade Kinematic States” không phản ánh loại body.
6. Roll/pitch chassis, bánh lái, bánh quay, flame là visual animation. FerrariModel clone GLTF và thay material theo profile; đã có interface speedRef/steerAngleRef phù hợp tái sử dụng.
7. Telemetry minimap/speed/boost ghi store mỗi 4 frame; race timer ghi store mỗi frame khi đang đua. FX có React state update theo threshold.

**Physics blockers:** render loop và physics timestep chưa độc lập; speedRef là tốc độ mong muốn, không đo tốc độ sau collision nên xe vẫn báo nhanh/quay bánh khi ép tường. Ghi lại horizontal velocity/yaw liên tục làm mất một phần phản ứng collision. Chưa có grounded check hoặc recovery ngoài world. Camera đọc raw body translation/rotation với hệ số lerp cố định mỗi frame (CameraFollow.tsx:33–79), nên damping phụ thuộc FPS; khi chuyển fixed step cần follow visual interpolated transform hoặc target được damp riêng.

**Bug source có thể chứng minh:** vehicleFX.speed lưu abs(speed), nhưng điều kiện so với signed currentSpeed (Vehicle.tsx:177–189), khiến khi lùi có thể setState mỗi frame. `isBraking` không có trong điều kiện phát hiện thay đổi, nên brake-only transition có thể cập nhật chậm. Ref callback dùng `any`; không nhân bản pattern này sang remote.

Identity từ localStorage qua OverlayUI useEffect, không lấy theo IP. JSON cache chưa validate. Các tab cùng origin có thể dùng chung profile ID. Badge trên xe chỉ là box/plane/strip, chưa render chuỗi callsign và chưa billboard; README mô tả nhiều hơn code thực tế.

## 5. Existing physics và collider inventory

| Object/source | Hiện trạng | Hướng xử lý |
|---|---|---|
| Ground.tsx:23–26 | Fixed cuboid 190×20×250, mặt trên y=0 | Giữ collider đơn giản, đồng bộ cao độ visual |
| Ground.tsx:85–90 | 4 cuboid boundary trong một fixed body | Giữ; test nitro vào cạnh/góc |
| 5 district platforms | Mỗi platform có fixed cuboid cao 0.4–0.5m | Giữ; kiểm tra bậc và đường tiếp cận sensor, thêm ramp nhỏ nếu cần |
| MilestoneZone.tsx:52–71 | 4 fixed cylinder sensors ở About/Tech/Experiment/Contact | Giữ visual/behavior; chỉ local được trigger |
| ProjectGarage.tsx:63–75 | 3 fixed cylinder sensors theo project bay; chỉ enter | Giữ chọn project; xác định exit policy, không vô tình đổi behavior đang sticky |
| RoadNetwork.tsx:149–238 | 1 finish + 3 checkpoint cuboid sensors | Giữ local race, loại remote khỏi trigger |
| CityBuildings.tsx | 14 building instances, 2 fountain, 6 park/tree clusters chỉ GLTF visual; nằm ngoài Physics | Thêm fixed primitive proxies theo placement/model bounds |
| InstancedProps.tsx | 20 đèn, 4 barriers, 12 trees trong 5 instanced meshes; không collider | Dùng cùng placement tạo cuboid/capsule cho barrier, pole, trunk |
| District furniture/reactor/masts/pylons | Platform có collider, đồ vật phía trên chủ yếu visual | Thêm primitive cho vật cản chính; hologram/beam tiếp tục visual |
| Roads, markings, neon, sign/banner | Visual; mặt đường dựa ground, cột cổng chưa có collider | Không collider cho decal/light; bổ sung cột vật lý khi xe tiếp cận |
| Local Vehicle | 1 dynamic body + chassis cuboid | Refactor controller, giữ model/feel |
| RivalRacers.tsx:37–59 | 3 AI local, mutate group.position/rotation theo CatmullRom; không body | Giữ như ambient AI, không tính là visitor hoặc đồng bộ như người thật |
| Rock/ramp | Không tìm thấy component rock/ramp chuyên biệt trong source hiện tại | Không tự tạo nội dung ngoài scope; ramp chỉ để bảo toàn đường vào platform |

Tổng explicit từ source: 19 rigidbodies, 22 colliders gồm 11 solid và 11 sensors. Đây là kiểm đếm khai báo, chưa đo runtime. Không thấy trimesh hay collision groups. Mesh nằm trong `<Physics>` đơn thuần không tự có collider.

**Cao độ lệch:** visual mặt đảo Ground.tsx ở y=0.29 nhưng physical floor y=0; phải đối chiếu bánh xe và road visual trước khi quyết định chỉnh mặt nào. Không nâng sàn hàng loạt mà chưa kiểm tra sensor/platform.

**Waypoint lệch sensor thực tế:**

| District | waypoint store (x,z) | sensor center world (x,z) |
|---|---|---|
| About | (0,52) | (0,34) |
| Tech | (0,-52) | (0,-34) |
| Projects | (62,0) | (45.8,-10), (45.8,0), (45.8,10) |
| Experiments | (-62,0) | (-38,0) |
| Contact | (0,-105) | (0,-71) |

Nguồn: useGameStore.ts:23–29 cộng parent/local position trong từng district. Khi building có collider, waypoint hiện có thể dẫn vào/vượt công trình thay vì khu tương tác. Dùng điểm tiếp cận sensor làm navigation target, không di chuyển district để khớp README. Collider garage cần compound walls/pillars để giữ bay openings; không phủ kín bằng một box bao toàn model. Kích thước proxy phải đo GLB đã áp scale/rotation, chưa có số đo bounds runtime trong audit này.

## 6. Existing state, performance và technical debt

useGameStore giữ theme, playerProfile, active/visited milestone, targetWaypoint, selectedProject, race/lap/checkpoint/notification, vehiclePos/speed/boost, intro/card/QuickView/minimap, joystick, audio, quality, FPS. Chưa có room/selfId/remote map/connection state.

Selectors hiện giúp tránh mọi store update rerender toàn scene. Tuy nhiên race HUD cập nhật theo frame khi đua, minimap mỗi 4 frame tương đương 15Hz ở 60FPS nhưng 36Hz ở 144FPS. `quality` chưa được dùng để điều chỉnh renderer. PerformanceMonitor.tsx cập nhật mỗi 45 frame và clamp FPS tối đa 60, xuất hiện cả production qua HUD; chưa đo draw calls/physics time/network/memory.

Rủi ro cần benchmark, chưa kết luận bottleneck:

- Mỗi Ferrari có cloned scene/material, transmission glass, point/spot lights; hiện local + 3 AI có ContactShadows. Không sao chép toàn bộ effects/shadows/lights sang 50 remote.
- CityBuildings tắt frustum culling từng mesh; nhiều shadow casters. Giữ instancing của props.
- FerrariModel tạo material trong useMemo nhưng chưa có explicit disposal cho material tự tạo. Khi nhiều join/leave phải đảm bảo chỉ dispose tài nguyên thuộc instance, không dispose geometry/material cache GLTF dùng chung.
- GLB lớn nhất: PrimaryIonDrive 5,800,408 bytes; Ferrari 1,681,572 bytes. Có 8 asset city nhỏ hơn và texture colormap; Environment preset tải riêng. Không đúng với mô tả “100% procedural/zero asset downloads” trong portfolio data; không tự sửa nội dung marketing trong scope này.
- Một số object allocations vẫn có ở render loop; tuyên bố zero-allocation trong README chưa được profiler xác nhận.
- Timer notification trong store và nested intro timer chưa có ownership/cleanup đầy đủ; ưu tiên network timers có lifecycle rõ ràng, không mở rộng thành refactor UI toàn bộ.

## 7. Preserve / refactor / không chạm

**Preserve:** App Router và ssr:false, Canvas/theme/light design, Suspense isolation, world layout, assets, FerrariModel wheel/color/reverse behavior, arcade tuning, keyboard/mobile controls, compass/minimap, sensors, lap/checkpoints, sound và ambient AI.

**Refactor có giới hạn:** Vehicle controller/FX/ref interface; CameraFollow damping/target; world collider proxies và placement dùng chung; local-only sensor filtering; navigation coordinates; profile validation/session separation; frontend/server transport mới; performance instrumentation.

**Không chạm:** biography, project case studies, contact URLs, QuickView content/layout, theme palette/global CSS, metadata/not-found, binary GLBs/textures, đường đua AI và logic đua hiện có ngoài integration fixes có test. Không thêm chat/emote/account/leaderboard/DB/matchmaking UI.

## 8. Proposed architecture và contracts

Giữ folder `components/vehicle`, không dựng game engine abstraction mới:

```text
LocalPlayer → input → controller (physics 60Hz) → dynamic body
                ├─ visual model/FX + local camera target
                └─ read actual pose → transport sender 15Hz
                       ↓ PLAYER_MOVE
Node/Colyseus WorldRoom → validate → accepted PlayerState → patches ~15Hz
                       ↓
remoteBuffers[id] → sample delayed timeline → kinematic body → FerrariModel/name
```

Colyseus phù hợp vì room lifecycle và schema synchronization là phần đang thiếu. Schema state do server mutate; thay đổi được gộp theo patch interval. Không gửi thêm full snapshot broadcast song song với cùng schema patches. [Tài liệu state synchronization](https://docs.colyseus.io/state).

Contract dự kiến trong `shared/playerProtocol.ts` (chỉ thiết kế, chưa tạo code):

| Kiểu | Fields / quy tắc |
|---|---|
| PlayerMetadata | id server cấp theo session; name; bodyColor/accentColor; connected. Profile local chỉ đề nghị appearance |
| PlayerPose | position{x,y,z}; rotation{x,y,z,w}; velocity{x,y,z}; animationState idle/driving/reversing/braking/boosting; steerAngle |
| PlayerMove | protocolVersion; seq tăng dần; PlayerPose. Không tin id/name/timestamp client để xác định quyền |
| PlayerNetworkState | metadata + pose + seq + timestamp theo server; lưu metadata riêng khỏi transform buffer ở client |
| PlayerAction | enum nhỏ cho trạng thái đã tồn tại; không mở thêm gameplay. Transient action nếu dùng phải có seq/rate limit |

Đơn vị mét/giây, Y-up, xe tiến theo -Z; quaternion normalize, slerp đường ngắn nhất. Room key cấu hình `world-main`, world/protocol version kiểm tra khi join. Một process/room tối đa 50 visitor ban đầu; capacity trả trạng thái rõ ràng, không âm thầm tạo world thứ hai khiến người dùng tưởng vẫn cùng phòng. Có thể thêm room keys sau này.

Server quản lý session, spawn rải quanh vùng trống gần [0,1.2,14], accepted transform, velocity, actions và timestamps. Validate payload hữu hạn, bounds, quaternion, enum, sequence, tốc độ/displacement theo server elapsed time với tolerance jitter/boost; rate/payload size cap; origin allowlist cấu hình. Không chứng minh đường đi tránh building vì server không chạy world physics. Đây là **server kiểm tra transform do client báo**, không phải authoritative physics đầy đủ.

Nếu từ chối move, trả accepted pose + lý do và resync/recovery policy; correction không được tiếp tục bị speedRef cũ ghi đè. Khi reconnect sau khoảng offline, reset buffer và controller theo accepted pose/spawn có chủ đích; không gửi hàng loạt movement cũ. Offline vẫn cho xem portfolio và lái local, UI kết nối không chặn nội dung.

Zustand network store chỉ giữ status, roomId, selfId, metadata/roster và ping lấy mẫu chậm. Snapshot buffers là Map/ref giới hạn bộ nhớ ngoài React state; copy giá trị ra khỏi mutable schema, không lưu reference schema làm history. Render roster thay đổi khi join/leave/metadata, không khi mỗi XYZ đổi. Transport cleanup chống StrictMode/remount: chỉ một active connection, hủy timer/callback, bỏ kết quả async join đã lỗi thời và leave room vừa join nếu owner đã unmount.

### Physics và collision policy

- Chuyển Physics thành timestep 1/60, interpolation bật; controller update tại physics step, visual animation tại render. Installed Rapier Physics.d.ts xác nhận interpolation không có hiệu lực với `timeStep="vary"`.
- Giữ dynamic chassis và CCD. Dùng velocity/impulse correction có giới hạn dựa actual velocity, preserve vertical gravity; yaw điều khiển bằng angular velocity thay vì overwrite rotation mỗi render. Giữ anti-flip. Benchmark/replay forward/reverse/brake/nitro để bảo toàn cảm giác lái.
- Camera chỉ follow local visual/filtered target; damping theo delta (`1-exp(-k*dt)`), không React state mỗi frame.
- WORLD ↔ LOCAL solid; SENSOR ↔ LOCAL intersection; REMOTE không trigger SENSOR, không giải va chạm với WORLD vì pose đã được local client giải ở máy nguồn. LOCAL ↔ REMOTE mặc định tắt trong rollout đầu; bật thử có kiểm soát phase 6. Collision groups phải cấu hình hai phía.
- Remote vẫn là kinematicPosition body, dùng setNextKinematicTranslation/Rotation tại physics step. Physics interpolates render transform; không đồng thời overwrite mesh transform cạnh tranh với body.
- Hologram/label không solid. Trunk/pole capsule/cylinder, barriers/walls cuboid, garage compound boxes; hull cho static vật thể cần hình dáng hơn; trimesh chỉ nếu đo và xác nhận cần.
- World proxy colliders đồng bộ, không phụ thuộc GLTF tải xong để tránh xe chạy xuyên trước rồi bị kẹt khi collider xuất hiện.

### Remote smoothing, identity và lifecycle

- Sender và server patch khoảng 66.7ms, không phụ thuộc render FPS. Render mục tiêu 60+FPS.
- Buffer khởi điểm 100–150ms, tối đa khoảng 32 samples/player; sample timestamp server sau ước lượng clock offset từ ping/RTT. Lerp position, slerp rotation, giữ discrete animation từ sample thích hợp.
- Bỏ seq cũ; khi thiếu sample mới chỉ extrapolate giới hạn khoảng 100ms rồi hold/fade. Reconnect/respawn/large correction reset buffer thay vì lerp xuyên world. Đây là tham số khởi điểm cần đo jitter, không phải guarantee smoothness.
- Name dùng billboard text/Html nhẹ, pointer-events:none, giới hạn chiều dài và ẩn xa (khởi điểm 45m). Reuse FerrariModel với remote detail option; không local camera/audio/compass/HUD side effects. Chuyển animation flags chỉ khi đổi.
- PLAYER_JOIN/LEAVE ánh xạ roster schema add/remove; PLAYER_MOVE là client message; PLAYER_ACTION dành action hiện có. Không duy trì hai danh sách player qua event và schema riêng biệt.
- Profile localStorage giữ mỹ thuật; session ID do server cấp, reconnect token theo tab trong sessionStorage. Test duplicated-tab/token contention: token đang có owner không được chiếm session; tab thứ hai tạo guest session mới.
- Unexpected drop giữ seat tối đa 15s sau khi phát hiện, mark disconnected và ẩn remote collider ngay; heartbeat timeout khởi điểm 10s để ghost có giới hạn khoảng 25s sau mất mạng im lặng. Consented leave xóa ngay. Refresh thử resume trước fresh join; token hết hạn xóa, tạo session mới, cleanup session cũ theo deadline.
- Colyseus có flow automatic retry và manual reconnect sau reload; pin phiên bản server/schema/client tương thích trước khi code, không trộn API các đời. [Room lifecycle](https://docs.colyseus.io/room), [reconnection](https://docs.colyseus.io/room/reconnection).

### Deployment

Frontend giữ pipeline Next.js. Backend Node TypeScript chạy process lâu dài riêng, WSS public endpoint qua biến `NEXT_PUBLIC_MULTIPLAYER_URL`; health endpoint, graceful shutdown, origin config và heartbeat. Chưa chọn vendor hoặc deploy trong phase audit.

Lý do tách là giữ room state trong một process với lifecycle rõ ràng. Tài liệu Vercel hiện ghi WebSocket bị ràng buộc duration của Function và kết nối tương lai không đảm bảo cùng instance; không dựa vào nhận định cũ rằng Vercel hoàn toàn không hỗ trợ WebSocket. [Vercel WebSocket guidance](https://vercel.com/kb/guide/do-vercel-serverless-functions-support-websocket-connections).

## 9. Implementation phases và acceptance gates

| Phase | Task nhỏ | Gate trước phase tiếp theo |
|---|---|---|
| 1 Audit | Báo cáo này, contracts/ownership đề xuất | Người dùng review trước implementation |
| 2 Local physics | P2a fixed timestep/controller; P2b world proxies/ramp access; P2c sensor filtering/waypoints; P2d camera/FX | Một browser: đứng yên, tiến/lùi/phanh/boost, đâm tường/cạnh/góc, vào đủ 5 district/3 bays, race checkpoints, mobile/themes/QuickView không regression |
| 3 Foundation | P3a server room/schema; P3b frontend connection/identity; P3c lifecycle tests | A/B biết nhau, B leave thì A remove; server unavailable vẫn xem portfolio |
| 4 Sync | P4a actual body pose sender; P4b server validation/patch; P4c bounded buffers | Tốc độ gửi/patch ~15Hz ở 30/60/144 render FPS; validate malformed/seq/bounds; rotation/velocity đúng |
| 5 Remote render | P5a kinematic RemotePlayer; P5b interpolation; P5c name/model animation | A/B/C cùng world, hai chiều movement mượt, camera không đổi target; remote không trigger UI/race |
| 6 Collision | P6a stress world at boost; P6b optional local-remote | World collision bắt buộc; chỉ bật player collision nếu không jitter/đẩy xe xuyên tường |
| 7 Hardening | P7a reconnect/refresh/tab close; P7b delayed packets/cleanup | Stable IDs khi resume, không duplicate owner, ghost hết deadline, repeated join/leave không tăng listener/timer/buffer |
| 8 Measure/optimize | P8a load driver; P8b browser profile; P8c sửa bottleneck đã đo | Ma trận 1/5/10/20/50 clients, production build, regression và báo cáo định lượng |

Sau mỗi phase chạy typecheck, lint đã cấu hình, tests liên quan, production build. Chỉ phase 1 chạy audit hiện trạng; chưa có kiểm thử multiplayer để chạy lúc này.

## 10. Agent ownership và lịch song song

Môi trường hiện có tối đa 2 agent đồng thời gồm orchestrator; vì vậy một coding sub-agent hoạt động trong khi lead review/test. Các lane sau có thể chạy song song nếu tăng số slot, nhưng không giả định có 3 coding agents hiện tại.

| Owner | Owned files dự kiến | Contract / giới hạn |
|---|---|---|
| Lead architect/integrator | architecture-report.md; shared/playerProtocol.ts; shared/worldConfig.ts; package.json/lock; tsconfigs; Experience.tsx; validation scripts/config | Chốt contract trước; chỉ integration và review, không viết toàn bộ feature |
| Agent A Physics | vehicle/Vehicle.tsx (facade nếu cần), LocalPlayer.tsx, PlayerController.ts, PlayerCollider.tsx; hooks/useVehicleControls.ts; camera/CameraFollow.tsx; world/**; milestones/MilestoneZone.tsx; game store local behavior | Không server/network. World placement mới trong world/worldPlacements.ts; không đổi content/assets. Public output là local body/visual refs và actual pose |
| Agent B Multiplayer | server/**; src/network/**; stores/useNetworkStore.ts; data/playerProfile.ts; backend/client protocol tests | Không world/controller/camera. Dùng contract đã chốt; không lấy profile id làm session id |
| Agent C Rendering (lane sau) | vehicle/RemotePlayer.tsx, RemotePlayers.tsx, PlayerNameTag.tsx; FerrariModel.tsx; VehicleEffects.tsx nếu cần; three/PerformanceMonitor.tsx; dev-only debug component | Không local physics/network transport. Chỉ đọc buffer API, không sửa schema. Đổi model props cần tương thích caller local/AI |

Path component/store ở bảng tương đối với src/components hoặc src/stores tương ứng; các file mới đều chỉ là proposal. `Experience.tsx`, `package.json`, lockfile và shared contracts chỉ lead chỉnh khi tích hợp. Agent A hoàn tất wrapper local trước khi C chỉnh model/FX; nếu cần handoff một file, owner cũ dừng sửa trước. Không để B/C cùng implement interpolation: B sở hữu buffer/sample math trong src/network, C gọi API trả pose.

Thứ tự khả thi với slot hiện tại: lead chốt contract → A local physics (lead review/baseline) → B foundation/sync (lead verify physics) → C remote render (lead multi-client tests) → B hardening → owner phù hợp tối ưu. Với thêm slots, P2 world/controller và P3 server có thể song song sau contract; không mount networking vào scene trước gate local physics. Review từng diff về types, disposal, callbacks/timers, physics step ownership, store selectors và preservation; build pass chưa đủ approve.

## 11. Validation đã chạy và còn thiếu

| Check baseline | Kết quả thực tế |
|---|---|
| `node node_modules/typescript/bin/tsc --noEmit --incremental false` | PASS, exit 0 |
| `npm.cmd run build` | PASS, exit 0; Next 15.5.25, static routes / và /_not-found |
| `npm.cmd run lint` | Chưa chạy được lint: next lint yêu cầu cấu hình ESLint, exit 1 trong phiên không tương tác; không tạo config |
| Test suite | Không tìm thấy test runner/config/test script trong project source |
| Browser gameplay/console | Chưa chạy trong audit này; không kết luận camera/collision/UI runtime pass |
| FPS/network/physics/memory | Chưa benchmark; không tuyên bố đạt 60FPS hoặc 50 players |

Build có warning webpack cache “Unable to snapshot resolve dependencies”; compile và static generation vẫn thành công. Build hiển thị first load JS / 122kB, không phải tổng tải 3D dynamic chunks/GLBs. `next lint` báo deprecated trong bản cài hiện tại; bổ sung ESLint CLI/config phù hợp và script typecheck trong task tooling sau approval, không suppress lỗi.

Test có giá trị cần thêm: controller timestep/actual speed sau va chạm; collision/sensor local-only; interpolation seq/quaternion wrap/jitter/underflow/reset; server validation/session lifecycle; 3 clients join/move/rotate/leave/reconnect; refresh/repeated mount cleanup; navigation vào bays sau thêm collider. Physics test phải chạy Rapier hoặc browser, không chỉ mock kiểm tra setter được gọi.

Benchmark: cùng máy/resolution/DPR/theme/route, warm assets trước khi ghi; production mode; 1/5/10/20/50 protocol clients gửi 15Hz và ít nhất 2–3 browser thật render. Ghi FPS median/p95 frame time, draw calls/triangles, body/collider counts, physics/render CPU time, React commits, bytes/s client/server, server CPU/RSS, browser heap và GPU resource trend qua nhiều lần join/leave. Load bots chứng minh networking, không chứng minh 50 browser render đạt FPS. So sánh trước/sau major changes; chỉ thêm distance culling/LOD/AOI nếu dữ liệu chỉ ra cần. Debug overlay mới chỉ development, tắt được; FPS badge cũ không âm thầm bị xóa.

## 12. Quyết định để review

Đề xuất duyệt kiến trúc incremental ở trên: giữ frontend, hoàn thiện local physics trước, backend Colyseus process riêng, client-simulated/server-validated transforms 15Hz, remote kinematic interpolation và player-player collision tắt mặc định. Đồng thời sửa navigation targets theo sensor thực tế và giữ ambient AI local. Chưa triển khai bất kỳ phase 2–8 nào; chưa hoàn thành Definition of Done multiplayer.
