/***************************************************************
 *  Author      : MentorNest Animation
 *  Email       : info@mentornest.com
 *  File        : discovermenu.js.js
 *  Description : Handeler for Discover Menu screen
 *  Date        : 10-Dec-2025
 ***************************************************************/

(function initDiscoverMenu() {
  SoundManager.playSceneBg("simulation");
  setCommonUI({
    btnHome: true,
    btnPlay: false,
    btnBook: false,
    musicBtn: true,
    copyright: true
  });
  SoundManager.muteVoice();
  const soundBtn = document.getElementById("soundBtn");
  soundBtn.addEventListener("click", () => {
    SoundManager.play("click");
    const muted = SoundManager.toggleVoiceMute();
    if (muted) {
      soundBtn.src = "assets/images/common/audio-off.svg";
      soundBtn.setAttribute("title", "Unmute");
    } else {
      SoundManager.playSceneBg("simulation");
      soundBtn.src = "assets/images/common/sound-btn.svg";
      soundBtn.setAttribute("title", "Mute");
    }
  });

  // Card Click Events
  document.getElementById("easyCard").addEventListener("click", () => {
    SoundManager.play("click");
    loadView("easyscreen");
  });

  document.getElementById("warmUpCard").addEventListener("click", () => {
    SoundManager.play("click");
    loadView('warmupscreen');
  });

  document.getElementById("challengeCard").addEventListener("click", () => {
    SoundManager.play("click");
    loadView('challengescreen');
  });

  const tooltips = document.querySelectorAll(".tooltip-wrapper");
  tooltips.forEach(wrapper => {
    const openIcon = wrapper.querySelector(".tooltip-icon");
    const closeIcon = wrapper.querySelector(".tooltip-close");
    const soundIcon = wrapper.querySelector(".tooltip-sound");
    const openSound = wrapper.dataset.openSound;
    const closeSound = wrapper.dataset.closeSound;
    openIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      tooltips.forEach(t => {
        if (t !== wrapper) t.classList.remove("active");
      });
      const willOpen = !wrapper.classList.contains("active");
      wrapper.classList.toggle("active");
      if (willOpen && openSound) {
        SoundManager.muteVoice();
        SoundManager.play(openSound);
      }
    });
    closeIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      wrapper.classList.remove("active");
      if (closeSound) {
        SoundManager.play(closeSound);
      }
    });
    soundIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      const muted = SoundManager.toggleVoiceMute();
      if (muted) {
        soundIcon.src = "assets/images/common/audio-off.svg";
        soundIcon.setAttribute("title", "Unmute");
      } else {
        SoundManager.playSceneBg(openSound);
        soundIcon.src = "assets/images/common/sound-btn.svg";
        soundIcon.setAttribute("title", "Mute");
      }
    });
  });
})();