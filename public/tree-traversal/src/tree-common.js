class Terminal {
    constructor({ x, y, w, angle, color = [0, 0, 0] }) {
        this.x = Math.round(x);
        this.y = Math.round(y);
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
    constructor({ start, end, level, branches }) {
        // console.log(start, end, level, branches);
        this.length = dist(start.x, start.y, end.x, end.y);
        this.angle = atan2(end.y - start.y, end.x - start.x);
        this.start = start;
        this.end = end;
        this.level = level;
        this.branches = branches;
        if (!branches) {
            console.log("no child branches...adding terminal.");
            this.terminal = new Terminal({
                x: Math.round(end.x),
                y: Math.round(end.y),
                w: 20,
                angle: atan2(end.y - start.y, end.x - start.x),
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

class Tree {
    // there are two paths to creating a tree: from a file or
    // randomly. I don't think this constructor captures this
    constructor({ branches, levels, maxBranches, startX, startY }) {
        this.levels = levels;
        this.maxBranches = maxBranches;
        if (branches) {
            this.branches = branches;
        } else {
            this.branches = this.generateBranches(0, -PI / 2, startX, startY);
        }
    }

    generateBranches(level, angle, x, y) {
        if (level >= this.levels) return null;

        let numBranches = Math.floor(Math.random() * this.maxBranches) + 1;
        let branches = [];

        for (let i = 0; i < numBranches; i++) {
            let newAngle = angle + random(-PI / 4, PI / 4);
            let length = Math.round(Math.random() * 100) + 20;
            const start = { x: x, y: y };
            const end = {
                x: Math.round(x + cos(newAngle) * length),
                y: Math.round(y + sin(newAngle) * length),
            };
            let childBranches = this.generateBranches(
                level + 1,
                newAngle,
                end.x,
                end.y,
            );
            const branch = new Branch({
                start: start,
                end: end,
                level: level,
                branches: childBranches,
            });
            branches.push(branch);
            // console.log(branch);
        }
        return branches;
    }

    flatten(treeJSON) {
        let flatBranches = [];

        function traverse(branch) {
            flatBranches.push({
                start: branch.start,
                end: branch.end,
                level: branch.level,
            });

            if (branch.branches) {
                for (let child of branch.branches) {
                    traverse(child);
                }
            }
        }

        for (let rootBranch of treeJSON.branches) {
            traverse(rootBranch);
        }
        return flatBranches;
    }

    toJSON() {
        const treeJSON = {
            levels: this.levels,
            maxBranches: this.maxBranches,
            branches: this.branches.map((b) => b.toJSON()),
        };
        return this.flatten(treeJSON);
    }
}
