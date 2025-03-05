export default class Spike {
    constructor(
        {
            width = 20,
            branch,
            progress,
            speed = 2,
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
        // Use arcLength if available (curved path), otherwise use straight length
        const pathLength = this.branch.curvy ? this.branch.arcLength : this.branch.length;
        const t = this.progress / pathLength;

        if (this.branch.curvy) {
            // Quadratic Bézier curve interpolation
            const x = Math.pow(1 - t, 2) * this.startVec.x + 
                     2 * (1 - t) * t * this.branch.controlX + 
                     Math.pow(t, 2) * this.endVec.x;
            const y = Math.pow(1 - t, 2) * this.startVec.y + 
                     2 * (1 - t) * t * this.branch.controlY + 
                     Math.pow(t, 2) * this.endVec.y;
            this.pos.set(x, y);
        } else {
            // Linear interpolation for straight lines
            const vectorLerpFunction = p5.constructor.Vector.lerp;
            this.pos = vectorLerpFunction(this.startVec, this.endVec, t);
        }
    }

    render(p5) {
        p5.fill(...this.color);
        p5.ellipse(this.pos.x, this.pos.y, this.width, this.width);
    }
}
