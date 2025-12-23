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

    // Show info popup when screen loads
    // function showInfoPopup() {
    //     showPopup("info", { text: "Pick your favorite object - a cake, pizza, pie, or chocolate bar! Drag the knife or clock hand to make a slice or an angle." });
    // }
    // showInfoPopup();

    // Reset button click
    document.getElementById("doitResetBtn").addEventListener("click", () => {
        rotateBlueLineRandomly();
    });

    // Next button click
    document.getElementById("doitNextBtn").addEventListener("click", () => {
        loadView("menu");
    });

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
            lineType = r.id;
        });
    });

    const pencilBtn = document.getElementById("pencilBtn");
    const deleteBtn = document.getElementById("deleteBtn");
    const svg = document.getElementById("drawSvg");
    const userLine = document.getElementById("userLine");
    const gridBoard = document.getElementById("gridBoard");
    let drawingEnabled = false;
    let isDrawing = false;
    let start = { x: 0, y: 0 };
    let blueLineAngle = 41.12;
    rotateBlueLineRandomly();

    function rotateBlueLineRandomly() {
        blueLineAngle = Math.random() * 180; // 0–180 is enough
        lineImg.style.transform = `rotate(${blueLineAngle}deg)`;
    }

    pencilBtn.addEventListener("click", () => {
        drawingEnabled = true;
    });

    deleteBtn.addEventListener("click", () => {
        userLine.setAttribute("visibility", "hidden");
        drawingEnabled = false;
    });


    function getScaledPoint(e, element) {
        const rect = element.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) / CURRENT_SCALE,
            y: (e.clientY - rect.top) / CURRENT_SCALE
        };
    }

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