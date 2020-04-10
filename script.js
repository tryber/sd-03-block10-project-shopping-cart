window.onload = function onload() {};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const removeItem = document.getElementsByClassName('cart__items')[0];
  removeItem.removeChild(event.srcElement);

  // Atualiza LocalStorage
  const itemsCart = document.getElementsByClassName('cart__items')[0];
  localStorage.setItem('cart', itemsCart.innerHTML);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const clearCart = () => {
  const clear = document.getElementsByClassName('empty-cart')[0];
  clear.addEventListener('click', function () {
    const cart = document.getElementsByClassName('cart')[0];
    const cartList = document.createElement('ol');
    const removeList = document.getElementsByClassName('cart__items')[0];
    cartList.className = 'cart__items';
    cart.removeChild(removeList);
    cart.appendChild(cartList);
    localStorage.removeItem('cart');
  });
};

const getButtons = (button) => {
  button.addEventListener('click', function () {
    itemSku = getSkuFromProductItem(event.path[1]);
    API_SKU = `https://api.mercadolibre.com/items/${itemSku}`;
    fetch(API_SKU)
    .then(data => data.json())
    .then((dataJson) => {
      const itemsCart = document.getElementsByClassName('cart__items')[0];
      const { id, title, price } = dataJson;
      const obj = { sku: id, name: title, salePrice: price };
      itemsCart.appendChild(createCartItemElement(obj));
      clearCart();
      localStorage.setItem('cart', itemsCart.innerHTML);
    });
  });
};

const buttonReady = () => {
  const botoes = document.getElementsByClassName('item__add');
  for (let i = 0; i < botoes.length; i += 1) {
    getButtons(botoes[i]);
  }
};

const recoveryCart = () => {
  // verifica se já existe itens no carrinho
  if (localStorage.getItem('cart')) {
    const cart = document.getElementsByClassName('cart__items')[0];
    clearCart();
    cart.innerHTML = localStorage.getItem('cart');
    cart.addEventListener('click', cartItemClickListener);
  }
};

recoveryCart();
const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

fetch(API_URL)
.then(data => data.json())
.then((dataJson) => {
  const itemsSec = document.getElementsByClassName('items')[0];

  dataJson.results.forEach(({ id, title, thumbnail }) => {
    const obj = { sku: id, name: title, image: thumbnail };
    itemsSec.appendChild(createProductItemElement(obj));
  });
  buttonReady();
});
