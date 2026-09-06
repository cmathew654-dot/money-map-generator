import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { CSS3DRenderer, CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

/* The screen is the whole point. CSS3DRenderer puts a real <iframe> into the
   same 3D space as the WebGL scene, but the two layers share no depth buffer,
   so the DOM would float over the monitor's own bezel. The fix: the DOM layer
   sits behind a transparent WebGL canvas, and a depth-only plane on the
   screen's exact transform punches a hole for it to show through. Anything
   truly in front still writes depth, and still occludes. */

const SCREEN_NODE = "CRT_ScreenFace";
const USE_VERTEX_COLORS = false;
/* Point the monitor at a real site by setting SITE_URL. Left empty, the page
   falls back to the bundled stub in window.__SITE__ via srcdoc. A real URL
   only works when this page is self-hosted (the artifact sandbox blocks it),
   and only if that site does not send X-Frame-Options / frame-ancestors. */
const SITE_URL = "";
const DEBUG = /[?&]debug\b/.test(location.search);
const IFRAME_W = 640, IFRAME_H = 480;
const EYE = 1.60;
const $ = (id) => document.getElementById(id);
const clock = new THREE.Clock();

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x1a1712, 9, 26);
const camera = new THREE.PerspectiveCamera(56, innerWidth / innerHeight, 0.05, 90);
camera.position.set(0.06, EYE, 1.62);

const gl = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
gl.setPixelRatio(Math.min(devicePixelRatio, 2));
gl.setSize(innerWidth, innerHeight);
gl.setClearColor(0x000000, 0);
gl.toneMapping = THREE.NeutralToneMapping;
gl.toneMappingExposure = 1.05;
gl.domElement.id = "gl";
document.body.appendChild(gl.domElement);

const css = new CSS3DRenderer();
css.setSize(innerWidth, innerHeight);
$("css3d").appendChild(css.domElement);

/* Stand-in for the Cycles bake: a warm window key, a lamp pool, a cool fill. */
const hemi = new THREE.HemisphereLight(0xffeed4, 0x3b2f24, 0.70);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffd49a, 1.9);
sun.position.set(-4.6, 3.2, -2.4);
scene.add(sun);
const lamp = new THREE.PointLight(0xffc98a, 6.5, 4.4, 2);
lamp.position.set(0.84, 1.28, -0.47);
scene.add(lamp);
const fill = new THREE.PointLight(0x9fb8e8, 2.2, 10, 2);
fill.position.set(0.1, 2.3, 0.9);
scene.add(fill);
const glowCRT = new THREE.PointLight(0xa9dee2, 0.45, 1.15, 2);
glowCRT.position.set(0.02, 1.03, 0.10);
scene.add(glowCRT);

const holeMat = new THREE.MeshBasicMaterial({ colorWrite: false });
const hole = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), holeMat);
hole.renderOrder = -1;
scene.add(hole);

const iframe = document.createElement("iframe");
if (SITE_URL) iframe.src = SITE_URL;
else iframe.setAttribute("srcdoc", window.__SITE__);
iframe.style.cssText = `width:${IFRAME_W}px;height:${IFRAME_H}px;border:0;background:#FBFAF6`;
const screenObj = new CSS3DObject(iframe);
scene.add(screenObj);

let anchor = null;
const uiPlates = [], meshes = [];
let ready = false;

function placeScreen(node) {
  node.updateWorldMatrix(true, false);
  const size = new THREE.Box3().setFromObject(node).getSize(new THREE.Vector3());
  const [w, h] = [size.x, size.y, size.z].sort((a, b) => b - a);
  const pos = new THREE.Vector3(), quat = new THREE.Quaternion(), s = new THREE.Vector3();
  node.matrixWorld.decompose(pos, quat, s);
  hole.position.copy(pos); hole.quaternion.copy(quat); hole.scale.set(w, h, 1);
  screenObj.position.copy(pos); screenObj.quaternion.copy(quat);
  screenObj.scale.set(w / IFRAME_W, h / IFRAME_H, 1);
  screenObj.position.add(new THREE.Vector3(0, 0, -0.004).applyQuaternion(quat));
  node.visible = false;
  anchor = { pos: pos.clone(), quat: quat.clone(), w, h };
  return anchor;
}

const loader = new GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);

function b64ToBuffer(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out.buffer;
}

