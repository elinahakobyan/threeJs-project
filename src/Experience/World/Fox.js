import * as THREE from "three";
import {Capsule} from "three/examples/jsm/math/Capsule.js";
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
        this.collisionBuffer = 1.5
        this.tempVector = new THREE.Vector3();


        // Вводим вектор скорости
        this.velocity = new THREE.Vector3();

        // this.playerCollider = new Capsule(
        //   new THREE.Vector3(0, this.radius, 0),
        //   new THREE.Vector3(0, this.height, 0),
        //   this.radius,
        // );

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

    respawnCharacter() {
        const pos = this.world.floor.charcterSpawnPosition;
        this.model.position.set(pos.x, pos.y + 0.2, pos.z - 2);
        this.model.scale.set(0.03, 0.03, 0.03);
        this.model.rotation.y = Math.PI / 2;
        //   this.playerCollider.start
        //       .copy(this.model.position)
        //       .add(new THREE.Vector3(0, this.radius, 0));
        //   this.playerCollider.end
        //       .copy(this.model.position)
        //       .add(new THREE.Vector3(0, this.height, 0));
    }

    update() {
        const deltaTime = this.time.delta * 0.001;
        if (deltaTime > 0.1) return;

        if (this.joyStick.moveData.active && this.world.raycaster.instance) {
            const speed = 17;
            const moveDir = new THREE.Vector3(
                this.joyStick.moveData.y,
                0,
                this.joyStick.moveData.x
            ).normalize();

            const rayOrigin = this.tempVector.copy(this.model.position).add(new THREE.Vector3(0, 0.5, 0));
            this.world.raycaster.instance.set(rayOrigin, moveDir);
            const intersections = this.world.raycaster.instance.intersectObjects(this.world.obstacles, false);
            if (intersections.length > 0 && intersections[0].distance < this.collisionBuffer) {
                // Collision detected!
            } else {
                this.model.position.addScaledVector(moveDir, speed * deltaTime);
                const angle = Math.atan2(this.joyStick.moveData.y, -this.joyStick.moveData.x);
                this.model.rotation.y =  -angle + Math.PI;
            }

            if (this.animation.actions.current !== this.animation.actions.running) {
                this.animation.play("running");
            }
        } else {
            if (this.animation.actions.current !== this.animation.actions.idle) {
                this.animation.play("idle");
            }
        }

        this.animation.mixer.update(deltaTime);
    }

}
