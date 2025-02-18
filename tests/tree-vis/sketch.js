// Initialize variables
let numTines = 7;  // Number of tines in the fork-tree
let tineLength = 50;  // Length of each tine
let trunkLength = 300;  // Length of the trunk
let tineSpread = 600;  // Total horizontal spread of tines
let topLineLength = 80;  // Length of the perpendicular lines at the top
let miniTineLength = 100;  // Length of the small tines
let miniTineSpread = 80;  // Spread of the small tines

function setup() {
  createCanvas(1000, 800);
  background(255);
  
  // Center the tree at the bottom of the canvas
  translate(width/2, height - 100);
  
  // Draw the tree
  drawTree();
  
  noLoop();
}

function drawTree() {
  // Draw trunk
  stroke(101, 67, 33);  // Dark brown
  strokeWeight(3);
  line(0, 0, 0, -trunkLength);
  
  // Draw tines
  translate(0, -trunkLength);  // Move to top of trunk
  strokeWeight(3);
  
  // Calculate spacing between tines
  let spacing = tineSpread / (numTines - 1);
  let startX = -tineSpread / 2;
  
  // Draw each tine and its perpendicular top line
  for (let i = 0; i < numTines; i++) {
    let x = startX + (spacing * i);
    line(0, 0, x, -tineLength);
    // Draw perpendicular line at the top
    line(x, -tineLength, x, -tineLength - topLineLength);
    
    // Draw mini fork at the top
    let miniStartX = x - miniTineSpread / 2;
    let miniSpacing = miniTineSpread / 2;
    for (let j = 0; j < 3; j++) {
      let miniX = miniStartX + (miniSpacing * j);
      line(x, -tineLength - topLineLength, miniX, -tineLength - topLineLength - miniTineLength);
      
      // Add top-most mini forks
      let topMiniSpread = miniTineSpread / 2; // Make the top spread smaller
      let topMiniStartX = miniX - topMiniSpread / 2;
      let topMiniSpacing = topMiniSpread / 2;
      for (let k = 0; k < 3; k++) {
        let topX = topMiniStartX + (topMiniSpacing * k);
        line(miniX, -tineLength - topLineLength - miniTineLength, 
             topX, -tineLength - topLineLength - miniTineLength - (miniTineLength/2));
      }
    }
  }
}