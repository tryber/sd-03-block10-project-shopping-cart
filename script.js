const API = url => fetch(url);

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const totalPrice = () => {
  const product = document.querySelectorAll('.cart__item');
  const prices = document.querySelector('.total-price');
  prices.innerText = Math.round(
    [...product]
    .map(item => item.textContent.match(/([0-9.]){1,}$/))
    .reduce((total, price) => total + parseFloat(price), 0)
    .toFixed(2) * 100) / 100;
};

const addStorage = () => localStorage.setItem('cart', document.querySelector('.cart__items').innerHTML);

function cartItemClickListener(event) {
  event.target.remove();
  addStorage();
  totalPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addItem = async (sku) => {
  const loading = document.createElement('span');
  loading.innerHTML = 'Loading...';
  const ol = document.getElementsByClassName('cart__items')[0];
  ol.appendChild(loading);
  const response = await API(`https://api.mercadolibre.com/items/${sku}`);
  const data = await response.json();
  const product = await createCartItemElement({
    sku: data.id,
    name: data.title,
    salePrice: data.price,
  });
  ol.removeChild(loading);
  await ol.appendChild(product);
  await addStorage();
  await totalPrice();
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const createBtn = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  createBtn.addEventListener('click', () => addItem(sku));
  section.appendChild(createBtn);
  return section;
}

const emptyCart = () => {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = '';
  addStorage();
  totalPrice();
};

window.onload = function onload() {
  const cartItems = document.querySelector('.cart__items');
  const btnEmpty = document.querySelector('.empty-cart');
  const listItems = async () => {
    const itemSection = document.getElementsByClassName('items')[0];
    const responseAPI = await API('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
    const data = await responseAPI.json();
    console.log(data.results);
    data.results.forEach((e) => {
      const object = { sku: e.id, name: e.title, image: e.thumbnail };
      itemSection.appendChild(createProductItemElement(object));
    });
  };
  listItems();
  btnEmpty.addEventListener('click', emptyCart);
  cartItems.innerHTML = localStorage.getItem('cart');
  document.querySelector('.loading').remove();
  document.querySelectorAll('li').forEach(item => item.addEventListener('click', cartItemClickListener));
  await totalPrice();
};
