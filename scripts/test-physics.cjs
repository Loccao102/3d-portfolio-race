/* Runs the real controller against Rapier without a browser or extra test dependencies. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const RAPIER = require('@dimforge/rapier3d-compat');

require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: filename,
  });
  module._compile(outputText, filename);
};
const {
  createVehicleControllerState,
  stepVehicleController,
  getVehicleForwardSpeed,
  VEHICLE_FIXED_TIMESTEP: DT,
} = require(path.join(__dirname, '../src/components/vehicle/LocalPlayerController.ts'));

const idle = { forward: 0, turn: 0, brake: false, boost: false };
const forward = { ...idle, forward: 1 };
const reverse = { ...idle, forward: -1 };
function fixture({ wall = false, height = 1.2 } = {}) {
  const world = new RAPIER.World({ x: 0, y: -26, z: 0 });
  world.timestep = DT;
  world.createCollider(RAPIER.ColliderDesc.cuboid(100, 10, 100).setTranslation(0, -10, 0));
  const wallCollider = wall ? world.createCollider(RAPIER.ColliderDesc.cuboid(20, 4, 0.2).setTranslation(0, 4, -12)) : null;
  const body = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(0, height, 0).enabledRotations(false, true, false)
    .setLinearDamping(0.1).setAngularDamping(1).setCcdEnabled(true));
  world.createCollider(RAPIER.ColliderDesc.cuboid(0.85, 0.35, 1.5)
    .setTranslation(0, 0.45, 0).setFriction(0), body);
  const state = createVehicleControllerState();
  function run(seconds, controls = idle) {
    for (let i = 0; i < Math.round(seconds / DT); i++) {
      stepVehicleController(body, controls, state, DT);
      world.step();
      const p = body.translation();
      assert.ok(Number.isFinite(p.x + p.y + p.z), 'physics pose must stay finite');
    }
  }
  return { world, body, state, run, wallCollider };
}
async function main() {
  await RAPIER.init();
  let failures = 0;
  function test(name, fn) {
    const worlds = [];
    const make = (opts) => { const f = fixture(opts); worlds.push(f.world); return f; };
    try { fn(make); console.log(`PASS ${name}`); }
    catch (error) { failures++; console.error(`FAIL ${name}: ${error.message}`); }
    finally { worlds.forEach(world => world.free()); }
  }
  test('gravity settles chassis on ground and idle stays stable', make => {
    const f = make({ height: 8 });
    f.run(5);
    const p = f.body.translation();
    assert.ok(p.y > -0.14 && p.y < -0.06, `body y=${p.y}; expected chassis bottom at ground`);
    assert.ok(Math.abs(f.body.linvel().y) < 0.1);
    assert.ok(Math.hypot(p.x, p.z) < 0.01);
  });
  test('forward reaches normal speed, boost increases it, brake stops', make => {
    const f = make();
    f.run(1);
    f.run(1.2, forward);
    const normal = getVehicleForwardSpeed(f.body);
    assert.ok(normal > 22 && normal < 24.2, `normal=${normal}`);
    f.run(0.5, { ...forward, boost: true });
    const boosted = getVehicleForwardSpeed(f.body);
    assert.ok(boosted > 32 && boosted < 36.2, `boost=${boosted}`);
    f.run(1, { ...idle, brake: true });
    assert.ok(Math.abs(getVehicleForwardSpeed(f.body)) < 0.2);
  });
  test('reverse speed stays bounded and steering reverses yaw direction', make => {
    const f = make();
    const r = make();
    f.run(1); r.run(1);
    f.run(0.6, forward); r.run(1, reverse);
    f.run(0.3, { ...forward, turn: -1 });
    r.run(0.3, { ...reverse, turn: -1 });
    assert.ok(f.body.angvel().y > 0.3, 'left while forward must turn yaw positive');
    assert.ok(r.body.angvel().y < -0.3, 'left while reversing must turn yaw negative');
    assert.ok(getVehicleForwardSpeed(r.body) >= -8.7);
    assert.ok(f.state.steerAngle > 0, 'left wheel visual steering must retain original sign');
  });
  test('partial joystick throttle yields a lower cruising speed', make => {
    const f = make(); f.run(1); f.run(2, { ...forward, forward: 0.3 });
    const speed = getVehicleForwardSpeed(f.body);
    assert.ok(speed > 5 && speed < 9, `partial speed=${speed}`);
  });
  test('sustained boost cannot tunnel through thin wall; reversing escapes promptly', make => {
    const f = make({ wall: true }); f.run(1);
    f.run(5, { ...forward, boost: true });
    const p = f.body.translation();
    assert.ok(p.z > -10.5 && p.z < -10, `wall stopped at z=${p.z}`);
    assert.ok(Math.abs(getVehicleForwardSpeed(f.body)) < 0.2, 'telemetry must show actual blocked speed');
    f.run(1, reverse);
    assert.ok(getVehicleForwardSpeed(f.body) < -2, 'reverse must not unwind accumulated desired speed');
    assert.ok(f.body.translation().z > p.z + 1, 'car must back away from wall');
  });
  test('no render-driven updates: identical fixed ticks produce identical poses', make => {
    const a = make(); const b = make(); a.run(1); b.run(1);
    for (let frame = 0; frame < 60; frame++) a.run(1 / 30, forward);
    for (let frame = 0; frame < 120; frame++) b.run(1 / 60, forward);
    const pa = a.body.translation(), pb = b.body.translation();
    assert.ok(Math.hypot(pa.x - pb.x, pa.y - pb.y, pa.z - pb.z) < 1e-5);
  });
  test('releasing throttle after impact cannot apply stored acceleration', make => {
    const f = make({ wall: true }); f.run(1); f.run(4, { ...forward, boost: true });
    f.run(0.2, idle);
    // Removing the obstacle models moving clear of its edge after stopping.
    const stoppedAt = f.body.translation().z;
    f.world.removeCollider(f.wallCollider, true);
    f.run(0.5, idle);
    assert.ok(Math.abs(getVehicleForwardSpeed(f.body)) < 0.2, 'no throttle must not accelerate a stopped car');
    assert.ok(Math.abs(f.body.translation().z - stoppedAt) < 0.1);
  });
  process.exitCode = failures ? 1 : 0;
}
main().catch(error => { console.error(error); process.exitCode = 1; });
