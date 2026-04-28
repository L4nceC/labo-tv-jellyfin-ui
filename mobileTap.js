/* =====================================================
   COERICIUSFLIX — SMART MOBILE TAP BEHAVIOUR v4
===================================================== */

(function () {

    function attachSmartMobileTap() {

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

                if (e.target.closest(".cardOverlayFab-primary")) return;

                e.preventDefault();
                e.stopPropagation();

                playBtn.click();
            });
        });
    }

    setInterval(attachSmartMobileTap, 1500);

})();