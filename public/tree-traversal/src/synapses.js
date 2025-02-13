class Endpoint {
    constructor({ x, y, w, angle, color = [0, 0, 0] }) {
        this.x = Math.round(x);
        this.y = Math.round(y);
        this.w = w;
        this.angle = angle;
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
            ellipse(0, 0, this.w * 0.3, this.w * 0.9);
            pop();
        } else {
            ellipse(this.x, this.y, this.w * 0.9, this.w * 0.3);
        }
    }
}

class Receptor extends Endpoint {
    constructor({ x, y, w, angle, color = [0, 0, 0] }, terminal = null) {
        super({ x, y, w, angle, color });
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
    constructor({ x, y, w, angle, color = [0, 0, 0], receptor = null }) {
        super({ x, y, w, angle, color });
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
