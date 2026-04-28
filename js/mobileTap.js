/* =====================================================
   COERICIUSFLIX — SMART MOBILE TAP BEHAVIOUR v5
   Loader / SPA Safe
===================================================== */

(function () {

    let tapInterval = null;

    function attachSmartMobileTap() {

        if (!document.body) return;

        if (!document.body.classList.contains("mode-mobile")) return;

        document.querySelectorAll(".card").forEach(card => {

            if (card.dataset.smartTapBound) return;
            card.dataset.smartTapBound = "true";

            card.addEventListener("click", function (e) {

                const type =
                    card.dataset.type ||
                    card.getAttribute("data-type") ||
                    "";

                const instantPlayTypes = ["Movie", "Episode"];

                if (!instantPlayTypes.includes(type)) return;

                const playBtn = card.querySelector(".cardOverlayFab-primary");

                if (!playBtn) return;

                /* Allow direct overlay click normally */
                if (e.target.closest(".cardOverlayFab-primary")) return;

                e.preventDefault();
                e.stopPropagation();

                playBtn.click();
            });
        });
    }

    function init() {

        attachSmartMobileTap();

        if (!tapInterval) {
            tapInterval = setInterval(attachSmartMobileTap, 1500);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();
