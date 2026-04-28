/* =====================================================
   DEVICE ENGINE (FINAL CLEAN v2)
   Loader / SPA Safe
===================================================== */

(function () {

    function detectDevice() {
        const ua = navigator.userAgent.toLowerCase();

        if (
            ua.includes("webos") ||
            ua.includes("tizen") ||
            ua.includes("smarttv")
        ) {
            return "tv";
        }

        if (window.innerWidth <= 768) {
            return "mobile";
        }

        return "desktop";
    }

    function applyMode() {

        if (!document.body) return;

        const mode = detectDevice();

        document.body.classList.remove(
            "mode-tv",
            "mode-mobile",
            "mode-desktop"
        );

        document.body.classList.add("mode-" + mode);

        console.log("[CoericiusFlix] MODE:", mode);
    }

    function init() {
        applyMode();

        setTimeout(applyMode, 1000); // LG / delayed UI render fix
        window.addEventListener("resize", applyMode);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();
