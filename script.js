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

const price = () => {
  const products = document.querySelectorAll('.cart__item');
  const prices = document.querySelector('.total-price');
  prices.innerText = products ? Math.round(
    [...products]
    .map(item => item.textContent.match(/([0-9.]){1,}$/))
    .reduce((total, price) => total + parseFloat(price), 0)
    .toFixed(2) * 100) / 100 : 0;
};

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
  price();
  localStorage.setItem('carrinho', document.querySelector('.cart__items').innerHTML);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  price();
  return li;
}

// Dado um ID, a function adiciona o produto com esse ID no cart
async function getId(itemID) {
  const apiButton = `https://api.mercadolibre.com/items/${itemID}`;

  await fetch(apiButton)
  .then(response => response.json()
  .then(element => document.querySelector('.cart__items').appendChild(createCartItemElement({ sku: element.id, name: element.title, salePrice: element.price }))));
  await price();
  await localStorage.setItem('carrinho', document.querySelector('.cart__items').innerHTML);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', () => getId(sku));
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(button);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Remove o loading e carrega os itens em forma visual
const URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

fetch(URL)
.then(response => response.json()
.then(data => data.results.forEach((element) => {
  const items = { sku: element.id, name: element.title, image: element.thumbnail };
  document.querySelector('.items').appendChild(createProductItemElement(items));
}))
.then(document.querySelector('.loading').remove()));

window.onload = function onload() {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('carrinho');
  document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    this.localStorage.clear();
  });
  document.querySelectorAll('li').forEach(item => item.addEventListener('click', cartItemClickListener));
price();
};
