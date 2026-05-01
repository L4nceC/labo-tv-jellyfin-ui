/* =====================================================
   COERICIUSFLIX THEME LOADER
===================================================== */

(function () {

    const scripts = [
        "https://l4ncec.github.io/coericiusflix/js/badges.js",
        "https://l4ncec.github.io/coericiusflix/js/mobileTap.js",
        "https://l4ncec.github.io/coericiusflix/js/device.js"
        "https://l4ncec.github.io/coericiusflix/js/customdetails.js"
    ];

    scripts.forEach(src => {
        const script = document.createElement("script");
        script.src = src;
        script.defer = true;
        document.head.appendChild(script);
    });

})();
