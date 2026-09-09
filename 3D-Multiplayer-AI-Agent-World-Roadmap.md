# 3D Multiplayer + AI Agent World
## Từ Car Portfolio thành một nền tảng thế giới 3D tương tác

> Ý tưởng cốt lõi: không dừng lại ở một **3D car portfolio**, mà phát triển dần thành một **multiplayer 3D social world**, nơi người dùng có thể lái xe, đi bộ, tương tác, gặp nhau, khám phá project, học tập, và tương tác với các AI Agent.

---

# 1. Vision

Car Portfolio hiện tại không phải sản phẩm cuối.

Nó là **Phase 0 / Game Core** của một hệ thống lớn hơn:

```text
Car Portfolio
    ↓
3D World
    ↓
Multiplayer World
    ↓
Social World
    ↓
AI Agent World
    ↓
Persistent User-Generated World
```

Định hướng dài hạn:

> **A multiplayer 3D world where humans and AI agents work, build and explore together.**

Hoặc nếu tập trung vào developer:

> **A 3D multiplayer platform where developers, projects and AI agents live inside the same interactive world.**

---

# 2. Các hướng phát triển sản phẩm

## 2.1 Developer MMO / Social Tech World

Người dùng có thể:

- vào world bằng avatar hoặc xe
- nhìn thấy người khác realtime
- chat
- emote
- khám phá từng district
- vào các building
- xem project
- tham gia event
- tạo personal space

Các khu vực có thể gồm:

```text
Backend City
AI Lab
Security District
DevOps Factory
Creator District
Learning District
SOC Center
```

## 2.2 AI Agent City

Mỗi NPC là một agent.

Ví dụ:

```text
Architect Agent
    ↓
Luna Developer
    ↓
Tester
    ↓
Reviewer
```

Người dùng có thể bước tới NPC:

```text
[E] Talk
```

Sau đó giao task:

```text
Build me a todo API
```

World sẽ visualize workflow:

```text
Architect analyzes
        ↓
creates tasks
        ↓
Luna starts coding
        ↓
Tester runs tests
        ↓
Reviewer validates result
```

AI chỉ chạy khi có event, không chạy liên tục.

## 2.3 Interactive Learning World

Thay vì học qua video/course truyền thống, người dùng đi vào thế giới.

Ví dụ học Microservice:

```text
API Gateway = cổng thành
Kafka = bưu điện
Redis = kho cache
Database = ngân hàng
Service = các tòa nhà chức năng
```

Ví dụ học Security:

```text
SOC Room
    ↓
Live Alerts
    ↓
Threat Investigation
    ↓
Incident Response
```

## 2.4 Multiplayer Build-in-Public World

Mỗi ngày build thêm một phần của city.

Ví dụ series content:

```text
Day 1  - Car physics
Day 3  - Collision
Day 7  - Multiplayer
Day 10 - Player avatars
Day 15 - Chat
Day 20 - AI NPC
Day 25 - User-owned plots
Day 30 - Public beta
```

Người xem không chỉ xem video mà có thể vào trực tiếp world.

## 2.5 Recruiter Challenge Game

Recruiter không chỉ đọc CV.

Họ có thể đi vào các project.

Ví dụ:

```text
Online Exam System
    ↓
10k concurrent users challenge
    ↓
WebSocket room
    ↓
Database scaling
    ↓
Caching
    ↓
Security
```

Portfolio biến thành một interactive technical demo.

## 2.6 Persistent Personal Universe

World phát triển theo thời gian.

```text
Project mới
    ↓
Building mới

Skill mới
    ↓
Unlock khu vực

GitHub activity
    ↓
Factory activity

AI Agent mới
    ↓
NPC mới
```

Portfolio không còn là một website tĩnh mà trở thành digital twin của hành trình nghề nghiệp.

## 2.7 User-Owned Developer World

Mỗi user có một personal plot.

Ví dụ:

```text
Developer City

┌───────────────┐
│ Loc's Base    │
│ Projects      │
│ Skills        │
└───────────────┘

┌───────────────┐
│ John's Base   │
│ Portfolio     │
│ GitHub        │
└───────────────┘
```

User có thể:

```text
Connect GitHub
    ↓
Generate building
    ↓
Repositories become exhibits
    ↓
Skills become rooms
```

Lúc này sản phẩm chuyển từ:

> 3D Portfolio

thành:

> **Platform tạo interactive 3D world cho developer.**

---

# 3. Nguyên tắc kiến trúc quan trọng

## 3.1 Render 3D ở client

Server không render:

- 3D model
- lighting
- shadow
- particle
- animation
- physics thông thường

Client xử lý:

