import {
    getRandomFloat,
    getRandomInt,
    weightedRandomInt,
    getRandomSign,
} from "./utils";
export class Branch {
    constructor({ start, end, level, parent, branches = [], curvy = false, symmetricCurves = false }) {
        Object.assign(this, { start, end, level, parent });
        this.branches = branches;
        this.curvy = curvy;
        this.symmetricCurves = symmetricCurves;
        this.updateGeometry();

        // if we want to curve the lines:
        const randomRangeY = 15;
        const randomRangeX = 30;
        this.controlX =
            (this.start.x + this.end.x) / 2 + getRandomFloat(0, randomRangeX); // Slight randomness for organic shape
        this.controlY =
            (this.start.y + this.end.y) / 2 - getRandomFloat(0, randomRangeY);
    }

    updateGeometry() {
        if (!this.start || !this.end) return;
        
        // Straight-line length
        this.length = Math.hypot(
            this.end.x - this.start.x,
            this.end.y - this.start.y
        );
        
        // Approximate arc length for curved paths using several segments
        if (this.curvy) {
            const segments = 10;
            let arcLength = 0;
            let prevX = this.start.x;
            let prevY = this.start.y;
            
            for (let i = 1; i <= segments; i++) {
                const t = i / segments;
                const x = Math.pow(1 - t, 2) * this.start.x + 
                         2 * (1 - t) * t * this.controlX + 
                         Math.pow(t, 2) * this.end.x;
                const y = Math.pow(1 - t, 2) * this.start.y + 
                         2 * (1 - t) * t * this.controlY + 
                         Math.pow(t, 2) * this.end.y;
                
                arcLength += Math.hypot(x - prevX, y - prevY);
                prevX = x;
                prevY = y;
            }
            this.arcLength = arcLength;
        }
        
        this.angle = Math.atan2(
            this.end.y - this.start.y,
            this.end.x - this.start.x
        );
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
        if (parent) {
            this.parent = parent;
        }
        if (branches) {
            this.branches = branches;
        }
        // make sure this happens after branches are set
        if (level) {
            this.level = level;
            this.updateLevelsRecursively(level)
        }

        // regenerate length and angle:
        this.updateGeometry();
    }

    addBranches(branches) {
        this.branches.push(...branches);
    }

    drawStraightLine(p5) {
        p5.strokeWeight(3);
        p5.line(this.start.x, this.start.y, this.end.x, this.end.y);
    }

