class Branch {
    static generate({
        level,
        angle,
        x,
        y,
        maxLevel,
        maxBranches,
        numBranches,
        parent,
    }) {
        if (level >= maxLevel) return [];

        const branchCount = numBranches || 2;
        return Array.from({ length: branchCount }, () => {
            const newAngle = angle + random(-PI / 4, PI / 4);
            const length = Math.round(Math.random() * 100) + 20;
            const end = {
                x: Math.round(x + cos(newAngle) * length),
                y: Math.round(y + sin(newAngle) * length),
            };

            const branch = new Branch({ start: { x, y }, end, level, parent });
            branch.addBranches(
                Branch.generate({
                    level: level + 1,
                    angle: newAngle,
                    x: end.x,
                    y: end.y,
                    maxLevel,
                    maxBranches,
                    numBranches,
                    parent: branch,
                }),
            );

            return branch;
        });
    }

    constructor({ start, end, level, parent }) {
        Object.assign(this, { start, end, level, parent });
        this.length = dist(start.x, start.y, end.x, end.y);
        this.angle = atan2(end.y - start.y, end.x - start.x);
        this.branches = [];

        // if we want to curve the lines:
        const randomRangeY = 15;
        const randomRangeX = 30;
        this.controlX =
            (this.start.x + this.end.x) / 2 + random(0, randomRangeX); // Slight randomness for organic shape
        this.controlY =
            (this.start.y + this.end.y) / 2 - random(0, randomRangeY);
    }

    addBranches(branches) {
        this.branches = branches || [];
    }
    render() {
        this.drawStraightLine();
        // this.drawCurvedLine();
    }

    drawStraightLine() {
        strokeWeight(3);
        line(this.start.x, this.start.y, this.end.x, this.end.y);
    }

    drawCurvedLine() {
        strokeWeight(3);
        beginShape();
        noFill();
        strokeJoin(ROUND); // Rounds the joins
        vertex(this.start.x, this.start.y);
        quadraticVertex(this.controlX, this.controlY, this.end.x, this.end.y);
        endShape();
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
