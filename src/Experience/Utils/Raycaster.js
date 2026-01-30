import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Raycaster {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.world = this.experience.world
        this.camera = this.experience.camera // берем камеру из класса Camera

        this.instance = new THREE.Raycaster()
        this.pointer = new THREE.Vector2()

        // Следим за мышкой
        window.addEventListener('mousemove', (event) => {
            this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1
            this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
        })
        window.addEventListener('click', (event) => {
            this.onClick()
        })
    }

    onClick() {
        console.log(this.world.intersectObject)
    }

    update() {
        this.instance.setFromCamera(this.pointer, this.camera.instance)
        let intersects = this.instance.intersectObjects(this.world.intersectObjects)
        if (intersects.length > 0) {
            document.body.style.cursor = "pointer"
        } else {
            document.body.style.cursor = "default"
            this.world.intersectObject=''
        }

        for (let i = 0; i < intersects.length; i++) {
            this.world.intersectObject = intersects[0].object.parent.name

        }
    }
}