import { Scene, Controls, lights } from "PotatoEngine";
import {
  addMaterials,
  addShaders,
  colors,
  MATERIAL_CERAMIC,
  MATERIAL_COIN,
  MATERIAL_GOLD,
  MATERIAL_GROUND,
  MATERIAL_STEEL,
  SHADER_BASICFRAGMENT,
  SHADER_BASICVERTEX,
  SHADER_PHONGFRAGMENT,
} from "./setup";
import {
  ensureBuildingRowPopulated,
  generateBuilding,
  generateNextBuilding,
} from "./buildings";
import { PhongShaderProgram } from "PotatoEngine/src/shaders";
import { cacheOBJ, generateGridObject } from "PotatoEngine/src/objects";
import { Light } from "PotatoEngine/src/lights";
import { rgb } from "PotatoEngine/src/util/color";
import { generateCoin,addCoinSeries } from "./coin";
import { generateTracks, startTracksLoop } from "./tracks";

const loader = document.getElementById("loader-wrapper");

// try to plug in new scene abstraction
const scene = new Scene("glcanvas");

scene.camera.move(0, -2, -2);
scene.rotationX += Math.PI / 6 / 2;

/**
 * Initalize all the objects in the starting scene
 * - ground
 * - buildings
 * - TODO: tracks
 */
function initSceneObjects() {
  let shader = "phong";
  let mat = MATERIAL_CERAMIC;

  for (let i = 0; i < 30; i++) {
    ensureBuildingRowPopulated(-10, scene);
    ensureBuildingRowPopulated(10, scene);
  }

  const ground = generateGridObject(
    "testGround",
    colors.ground,
    5,
    1000,
    0,
    0,
    0,
  );
  scene.addObject(ground, shader, MATERIAL_GROUND);

  startTracksLoop(0, scene)
  startTracksLoop(4, scene)
  startTracksLoop(-4, scene)

  setInterval(() => {
    const x = Math.floor(Math.random() * 3 - 1) * 4;
    // scene.addObject(generateCoin(x, { z: -40 }), shader, MATERIAL_COIN);
    const coinCount = Math.floor(Math.random() * 5 + 2);
    addCoinSeries(coinCount, x, scene)
  }, 2000);
}

/**
 * Add all the starting lights to the scene
 * @param {*} scene
 */
function addLights(scene) {
  // TODO: make this a global directional light later
  const globalLight = new Light("globalLight", [0, 10, -10]);
  globalLight.color = rgb(244, 233, 155);
  scene.addLight(globalLight);
}

/**
 * init event listeners on the controls
 *
 */
function initHandlers() {
  // document.getElementById("spincheck").addEventListener("input", (event) => {
  //   spin = event.target.checked;
  // });

  // document
  //   .getElementById("shaderSelector")
  //   .addEventListener("input", (event) => {
  //     initSceneObjects(event.target.value == "phong");
  //   });
}

/**
 * Overall scene update function
 */
function updateScene() {
  ensureBuildingRowPopulated(10, scene);
  ensureBuildingRowPopulated(-10, scene);
}

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
  addLights(scene);

  await scene.loadShaders();
  await cacheOBJ("./public/utah_teapot.obj", "teapot")
  
  scene.addProgram("basic", SHADER_BASICVERTEX, SHADER_BASICFRAGMENT);
  scene.addProgram(
    "phong",
    SHADER_BASICVERTEX,
    SHADER_PHONGFRAGMENT,
    PhongShaderProgram,
  );
  scene.loadMaterials();

  initSceneObjects();
  scene.initBuffers();
  
  Controls.BasicControls.setupMouseControls(scene);
  Controls.BasicControls.setupKeyboardControls(scene);
  initHandlers();
  
  loader.className = ""
  setInterval(() => {
    scene.render();
  }, 30);
}

main();
