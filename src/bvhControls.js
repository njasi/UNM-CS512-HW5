const xyzorder = {
  X: 0,
  Y: 1,
  Z: 2,
};

/**
 * Create advanced controls for the bvh skeleton
 *
 * Somewhat dangerously set innerhtml rather than
 * creating dom elements because im tired
 */
export function createBVHControls(skeleton, scene) {
  const controlsWrapper = document.getElementById("controls-BVH");
  controlsWrapper.innerHTML = "";

  /**
   * handle the input update event of a slider
   * @param {*} event
   */
  function handleJointUpdate(event) {
    const joint = scene.getObject(event.target.getAttribute("data-joint"));
    const name = event.target.name;

    if (name.endsWith("rotation")) {
      joint.rotation[xyzorder[name.replace("rotation", "")]] =
        (event.target.value / 180) * Math.PI;
    } else {
      joint.position[xyzorder[name.replace("position", "")]] =
        event.target.value;
    }
  }

  for (const joint of skeleton.jointList) {
    const jointElement = document.createElement("div");
    jointElement.className = "controls-joint";
    const jointNameElement = document.createElement("h3");
    jointNameElement.innerText = joint.label;
    jointElement.appendChild(jointNameElement);

    for (const channel of joint.channels) {
      const rangeParams = channel.endsWith("rotation")
        ? "min=0 max=360 step=1"
        : "min=-50 max=50 step=0.5";
      const label = document.createElement("label");
      // label.innerText = channel;
      label.innerHTML = `${channel}<input type='range' ${rangeParams} id=${channel + joint.label} name=${channel} data-joint=${joint.label}>`;
      label.addEventListener("input", handleJointUpdate);
      jointElement.appendChild(label);
    }

    controlsWrapper.appendChild(jointElement);
  }
}

/**
 * Update the values in the BVH cvontrols based on the current
 * state of the main skeleton's joints
 */
export function updateBVHControls(skeleton, scene) {
  for (const joint of skeleton.jointList) {
    const jointObject = scene.getObject(joint.label);

    for (const channel of joint.channels) {
      const jointID = channel + joint.label;
      const jointControl = document.getElementById(jointID);

      if (channel.endsWith("rotation")) {
        jointControl.value =
          (jointObject.rotation[xyzorder[channel.replace("rotation", "")]] *
            180) /
          Math.PI;
      } else {
        jointControl.value =
          jointObject.position[xyzorder[channel.replace("position", "")]];
      }
    }
  }
}
