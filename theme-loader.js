/* =====================================================
   COERICIUSFLIX — THEME LOADER
   Loads external + internal JS in sequence
===================================================== */

(function () {

    const scripts = [
        "https://cdn.jsdelivr.net/gh/ranaldsgift/KefinTweaks@latest/kefinTweaks-plugin.js",
        "https://raw.githubusercontent.com/L4nceC/coericiusflix/main/js/badges.js",
        "https://raw.githubusercontent.com/L4nceC/coericiusflix/main/js/mobileTap.js"
    ];

    function loadScript(index = 0) {

        if (index >= scripts.length) {
            console.log("[CoericiusFlix] All scripts loaded.");
            return;
        }

        const script = document.createElement("script");
        script.src = scripts[index];
        script.async = false;

        script.onload = function () {
            console.log(`[CoericiusFlix] Loaded: ${scripts[index]}`);
            loadScript(index + 1);
        };

        script.onerror = function () {
            console.error(`[CoericiusFlix] Failed to load: ${scripts[index]}`);
        };

        document.head.appendChild(script);
    }

    loadScript();

})();
