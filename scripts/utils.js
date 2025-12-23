// function reads the current CSS rotation angle (in degrees) of a DOM element that has been rotated using transform: rotate(...)
function getElementRotation(el) {
  const style = window.getComputedStyle(el);
  const transform = style.transform;
  if (transform === "none") return 0;
  const values = transform.match(/matrix\(([^)]+)\)/)[1].split(", ");
  const a = values[0];
  const b = values[1];
  const angle = Math.atan2(b, a) * (180 / Math.PI);
  return angle;
}

// function calculates the smallest angle difference between two line directions
function angleDiff(a, b) {
  let diff = Math.abs(a - b) % 180;
  if (diff > 90) diff = 180 - diff;
  return diff;
}

// function calculates the angle of a line formed by two points with respect to the positive X-axis, and returns that angle in degrees
function angleBetween(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.atan2(dy, dx) * (180 / Math.PI);
}


function drawAngleCircle(cx, cy, r) {
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", cx);
  circle.setAttribute("cy", cy);
  circle.setAttribute("r", r);
  circle.setAttribute("fill", "rgba(180,180,180,0.7)");
  return circle;
}
