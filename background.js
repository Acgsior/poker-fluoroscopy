const updateBadge = turnOn => {
  if (turnOn) {
    chrome.browserAction.setBadgeText({ text: 'ON' });
    chrome.browserAction.setBadgeBackgroundColor({ color: '#4688F1' });
  } else {
    chrome.browserAction.setBadgeText({ text: 'OFF' });
    chrome.browserAction.setBadgeBackgroundColor({ color: '#222222' });
  }
};

chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
  const typeKeys = Object.keys(msg);
  if (typeKeys.includes('turnOn')) {
    chrome.storage.local.set({ turnOn: msg.turnOn });
  } else if (typeKeys.includes('debugMode')) {
    chrome.storage.local.set({ debugMode: msg.debugMode });
  }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes['turnOn']) {
    const turnOn = changes['turnOn'].newValue;
    updateBadge(turnOn);
  }
});

const initTurnOn = false;
chrome.storage.local.set({ turnOn: initTurnOn });
updateBadge(initTurnOn);
