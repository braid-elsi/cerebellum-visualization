class Branch {
    constructor({ start, end, level, parent }) {
        Object.assign(this, { start, end, level, parent });
        this.length = dist(start.x, start.y, end.x, end.y);
        this.angle = atan2(end.y - start.y, end.x - start.x);
        this.branches = [];
    }

    addBranches(branches) {
        this.branches = branches || [];
        if (!this.branches.length) this.addTerminal();
    }

    addTerminal() {
        if (this.branches.length) return;

        this.terminal = new Terminal({
            x: Math.round(this.end.x),
            y: Math.round(this.end.y),
            w: 20,
            angle: this.angle,
        });
    }

    render() {
        strokeWeight(3);
        line(this.start.x, this.start.y, this.end.x, this.end.y);
    }

    toJSON() {
        return {
            start: this.start,
            end: this.end,
            level: this.level,
            branches: this.branches.map((b) => b.toJSON()),
        };
    }
}
