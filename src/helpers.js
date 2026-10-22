import { rgb } from "PotatoEngine/src/util/color";

/**
 * Generate a random color
 * @returns
 */
export function randomColor(alpha=1) {
  return [Math.random(), Math.random(), Math.random(), alpha];
}

/**
 * Standardize move towards camera function
 */
export function updateGenericMove(obj, dt, scene, del=true) {
  // console.log(scene.time);
  obj.position[2] += 0.5;
  // console.log(obj.position)

  if(del && obj.position[2] > 20) {
    scene.removeObject(obj.label)
  }
}
