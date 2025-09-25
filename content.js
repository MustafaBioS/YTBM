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
    
    const fetchBM = () => {
        return new Promise((resolve) => {
            chrome.storage.sync.get([currentVideo], (obj) => {
                resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]): []);                                                          
            })
        })
    }

    const newVideoLoaded = async () => {
        const bmbtn = document.querySelector('.bmbtn')
        CVBM = await fetchBM(); 

        if (!bmbtn) {
            const bm = document.createElement("img");

            bm.src = chrome.runtime.getURL('icon.png');
            bm.className = 'ytbtn ' + "bmbtn"
            bm.title = "Bookmark Timestamp (b)"

            bm.style.marginTop = '12px';
            bm.style.width = '24px';
            bm.style.height = '24px';
            bm.style.marginRight = '4px';

            youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
            youtubePlayer = document.getElementsByClassName('video-stream')[0];

            youtubeLeftControls.appendChild(bm);
            bm.addEventListener('click', newbm);

            document.addEventListener('keydown', (e) => {
                if ((e.key === 'b' || e.key === 'B') && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA" && e.target.isContentEditable)  {
                    newbm();
                }
            })
        }
    }

    const newbm = async () => {
        const currentTime = youtubePlayer.currentTime;
        const newBookmark = {
            time: currentTime,
            desc: `Bookmark At ${getTime(currentTime)}`, 
        };

        CVBM = await fetchBM();

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
