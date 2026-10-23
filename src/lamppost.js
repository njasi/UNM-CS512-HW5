import { Scene } from "PotatoEngine";
import {
  generateCone,
  generateConeObject,
  generateCylinderObject,
  generateSphereObject,
} from "PotatoEngine/src/objects";
import { rgb } from "PotatoEngine/src/util/color";
import { MATERIAL_AMBIENT, MATERIAL_STEEL } from "./setup";
import { updateGenericMove } from "./helpers";
import { Light } from "PotatoEngine/src/lights";

let lampNum = 0;

const prevLamp = {};

const lampLights = {};

/**
 *
 * @param {*} x
 * @param {Scene} scene
 * @param {*} param2
 */
export function addLamppost(x, scene, { z = -10, shader = "phong" } = {}) {
  const lampName = `lamp_${lampNum}_{x}`;
  const lamp = generateCylinderObject(lampName, rgb(0, 0, 0), 32, 0.1, 3);

  const lampShadeBottom = generateConeObject(
    lampName + "_bottom",
    rgb(0, 0, 0),
    32,
    0.2,
    0.4,
  );
  lampShadeBottom.position[2] = 1.5;
  lampShadeBottom.rotation[0] = Math.PI;

  const lampShadeTop = generateSphereObject(
    lampName + "_top",
    rgb(0, 0, 0),
    32,
    0.2,
  );
  lampShadeTop.position[2] = 1.5 + 0.4;

  const lampBulb = generateCylinderObject(
    lampName + "_bulb",
    rgb(255, 255, 255),
    32,
    0.18,
    0.4,
  );
  lampBulb.position[2] = 1.5 + 0.2;
  lampBulb.materialLabel = MATERIAL_AMBIENT

  lamp.position[0] = x;
  lamp.position[1] = 1.5;
  lamp.position[2] = z;
  lamp.rotation[0] = -Math.PI / 2;
  lamp.addChild(lampShadeBottom);
  lamp.addChild(lampShadeTop);
  lamp.addChild(lampBulb);

  const light = new Light(lampName + "light", [x, 3, z]);
  scene.addLight(light);
  lampLights[lampName + "light"] = light;

  scene.addObject(lamp, shader, MATERIAL_STEEL, { addChildren: true });

  lamp.setUpdateCB(updateLamp);
  prevLamp[x] = lamp;
  lampNum++;
}


function updateLamp(dt, scene) {
  updateGenericMove(this, dt, scene, false);
  const lightName = this.label + "light";

  lampLights[lightName].position[1] = 3;
  lampLights[lightName].position[0] = this.position[0];
  lampLights[lightName].position[2] = this.position[2];

  if (this.position[2] > 20) {
    scene.removeObject(this.label);
    scene.removeLight(lightName);
    delete lampLights[lightName];
  }
}
