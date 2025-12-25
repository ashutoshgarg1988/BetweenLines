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

  document.getElementById("easyResetBtn").addEventListener("click", ()=> {
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
  const CENTER_X = 500;
  const TOP_LINE_Y = 190;
  const BOTTOM_LINE_Y = 290;
  const CENTER_Y = TOP_LINE_Y;   // top intersection
  const BOTTOM_CENTER_Y = BOTTOM_LINE_Y;
  let correctAngles = {};
  let currentRotationDeg = 0;
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
      A: given,
      B: 180 - given,
      C: given,
      D: 180 - given,

      E: given,
      F: 180 - given,
      G: given,
      H: 180 - given
    };
    // console.log("ALL ANGLES OBJECT:", angles);
    return angles;
  }

  // Function to reset intersecting line
  function resetAngles() {
    const given = Math.floor(Math.random() * 90) + 40;
    currentRotationDeg = given - 90;
    document.getElementById("transversal")
      .setAttribute(
        "transform",
        `rotate(${currentRotationDeg}, 500, 240)`
      );
    correctAngles = computeAllAngles(given);
    drawTopIntersection(given);
    drawBottomIntersection();
  }

  // Top intersection functionality
  function drawTopIntersection(givenAngle) {
    const g = document.getElementById("topIntersection");
    g.innerHTML = "";
    const intersection = getIntersectionPoint(TOP_LINE_Y, currentRotationDeg);
    const cx = intersection.x;
    const cy = intersection.y;
    const r = 30;
    // FULL GREY CIRCLE
    g.appendChild(drawAngleCircle(cx, cy, r));
    // PINK GIVEN ARC
    g.appendChild(drawPinkArc(cx, cy, r, 273, givenAngle+10));
    // GIVEN TEXT
    const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
    txt.setAttribute("x", cx - 55);
    txt.setAttribute("y", cy - 25);
    txt.setAttribute("class", "angle-text");
    txt.textContent = givenAngle + "°";
    g.appendChild(txt);
  }

  // Bottom intersection functionality
  function drawBottomIntersection() {
    const g = document.getElementById("bottomIntersection");
    g.innerHTML = "";
    const intersection = getIntersectionPoint(BOTTOM_LINE_Y, currentRotationDeg);
    const cx = intersection.x;
    const cy = intersection.y;
    const r = 30;
    // FULL GREY CIRCLE
    g.appendChild(drawAngleCircle(cx, cy, r));
    // const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    // dot.setAttribute("cx", cx);
    // dot.setAttribute("cy", cy);
    // dot.setAttribute("r", 3);
    // dot.setAttribute("fill", "red");
    // g.appendChild(dot);
  }

  resetAngles();
  
})();