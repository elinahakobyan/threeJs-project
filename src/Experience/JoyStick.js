import nipplejs from 'nipplejs'

export default class JoyStick {
    constructor() {
        this.container = document.getElementById('joystick-wrapper')

        this.options = {
            zone: this.container,
            mode: 'static',
            position: {left: '50%', top: '50%'}, // Центрируем внутри wrapper
            size: 100,
            color: 'white'
        }

        this.moveData = {x: 0, y: 0, angle: 0, active: false}

        this.joyStickManager = nipplejs.create(this.options)

        this.setEvents()

    }

    setEvents() {
        // console.log(this.joyStickManager)
        this.joyStickManager.on('start', (ev, data) => {
            this.moveData.active = true
            console.log(this.moveData.active)
        })

        this.joyStickManager.on('end', (ev, data) => {
            this.moveData.active = false
        })

        this.joyStickManager.on('move', (ev, data) => {
            this.moveData.x = data.vector.x
            this.moveData.y = data.vector.y
            this.moveData.angle = data.angle

        })
    }
}
