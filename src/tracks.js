import {
  generateNGonPrismObject,
  generateSphereObject,
} from "PotatoEngine/src/objects";
import { colors, MATERIAL_STEEL, MATERIAL_WOOD } from "./setup";
import { rgb } from "PotatoEngine/src/util/color";
import { updateGenericMove } from "./helpers";

let railNum = 0;
const RAIL_RADIUS = 0.2;
const RAIL_WIDTH = 2;
const RAIL_LENGTH = 200;
const PLANK_WIDTH = RAIL_WIDTH + 0.3 + RAIL_RADIUS;
const PLANK_LENGTH = 0.5;

/**
 * Generate train tracks at the given x value
 * @param {*} x 
 * @param {Object} [options={}] 
 * @param {number} [options.length=RAIL_LENGTH] 
 * @param {number} [options.z=0] 
 * @returns 
 */
export function generateTracks(x, { length = RAIL_LENGTH, z = 0 } = {}) {
  // will use this sphere as root of this object
  // TODO add root object type
  const root = generateSphereObject(
    `railRoot_${railNum}_${x}`,
    rgb(0, 0, 0),
    0.1,
    0,
    -20,
  );

  const railLeft = generateNGonPrismObject(
    `railLeft_${railNum}_${x}`,
    colors.steel,
    4,
    RAIL_RADIUS,
    length+1,
  );

  const railRight = generateNGonPrismObject(
    `railRight_${railNum}_${x}`,
    colors.steel,
    4,
    RAIL_RADIUS,
    length+1,
  );

  railRight.position = [2, 0, 0];
  railRight.rotation[2] = Math.PI / 4;
  railLeft.rotation[2] = Math.PI / 4;
  root.position[0] = x;

  railLeft.materialLabel = MATERIAL_STEEL;
  railRight.materialLabel = MATERIAL_STEEL;

  root.addChild(railLeft);
  root.addChild(railRight);

  root.position[0] =  x- RAIL_WIDTH / 2;
  root.position[2] = z;

  for (let i = 0; i < length / 2; i++) {
    const plank = generateNGonPrismObject(
      `railPlank_${railNum}_${x}_${i}`,
      colors.wood,
      4,
      PLANK_LENGTH,
      PLANK_WIDTH,
    );

    plank.rotation = [Math.PI / 2, Math.PI / 4, Math.PI / 2];
    plank.position = [
      RAIL_WIDTH / 2,
      (-PLANK_LENGTH * Math.sqrt(2)) / 2 + RAIL_RADIUS / 2,
      i * 2 - RAIL_LENGTH / 2,
    ];
    plank.materialLabel = MATERIAL_WOOD;

    root.addChild(plank);
  }

  root.setUpdateCB(updateTracks);
  railNum++;

  return root;
}

/**
 * Generate train tracks at the given value positioned to loop cleanly
 * @param {*} x 
 * @param {*} scene 
 * @param {*} shader 
 */
export function startTracksLoop(x, scene, shader = "phong") {
  scene.addObject(generateTracks(x), shader, MATERIAL_STEEL, {
    addChildren: true,
  });

  scene.addObject(
    generateTracks(x, { z: RAIL_LENGTH }),
    shader,
    MATERIAL_STEEL,
    {
      addChildren: true,
    },
  );
}

export function updateTracks(dt, scene) {
  updateGenericMove(this, dt, scene, false);

  if (this.position[2] > RAIL_LENGTH / 2 + 20) {
    this.position[2] = -RAIL_LENGTH;
  }
}
