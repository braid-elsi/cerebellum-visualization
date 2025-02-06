class Spike {
    constructor({
        w,
        branch,
        progress,
        speed = 4,
        color = [255, 0, 0],
        isDendrite = true,
    }) {
        this.w = w;
        this.branch = branch;
        this.progress = progress;
        this.speed = speed;
        this.color = color;
        this.isDendrite = isDendrite;

        // initialize the x / depending on which direction the
        // current is flowing:
        const { start, end } = branch;
        if (this.isDendrite) {
            this.x = end.x;
            this.y = end.y;
        } else {
            this.x = start.x;
            this.y = start.y;
        }
    }

    move() {
        if (this.isDendrite) {
            this.moveDendrite();
        } else {
            this.moveAxon();
        }
    }

    moveAxon() {
        // moves from trunk to branches
        this.progress += this.speed;
        let progressRatio = this.progress / this.branch.length;
        const { start, end } = this.branch;
        this.x = start.x + progressRatio * (end.x - start.x);
        this.y = start.y + progressRatio * (end.y - start.y);
    }

    moveDendrite() {
        // moves from branches to trunk
        this.progress -= this.speed; // Move backward
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
