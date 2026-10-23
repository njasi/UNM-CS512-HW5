import {
  generateCylinder,
  generateCylinderObject,
  PhysicsObject,
} from "PotatoEngine/src/objects";
import { colors as projectColors, MATERIAL_COIN } from "./setup";
import { updateGenericMove } from "./helpers";
import { Scene } from "PotatoEngine";

let coinNum = 0;

const COIN_WIDTH = 0.15;
const COIN_RADIUS = 0.4;

export function generateCoin(x, { y = COIN_RADIUS + 0.1, z = 0 } = {}) {
  const coinName = `coin_${coinNum}_${x}`;
  coinNum++;
  const coinPrim = generateCylinder(32, COIN_RADIUS, COIN_WIDTH);
  coinPrim.generateColors(projectColors.gold);

  const { vertices, normals, colors, indices } = coinPrim.toTypedArray();

  const coin = new PhysicsObject(coinName, vertices, colors, indices, normals);
  coin.gravity = 0;
  coin.velocity = [0, 0, 0];

  coin.position[0] = x;
  coin.position[1] = y;
  coin.position[2] = z;
  
  const collidableCoin = Object.assign(
    Object.create(PhysicsObject.prototype),
    coin,
  );
  collidableCoin.setUpdateCB(updateCoin);

  collidableCoin.collidable = true;
  collidableCoin.hitboxRadius = COIN_RADIUS/2;
  collidableCoin.onCollision = (coin, target) => {
    if (target.label == "playerROOT"){
      coin.position[1] = -10;
      target.score += 1;
    }
  };
  return collidableCoin;
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
