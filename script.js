//  carregar sessão salva no localStorafe
window.onload = function onload() {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('loadCart');
  document.querySelectorAll('.cart__item').forEach(el => el.addEventListener('click', this.cartItemClickListener));
};
//  Criar mensagem de carregamento
const load = document.createElement('div');
load.innerHTML = 'Loading...';
load.className = 'loading';
document.querySelector('.loading-area').appendChild(load);

// tipo de requisçao a API

const myObject = {
  method: 'GET',
  headers: { Accept: 'application/json' },
};

const cartPrice = document.createElement('div');
cartPrice.className = 'total-price';
cartPrice.innerHTML = 'R$ 0,00';
document.querySelector('.cart__title').appendChild(cartPrice);

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

let totalPrice = 0;

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', (el) => {
    el.target.remove();
    totalPrice -= price;
    cartPrice.innerHTML = totalPrice;
  });
  return li;
}

//  Criando detalhes do elemento
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

//  Função que criar o novo item a partir do resultado da API request
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.querySelector('button').addEventListener('click', () => {
    // const load = document.createElement('div');
    // load.innerHTML = 'Loading';
    // load.className = 'loading';
    // document.querySelector('.empty-cart').appendChild(load);
    const URL = `https://api.mercadolibre.com/items/${sku}`;
    fetch(URL, myObject)
      .then(data => data.json())
      .then((data) => {
        // document.querySelector('.loading').innerHTML = '';
        // document.querySelectorAll('.loading').forEach(e => e.remove());
        const { id, title, price } = data;
        totalPrice += price;
        cartPrice.innerHTML = totalPrice;
        const newItem = createCartItemElement({ id, title, price });
        document.querySelector('.cart__items').appendChild(newItem);
      });
  });
  return section;
}

// requisicao a API
const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

fetch(API_URL, myObject)
  .then(data => data.json())
  .then((data) => {
    load.innerHTML = '';
    document.querySelector('.loading').remove(); // quando a API ir pra fullfiled o texto de loading some
    data.results.forEach((el) => {
      const { id: sku, title: name, thumbnail: image } = el; // object destructuring
      const newElement = createProductItemElement({ sku, name, image });
      document.querySelector('.items').appendChild(newElement);
    });
  });

//  Limpar Cart
document.querySelector('.empty-cart').addEventListener('click', () => {
  document.querySelector('.cart__items').innerHTML = '';
  totalPrice = 0;
  document.querySelector('.total-price').innerHTML = `R$${totalPrice.toFixed(2)}`;
});


//  carregar informações no localStorage
window.addEventListener('unload', () => {
  localStorage.setItem('loadCart', document.querySelector('.cart__items').innerHTML);
  console.log(document.querySelector('.cart__items').innerHTML);
});
