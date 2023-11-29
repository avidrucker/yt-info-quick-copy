document.addEventListener("DOMContentLoaded", function() {
  chrome.runtime.sendMessage({ action: "youtubePageLoaded" });
});

function copyVideoInfo() {
  try {
    const videoTitle = document.querySelector('h1>yt-formatted-string').textContent; // or the correct selector for the title
    
    // Extract the duration from the meta tag
    const durationMeta = document.querySelector('meta[itemprop="duration"]');
    const durationContent = durationMeta ? durationMeta.getAttribute('content') : '';
    const videoLength = parseDuration(durationContent); // Parse the ISO 8601 duration format

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

// Function to parse ISO 8601 duration format
function parseDuration(duration) {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = (parseInt(match[1], 10) || 0);
  const minutes = (parseInt(match[2], 10) || 0);
  const seconds = (parseInt(match[3], 10) || 0);
  return `${hours > 0 ? hours + 'h ' : ''}${minutes}m ${seconds}s`;
}


// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "copyYoutubeInfo") {
    copyVideoInfo();
    sendResponse({ success: true });
  }
});