```text
Browser
├── Three.js / R3F
├── Rapier Physics
├── Animation
├── Camera
└── Rendering
```

Server chủ yếu xử lý:

```text
Realtime Server
├── Presence
├── Player state
├── Rooms
├── Chat
├── Interaction events
└── Persistence
```

---

# 4. Refactor Car Portfolio thành Game Core

Structure đề xuất:

```text
src/
├── game/
│   ├── world/
│   ├── vehicle/
│   ├── player/
│   ├── physics/
│   ├── camera/
│   ├── interaction/
│   └── input/
│
├── network/
│   ├── client.ts
│   ├── protocol.ts
│   ├── interpolation.ts
│   └── prediction.ts
│
├── features/
│   ├── portfolio/
│   ├── chat/
│   ├── agents/
│   ├── social/
│   ├── learning/
│   └── districts/
│
├── state/
│   ├── world.store.ts
│   ├── player.store.ts
│   └── network.store.ts
│
└── ui/
```

Quan trọng:

```text
features/portfolio
```

chỉ là **một feature/district**, không phải toàn bộ app.

---

# 5. Phase 1 — Physics thật

Tech:

```text
@react-three/fiber
@react-three/drei
@react-three/rapier
```

Vehicle:

```text
Vehicle
    ↓
RigidBody
    ↓
Ground Collider
Building Collider
Barrier Collider
Tree Collider
Object Collider
```

Xe phải có:

- mass
- acceleration
- braking
- steering
- friction
- collision
- gravity
- reset
- suspension đơn giản nếu cần

Acceptance criteria:

```text
✓ Xe không xuyên vật thể
✓ Map có collider
✓ Camera mượt
✓ FPS ổn định
✓ Spawn/reset ổn định
✓ Desktop input ổn
✓ Mobile input có thể mở rộng
```

---

# 6. Phase 2 — Multiplayer Presence

Kiến trúc ban đầu:

```text
Frontend
Next.js / React
R3F
Rapier
Zustand

        │
     WebSocket
        │
        ▼

Realtime Server
Go

        │
        ▼

PostgreSQL
```

Chưa cần:

```text
Redis
Kafka
Kubernetes
Microservices
```

Một Go server là đủ cho MVP.

---

# 7. Player State Protocol

Ví dụ packet:

```json
{
  "type": "player.move",
  "seq": 1827,
  "position": {
    "x": 12.2,
    "y": 0.4,
    "z": -9.8
  },
  "rotation": 1.62,
  "velocity": 7.3,
  "state": "driving"
}
```

Không gửi 60 lần / giây.

Có thể gửi khoảng:

```text
10–15 updates/s
```

Client khác interpolate lên 60 FPS:

```text
10 FPS network
      ↓
interpolation
      ↓
60 FPS render
```

---

# 8. Room System

Không sync toàn bộ player trên cùng một world.

Dùng room:

```text
World
├── room-001
│   └── max 20–30 users
├── room-002
│   └── max 20–30 users
└── room-003
    └── max 20–30 users
```

Flow:

```text
User enters site
       ↓
Matchmaker
       ↓
Find room
       ↓
Join
```

Điều này tránh:

```text
10,000 players × 10,000 sync
```

---

# 9. Interest Management

Sau room system có thể thêm radius sync.

Ví dụ:

```text
           Player
             ●

       sync radius 50m

      ●    ●    ●

far player → no sync
```

Client chỉ nhận state của người gần mình.

---

# 10. Player + Vehicle System

Không nên coi:

```text
Player = Car
```

Nên chuyển thành:

```text
Player
├── Avatar
└── Vehicle
```

Flow:

```text
walk
 ↓
approach car
 ↓
[E] Enter
 ↓
drive
 ↓
[E] Exit
 ↓
walk
```

Sau này dễ thêm:

```text
car
bike
hoverboard
drone
```

---

# 11. Interaction System

Tất cả object tương tác dùng cùng một abstraction.

Ví dụ TypeScript:

```ts
interface Interactable {
  id: string
  type: string

  canInteract(player: Player): boolean
  interact(player: Player): void
}
```

Các object:

```text
Building
NPC
Billboard
Car
Terminal
Portal
Project
Computer
Door
Elevator
```

UI:

```text
[E] INTERACT
```

---

# 12. World Districts

Map có thể chia thành:

```text
                    WORLD
                      │
       ┌──────────────┼──────────────┐
       │              │              │
 Creator District   AI District   Dev District
       │              │              │
 Portfolio          Agents         Projects
```

Có thể mở rộng thêm:

```text
Security District
Learning District
Social Plaza
Factory District
Museum
Data Center
```

---

# 13. Creator District

Car portfolio hiện tại sẽ trở thành khu vực riêng:

