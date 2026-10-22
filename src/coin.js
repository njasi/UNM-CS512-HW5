import { generateCylinderObject } from "PotatoEngine/src/objects";
import { colors } from "./setup";
import { updateGenericMove } from "./helpers";

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
