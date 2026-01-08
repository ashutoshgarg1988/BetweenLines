/***************************************************************
 *  Author      : MentorNest Animation
 *  Email       : info@mentornest.com
 *  File        : easyscreen.js
 *  Description : Handeler and functionality for Easy screen
 *  Date        : 11-Dec-2025
 ***************************************************************/

(function initEasyScreen() {
  setCommonUI({
    btnHome: true,
    btnPlay: true,
    btnBook: true,
    musicBtn: true,
    copyright: true
  });

  const centerPanel = document.getElementById('gridBoard');
  centerPanel.style.backgroundImage = "url('assets/images/easyscreen/mathsline.svg')";
  let isParallelMode = false;
  let angles = [];
  let lastValidMousePoint = null;
  let activeAngleFilter = null;
  const ANGLE_COLORS = {
    A: "#ffbdc0",
    B: "#90e2ff",
    C: "#b1ffc5",
    D: "#f39fff"
  };
  const angleGroup = document.querySelector(".angle-group");
  const txtA = document.createElementNS("http://www.w3.org/2000/svg", "text");
  const txtB = document.createElementNS("http://www.w3.org/2000/svg", "text");
  const txtC = document.createElementNS("http://www.w3.org/2000/svg", "text");
  const txtD = document.createElementNS("http://www.w3.org/2000/svg", "text");
  const txtE = document.createElementNS("http://www.w3.org/2000/svg", "text");
  const txtF = document.createElementNS("http://www.w3.org/2000/svg", "text");
  const txtG = document.createElementNS("http://www.w3.org/2000/svg", "text");
  const txtH = document.createElementNS("http://www.w3.org/2000/svg", "text");

  const INITIAL_LINES = {
    top: {
      x1: +topLine.getAttribute("x1"),
      y1: +topLine.getAttribute("y1"),
      x2: +topLine.getAttribute("x2"),
      y2: +topLine.getAttribute("y2")
    },
    bottom: {
      x1: +bottomLine.getAttribute("x1"),
      y1: +bottomLine.getAttribute("y1"),
      x2: +bottomLine.getAttribute("x2"),
      y2: +bottomLine.getAttribute("y2")
    },
    transversal: {
      x1: +transversal.getAttribute("x1"),
      y1: +transversal.getAttribute("y1"),
      x2: +transversal.getAttribute("x2"),
      y2: +transversal.getAttribute("y2")
    }
  };

  function resetLine(line, data) {
    line.setAttribute("x1", data.x1);
    line.setAttribute("y1", data.y1);
    line.setAttribute("x2", data.x2);
    line.setAttribute("y2", data.y2);
  }

  function resetEasyScreenState() {
    /* Reset lines */
    resetLine(topLine, INITIAL_LINES.top);
    resetLine(bottomLine, INITIAL_LINES.bottom);
    resetLine(transversal, INITIAL_LINES.transversal);
    positionHandlesInsideLine("top");
    positionHandlesInsideLine("bottom");
    positionHandlesInsideLine("transversal");
    alignParallelLinesVertically();
    /* Reset parallel mode */
    isParallelMode = false;
    const checkbox = document.getElementById("lineType");
    checkbox.checked = false;
    /* Reset paper type */
    document.getElementById("grid").checked = true;
    centerPanel.style.backgroundImage = "url('assets/images/easyscreen/mathsline.svg')";
    /* Reset angle UI */
    hideAllAngleTxt();
    angleGroup.querySelectorAll('input[type="radio"]').forEach(r => {
      r.checked = false;
      r.disabled = true;
    });
    angleGroup.querySelectorAll('.ui-check input[type="checkbox"]').forEach(cb => cb.checked = false);
    /* Redraw intersections cleanly */
    redrawAngles();
    hideAllAngleTxt();
    hideAllArcs();
  }

  // Show info popup when screen loads
  // showPopup("info", { text: "Drag the angle arm to build an angle" });

  // Next button click functionality
  easyNextBtn.addEventListener("click", () => {
    SoundManager.play("click");
    loadView("warmupscreen");
  });
  SoundManager.muteVoice();
  // Sound button functionality
  soundBtn.addEventListener("click", () => {
    SoundManager.play("click");
    const muted = SoundManager.toggleVoiceMute();
    if (muted) {
      soundBtn.src = "assets/images/common/audio-off.svg";
      soundBtn.setAttribute("title", "Unmute");
    } else {
      SoundManager.playSceneBg("easy");
      soundBtn.src = "assets/images/common/sound-btn.svg";
      soundBtn.setAttribute("title", "Mute");
    }
  });

  document.getElementById("easyResetBtn").addEventListener("click", () => {
    SoundManager.play("click");
    resetEasyScreenState();
  });

  let lastPaper = "grid";
  document.querySelectorAll('input[name="paperType"]').forEach(radio => {
    radio.addEventListener('click', (e) => {
      // If clicking same radio again → unselect
      if (lastPaper === radio.id && radio.checked) {
        radio.checked = false;
        lastPaper = null;
        centerPanel.style.backgroundImage = ""; // remove paper bg
        return;
      }
      // Normal behaviour → select & apply bg
      lastPaper = radio.id;
      centerPanel.style.backgroundImage = radio.id === "grid"
        ? "url('assets/images/easyscreen/mathsline.svg')"
        : "url('assets/images/easyscreen/dotted.svg')";
    });
  });

  const checkbox = document.getElementById("lineType");
  checkbox.addEventListener("change", (e) => {
    if (e.target.tagName !== "INPUT") {
      checkbox.checked = !checkbox.checked;
    }
    isParallelMode = checkbox.checked;
    updateParallelMode(checkbox.checked);
  });

  function updateParallelMode(isEnabled) {
    if (isEnabled) {
      console.log("checked");
      makeTopAndBottomParallel();
    } else {
      console.log("Unchecked");
    }
  }

  document.querySelector(".angle-group").addEventListener("change", (e) => {
    if (e.target.type !== "radio") return;
    const angleType = e.target.dataset.angle;
    const pairNo = e.target.dataset.pair;
    // STORE STATE
    activeAngleFilter = { type: angleType, pair: pairNo };
    hideAllAngleTxt();
    handleAnglePair(angleType, pairNo);
  });

  function hideAllAngleTxt() {
    txtA.style.visibility = "hidden";
    txtB.style.visibility = "hidden";
    txtC.style.visibility = "hidden";
    txtD.style.visibility = "hidden";
    txtE.style.visibility = "hidden";
    txtF.style.visibility = "hidden";
    txtG.style.visibility = "hidden";
    txtH.style.visibility = "hidden";
  }

  function handleAnglePair(angleType, pairNo) {
    switch (angleType) {
      case "corresponding":
        highlightCorresponding(pairNo);
        break;
      case "verticallyOpposite":
        highlightVertical(pairNo);
        break;
      case "alternateInterior":
        highlightAlternateInterior(pairNo);
        break;
      case "alternateExterior":
        highlightAlternateExterior(pairNo);
        break;
    }
  }

  function highlightCorresponding(pairNo) {
    hideAllAngleTxt();
    switch (Number(pairNo)) {
      case 1 : 
        showOnlyArcs(["A", "E"]);
        txtA.style.visibility = "visible";
        txtE.style.visibility = "visible";
        break;
      case 2 :
        showOnlyArcs(["B", "F"]);
        txtB.style.visibility = "visible";
        txtF.style.visibility = "visible";
        break;
      case 3 :
        showOnlyArcs(["C", "G"]);
        txtC.style.visibility = "visible";
        txtG.style.visibility = "visible";
        break;
      case 4 :
        showOnlyArcs(["D", "H"]);
        txtD.style.visibility = "visible";
        txtH.style.visibility = "visible";
        break;
    }
  }

  function highlightVertical(pairNo) {
    switch (Number(pairNo)) {
      case 1 : 
        showOnlyArcs(["A", "D"]);
        txtA.style.visibility = "visible";
        txtD.style.visibility = "visible";
        break;
      case 2 :
        showOnlyArcs(["B", "C"]);
        txtB.style.visibility = "visible";
        txtC.style.visibility = "visible";
        break;
      case 3 :
        showOnlyArcs(["E", "H"]);
        txtE.style.visibility = "visible";
        txtH.style.visibility = "visible";
        break;
      case 4 :
        showOnlyArcs(["F", "G"]);
        txtF.style.visibility = "visible";
        txtG.style.visibility = "visible";
        break;
    }
  }

  function highlightAlternateInterior(pairNo) {
    switch (Number(pairNo)) {
      case 1 : 
        showOnlyArcs(["C", "E"]);
        txtC.style.visibility = "visible";
        txtE.style.visibility = "visible";
        break;
      case 2 :
        showOnlyArcs(["D", "F"]);
        txtD.style.visibility = "visible";
        txtF.style.visibility = "visible";
        break;
    }
  }

  function highlightAlternateExterior(pairNo) {
    switch (Number(pairNo)) {
      case 1 : 
        showOnlyArcs(["A", "G"]);
        txtA.style.visibility = "visible";
        txtG.style.visibility = "visible";
        break;
      case 2 :
        showOnlyArcs(["B", "H"]);
        txtB.style.visibility = "visible";
        txtH.style.visibility = "visible";
        break;
    }
  }

  const headingCheckboxes = angleGroup.querySelectorAll('.ui-check input[type="checkbox"]');
  document.querySelectorAll('.angle-group input[type="radio"]').forEach(r => (r.disabled = true));

  headingCheckboxes.forEach(cb => {
    cb.addEventListener("change", e => {
      if (!cb.checked) {
        activeAngleFilter = null;
        hideAllArcs();
        hideAllAngleTxt();
        return;
      }
      hideAllAngleTxt();
      const activeAngle = cb.dataset.angle;
      // Uncheck all other checkboxes
      headingCheckboxes.forEach(other => {
        if (other !== cb) other.checked = false;
      });
      // Enable radios of active section, disable others
      angleGroup.querySelectorAll('input[type="radio"]').forEach(radio => {
        const sameGroup = radio.dataset.angle === activeAngle;
        radio.disabled = !sameGroup;
        if (!sameGroup) radio.checked = false;
      });
      // AUTO-SELECT first radio of active group
      // const firstRadio = angleGroup.querySelector(`input[type="radio"][data-angle="${activeAngle}"]`);
      // if (firstRadio) firstRadio.checked = true;
    });
  });



  /* Functionality for creating intersecting line and angles + input boxes*/
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
    circle.setAttribute("fill", "rgba(180,180,180,0)");
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
    path.setAttribute("class", "angle-arc");
    return path;
  }

  /*
    TOP INTERSECTION
      A | B
      -----
      D | C
    BOTTOM INTERSECTION
      E | F
      -----
      H | G
  */
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

  function drawIntersectionFromPoint({
    groupId,
    pt,
    angle,
    angleKeys,     // ["A","B","C","D"] OR ["E","F","G","H"]
    textNodes      // [txtA, txtB, txtC, txtD] OR [txtE, txtF, txtG, txtH]
  }) {
    const g = document.getElementById(groupId);
    g.innerHTML = "";
    angles = computeAllAngles(angle);
    const cx = pt.x;
    const cy = pt.y;
    const r = 30;
    const base = 270;
    g.appendChild(drawAngleCircle(cx, cy, r));
    let start = base;
    angleKeys.forEach((key, i) => {
      const arc = drawArcSector(cx, cy, r, start, angles[key], ANGLE_COLORS[Object.keys(ANGLE_COLORS)[i]]);
      arc.dataset.angle = key;
      g.appendChild(arc);
      start += angles[key];
    });
    const positions = [
      { x: cx - 45, y: cy - 25 },
      { x: cx + 25, y: cy - 25 },
      { x: cx + 30, y: cy + 25 },
      { x: cx - 50, y: cy + 25 }
    ];
    textNodes.forEach((txt, i) => {
      txt.setAttribute("x", positions[i].x);
      txt.setAttribute("y", positions[i].y);
      txt.setAttribute("class", "angle-text");
      txt.textContent = angles[angleKeys[i]] + "°";
      g.appendChild(txt);
    });
  }
  redrawAngles();


  // Line movements handling 
  const svg = document.getElementById("angleCanvas");
  let activePoint = null;
  const lineData = {
    top: { length: null },
    bottom: { length: null },
    transversal: { length: null }
  };
  const HANDLE_OFFSET = 50;

  function makeTopAndBottomParallel() {
    const x1 = +topLine.getAttribute("x1");
    const y1 = +topLine.getAttribute("y1");
    const x2 = +topLine.getAttribute("x2");
    const y2 = +topLine.getAttribute("y2");
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy);
    const dirX = dx / len;
    const dirY = dy / len;
    rotateLineByDirection(bottomLine, dirX, dirY);
    positionHandlesInsideLine("bottom");
    redrawAngles();
  }


  function positionHandlesInsideLine(lineKey) {
    const line = lineKey === "top" ? topLine : lineKey === "bottom" ? bottomLine : transversal;
    const pts = document.querySelectorAll(`.drag-point[data-line="${lineKey}"]`);
    const x1 = +line.getAttribute("x1");
    const y1 = +line.getAttribute("y1");
    const x2 = +line.getAttribute("x2");
    const y2 = +line.getAttribute("y2");
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy);
    const ux = dx / len;
    const uy = dy / len;
    // point 1 → inside from start
    pts[0].setAttribute("cx", x1 + ux * HANDLE_OFFSET);
    pts[0].setAttribute("cy", y1 + uy * HANDLE_OFFSET);
    // point 2 → inside from end
    pts[1].setAttribute("cx", x2 - ux * HANDLE_OFFSET);
    pts[1].setAttribute("cy", y2 - uy * HANDLE_OFFSET);
  }

  positionHandlesInsideLine("top");
  positionHandlesInsideLine("bottom");
  positionHandlesInsideLine("transversal");
  alignParallelLinesVertically();

  function rotateLineWithHandle(handle, mouse) {
    const lineKey = handle.dataset.line;
    if (!lineKey) return;
    const line = lineKey === "top" ? topLine : lineKey === "bottom" ? bottomLine : transversal;
    const x1 = +line.getAttribute("x1");
    const y1 = +line.getAttribute("y1");
    const x2 = +line.getAttribute("x2");
    const y2 = +line.getAttribute("y2");
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;
    const len = Math.hypot(x2 - x1, y2 - y1);
    const half = len / 2;
    // angle from center to mouse
    const angle = Math.atan2(mouse.y - cy, mouse.x - cx);
    const dirX = Math.cos(angle);
    const dirY = Math.sin(angle);
    // rotate THIS line
    line.setAttribute("x1", cx - dirX * half);
    line.setAttribute("y1", cy - dirY * half);
    line.setAttribute("x2", cx + dirX * half);
    line.setAttribute("y2", cy + dirY * half);
    positionHandlesInsideLine(lineKey);
    // PARALLEL MODE LOGIC
    if (isParallelMode && (lineKey === "top" || lineKey === "bottom")) {
      const otherLine = lineKey === "top" ? bottomLine : topLine;
      rotateLineByDirection(otherLine, dirX, dirY);
      // reposition handles for the other line
      positionHandlesInsideLine(lineKey === "top" ? "bottom" : "top");
    }
  }

  function svgPoint(evt) {
    const pt = svg.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }

  document.querySelectorAll(".drag-point").forEach(p => {
    p.addEventListener("mousedown", e => {
      activePoint = p;
      lastValidMousePoint = null;
      e.stopPropagation();
    });
  });

  svg.addEventListener("mousemove", e => {
    if (!activePoint) return;
    const lineKey = activePoint.dataset.line;
    const p = svgPoint(e);
    // NO restriction for parallel lines
    if (lineKey === "top" || lineKey === "bottom") {
      rotateLineWithHandle(activePoint, p);
      redrawAngles();
      return;
    }
    // Restriction ONLY for transversal
    if (lineKey === "transversal") {
      const anglePreview = previewAngle(activePoint, p);
      // Out of bounds → freeze everything
      if (anglePreview <= 14 || anglePreview >= 166) {
        if (lastValidMousePoint) {
          rotateLineWithHandle(activePoint, lastValidMousePoint);
          redrawAngles();
        }
        return;
      }
      // Valid → apply and store
      rotateLineWithHandle(activePoint, p);
      redrawAngles();
      lastValidMousePoint = p;
    }
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
      drawIntersectionFromPoint({
        groupId: "topIntersection",
        pt: topI,
        angle,
        angleKeys: ["A", "B", "C", "D"],
        textNodes: [txtA, txtB, txtC, txtD]
      });
    }
    if (botI) {
      const angle = angleBetweenLines(bottomLine, transversal);
      drawIntersectionFromPoint({
        groupId: "bottomIntersection",
        pt: botI,
        angle,
        angleKeys: ["E", "F", "G", "H"],
        textNodes: [txtE, txtF, txtG, txtH]
      });
    }

    // REAPPLY VISIBILITY FILTER
    if (activeAngleFilter) {
      handleAnglePair(activeAngleFilter.type, activeAngleFilter.pair);
    }
  }

  function alignParallelLinesVertically() {
    const tY1 = +transversal.getAttribute("y1");
    const tY2 = +transversal.getAttribute("y2");
    const transversalCenter = (tY1 + tY2) / 2;
    const topY = +topLine.getAttribute("y1");
    const bottomY = +bottomLine.getAttribute("y1");
    const parallelCenter = (topY + bottomY) / 2;
    const deltaY = transversalCenter - parallelCenter;
    shiftLineY(topLine, deltaY);
    shiftLineY(bottomLine, deltaY);
    positionHandlesInsideLine("top");
    positionHandlesInsideLine("bottom");
    redrawAngles();
  }

  hideAllAngleTxt();
  hideAllArcs();
})();