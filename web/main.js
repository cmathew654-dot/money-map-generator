/**
 * Clover & Co. studio walkthrough.
 *
 * The interesting part is the screen. `CSS3DRenderer` transforms a real
 * <iframe> into the same 3D space as the WebGL scene, but the two layers have
 * no shared depth buffer -- the DOM would otherwise float over the monitor's
 * own bezel. So the DOM layer sits *behind* a transparent WebGL canvas, and a
 * depth-only plane on the screen's exact transform punches a hole through the
 * canvas for it to show through. Anything genuinely in front of the screen
 * still writes depth, and still occludes.
 */

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { CSS3DRenderer, CSS3DObject } from "three/addons/renderers/CSS3DRenderer.js";

const SCREEN_NODE = "CRT_ScreenFace";
const IFRAME_W = 640, IFRAME_H = 480;      // the page is authored at 4:3
const EYE = 1.62;                          // standing eye height, metres
const SPAWN = new THREE.Vector3(0.05, EYE, -2.15);

const $ = (id) => document.getElementById(id);
const clock = new THREE.Clock();

// ---------------------------------------------------------------- renderers
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, 0.05, 80);
camera.position.copy(SPAWN);

const gl = new THREE.WebGLRenderer({ antialias: true, alpha: true });
gl.setPixelRatio(Math.min(devicePixelRatio, 2));
gl.setSize(innerWidth, innerHeight);
gl.setClearColor(0x000000, 0);            // transparent: the hole needs this
gl.toneMapping = THREE.NeutralToneMapping;
gl.toneMappingExposure = 0.62;
gl.domElement.id = "gl";
document.body.appendChild(gl.domElement);

const css = new CSS3DRenderer();
css.setSize(innerWidth, innerHeight);
$("css3d").appendChild(css.domElement);

// ---------------------------------------------------------------- lighting
// The GLB carries no baked lighting yet, so light it live for now. Once the
// Cycles bake lands these get dropped and the surfaces go unlit.
scene.add(new THREE.HemisphereLight(0xfff0d8, 0x4a3a2c, 0.38));
const sun = new THREE.DirectionalLight(0xffd9a0, 1.15);
sun.position.set(-4.2, 3.4, 2.6);
scene.add(sun);
const warm = new THREE.PointLight(0xffcf8a, 6, 6, 2);
warm.position.set(0.85, 1.35, 0.45);
scene.add(warm);
const fill = new THREE.PointLight(0xbfd4ff, 2.5, 9, 2);
fill.position.set(0.2, 2.2, -1.6);
scene.add(fill);

// ---------------------------------------------------------------- the hole
const holeMat = new THREE.MeshBasicMaterial({ colorWrite: false });
const hole = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), holeMat);
hole.renderOrder = -1;                    // lay the depth down before anything else
scene.add(hole);

const iframe = document.createElement("iframe");
iframe.src = "./site/index.html";
iframe.style.cssText =
  `width:${IFRAME_W}px;height:${IFRAME_H}px;border:0;background:#FBFAF6`;
const screenObj = new CSS3DObject(iframe);
scene.add(screenObj);

let screenAnchor = null;

function placeScreen(node) {
  node.updateWorldMatrix(true, false);
  const box = new THREE.Box3().setFromObject(node);
  const size = box.getSize(new THREE.Vector3());
  // the face is a thin plane: its two largest axes are the picture area
  const dims = [size.x, size.y, size.z].sort((a, b) => b - a);
  const w = dims[0], h = dims[1];

  const pos = new THREE.Vector3(), quat = new THREE.Quaternion(), scl = new THREE.Vector3();
  node.matrixWorld.decompose(pos, quat, scl);

  hole.position.copy(pos);
  hole.quaternion.copy(quat);
  hole.scale.set(w, h, 1);

  screenObj.position.copy(pos);
  screenObj.quaternion.copy(quat);
  // CSS3D works in CSS pixels; scale the element down to metres
  screenObj.scale.set(w / IFRAME_W, h / IFRAME_H, 1);

  // nudge the DOM a hair behind the punch plane so they never z-fight
  const back = new THREE.Vector3(0, 0, -0.004).applyQuaternion(quat);
  screenObj.position.add(back);

  screenAnchor = { pos: pos.clone(), quat: quat.clone(), w, h };
  node.visible = false;                   // the iframe replaces it
  return screenAnchor;
}

// ---------------------------------------------------------------- load
const loader = new GLTFLoader();
let sceneReady = false;
const colliders = [];
const uiPlates = [];

