const updateBadgeState = turnOn => {
  if (turnOn) {
    chrome.browserAction.setBadgeText({ text: 'ON' });
    chrome.browserAction.setBadgeBackgroundColor({ color: '#4688F1' });
  } else {
    chrome.browserAction.setBadgeText({ text: 'OFF' });
    chrome.browserAction.setBadgeBackgroundColor({ color: '#222222' });
  }
};

chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
  if (msg.turnOn) {
    updateBadgeState(true);
  } else if (msg.turnOff) {
    updateBadgeState(false);
  }
});

chrome.browserAction.onClicked.addListener(function(tab) {
  const turnOn = chrome.storage.sync.get(['turnOn']);
  chrome.storage.sync.set({ turnOn: !turnOn });
});

chrome.storage.sync.set({ turnOn: false });
updateBadgeState(false);