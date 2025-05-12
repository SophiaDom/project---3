let userData;

function setup() {
  let canvas = createCanvas(windowWidth * 0.75, windowHeight * 0.85); // Adjust canvas size
  canvas.parent('p5-wrapper');
  canvas.position(windowWidth * 0.125, windowHeight * 0.075); // Adjust canvas position
  
  noStroke();
  
  // Load user data from sessionStorage
  const saved = sessionStorage.getItem('userSubmission');
  if (saved) {
    userData = JSON.parse(saved);
    console.log("Loaded userData:", userData);
  } else {
    console.log("No user data found in sessionStorage");
  }
}

function draw() {
  if (!userData) {
    console.log("Waiting for user data...");
    return;
  }

  // Clear the canvas at the beginning of every draw loop
  background(255); // Reset the background to prevent stacking text

  // Calculate the time difference correctly (in years, months, days, etc.)
  const targetTime = new Date(userData.timestamp);  // User's input date
  const now = new Date();  // Current date and time
  
  let diff = targetTime - now;  // Difference in milliseconds
  
  if (diff < 0) diff = 0;  // Ensure that the difference is not negative (future dates)
  
  // Calculate Years, Months, Days, Hours, Minutes, Seconds based on the time difference
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));  // Approximate 365 days in a year
  const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));  // Approximate 30 days per month
  const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));  // Remaining days after months
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));  // Remaining hours after days
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));  // Remaining minutes after hours
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);  // Remaining seconds after minutes
  
  // Set text properties
  fill(0); // Black text
  textSize(24);
  textAlign(CENTER, CENTER);

  // Display the time difference on the canvas
  text(`Years: ${years}`, width / 2, height / 3 - 60);
  text(`Months: ${months}`, width / 2, height / 3 - 30);
  text(`Days: ${days}`, width / 2, height / 3);
  text(`Hours: ${hours}`, width / 2, height / 3 + 30);
  text(`Minutes: ${minutes}`, width / 2, height / 3 + 60);
  text(`Seconds: ${seconds}`, width / 2, height / 3 + 90);
}

function windowResized() {
  // Resize canvas to maintain responsiveness
  resizeCanvas(windowWidth * 0.75, windowHeight * 0.85);
  
  // Maintain the same position after resizing
  canvas.position(windowWidth * 0.125, windowHeight * 0.075);  // Adjust the position for proper alignment
}

console.log("Target Date:", targetTime);
console.log("Current Date:", now);
console.log("Milliseconds Diff:", diff);