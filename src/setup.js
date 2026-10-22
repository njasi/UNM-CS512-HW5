export const MATERIAL_CERAMIC = "CERAMIC";
export const MATERIAL_GOLD = "GOLD";
export const MATERIAL_GEM = "GEM";
export const MATERIAL_GROUND = "GROUND";

export const SHADER_BASICVERTEX = "basicVertex";
export const SHADER_BASICFRAGMENT = "basicFragment";
export const SHADER_PHONGFRAGMENT = "phongFragment";

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
    common.generateMaterial(MATERIAL_GROUND, {
      ka: [0.6, 0.6, 0.6],
      kd: [0.3, 0.3, 0.3],
      ks: [0, 0, 0],
      specularExp: 1,
    }),
    "phong",
  );

  scene.addMaterial(common.metallic(MATERIAL_GOLD, colors.gold), "phong");
}
