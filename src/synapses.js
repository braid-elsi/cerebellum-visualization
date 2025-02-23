class Endpoint {
    constructor({ branch, width, height, color = [0, 0, 0], doRotation = false }) {
        this.branch = branch;
        this.x = Math.round(branch.end.x);
        this.y = Math.round(branch.end.y);
        this.angle = branch.angle;
        this.width = width;
        this.height = height || width / 3;
        this.color = color;
        this.doRotation = doRotation;
    }

    render(p5, color) {
        p5.rectMode(p5.CENTER);
        const radius = this.width * 0.4;
        if (color) {
            this.color = color;
        }
        p5.strokeWeight(0);
        p5.fill(...this.color);
        if (this.doRotation) {
            const tangentAngle = this.angle + Math.PI/2;
            p5.angleMode(p5.RADIANS);
            p5.push();
            p5.translate(this.x, this.y);
            p5.rotate(tangentAngle);
            p5.rect(
                0,
                0,
                this.width,
                this.height,
                radius,
                radius,
                radius,
                radius,
            );
            p5.pop();
        } else {
            p5.stroke(0);
            p5.rectMode(p5.CENTER);
            p5.rect(
                this.x,
                this.y,
                this.width,
                this.height,
                radius,
                radius,
                radius,
                radius,
            );
        }
    }
}

export class Receptor extends Endpoint {
    constructor({ branch, width, height, color = [0, 0, 0] , terminal = null, doRotation = false}) {
        super({ branch, width, height, color, doRotation });
        this.type = "receptor";
        this.setTerminal(terminal);
    }
    setTerminal(terminal) {
        if (!terminal) {
            return;
        }
        this.terminal = terminal;
        this.terminal.receptor = this;
    }
}

export class Terminal extends Endpoint {
    constructor({ branch, width, height, color = [0, 0, 0], receptor = null, doRotation = false }) {
        super({ branch, width, height, color, doRotation });
        this.receptor = receptor;
        this.type = "terminal";
        this.setReceptor(receptor);
    }
    setReceptor(receptor) {
        if (!receptor) {
            return;
        }
        this.receptor = receptor;
        this.receptor.terminal = this;
    }
}
