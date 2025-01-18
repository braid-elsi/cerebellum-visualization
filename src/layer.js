export default class Layer {
    constructor(y, width, height, label, color = [200, 200, 200]) {
        this.padding = 0;
        this.x = Math.round(this.padding / 2);
        this.height = height; //- this.padding;
        this.y = Math.round(y - height);
        this.width = Math.round(width - this.padding);
        this.label = label;
        this.color = color;
        console.log(this.y, this.width, this.height, this.label);
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

    render(p) {
        // draw the rectangle:
        p.strokeWeight(1);
        p.stroke(0, 0, 0);
        p.noFill();
        p.rect(this.x, this.y, this.width, this.height);

        // draw the label:
        p.fill(0);
        p.strokeWeight(0);
        p.textAlign(p.CENTER);
        p.textSize(16);
        p.push();
        p.translate(this.x + this.padding, this.y + this.height);
        p.rotate(-p.PI / 2);
        let padding = 15;
        p.text(this.label, padding, 10, this.height - padding * 2);
        p.pop();

        // original:
        // p.text(this.label, this.x + this.padding, this.y + this.height / 2);
    }
}
