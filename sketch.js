var saveButton;
var albumTitelInput;
var uploadAnimationIsVisible = false;
var x = 1;
var dir = 1;
var canvas;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0,0);




  saveButton = document.getElementById("saveButton").addEventListener("click", saveButtonClicked);

  albumTitelInput = document.getElementById("albumTitelInput");
}

function draw() {
  if (uploadAnimationIsVisible) {
    fill("black");
    ellipse(windowWidth/2,windowHeight/2,200,200);
    fill(color(255,255,255,255-x));
    ellipse(windowWidth/2,windowHeight/2,200/255*x,200/255*x);
    x = x*1.065
    if (x > 255) x = 1;
  }
}

function showUploadAnimation() {
  console.log("show");
  fill(color(0,0,0,150));
  rect(0,0,windowWidth,windowHeight);
  uploadAnimationIsVisible = true;
}

function hideUploadAnimation() {
  clear();
  console.log("Hide");
  uploadAnimationIsVisible = false;
}

function saveButtonClicked() {
  uploadAnimationIsVisible? hideUploadAnimation() : showUploadAnimation();
  console.log(albumTitelInput.value);

}
