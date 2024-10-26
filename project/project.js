var pic1, pic2, pic3, pic4;
var x1, y1, x2, y2, x3, y3;
var speed1 = 7;
var speed2 = 7;
var speed3 = 7; // Define speed3
var move = false;
var pic1Width, pic1Height;
var targetX1, targetY1;
var song;
var angle = 0;
var animationDone = false; // Flag to indicate first part completion
var myfont;
var words = ["OBLIVION", "IS", "THE", "ONLY", "CURE", "FOR"];
var positions = [
  { x: 150, y: 175 },
  { x: 348, y: 300 },
  { x: 1000, y: 300 },
  { x: 551, y: 425 },
  { x: 935, y: 425 },
  { x: 75, y: 550 }
];
var currentWord = 0;
var currentLetter = 0;
var timer = 0;
var delay = 6;
var showAgony = false;
var trail = [];
var trailLength = 11;
var toneSound; // Add a variable for the tone sound

function preload() {
  pic1 = loadImage("data/black.png");
  pic2 = loadImage("data/white.png");
  pic3 = loadImage("data/whiteCopy.png");
  song = loadSound("data/beat.mp3");
  myfont = loadFont("data/constantia.ttf");
  pic4 = loadImage("data/yinYang.png");
  toneSound = loadSound("data/tone.wav"); // Load the tone sound
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(174, 173, 174);
  getAudioContext().suspend();
  x1 = 575;
  y1 = 100;
  x2 = 400;
  y2 = 100;
  pic1Width = height / 1.5;
  pic1Height = height / 1.5;
  targetX1 = windowWidth - 400; // Target coordinates for pic1
  targetY1 = windowHeight - 400;
  x3 = windowWidth + 120; // Initial position for pic3 (off the right side)
  y3 = targetY1;
  textSize(110);
  textFont('Andale Mono');
  fill(0);
}

function draw() {
  if (showAgony) {
    background(255, 0, 0);
  } else {
    background(174, 173, 173);
  }

  if (!animationDone) {
    if (move && (x1 < targetX1 || y1 < targetY1 || x2 > -pic2.width)) {
      // Move pic1 to the right and down until it reaches the target
      if (x1 < targetX1) {
        x1 = min(x1 + speed1, targetX1);
      }
      if (y1 < targetY1) {
        y1 = min(y1 + speed1, targetY1);
      }
      // Shrink pic1 until it reaches a minimum size
      pic1Width = max(pic1Width - 2, 50); // Stop shrinking at width 50
      pic1Height = max(pic1Height - 2, 50); // Stop shrinking at height 50
      // Move pic2 to the left until it's off the screen
      x2 -= speed2;
    }
    if (x1 >= targetX1 && y1 >= targetY1 && x3 > targetX1 - 100) {
      x3 -= speed3;
    }
    if (pic1Width > 0 && pic1Height > 0) {
      image(pic1, x1, y1, pic1Width, pic1Height);
    }
    // Draw pic2
    if (x2 > -pic2.width) {
      image(pic2, x2, y2, height / 1.5, height / 1.5);
    }
    // Draw pic3
    image(pic3, x3, y3, pic1Width, pic1Height);
    if (x3 <= targetX1 - 100) {
      animationDone = true; // Set the flag once animation is done
    }
  } else {
    // Text animation logic starts here
    timer++;
    if (timer % delay == 0) {
      currentLetter++;
      if (currentLetter > words[currentWord].length) {
        currentLetter = 0;
        currentWord++;
        if (currentWord >= words.length) {
          currentWord = words.length - 1;
          showAgony = true;
          toneSound.play(); // Play the tone sound when agony appears
        }
      }
    }
    for (var i = 0; i <= currentWord; i++) {
      var letters = (i == currentWord) ? currentLetter : words[i].length;
      text(words[i].substring(0, letters), positions[i].x, positions[i].y);
    }
    if (showAgony) {
      // background(255, 0, 0);
      text("OBLIVION", 150, 175);
      text("IS", 348, 300);
      text("THE", 1000, 300);
      text("ONLY", 551, 425);
      text("CURE", 935, 425);
      text("FOR", 75, 550);
      push();
      textFont(myfont);
      text("AGON", 360, 675);
      text("Y.", 750, 675);
      pop();

      trail.push({ x: mouseX, y: mouseY });

      // Draw pic4 at each position in the trail
      for (let i = 0; i < trail.length; i++) {
        image(pic4, trail[i].x - pic4.width / 4, trail[i].y - pic4.height / 4, pic4.width / 2, pic4.height / 2);
      }
    }
  }
}

function mousePressed() {
  move = true
  getAudioContext().resume().then(() => {
    song.play();
    song.loop();
  });
}

function mouseReleased() {
  move = false;
  song.stop();
}
