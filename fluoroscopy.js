// auto turn on
chrome.runtime.sendMessage('dlcnhpjmbpkeaellhojejhhleinchdch', { turnOn: true });
let socket = null;
let turnOn, debug;

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
  debug && console.log('fluoroscopy: === try turn on...');
  chrome.storage.local.get(['debugMode', 'turnOn'], data => {
    debug = data.debugMode;
    debug && console.log('fluoroscopy.debugMode: ', debug);
    turnOn = data.turnOn;
    debug && console.log('fluoroscopy.turnOn', turnOn);

    if (turnOn) {
      // init
      socket = new WebSocket('ws://anintleague01.dev.activenetwork.com:8080/');
      debug && console.log('fluoroscopy === socket created...');
      fluoroscopyByDOM();

      //TODO: socket.send('{type: init-data}');

      // listen to
      socket.addEventListener('message', event => {
        const json = event.data;
        console.log('fluoroscopy: === message', json);
        const data = JSON.parse(json);

        setTimeout(() => {
          try {
            if (data.type === 'carddisplay') {
              fluoroscopyByMessage(data.data);
            } else {
              fluoroscopyByDOM();
            }
          } catch (e) {
            debug && console.log('fluoroscopy === meet error: ', e);
            fluoroscopyByDOM();
          }
        }, 400);
      });
    }
  });
};

const turnOffSocket = () => {
  debug && console.log('fluoroscopy: === try turn off...');
  socket && socket.close();
};

window.onunload = () => {
  turnOffSocket();
  chrome.runtime.sendMessage('dlcnhpjmbpkeaellhojejhhleinchdch', { turnOn: false });
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
