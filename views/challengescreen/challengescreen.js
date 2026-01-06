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
  let roundCounter = 0;
  setCommonUI({
    btnHome: true,
    btnPlay: true,
    btnBook: true,
    musicBtn: true,
    copyright: true
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
      SoundManager.playSceneBg("challange");
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

  // Draw input boxes in which angles value has to filled
  function drawInputBox(x, y, key) {
    const box = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
    box.setAttribute("x", x);
    box.setAttribute("y", y);
    box.setAttribute("width", 60);
    box.setAttribute("height", 42);
    box.innerHTML = `
      <div xmlns="http://www.w3.org/1999/xhtml">
        <input type="text"
              data-angle="${key}"
              inputmode="numeric"
              pattern="[0-9]*"
              oninput="
                this.value = this.value.replace(/[^0-9]/g, '');
                if (this.value !== '' && +this.value > 360) this.value = '';"
              style="
                width:100%;
                height:100%;
                border-radius:7px;
                border:1px solid #000;
                background: rgba(236, 233, 233, 1);
                font-size:18px;
                font-family: sans-serif;
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
    // INPUT BOXES (3 sides)
    g.appendChild(drawInputBox(cx + 70, cy - 30, "B"));
    g.appendChild(drawInputBox(cx - 100, cy + 10, "D"));
    g.appendChild(drawInputBox(cx + 70, cy + 10, "C"));
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
    // INPUT BOXES (ALL 4)
    g.appendChild(drawInputBox(cx - 100, cy - 45, "E"));
    g.appendChild(drawInputBox(cx + 70,  cy - 30, "F"));
    g.appendChild(drawInputBox(cx - 120, cy + 20, "H"));
    g.appendChild(drawInputBox(cx + 70,  cy + 10, "G"));
    // const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    // dot.setAttribute("cx", cx);
    // dot.setAttribute("cy", cy);
    // dot.setAttribute("r", 3);
    // dot.setAttribute("fill", "red");
    // g.appendChild(dot);
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
      roundCounter++;
      if(roundCounter === 3) {
        showPopup("greatJobSummary", { angleCount: 3, levelName: 'challenge' });
      }else {
        showPopup("info", { text: "Well done! Your answer is correct." });
      }
    } else {
      showPopup("info", { text: "Sorry! Try again." });
    }
  }
  resetAngles();
})();