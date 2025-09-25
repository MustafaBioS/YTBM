(() => {
    let youtubeLeftControls, youtubePlayer;
    let currentVideo = "";
    let CVBM = [];

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value, videoId } = obj;

        if (type === "NEW") {
            currentVideo = videoId;
            newVideoLoaded();
        }
    });

    const newVideoLoaded = async () => {
        const bmbtn = document.querySelector('.bmbtn')

        if (!bmbtn) {
            const bm = document.createElement("img");

            bm.src = chrome.runtime.getURL('icon.png');
            bm.className = 'ytbtn ' + "bmbtn"
            bm.title = "Click To Bookmark The Current Timestamp"

            bm.style.marginTop = '12px';
            bm.style.width = '24px';
            bm.style.height = '24px';

            youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
            youtubePlayer = document.getElementsByClassName('video-stream')[0];

            youtubeLeftControls.appendChild(bm);
            bm.addEventListener('click', newbm);
        }
    }

    const newbm = () => {
        const currentTime = youtubePlayer.currentTime;
        const newBookmark = {
            time: currentTime,
            desc: `Bookmark At ${getTime(currentTime)}`, 
        };

        console.log(newBookmark)

        chrome.storage.sync.set({
            [currentVideo]: JSON.stringify([...CVBM, newBookmark].sort((a, b) => a.time - b.time))
        });
    } 
})();

const getTime = t => {
    var date = new Date(0);
    date.setSeconds(t);

    return date.toISOString().substring(11, 8);
};
