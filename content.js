
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
  // Click the share button to reveal the shortened URL
  const shareButton = document.querySelector('button[aria-label="Share"].yt-spec-button-shape-next');
  if (shareButton) {
    shareButton.click();

    // Wait for the shortened URL to appear
    waitForElement('input#share-url')
      .then(inputElement => {
        const shortenedURL = inputElement.value;
        const videoTitle = document.querySelector('h1>yt-formatted-string').textContent;
        const videoLength = document.querySelector('.ytp-time-duration').textContent;
        const videoInfo = `Title: ${videoTitle}\nLength: ${videoLength}\nURL: ${shortenedURL}`;
        
        const cancelButton = document.querySelector('button[aria-label="Cancel"].yt-icon-button#button');
        if(cancelButton) {
            cancelButton.click();
        }

        // Send video information back to popup
        chrome.runtime.sendMessage({videoInfo: videoInfo});
      })
      .catch(err => console.error('Failed to find the shortened URL input: ', err));
  } else {
    console.error('Share button not found.');
  }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "copyYoutubeInfo") {
    copyVideoInfo();
    sendResponse({ success: true });
  }
});

