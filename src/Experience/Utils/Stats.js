import * as Stats from "stats.js";

export default class StatsUi {

    constructor() {
        this.stats = new Stats();
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);
    }

    update() {
        this.stats.begin();
        this.stats.end();
    }
}