$("lmsg").textContent = "decoding geometry\u2026";
$("barf").style.width = "45%";

setTimeout(() => {
  loader.parse(b64ToBuffer(window.__GLB__), "", (gltf) => {
    /* Belt and braces: even with the exporter told not to emit lights, strip
       any that arrive. Blender's sun converts to ~5300 lux and its task lamp
       to ~6400 candela, which drowns the runtime lighting to pure white. */
    const strays = [];
    gltf.scene.traverse((o) => { if (o.isLight) strays.push(o); });
    strays.forEach((l) => l.removeFromParent());
    scene.add(gltf.scene);
    let tris = 0, baked = 0, vbaked = 0;
    gltf.scene.traverse((o) => {
      if (!o.isMesh) return;
      if (o.geometry?.index) tris += o.geometry.index.count / 3;
      const m = o.material;
      /* Props carry their lighting in COLOR_0 from the vertex bake. Same
         rule as the lightmapped surfaces: draw them unlit, or the runtime
         lights the already-lit a second time. */
      /* Disabled: a COMBINED bake at 20 samples across a prop with a handful
         of vertices carries almost no signal, and gltfpack's simplification
         and 8-bit colour quantisation finish it off -- the red wall wedge is
         one triangle, and came back black. The COLOR_0 data still ships for
         a future pass that subdivides first and skips decimation. */
      if (USE_VERTEX_COLORS && m && o.geometry && o.geometry.attributes.color) {
        const vc = new THREE.MeshBasicMaterial({
          vertexColors: true, color: 0xffffff,
          transparent: m.transparent, opacity: m.opacity,
          depthWrite: m.depthWrite, side: m.side,
        });
        vc.name = m.name;
        o.material = vc;
        vbaked++;
        return;
      }
      /* A COMBINED bake already contains albedo, direct light and bounce, so
         these surfaces must be drawn unlit -- a lit material would light
         already-lit pixels a second time. */
      if (m && m.name && m.name.startsWith("Baked_") && m.map) {
        const flat = new THREE.MeshBasicMaterial({ map: m.map });
        flat.map.channel = 1;              // sampled through the Lightmap UVs
        flat.name = m.name;
        o.material = flat;
        baked++;
        return;
      }
      if (m) {
        if (m.transmission > 0) {
          m.transmission = 0; m.transparent = true;
          m.opacity = 0.14; m.roughness = 0.06; m.depthWrite = false;
        }
        if (m.emissiveIntensity > 1) m.emissiveIntensity = 1;
      }
      meshes.push(o);
    });
    const node = gltf.scene.getObjectByName(SCREEN_NODE);
    if (node) {
      const a = placeScreen(node);
      /* The emissive Win95 plates sit ~1.5mm behind the punch plane -- closer
         than the depth buffer can separate at this distance -- and the packer
         renames nodes, so find them geometrically: small meshes sitting inside
         the tube. The live page replaces them. */
      const c = new THREE.Vector3(), sph = new THREE.Sphere();
      for (const m of meshes) {
        if (!m.geometry.boundingSphere) m.geometry.computeBoundingSphere();
        sph.copy(m.geometry.boundingSphere).applyMatrix4(m.matrixWorld);
        if (sph.radius < 0.26 && sph.center.distanceTo(a.pos) < 0.24) {
          uiPlates.push(m); m.visible = false;
        }
      }
    }
    $("tris").textContent = Math.round(tris).toLocaleString();
    $("baked").textContent = baked + " surf / " + vbaked + " props";
    // The room's big surfaces carry their own light now; the remaining lamps
    // only need to shape the props.
    /* With both passes applied the whole room carries its own light, so the
       runtime lamps come out entirely -- no realtime lighting at all. */
    if (baked && vbaked > 100) {
      [sun, hemi, fill, lamp, glowCRT].forEach((l) => { l.intensity = 0; });
      gl.toneMappingExposure = 1.0;
    } else if (baked) {  // lightmapped room, runtime-lit props
      sun.intensity = 1.05; hemi.intensity = 0.42;
      fill.intensity = 1.5; lamp.intensity = 8.0;
      gl.toneMappingExposure = 1.12;
    }
    ready = true;
    $("barf").style.width = "100%";
    const l = $("load");
    l.style.opacity = "0";
    setTimeout(() => l.remove(), 600);
  }, (e) => { $("lmsg").textContent = "parse failed: " + e; });
}, 60);