```text
Creator District
├── About
├── Projects
├── Tech Stack
├── Experience
└── Contact
```

Đây là cách giữ toàn bộ giá trị portfolio cũ mà không giới hạn sản phẩm.

---

# 14. Social Layer

Sau multiplayer:

```text
Players
   ↓
Nameplate
   ↓
Emote
   ↓
Chat
   ↓
Party
```

Version đầu chỉ cần text chat.

Packet:

```json
{
  "type": "chat.message",
  "roomId": "world-12",
  "message": "hello"
}
```

Sau đó có thể thêm:

```text
/emote wave
/emote dance
/emote sit
```

Voice chat để sau.

---

# 15. AI Agent City

Ví dụ map:

```text
                AI LAB

       ┌──────────────────┐
       │ Architect Agent  │
       └────────┬─────────┘
                │
                ▼
       ┌──────────────────┐
       │ Luna Developer   │
       └────────┬─────────┘
                │
                ▼
       ┌──────────────────┐
       │ Reviewer Agent   │
       └──────────────────┘
```

Người dùng:

```text
[E] Talk
```

Task:

```text
Build me a todo API
```

Backend:

```text
POST /agent/jobs
```

Ví dụ payload:

```json
{
  "task": "Build me a todo API",
  "agent": "architect"
}
```

---

# 16. AI Agent Runtime

Không để AI call liên tục.

Sai:

```text
NPC
↓
LLM every 5 seconds
↓
$$$$
```

Đúng:

```text
NPC idle
   ↓
user interaction
   ↓
LLM call
   ↓
save result
   ↓
NPC animation
   ↓
idle
```

AI chạy theo event.

---

# 17. Persistent World

PostgreSQL có thể có:

```text
users
players
rooms
worlds
vehicles
inventory
projects
agent_jobs
interactions
personal_plots
```

Ví dụ bảng:

```text
players
-------
id
user_id
display_name
position_x
position_y
position_z
rotation
current_world
vehicle_id
last_seen
```

---

# 18. Không ghi movement liên tục vào DB

Sai:

```text
10 movement packets/s
    ↓
10 DB writes/s/user
```

Đúng:

```text
movement
   ↓
server memory
   ↓
snapshot
   ↓
PostgreSQL
```

Save:

```text
15–30 seconds
```

hoặc:

```text
on disconnect
on room switch
on important checkpoint
```

---

# 19. AI Cost Strategy

Multiplayer không phải phần tốn nhất.

AI mới là phần có khả năng tốn chi phí lớn.

Do đó:

- NPC idle không gọi model
- response cache
- task queue
- agent chạy theo event
- giới hạn request/user
- background animation không dùng model thật
- chỉ agent chính mới gọi LLM
- các hoạt động trang trí chỉ simulation

---

# 20. Zero/Low Traffic Strategy

Không có người:

```text
World
↓
static client
↓
NPC animation local
```

Có người thứ hai:

```text
Realtime server
↓
multiplayer sync
```

Nhờ đó phần lớn thời gian server rất nhẹ.

---

# 21. Tech Stack đề xuất

## Frontend

```text
Next.js hoặc React + Vite
TypeScript
React Three Fiber
Drei
Rapier
Zustand
```

## Realtime Backend

Ưu tiên:

```text
Go
WebSocket
```

Lý do:

- nhẹ
- concurrency tốt
- binary nhỏ
- deploy đơn giản
- phù hợp realtime

## Database

```text
PostgreSQL
```

## Sau này mới thêm

```text
Redis
Queue
Object Storage
CDN
Kubernetes
```

---

# 22. Kiến trúc tổng thể

```text
                    CDN
                     │
              Static 3D Assets
                     │
                     ▼
┌────────────────────────────────────┐
│               CLIENT               │
│                                    │
│ React / Next                       │
│ R3F                                │
│ Rapier                             │
│ Zustand                            │
│                                    │
│ Rendering                          │
│ Physics                            │
│ Animation                          │
│ Interpolation                      │
└──────────────────┬─────────────────┘
                   │
               WebSocket
                   │
                   ▼
┌────────────────────────────────────┐
│          REALTIME SERVER           │
│                 Go                 │
│                                    │
│ Presence                           │
│ Rooms                              │
│ Movement                           │
│ Chat                               │
│ Interaction                        │
└──────────────┬─────────────┬───────┘
               │             │
               ▼             ▼
          PostgreSQL      AI Service
                              │
                              ▼
                     Agent Orchestrator
                              │
                   ┌──────────┼──────────┐
                   ▼          ▼          ▼
              Architect     Luna      Reviewer
```

---

# 23. Roadmap thực tế

## M1 — Game Core

