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
        const { start, end } = branch;
        [this.x, this.y] = this.isOutbound()
            ? [start.x, start.y]
            : [end.x, end.y];
    }

    isOutbound() {
        return this.direction === "outbound";
    }

    toggleDirection() {
        this.direction = this.isOutbound() ? "inbound" : "outbound";
    }

    move() {
        const { start, end, length } = this.branch;
        const dir = this.isOutbound() ? 1 : -1;
        this.progress += dir * this.speed;
        const ratio = this.progress / length;
        this.x = start.x + ratio * (end.x - start.x);
        this.y = start.y + ratio * (end.y - start.y);
    }

    render() {
        fill(...this.color);
        ellipse(this.x, this.y, this.w, this.w);
    }
}
