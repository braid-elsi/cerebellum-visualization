class Spike {
    constructor({ w, branch, progress, speed = 3, color = [255, 0, 0] }) {
        this.w = w;
        this.branch = branch;
        this.x = branch.start.x;
        this.y = branch.start.y;
        this.progress = progress;
        this.speed = speed;
        this.color = color;
    }

    move() {
        this.progress += this.speed;
        let progressRatio = this.progress / this.branch.length;
        const { start, end } = this.branch;
        this.x = start.x + progressRatio * (end.x - start.x);
        this.y = start.y + progressRatio * (end.y - start.y);
    }

    render() {
        fill(...this.color);
        ellipse(this.x, this.y, this.w, this.w);
    }
}
