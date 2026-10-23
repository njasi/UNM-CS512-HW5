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
const prevLamps = {};
const lampLights = {};

/**
 *
 * @param {*} x
 * @param {Scene} scene
 * @param {*} param2
 */
export function addLamppost(x, scene, { z = -10, shader = "phong" } = {}) {
  const lampName = `lamp_${lampNum}_${x}`;
  const lamp = generateCylinderObject(lampName, rgb(0, 0, 0), 8, 0.1, 3);

  const lampShadeBottom = generateConeObject(
    lampName + "_bottom",
    rgb(0, 0, 0),
    8,
    0.2,
    0.4,
  );
  lampShadeBottom.position[2] = 1.5;
  lampShadeBottom.rotation[0] = Math.PI;

  const lampShadeTop = generateSphereObject(
    lampName + "_top",
    rgb(0, 0, 0),
    8,
    0.2,
  );
  lampShadeTop.position[2] = 1.5 + 0.4;

  const lampBulb = generateCylinderObject(
    lampName + "_bulb",
    rgb(255, 255, 255),
    8,
    0.18,
    0.4,
  );
  lampBulb.position[2] = 1.5 + 0.2;
  lampBulb.materialLabel = MATERIAL_AMBIENT;

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
  prevLamps[x] = lamp;
  lampNum++;
}

/**
 * Update a lamp/light & remove its light properly
 * @param {*} dt
 * @param {*} scene
 */
function updateLamp(dt, scene) {
  updateGenericMove(this, dt, scene, false);
  const lightName = this.label + "light";
  const light = lampLights[lightName]
  
  light.position[0] = this.position[0];
  light.position[2] = this.position[2];

  if (this.position[2] > 20) {
    addNextLamp(this.position[0], scene);

    scene.removeObject(this.label, { removeChildren: true });
    scene.removeLight(lightName);
    delete lampLights[lightName];
  }
}

/**
 * Add the next lamp in a row
 * @param {*} x
 * @param {*} scene
 */
export function addNextLamp(x, scene) {
  const prevLamp = prevLamps[x];

  if (!prevLamp) {
    addLamppost(x, scene);
  } else {
    addLamppost(x, scene, { z: prevLamp.position[2] - 50 });
  }
}

/**
 * Set the color and optionally the intensity of all lamps
 * @param {*} color
 * @param {*} intensity
 */
export function setLampsColor(color, intensity = 1) {
  for (const light of Object.values(lampLights)) {
    light.color = color;
    light.intensity = intensity;
  }
}
