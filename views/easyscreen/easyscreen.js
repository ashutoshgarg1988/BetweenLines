/***************************************************************
 *  Author      : MentorNest Animation
 *  Email       : info@mentornest.com
 *  File        : easyscreen.js
 *  Description : Handeler and functionality for Easy screen
 *  Date        : 11-Dec-2025
 ***************************************************************/

(function initEasyScreen() {
  SoundManager.playSceneBg("easy");
  setCommonUI({
    btnHome: true,
    btnPlay: true,
    btnBook: true,
    musicBtn: true,
    copyright: true
  });

  const centerPanel = document.getElementById('gridBoard');
  centerPanel.style.backgroundImage = "url('assets/images/easyscreen/mathsline.svg')";

  // Show info popup when screen loads
  // showPopup("info", { text: "Drag the angle arm to build an angle" });

  // Next button click functionality
  easyNextBtn.addEventListener("click", () => {
    SoundManager.play("click");
    loadView("warmupscreen");
  });

  // Sound button functionality
  soundBtn.addEventListener("click", () => {
    SoundManager.play("click");
    const muted = SoundManager.toggleVoiceMute();
    if (muted) {
      soundBtn.src = "assets/images/common/audio-off.svg";
      soundBtn.setAttribute("title", "Unmute");
    } else {
      soundBtn.src = "assets/images/common/sound-btn.svg";
      soundBtn.setAttribute("title", "Mute");
    }
  });

  document.getElementById("easyResetBtn").addEventListener("click", () => {
    SoundManager.play("click");
  });

  // Change the type of Paper
  document.querySelectorAll('input[name="paperType"]').forEach(r => {
    r.addEventListener('change', () => {
      if (r.id === "grid") {
        centerPanel.style.backgroundImage = "url('assets/images/easyscreen/mathsline.svg')";
      } else {
        centerPanel.style.backgroundImage = "url('assets/images/easyscreen/dotted.svg')";
      }
    });
  });


  /* Functionality for creating intersecting line and angles + input boxes*/
  const ANGLE_COLORS = {
    A: "#ffbdc0",
    B: "#90e2ff",
    C: "#b1ffc5",
    D: "#f39fff"
  };
  const txtA = document.createElementNS("http://www.w3.org/2000/svg", "text");
  const txtB = document.createElementNS("http://www.w3.org/2000/svg", "text");
  const txtC = document.createElementNS("http://www.w3.org/2000/svg", "text");
  const txtD = document.createElementNS("http://www.w3.org/2000/svg", "text");
  const txtE = document.createElementNS("http://www.w3.org/2000/svg", "text");
  const txtF = document.createElementNS("http://www.w3.org/2000/svg", "text");
  const txtG = document.createElementNS("http://www.w3.org/2000/svg", "text");
  const txtH = document.createElementNS("http://www.w3.org/2000/svg", "text");

  function polar(cx, cy, r, angle) {
    const rad = (angle - 90) * Math.PI / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad)
    };
  }

  function drawAngleCircle(cx, cy, r) {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", r);
    circle.setAttribute("fill", "rgba(180,180,180,0.7)");
    return circle;
  }

  function drawArcSector(cx, cy, r, startAngle, sweepAngle, color) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const start = polar(cx, cy, r, startAngle);
    const end = polar(cx, cy, r, startAngle + sweepAngle);
    const largeArc = sweepAngle > 180 ? 1 : 0;
    const d = `
      M ${cx} ${cy}
      L ${start.x} ${start.y}
      A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}
      Z
    `;
    path.setAttribute("d", d);
    path.setAttribute("fill", color);
    path.setAttribute("opacity", 0.9);
    return path;
  }


  function drawPinkArc(cx, cy, r, startAngle, sweepAngle) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const start = polar(cx, cy, r, startAngle);
    const end = polar(cx, cy, r, startAngle + sweepAngle);
    const largeArc = sweepAngle > 180 ? 1 : 0;
    const d = `
      M ${cx} ${cy}
      L ${start.x} ${start.y}
      A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}
      Z
    `;
    path.setAttribute("d", d);
    path.setAttribute("fill", "#f6b3d8");
    return path;
  }

  function computeAllAngles(given) {
    const angles = {
      A: 180 - given,
      B: given,
      C: 180 - given,
      D: given,

      E: 180 - given,
      F: given,
      G: 180 - given,
      H: given
    };
    // console.log("ALL ANGLES OBJECT:", angles);
    return angles;
  }

  // Top intersection functionality
  function drawTopIntersectionFromPoint(pt, angle) {
    const g = document.getElementById("topIntersection");
    g.innerHTML = "";
    const angles = computeAllAngles(angle);
    const cx = pt.x;
    const cy = pt.y;
    const r = 30;
    g.appendChild(drawAngleCircle(cx, cy, r));
    const base = 270;
    g.appendChild(drawArcSector(cx, cy, r, base, angles.A, ANGLE_COLORS.A));
    g.appendChild(drawArcSector(cx, cy, r, base + angles.A, angles.B, ANGLE_COLORS.B));
    g.appendChild(drawArcSector(cx, cy, r, base + angles.A + angles.B, angles.C, ANGLE_COLORS.C));
    g.appendChild(drawArcSector(cx, cy, r, base + angles.A + angles.B + angles.C, angles.D, ANGLE_COLORS.D));

    txtA.setAttribute("x", cx - 45);
    txtA.setAttribute("y", cy - 25);
    txtA.setAttribute("class", "angle-text");
    txtA.textContent = angles.A + "°";
    g.appendChild(txtA);

    txtB.setAttribute("x", cx + 25);
    txtB.setAttribute("y", cy - 25);
    txtB.setAttribute("class", "angle-text");
    txtB.textContent = angles.B + "°";
    g.appendChild(txtB);

    txtC.setAttribute("x", cx + 30);
    txtC.setAttribute("y", cy + 25);
    txtC.setAttribute("class", "angle-text");
    txtC.textContent = angles.C + "°";
    g.appendChild(txtC);

    txtD.setAttribute("x", cx - 50);
    txtD.setAttribute("y", cy + 25);
    txtD.setAttribute("class", "angle-text");
    txtD.textContent = angles.D + "°";
    g.appendChild(txtD);
  }


  // Bottom intersection functionality
  function drawBottomIntersectionFromPoint(pt, angle) {
    const g = document.getElementById("bottomIntersection");
    g.innerHTML = "";
    const angles = computeAllAngles(angle);
    const cx = pt.x;
    const cy = pt.y;
    const r = 30;
    const base = 270;
    g.appendChild(drawAngleCircle(cx, cy, r));
    g.appendChild(drawArcSector(cx, cy, r, base, angles.E, ANGLE_COLORS.A));
    g.appendChild(drawArcSector(cx, cy, r, base + angles.E, angles.F, ANGLE_COLORS.B));
    g.appendChild(drawArcSector(cx, cy, r, base + angles.E + angles.F, angles.G, ANGLE_COLORS.C));
    g.appendChild(drawArcSector(cx, cy, r, base + angles.E + angles.F + angles.G, angles.H, ANGLE_COLORS.D));
    
    txtE.setAttribute("x", cx - 45);
    txtE.setAttribute("y", cy - 25);
    txtE.setAttribute("class", "angle-text");
    txtE.textContent = angles.E + "°";
    g.appendChild(txtE);

    txtF.setAttribute("x", cx + 25);
    txtF.setAttribute("y", cy - 25);
    txtF.setAttribute("class", "angle-text");
    txtF.textContent = angles.F + "°";
    g.appendChild(txtF);

    txtG.setAttribute("x", cx + 30);
    txtG.setAttribute("y", cy + 25);
    txtG.setAttribute("class", "angle-text");
    txtG.textContent = angles.G + "°";
    g.appendChild(txtG);

    txtH.setAttribute("x", cx - 50);
    txtH.setAttribute("y", cy + 25);
    txtH.setAttribute("class", "angle-text");
    txtH.textContent = angles.H + "°";
    g.appendChild(txtH);
  }

  redrawAngles();





  const svg = document.getElementById("angleCanvas");
  let activePoint = null;
  const lineData = {
    top: { length: null },
    bottom: { length: null },
    transversal: { length: null }
  };

  function initLineLength(lineId, key) {
    const line = document.getElementById(lineId);
    const dx = line.x2.baseVal.value - line.x1.baseVal.value;
    const dy = line.y2.baseVal.value - line.y1.baseVal.value;
    lineData[key].length = Math.hypot(dx, dy);
  }

  initLineLength("topLine", "top");
  initLineLength("bottomLine", "bottom");
  initLineLength("transversal", "transversal");

  function svgPoint(evt) {
    const pt = svg.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }

  document.querySelectorAll(".drag-point").forEach(p => {
    p.addEventListener("mousedown", e => {
      activePoint = p;
      e.stopPropagation();
    });
  });

  svg.addEventListener("mousemove", e => {
    if (!activePoint) return;
    const p = svgPoint(e);
    rotateLineWithHandle(activePoint, p);
    redrawAngles();
  });


  svg.addEventListener("mouseup", () => activePoint = null);
  svg.addEventListener("mouseleave", () => activePoint = null);

  function intersect(l1, l2) {
    const x1 = +l1.x1.baseVal.value, y1 = +l1.y1.baseVal.value;
    const x2 = +l1.x2.baseVal.value, y2 = +l1.y2.baseVal.value;
    const x3 = +l2.x1.baseVal.value, y3 = +l2.y1.baseVal.value;
    const x4 = +l2.x2.baseVal.value, y4 = +l2.y2.baseVal.value;
    const d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (!d) return null;
    return {
      x: ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / d,
      y: ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / d
    };
  }

  function redrawAngles() {
    const topI = intersect(topLine, transversal);
    const botI = intersect(bottomLine, transversal);
    if (topI) {
      const angle = angleBetweenLines(topLine, transversal);
      drawTopIntersectionFromPoint(topI, angle);
    }
    if (botI) {
      const angle = angleBetweenLines(bottomLine, transversal);
      drawBottomIntersectionFromPoint(botI, angle);
    }
  }


  function rotateLineWithHandle(handle, mouse) {
    const lineKey = handle.dataset.line;
    const pointIndex = handle.dataset.point;
    const line =
      lineKey === "top" ? document.getElementById("topLine") :
        lineKey === "bottom" ? document.getElementById("bottomLine") :
          document.getElementById("transversal");
    const pts = document.querySelectorAll(
      `.drag-point[data-line="${lineKey}"]`
    );

    const moving = pointIndex === "1" ? pts[0] : pts[1];
    const pivot = pointIndex === "1" ? pts[1] : pts[0];
    const px = +pivot.getAttribute("cx");
    const py = +pivot.getAttribute("cy");
    // angle ONLY (mouse is used just to get direction)
    const angle = Math.atan2(mouse.y - py, mouse.x - px);
    const L = lineData[lineKey].length;
    // recompute endpoint on the line
    const nx = px + L * Math.cos(angle);
    const ny = py + L * Math.sin(angle);
    moving.setAttribute("cx", nx);
    moving.setAttribute("cy", ny);
    line.setAttribute("x1", pts[0].getAttribute("cx"));
    line.setAttribute("y1", pts[0].getAttribute("cy"));
    line.setAttribute("x2", pts[1].getAttribute("cx"));
    line.setAttribute("y2", pts[1].getAttribute("cy"));
  }

})();