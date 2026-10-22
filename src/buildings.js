import { generateNGonPrismObject } from "PotatoEngine/src/objects";

import { randomColor, updateGenericMove } from "./helpers";
import { MATERIAL_BUILDING, SHADER_BASICFRAGMENT } from "./setup";

let buildingNum = 0;

// map of x coord to the previous building generated there
const PREV_BUILDINGS = {};

/**
 * generate a building of a random color
 * - should figure out how to have composition prims with different materials?
 *  - or like primsets so they are easy to manipulate
 *  - currently planning on "buildings being rectangular prisms"
 */
export function generateBuilding(
  x,
  {
    heightMin = 4,
    heightMax = 15,
    widthMin = 3,
    widthMax = 6,
    y = 0,
    z = 10,
  } = {},
) {
  const height = Math.random() * (heightMax - heightMin) + heightMin;
  const width = Math.random() * (widthMax - widthMin) + widthMin;
  const radius = (Math.sqrt(2) * width) / 2;
  const color = randomColor();

  //   const z_c = height / 2;
  const build = generateNGonPrismObject(
    `building_${buildingNum}_${x}`,
    color,
    4,
    radius,
    height,
  );
  build.setUpdateCB(updateBuilding);

  build.rotation[0] = -Math.PI / 2;
  build.rotation[1] = Math.PI / 4;
  build.position = [x, y + height / 2, z];

  // just going to shove extra metadata into here maybe make it standard later
  build.meta = {};
  build.meta.width = width;

  buildingNum++;

  return build;
}

/**
 * Scroll the building towards the camera
 *
 * - remove the building from the scene once it goes
 *   past a certain Z coordinate.
 * - should it generate the next one in the series of buildings?
 */
function updateBuilding(dt, scene) {
  updateGenericMove(this, dt, scene);
}

/**
 * Generate a building at the end of a row
 *
 * @param {number} x
 */
export function generateNextBuilding(x) {
  const building = generateBuilding(x);
  const prevBuilding = PREV_BUILDINGS[x];

  if (prevBuilding) {
    building.position[2] =
      prevBuilding.position[2] -
      prevBuilding.meta.width / 2 -
      building.meta.width / 2;
  }

  PREV_BUILDINGS[x] = building;

  return building;
}

/**
 *
 * @param {*} x
 * @param {Scene} scene
 */
export function ensureBuildingRowPopulated(
  x,
  scene,
  { shader = "phong", mat = MATERIAL_BUILDING } = {},
) {
  if ( !PREV_BUILDINGS[x] || PREV_BUILDINGS[x].position[2] > -80) {
    scene.addObject(generateNextBuilding(x), shader, mat);
  }
}
