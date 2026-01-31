import * as THREE from "three";
import { Capsule } from "three/examples/jsm/math/Capsule.js";
import Experience from "../Experience.js";

export default class Fox {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.world = this.experience.world;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;
    this.joyStick = this.experience.joyStick;

    this.radius = 0.6;
    this.height = 1.2;
    this.gravity = -30; // Увеличим для более плотного прилегания

    // Вводим вектор скорости
    this.velocity = new THREE.Vector3();

    this.playerCollider = new Capsule(
      new THREE.Vector3(0, this.radius, 0),
      new THREE.Vector3(0, this.height, 0),
      this.radius,
    );

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("fox");
    }

    this.resource = this.resources.items.foxModel;
    this.setModel();
    this.setAnimation();
  }

  setModel() {
    this.model = this.resource.scene;
    this.scene.add(this.model);
    this.respawnCharacter();

    // Debug mesh
    // const helperGeo = new THREE.SphereGeometry(this.radius);
    // const helperMat = new THREE.MeshBasicMaterial({
    //   color: 0xff0000,
    //   wireframe: true,
    // });
    // this.debugMesh = new THREE.Mesh(helperGeo, helperMat);
    // this.scene.add(this.debugMesh);

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
      }
      if (this.world.intersectObjectsNames.includes(child.name)) {
        child.parent.name = "fox";
        this.world.intersectObjects.push(child);
      }
    });
  }

  setAnimation() {
    this.animation = {};
    this.animation.mixer = new THREE.AnimationMixer(this.model);
    this.animation.actions = {};
    this.animation.actions.idle = this.animation.mixer.clipAction(
      this.resource.animations[0],
    );
    this.animation.actions.walking = this.animation.mixer.clipAction(
      this.resource.animations[1],
    );
    this.animation.actions.running = this.animation.mixer.clipAction(
      this.resource.animations[2],
    );
    this.animation.actions.current = this.animation.actions.idle;
    this.animation.actions.current.play();

    this.animation.play = (name) => {
      const newAction = this.animation.actions[name];
      const oldAction = this.animation.actions.current;
      newAction.reset().play().crossFadeFrom(oldAction, 1);
      this.animation.actions.current = newAction;
    };
  }

  update() {
    const deltaTime = this.time.delta * 0.001;
    if (deltaTime > 0.1) return;

    this.animation.mixer.update(deltaTime);

    const damping = Math.exp(-10 * deltaTime) - 1;
    this.velocity.addScaledVector(this.velocity, damping);

    this.velocity.y += this.gravity * deltaTime;

    if (this.joyStick.moveData.active) {
      const speed = 150;
      const moveDir = new THREE.Vector3(
        this.joyStick.moveData.x,
        0,
        -this.joyStick.moveData.y,
      ).normalize();
      this.velocity.addScaledVector(moveDir, speed * deltaTime);

      const angle = Math.atan2(
        this.joyStick.moveData.x,
        this.joyStick.moveData.y,
      );
      this.model.rotation.y = -angle + Math.PI;

      if (this.animation.actions.current !== this.animation.actions.running) {
        this.animation.play("running");
      }
    } else {
      if (this.animation.actions.current !== this.animation.actions.idle) {
        this.animation.play("idle");
      }
    }

    this.playerCollider.translate(
      this.velocity.clone().multiplyScalar(deltaTime),
    );

    this.playerCollisions();

    this.model.position.copy(this.playerCollider.start);
    this.model.position.y -= this.radius;

    if (this.model.position.y < -20) {
      this.respawnCharacter();
    }

    if (this.debugMesh) {
      this.debugMesh.position.copy(this.playerCollider.start);
    }
  }

  respawnCharacter() {
    const pos = this.world.floor.charcterSpawnPosition;
    this.velocity.set(0, 0, 0); // Обнуляем скорость при респауне
    this.model.position.set(pos.x, pos.y, pos.z - 2);
    this.model.scale.set(0.03, 0.03, 0.03);
    this.model.rotation.y = Math.PI / 2;
    this.playerCollider.start
      .copy(this.model.position)
      .add(new THREE.Vector3(0, this.radius, 0));
    this.playerCollider.end
      .copy(this.model.position)
      .add(new THREE.Vector3(0, this.height, 0));
  }

  playerCollisions() {
    if (this.world.colliderOctree) {
      const result = this.world.colliderOctree.capsuleIntersect(
        this.playerCollider,
      );

      if (result) {
        // Если мы коснулись пола (нормаль смотрит вверх), обнуляем вертикальную скорость
        if (result.normal.y > 0) {
          this.velocity.y = 0;
        }

        // Выталкиваем из стены/пола
        this.playerCollider.translate(
          result.normal.multiplyScalar(result.depth),
        );

        // Проецируем скорость на плоскость столкновения (убирает дрожание в стенах)
        this.velocity.projectOnPlane(result.normal);
      }
    }
  }
}
