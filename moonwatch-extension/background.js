// FILE: background.js
console.log("🚀 Moonwatch Background Worker: Active & Sniffing Frames");

// Listen to every frame creation event across the browser sandbox
chrome.webNavigation.onCommitted.addListener((details) => {
    // Only log frames happening inside your development environment or streaming player
    console.log(`🌐 Frame Detected -> ID: ${details.frameId} | Parent ID: ${details.parentFrameId} | URL: ${details.url}`);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const tabId = sender.tab ? sender.tab.id : "UNKNOWN_TAB";
    
    if (message.source === 'iframe') {
        chrome.tabs.sendMessage(tabId, { target: 'react_bridge', action: message.action, time: message.time });
    }
    
    if (message.source === 'react') {
        chrome.tabs.sendMessage(tabId, { target: 'iframe_spy', action: `force_${message.action}`, time: message.time });
    }
});