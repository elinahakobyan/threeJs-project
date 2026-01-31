import Experience from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import Fox from './Fox.js'
import JoyStick from "../JoyStick.js";
import Raycaster from "../Utils/Raycaster.js";

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources


        this.intersectObject = "";
        this.intersectObjects = [];
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
            'fox',
            'Character'
        ];

        // Wait for resources
        this.resources.on('ready', () => {
            // Setup
            this.floor = new Floor()
            this.fox = new Fox()
            this.environment = new Environment()
            this.raycaster = new Raycaster()

        })
    }

    update() {
        if (this.fox)
            this.fox.update()
        if (this.raycaster)
            this.raycaster.update()
    }
}