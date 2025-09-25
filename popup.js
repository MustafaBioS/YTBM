import { getCurrentTab } from "./utils.js";

const viewBookmarks = (currentBMS=[]) => {
    let bms = document.querySelector('.bmcon');
    bms.innerHTML = "";

    if (currentBMS.length > 0) {
        for (let i = 0; i < currentBMS.length; i++) {
            const bookm = currentBMS[i];
            addNewBookmark(bms, bookm)

        }
    } else {
        bms.innerHTML = "<p class='nobm'>No Bookmarks Available</p>"
    }
}

const addNewBookmark = () => {};

document.addEventListener('DOMContentLoaded', async ()=> {
    const currentTab = await getCurrentTab();
    const queryParameters = currentTab.url.split('?')[1];
    const url = currentTab?.url || "";
    const urlParameters = new URLSearchParams(queryParameters);

    const currentVideo = urlParameters.get('v');
    
    if (currentTab.url.includes("youtube.com/watch") && currentVideo) {
        chrome.storage.sync.get([currentVideo], (data) => {
            const CVBM = data[currentVideo] ? JSON.parse(data[currentVideo]): [];
            viewBookmarks();
        })
    } else {
        const con = document.querySelector('.container');

        con.innerHTML = "<h1 class='title'>This Is Not a Youtube Video Page.</h1>"
    }
});