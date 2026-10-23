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
import { bandaiNamcoHideTail, cacheBVH, cacheOBJ, generateGridObject, loadBVH, sceneAddBVH } from "PotatoEngine/src/objects";
import { Light } from "PotatoEngine/src/lights";
import { hsv, rgb, rgba } from "PotatoEngine/src/util/color";
import { generateCoin, addCoinSeries } from "./coin";
import { generateTracks, startTracksLoop } from "./tracks";
import { addRandomObstacle } from "./obstacle";
import { LIGHT_DIRECTIONAL } from "PotatoEngine/src/lights/Light";
import { addLamppost, addNextLamp } from "./lamppost";

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


  let skeleton = bandaiNamcoHideTail(
    loadBVH("dash", 3, 16, rgba(0, 0, 0, 1), "player"),
  );
  skeleton.scale = [0.02,0.02,0.02];
  skeleton.rotation[1] = Math.PI
  skeleton.materialLabel = MATERIAL_GROUND;
  sceneAddBVH(scene, skeleton, "phong");

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

  for (let i = 0; i < 3; i++) {
    addNextLamp(6, scene);
    addNextLamp(-6, scene);
  }

  startTracksLoop(0, scene);
  startTracksLoop(4, scene);
  startTracksLoop(-4, scene);
}

/**
 * Add all the starting lights to the scene
 * @param {*} scene
 */
const globalLight = new Light("globalLight", [0, 10, -10], {
  type: LIGHT_DIRECTIONAL,
  direction: [-1, -1, 0],
  intensity: 0.75,
});

const lightSettings = {
  day: {
    color: rgb(244, 233, 155),
    intensity: 0.75,
    sceneColor: rgba(64, 112, 255, 1),
  },
  night: {
    color: rgb(255, 248, 222),
    intensity: 0.2,
    sceneColor: rgb(0, 0, 0),
  },
  gamer: {
    color: rgb(0, 0, 0),
    intensity: 1,
    sceneColor: rgb(0, 0, 0),
  },
};

function addLights(scene) {
  // TODO: make this a global directional light later
  globalLight.color = lightSettings.day.color;
  globalLight.intensity = lightSettings.day.intensity;
  scene.addLight(globalLight);
}

const config = {
  lightMode: "day",
};
/**
 * init event listeners on the controls
 *
 */
function initHandlers() {
  // document.getElementById("spincheck").addEventListener("input", (event) => {
  //   spin = event.target.checked;
  // });
  document
    .getElementById("lightModeSelector")
    .addEventListener("input", (event) => {
      config[event.target.name] = event.target.value;

      globalLight.color = lightSettings[event.target.value].color;
      globalLight.intensity = lightSettings[event.target.value].intensity;
      scene.background = lightSettings[event.target.value].sceneColor;
    });
}

let lastCoin = 0;
let lastTrain = 0;
let lastObstacle = 0;
const COIN_INTERVAL = 2000;
const TRAIN_INTERVAL = 5000;
const OBSTACLE_INTERVAL = 2000;
/**
 * Overall scene update function
 */
function updateScene() {
  ensureBuildingRowPopulated(10, scene);
  ensureBuildingRowPopulated(-10, scene);

  if (scene.time - lastCoin > COIN_INTERVAL) {
    lastCoin = scene.time;
    const x = Math.floor(Math.random() * 3 - 1) * 4;
    // scene.addObject(generateCoin(x, { z: -40 }), shader, MATERIAL_COIN);
    const coinCount = Math.ceil(Math.random() * 6 + 3);
    addCoinSeries(coinCount, x, scene);
  }

  if (scene.time - lastObstacle > OBSTACLE_INTERVAL) {
    lastObstacle = scene.time;
    const x = Math.floor(Math.random() * 3 - 1) * 4;
    addRandomObstacle(x, scene);
  }

  if (scene.time - lastObstacle > TRAIN_INTERVAL) {
    lastTrain = scene.time;
    // TODO put train car on the tracks
  }

  if (config.lightMode == "gamer") {
    globalLight.color = hsv(scene.time / 10, 1, 1);
  }
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

  await cacheBVH(`./public/dash.bvh`, "dash")
  await scene.loadShaders();
  await cacheOBJ("./public/utah_teapot.obj", "teapot");

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

  loader.className = "";
  scene.time = 0;
  setInterval(() => {
    scene.render();
  }, 30);
}

main();
