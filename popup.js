import { getCurrentTab } from "./utils.js";

document.addEventListener('DOMContentLoaded', async () => {
    const currentTab = await getCurrentTab();
    const url = currentTab?.url || "";

    // default message
    const con = document.querySelector('.container');

    if (url.includes("youtube.com/watch")) {
        const queryParameters = url.split('?')[1];
        const urlParameters = new URLSearchParams(queryParameters || "");
        const currentVideo = urlParameters.get('v');

        if (currentVideo) {
            chrome.storage.sync.get([currentVideo], (data) => {
                const CVBM = data[currentVideo]
                    ? JSON.parse(data[currentVideo])
                    : [];
                console.log("Loaded bookmarks:", CVBM);
            });
            return; // ✅ exit here if it’s a valid YT video
        }
    }

    // if we got here → not a YouTube video page
    con.innerHTML = "<h1 class='title'>This Is Not a Youtube Video Page.</h1>";
});
