window.onload = () => {
  // init
  const socket = new WebSocket('ws://anintleague01.dev.activenetwork.com:8080/');

  // listen to
  socket.addEventListener('message', (event) => {
    const json  = event.data;
    console.log('=== Message from server', json);
    const data = JSON.parse(json);

    if (data.type === 'carddisplay') {
      const cards = data.data.cards;
      Object.keys(cards).forEach((key) => {
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
};