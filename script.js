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

const priceUpdate = async () => {
  const totalPrice = document.getElementsByClassName('total-price');
  const cartItemsHTMLcollection = document.getElementsByClassName('cart__item');
  const cartTotal = [...cartItemsHTMLcollection]
    .map(element => element.innerText.match(/([0-9.]){1,}$/))
    .reduce((accumulator, currentValue) => accumulator + parseFloat(currentValue), 0);
  totalPrice[0].innerHTML = cartTotal;
};

function cartItemClickListener(event) {
  const parentNode = document.querySelector('.cart__items');
  removedItem = parentNode.removeChild(event.target);
  localStorage.clear();
  localStorage.setItem('cartItems', document.querySelector('.cart__items').innerHTML);
  priceUpdate();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCart = (sku) => {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(response => response.json())
    .then(data => ({ sku: data.id, name: data.title, salePrice: data.price }))
    .then(product => createCartItemElement(product))
    .then(object => document.querySelector('.cart__items').appendChild(object))
    .then(() => localStorage.setItem('cartItems', document.querySelector('.cart__items').innerHTML))
    .then(() => priceUpdate());
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', () => addToCart(sku));
  return section;
}

const createProductList = () => {
  const productArray = [];
  const itemsSec = document.querySelector('.items');
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(data => data.results.forEach(product => productArray.push({
      sku: product.id,
      name: product.title,
      image: product.thumbnail,
    })))
    .then(() => productArray.forEach(obj => itemsSec.appendChild(createProductItemElement(obj))));
};

const loadSavedItems = () => {
  const savedItems = localStorage.getItem('cartItems');
  const cartList = document.querySelector('.cart__items');
  if (savedItems) {
    cartList.innerHTML = savedItems;
  }
  const cartItems = [...document.getElementsByClassName('cart__item')];
  cartItems.forEach(element => element.addEventListener('click', cartItemClickListener));
};

const emptyCart = () => {
  const cartItems = [...document.getElementsByClassName('cart__item')];
  console.log(cartItems);
  const parentNode = document.querySelector('.cart__items');
  cartItems.forEach(element => parentNode.removeChild(element));
  localStorage.clear();
  localStorage.setItem('cartItems', document.querySelector('.cart__items').innerHTML);
  priceUpdate();
};

const emptyBtn = document.querySelector('.empty-cart');
emptyBtn.addEventListener('click', emptyCart);

const getApi = async () => {
  await fetch(url)
    .then(response => response.json())
    .then(data => data.results.forEach(e => document.getElementsByClassName('items')[0]
      .appendChild(createProductItemElement({
        sku: e.id,
        name: e.title,
        image: e.thumbnail,
      }))));
  document.getElementsByClassName('empty-cart')[0].addEventListener('click', () => {
    document.getElementsByClassName('cart__items')[0].innerHTML = '';
    localStorage.clear();
  });
};

window.onload = function onload() {
  createProductList();
  loadSavedItems();
  priceUpdate();
  getApi().then(() => document.getElementsByClassName('loading')[0].remove());
};
