chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "youtubePageLoaded") {
      // Perform actions to 'wake up' the extension
      console.log("YouTube page loaded. Extension activated.");
      // You can update extension's state or UI here
  }
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command === "copy-info") {
    try {
      // Wrap chrome.tabs.query in a promise
      const tabs = await new Promise((resolve, reject) => {
        chrome.tabs.query({active: true, currentWindow: true}, (result) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(result);
          }
        });
      });

      if (tabs.length === 0 || !tabs[0]) {
        console.error('No active tab found.');
        return;
      }

      const tabId = tabs[0].id;
      if (!tabId) {
        console.error('Active tab has no ID:', tabs[0]);
        return;
      }

      // Wrap chrome.scripting.executeScript in a promise
      await new Promise((resolve, reject) => {
        chrome.scripting.executeScript({
          target: {tabId: tabId},
          files: ['content.js']
        }, () => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve();
          }
        });
      });
    } catch (error) {
      console.error('Error executing script:', error);
    }
  }
});

