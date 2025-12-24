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
  const pointer = document.querySelector(".wheel-pointer")
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
  const ALL_IMAGES = ["img1.svg","img2.svg","img3.svg","img4.svg","img5.svg","img6.svg","img7.svg"];
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
      const rotate = index * sliceAngle;
      const skew = 90 - sliceAngle;
      slice.style.transform = `rotate(${rotate}deg) skewY(${skew}deg)`;
      const image = document.createElement("img");
      image.src = `assets/images/warmupscreen/${img}`;
      image.style.transform = `skewY(${-skew}deg) rotate(${sliceAngle / 2}deg)`;
      slice.appendChild(image);
      wheel.appendChild(slice);
    });
  }

  const MAIN_SPIN_TURNS = 9;
  const OVERSHOOT_DEG = 15;     // how much extra it goes
  const SETTLE_DEG = 10;        // how much it comes back
  function spinWheel() {
    const wheel = document.getElementById("wheel");
    const sliceCount = wheelImages.length;
    if (sliceCount === 0) return;
    const sliceAngle = 360 / sliceCount;
    const randomIndex = Math.floor(Math.random() * sliceCount);
    // FINAL correct stop angle (center of slice under pointer)
    const finalStop = 360 - randomIndex * sliceAngle - sliceAngle / 2;
    // PHASE 1: big spin + overshoot
    const overshootTarget = currentRotation + 360 * MAIN_SPIN_TURNS + finalStop + OVERSHOOT_DEG;
    wheel.style.transition = "transform 2.8s cubic-bezier(0.15, 0.85, 0.25, 1)";
    wheel.style.transform = `rotate(${overshootTarget}deg)`;
    // PHASE 2: small reverse settle
    setTimeout(() => {
      const settleTarget = overshootTarget - SETTLE_DEG;
      wheel.style.transition = "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
      wheel.style.transform = `rotate(${settleTarget}deg)`;
      pointer.classList.add("pointer-bounce");
      setTimeout(() => pointer.classList.remove("pointer-bounce"), 400);
      currentRotation = settleTarget;
      // FINAL slice detection
      setTimeout(() => {
        const normalized = (360 - (currentRotation % 360) + 360) % 360;
        const finalIndex = Math.floor(normalized / sliceAngle);
        const selectedImage = wheelImages[finalIndex];
        console.log("FINAL STOP:", selectedImage);
        wheelImages.splice(finalIndex, 1);
        renderWheel();
      }, 6000);
    }, 2800);
  }

})();