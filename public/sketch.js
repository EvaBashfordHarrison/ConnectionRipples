let s = 10;
let ripples = [];
let pressTime = 0;
let pg;
let myColor; 

// const palettes = [
//   [32, 45, 60],     // yellows
//   [80, 110, 130],   // greens
//   [282, 310, 340],  // pinks
//   [177, 200, 220]   // blues
// ];

// let greens;
// let pinks;
// let yellows;

const socket = io();
let drawIsOn = false;

function setup() {
  createCanvas(windowWidth, windowHeight);

  colorMode(HSB, 360, 100, 100, 100);

  // header text 
  pg = createGraphics(windowWidth, 650);
  pg.textFont('courier new')
  pg.textSize(14);
  pg.fill(255);
  pg.noStroke();
  pg.text('This is about presence. Is anyone there? \nTouch/drag the screen to start', 50,50,width - 100);
  noCursor(); // remove normal cursor 

  myColor = random(0, 360); 

  // myColor = color(random(177,227), 100, 100); // Starter color
  // greens = color(random(80,144), random(20,70), 100); // user 2
  // yellows = color(random(32,60), random(20,70), 100); // user 3
  // pinks = color(random(282,350), random(20,70), 100); // user 4

}

function draw() {
  background(0);

  for (let r of ripples) {
    r.move();
    r.display();
  }
  if (mouseIsPressed) {
    let newRipple = new GrowingRipple(mouseX, mouseY, myColor);
    ripples.push(newRipple);
  }
  // this is the cursor 
  fill("#2FC1FE")
  circle(mouseX, mouseY, 20);

  // load header text 
  image(pg, 0, 0);
}

// when user drags the cursor across the screen 
function mouseDragged() {
  socket.emit("drawing", {
    xPos: mouseX, 
    yPos: mouseY, 
    hue: myColor,

    // rippleCols: {
    //   1: yellows,
    //   2: greens, 
    //   3: pinks, 
    //   4: myColor,
    // },
  });
}

function drawStuff(data) {
  let newRipple = new GrowingRipple(data.xPos, data.yPos, data.hue);
  ripples.push(newRipple);
}


//Events we are listening for
// Connect to Node.JS Server
socket.on("connect", () => {
  console.log(socket.id);
});

socket.on("drawing", (data) => {
  drawStuff(data);
});

// Callback function on the event we disconnect
socket.on("disconnect", () => {
  console.log(socket.id);
});



// ----------------------------- class 

// --- THE BLUEPRINT ---
class GrowingRipple {
  constructor(x, y, c) {
    this.x = x;
    this.y = y;
    this.size = 0.5; // Each ripple starts at its own size 1
    this.opacity = 255;
    this.sw = 0.5; // stroke width 
    this.offset = random(5)
    this.timer = millis();
    this.c = c // blue starter  
    this.start = random(0,360);
    this.stop = random(60,360)
  }

  move() {
    this.size += 10;
    this.opacity -= 5;
    this.sw += 0.1;
  }

  display() {
    noFill();
    strokeWeight(this.sw);
    strokeCap(SQUARE);
    
    stroke(this.c, 80,60, this.opacity)
    arc(this.x, this.y, this.size, this.size, this.start, this.stop);
  }
}