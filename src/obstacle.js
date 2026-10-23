import { Scene } from "PotatoEngine";
import {
  generateConeObject,
  generateCubeObject,
  generateCylinder,
  generateCylinderObject,
  generateGridObject,
  generateNGonPrismObject,
  generateOBJObject,
  generateSphere,
  generateSphereObject,
  generateTorusObject,
  PhysicsObject,
} from "PotatoEngine/src/objects";
import { updateGenericMove } from "./helpers";
import {
  colors,
  MATERIAL_CERAMIC,
  MATERIAL_DAMAGE,
  MATERIAL_STEEL,
  MATERIAL_WOOD,
} from "./setup";
import { rgb } from "PotatoEngine/src/util/color";

const SEGMENTS = 16;

/**
 * All the random primitive types to choose from for the obstacles
 */
const OBSTACLE_OPTIONS = [
  // (obstacleName, color) => {
  //   const cyl = generateCylinderObject(obstacleName, color, SEGMENTS, 1, 1);
  //   return cyl;
  // },
  // (obstacleName, color) => {
  //   const cylBulge = generateCylinderObject(
  //     obstacleName,
  //     color,
  //     SEGMENTS,
  //     1,
  //     1,
  //     {
  //       bulge: 0.25,
  //       segments_h: SEGMENTS,
  //     },
  //   );
  //   return cylBulge;
  // },
  // (obstacleName, color) => {
  //   const sphere = generateSphereObject(obstacleName, color, SEGMENTS, 1);

  //   return sphere;
  // },
  // (obstacleName, color) => {
  //   const cone = generateConeObject(obstacleName, color, SEGMENTS, 1, 1);
  //   return cone;
  // },
  // (obstacleName, color) => {
  //   const grid = generateGridObject(obstacleName, color, SEGMENTS, 2);
  //   return grid;
  // },
  // (obstacleName, color) => {
  //   const prism6 = generateNGonPrismObject(obstacleName, color, 6, 1, 1);
  //   return prism6;
  // },
  // (obstacleName, color) => {
  //   const prism4 = generateNGonPrismObject(
  //     obstacleName,
  //     color,
  //     4,
  //     1,
  //     Math.sqrt(2),
  //   );
  //   return prism4;
  // },
  // (obstacleName, color) => {
  //   const prism3 = generateNGonPrismObject(obstacleName, color, 3, 1, 1);
  //   return prism3;
  // },
  // (obstacleName, color) => {
  //   const torus = generateTorusObject(obstacleName, color, SEGMENTS, 1, 0.5);
  //   return torus;
  // },
  // (obstacleName, color) => {
  //   const teapot = generateOBJObject(obstacleName, color, "teapot");
  //   teapot.scale = [0.5, 0.5, 0.5];
  //   return teapot;
  // },
  // (obstacleName, color) => {
  //   const cube = generateCubeObject(obstacleName, color);
  //   return cube;
  // },
  (obstacleName, color, mat_prefix) => {
    const hitboxPrim = generateCylinder(8, 0.75, 2, {
      bulge: 0.25,
      segments_h: SEGMENTS / 2,
      prism: true,
    });
    hitboxPrim.generateColors(color);
    const {
      vertices,
      normals,
      colors: primColors,
      indices,
    } = hitboxPrim.toTypedArray();
    const barrel = new PhysicsObject(
      obstacleName,
      vertices,
      primColors,
      indices,
      normals,
    );

    barrel.gravity = 0;
    barrel.velocity = [0, 0, 0];

    barrel.collidable = true;
    barrel.hitboxRadius = 1;
    barrel.onCollision = (barrel, target) => {
      if (target.label == "playerROOT") {
        target.score = 0;
        barrel.collidable = false;
        target.materialLabel = MATERIAL_DAMAGE;
        setTimeout(() => {
          target.materialLabel = MATERIAL_CERAMIC;
        }, 500);
      }
    };

    // const barrel = generateCylinderObject(obstacleName, color, 8, 0.75, 2, {
    //   bulge: 0.25,
    //   segments_h: SEGMENTS,
    //   prism: true,
    // });
    barrel.rotation[2] = Math.PI / 2;
    barrel.position[1] = 0.8;

    barrel.materialLabel = mat_prefix + MATERIAL_WOOD;

    const strap = generateCylinderObject(
      obstacleName + "_strap1",
      colors.steel,
      SEGMENTS,
      0.9,
      0.2,
    );
    strap.materialLabel = mat_prefix + MATERIAL_STEEL;
    strap.position[2] = 0.7;

    const strap2 = generateCylinderObject(
      obstacleName + "_strap1",
      colors.steel,
      SEGMENTS,
      0.9,
      0.2,
    );
    strap2.materialLabel = mat_prefix + MATERIAL_STEEL;
    strap2.position[2] = -0.7;

    barrel.addChild(strap);
    barrel.addChild(strap2);

    return barrel;
  },
];

let obstacleNum = 0;
/**
 * Add a random obstacle to the scene
 * @param {*} x
 * @param {Scene} scene
 */
export function addRandomObstacle(
  x,
  scene,
  { z = -100, shader = "phong" } = {},
) {
  const obstacleName = `obstacle_${obstacleNum}_${x}`;

  const obj = OBSTACLE_OPTIONS[
    Math.floor(Math.random() * OBSTACLE_OPTIONS.length)
  ](obstacleName, rgb(255, 0, 0), shader == "phong" ? "" : "FLAT_");

  obj.position[0] = x;
  obj.position[2] = z;

  obj.rotation[0] = -Math.PI / 2;

  if (!obj.materialLabel) {
    obj.materialLabel = MATERIAL_CERAMIC;
  }

  console.log("barrel shader", shader);

  obj.setUpdateCB(updateObstacle);
  scene.addObject(obj, shader, obj.materialLabel, { addChildren: true });
  obstacleNum++;
}

/**
 * Move the obstacle towards the player...
 */
function updateObstacle(dt, scene) {
  updateGenericMove(this, dt, scene);
  this.position[2] += 10 * dt;
  this.rotation[1] -= 3 * dt;
}
