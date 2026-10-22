import { common } from "PotatoEngine/src/materials";
import { Shader } from "PotatoEngine/src/shaders";
import { rgb } from "PotatoEngine/src/util/color";

export const MATERIAL_CERAMIC = "CERAMIC";
export const MATERIAL_BUILDING = "BUILDING";
export const MATERIAL_GOLD = "GOLD";
export const MATERIAL_STEEL = "STEEL";
export const MATERIAL_COIN = "COIN";
export const MATERIAL_GEM = "GEM";
export const MATERIAL_GROUND = "GROUND";
export const MATERIAL_WOOD = "WOOD";

export const SHADER_BASICVERTEX = "basicVertex";
export const SHADER_BASICFRAGMENT = "basicFragment";
export const SHADER_PHONGFRAGMENT = "phongFragment";

export const colors = {
  gold: rgb(255, 222, 33),
  ground: rgb(107, 107, 107),
  steel: rgb(206, 210, 215),
  wood: rgb(218, 109, 66),
};

export function addShaders(scene) {
  scene.addShader(
    new Shader(
      SHADER_BASICVERTEX,
      scene.gl.VERTEX_SHADER,
      "",
      "./PotatoEngine/src/shaders/vertex.vert",
    ),
  );

  scene.addShader(
    new Shader(
      SHADER_BASICFRAGMENT,
      scene.gl.FRAGMENT_SHADER,
      "",
      "./PotatoEngine/src/shaders/fragment.frag",
    ),
  );

  scene.addShader(
    new Shader(
      SHADER_PHONGFRAGMENT,
      scene.gl.FRAGMENT_SHADER,
      "",
      "./PotatoEngine/src/shaders/phong.frag",
    ),
  );
}

///////////////
// MATERIALS //
///////////////

/**
 * Add all the needed materials to the scene
 */
export function addMaterials(scene) {
  scene.addMaterial(
    common.generateMaterial(MATERIAL_CERAMIC, {
      ka: [0.4, 0.4, 0.4],
      kd: [0.4, 0.4, 0.4],
      ks: [0.8, 0.8, 0.8],
      specularExp: 32,
    }),
    "phong",
  );

  scene.addMaterial(
    common.generateMaterial(MATERIAL_BUILDING, {
      ka: [0.3, 0.3, 0.3],
      kd: [0.8, 0.8, 0.8],
      ks: [0.2, 0.2, 0.2],
      specularExp: 32,
    }),
    "phong",
  );

  scene.addMaterial(
    common.generateMaterial(MATERIAL_GROUND, {
      ka: [0.6, 0.6, 0.6],
      kd: [0.3, 0.3, 0.3],
      ks: [0, 0, 0],
      specularExp: 4,
    }),
    "phong",
  );

  // gold material but made to be brighter
  // may want to switch back to normal gold once
  // there are more lights in the scene...
  scene.addMaterial(
    common.generateMaterial(MATERIAL_COIN, {
      ka: [0.2 * 2, 0.17411764705882354 * 2, 0.025882352941176474 * 2],
      kd: [0.5 * 1.2, 0.43529411764705883 * 1.2, 0.06470588235294118 * 1.2],
      ks: [0.9, 0.7835294117647059, 0.11647058823529413],
      specularExp: 1,
    }),
    "phong",
  );

  scene.addMaterial(common.metallic(MATERIAL_GOLD, colors.gold), "phong");
  scene.addMaterial(common.metallic(MATERIAL_STEEL, colors.steel), "phong");
  scene.addMaterial(common.wood(MATERIAL_WOOD, colors.wood), "phong");
}
