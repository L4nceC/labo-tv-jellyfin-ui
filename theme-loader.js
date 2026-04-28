/* =====================================================
   COERICIUSFLIX THEME LOADER
===================================================== */

const scripts = [
    "https://raw.githubusercontent.com/L4nceC/coericiusflix/main/js/badges.js",
    "https://raw.githubusercontent.com/L4nceC/coericiusflix/main/js/mobileTap.js",
    "https://raw.githubusercontent.com/L4nceC/coericiusflix/main/js/device.js"
];

scripts.forEach(src => {
    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    document.head.appendChild(script);
});