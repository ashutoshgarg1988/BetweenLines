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
    let lineType = ''; //perpendicular or parallel
    const centerPanel = document.getElementById('gridBoard');
    centerPanel.style.backgroundImage = "url('assets/images/easyscreen/mathsline.svg')";
    const disclaimerBox = document.querySelector(".disclaimer-box");
    let disclaimerVisible = false;
    let disclaimerTimeout = null;

    const pencilBtn = document.getElementById("pencilBtn");
    const deleteBtn = document.getElementById("deleteBtn");
    const svg = document.getElementById("drawSvg");
    const userLine = document.getElementById("userLine");
    const gridBoard = document.getElementById("gridBoard");
    const soundBtn = document.getElementById("soundBtn");
    let drawingEnabled = false;
    let isDrawing = false;
    let start = { x: 0, y: 0 };
    let blueLineAngle = 41.12;
    const PENCIL_OFFSET = { x: 0, y: -27 };
    
    // Show info popup when screen loads
    // function showInfoPopup() {
    //     showPopup("info", { text: "Pick your favorite object - a cake, pizza, pie, or chocolate bar! Drag the knife or clock hand to make a slice or an angle." });
    // }
    // showInfoPopup();
    SoundManager.muteVoice();
    // Sound button functionality
    soundBtn.addEventListener("click", () => {
        SoundManager.play("click");
        const muted = SoundManager.toggleVoiceMute();
        if (muted) {
            soundBtn.src = "assets/images/common/audio-off.svg";
            soundBtn.setAttribute("title", "Unmute");
        } else {
            SoundManager.playSceneBg("doItYouself");
            soundBtn.src = "assets/images/common/sound-btn.svg";
            soundBtn.setAttribute("title", "Mute");
        }
    });

    function resetLine() {
        userLine.setAttribute("visibility", "hidden");
        drawingEnabled = false;
    }

    // Reset button click
    document.getElementById("doitResetBtn").addEventListener("click", () => {
        rotateBlueLineRandomly();
        resetLine();
    });

    // Next button click
    document.getElementById("doitNextBtn").addEventListener("click", () => {
        loadView("menu");
    });

    // Info button click
    document.getElementById("doitInfoBtn").addEventListener("click", () => {
        showDisclaimer();
    });

    function showDisclaimer() {
        if (disclaimerVisible) return;
        disclaimerVisible = true;
        disclaimerBox.classList.add("show");
        // Auto hide after 5 seconds
        disclaimerTimeout = setTimeout(() => {
            disclaimerBox.classList.remove("show");
            disclaimerVisible = false;
        }, 5000);
    }

    // Change the type of Paper
    document.querySelectorAll('input[name="paperType"]').forEach(r => {
        r.addEventListener('change', () => {
            if(r.id === "grid") {
                centerPanel.style.backgroundImage = "url('assets/images/easyscreen/mathsline.svg')";
            }else {
                centerPanel.style.backgroundImage = "url('assets/images/easyscreen/dotted.svg')";
            }
        });
    });

    // Change the type of lines
    document.querySelectorAll('input[name="lineType"]').forEach(r => {
        r.addEventListener('change', () => {
            userLine.setAttribute("visibility", "hidden");
            lineType = r.id;
        });
    });

    
    rotateBlueLineRandomly();
    function rotateBlueLineRandomly() {
        const gridRect = gridBoard.getBoundingClientRect();
        const angleDeg = Math.random() * 180;
        blueLineAngle = angleDeg;
        const θ = angleDeg * Math.PI / 180;
        const W = gridRect.width;
        const H = gridRect.height;
        const cos = Math.abs(Math.cos(θ));
        const sin = Math.abs(Math.sin(θ));
        // Real rendered height of the SVG (arrow thickness)
        const h = lineImg.getBoundingClientRect().height;
        const maxLenByWidth = cos < 0.0001 ? Infinity : (W - h * sin) / cos;
        const maxLenByHeight = sin < 0.0001 ? Infinity : (H - h * cos) / sin;
        let maxLength = Math.min(maxLenByWidth, maxLenByHeight);
        // maxLength *= 0.95;
        if(angleDeg >= 96 && angleDeg <= 166) {
            maxLength = 490;
        }else {
            maxLength = 600;
        }
        lineImg.style.width = `${maxLength}px`;
        lineImg.style.transform = `translate(-50%, -50%) rotate(${angleDeg}deg)`;
    }

    pencilBtn.addEventListener("click", () => {
        drawingEnabled = true;
        gridBoard.classList.add("pencil-cursor");
        svg.classList.add("pencil-cursor");
    });

    deleteBtn.addEventListener("click", () => {
        resetLine();
        drawingEnabled = false;
        gridBoard.classList.remove("pencil-cursor");
        svg.classList.remove("pencil-cursor");
    });


    // function getScaledPoint(e, element) {
    //     const rect = element.getBoundingClientRect();
    //     return {
    //         x: (e.clientX - rect.left) / CURRENT_SCALE,
    //         y: (e.clientY - rect.top) / CURRENT_SCALE
    //     };
    // }

    function getScaledPoint(e, element) {
        const rect = element.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left - PENCIL_OFFSET.x) / CURRENT_SCALE,
            y: (e.clientY - rect.top - PENCIL_OFFSET.y) / CURRENT_SCALE
        };
    }
    window.addEventListener("mouseup", () => {
        isDrawing = false;
    });

    svg.addEventListener("mousedown", (e) => {
        if (!drawingEnabled) return;
        isDrawing = true;
        const p = getScaledPoint(e, svg);
        start = p;
        userLine.setAttribute("x1", p.x);
        userLine.setAttribute("y1", p.y);
        userLine.setAttribute("x2", p.x);
        userLine.setAttribute("y2", p.y);
        userLine.setAttribute("visibility", "visible");
    });

    svg.addEventListener("mousemove", (e) => {
        if (!isDrawing) return;
        const p = getScaledPoint(e, svg);
        userLine.setAttribute("x2", p.x);
        userLine.setAttribute("y2", p.y);
        checkPerpendicular(start, p);
    });


    window.addEventListener("mouseup", () => {
        isDrawing = false;
    });

    // Touch support added
    svg.addEventListener("touchstart", (e) => {
        if (!drawingEnabled) return;
        e.preventDefault();
        isDrawing = true;
        const touch = e.touches[0];
        const p = getScaledPoint(touch, svg);
        start = p;
        userLine.setAttribute("x1", p.x);
        userLine.setAttribute("y1", p.y);
        userLine.setAttribute("x2", p.x);
        userLine.setAttribute("y2", p.y);
        userLine.setAttribute("visibility", "visible");
    });

    svg.addEventListener("touchmove", (e) => {
        if (!isDrawing) return;
        e.preventDefault();
        const touch = e.touches[0];
        const p = getScaledPoint(touch, svg);
        userLine.setAttribute("x2", p.x);
        userLine.setAttribute("y2", p.y);
        checkPerpendicular(start, p);
    });

    window.addEventListener("touchend", () => {
        isDrawing = false;
    });

    function checkPerpendicular(p1, p2) {
        const userAngle = angleBetween(p1, p2);
        const blueLine = document.getElementById("lineImg");
        const blueAngle = getElementRotation(blueLine);
        // console.log("userAngle:::::" + userAngle + "::::::blueAngle:::" + blueAngle);
        const diff = angleDiff(userAngle, blueAngle);
        const TOLERANCE = 1; // degrees (visually perfect)
        if(lineType === 'parallel') {
            if (Math.abs(diff - 42) <= TOLERANCE) {
                userLine.setAttribute("stroke", "#28c840"); // GREEN
            } else {
                userLine.setAttribute("stroke", "#e53935"); // RED
            }
        } else {
            if (Math.abs(diff - 48) <= TOLERANCE) {
                userLine.setAttribute("stroke", "#28c840"); // GREEN
            } else {
                userLine.setAttribute("stroke", "#e53935"); // RED
            }
        }
        
    }
})();