import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import Experience from "./Experience.js";

export default class Camera {
    constructor() {
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.debug = this.experience.debug;

        this.cameraOffset = new THREE.Vector3(-30, 36, 0);
        this.tempVector = new THREE.Vector3();
        if (this.debug.active) {
            this.setDebug();
        }
        this.setInstance();
        // this.setControls();
    }

    setDebug() {
        this.debugFolder = this.debug.ui.addFolder("Camera Offset");

        this.debugFolder
            .add(this.cameraOffset, "x")
            .min(-100)
            .max(100)
            .step(0.1)
            .name("Offset X");

        this.debugFolder
            .add(this.cameraOffset, "y")
            .min(-100)
            .max(100)
            .step(0.1)
            .name("Offset Y");

        this.debugFolder
            .add(this.cameraOffset, "z")
            .min(-100)
            .max(100)
            .step(0.1)
            .name("Offset Z");

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
        // this.controls.enableDamping = true;
        // this.controls.enableRotate = false
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

    update() {
        const fox = this.experience.world.fox;

        if (fox && fox.model) {
            const foxPosition = fox.model.position;
            const targetPosition = this.tempVector.copy(foxPosition).add(this.cameraOffset);
            this.instance.position.lerp(targetPosition, 0.1);
            this.instance.lookAt(foxPosition);
        }

    }
}
