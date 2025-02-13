class Endpoint {
    constructor({ branch, width, color = [0, 0, 0] }) {
        this.branch = branch;
        this.x = Math.round(branch.end.x);
        this.y = Math.round(branch.end.y);
        this.angle = branch.angle;
        this.width = width;
        this.color = color;
        this.doRotation = false;
    }

    render(color) {
        if (color) {
            this.color = color;
        }
        strokeWeight(0);
        fill(...this.color);
        if (this.doRotation) {
            angleMode(RADIANS);
            push();
            translate(this.x, this.y);
            rotate(this.angle);
            ellipse(0, 0, this.width * 0.3, this.width * 0.9);
            pop();
        } else {
            ellipse(this.x, this.y, this.width * 0.9, this.width * 0.3);
        }
    }
}

class Receptor extends Endpoint {
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

class Terminal extends Endpoint {
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
