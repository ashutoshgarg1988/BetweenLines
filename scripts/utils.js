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

// utility function to Angle → Position
function angleToPoint(cx, cy, angleDeg, distance) {
  const rad = angleDeg * Math.PI / 180;
  return {
    x: cx + Math.cos(rad) * distance,
    y: cy + Math.sin(rad) * distance
  };
}

function lineIntersection(p1, p2, p3, p4) {
  const denom =
    (p1.x - p2.x) * (p3.y - p4.y) -
    (p1.y - p2.y) * (p3.x - p4.x);
  if (denom === 0) return null; // parallel lines
  const x =
    ((p1.x * p2.y - p1.y * p2.x) * (p3.x - p4.x) -
     (p1.x - p2.x) * (p3.x * p4.y - p3.y * p4.x)) / denom;
  const y =
    ((p1.x * p2.y - p1.y * p2.x) * (p3.y - p4.y) -
     (p1.y - p2.y) * (p3.x * p4.y - p3.y * p4.x)) / denom;
  return { x, y };
}


// Function to get the intersection point x of two lines
function getIntersectionPoint(horizontalY, rotationDeg) {
  // Original transversal endpoints (MUST match SVG)
  const t1 = { x: 500, y: 390 };
  const t2 = { x: 500, y: 65 };
  // Rotation pivot (MUST match SVG transform)
  const pivot = { x: 500, y: 240 };
  // Rotate endpoints exactly as SVG does
  const rt1 = rotatePoint(t1.x, t1.y, pivot.x, pivot.y, rotationDeg);
  const rt2 = rotatePoint(t2.x, t2.y, pivot.x, pivot.y, rotationDeg);
  // Horizontal line (parallel line)
  const h1 = { x: 0, y: horizontalY };
  const h2 = { x: 1000, y: horizontalY };
  // True intersection
  return lineIntersection(rt1, rt2, h1, h2);
}



function rotatePoint(x, y, cx, cy, angleDeg) {
  const rad = angleDeg * Math.PI / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const dx = x - cx;
  const dy = y - cy;

  return {
    x: cx + dx * cos - dy * sin,
    y: cy + dx * sin + dy * cos
  };
}

// Compute angle BETWEEN two lines
function angleBetweenLines(lineA, lineB) {
  const ax = lineA.x2.baseVal.value - lineA.x1.baseVal.value;
  const ay = lineA.y2.baseVal.value - lineA.y1.baseVal.value;
  const bx = lineB.x2.baseVal.value - lineB.x1.baseVal.value;
  const by = lineB.y2.baseVal.value - lineB.y1.baseVal.value;
  const dot = ax * bx + ay * by;
  const magA = Math.hypot(ax, ay);
  const magB = Math.hypot(bx, by);
  let angle = Math.acos(dot / (magA * magB));
  angle = angle * 180 / Math.PI;
  // always show acute / obtuse correctly
  return Math.round(angle);
}

// rotate a line by direction vector
function rotateLineByDirection(line, dirX, dirY) {
  const x1 = +line.getAttribute("x1");
  const y1 = +line.getAttribute("y1");
  const x2 = +line.getAttribute("x2");
  const y2 = +line.getAttribute("y2");
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2;
  const len = Math.hypot(x2 - x1, y2 - y1);
  const half = len / 2;
  const nx1 = cx - dirX * half;
  const ny1 = cy - dirY * half;
  const nx2 = cx + dirX * half;
  const ny2 = cy + dirY * half;
  line.setAttribute("x1", nx1);
  line.setAttribute("y1", ny1);
  line.setAttribute("x2", nx2);
  line.setAttribute("y2", ny2);
}

function shiftLineY(line, dy) {
  line.setAttribute("y1", +line.getAttribute("y1") + dy);
  line.setAttribute("y2", +line.getAttribute("y2") + dy);
}

function previewAngle(handle, mouse) {
  const lineKey = handle.dataset.line;
  const line =
    lineKey === "top" ? topLine :
    lineKey === "bottom" ? bottomLine :
    transversal;
  const x1 = +line.getAttribute("x1");
  const y1 = +line.getAttribute("y1");
  const x2 = +line.getAttribute("x2");
  const y2 = +line.getAttribute("y2");
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2;
  const angleRad = Math.atan2(mouse.y - cy, mouse.x - cx);
  const angleDeg = Math.abs(angleRad * 180 / Math.PI);
  // Normalize like your angles.A
  return angleDeg > 180 ? 360 - angleDeg : angleDeg;
}


function hideAllArcs() {
  document.querySelectorAll(".angle-arc").forEach(a => {
    a.style.opacity = "0";
  });
}

function showAllArcs() {
  document.querySelectorAll(".angle-arc").forEach(a => {
    a.style.opacity = "0.9";
  });
}

function showOnlyArcs(angleKeys) {
  hideAllArcs();
  angleKeys.forEach(key => {
    document
      .querySelectorAll(`.angle-arc[data-angle="${key}"]`)
      .forEach(a => (a.style.opacity = "0.9"));
  });
}

function lineRotationDeg(line) {
  const dx = line.x2.baseVal.value - line.x1.baseVal.value;
  const dy = line.y2.baseVal.value - line.y1.baseVal.value;
  return Math.atan2(dy, dx) * 180 / Math.PI;
}
