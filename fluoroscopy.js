const extensionId = 'dlcnhpjmbpkeaellhojejhhleinchdch';

// auto turn on
window.onload = () => {
  chrome.runtime.sendMessage(extensionId, { turnOn: true });
};

let socket = null;
let turnOn, debug;

const debugLog = (msg, ...rest) => {
  debug && console.log('== fluoroscopy', msg, ...rest);
};

const fluoroscopyByMessage = data => {
  const cards = data.cards;
  Object.keys(cards).forEach(key => {
    const cardDom = document.querySelector(`div#poker-card-${key}`);
    if (cardDom) {
      const cardBack = cardDom.querySelector('a.poker-card-back');
      if (cardBack) {
        cardBack.innerHTML = `${cards[key]}`;
      }
    }
  });
};

const fluoroscopyByDOM = () => {
  const valueDivs = document.querySelectorAll('.poker-card-value');
  valueDivs.forEach(valueDiv => {
    const value = valueDiv.text;
    valueDiv.nextSibling.text = value;
  });
};

const turnOnSocket = () => {
  debugLog('try turn on...');
  chrome.storage.local.get(['debugMode', 'turnOn'], data => {
    debug = data.debugMode;
    turnOn = data.turnOn;

    debugLog('debugMode:', debug);
    debugLog('turnOn:', turnOn);

    if (turnOn) {
      // init
      socket = new WebSocket('ws://anintleague01.dev.activenetwork.com:8080/');
      debugLog('socket created...');
      fluoroscopyByDOM();

      //TODO: socket.send('{type: init-data}');

      // listen to
      socket.addEventListener('message', event => {
        const json = event.data;
        debugLog('recieve message:', json);
        const parsedJson = JSON.parse(json);

        setTimeout(() => {
          try {
            if (parsedJson.type === 'carddisplay') {
              fluoroscopyByMessage(parsedJson.data);
            } else {
              fluoroscopyByDOM();
            }
          } catch (e) {
            debugLog('meet error:', e);
            fluoroscopyByDOM();
          }
        }, 400);
      });
    }
  });
};

const turnOffSocket = () => {
  debugLog('try turn off...');
  socket && socket.close();
};

window.onunload = () => {
  turnOffSocket();
  chrome.runtime.sendMessage(extensionId, { turnOn: false });
};

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes['turnOn']) {
    if (changes['turnOn'].newValue) {
      turnOnSocket();
    } else {
      turnOffSocket();
    }
  }
  if (changes['debugMode']) {
    turnOnSocket();
  }
});
