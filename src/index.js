import { addMaterials, addShaders, colors, MATERIAL_GROUND } from "./setup";
import {
  ensureBuildingRowPopulated,
  generateBuilding,
  generateNextBuilding,
} from "./buildings";
import { generateCoin, addCoinSeries } from "./coin";
import { generateTracks, startTracksLoop } from "./tracks";
import { addRandomObstacle } from "./obstacle";
import { addLamppost, addNextLamp } from "./lamppost";
import { createBVHControls, updateBVHControls } from "./bvhControls";

// potato engine imports
import { Controls, lights, Scene } from "PotatoEngine";
import { Light } from "PotatoEngine/src/lights";
import {
  bandaiNamcoHideTail,
  cacheBVH,
  cacheOBJ,
  loadBVH,
  sceneAddBVH,
} from "PotatoEngine/src/objects/loaders";
import { generateGridObject } from "PotatoEngine/src/objects";
import { hsv, rgb, rgba } from "PotatoEngine/src/util/color";
import { LIGHT_DIRECTIONAL, LIGHT_SPOT } from "PotatoEngine/src/lights/Light";
import { scaleVec4 } from "PotatoEngine/src/util/vec4";

const loader = document.getElementById("loader-wrapper");
const scoreSpan = document.getElementById("score");
// try to plug in new scene abstraction
const scene = new Scene("glcanvas");

scene.camera.move(0, -2, -2);
scene.rotationX += Math.PI / 6 / 2;

let player;
let targetProgram = "phong";
let barrelProgram = "phong";
/**
 * Initalize all the objects in the starting scene
 * - ground
 * - buildings
 * - TODO: tracks
 */
function initSceneObjects() {
  for (let i = 0; i < 30; i++) {
    ensureBuildingRowPopulated(-10, scene, { shader: targetProgram });
    ensureBuildingRowPopulated(10, scene, { shader: targetProgram });
  }

  player = bandaiNamcoHideTail(
    loadBVH("dash", 3, 16, rgba(0, 0, 0, 1), "player"),
  );

  player.scale = [0.02, 0.02, 0.02];
  player.rotation[1] = Math.PI;
  player.materialLabel = MATERIAL_GROUND;
  sceneAddBVH(scene, player, targetProgram);
  makePlayerCollidable();

  const ground = generateGridObject(
    "testGround",
    colors.ground,
    5,
    1000,
    0,
    0,
    0,
  );
  ground.lightingCenter = undefined;
  scene.addObject(ground, targetProgram, MATERIAL_GROUND);

  for (let i = 0; i < 5; i++) {
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
    intensity: 0,
    sceneColor: rgb(0, 0, 0),
  },
  gamer: {
    color: rgb(0, 0, 0),
    intensity: 1,
    sceneColor: rgb(0, 0, 0),
  },
};

const spot = new Light("spot", [0, 4, 10], {
  type: LIGHT_SPOT,
  direction: [0, -1, -1],
  intensity: 0,
  cutoff: Math.PI / 8,
});

function addLights(scene) {
  // TODO: make this a global directional light later
  globalLight.color = lightSettings.day.color;
  globalLight.intensity = lightSettings.day.intensity;
  scene.addLight(globalLight);
  scene.addLight(spot);
}

const config = {
  lightMode: "day",
};
/**
 * init event listeners on the controls
 *
 */
function initHandlers() {
  document.getElementById("runcheck").addEventListener("input", (event) => {
    player.animationPlay = event.target.checked;
  });

  const matSel = document.getElementById("playerMat");

  scene.materials.forEach((mat) => {
    if (mat.label.startsWith("FLAT_")) {
      return;
    }
    matSel.innerHTML += `<option value="${mat.label}">${mat.label}</option>`;
  });

  matSel.addEventListener("input", (event) => {
    player.materialLabel = event.target.value;
  });

  document
    .getElementById("lightModeSelector")
    .addEventListener("input", (event) => {
      config[event.target.name] = event.target.value;

      globalLight.color = lightSettings[event.target.value].color;
      globalLight.intensity = lightSettings[event.target.value].intensity;
      scene.background = lightSettings[event.target.value].sceneColor;

      if (event.target.value == "day") {
        spot.intensity = 0;
      } else {
        spot.intensity = 5;
      }
    });

  document
    .getElementById("shadingSelector")
    .addEventListener("input", (event) => {
      const target = event.target.value;
      if (!["phong", "flat", "basic"].includes(target)) {
        return;
      }

      barrelProgram = target;
    });
}

