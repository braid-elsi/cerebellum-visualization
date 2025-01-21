export default class PurkinjeCell {
    constructor({ x, y, id, color = [254, 82, 0] }) {
        // this.x = x;
        // this.y = y;
        this.x = 
        this.id = id;
        this.color = color;
        this.angleDiff = Math.PI / 4;
    }

    render(p5) {
        const opts = {
            x: this.x,
            y: this.y,
            len: 100,
            angle: -Math.PI / 2,
            iteration: 0,
            p5: p5,
        };
        let length = 20;
        p5.noFill();
        p5.stroke(...this.color);
        this.drawBranch(opts);
        p5.fill(...this.color);
        p5.ellipse(this.x, this.y, length / 4, length / 2);
    }

    drawBranch({ x, y, len, angle, iteration, p5 }) {
        // Randomize the angle to create curvy branches
        let angleVariation = p5.random(-Math.PI / 12, Math.PI / 12); // Smaller angle variation for curvy effect
        let curvyAngle = angle + Math.sin(iteration * 0.2) * angleVariation; // Sine function adds a smooth curve

        // Randomize the branch length slightly for variety
        let lenVariation = p5.random(0.7, 0.9); // Length multiplier between 70% and 90%
        let newLen = len * lenVariation;

        // Base case: Stop drawing when the branch is too short
        if (iteration > 5) {
            p5.strokeWeight(3);
            p5.noFill();
            p5.ellipse(x, y, 10, 10);
            return;
        }

        // Calculate the endpoint of the current branch
        let xEnd = x + newLen * Math.cos(curvyAngle);
        let yEnd = y + newLen * Math.sin(curvyAngle);
        // p5.strokeWeight(Math.max(4 - (iteration + 1) * 0.6, 1));
        p5.strokeWeight(3);
        p5.line(x, y, xEnd, yEnd);
        // p5.circle(x, y, 10);

        let mulTest1 = p5.random(-1, 1);
        let mulTest2 = p5.random(-1, 1);

        // Recursively draw the two branches with smaller lengths and different curvy angles
        const optsLeft = {
            x: xEnd,
            y: yEnd,
            len: newLen,
            angle: curvyAngle + this.angleDiff * mulTest1,
            iteration: iteration + 1,
            p5: p5,
        };
        const optsRight = {
            x: xEnd,
            y: yEnd,
            len: newLen,
            angle: curvyAngle + this.angleDiff * mulTest2,
            iteration: iteration + 1,
            p5: p5,
        };
        this.drawBranch(optsLeft);
        this.drawBranch(optsRight);
    }
}
