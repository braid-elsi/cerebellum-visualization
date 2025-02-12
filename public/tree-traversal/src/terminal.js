class Terminal {
    constructor({ x, y, w, angle, color = [0, 0, 0] }) {
        this.x = Math.round(x);
        this.y = Math.round(y);
        this.w = w;
        this.angle = angle;
        this.color = color;
    }

    render(color) {
        if (color) {
            this.color = color;
        }
        strokeWeight(0);
        fill(...this.color);
        angleMode(RADIANS);
        push();
        translate(this.x, this.y);
        rotate(this.angle);
        ellipse(0, 0, this.w * 0.3, this.w * 0.9);
        pop();
    }
}
