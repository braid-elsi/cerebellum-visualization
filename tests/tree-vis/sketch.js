let root;

function setup() {
    createCanvas(600, 600);
    background(255);
    stroke(120, 60, 120, 180); // Soft purple color with alpha

    // Start the tree at the bottom center
    root = new Branch(width / 2, height, -PI / 2, 100, 10);
    root.generateBranches(); // Generate all branches
}

function draw() {
    background(255);
    root.show();
}

// Branch class
class Branch {
    constructor(x, y, angle, length, thickness) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.length = length;
        this.thickness = thickness;
        this.branches = [];

        if (thickness > 2) {
            this.generateBranches();
        }
    }

    generateBranches() {
        let numBranches = floor(random(2, 4)); // Each branch splits into 2-3

        for (let i = 0; i < numBranches; i++) {
            let newAngle = this.angle + random(-PI / 5, PI / 5); // Small variation
            let newLength = this.length * random(0.6, 0.8); // Reduce length
            let newX = this.x + cos(this.angle) * this.length;
            let newY = this.y + sin(this.angle) * this.length;

            this.branches.push(
                new Branch(
                    newX,
                    newY,
                    newAngle,
                    newLength,
                    this.thickness * 0.7,
                ),
            );
        }
    }

    show() {
        strokeWeight(this.thickness);
        line(
            this.x,
            this.y,
            this.x + cos(this.angle) * this.length,
            this.y + sin(this.angle) * this.length,
        );

        for (let branch of this.branches) {
            branch.show();
        }
    }
}
