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
  const soundBtn = document.getElementById("soundBtn");
  document.querySelector(".spin-center").addEventListener("click", spinWheel);
  const spinWheelArea = document.getElementById("spinWheelArea");
  const userSelectionArea = document.getElementById("userSelectionArea");
  const pointer = document.querySelector(".wheel-pointer")
  const selectedImg = document.getElementById("selectedImg");
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
    if (correctCounter < 3) return;
    SoundManager.play("click");
    if(level === 0) {
      level++;
      handleLevelChanges();
    }else {
      loadView("challengescreen");
    }
  });

  // CLEAR BUTTON
  document.querySelector(".clear-btn")?.addEventListener("click", () => {
    workspace.innerHTML = "";
    group = null;
  });

  document.getElementById("warmupResetBtn").addEventListener("click", () => {
    SoundManager.play("click");
  });

  /* Wheel functionality */
  const MAIN_SPIN_TURNS = 9;
  const OVERSHOOT_DEG = 0;//15;
  const rotatePonterBased = -155;
  const ALL_IMAGES = ["img0.svg","img1.svg","img2.svg","img3.svg","img4.svg","img5.svg","img6.svg"];
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
    const sliceAngle = 360 / sliceCount;
    wheelImages.forEach((img, index) => {
      const slice = document.createElement("div");
      slice.className = "slice";
      const skew = 90 - sliceAngle;
      const rotate = index * sliceAngle;
      slice.style.transform = `rotate(${rotate}deg) skewY(${skew}deg)`;
      const image = document.createElement("img");
      image.src = `assets/images/warmupscreen/${img}`;
      image.style.transform = `skewY(${-skew}deg) rotate(${sliceAngle / 2}deg)`;
      slice.appendChild(image);
      wheel.appendChild(slice);
    });
    // Instant base rotation (no animation)
    wheel.style.transition = "none";
    wheel.style.transform = `rotate(${rotatePonterBased}deg)`;
    wheel.offsetHeight;
    wheel.style.transition = "";
  }

  function spinWheel() {
    const wheel = document.getElementById("wheel");
    const sliceCount = wheelImages.length;
    if (sliceCount === 0) return;
    const sliceAngle = 360 / sliceCount;
    const randomIndex = Math.floor(Math.random() * sliceCount);
    console.log("randomIndex:::", randomIndex);
    console.log("selectedImg::::", wheelImages[randomIndex]);
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

  document.getElementById("parallelBtn").addEventListener("click", () => {
    showHideSpinPlayArea(true);
  });

  document.getElementById("perpendicularBtn").addEventListener("click", () => {
    showHideSpinPlayArea(true);
  });
})();