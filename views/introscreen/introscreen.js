(function initIntroScreen() {
  SoundManager.playSceneBg("introduction");
  setCommonUI({
    btnHome: true,
    btnPlay: true,
    btnBook: true,
    musicBtn: true,
    copyright: true
  });
  const soundBtn = document.getElementById("soundBtn");
  const skipBtn = document.getElementById("skipBtn");
  soundBtn.addEventListener("click", () => {
    SoundManager.play("click");
    const muted = SoundManager.toggleVoiceMute();
    if (muted) {
      soundBtn.src = "assets/images/common/audio-off.svg";
      soundBtn.setAttribute("title", "Unmute");
    } else {
      SoundManager.playSceneBg("introduction");
      soundBtn.src = "assets/images/common/sound-btn.svg";
      soundBtn.setAttribute("title", "Mute");
    }
  });
  
  if (skipBtn) {
    skipBtn.addEventListener("click", () => {
      SoundManager.play("click");
      SoundManager.stopAll()
      loadView("menu");
      setTimeout(() => {
        if (!SoundManager.isBgmMuted()) {
          SoundManager.playBgm("bgm");
        }
      }, 500);
    });
  }
})();
