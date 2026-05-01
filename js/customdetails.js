(function () {
    const USER_ID = "cc0b3c10ccdd490b967c4885c09bf0aa";
    const WRAPPER_ID = "cf-api-detail-page";

    let currentItemId = null;
    let renderLock = false;

function isDesktop() {
        return window.innerWidth >= 1000;
    }

    function getServer() {
        return ApiClient._serverInfo?.Address || ApiClient._serverAddress;
    }

    function getToken() {
        return ApiClient.accessToken();
    }

    function getItemId() {
        const match = location.hash.match(/id=([^&]+)/);
        return match ? match[1] : null;
    }

    async function fetchItem(itemId) {
        const res = await fetch(
            `${getServer()}/Users/${USER_ID}/Items/${itemId}?api_key=${getToken()}`
        );
        return await res.json();
    }

    function imageUrl(itemId, type, tag, width = 1200) {
        return `${getServer()}/Items/${itemId}/Images/${type}?maxWidth=${width}&tag=${tag}&api_key=${getToken()}`;
    }

    function removeExisting() {
        document.querySelectorAll(`#${WRAPPER_ID}`).forEach(el => el.remove());
    }

    function runtimeMinutes(ticks) {
        if (!ticks) return "";
        return Math.round(ticks / 600000000) + "m";
    }

    function buildHTML(item) {
    const logo = item.ImageTags?.Logo
        ? imageUrl(item.Id, "Logo", item.ImageTags.Logo, 900)
        : "";

    const backdrop = item.BackdropImageTags?.length
        ? imageUrl(item.Id, "Backdrop", item.BackdropImageTags[0], 1920)
        : "";

    return `
    <div id="${WRAPPER_ID}" class="cf-api-wrapper">
        <div class="cf-backdrop" style="background-image:url('${backdrop}')"></div>

        <div class="cf-inner centered-logo-layout">
            ${
                logo
                    ? `<img src="${logo}" class="cf-logo centered">`
                    : `<h1 class="cf-title centered">${item.Name}</h1>`
            }

            <div class="cf-meta-row">
                <span>${item.ProductionYear || ""}</span>
                <span>${runtimeMinutes(item.RunTimeTicks)}</span>
                <span>⭐ ${item.CommunityRating?.toFixed(1) || "-"}</span>
            </div>

            <div class="cf-actions">
                <button class="cf-play-btn" data-action="play">▶ Play</button>
                <button class="cf-icon-btn" data-action="watchlist"></button>
                <button class="cf-icon-btn" data-action="watched">✓</button>
                <button class="cf-icon-btn" data-action="favorite">♥</button>
                <button class="cf-icon-btn" data-action="more">⋮</button>
            </div>
        </div>

        <div class="cf-info-grid">
            <div class="cf-meta-panel">
                ${item.Taglines?.[0] ? `<div class="cf-tagline">${item.Taglines[0]}</div>` : ""}
                
                ${item.Overview ? `<div class="cf-overview">${item.Overview}</div>` : ""}

                <div class="cf-meta-table">
                    ${item.Genres?.length ? `
                        <div class="cf-row">
                            <span>Genres</span>
                            <span>${item.Genres.join(", ")}</span>
                        </div>` : ""}

                    ${item.People?.filter(p => p.Type === "Director").length ? `
                        <div class="cf-row">
                            <span>Director</span>
                            <span>${item.People.filter(p => p.Type === "Director").map(p => p.Name).join(", ")}</span>
                        </div>` : ""}

                    ${item.People?.filter(p => p.Type === "Writer").length ? `
                        <div class="cf-row">
                            <span>Writer</span>
                            <span>${item.People.filter(p => p.Type === "Writer").map(p => p.Name).join(", ")}</span>
                        </div>` : ""}

                    ${item.Studios?.length ? `
                        <div class="cf-row">
                            <span>Studios</span>
                            <span>${item.Studios.map(s => s.Name).join(", ")}</span>
                        </div>` : ""}
                </div>
            </div>

            <div class="cf-tech-panel">
                <div class="cf-tech-row">
                    <span>Video</span>
                    <span>${item.MediaSources?.[0]?.MediaStreams?.find(s => s.Type === "Video")?.DisplayTitle || "Unknown"}</span>
                </div>

                <div class="cf-tech-row">
                    <span>Audio</span>
                    <span>${item.MediaSources?.[0]?.MediaStreams?.find(s => s.Type === "Audio")?.DisplayTitle || "Unknown"}</span>
                </div>
            </div>
        </div>
    </div>
    `;
}

    function bindButtons(page) {
        const native = {
            play: page.querySelector(".btnPlay, .playButton, .detailButton .play_arrow")?.closest("button, .detailButton"),
            watchlist: page.querySelector(".watchlist-icon")?.closest("button"),
            watched: page.querySelector(".btnPlaystate")?.closest("button"),
            favorite: page.querySelector(".btnUserRating")?.closest("button"),
            more: page.querySelector(".btnMoreCommands")?.closest("button")
        };

        const custom = {
            play: document.querySelector('[data-action="play"]'),
            watchlist: document.querySelector('[data-action="watchlist"]'),
            watched: document.querySelector('[data-action="watched"]'),
            favorite: document.querySelector('[data-action="favorite"]'),
            more: document.querySelector('[data-action="more"]')
        };

        Object.keys(custom).forEach(key => {
            if (!custom[key] || !native[key]) return;

            custom[key].onclick = () => {
                native[key].click();

                setTimeout(syncStates, 200);
            };
        });

        function syncStates() {
            if (native.favorite?.dataset.isfavorite === "true") {
                custom.favorite?.classList.add("active");
            } else {
                custom.favorite?.classList.remove("active");
            }

            if (native.watched?.dataset.played === "true") {
                custom.watched?.classList.add("active");
            } else {
                custom.watched?.classList.remove("active");
            }

            if (native.watchlist?.dataset.active === "true") {
                custom.watchlist?.classList.add("active");
            } else {
                custom.watchlist?.classList.remove("active");
            }
        }

        syncStates();
    }

    async function renderCustomPage() {
        if (renderLock) return;

        const itemId = getItemId();
        if (!itemId) return;

        const page = document.querySelector("#itemDetailPage");
        if (!page) return;

        if (itemId === currentItemId && document.getElementById(WRAPPER_ID)) return;

        renderLock = true;

        try {
            currentItemId = itemId;

            removeExisting();

            const item = await fetchItem(itemId);

            page.insertAdjacentHTML("afterbegin", buildHTML(item));

            bindButtons(page);

        } finally {
            setTimeout(() => {
                renderLock = false;
            }, 300);
        }
    }

    function init() {
        const observer = new MutationObserver(() => {
            if (location.hash.includes("/details")) {
                renderCustomPage();
            } else {
                removeExisting();
                currentItemId = null;
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        window.addEventListener("hashchange", () => {
            currentItemId = null;
            removeExisting();
            setTimeout(renderCustomPage, 150);
        });

        window.addEventListener("load", renderCustomPage);
    }

    init();
})();