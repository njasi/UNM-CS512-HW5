import { generateCylinderObject } from "PotatoEngine/src/objects";
import { colors, MATERIAL_COIN } from "./setup";
import { updateGenericMove } from "./helpers";
import { Scene } from "PotatoEngine";

let coinNum = 0;

const COIN_WIDTH = 0.15;
const COIN_RADIUS = 0.4;

export function generateCoin(x, { y = COIN_RADIUS + 0.1, z = 0 } = {}) {
  const coin = generateCylinderObject(
    `coin_${coinNum}_${x}`,
    colors.gold,
    32,
    COIN_RADIUS,
    COIN_WIDTH,
  );
  coinNum++;

  coin.position[0] = x;
  coin.position[1] = y;
  coin.position[2] = z;
  coin.setUpdateCB(updateCoin);

  return coin;
}

/**
 * player collide with coin
 *
 * collect the coin...
 */
function collideCoin() {}

/**
 * Spin coin, move it towards the camera
 *
 * maybe should have a shared "move towards camera function" since
 * coins will use, buildings, obstacles
 */
function updateCoin(dt, scene) {
  updateGenericMove(this, dt, scene);
  this.rotation[1] += (dt * Math.PI) / 2;
}

/**
 * Generate a series of coins
 */

/**
 *
 * @param {*} count
 * @param {*} x
 * @param {Scene} scene
 * @param {Object} options
 * @param {*} options.y
 * @param {*} options.z
 * @param {number} [options.spacing=4]
 * @param {string} [options.mat=MATERIAL_COIN]
 * @param {string} [options.shader="phong"]
 */
export function addCoinSeries(
  count,
  x,
  scene,
  { y = 0, z = -100, spacing = 4, mat = MATERIAL_COIN, shader = "phong" } = {},
) {
  y = y + COIN_RADIUS + 0.1;

  for (let i = 0; i < count; i++) {
    const coin = generateCoin(x, { y, z: z - spacing * i });
    scene.addObject(coin, shader, mat);
  }
}
