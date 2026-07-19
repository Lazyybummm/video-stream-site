// FILE: react_bridge.js
console.log("🌉 Moonwatch React Bridge: Injected into Main Page Context");

// 1. Listen for events arriving outwards from your custom UI
window.addEventListener('message', (event) => {
    if (event.data && event.data.source === 'react-app') {
        console.log("📤 React Bridge received raw command from web application:", event.data);
        chrome.runtime.sendMessage({ source: 'react', action: event.data.action, time: event.data.time || 0 });
    }
});

// 2. Listen for messages arriving downwards from the background pipeline
chrome.runtime.onMessage.addListener((message) => {
    if (message.target !== 'react_bridge') return;
    
    console.log("📥 React Bridge received message from Chrome Runtime:", message);
    console.log("🔀 Forwarding message to window object for web application collection...");
    
    window.postMessage({ source: 'extension', action: message.action, time: message.time }, '*');
});