class Tree {
    constructor(branches = []) {
        this.branches = branches;
        this.terminalBranches = null;
    }

    getTerminalBranches() {
        if (this.terminalBranches) {
            // console.log("already calculated...");
            return this.terminalBranches;
        }
        this.terminalBranches = [];
        const traverse = (branch) => {
            if (!branch.branches || branch.branches.length === 0) {
                this.terminalBranches.push(branch);
            } else {
                branch.branches.forEach(traverse);
            }
        };

        this.branches.forEach(traverse);
        return this.terminalBranches;
    }

    flatten() {
        const flatBranches = [];
        const traverse = (branch) => {
            flatBranches.push(branch.toJSON());
            branch.branches?.forEach(traverse);
        };

        this.branches.forEach(traverse);
        return flatBranches;
    }

    render() {
        this.drawBranches(this);
    }

    drawBranches(branch) {
        branch.branches?.forEach((child) => {
            child.render();
            this.drawBranches(child);
        });
    }

    toJSON() {
        return this.flatten();
    }
}

class RandomTreeGenerator {
    static generate({
        startX,
        startY,
        maxLevel,
        maxBranches,
        angle = -PI / 2,
    }) {
        const tree = new Tree();
        tree.branches = Branch.generate({
            level: 0,
            angle,
            x: startX,
            y: startY,
            maxLevel,
            maxBranches,
            parent: null,
        });
        return tree;
    }
}

class StaticTreeGenerator {
    static generate({
        startX,
        startY,
        maxLevel,
        numBranches,
        angle = -PI / 2,
    }) {
        const tree = new Tree();
        tree.branches = Branch.generate({
            level: 0,
            angle,
            x: startX,
            y: startY,
            maxLevel,
            numBranches,
            parent: null,
        });
        return tree;
    }
}

class JSONTreeLoader {
    static fromJSON(branchesJSON) {
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
            branch.parent = parent;
            const key = JSON.stringify(branch.end);
            if (branchMap.has(key)) {
                const branches = branchMap
                    .get(key)
                    .map((child) => buildTree(child, branch));
                branch.addBranches(branches);
            }
            return branch;
        };

        // Identify root branches and construct the tree
        const branches = branchesJSON
            .filter(({ level }) => level === 0)
            .map((branch) => buildTree(new Branch(branch)));

        return new Tree(branches);
    }
}

class LeafTreeGenerator {
    static generate({ leaves, trunk, levels, branchFactor }) {
        // Create a new Tree instance
        const tree = new Tree();

        let points = [...leaves]; // Start with leaf nodes
        let newBranches = [];
        let levelSpacing =
            (trunk.y - Math.min(...leaves.map((p) => p.y))) / levels; // Vertical step size

        // Generate the tree structure level by level
        for (let level = 1; level <= levels; level++) {
            let newPoints = [];

            // Group points into clusters of size `branchFactor`
            for (let i = 0; i < points.length; i += branchFactor) {
                let group = points.slice(i, i + branchFactor);

                // Find average x-position and set y-level based on depth
                let midX =
                    group.reduce((sum, p) => sum + p.x, 0) / group.length;
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

        // Set parent-child relationships between branches
        tree.branches = this._setParentChildRelationships(newBranches);
        return tree;
    }

    // Helper method to set parent-child relationships
    static _setParentChildRelationships(branches) {
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
}
