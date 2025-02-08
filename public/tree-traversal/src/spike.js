class Spike {
    constructor({
        w,
        branch,
        progress,
        speed = 3,
        color = [255, 0, 0],
        direction = "outbound",
    }) {
        Object.assign(this, { w, branch, progress, speed, color, direction });

        // Store branch start/end as p5.Vectors for easier calculations
        this.startVec = createVector(branch.start.x, branch.start.y);
        this.endVec = createVector(branch.end.x, branch.end.y);

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

    move() {
        const dir = this.isOutbound() ? 1 : -1;
        this.progress += dir * this.speed;
        const ratio = this.progress / this.branch.length;

        // Interpolate position using vector lerp
        this.pos = p5.Vector.lerp(this.startVec, this.endVec, ratio);
    }

    render() {
        fill(...this.color);
        ellipse(this.pos.x, this.pos.y, this.w, this.w);
    }
}
