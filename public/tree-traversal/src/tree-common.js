class Terminal {
    constructor({ x, y, w, angle, color = [0, 0, 0] }) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.angle = angle;
        this.color = color;
    }

    render(color) {
        if (color) {
            this.color = color;
        }
        // this.color = color;
        strokeWeight(0);
        fill(...this.color);
        angleMode(RADIANS);
        push();
        translate(this.x, this.y);
        // console.log(terminal.angle);
        rotate(this.angle);
        ellipse(0, 0, this.w / 2, this.w * 1.4);
        pop();
    }
}

class Branch {
    constructor({ length, angle, line, level, branches }) {
        this.length = length;
        this.angle = angle;
        this.line = line;
        this.level = level;
        this.branches = branches;
        if (!branches) {
            const { start, end } = line;
            this.terminal = new Terminal({
                x: end.x,
                y: end.y,
                w: 20,
                angle: atan2(end.y - start.y, end.x - start.x),
            });
        }
    }

    render() {
        strokeWeight(3);
        const { start, end } = this.line;
        line(start.x, start.y, end.x, end.y);
    }
}

class Tree {
    constructor(levels, maxBranches, startX, startY) {
        this.levels = levels;
        this.maxBranches = maxBranches;
        this.branches = this.generateBranches(0, -PI / 2, startX, startY);
    }

    generateBranches(level, angle, x, y) {
        if (level >= this.levels) return null;

        let numBranches = Math.floor(Math.random() * this.maxBranches) + 1;
        let branches = [];

        for (let i = 0; i < numBranches; i++) {
            let newAngle = angle + random(-PI / 4, PI / 4);
            let length = Math.random() * 100 + 20;
            const line = {
                start: { x: x, y: y },
                end: {
                    x: x + cos(newAngle) * length,
                    y: y + sin(newAngle) * length,
                },
            };
            let childBranches = this.generateBranches(
                level + 1,
                newAngle,
                line.end.x,
                line.end.y,
            );
            const branch = new Branch({
                length: length,
                angle: newAngle,
                line: line,
                level: level,
                branches: childBranches,
            });
            branches.push(branch);
            console.log(branch);
        }
        return branches;
    }
}
