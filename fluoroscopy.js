// auto turn on
chrome.runtime.sendMessage('dlcnhpjmbpkeaellhojejhhleinchdch', { turnOn: true });
let socket = null;
let turnOn, debug;

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

      // listen to
      socket.addEventListener('message', event => {
        const json = event.data;
        console.log('fluoroscopy: === message', json);
        const data = JSON.parse(json);

        if (data.type === 'userlist') {

        } else if (data.type === 'carddisplay') {
          const cards = data.data.cards;
          Object.keys(cards).forEach(key => {
            const cardDom = document.querySelector(`div#poker-card-${key}`);
            if (cardDom) {
              const cardBack = cardDom.querySelector('a.poker-card-back');
              if (cardBack) {
                setTimeout(() => {
                  cardBack.innerHTML = `${cards[key]}`;
                }, 400);
              }
            }
          });
        }
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
    const newTurnOn = changes['turnOn'].newValue;
    if (newTurnOn) {
      turnOnSocket();
    } else {
      turnOffSocket();
    }
  }
  if (changes['debugMode']) {
    turnOnSocket();
  }
});
