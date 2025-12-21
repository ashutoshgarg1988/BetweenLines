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
    btnBook: false,
    musicBtn: true,
    copyright: true
  });

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
  
})();