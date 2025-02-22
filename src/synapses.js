class Endpoint {
    constructor({ branch, width, color = [0, 0, 0] }) {
        // console.log({ branch, width, color });
        this.branch = branch;
        this.x = Math.round(branch.end.x);
        this.y = Math.round(branch.end.y);
        this.angle = branch.angle;
        this.width = width;
        this.color = color;
        this.doRotation = false;
    }

    render(p5, color) {
        if (color) {
            this.color = color;
        }
        p5.strokeWeight(0);
        p5.fill(...this.color);
        if (this.doRotation) {
            p5.angleMode(RADIANS);
            p5.push();
            p5.translate(this.x, this.y);
            p5.rotate(this.angle);
            p5.ellipse(0, 0, this.width * 0.1, this.width * 0.8);
            p5.pop();
        } else {
            p5.stroke(0);
            const radius = this.width * 0.4;
            p5.rectMode(p5.CENTER);
            p5.rect(
                this.x,
                this.y,
                this.width * 0.7,
                this.width * 0.25,
                radius,
                radius,
                radius,
                radius,
            );
        }
    }
}

export class Receptor extends Endpoint {
    constructor({ branch, width, color = [0, 0, 0] }, terminal = null) {
        super({ branch, width, color });
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
    constructor({ branch, width, color = [0, 0, 0], receptor = null }) {
        super({ branch, width, color });
        this.receptor = receptor;
        this.type = "terminal";
        this.doRotation = false;
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
