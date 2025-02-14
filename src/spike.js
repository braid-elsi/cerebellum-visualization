export default class Spike {
    constructor(
        {
            width = 20,
            branch,
            progress,
            speed = 3,
            color = [255, 0, 0],
            direction = "outbound",
        },
        p5,
    ) {
        Object.assign(this, {
            width,
            branch,
            progress,
            speed,
            color,
            direction,
        });

        // Store branch start/end as p5.Vectors for easier calculations
        this.startVec = p5.createVector(branch.start.x, branch.start.y);
        this.endVec = p5.createVector(branch.end.x, branch.end.y);

        // Set initial position based on direction
        this.pos = this.isOutbound()
            ? this.startVec.copy()
            : this.endVec.copy();
    }

    isOutbound() {
        return this.direction === "outbound";
    }

    toggleDirection() {
        this.direction = this.isOutbound() ? "inbound" : "outbound";
    }

    move(p5) {
        const dir = this.isOutbound() ? 1 : -1;
        this.progress += dir * this.speed;
        const ratio = this.progress / this.branch.length;

        // Interpolate position using vector lerp
        const vectorLerpFunction = p5.constructor.Vector.lerp;
        this.pos = vectorLerpFunction(this.startVec, this.endVec, ratio);
    }

    render(p5) {
        p5.fill(...this.color);
        p5.ellipse(this.pos.x, this.pos.y, this.width, this.width);
    }
}
