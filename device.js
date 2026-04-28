/* =====================================================
   DEVICE ENGINE (FINAL CLEAN)
===================================================== */

(function () {

    function detectDevice() {

        const ua = navigator.userAgent.toLowerCase();

        if (ua.includes("webos") || ua.includes("tizen") || ua.includes("smarttv")) {
            return "tv";
        }

        if (window.innerWidth <= 768) {
            return "mobile";
        }

        return "desktop";
    }

    function applyMode() {

        const mode = detectDevice();

        document.body.classList.remove("mode-tv", "mode-mobile", "mode-desktop");
        document.body.classList.add("mode-" + mode);

        console.log("MODE:", mode);
    }

    applyMode();
    setTimeout(applyMode, 1000); // LG fix
    window.addEventListener("resize", applyMode);

})();