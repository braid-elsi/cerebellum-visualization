class Tree {
    static generateRandomTree({ startX, startY, maxLevel, maxBranches }) {
        const tree = new Tree();
        tree.branches = tree.generateBranches({
            level: 0,
            angle: -PI / 2,
            x: startX,
            y: startY,
            maxLevel: maxLevel,
            maxBranches,
            parent: null,
        });
        return tree;
    }

    static generateTreeFromJSON(branchesJSON) {
        if (branchesJSON.length === 0) return new Tree(0, 0, []);

        // 1. Group branches by their start positions to figure out
        //    which branch branches from which source branch:
        let branchMap = new Map();
        for (let branch of branchesJSON) {
            let key = JSON.stringify(branch.start);
            if (!branchMap.has(key)) {
                branchMap.set(key, []);
            }
            const args = {
                start: branch.start,
                end: branch.end,
                level: branch.level,
            };
            branchMap.get(key).push(new Branch(args));
        }

        // 2. Recursively build the tree
        function buildTree(branch) {
            let key = JSON.stringify(branch.end);
            if (branchMap.has(key)) {
                branch.branches = branchMap.get(key).map(buildTree);
                branch.terminal = null;
            }
            return branch;
        }

        // 2. Identify root branches (level 0) and construct the tree
        const rootBranches = branchesJSON
            .filter((branch) => branch.level === 0)
            .map((branch) => {
                const args = {
                    start: branch.start,
                    end: branch.end,
                    level: branch.level,
                };
                return new Branch(args);
            });

        const branches = rootBranches.map(buildTree);
        const tree = new Tree(branches);
        return tree;
    }

    constructor(branches = []) {
        this.branches = branches;
    }

    generateBranches({
        level,
        angle,
        x,
        y,
        maxLevel,
        maxBranches,
        parent = null,
    }) {
        // console.log(level, angle, x, y, maxLevel, maxBranches);
        if (level >= maxLevel) return null;

        let numBranches = level === 0 ? 1 : getRandomInt(1, maxBranches + 1);
        let branches = [];

        for (let i = 0; i < numBranches; i++) {
            let newAngle = angle + random(-PI / 4, PI / 4);
            let length = Math.round(Math.random() * 100) + 20;
            const start = { x: x, y: y };
            const end = {
                x: Math.round(x + cos(newAngle) * length),
                y: Math.round(y + sin(newAngle) * length),
            };
            const branch = new Branch({
                start: start,
                end: end,
                level: level,
                parent: parent,
            });
            let childBranches = this.generateBranches({
                level: level + 1,
                angle: newAngle,
                x: end.x,
                y: end.y,
                maxLevel,
                maxBranches,
                parent: branch,
            });
            branch.addBranches(childBranches);
            branches.push(branch);
            // console.log(branch);
        }
        return branches;
    }

    getTerminals() {
        let terminals = [];

        function traverse(branch) {
            if (!branch.branches || branch.branches.length === 0) {
                terminals.push(branch);
            } else {
                for (let child of branch.branches) {
                    traverse(child);
                }
            }
        }

        for (let rootBranch of this.branches) {
            traverse(rootBranch);
        }

        return terminals;
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

    drawBranches(branch) {
        const branches = branch.branches;
        if (branch.terminal) {
            branch.terminal.render();
            return;
        }

        if (!branches) {
            return;
        }
        for (let branch of branches) {
            branch.render();
            this.drawBranches(branch);
        }
    }

    render() {
        this.drawBranches(this);
    }

    toJSON() {
        const treeJSON = {
            branches: this.branches.map((b) => b.toJSON()),
        };
        return this.flatten(treeJSON);
    }
}
