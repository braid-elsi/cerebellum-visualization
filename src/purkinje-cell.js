import config from "./config.js";
import { getYPositionAbs } from "./utils.js";

export default class PurkinjeCell {
    constructor(globals) {
        const { x, y, yEnd, width, label, color } = config.PurkinjeCell;
        this.layer = globals.layers.purkinjeLayer;
        this.molecularLayer = globals.layers.molecularLayer;
        this.x = x;
        this.y = getYPositionAbs(y, this.layer);
        this.yEnd = getYPositionAbs(yEnd, this.molecularLayer);
        this.label = label;
        this.width = width;
        this.color = color;
        this.angleDiff = Math.PI / 6;
        this.finalPoints = [];
        this.treeDepth = 4;
    }

    render(p5) {
        this.finalPoints = [];
        p5.fill(...this.color);
        p5.stroke(...this.color);
        p5.strokeWeight(2);
        p5.ellipse(this.x, this.y, this.width, this.width);

        const opts = {
            x: this.x,
            y: this.y,
            len: 80,
            angle: -Math.PI / 2,
            iteration: 0,
            p5: p5,
        };

        this.drawBranch(opts);
        this.drawTenticles(p5);
    }

    drawTenticles(p5) {
        this.finalPoints.forEach((point, i) => {
            // const point = this.finalPoints[0];
            let { x, y, angle } = point;
            let length = 15;
            // console.log("It's a go!", angle);
            while (y > this.yEnd) {
                angle = angle + Math.sin(Math.PI / 4 + i);
                let newX = x + (length * Math.cos(angle)) / 3;
                let newY = y - length;
                p5.line(x, y, newX, newY);
                x = newX;
                y = newY;
            }
        });
    }

    drawBranch({ x, y, len, angle, iteration, p5 }) {
        // Randomize the angle to create curvy branches
        let angleVariation = p5.random(-Math.PI / 12, Math.PI / 12); // Smaller angle variation for curvy effect
        let curvyAngle = angle + Math.sin(iteration * 0.2) * angleVariation; // Sine function adds a smooth curve

        // Randomize the branch length slightly for variety
        let lenVariation = p5.random(0.7, 0.9); // Length multiplier between 70% and 90%
        let newLen = len * lenVariation;

        // Calculate the endpoint of the current branch
        let xEnd = x + newLen * Math.cos(curvyAngle);
        let yEnd = y + newLen * Math.sin(curvyAngle);

        // Base case: Stop drawing when the branch is too short
        if (iteration > this.treeDepth) {
            p5.strokeWeight(3);
            p5.noFill();
            this.finalPoints.push({ x: x, y: y, angle: angle });
            return;
        }

        p5.strokeWeight(3);
        p5.line(x, y, xEnd, yEnd);
        // Recursively draw the two branches with smaller lengths and different curvy angles
        const optsLeft = {
            x: xEnd,
            y: yEnd,
            len: newLen,
            angle: curvyAngle + this.angleDiff,
            iteration: iteration + 1,
            p5: p5,
        };
        const optsRight = {
            x: xEnd,
            y: yEnd,
            len: newLen,
            angle: curvyAngle - this.angleDiff,
            iteration: iteration + 1,
            p5: p5,
        };
        this.drawBranch(optsLeft);
        this.drawBranch(optsRight);
    }
}
