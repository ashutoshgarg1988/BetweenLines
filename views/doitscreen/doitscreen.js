/***************************************************************
 *  Author      : MentorNest Animation
 *  Email       : info@mentornest.com
 *  File        : doitscreen.js.js
 *  Description : Handeler and functionality for Do it yourself screen
 *  Date        : 4-Dec-2025
 ***************************************************************/

(function initDoitScreen() {
    setCommonUI({
        btnHome: true,
        btnPlay: true,
        btnBook: true,
        musicBtn: true,
        copyright: true
    });
    const centerPanel = document.getElementById('gridBoard');
    centerPanel.style.backgroundImage = "url('assets/images/easyscreen/mathsline.svg')";

    // Show info popup when screen loads
    // function showInfoPopup() {
    //     showPopup("info", { text: "Pick your favorite object - a cake, pizza, pie, or chocolate bar! Drag the knife or clock hand to make a slice or an angle." });
    // }
    // showInfoPopup();


    // Reset button click
    document.getElementById("resetBtn").addEventListener("click", () => {

    });

    const paperStyleCheckboxes = document.querySelectorAll('.paper-style input[type="checkbox"]');
    paperStyleCheckboxes.forEach(cb => {
        cb.addEventListener("change", function () {
            paperStyleCheckboxes.forEach(other => {
                if (other !== this) other.checked = false;
            });
            if (![...paperStyleCheckboxes].some(c => c.checked)) {
                this.checked = true;
            }
            if (this.value === "grid") {
                centerPanel.style.backgroundImage = "url('assets/images/easyscreen/mathsline.svg')";
            } else if (this.value === "dots") {
                centerPanel.style.backgroundImage = "url('assets/images/easyscreen/dotted.svg')";
            }
        });
    });

})();