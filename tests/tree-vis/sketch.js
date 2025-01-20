function setup() {
    createCanvas(800, 600);
    background(255);
    stroke(0);
    noFill();
    
    // Initial position and size
    let startX = width / 2;
    let startY = height;
    let length = 100;
    let angle = -PI / 2;  // Start angle pointing upwards
    
    // Draw the tree
    drawBranch(startX, startY, length, angle, 0);
  }
  
  function drawBranch(x, y, len, angle, iteration) {
    // Randomize the angle to create curvy branches
    let angleVariation = random(-PI / 12, PI / 12);  // Smaller angle variation for curvy effect
    let curvyAngle = angle + sin(iteration * 0.2) * angleVariation;  // Sine function adds a smooth curve
    
    // Randomize the branch length slightly for variety
    let lenVariation = random(0.7, 0.9);  // Length multiplier between 70% and 90%
    let newLen = len * lenVariation;
  
    // Base case: Stop drawing when the branch is too short
    if (len < 15) {
        ellipse(x, y, 10, 10);
      return;
    }
  
    // Calculate the endpoint of the current branch
    let xEnd = x + newLen * cos(curvyAngle);
    let yEnd = y + newLen * sin(curvyAngle);
    line(x, y, xEnd, yEnd);
    
    // Recursively draw the two branches with smaller lengths and different curvy angles
    drawBranch(xEnd, yEnd, newLen, curvyAngle - PI / 6, iteration + 1);  // Left branch
    drawBranch(xEnd, yEnd, newLen, curvyAngle + PI / 6, iteration + 1);  // Right branch
  }
  