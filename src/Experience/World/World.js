import { Octree } from "three/examples/jsm/math/Octree.js";
import Experience from "../Experience.js";
import Raycaster from "../Utils/Raycaster.js";
import Environment from "./Environment.js";
import Floor from "./Floor.js";
import Fox from "./Fox.js";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    // this.colliderOctree = new Octree();

    this.intersectObject = "";
    this.intersectObjects = [];
    this.obstacles = [];
    this.intersectObjectsNames = [
      "Project_1",
      "Project_2",
      "Project_3",
      "Picnic",
      "Squirtle",
      "Chicken",
      "Pikachu",
      "Bulbasaur",
      "Charmander",
      "Snorlax",
      "Chest",
      "fox",
      "Character",
    ];

    // Wait for resources
    this.resources.on("ready", () => {
      // Setup
      this.floor = new Floor();
      this.fox = new Fox();
      this.environment = new Environment();
      this.raycaster = new Raycaster();
    });
  }

  update() {
    if (this.fox) this.fox.update();
    if (this.raycaster) this.raycaster.update();
  }
}
