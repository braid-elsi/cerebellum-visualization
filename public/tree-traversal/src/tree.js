class Tree {
    static generateRandomTree({ startX, startY, maxLevel, maxBranches }) {
        const tree = new Tree();
        tree.branches = tree.generateBranches({
            level: 0,
            angle: -PI / 2,
            x: startX,
            y: startY,
            maxLevel,
            maxBranches,
            parent: null,
        });
        return tree;
    }

    static generateTreeFromJSON(branchesJSON) {
        if (branchesJSON.length === 0) return new Tree([]);

        // Group branches by start position
        const branchMap = new Map();
        for (const branch of branchesJSON) {
            const key = JSON.stringify(branch.start);
            branchMap.set(key, [
                ...(branchMap.get(key) || []),
                new Branch(branch),
            ]);
        }

        // Recursive function to build tree and set parent pointers
        const buildTree = (branch, parent = null) => {
            branch.parent = parent; // Set parent reference
            const key = JSON.stringify(branch.end);
            if (branchMap.has(key)) {
                const branches = branchMap
                    .get(key)
                    .map((child) => buildTree(child, branch));
                branch.addBranches(branches);
            }
            branch.addTerminal();
            return branch;
        };

        // Identify root branches and construct the tree
        const branches = branchesJSON
            .filter(({ level }) => level === 0)
            .map((branch) => buildTree(new Branch(branch)));

        return new Tree(branches);
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
        if (level >= maxLevel) return null;

        const numBranches = level === 0 ? 1 : getRandomInt(1, maxBranches + 1);
        return Array.from({ length: numBranches }, () => {
            const newAngle = angle + random(-PI / 4, PI / 4);
            const length = Math.round(Math.random() * 100) + 20;
            const end = {
                x: Math.round(x + cos(newAngle) * length),
                y: Math.round(y + sin(newAngle) * length),
            };

            const branch = new Branch({ start: { x, y }, end, level, parent });
            branch.addBranches(
                this.generateBranches({
                    level: level + 1,
                    angle: newAngle,
                    x: end.x,
                    y: end.y,
                    maxLevel,
                    maxBranches,
                    parent: branch,
                }),
            );

            return branch;
        });
    }

    getTerminalBranches() {
        const terminals = [];
        const traverse = (branch) => {
            if (!branch.branches || branch.branches.length === 0) {
                terminals.push(branch);
            } else {
                branch.branches.forEach(traverse);
            }
        };

        this.branches.forEach(traverse);
        return terminals;
    }

    flatten(treeJSON) {
        const flatBranches = [];
        const traverse = (branch) => {
            flatBranches.push({
                start: branch.start,
                end: branch.end,
                level: branch.level,
            });

            branch.branches?.forEach(traverse);
        };

        treeJSON.branches.forEach(traverse);
        return flatBranches;
    }

    drawBranches(branch) {
        if (branch.terminal) {
            branch.terminal.render();
            return;
        }

        branch.branches?.forEach((child) => {
            child.render();
            this.drawBranches(child);
        });
    }

    render() {
        this.drawBranches(this);
    }

    toJSON() {
        return this.flatten({ branches: this.branches.map((b) => b.toJSON()) });
    }
}
