class TreeUtils {
    static generateRandomTree({
        startX,
        startY,
        maxLevel,
        maxBranches,
        angle = -PI / 2,
    }) {
        const tree = new Tree();
        tree.branches = tree.generateBranches({
            level: 0,
            angle: angle,
            x: startX,
            y: startY,
            maxLevel,
            maxBranches,
            parent: null,
        });
        return tree;
    }

    static generateStaticTree({
        startX,
        startY,
        maxLevel,
        numBranches,
        angle = -PI / 2,
    }) {
        const tree = new Tree();
        tree.branches = tree.generateBranches({
            level: 0,
            angle: angle,
            x: startX,
            y: startY,
            maxLevel,
            numBranches,
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
}

class Tree {
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
        numBranches,
        parent = null,
    }) {
        if (level >= maxLevel) return null;

        const len = numBranches
            ? numBranches
            : getRandomInt(1, maxBranches + 1);
        return Array.from({ length: len }, () => {
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
                    numBranches,
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

    generateTreeFromLeavesAndTrunk({ leaves, trunk, levels, branchFactor }) {
        let points = [...leaves]; // Start with leaf nodes
        let newBranches = [];
        let levelSpacing =
            (trunk.y - Math.min(...leaves.map((p) => p.y))) / levels; // Vertical step size

        for (let level = 1; level <= levels; level++) {
            let newPoints = [];

            // Group points into clusters of size `branchFactor`
            for (let i = 0; i < points.length; i += branchFactor) {
                let group = points.slice(i, i + branchFactor);

                // Find average x-position and set y-level based on depth
                let midX = group.reduce((sum, p) => sum + p.x, 0) / group.length;
                let midY = Math.min(...group.map((p) => p.y)) + levelSpacing;
                let mid = createVector(midX, midY);

                // Create branches from group members to the midpoint
                for (let p of group) {
                    let branch = new Branch({
                        start: { x: p.x, y: p.y },
                        end: { x: mid.x, y: mid.y },
                        level,
                        parent: null, // Will be updated later
                    });
                    newBranches.push(branch);
                }

                newPoints.push(mid);
            }

            points = newPoints; // Update points for next level
            if (points.length === 1) break; // Stop when only one root remains
        }

        // Connect the final root node to the trunk
        let finalBranch = new Branch({
            start: { x: points[0].x, y: points[0].y },
            end: { x: trunk.x, y: trunk.y },
            level: levels,
            parent: null,
        });
        newBranches.push(finalBranch);

        // Assign parent-child relationships
        this.branches = this._setParentChildRelationships(newBranches);
    }

    _setParentChildRelationships(branches) {
        let branchMap = new Map();
        branches.forEach((branch) => {
            let key = JSON.stringify(branch.end);
            if (!branchMap.has(key)) branchMap.set(key, []);
            branchMap.get(key).push(branch);
        });

        // Set children based on endpoint connections
        branches.forEach((branch) => {
            let key = JSON.stringify(branch.start);
            if (branchMap.has(key)) {
                branch.addBranches(branchMap.get(key));
                branchMap.get(key).forEach((child) => (child.parent = branch));
            }
        });

        return branches;
    }

    render() {
        this.drawBranches(this);
    }

    toJSON() {
        return this.flatten({ branches: this.branches.map((b) => b.toJSON()) });
    }
}
