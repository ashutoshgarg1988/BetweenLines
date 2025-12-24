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

  function spinWheel() {
    const wheel = document.getElementById("wheel");
    const sliceCount = wheelImages.length;
    if (sliceCount === 0) return;
    const sliceAngle = 360 / sliceCount;
    const randomIndex = Math.floor(Math.random() * sliceCount);
    const stopAngle = 360 * 5 + (sliceCount - randomIndex) * sliceAngle - sliceAngle / 2;
    currentRotation += stopAngle;
    wheel.style.transform = `rotate(${currentRotation}deg)`;
    setTimeout(() => {
      const selectedImage = wheelImages[randomIndex];
      console.log("Selected:", selectedImage);
      // REMOVE SELECTED SLICE
      wheelImages.splice(randomIndex, 1);
      renderWheel();
    }, 3000);
  }
})();