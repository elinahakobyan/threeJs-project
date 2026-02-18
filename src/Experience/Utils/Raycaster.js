import gsap from "gsap";
import * as THREE from "three";
import Experience from "../Experience.js";

export default class Raycaster {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.world = this.experience.world;
    this.camera = this.experience.camera;

    this.instance = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    // Следим за мышкой
    window.addEventListener("mousemove", (event) => {
      this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    window.addEventListener("click", (event) => {
      this.onClick();
    });
  }

  onClick() {
    console.log(this.world.intersectObject);
    this.instance.setFromCamera(this.pointer, this.camera.instance);
    const intersects = this.instance.intersectObjects(
      this.world.intersectObjects,
    );

    if (intersects.length > 0) {
      this.world.intersectObject = intersects[0].object.parent.name;
    } else {
      this.world.intersectObject = "";
    }

    const intersectObject = this.world.intersectObject;
    if (intersectObject !== "") {
      if (
        [
          "Bulbasaur",
          "Chicken",
          "Pikachu",
          "Charmander",
          "Squirtle",
          "Snorlax",
          "Character",
        ].includes(intersectObject)
      ) {
        const mesh = this.scene.getObjectByName(intersectObject);
        const jumpHeight = 2;
        const jumpDuration = 0.5;
        const isSnorlax = intersectObject === "Snorlax";

        const currentScale = {
          x: mesh.scale.x,
          y: mesh.scale.y,
          z: mesh.scale.z,
        };

        const t1 = gsap.timeline();

        t1.to(mesh.scale, {
          x: isSnorlax ? currentScale.x * 1.2 : 1.2,
          y: isSnorlax ? currentScale.y * 0.8 : 0.8,
          z: isSnorlax ? currentScale.z * 1.2 : 1.2,
          duration: jumpDuration * 0.2,
          ease: "power2.out",
        });

        t1.to(mesh.scale, {
          x: isSnorlax ? currentScale.x * 0.8 : 0.8,
          y: isSnorlax ? currentScale.y * 1.3 : 1.3,
          z: isSnorlax ? currentScale.z * 0.8 : 0.8,
          duration: jumpDuration * 0.3,
          ease: "power2.out",
        });

        t1.to(
          mesh.position,
          {
            y: mesh.position.y + jumpHeight,
            duration: jumpDuration * 0.5,
            ease: "power2.out",
          },
          "<",
        );

        t1.to(mesh.scale, {
          x: isSnorlax ? currentScale.x * 1.2 : 1,
          y: isSnorlax ? currentScale.y * 1.2 : 1,
          z: isSnorlax ? currentScale.z * 1.2 : 1,
          duration: jumpDuration * 0.3,
          ease: "power1.inOut",
        });

        t1.to(
          mesh.position,
          {
            y: mesh.position.y,
            duration: jumpDuration * 0.5,
            ease: "bounce.out",
          },
          ">",
        );

        if (!isSnorlax) {
          t1.to(mesh.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: jumpDuration * 0.2,
            ease: "elastic.out(1, 0.3)",
          });
        }
      }
    }
  }

  update() {
    this.instance.setFromCamera(this.pointer, this.camera.instance);
    let intersects = this.instance.intersectObjects(
      this.world.intersectObjects,
    );
    if (intersects.length > 0) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "default";
      this.world.intersectObject = "";
    }

    for (let i = 0; i < intersects.length; i++) {
      this.world.intersectObject = intersects[0].object.parent.name;
    }
  }
}
