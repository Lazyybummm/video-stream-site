// FILE: iframe_spy.js
console.log(`🕵️‍♂️ Spy script active: ${window.location.href}`);

function lookForVideo(container) {
    const video = container.querySelector('video');
    if (video && !video.dataset.moonwatchTracked) {
        video.dataset.moonwatchTracked = "true";
        console.log(`%c🎯 TARGET ACQUIRED inside frame: ${window.location.hostname || 'Sandboxed Anonymous Frame'}`, "color: #46d369; font-weight: bold; font-size: 14px;");

        video.addEventListener('play', () => {
            console.log("📸 Spy captured HTML5 PLAY event at:", video.currentTime);
            chrome.runtime.sendMessage({ source: 'iframe', action: 'play', time: video.currentTime });
        });
        
        video.addEventListener('pause', () => {
            console.log("📸 Spy captured HTML5 PAUSE event");
            chrome.runtime.sendMessage({ source: 'iframe', action: 'pause', time: video.currentTime });
        });
    }
}

// 1. Scan immediately in case it's already there
lookForVideo(document);

// 2. Watch for dynamic video element injections
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
            lookForVideo(document);
        }
    }
});

observer.observe(document.documentElement, {
    childList: true,
    subtree: true
});

// Sync receiver
chrome.runtime.onMessage.addListener((message) => {
    if (message.target !== 'iframe_spy') return;
    const targetVideo = document.querySelector('video');
    if (!targetVideo) return;
    
    if (message.action === 'force_pause') {
        targetVideo.pause();
    }
    if (message.action === 'force_play') {
        targetVideo.currentTime = message.time;
        targetVideo.play();
    }
});