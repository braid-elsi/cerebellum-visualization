import { getRandomFloat, dist1 } from "./utils";
export default class Branch {
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
            const newAngle = angle + getRandomFloat(-Math.PI / 4, Math.PI / 4);
            const length = Math.round(Math.random() * 100) + 20;
            const end = {
                x: Math.round(x + Math.cos(newAngle) * length),
                y: Math.round(y + Math.sin(newAngle) * length),
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
        this.length = dist1(start.x, start.y, end.x, end.y);
        this.angle = Math.atan2(end.y - start.y, end.x - start.x);
        this.branches = [];

        // if we want to curve the lines:
        const randomRangeY = 15;
        const randomRangeX = 30;
        this.controlX =
            (this.start.x + this.end.x) / 2 + getRandomFloat(0, randomRangeX); // Slight randomness for organic shape
        this.controlY =
            (this.start.y + this.end.y) / 2 - getRandomFloat(0, randomRangeY);
    }

    addBranches(branches) {
        this.branches.push(...branches);
    }

    render(p5) {
        this.drawStraightLine(p5);
        // this.drawCurvedLine(p5);
    }

    drawStraightLine(p5) {
        p5.strokeWeight(3);
        p5.line(this.start.x, this.start.y, this.end.x, this.end.y);
    }

    drawCurvedLine(p5) {
        p5.strokeWeight(3);
        p5.beginShape();
        p5.noFill();
        p5.strokeJoin(p5.ROUND); // Rounds the joins
        p5.vertex(this.start.x, this.start.y);
        p5.quadraticVertex(
            this.controlX,
            this.controlY,
            this.end.x,
            this.end.y,
        );
        p5.endShape();
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