loader.load("./clover-studio.glb", (gltf) => {
  const root = gltf.scene;
  scene.add(root);

  root.traverse((o) => {
    if (!o.isMesh) return;
    o.frustumCulled = true;
    const m = o.material;
    if (m) {
      // Blender's transmissive glass reads as opaque black without a
      // background to refract; drop it to a simple tint for the walkthrough.
      if (m.transmission > 0) {
        m.transmission = 0; m.transparent = true;
        m.opacity = 0.16; m.roughness = 0.08; m.depthWrite = false;
      }
      if (m.emissiveIntensity > 1) m.emissiveIntensity = 1.0;
    }
    // The emissive Win95 plates sit ~1.5mm behind the punch plane, too close
    // for the depth buffer to separate at this distance. The live iframe
    // replaces them, so retire them rather than fight the z-fighting.
    if (o.name.startsWith("ui_")) { uiPlates.push(o); o.visible = false; }
    if (/Floor|Desk_Top|Wall|Ceiling|Shelf|Credenza/.test(o.name)) colliders.push(o);
  });

  const node = root.getObjectByName(SCREEN_NODE);
  if (node) {
    const a = placeScreen(node);
    log(`screen ${a.w.toFixed(3)}×${a.h.toFixed(3)}m @ ` +
        `${a.pos.x.toFixed(2)},${a.pos.y.toFixed(2)},${a.pos.z.toFixed(2)}`);
  } else {
    log(`!! ${SCREEN_NODE} not found`);
  }

  sceneReady = true;
  const l = $("load");
  l.style.opacity = "0";
  setTimeout(() => l.remove(), 550);
}, (e) => {
  if (e.total) {
    const pct = Math.round((e.loaded / e.total) * 100);
    $("barf").style.width = pct + "%";
    $("lmsg").textContent = `loading studio… ${pct}%`;
  }
}, (err) => { $("lmsg").textContent = "load failed: " + err; });

// ---------------------------------------------------------------- controls
const keys = new Set();
let yaw = 0, pitch = 0, dragging = false;
let mode = "walk";                         // "walk" | "screen"

addEventListener("keydown", (e) => {
  keys.add(e.code);
  if (e.code === "KeyE") toggleScreen();
  if (e.code === "Escape" && mode === "screen") toggleScreen();
});
addEventListener("keyup", (e) => keys.delete(e.code));

gl.domElement.addEventListener("pointerdown", (e) => {
  dragging = true; gl.domElement.setPointerCapture(e.pointerId);
});
gl.domElement.addEventListener("pointerup", () => { dragging = false; });
gl.domElement.addEventListener("pointermove", (e) => {
  if (!dragging || mode !== "walk") return;
  yaw -= e.movementX * 0.0026;
  pitch = Math.max(-1.2, Math.min(1.2, pitch - e.movementY * 0.0026));
});

function toggleScreen() {
  if (!screenAnchor) return;
  mode = mode === "walk" ? "screen" : "walk";
  // Letting clicks reach the iframe means the canvas must stop eating them.
  gl.domElement.classList.toggle("passthrough", mode === "screen");
  $("btn-screen").dataset.on = mode === "screen" ? "1" : "";
  $("btn-screen").innerHTML = mode === "screen"
    ? 'Back to walking <kbd>Esc</kbd>' : 'Use the computer <kbd>E</kbd>';
}
$("btn-screen").onclick = toggleScreen;
$("btn-hole").onclick = () => {
  // Turning the punch off restores the baked-in Win95 screen, which is what
  // the scene looks like with no DOM layer at all.
  holeMat.colorWrite = !holeMat.colorWrite;
  const live = !holeMat.colorWrite;
  uiPlates.forEach((m) => { m.visible = !live; });
  iframe.style.visibility = live ? "visible" : "hidden";
  $("btn-hole").dataset.on = live ? "1" : "";
};

// ---------------------------------------------------------------- loop
const vel = new THREE.Vector3();
const fwd = new THREE.Vector3(), right = new THREE.Vector3();
const target = new THREE.Vector3();
let seated = null;

function update(dt) {
  if (mode === "screen" && screenAnchor) {
    // ease to a seated position square-on to the monitor
    if (!seated) {
      const back = new THREE.Vector3(0, 0, 0.62).applyQuaternion(screenAnchor.quat);
      seated = screenAnchor.pos.clone().add(back);
      seated.y = screenAnchor.pos.y + 0.02;
    }
    camera.position.lerp(seated, Math.min(1, dt * 3.4));
    target.copy(screenAnchor.pos);
    camera.lookAt(target);
    return;
  }
  seated = null;

  const speed = (keys.has("ShiftLeft") ? 3.1 : 1.45) * dt;
  fwd.set(-Math.sin(yaw), 0, -Math.cos(yaw));
  right.set(Math.cos(yaw), 0, -Math.sin(yaw));
  vel.set(0, 0, 0);
  if (keys.has("KeyW") || keys.has("ArrowUp")) vel.add(fwd);
  if (keys.has("KeyS") || keys.has("ArrowDown")) vel.sub(fwd);
  if (keys.has("KeyD") || keys.has("ArrowRight")) vel.add(right);
  if (keys.has("KeyA") || keys.has("ArrowLeft")) vel.sub(right);
  if (vel.lengthSq() > 0) camera.position.addScaledVector(vel.normalize(), speed);

  camera.position.y = EYE;
  camera.position.x = Math.max(-2.4, Math.min(2.9, camera.position.x));
  camera.position.z = Math.max(-2.4, Math.min(8.6, camera.position.z));

  camera.rotation.set(0, 0, 0);
  camera.rotateY(yaw);
  camera.rotateX(pitch);
}

function log(s) { $("stat").textContent = s; }

function frame() {
  requestAnimationFrame(frame);
  const dt = Math.min(clock.getDelta(), 0.05);
  if (sceneReady) update(dt);
  gl.render(scene, camera);
  css.render(scene, camera);
}
frame();

addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  gl.setSize(innerWidth, innerHeight);
  css.setSize(innerWidth, innerHeight);
});

// expose for the headless harness
window.__studio = { scene, camera, get ready() { return sceneReady; },
                    get anchor() { return screenAnchor; }, toggleScreen };
