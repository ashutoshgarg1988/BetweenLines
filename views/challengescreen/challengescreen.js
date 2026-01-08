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
  const GIVEN_KEYS = ["A","B","C","D","E","F","G","H"];
  let hiddenArcs = ["B","C","D","E","F","G","H"];
  let roundCounter = 0;
  let randomKey = '';
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
  const TOP_LINE_Y = 190;
  const BOTTOM_LINE_Y = 290;
  let correctAngles = {};
  let currentRotationDeg = 0;
  function polar(cx, cy, r, angle) {
    const rad = angle * Math.PI / 180;
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
    randomKey = GIVEN_KEYS[Math.floor(Math.random() * GIVEN_KEYS.length)];
    const given = Math.floor(Math.random() * 90) + 40;
    currentRotationDeg = given - 90;
    // console.log("given:::"+given+":::::currentRotationDeg::::"+currentRotationDeg);
    document.getElementById("transversal").setAttribute("transform", `rotate(${currentRotationDeg}, 500, 240)`);
    correctAngles = computeAllAngles(given);
    drawTopIntersection(given);
    drawBottomIntersection(given);
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

  // Draw text
  function drawText(x, y, letter) {
    const t = document.createElementNS("http://www.w3.org/2000/svg","text");
    t.setAttribute("x", x);
    t.setAttribute("y", y);
    t.setAttribute("class", "angle-text");
    t.textContent = letter +"°";
    return t;
  }

  const TOP_OFFSET = {
    A: {x: -100, y: -30},
    B: {x: 40, y: -30},
    C: {x: 40, y: 10},
    D: {x: -100, y: 10}
  };

  const TOP_TXT_OFFSET = {
    A: {x: -70, y: -10},
    B: {x: 35, y: -10},
    C: {x: 35, y: 30},
    D: {x: -70, y: 30}
  };

  const BOTTOM_OFFSET = {
    E: {x: -100, y: -30},
    F: {x: 40, y: -30},
    G: {x: 40, y: 10},
    H: {x: -100, y: 10}
  };

  const BOTTOM_TXT_OFFSET = {
    E: {x: -70, y: -10},
    F: {x: 35, y: -10},
    G: {x: 35, y: 30},
    H: {x: -70, y: 30}
  };

  // Top intersection functionality
  function drawTopIntersection(givenAngle) {
    const g = document.getElementById("topIntersection");
    g.innerHTML = "";
    const intersection = getIntersectionPoint(TOP_LINE_Y, currentRotationDeg);
    const cx = intersection.x;
    const cy = intersection.y;
    const r = 30;
    g.appendChild(drawAngleCircle(cx, cy, r));
    // PINK GIVEN ARC
    g.appendChild(drawPinkArc(cx, cy, r, 180, givenAngle));    
    ["A", "B", "C", "D"].forEach(letter => {
      if (letter === randomKey) {
        g.appendChild(drawText(cx + TOP_TXT_OFFSET[letter].x,
          cy + TOP_TXT_OFFSET[letter].y,
          correctAngles[letter]));
      } else {
        g.appendChild(drawInputBox(cx + TOP_OFFSET[letter].x,
          cy + TOP_OFFSET[letter].y,
          letter));
      }
    });
  }

  // Bottom intersection functionality
  function drawBottomIntersection(givenAngle) {
    const g = document.getElementById("bottomIntersection");
    g.innerHTML = "";
    const intersection = getIntersectionPoint(BOTTOM_LINE_Y, currentRotationDeg);
    const cx = intersection.x;
    const cy = intersection.y;
    const r = 30;
    g.appendChild(drawAngleCircle(cx, cy, r));
    ["E","F","G","H"].forEach(letter => {
      if (letter === randomKey) {
        g.appendChild(drawText(cx + BOTTOM_TXT_OFFSET[letter].x,
          cy + BOTTOM_TXT_OFFSET[letter].y,
          correctAngles[letter]));
      } else {
        g.appendChild(drawInputBox(cx + BOTTOM_OFFSET[letter].x,
          cy + BOTTOM_OFFSET[letter].y,
          letter));
      }
    });
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
        resetAngles();
      }
    } else {
      showPopup("info", { text: "Sorry! Try again." });
    }
  }
  resetAngles();
})();