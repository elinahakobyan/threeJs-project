import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Experience from "./Experience.js";

export default class Camera {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;

    // Твой фиксированный угол (подбери значения под себя)
    this.cameraOffset = new THREE.Vector3(-20, 40, -28);

    this.setInstance();
    this.setControls();
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      1000,
    );
    this.instance.position.copy(this.cameraOffset);
    this.scene.add(this.instance);
  }

  setControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    const fox = this.experience.world.fox;

    if (fox && fox.model) {
      const foxPosition = fox.model.position;
      const direction = new THREE.Vector3()
        .subVectors(this.instance.position, this.controls.target)
        .normalize();
      const distance = this.instance.position.distanceTo(this.controls.target);
      this.controls.target.copy(foxPosition);

      const newPosition = new THREE.Vector3()
        .copy(foxPosition)
        .add(direction.multiplyScalar(distance));

      this.instance.position.lerp(newPosition, 0.1);
    }

    this.controls.update();
  }
}
