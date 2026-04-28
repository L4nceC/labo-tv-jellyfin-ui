/* =====================================================
   COERICIUSFLIX — BADGE SYSTEM (FINAL BUILD v5)
===================================================== */

(function () {

    const ADDED_DAYS = 3;
    const NEW_YEARS = 0;
    const NEW_SEASON_DAYS = 21;

    const ITEM_CACHE = {};
    const SEASON_CACHE = {};

    function getApiUrl() {
        return window.ApiClient?._serverAddress || "";
    }

    function getUserId() {
        return window.ApiClient?._serverInfo?.UserId;
    }

    async function fetchItem(itemId) {
        if (ITEM_CACHE[itemId]) return ITEM_CACHE[itemId];

        try {
            const res = await fetch(
                `${getApiUrl()}/Users/${getUserId()}/Items/${itemId}`,
                {
                    headers: {
                        "X-Emby-Token": ApiClient.accessToken()
                    }
                }
            );

            const data = await res.json();
            ITEM_CACHE[itemId] = data;
            return data;

        } catch {
            return null;
        }
    }

    function isRecentlyAdded(dateStr, days) {
        if (!dateStr) return false;

        const d = new Date(dateStr);
        if (isNaN(d)) return false;

        const diff = (new Date() - d) / 86400000;
        return diff <= days;
    }

    function isNewRelease(item) {
        const year =
            item.ProductionYear ||
            (item.PremiereDate ? new Date(item.PremiereDate).getFullYear() : null);

        if (!year) return false;

        return (new Date().getFullYear() - year) <= NEW_YEARS;
    }

    function isSeriesLike(item) {
        return (
            item.Type === "Series" ||
            item.Type === "BoxSet" ||
            item.Type === "Folder" ||
            item.CollectionType === "tvshows"
        );
    }

    async function hasNewSeason(item) {

        const seriesId = item.Id;

        if (SEASON_CACHE[seriesId] !== undefined) {
            return SEASON_CACHE[seriesId];
        }

        try {

            if (item.Status !== "Continuing") {
                SEASON_CACHE[seriesId] = false;
                return false;
            }

            const seasonRes = await fetch(
                `${getApiUrl()}/Users/${getUserId()}/Items?ParentId=${seriesId}&IncludeItemTypes=Season&Recursive=false`,
                {
                    headers: {
                        "X-Emby-Token": ApiClient.accessToken()
                    }
                }
            );

            const seasonData = await seasonRes.json();

            const seasons = (seasonData.Items || []).filter(
                s => s.IndexNumber !== 0
            );

            if (seasons.length < 2) {
                SEASON_CACHE[seriesId] = false;
                return false;
            }

            const epRes = await fetch(
                `${getApiUrl()}/Users/${getUserId()}/Items?ParentId=${seriesId}&IncludeItemTypes=Episode&Recursive=true&Limit=20&SortBy=DateCreated&SortOrder=Descending`,
                {
                    headers: {
                        "X-Emby-Token": ApiClient.accessToken()
                    }
                }
            );

            const epData = await epRes.json();
            const episodes = epData.Items || [];

            const hasRecentEpisode = episodes.some(ep =>
                isRecentlyAdded(ep.DateCreated, NEW_SEASON_DAYS)
            );

            SEASON_CACHE[seriesId] = hasRecentEpisode;
            return hasRecentEpisode;

        } catch {
            SEASON_CACHE[seriesId] = false;
            return false;
        }
    }

    function getBadgeLabel(badge, item) {
        if (badge === "new") {
            if (item.Type === "Movie") return "NEW MOVIE";
            if (item.Type === "Series") return "NEW SERIES";
            return "NEW";
        }

        if (badge === "added") return "RECENTLY ADDED";
        if (badge === "new-season") return "NEW SEASON";

        return "";
    }

    async function processCards() {
        const cards = document.querySelectorAll(".card");

        for (const card of cards) {
            const itemId = card.getAttribute("data-id");
            if (!itemId) continue;

            const item = await fetchItem(itemId);
            if (!item) continue;

            let badge = null;

            if (isSeriesLike(item)) {
                const seasonCheck = await hasNewSeason(item);

                if (seasonCheck && !isNewRelease(item)) {
                    badge = "new-season";
                }
            }

            if (!badge && isNewRelease(item)) {
                badge = "new";
            }

            if (!badge && isRecentlyAdded(item.DateCreated, ADDED_DAYS)) {
                badge = "added";
            }

            if (badge) {
                card.setAttribute("data-badge", badge);
                card.setAttribute("data-badge-label", getBadgeLabel(badge, item));
            } else {
                card.removeAttribute("data-badge");
                card.removeAttribute("data-badge-label");
            }
        }
    }

    setInterval(processCards, 3000);

})();
