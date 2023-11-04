document.addEventListener('DOMContentLoaded', function() {
  var copyInfoButton = document.getElementById('copyInfoButton');
  
  // Add a listener to receive the video information from the content script
  chrome.runtime.onMessage.addListener((message) => {
    if (message.videoInfo) {
      navigator.clipboard.writeText(message.videoInfo)
        .then(() => console.log('Video information copied to clipboard.'))
        .catch(err => console.error('Failed to copy text: ', err));
    }
  });

  copyInfoButton.addEventListener('click', function() {
    // Query the active tab to find the current page
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      // Send a message to the content script
      chrome.tabs.sendMessage(tabs[0].id, {action: "copyYoutubeInfo"}, function(response) {
        if (chrome.runtime.lastError) {
          // Handle the case where the content script did not send a response
          console.error('Could not establish connection. Receiving end does not exist.');
        }
        // Response handling is no longer needed here because it's handled by the message listener above
      });
    });
  }, false);
}, false);
