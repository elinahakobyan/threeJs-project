import * as THREE from "three";
import Experience from "../Experience.js";

export default class Floor {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.resource = this.resources.items.park;

    // this.setGeometry()
    // this.setTextures()
    // this.setMaterial()
    // this.setMesh()
    this.setForest();
  }

  setForest() {
    this.model = this.resource.scene;
    this.model.position.y = -10;
    this.model.position.z = 0.01;
    this.model.traverse((child) => {
      // if (intersectObjectsNames.includes(child.name)) {
      //   intersectObjects.push(child);
      // }
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }

      if (child.name === "Character") {
        //   character.spawnPosition.copy(child.position);
        //   character.instance = child;
        //   playerCollider.start
        //     .copy(child.position)
        //     .add(new THREE.Vector3(0, CAPSULE_RADIUS, 0));
        //   playerCollider.end
        //     .copy(child.position)
        //     .add(new THREE.Vector3(0, CAPSULE_HEIGHT, 0));
      }
      if (child.name === "Ground_Collider") {
        // colliderOctree.fromGraphNode(child);
        child.visible = false;
      }
    });
    // this.model.scale.set(0.02, 0.02, 0.02)
    this.scene.add(this.model);
  }

  setGeometry() {
    this.geometry = new THREE.CircleGeometry(5, 64);
  }

  setTextures() {
    this.textures = {};

    this.textures.color = this.resources.items.grassColorTexture;
    this.textures.color.colorSpace = THREE.SRGBColorSpace;
    this.textures.color.repeat.set(1.5, 1.5);
    this.textures.color.wrapS = THREE.RepeatWrapping;
    this.textures.color.wrapT = THREE.RepeatWrapping;

    this.textures.normal = this.resources.items.grassNormalTexture;
    this.textures.normal.repeat.set(1.5, 1.5);
    this.textures.normal.wrapS = THREE.RepeatWrapping;
    this.textures.normal.wrapT = THREE.RepeatWrapping;
  }

  setMaterial() {
    this.material = new THREE.MeshStandardMaterial({
      map: this.textures.color,
      normalMap: this.textures.normal,
    });
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotation.x = -Math.PI * 0.5;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);
  }
}