/* ---------------------------------------------------------------- input */
const keys = new Set();
let yaw = 0, pitch = -0.02, dragging = false, mode = "walk", seated = null;

addEventListener("keydown", (e) => {
  if (["KeyW","KeyA","KeyS","KeyD","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(e.code)) e.preventDefault();
  keys.add(e.code);
  if (e.code === "KeyE") toggle();
  if (e.code === "Escape" && mode === "screen") toggle();
});
addEventListener("keyup", (e) => keys.delete(e.code));
let lastX = 0, lastY = 0;
gl.domElement.addEventListener("pointerdown", (e) => {
  dragging = true; lastX = e.clientX; lastY = e.clientY;
  gl.domElement.setPointerCapture(e.pointerId);
});
gl.domElement.addEventListener("pointerup", () => { dragging = false; });
gl.domElement.addEventListener("pointercancel", () => { dragging = false; });
gl.domElement.addEventListener("pointermove", (e) => {
  if (!dragging || mode !== "walk") return;
  // movementX/Y is only reliable under pointer lock and is empty for touch,
  // so derive the delta from client coordinates instead.
  const dx = e.clientX - lastX, dy = e.clientY - lastY;
  lastX = e.clientX; lastY = e.clientY;
  yaw -= dx * 0.0042;
  pitch = Math.max(-1.15, Math.min(1.15, pitch - dy * 0.0042));
});

function toggle() {
  if (!anchor) return;
  mode = mode === "walk" ? "screen" : "walk";
  const on = mode === "screen";
  gl.domElement.classList.toggle("passthrough", on);
  $("btn-sit").dataset.on = on ? "1" : "";
  $("btn-sit").innerHTML = on
    ? 'Step back <kbd class="desktop-only">Esc</kbd>'
    : 'Use the computer <kbd class="desktop-only">E</kbd>';
  $("legend").style.opacity = on ? "0.25" : "1";
}
$("btn-sit").onclick = toggle;
$("btn-hole").onclick = () => {
  holeMat.colorWrite = !holeMat.colorWrite;
  const live = !holeMat.colorWrite;
  uiPlates.forEach((m) => { m.visible = !live; });
  iframe.style.visibility = live ? "visible" : "hidden";
  $("btn-hole").dataset.on = live ? "1" : "";
  $("btn-hole").textContent = live ? "Live page" : "Baked screen";
};

/* ------------------------------------------------------------ thumbstick */
/* Phones have no WASD. A left-thumb stick drives the same movement vector the
   keys do; the right half of the screen stays free for looking around. */
const stick = { active: false, x: 0, y: 0, id: null };
const pad = $("stick"), nub = $("nub");
const TOUCH = matchMedia("(pointer: coarse)").matches;
if (TOUCH) {
  document.body.classList.add("touch");
  pad.hidden = false;
  const R = 46;
  const set = (e) => {
    const r = pad.getBoundingClientRect();
    let dx = e.clientX - (r.left + r.width / 2);
    let dy = e.clientY - (r.top + r.height / 2);
    const d = Math.hypot(dx, dy) || 1;
    if (d > R) { dx = dx / d * R; dy = dy / d * R; }
    stick.x = dx / R; stick.y = dy / R;
    nub.style.transform = `translate(${dx}px,${dy}px)`;
  };
  pad.addEventListener("pointerdown", (e) => {
    stick.active = true; stick.id = e.pointerId;
    pad.setPointerCapture(e.pointerId); set(e); e.preventDefault();
  });
  pad.addEventListener("pointermove", (e) => {
    if (stick.active && e.pointerId === stick.id) { set(e); e.preventDefault(); }
  });
  const release = () => {
    stick.active = false; stick.x = stick.y = 0;
    nub.style.transform = "translate(0,0)";
  };
  pad.addEventListener("pointerup", release);
  pad.addEventListener("pointercancel", release);
}

/* ---------------------------------------------------------------- loop */
const vel = new THREE.Vector3(), fwd = new THREE.Vector3(), right = new THREE.Vector3();
let fps = 0, acc = 0, frames = 0;

function update(dt) {
  if (mode === "screen" && anchor) {
    if (!seated) {
      seated = anchor.pos.clone().add(new THREE.Vector3(0, 0, 0.60).applyQuaternion(anchor.quat));
      seated.y = anchor.pos.y + 0.015;
    }
    camera.position.lerp(seated, Math.min(1, dt * 3.6));
    camera.lookAt(anchor.pos);
    return;
  }
  seated = null;
  const speed = (keys.has("ShiftLeft") || keys.has("ShiftRight") ? 3.0 : 1.4) * dt;
  fwd.set(-Math.sin(yaw), 0, -Math.cos(yaw));
  right.set(Math.cos(yaw), 0, -Math.sin(yaw));
  vel.set(0, 0, 0);
  if (keys.has("KeyW") || keys.has("ArrowUp")) vel.add(fwd);
  if (keys.has("KeyS") || keys.has("ArrowDown")) vel.sub(fwd);
  if (keys.has("KeyD") || keys.has("ArrowRight")) vel.add(right);
  if (keys.has("KeyA") || keys.has("ArrowLeft")) vel.sub(right);
  if (stick.active) { vel.addScaledVector(fwd, -stick.y); vel.addScaledVector(right, stick.x); }
  if (vel.lengthSq() > 0) camera.position.addScaledVector(vel.normalize(), speed);
  camera.position.y = EYE;
  camera.position.x = Math.max(-2.25, Math.min(2.8, camera.position.x));
  camera.position.z = Math.max(-8.4, Math.min(2.35, camera.position.z));
  camera.rotation.set(0, 0, 0);
  camera.rotateY(yaw);
  camera.rotateX(pitch);
}

function frame() {
  requestAnimationFrame(frame);
  const dt = Math.min(clock.getDelta(), 0.05);
  if (ready) {
    update(dt);
    acc += dt; frames++;
    if (acc > 0.5) { fps = Math.round(frames / acc); acc = 0; frames = 0; $("fps").textContent = fps; }
  }
  gl.render(scene, camera);
  css.render(scene, camera);
}
frame();

/* Debug handle for the headless harness. Only mounted with ?debug in the URL. */
if (DEBUG) window.__dbg = {
  scene, camera, gl,
  lights: () => { const L=[]; scene.traverse(o=>{ if(o.isLight) L.push({t:o.type,i:o.intensity}); }); return L; },
  killLights: () => { scene.traverse(o=>{ if(o.isLight) o.intensity=0; }); },
  emissive: () => { const E=[]; scene.traverse(o=>{ const m=o.material; if(m&&m.emissive){ const s=(m.emissive.r+m.emissive.g+m.emissive.b)*(m.emissiveIntensity||1); if(s>0.05) E.push({n:o.name,s:+s.toFixed(2)}); } }); return E.sort((a,b)=>b.s-a.s).slice(0,10); },
  exposure: (v) => { gl.toneMappingExposure = v; },
  matInfo: (frag) => { const R=[]; scene.traverse(o=>{ const m=o.material;
      if(m && m.name && m.name.toLowerCase().includes(frag)){
        R.push({mat:m.name, type:m.type,
                color:m.color?[+m.color.r.toFixed(3),+m.color.g.toFixed(3),+m.color.b.toFixed(3)]:null,
                vcol:!!m.vertexColors, hasVertexAttr:!!(o.geometry&&o.geometry.attributes.color),
                sheen:m.sheen, sheenColor:m.sheenColor?[+m.sheenColor.r.toFixed(2),+m.sheenColor.g.toFixed(2),+m.sheenColor.b.toFixed(2)]:null,
                trans:m.transmission, opacity:m.opacity});}});
      return R.slice(0,4); }
};

/* three.js fov is vertical, so a portrait phone would crop the room to a
   sliver. Hold the horizontal field constant instead and let the vertical
   open up as the viewport narrows. */
function fitCamera() {
  const a = innerWidth / innerHeight;
  const hFov = 76 * Math.PI / 180;
  camera.fov = a >= 1.15
    ? 56
    : Math.min(92, (2 * Math.atan(Math.tan(hFov / 2) / a)) * 180 / Math.PI);
  camera.aspect = a;
  camera.updateProjectionMatrix();
  gl.setSize(innerWidth, innerHeight);
  css.setSize(innerWidth, innerHeight);
}
fitCamera();
addEventListener("resize", fitCamera);
addEventListener("orientationchange", () => setTimeout(fitCamera, 120));
