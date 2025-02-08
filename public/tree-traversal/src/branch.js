class Branch {
    constructor({ start, end, level, parent }) {
        this.length = dist(start.x, start.y, end.x, end.y);
        this.angle = atan2(end.y - start.y, end.x - start.x);
        this.start = start;
        this.end = end;
        this.level = level;
        this.parent = parent;
    }

    addBranches(branches) {
        this.branches = branches;
        if (!branches) {
            console.log("no child branches...adding terminal.");
            this.terminal = new Terminal({
                x: Math.round(this.end.x),
                y: Math.round(this.end.y),
                w: 20,
                angle: atan2(
                    this.end.y - this.start.y,
                    this.end.x - this.start.x,
                ),
            });
        }
    }

    render() {
        strokeWeight(3);
        // console.log(this.start.x, this.start.y, this.end.x, this.end.y);
        line(this.start.x, this.start.y, this.end.x, this.end.y);
    }

    toJSON() {
        return {
            start: this.start,
            end: this.end,
            level: this.level,
            branches: this.branches
                ? this.branches.map((b) => b.toJSON())
                : null,
        };
    }
}
