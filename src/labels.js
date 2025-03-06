export function getLabels({ screenH }) {
    return [
        {
            text: "Purkinje Cell",
            x: 620,
            y: screenH - 150,
            width: 100,
        },
        {
            text: "Deep Cerebellar Nuclei",
            x: 700,
            y: screenH + 450,
            width: 100,
        },
        {
            text: "Climbing Fibers",
            x: 980,
            y: screenH + 250,
            width: 150,
        },
        {
            text: "Inferior Olive",
            x: 820,
            y: screenH + 600,
            width: 80,
        },
        {
            text: "Parallel Fibers",
            x: 110,
            y: 200,
            width: 116,
            height: 30,
            backgroundColor: [255, 255, 255, 200],
        },
        {
            text: "Granule Cells",
            x: 250,
            y: screenH - 50,
            width: 100,
        },
        {
            text: "Mossy Fibers",
            x: 250,
            y: screenH + 650,
            width: 100,
        },
    ]
};

export function drawLabel({ p5, label, fontFamily = null, fontSize = 16, fontWeight = "normal" }) {
    if (!label) {
        return;
    }
    if (label.backgroundColor) {
        // p5.strokeWeight(1);
        // p5.stroke(0);
        p5.fill(...label.backgroundColor);
        p5.rectMode(p5.CENTER);
        p5.rect(label.x, label.y, label.width, label.height || label.width);
    }
    p5.fill(0);
    p5.strokeWeight(0);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(label.fontSize || fontSize);
    fontWeight = label.fontWeight || fontWeight;
    fontWeight === "normal" ? p5.textStyle(p5.NORMAL) : p5.textStyle(p5.BOLD);
    
    // p5.textFont(fontFamily);
    p5.rectMode(p5.CENTER);
    p5.text(label.text, label.x, label.y, label.width);
}