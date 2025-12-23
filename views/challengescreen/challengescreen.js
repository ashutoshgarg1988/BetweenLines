/***************************************************************
 *  Author      : MentorNest Animation
 *  Email       : info@mentornest.com
 *  File        : easyscreen.js
 *  Description : Handeler and functionality for Challenge screen
 *  Date        : 12-Dec-2025
 ***************************************************************/

(function initChallengeScreen() {
  const challengeResetBtn = document.getElementById("challengeResetBtn");
  const challengeNextBtn = document.getElementById("challengeNextBtn");
  let muted = false;
  SoundManager.playSceneBg("challange");
  setCommonUI({
    btnHome: true,
    btnPlay: true,
    btnBook: true,
    musicBtn: true,
    copyright: true
  });
  resetAngles();

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

  // Show info popup when screen loads
  // showPopup("info", { text: "Stop the moving arm as close as you can to the target angle." });

  challengeResetBtn.addEventListener("click", () => {
    SoundManager.play("click");
    resetAngles();
  });

  challengeNextBtn.addEventListener("click", () => {
    SoundManager.play("click");
    loadView("menu")
    SoundManager.stopAll();
    setTimeout(() => {
      if (!SoundManager.isBgmMuted()) {
        SoundManager.playBgm("bgm");
      }
    }, 500);
  });

  const submitBtn = document.getElementById("submitBtn");
  submitBtn.addEventListener("click", () => {
    SoundManager.play("click");
    validateOnSubmit();
  });


  const CENTER_X = 500;
  const TOP_LINE_Y = 190;
  const BOTTOM_LINE_Y = 290;
  const CENTER_Y = TOP_LINE_Y;   // top intersection
  const BOTTOM_CENTER_Y = BOTTOM_LINE_Y;

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
    console.log("📐 ALL ANGLES OBJECT:", angles);
    return angles;
  }

  // Function to reset intersecting line
  function resetAngles() {
    const given = Math.floor(Math.random() * 90) + 60;
    document.getElementById("transversal")
      .setAttribute(
        "transform",
        `rotate(${given - 90}, 500, 240)`
      );
    correctAngles = computeAllAngles(given);
    drawTopIntersection(given);
    drawBottomIntersection();
  }

  // Draw input boxes in which angles value has to filled
  function drawInputBox(x, y, key) {
    const box = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
    box.setAttribute("x", x);
    box.setAttribute("y", y);
    box.setAttribute("width", 80);
    box.setAttribute("height", 42);
    box.innerHTML = `
      <div xmlns="http://www.w3.org/1999/xhtml">
        <input type="text"
              data-angle="${key}"
              style="
                width:100%;
                height:100%;
                border-radius:10px;
                border:2px solid #bbb;
                font-size:18px;
                text-align:center;
              " />
      </div>
    `;
    return box;
  }

  // Top intersection functionality
  function drawTopIntersection(givenAngle) {
    const g = document.getElementById("topIntersection");
    g.innerHTML = "";
    const cx = 500;
    const cy = 190;
    const r = 62;
    // FULL GREY CIRCLE
    g.appendChild(drawAngleCircle(cx, cy, r));
    // PINK GIVEN ARC
    g.appendChild(drawPinkArc(cx, cy, r, 200, givenAngle));
    // GIVEN TEXT
    const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
    txt.setAttribute("x", cx + 25);
    txt.setAttribute("y", cy - 22);
    txt.setAttribute("class", "angle-text");
    txt.textContent = givenAngle + "°";
    g.appendChild(txt);
    // INPUT BOXES (3 sides)
    g.appendChild(drawInputBox(cx + 70, cy - 20, "B"));
    g.appendChild(drawInputBox(cx - 150, cy + 10, "D"));
    g.appendChild(drawInputBox(cx + 70, cy + 10, "C"));
  }

  // Bottom intersection functionality
  function drawBottomIntersection() {
    const g = document.getElementById("bottomIntersection");
    g.innerHTML = "";
    const cx = 500;
    const cy = 290;
    const r = 60;
    // FULL GREY CIRCLE
    g.appendChild(drawAngleCircle(cx, cy, r));
    // INPUT BOXES (ALL 4)
    g.appendChild(drawInputBox(cx - 150, cy - 20, "E"));
    g.appendChild(drawInputBox(cx + 70,  cy - 20, "F"));
    g.appendChild(drawInputBox(cx - 150, cy + 10, "H"));
    g.appendChild(drawInputBox(cx + 70,  cy + 10, "G"));
  }

  function validateOnSubmit() {
    let allCorrect = true;
    document.querySelectorAll("input[data-angle]").forEach(input => {
      const angleKey = input.dataset.angle;
      const userValue = parseInt(input.value, 10);
      const correctValue = correctAngles[angleKey];
      input.classList.remove("correct", "wrong");
      if (isNaN(userValue)) {
        input.classList.add("wrong");
        allCorrect = false;
        return;
      }
      // Check correctness
      if (userValue === correctValue) {
        input.classList.add("correct");
      } else {
        input.classList.add("wrong");
        allCorrect = false;
      }
    });
    if (allCorrect) {
      showPopup("greatWork", { step: 1, description: "" });
    } else {
      showPopup("info", { text: "Sorry! Try again" });
    }
  }

})();