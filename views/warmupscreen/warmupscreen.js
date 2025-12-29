/***************************************************************
 *  Author      : MentorNest Animation
 *  Email       : info@mentornest.com
 *  File        : warmupscreen.js
 *  Description : Handeler and functionality for warm up screen
 *  Date        : 12-Dec-2025
 ***************************************************************/

(function initWarmupScreen() {
  setCommonUI({
    btnHome: true,
    btnPlay: true,
    btnBook: true,
    musicBtn: true,
    copyright: true
  });
  SoundManager.playSceneBg("warmUp");
  const soundBtn = document.getElementById("soundBtn");
  document.querySelector(".spin-center").addEventListener("click", spinWheel);
  const spinWheelArea = document.getElementById("spinWheelArea");
  const userSelectionArea = document.getElementById("userSelectionArea");
  const pointer = document.querySelector(".wheel-pointer")
  const selectedImg = document.getElementById("selectedImg");
  let selectedImgName = '';
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

  warmupNextBtn.addEventListener("click", () => {
    loadView("challengescreen");
  });

  // CLEAR BUTTON
  document.querySelector(".clear-btn")?.addEventListener("click", () => {
    workspace.innerHTML = "";
    group = null;
  });

  document.getElementById("warmupResetBtn").addEventListener("click", () => {
    SoundManager.play("click");
    wheelImages = pickRandomImages(7);
    renderWheel();
    showHideSpinPlayArea(true);
  });

  /* Wheel functionality */
  const MAIN_SPIN_TURNS = 9;
  const OVERSHOOT_DEG = 0;//15;
  const rotatePonterBased = -155;
  const ALL_IMAGES = ["img0.svg","img1.svg","img2.svg","img3.svg","img4.svg","img5.svg","img6.svg"];
  const parallelImgArr = ['img1.svg', 'img2.svg', 'img5.svg', 'img6.svg'];
  let wheelImages = [];
  let currentRotation = 0;

  function pickRandomImages(count) {
    const shuffled = [...ALL_IMAGES].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }
  wheelImages = pickRandomImages(7);
  renderWheel();

  function renderWheel() {
    const wheel = document.getElementById("wheel");
    wheel.innerHTML = "";
    const sliceCount = wheelImages.length;
    // SPECIAL CASE FOR 2
    if (sliceCount === 2) {
      wheelImages.forEach((img, index) => {
        const slice = document.createElement("div");
        slice.className = "slice half";
        slice.style.transform = `rotate(${index * 180}deg)`;
        const image = document.createElement("img");
        image.src = `assets/images/warmupscreen/${img}`;
        image.style.transform = "rotate(90deg)";
        slice.appendChild(image);
        wheel.appendChild(slice);
      });
      return;
    }
    // NORMAL FLOW (3+ slices)
    const sliceAngle = 360 / sliceCount;
    const skew = 90 - sliceAngle;
    wheelImages.forEach((img, index) => {
      const slice = document.createElement("div");
      slice.className = "slice";
      slice.style.transform = `rotate(${index * sliceAngle}deg) skewY(${skew}deg)`;
      const image = document.createElement("img");
      image.src = `assets/images/warmupscreen/${img}`;
      image.style.transform = `skewY(${-skew}deg) rotate(${sliceAngle / 2}deg)`;
      slice.appendChild(image);
      wheel.appendChild(slice);
    });
  }


  function spinWheel() {
    SoundManager.play("click");
    const wheel = document.getElementById("wheel");
    const sliceCount = wheelImages.length;
    if (sliceCount === 0) return;
    const sliceAngle = 360 / sliceCount;
    const randomIndex = Math.floor(Math.random() * sliceCount);
    // Final desired angle for this slice
    const finalStop = 360 - randomIndex * sliceAngle + rotatePonterBased;
    // Normalize current rotation (0–360)
    const normalizedCurrent = ((currentRotation % 360) + 360) % 360;
    // Find forward-only delta to target
    const delta = (finalStop - normalizedCurrent + 360) % 360;
    const overshootTarget = currentRotation + 360 * MAIN_SPIN_TURNS + delta + OVERSHOOT_DEG;
    wheel.style.transition = "transform 2.8s cubic-bezier(0.15, 0.85, 0.25, 1)";
    wheel.style.transform = `rotate(${overshootTarget}deg)`;
    setTimeout(() => {
      const settleTarget = overshootTarget - OVERSHOOT_DEG;
      wheel.style.transition = "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
      wheel.style.transform = `rotate(${settleTarget}deg)`;
      pointer.classList.add("pointer-bounce");
      setTimeout(() => pointer.classList.remove("pointer-bounce"), 400);
      currentRotation = settleTarget;
    }, 2800);
    // FINAL slice detection 
    setTimeout(() => {
      selectedImg.src = `assets/images/warmupscreen/${wheelImages[randomIndex]}`;
      selectedImgName = wheelImages[randomIndex];
      showHideSpinPlayArea(false);
      wheelImages.splice(randomIndex, 1);
      renderWheel();
    }, 3000);
  }

  function showHideSpinPlayArea(isVisible) {
    if(isVisible) {
      spinWheelArea.style.opacity = 1;
      userSelectionArea.style.opacity = 0;
    } else {
      spinWheelArea.style.opacity = 0;
      userSelectionArea.style.opacity = 1;
    }
  }

  function updateAfterClick() {
    if(wheelImages.length === 0) {
      showPopup("greatWork", { step: 1, description: "" });
    } else if(wheelImages.length === 1) {
      selectedImg.src = `assets/images/warmupscreen/${wheelImages[0]}`;
      selectedImgName = wheelImages[0];
      wheelImages.splice(0, 1);
    } else {
      showHideSpinPlayArea(true);
    }
  }

  function resetSelectionButtons() {
    document.querySelectorAll(".big-btn").forEach(btn => {
      btn.classList.remove("selected", "wrong");
      btn.style.pointerEvents = "auto";
    });
  }

  function showCorrect(btn) {
    btn.classList.add("selected");
  }

  function showWrong(btn) {
    btn.classList.add("wrong");
  }

  const parallelBtn = document.getElementById("parallelBtn");
  const perpendicularBtn = document.getElementById("perpendicularBtn");

  parallelBtn.addEventListener("click", () => {
    SoundManager.play("click");
    const isCorrect = parallelImgArr.includes(selectedImgName);
    if (isCorrect) {
      showCorrect(parallelBtn);
    } else {
      showWrong(parallelBtn);
    }
    setTimeout(() => {
      resetSelectionButtons();
      updateAfterClick();
    }, 2000);
  });

  perpendicularBtn.addEventListener("click", () => {
    SoundManager.play("click");
    const isCorrect = !parallelImgArr.includes(selectedImgName); 
    if (isCorrect) {
      showCorrect(perpendicularBtn);
    } else {
      showWrong(perpendicularBtn);
    }
    setTimeout(() => {
      resetSelectionButtons();
      updateAfterClick();
    }, 2000);
  });
})();