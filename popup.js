document.getElementById('checkbox-turn-on').addEventListener('click', e => {
  chrome.runtime.sendMessage('dlcnhpjmbpkeaellhojejhhleinchdch', { turnOn: e.target.checked });
});

document.getElementById('checkbox-debug-mode').addEventListener('click', e => {
  chrome.runtime.sendMessage('dlcnhpjmbpkeaellhojejhhleinchdch', { debugMode: e.target.checked });
});

window.onload = () => {
  chrome.storage.local.get('turnOn', data => {
    document.getElementById('checkbox-turn-on').checked = data.turnOn;
  });

  chrome.storage.local.get('debugMode', data => {
    document.getElementById('checkbox-debug-mode').checked = data.debugMode;
  });
};
