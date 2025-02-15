export default class Layer {
    constructor({
        y,
        width,
        height,
        label,
        fontFamily,
        color = [200, 200, 200],
    }) {
        this.x = 0;
        this.height = height;
        this.y = Math.round(y - height);
        this.width = Math.round(width);
        this.label = label;
        this.fontFamily = fontFamily;
        this.color = color;
        this.bounds = {
            left: this.x,
            right: this.width,
            top: this.y,
            bottom: y,
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
    }

    renderLabel(p5) {
        p5.push();
        p5.translate(this.x, this.y + this.height);
        p5.rotate(-p5.PI / 2);

        // draw the background rectangle:
        p5.rectMode(p5.CENTER);
        p5.fill(255);
        p5.stroke(230);
        p5.strokeWeight(1);
        p5.rect(
            this.height / 2,
            30,
            Math.min(this.height - 20, this.label.length * 11),
            40,
        );

        // draw the label:
        p5.strokeWeight(0);
        p5.fill(0);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.textSize(14);
        p5.textStyle(p5.NORMAL);
        p5.textFont(this.fontFamily);
        p5.rectMode(p5.CORNER);
        p5.text(this.label, 10, 30, this.height - 10 * 2);

        p5.pop();
    }
}