function makePlayerCollidable() {
  player.score = 0;
  player.hitboxRadius = 2;
  player.collidable = true;
}

let lastCoin = 0;
let lastTrain = 0;
let lastObstacle = 0;
const COIN_INTERVAL = 2000;
const TRAIN_INTERVAL = 5000;
const OBSTACLE_INTERVAL = 1000;

/**
 * Overall scene update function
 */
function updateScene() {
  ensureBuildingRowPopulated(10, scene, { shader: targetProgram });
  ensureBuildingRowPopulated(-10, scene, { shader: targetProgram });

  if (scene.time - lastCoin > COIN_INTERVAL) {
    lastCoin = scene.time;
    const x = Math.floor(Math.random() * 3 - 1) * 4;
    // scene.addObject(generateCoin(x, { z: -40 }), shader, MATERIAL_COIN);
    const coinCount = Math.ceil(Math.random() * 6 + 3);
    addCoinSeries(coinCount, x, scene, { shader: targetProgram });
  }

  if (scene.time - lastObstacle > OBSTACLE_INTERVAL) {
    lastObstacle = scene.time;
    const x = Math.floor(Math.random() * 3 - 1) * 4;
    addRandomObstacle(x, scene, { shader: barrelProgram });
  }

  if (scene.time - lastObstacle > TRAIN_INTERVAL) {
    lastTrain = scene.time;
    // TODO put train car on the tracks
  }

  if (config.lightMode == "gamer") {
    globalLight.color = hsv(scene.time / 10, 1, 1);
  }

  const sec = scene.time / 1000;

  spot.direction = [Math.cos(sec) / 3, -0.5, -1];
}

scene.setUpdateCB(updateScene);

function setupMobileControls() {
  scene.canvas.addEventListener("touchstart", (event) => {
    const right =
      event.touches[0].clientX - event.target.getBoundingClientRect().left >
      event.target.width / 2;
    const playerX = player.position[0];
    if (right) {
      if (playerX <= 0) {
        player.position[0] += 4;
      }
    } else {
      if (playerX >= 0) {
        player.position[0] -= 4;
      }
    }
  });
}

function setupKeyboardControls() {
  document.addEventListener("keydown", (e) => {
    const playerX = player.position[0];
    switch (e.key) {
      case "a":
      case "ArrowLeft":
        if (playerX >= 0) {
          player.position[0] -= 4;
        }
        break;
      case "d":
      case "ArrowRight":
        if (playerX <= 0) {
          player.position[0] += 4;
        }
        break;
    }
  });
}

const loaderText = document.getElementById("spinner-text");
function onProgress({ loaded, total, percent }) {
  // gh server seems to use compressed serving so percentage is invalid
  // (about 2-3 times higher than the real loaded amount)
  // look into correcting it later, for now just show raw mb...
  const mb = Math.floor(loaded / 10000) / 100;
  loaderText.innerText = `${mb} mb`;
}

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
  addMaterials(scene, true);
  addLights(scene);

  await Promise.all([
    cacheBVH(`./public/dash.bvh`, "dash", onProgress),
    cacheOBJ("./public/utah_teapot.obj", "teapot"),
    scene.load(),
  ]);

  initSceneObjects();
  createBVHControls(player, scene);

  Controls.BasicControls.setupMouseControls(scene);
  // Controls.BasicControls.setupKeyboardControls(scene);
  setupKeyboardControls();
  setupMobileControls();
  initHandlers();

  loader.className = "";
  scene.time = 0;

  let frame = 0;
  setInterval(() => {
    scene.render();
    if (frame % 4 == 0) {
      updateBVHControls(player, scene);
      scoreSpan.innerText = player.score;
    }
    frame++;
  }, 30);
}

main();