Focus:

- physics
- collision
- vehicle
- camera
- input
- world boundaries

Definition of Done:

```text
Car feels like a real game object.
```

## M2 — Multiplayer

Focus:

- WebSocket
- remote player
- player sync
- interpolation
- connection/disconnection
- room system

Definition of Done:

```text
2–30 users can enter the same room and see each other move.
```

## M3 — Social World

Focus:

- avatar
- enter/exit vehicle
- nameplate
- chat
- emotes

Definition of Done:

```text
Users feel like they are inside a shared world, not a portfolio.
```

## M4 — World Expansion

Focus:

- districts
- buildings
- portals
- interactions
- interior scenes

Definition of Done:

```text
Portfolio becomes only one district.
```

## M5 — AI Agent City

Focus:

- AI NPC
- agent jobs
- agent state
- task visualization
- Architect → Luna → Reviewer flow

Definition of Done:

```text
User can interact with an NPC and watch a real AI workflow execute.
```

## M6 — Platform

Focus:

- account
- persistent world
- user profile
- personal plot
- GitHub integration
- generated developer building

Definition of Done:

```text
Other developers can create their own space inside the world.
```

---

# 24. Không nên làm ngay

Tránh over-engineer quá sớm:

```text
❌ Kubernetes
❌ Kafka
❌ Microservice everywhere
❌ Redis cluster
❌ authoritative MMO physics
❌ voice chat
❌ 1000-player room
❌ AI NPC always-on
```

Chỉ thêm khi có lý do thật.

---

# 25. Ưu tiên performance phía client

Các vấn đề có khả năng xuất hiện trước server:

- quá nhiều draw calls
- texture quá lớn
- quá nhiều mesh
- shadow quá nặng
- collider quá chi tiết
- physics body quá nhiều
- model chưa optimized
- bundle size lớn

Cần dùng:

```text
GLTF/GLB
Draco
Meshopt
LOD
Instancing
Texture compression
Lazy loading
Frustum culling
```

---

# 26. Concept Naming

Không nên giới hạn tên bằng chữ "Portfolio".

Một số hướng:

```text
DevWorld
Agent City
BuildWorld
CodeVerse
DevDistrict
AgentVerse
Creator City
World.dev
DevTown
StackWorld
```

---

# 27. Product Positioning

Giai đoạn đầu:

> Interactive 3D Car Portfolio

Sau multiplayer:

> Multiplayer 3D Developer World

Sau AI Agents:

> A 3D world where humans and AI agents work together.

Sau platform:

> A persistent 3D social platform for developers, projects and AI agents.

---

# 28. Nguyên tắc phát triển

1. Không đập bỏ Car Portfolio hiện tại.
2. Refactor nó thành game core.
3. Physics trước.
4. Multiplayer sau.
5. Social layer sau multiplayer.
6. AI chỉ thêm khi world đã sống.
7. AI chạy theo event.
8. Không over-engineer backend.
9. Tách feature theo district.
10. Mỗi milestone phải chạy được độc lập.

---

# 29. Hướng mở rộng trong tương lai

Có thể thêm:

- creator marketplace
- custom buildings
- user-generated maps
- coding mini-games
- security challenges
- hackathon events
- AI competitions
- project exhibitions
- developer networking
- recruiting events
- virtual tech conference
- collaborative coding rooms
- live GitHub activity
- AI mentor NPC
- AI interview NPC
- code review NPC
- DevOps simulation
- SOC simulation
- microservice visualization
- cloud infrastructure visualization

---

# 30. End Goal

Không phải:

> Làm một portfolio đẹp hơn.

Mà là:

> **Biến một Car Portfolio thành hạt nhân của một persistent 3D multiplayer world, nơi developer, project và AI agent có thể cùng tồn tại, tương tác và phát triển.**

Roadmap:

```text
Car Portfolio
     ↓
Game Core
     ↓
Multiplayer
     ↓
Social World
     ↓
District System
     ↓
AI Agent City
     ↓
Persistent World
     ↓
Developer Platform
```

---

# 31. Bước nên làm ngay

Ưu tiên hiện tại:

```text
1. Refactor project structure
2. Hoàn thiện Rapier physics
3. Thêm collider toàn bộ map
4. Tách Player khỏi Vehicle
5. Tạo network protocol abstraction
6. Dựng Go WebSocket server
7. Sync 2 players
8. Thêm interpolation
9. Room system
10. Chat
```

Chỉ sau đó mới đi vào AI Agent City.

---

**Current focus:**

```text
Car Portfolio → Game Core → Multiplayer
```

Đừng mở rộng AI quá sớm. Làm cho world "sống" trước, rồi mới cho AI vào sống cùng.
