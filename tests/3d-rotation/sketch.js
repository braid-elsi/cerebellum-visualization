let targetScrollX = 0;
let targetScrollY = 0;
let scrollPosX = 0;
let scrollPosY = 0;

let bgCircles, midCircles, fgCircles;

function setup() {
  createCanvas(400, 400);
  
  // Generate random circles for each layer
  bgCircles = generateCircles(5);  // Background (slowest movement)
  midCircles = generateCircles(7); // Midground (medium speed)
  fgCircles = generateCircles(10); // Foreground (fastest movement)
}

function draw() {
  background(220);
  
  // Smooth scroll interpolation
  scrollPosX = lerp(scrollPosX, targetScrollX, 0.1);
  scrollPosY = lerp(scrollPosY, targetScrollY, 0.1);

  // Compute offsets for parallax effect
  let bgOffsetX = scrollPosX * 0.3, bgOffsetY = scrollPosY * 0.3;
  let midOffsetX = scrollPosX * 0.6, midOffsetY = scrollPosY * 0.6;
  let fgOffsetX = scrollPosX * 1.2, fgOffsetY = scrollPosY * 1.2;

  // Draw connections between circles
  drawConnections(bgCircles, midCircles, bgOffsetX, bgOffsetY, midOffsetX, midOffsetY, 100);
  drawConnections(midCircles, fgCircles, midOffsetX, midOffsetY, fgOffsetX, fgOffsetY, 150);

  // Draw circles with parallax effect
  drawCircles(bgCircles, bgOffsetX, bgOffsetY, color(0, 100, 255, 100));
  drawCircles(midCircles, midOffsetX, midOffsetY, color(100, 150, 255, 150));
  drawCircles(fgCircles, fgOffsetX, fgOffsetY, color(200, 100, 50, 200));
}

// Mouse wheel event (scrolling)
function mouseWheel(event) {
  targetScrollX += event.deltaX * 0.5; // Horizontal scrolling
  targetScrollY += event.deltaY * 0.5; // Vertical scrolling
}

// Generate random circle positions
function generateCircles(num) {
  let circles = [];
  for (let i = 0; i < num; i++) {
    circles.push({
      x: random(width),
      y: random(height),
      size: random(20, 50)
    });
  }
  return circles;
}

// Draw circles with offset for parallax
function drawCircles(circles, offsetX, offsetY, col) {
  fill(col);
  noStroke();
  for (let c of circles) {
    ellipse(c.x + offsetX, c.y + offsetY, c.size);
  }
}

// Draw lines connecting circles between two layers
function drawConnections(layer1, layer2, offsetX1, offsetY1, offsetX2, offsetY2, opacity) {
  stroke(50, 50, 50, opacity); // Fainter lines for farther connections
  strokeWeight(1.5);
  for (let c1 of layer1) {
    for (let c2 of layer2) {
      line(c1.x + offsetX1, c1.y + offsetY1, c2.x + offsetX2, c2.y + offsetY2);
    }
  }
}
