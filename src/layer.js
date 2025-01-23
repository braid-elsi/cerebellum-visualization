export default class Layer {
    constructor(y, width, height, label, color = [200, 200, 200]) {
        this.x = 0;
        this.height = height;
        this.y = Math.round(y - height);
        this.width = Math.round(width);
        this.label = label;
        this.color = color;
        // console.log(this.y, this.width, this.height, this.label);
        this.bounds = {
            x1: this.x + 100,
            x2: this.width - 100,
            y1: this.y,
            y2: y,
        };
    }

    getBounds() {
        return this.bounds;
    }

    render(p5) {
        // draw the rectangle:
        p5.rectMode(p5.CORNER);
        p5.strokeWeight(0);
        p5.fill(...this.color);
        p5.rect(this.x, this.y, this.width, this.height);

        // draw the line:
        p5.strokeWeight(1);
        p5.stroke(240);
        p5.line(this.x, this.y, this.x + this.width, this.y);

        // draw the label:
        p5.fill(0);
        p5.strokeWeight(0);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.textSize(14);
        p5.textStyle(p5.NORMAL);
        p5.textFont("Montserrat");
        p5.push();
        p5.translate(this.x, this.y + this.height);
        p5.rotate(-p5.PI / 2);
        let padding = 15;
        p5.text(this.label, 10, 30, this.height - 10 * 2);
        p5.pop();
    }
}
