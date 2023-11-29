document.addEventListener("DOMContentLoaded", function() {
  chrome.runtime.sendMessage({ action: "youtubePageLoaded" });
});

// Function to wait for an element to appear in the DOM
function waitForElement(selector, timeout = 3000) {
  return new Promise((resolve, reject) => {
    const intervalTime = 100;
    let totalTime = 0;

    const interval = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        clearInterval(interval);
        resolve(element);
      } else if (totalTime > timeout) {
        clearInterval(interval);
        reject(new Error(`Element with selector ${selector} not found within timeout period`));
      }
      totalTime += intervalTime;
    }, intervalTime);
  });
}

// Function to copy video information
function copyVideoInfo() {
    try {
      const videoTitle = document.querySelector('h1>yt-formatted-string').textContent; // or the correct selector for the title
      const videoLength = document.querySelector('.ytp-time-duration').textContent; // or the correct selector for the length

      // Extract the video ID from the URL
      const urlParams = new URLSearchParams(window.location.search);
      const videoId = urlParams.get('v');

      // Construct the shortened URL
      const shortenedURL = `https://youtu.be/${videoId}`;

      const videoInfo = `Title: ${videoTitle}\nLength: ${videoLength}\nURL: ${shortenedURL}`;

      // Send video information back to popup
      chrome.runtime.sendMessage({videoInfo: videoInfo});
    } catch {
      console.error('Could not copy video information.');
    }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "copyYoutubeInfo") {
    copyVideoInfo();
    sendResponse({ success: true });
  }
});

