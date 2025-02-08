class Spike {
    constructor({
        w,
        branch,
        progress,
        speed = 3,
        color = [255, 0, 0],
        direction = "outbound",
    }) {
        this.w = w;
        this.branch = branch;
        this.progress = progress;
        this.speed = speed;
        this.color = color;
        this.direction = direction;
        if (this.isOutbound()) {
            this.x = branch.start.x;
            this.y = branch.start.y;
        } else {
            this.x = branch.end.x;
            this.y = branch.end.y;
        }
    }

    isOutbound() {
        return this.direction === "outbound";
    }

    isInbound() {
        return this.direction === "inbound";
    }

    toggleDirection() {
        this.direction = this.isOutbound() ? "inbound" : "outbound";
    }

    move() {
        if (this.isOutbound()) {
            this.moveOutbound();
        } else {
            this.moveInbound();
        }
    }

    moveOutbound() {
        // moves from trunk to branches:
        this.progress += this.speed;
        let progressRatio = this.progress / this.branch.length;
        const { start, end } = this.branch;
        this.x = start.x + progressRatio * (end.x - start.x);
        this.y = start.y + progressRatio * (end.y - start.y);
    }

    moveInbound() {
        // moves from branches to trunk:
        this.progress -= this.speed;
        let progressRatio = this.progress / this.branch.length;
        const { start, end } = this.branch;

        this.x = start.x - progressRatio * (start.x - end.x);
        this.y = start.y - progressRatio * (start.y - end.y);
    }

    render() {
        fill(...this.color);
        ellipse(this.x, this.y, this.w, this.w);
    }
}