    drawCurvedLine(p5) {
        p5.strokeWeight(3);
        p5.beginShape();
        p5.noFill();
        p5.strokeJoin(p5.ROUND);
        
        p5.vertex(this.start.x, this.start.y);
        p5.quadraticVertex(
            this.controlX,
            this.controlY,
            this.end.x,
            this.end.y
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

    simplify(minEdgeLength) {
        if (!this.branches) return;

        // First, recursively process all children
        for (let i = this.branches.length - 1; i >= 0; i--) {
            this.branches[i]?.simplify(minEdgeLength);
        }

        // Then process current branch's children
        for (let i = this.branches.length - 1; i >= 0; i--) {
            const child = this.branches[i];
            if (!child?.branches) continue;
            
            if (child.branches.length === 1) {
                const grandchild = child.branches[0];
                if (!grandchild) continue;

                if (child.length < minEdgeLength) {
                    // Replace child with grandchild
                    this.branches[i] = grandchild;
                    grandchild.parent = this;
                    grandchild.start = this.end;
                    grandchild.updateGeometry();
                }
            }
        }
    }

    traverse(callback) {
        if (!this) return;
        
        callback(this);
        
        if (this.branches) {
            this.branches.forEach(child => {
                if (child) {
                    child.traverse(callback);
                }
            });
        }
    }

    attachBranchAtPoint(point, newBranch) {
        // Store the original children and level
        const originalChildren = [...(this.branches || [])];
        const originalLevel = this.level;

        // Create the continuation branch at the original level
        const continuationBranch = new Branch({
            start: point,
            end: { ...this.end },
            level: originalLevel + 1,
            parent: this,
            branches: [], // Start with empty branches
        });

        // Update the current branch to end at the intersection
        this.update({
            end: point,
            branches: [continuationBranch, newBranch],
        });

        // Move original children to continuationBranch
        if (originalChildren.length > 0) {
            continuationBranch.branches = originalChildren;
            originalChildren.forEach(child => {
                child.parent = continuationBranch;
                child.start = continuationBranch.end;
                child.updateGeometry();
            });
        }

        // Increment levels for the continuation branch and its children
        continuationBranch.traverse(branch => branch.level++);

        return { continuationBranch, newBranch };
    }

    // The purpose of this function is to recursively bisect the 
    // children of the branch so that we can create a "wrap around"
    // effect for the mossy fibers around the Purkinje cell.
    bisectBranchRecursively() {
        const midPoint = {
            x: (this.start.x + this.end.x) / 2,
            y: (this.start.y + this.end.y) / 2
        };
        
        // Create second half as a child branch
        const secondHalf = new Branch({
            start: { ...midPoint },
            end: { ...this.end },
            level: this.level + 1,
            parent: this
        });

        // Store original children before modifying the branch
        const originalChildren = [...this.branches] || [];
        
        // Modify the current branch to be the first half
        this.update({end: midPoint, branches: [secondHalf]});  // Shorten the existing branch
        
        // Transfer original children to secondHalf
        secondHalf.update({level: this.level + 1, branches: originalChildren});
        
        // Recursively split children
        if (secondHalf.branches.length > 0) {
            secondHalf.branches.forEach(childBranch => {
                childBranch.bisectBranchRecursively();
            });
        }
    }

    clone(maxLevel = Infinity) {
        // Create a new branch with the same basic properties
        const clonedBranch = new Branch({
            start: { ...this.start },
            end: { ...this.end },
            level: this.level,
            parent: this.parent,
            branches: [],
            symmetricCurves: this.symmetricCurves
        });

        // Copy the control points for curved lines
        clonedBranch.controlX = this.controlX;
        clonedBranch.controlY = this.controlY;

        // Recursively clone all child branches
        if (clonedBranch.level < maxLevel) {
            clonedBranch.branches = this.branches.map(branch => branch.clone(maxLevel));
        }
        // Update parent references for child branches
        clonedBranch.branches.forEach(branch => {
            branch.parent = clonedBranch;
        });

        return clonedBranch;
    }

    setCurvy(curvy = true, symmetricCurves = false) {
        this.curvy = curvy;
        this.symmetricCurves = symmetricCurves;
        this.updateGeometry();
        // Recursively set curvy and symmetricCurves for all child branches
        this.branches.forEach(branch => branch.setCurvy(curvy, symmetricCurves));
    }

    updateControlPoints() {
        const randomRangeY = 15;
        const randomRangeX = 30;
        this.controlX = (this.start.x + this.end.x) / 2 + getRandomFloat(0, randomRangeX);
        this.controlY = (this.start.y + this.end.y) / 2 - getRandomFloat(0, randomRangeY);
    }

    updateStartpoint(newStart) {
        this.start = newStart;
        this.updateGeometry();
        this.updateControlPoints();
    }

    updateEndpoint(newEnd) {
        this.end = newEnd;
        this.updateGeometry();
        this.updateControlPoints();
    }

    render(p5) {
        if (this.curvy) {
            this.drawCurvedLine(p5);
        } else {
            this.drawStraightLine(p5);
        }
    }

    generateAllControlPoints() {
        // For root branch, keep it straight
        if (!this.parent) {
            this.controlX = (this.start.x + this.end.x) / 2;
            this.controlY = (this.start.y + this.end.y) / 2;
        } else {
            // Get the midpoint
            const midX = (this.start.x + this.end.x) / 2;
            const midY = (this.start.y + this.end.y) / 2;

            // Get and normalize the perpendicular vector
            const dx = this.end.x - this.start.x;
            const dy = this.end.y - this.start.y;
            let perpX = dy;
            let perpY = -dx;
            
            let direction;
            
            if (this.symmetricCurves) {
                // Symmetric curving logic
                const siblingIndex = this.parent.branches.indexOf(this);
                const totalBranches = this.parent.branches.length;
                const isEven = totalBranches % 2 === 0;
                const middleIndex = Math.floor(totalBranches / 2);
                
                if (!isEven && siblingIndex === middleIndex) {
                    // Middle branch stays straight only for odd number of branches
                    this.controlX = midX;
                    this.controlY = midY;
                    this.updateGeometry();
                    this.branches.forEach(branch => branch.generateAllControlPoints());
                    return;
                }
                direction = siblingIndex < middleIndex ? 1 : -1;
            } else {
                // Original alternating by level logic
                direction = this.level % 2 === 0 ? 1 : -1;
            }
            
            // Normalize and apply offset
            const length = Math.sqrt(perpX * perpX + perpY * perpY);
            const offset = this.length / 5;
            this.controlX = midX + (perpX / length) * offset * direction;
            this.controlY = midY + (perpY / length) * offset * direction;
        }

        this.updateGeometry();
        
        // Recursively generate control points for all child branches
        this.branches.forEach(branch => branch.generateAllControlPoints());
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
