import config from "./config.js";
import PurkinjeCellAxon from "./purkinje-cell-axon.js";
import { getYPositionAbs } from "./utils.js";

export default class PurkinjeCell {
    constructor(globals) {
        const { id, x, y, yEnd, width, label, color, connectsTo } =
            config.purkinjeCell;
        this.layer = globals.layers.purkinjeLayer;
        this.molecularLayer = globals.layers.molecularLayer;
        this.id = id;
        this.x = x;
        this.y = getYPositionAbs(y, this.layer);
        this.yEnd = getYPositionAbs(yEnd, this.molecularLayer);
        this.label = label;
        this.width = width;
        this.color = color;
        this.connectsTo = connectsTo;
        this.angleDiff = Math.PI / 6;
        this.treeDepth = 4;

        // Precomputed tree and tentacle coordinates
        this.precomputedBranches = [];
        this.precomputedTentacles = [];
        this.precomputeTree();
    }

    // Precompute the tree coordinates
    precomputeTree() {
        const opts = {
            x: this.x,
            y: this.y,
            len: 80,
            angle: -Math.PI / 2,
            iteration: 0,
        };

        // Generate the tree branches
        this.generateBranch(opts);

        // Generate tentacles for each branch endpoint
        this.precomputedBranches.forEach((point, i) => {
            const tentaclePath = [];
            let { xEnd, yEnd, angle, iteration } = point;
            let x = xEnd;
            let y = yEnd;
            const length = 15;

            // Add safety checks to ensure valid coordinates
            while (y > this.yEnd) {
                // Add small variations to the angle
                angle += Math.sin(Math.PI / 4 + i);

                const newX = x + (length * Math.cos(angle)) / 3;
                const newY = y - length;
                console.log(length, angle, x, y, newX, newY);

                // Ensure calculated values are valid
                if (isNaN(newX) || isNaN(newY)) break;

                // Store the segment

                tentaclePath.push({ x, y, newX, newY });

                // Update for the next segment
                x = newX;
                y = newY;
            }

            // Store this tentacle path if it has valid segments
            // only add segments starting where the top of the tree ends
            if (tentaclePath.length > 0 && iteration > 2) {
                this.precomputedTentacles.push(tentaclePath);
            }
        });

        // Debugging output
        console.log("Tentacle paths generated:", this.precomputedTentacles);
    }

    // Generate tree branches recursively and store their coordinates
    generateBranch({ x, y, len, angle, iteration }) {
        if (iteration > this.treeDepth) {
            // Stop recursion if the maximum depth is reached
            return;
        }

        // Calculate the endpoint of the current branch
        const xEnd = x + len * Math.cos(angle);
        const yEnd = y + len * Math.sin(angle);

        // Store the start and end points of this branch
        console.log("branch:", x, y, xEnd, yEnd);
        this.precomputedBranches.push({ x, y, xEnd, yEnd, angle, iteration });

        // Recursively generate the left and right branches
        const optsLeft = {
            x: xEnd,
            y: yEnd,
            len: len * 0.8, // Slightly shorter for child branches
            angle: angle + this.angleDiff, // Rotate counterclockwise
            iteration: iteration + 1,
        };

        const optsRight = {
            x: xEnd,
            y: yEnd,
            len: len * 0.8, // Slightly shorter for child branches
            angle: angle - this.angleDiff, // Rotate clockwise
            iteration: iteration + 1,
        };

        this.generateBranch(optsLeft);
        this.generateBranch(optsRight);
    }

    render(p5) {
        p5.fill(...this.color);
        p5.stroke(...this.color);
        p5.strokeWeight(2);

        // Draw the cell body (soma)
        p5.ellipse(this.x, this.y, this.width, this.width);

        // Draw the precomputed tree branches
        p5.strokeWeight(3);
        this.precomputedBranches.forEach(({ x, y, xEnd, yEnd }) => {
            p5.line(x, y, xEnd, yEnd);
        });

        // Draw the precomputed tentacles
        this.precomputedTentacles.forEach((tentacle) => {
            tentacle.forEach(({ x, y, newX, newY }) => {
                p5.line(x, y, newX, newY);
            });
        });

        // Draw the axon
        this.axon.render(p5);
    }

    createConnections(globals) {
        const key = this.connectsTo[0];
        this.cerebellarNuclei = globals.cellLookup[key];
        this.axon = new PurkinjeCellAxon({
            source: this,
            target: this.cerebellarNuclei,
            color: this.color,
        });
    }
}
