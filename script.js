/* eslint-disable arrow-parens */

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

function createStorage({ sku, name, salePrice }) {
  const cart = (localStorage.getItem('cart')) ? JSON.parse(localStorage.getItem('cart')) : [];
  cart.push({ sku, name, salePrice });
  localStorage.setItem('cart', JSON.stringify(cart));
}

async function getDetailsToCart(id) {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const respToJson = await response.json();
  const sku = respToJson.id;
  const name = respToJson.title;
  const salePrice = respToJson.price;
  return { sku, name, salePrice };
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
async function sumPrice(salePrice) {
  const totalPrice = await document.querySelector('.total-price');
  const sum = Math.round((JSON.parse(totalPrice.innerHTML) + salePrice) * 100) / 100;
  totalPrice.innerHTML = sum;
}
const decreasePrice = (sku) => {
  const localParsed = JSON.parse(localStorage.cart);
  const item = localParsed.find(obj => obj.sku === sku);
  sumPrice(-item.salePrice);
  const index = localParsed.findIndex(e => e.sku === item.sku);
  localParsed.splice(index, 1);
  localStorage.cart = JSON.stringify(localParsed);
};
function cartItemClickListener(event, sku) {
  decreasePrice(sku);
  event.target.remove();
}

async function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  await sumPrice(salePrice);
  li.addEventListener('click', event => cartItemClickListener(event, sku));
  document.querySelector('.cart__items').appendChild(li);
}

async function getResponse() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const respToJson = await response.json();
  const treatedResp = respToJson.results;
  treatedResp.forEach((e) => {
    const sku = e.id;
    const name = e.title;
    const image = e.thumbnail;
    document.querySelector('.items').appendChild(createProductItemElement({ sku, name, image }));
  });

  document.querySelectorAll('.item').forEach(async (e) => {
    const sku = getSkuFromProductItem(e);
    const getDetails = await getDetailsToCart(sku);
    await e.lastChild.addEventListener('click', () => {
      createCartItemElement(getDetails);
      createStorage(getDetails);
    });
  });
}
function emptyCart() {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelector('.total-price').innerText = 0;
    document.querySelectorAll('li.cart__item').forEach(e => e.remove());
    localStorage.setItem('cart', '[]');
  });
}

function loadOnCart() {
  const storage = localStorage.getItem('cart');
  const populateCart = local => local.forEach(e => createCartItemElement(e));
  return storage ? populateCart(JSON.parse(storage)) : localStorage.setItem('cart', '[]');
}
window.onload = function onload() {
  loadOnCart();
  emptyCart();
  getResponse()
    .then(() => document.querySelector('.loading').remove())
    .catch((error) => {
      console.log('Error');
      console.error(error);
    });
};
