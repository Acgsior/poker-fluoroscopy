const updateBadge = turnOn => {
  if (turnOn) {
    chrome.browserAction.setBadgeText({ text: 'ON' });
    chrome.browserAction.setBadgeBackgroundColor({ color: '#4688F1' });
  } else {
    chrome.browserAction.setBadgeText({ text: 'OFF' });
    chrome.browserAction.setBadgeBackgroundColor({ color: '#222222' });
  }
};

const localSetTurnOf = value => {
  chrome.storage.local.set({ turnOn: value });
};

chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
  if (Object.keys(msg).includes('turnOn')) {
    localSetTurnOf(msg.turnOn);
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
