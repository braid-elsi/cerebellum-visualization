import { Branch, BranchUtils } from "./branch.js";

export class Tree {
    constructor(branches = []) {
        this.branches = branches; // usually only 1 branch, but it depends
        this.terminalBranches = null;
    }

    addBranch(newBranch, targetBranch = null) {
        if (!targetBranch && this.branches.length === 0) {
            throw Error("No root branch(es) defined.");
        }
        targetBranch = targetBranch || this.branches[0];
        targetBranch.addBranches([newBranch]);
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

    // Existing methods...

    /**
     * Finds intersections between an external branch and branches in the tree.
     * @param {Object} externalBranch - The external branch { start: { x, y }, end: { x, y } }.
     * @returns {Array} - Array of { branch, intersectionPoint } objects.
     */
    findIntersectionsWithExternalBranch(externalBranch) {
        const intersections = [];
        const allBranches = this.getAllBranches(); // Collect all branches

        for (const branch of allBranches) {
            const intersectionPoint = this.lineSegmentIntersection(
                branch.start,
                branch.end,
                externalBranch.start,
                externalBranch.end,
            );
            if (intersectionPoint) {
                intersections.push({ branch, intersectionPoint });
            }
        }

        return intersections;
    }

    /**
     * Collects all branches recursively.
     * @returns {Array} - Flattened list of all branches.
     */
    getAllBranches() {
        const branches = [];

        const traverse = (branch) => {
            branches.push(branch);
            branch.branches?.forEach(traverse);
        };

        this.branches.forEach(traverse);
        return branches;
    }

    /**
     * Checks if two line segments intersect and returns the intersection point.
     * @param {Object} p1 - Start of first segment { x, y }.
     * @param {Object} p2 - End of first segment { x, y }.
     * @param {Object} p3 - Start of second segment { x, y }.
     * @param {Object} p4 - End of second segment { x, y }.
     * @returns {Object|null} - Intersection point { x, y } or null if no intersection.
     */
    lineSegmentIntersection(p1, p2, p3, p4) {
        const det = (p1, p2, p3) =>
            (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x);

        const d1 = det(p3, p4, p1);
        const d2 = det(p3, p4, p2);
        const d3 = det(p1, p2, p3);
        const d4 = det(p1, p2, p4);

        if (d1 * d2 < 0 && d3 * d4 < 0) {
            const denom =
                (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
            if (denom === 0) return null; // Parallel lines

            const x =
                ((p1.x * p2.y - p1.y * p2.x) * (p3.x - p4.x) -
                    (p1.x - p2.x) * (p3.x * p4.y - p3.y * p4.x)) /
                denom;
            const y =
                ((p1.x * p2.y - p1.y * p2.x) * (p3.y - p4.y) -
                    (p1.y - p2.y) * (p3.x * p4.y - p3.y * p4.x)) /
                denom;

            return { x, y };
        }

        return null;
    }

    render(p5) {
        this.drawBranches(this, p5);
    }

    drawBranches(branch, p5) {
        if (!branch) {
            return;
        }
        branch.branches?.forEach((child) => {
            child.render(p5);
            this.drawBranches(child, p5);
        });
    }

    toJSON() {
        return this.flatten({ branches: this.branches.map((b) => b.toJSON()) });
    }
}

export class RandomTreeGenerator {
    static generate({
        startX,
        startY,
        maxLevel,
        maxBranches,
        numBranches,
        angle = -PI / 2,
    }) {
        const tree = new Tree();
        tree.branches = BranchUtils.generateBranch({
            level: 0,
            angle,
            x: startX,
            y: startY,
            maxLevel,
            maxBranches,
            numBranches,
            parent: null,
        });
        return tree;
    }
}

export class PurkinjeTreeGenerator {
    static generate({
        level = 0,
        x,
        y,
        maxLevel,
        numBranches,
        angle = -PI / 2,
        parent,
        yMax,
    }) {
        const tree = new Tree();
        tree.branches = BranchUtils.generatePurkinjeBranch({
            level,
            angle,
            x,
            y,
            maxLevel,
            numBranches,
            parent,
            yMax,
        });
        return tree;
    }
}

export class StaticTreeGenerator {
    static generate({
        startX,
        startY,
        maxLevel,
        numBranches,
        angle = -PI / 2,
    }) {
        const tree = new Tree();
        tree.branches = BranchUtils.generateBranch({
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

export class JSONTreeLoader {
    static fromJSON(branchesJSON) {
        if (branchesJSON.length === 0) return new Tree([]);

        // Group branches by start position and level
        const branchMap = new Map();
        const branches = branchesJSON.map(
            (branchData) => new Branch(branchData),
        );

        for (const branch of branches) {
            const startKey = JSON.stringify(branch.start);
            if (!branchMap.has(startKey)) {
                branchMap.set(startKey, new Map());
            }

            const levelMap = branchMap.get(startKey);
            if (!levelMap.has(branch.level)) {
                levelMap.set(branch.level, []);
            }

            levelMap.get(branch.level).push(branch);
        }

        // Recursive function to build tree and set parent pointers
        const buildTree = (branch, parent = null) => {
            branch.parent = parent;
            const key = JSON.stringify(branch.end);
            if (branchMap.has(key)) {
                const levelMap = branchMap.get(key);
                const branches = [...levelMap.values()].flat();
                branch.addBranches(branches);
                branches.forEach((child) => buildTree(child, branch));
            }
            return branch;
        };

        // Identify root branches (level === 0) and construct the tree
        const rootBranches = branches.filter((branch) => branch.level === 0);
        const treeBranches = rootBranches.map((branch) => buildTree(branch));

        return new Tree(treeBranches);
    }
}

export class LeafTreeGenerator {
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

export class PurkinjeTreeLoader {
    static async loadTreeFromJSON(filePath, options = {}) {
        try {
            const response = await fetch(filePath);
            const jsonData = await response.json();
            return PurkinjeTreeLoader.parseTree(jsonData, options);
        } catch (error) {
            console.error("Error loading JSON file:", error);
        }
    }

    static parseTree(jsonData, {
        minEdgeLength = 1,      // Minimum distance between points
        simplifyThreshold = 0.5, // Angle threshold for removing points (in radians)
        skipFactor = 2,         // Take every nth point
        iterations = 5          // Number of times to apply simplification
    } = {}) {
        const nodesMap = PurkinjeTreeLoader.buildNodeMap(jsonData);
        
        // First pass: Create initial tree structure
        jsonData.edges.forEach((edge) => {
            const parentBranch = nodesMap.get(edge.source);
            const childBranch = nodesMap.get(edge.target);
            
            if (!parentBranch || !childBranch) return;

            childBranch.parent = parentBranch;
            parentBranch.branches.push(childBranch);
            childBranch.level = parentBranch.level + 1;
            childBranch.start = parentBranch.end;
        });

        // Simplify paths
        const simplifyBranch = (branch) => {
            if (!branch.branches.length) return;

            // Process each child branch
            for (let i = branch.branches.length - 1; i >= 0; i--) {
                const child = branch.branches[i];
                
                // If child has exactly one child, consider removing it
                if (child.branches.length === 1) {
                    const grandchild = child.branches[0];
                    const angle = Math.abs(PurkinjeTreeLoader.calculateAngle(
                        branch.start,
                        child.end,
                        grandchild.end
                    ));

                    // If angle is small enough, remove the intermediate point
                    if (angle < simplifyThreshold) {
                        // Remove child and connect grandchild directly to parent
                        branch.branches[i] = grandchild;
                        grandchild.parent = branch;
                        grandchild.start = branch.end;
                        grandchild.level = branch.level + 1;
                        
                        // Continue checking this branch again since we modified it
                        i++;
                        continue;
                    }
                }

                // Recursively simplify child branches
                simplifyBranch(branch.branches[i]);
            }
        };

        // Find root branches
        const rootBranches = Array.from(nodesMap.values())
            .filter(b => b.parent === null);

        // Apply simplification multiple times
        for (let iter = 0; iter < iterations; iter++) {
            // Gradually increase the threshold with each iteration
            const currentThreshold = simplifyThreshold * (1 + iter * 0.5);
            console.log(`Iteration ${iter + 1}, threshold: ${currentThreshold}`);
            
            rootBranches.forEach(branch => {
                simplifyBranch(branch, currentThreshold);
            });
        }

        return new Tree(rootBranches);
    }

    // Helper to calculate angle between three points
    static calculateAngle(p1, p2, p3) {
        const v1 = { x: p2.x - p1.x, y: p2.y - p1.y };
        const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };
        return Math.atan2(
            v1.x * v2.y - v1.y * v2.x,
            v1.x * v2.x + v1.y * v2.y
        );
    }

    static buildNodeMap(jsonData) {
        const nodesMap = new Map();

        // Create branch instances for each node
        const scale = 7;
        const offsetX = 996;
        const offsetY = 220;
        jsonData.nodes.forEach((node) => {
            const start = {
                x: node.x * scale + offsetX,
                y: -node.y * scale + offsetY,
            };
            const end = { ...start };
            nodesMap.set(
                node.id,
                new Branch({
                    start: start,
                    end: end, // Updated later
                    level: 0,
                    parent: null,
                    branches: [],
                }),
            );
        });
        return nodesMap;
    }
}
