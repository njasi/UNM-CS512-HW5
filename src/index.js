import { Scene, Shader, objects, Controls } from "PotatoEngine";
import { common } from "PotatoEngine/src/materials";
import { rgb } from "PotatoEngine/src/objects";
import {
  addMaterials,
  addShaders,
  SHADER_BASICFRAGMENT,
  SHADER_BASICVERTEX,
  SHADER_PHONGFRAGMENT,
} from "./setup";
const loader = document.getElementById("loader-wrapper");

// try to plug in new scene abstraction
const scene = new Scene("glcanvas");
scene.background = [0, 0, 0, 1];

scene.camera.move(0, 0, -2);

/**
 * Initalize all the objects in the starting scene
 * - 10 random barrels
 * - cannon
 * - pillar canon sits on
 * - water
 */
function initSceneObjects(phong = true) {
  let color = undefined;
  let shader = "basic";
  let mat = undefined;
}

let spin = true;
/**
 * init event listeners on the controls
 *
 */
function initHandlers() {
  document.getElementById("spincheck").addEventListener("input", (event) => {
    spin = event.target.checked;
  });

  document
    .getElementById("shaderSelector")
    .addEventListener("input", (event) => {
      initSceneObjects(event.target.value == "phong");
    });
}

/**
 *
 */
function updateScene() {}

scene.setUpdateCB(updateScene);


/**
 * Main init function
 * - load the scene shaders
 * - init all objects
 * - initialize buffers
 * - attach keyboard, mouse, input listeners
 * - start animation loop
 */
async function main() {
  addShaders(scene);
  addMaterials(scene);

  await scene.loadShaders();

  scene.addProgram("basic", SHADER_BASICVERTEX, SHADER_BASICFRAGMENT);
  scene.addProgram("phong", SHADER_BASICVERTEX, SHADER_PHONGFRAGMENT);

  scene.loadMaterials();

  initSceneObjects();
  scene.initBuffers();

  Controls.BasicControls.setupMouseControls(scene);
  Controls.BasicControls.setupKeyboardControls(scene);
  initHandlers();

  setInterval(() => {
    scene.render();
  }, 30);
}

main();
