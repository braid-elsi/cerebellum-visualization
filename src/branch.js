import {
    getRandomFloat,
    getRandomInt,
    dist1,
    weightedRandomInt,
    getRandomSign,
} from "./utils";
export class Branch {
    constructor({ start, end, level, parent, branches = [] }) {
        Object.assign(this, { start, end, level, parent });
        this.length = dist1(start.x, start.y, end.x, end.y);
        this.angle = Math.atan2(end.y - start.y, end.x - start.x);
        this.branches = branches;

        // if we want to curve the lines:
        const randomRangeY = 15;
        const randomRangeX = 30;
        this.controlX =
            (this.start.x + this.end.x) / 2 + getRandomFloat(0, randomRangeX); // Slight randomness for organic shape
        this.controlY =
            (this.start.y + this.end.y) / 2 - getRandomFloat(0, randomRangeY);
    }

    updateLevelsRecursively(newLevel) {
        this.level = newLevel; // Update current branch level
        this.branches.forEach((child) =>
            child.updateLevelsRecursively(newLevel + 1),
        ); // Recursively update children
    }

    update({ start, end, level, parent, branches }) {
        if (start) {
            this.start = start;
        }
        if (end) {
            this.end = end;
        }
        if (level) {
            this.level = level;
        }
        if (parent) {
            this.parent = parent;
        }
        if (branches) {
            this.branches = branches;
        }

        // regenerate length and angle:
        this.length = dist1(this.start.x, this.start.y, this.end.x, this.end.y);
        this.angle = Math.atan2(
            this.end.y - this.start.y,
            this.end.x - this.start.x,
        );
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

export class BranchUtils {
    static generatePurkinjeBranch({
        level,
        angle,
        x,
        y,
        maxLevel,
        numBranches,
        parent,
        yMax,
    }) {
        if (level >= maxLevel) return [];
        const branches = [];

        if ([1].includes(level)) {
            numBranches = 6;
        } else if ([3].includes(level)) {
            numBranches = 1;
        } else {
            numBranches = getRandomInt(1, 3);
        }
        if ([4, 5].includes(level)) {
            maxLevel = weightedRandomInt(level + 1, maxLevel);
        }
        for (let i = 0; i < numBranches; i++) {
            let sign = i < numBranches / 2 ? -1 : 1;
            if (numBranches === 1) {
                sign = getRandomSign();
            }
            const scaleFactor = level == 1 ? 3 : 8;
            let randomOffset = getRandomFloat(-Math.PI / 12, Math.PI / 12);
            let newAngle =
                angle + (Math.PI / scaleFactor) * sign + randomOffset;

            const length = Math.round(Math.random() * 50) + 30;
            let end = {
                x: Math.round(x + Math.cos(newAngle) * length),
                y: Math.round(y + Math.sin(newAngle) * length),
            };
            if (end.y > yMax) {
                continue;
            }

            if (level === 0) {
                end = { x, y: y - 125 };
            }
            const branch = new Branch({ start: { x, y }, end, level, parent });
            branch.addBranches(
                BranchUtils.generatePurkinjeBranch({
                    level: level + 1,
                    angle: newAngle,
                    x: end.x,
                    y: end.y,
                    maxLevel,
                    numBranches,
                    parent: branch,
                    yMax,
                }),
            );

            branches.push(branch);
        }
        return branches;
    }

    static generateBranch({
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
            let newAngle = angle + getRandomFloat(-Math.PI / 4, Math.PI / 4);
            const length = Math.round(Math.random() * 100) + 20;
            const end = {
                x: Math.round(x + Math.cos(newAngle) * length),
                y: Math.round(y + Math.sin(newAngle) * length),
            };

            const branch = new Branch({ start: { x, y }, end, level, parent });
            branch.addBranches(
                BranchUtils.generateBranch({
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
}
