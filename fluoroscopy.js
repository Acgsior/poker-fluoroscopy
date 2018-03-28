// auto turn on
chrome.runtime.sendMessage('dlcnhpjmbpkeaellhojejhhleinchdch', { turnOn: true });
let socket = null;
let turnOn, debug;

const turnOnSocket = () => {
  chrome.storage.local.get(['debugMode', 'turnOn'], data => {
    debug = data.debugMode;
    debug && console.log('fluoroscopy: === debugMode: ', debug);
    debug && console.log('fluoroscopy: === trunOn', data.turnOn);

    if (turnOn) {
      // init
      socket = new WebSocket('ws://anintleague01.dev.activenetwork.com:8080/');

      // listen to
      socket.addEventListener('message', event => {
        const json = event.data;
        console.log('fluoroscopy: === message', json);
        const data = JSON.parse(json);

        if (data.type === 'carddisplay') {
          const cards = data.data.cards;
          Object.keys(cards).forEach(key => {
            const cardDom = document.querySelector(`div#poker-card-${key}`);
            if (cardDom) {
              const cardBack = cardDom.querySelector('a.poker-card-back');
              if (cardBack) {
                setTimeout(() => {
                  cardBack.innerHTML = `${cards[key]}`;
                }, 1000);
              }
            }
          });
        }
      });
    }
  });
};

const turnOffSocket = () => {
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
