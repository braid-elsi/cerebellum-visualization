let targetScrollX = 0;
let targetScrollY = 0;
let scrollPosX = 0;
let scrollPosY = 0;
let zoom = 1, targetZoom = 1;
let dragging = false;
let lastX, lastY;

let circles = [];
let layer1;
let layer2;
let bgCircles, midCircles, fgCircles;

function setup() {
  createCanvas(600, 600);
  
  // Generate random circles for each layer
  bgCircles = generateCircles(5);  // Background (slowest movement)
  midCircles = generateCircles(7); // Midground (medium speed)
  fgCircles = generateCircles(10); // Foreground (fastest movement)
//   circles = circles.concat(...bgCircles, ...midCircles, fgCircles);
//   console.log(circles);

  layer1 = generateLines(bgCircles, midCircles);
  layer2 = generateLines(midCircles, fgCircles);
}

function draw() {
  background(220);

  // Smooth scrolling
  scrollPosX = lerp(scrollPosX, targetScrollX, 0.1);
  scrollPosY = lerp(scrollPosY, targetScrollY, 0.1);
  zoom = lerp(zoom, targetZoom, 0.1);

  translate(width / 2, height / 2);
  scale(zoom);
  translate(-width / 2, -height / 2);

  // Compute offsets for parallax effect
  let bgOffsetX = scrollPosX * 0.3, bgOffsetY = scrollPosY * 0.3;
  let midOffsetX = scrollPosX * 0.6, midOffsetY = scrollPosY * 0.6;
  let fgOffsetX = scrollPosX * 1.2, fgOffsetY = scrollPosY * 1.2;

  // Draw connections between circles
//   drawConnections(bgCircles, midCircles, bgOffsetX, bgOffsetY, midOffsetX, midOffsetY, 100);
//   drawConnections(midCircles, fgCircles, midOffsetX, midOffsetY, fgOffsetX, fgOffsetY, 150);

  // Draw circles with parallax effect
  drawCircles(bgCircles, bgOffsetX, bgOffsetY, color(0, 100, 255, 100));
  drawCircles(midCircles, midOffsetX, midOffsetY, color(100, 150, 255, 150));
  drawCircles(fgCircles, fgOffsetX, fgOffsetY, color(200, 100, 50, 200));

  // Draw connections:
  drawConnections(layer1, bgOffsetX, bgOffsetY, midOffsetX, midOffsetY, 100);
  drawConnections(layer2, midOffsetX, midOffsetY, fgOffsetX, fgOffsetY, 150);

}


function getRandomItems(arr, n) {
  if (n > arr.length) {
    throw new Error("n cannot be larger than the array length");
  }

  let shuffled = arr.slice(); // Copy the array to avoid modifying the original
  for (let i = shuffled.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
  }

  return shuffled.slice(0, n); // Take the first n elements
}

// Handle mouse drag
function mousePressed() {
  lastX = mouseX;
  lastY = mouseY;
  dragging = true;
}

function mouseDragged() {
  if (dragging) {
    let dx = mouseX - lastX;
    let dy = mouseY - lastY;
    
    targetScrollX += dx * 0.8; // More sensitivity for horizontal movement
    targetScrollY += dy * 0.8; // Vertical movement
    lastX = mouseX;
    lastY = mouseY;
  }
}

function mouseReleased() {
  dragging = false;
}

// Mouse wheel for zooming
function mouseWheel(event) {
  let zoomFactor = 1.1; // Zoom sensitivity
  if (event.delta > 0) {
    targetZoom /= zoomFactor; // Zoom out
  } else {
    targetZoom *= zoomFactor; // Zoom in
  }
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

function generateLines(layer1, layer2) {
    let lines = [];
    for (let c1 of layer1) {
        const filteredItems = getRandomItems(layer2, getRandomInt(1, layer2.length))
        for (let c2 of filteredItems) {
            lines.push({
                start: {x: c1.x, y: c1.y},
                end: {x: c2.x, y: c2.y}
            })
        }
    }
    return lines;
}

// Draw circles with offset for parallax
function drawCircles(circles, offsetX, offsetY, col) {
  fill(col);
  noStroke();
  for (let c of circles) {
    ellipse(c.x + offsetX, c.y + offsetY, c.size);
  }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

// Draw lines connecting circles between two layers
function drawConnections(layer, offsetX1, offsetY1, offsetX2, offsetY2, opacity) {
  stroke(50, 50, 50, opacity);
  strokeWeight(1.5);
  for (let lineCoords of layer) {
    const {start, end} = lineCoords;
    line(start.x + offsetX1, start.y + offsetY1, end.x + offsetX2, end.y + offsetY2);
  }
}
