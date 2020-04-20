window.onload = function onload() {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('último carrinho');
};


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


function cartItemClickListener(event) {
  event.target.remove();
  localStorage.setItem('último carrinho', document.querySelector('.cart__items').innerHTML);
}


function totalPrice() {
  const cartItem = document.querySelectorAll('.cart__item');
  const price = Math.round([...cartItem].map(value => value.innerText
    .split('$')[1])
    .reduce((acc, value) => (acc + parseFloat(value)), 0) * 100) / 100;
  document.querySelectorAll('.total-price')[0].innerHTML = `Total $${price}`;
}


function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  totalPrice();

  // document.querySelector('.total-price').innerHTML = `Total $${salePrice}`;
  // localStorage.setItem('Total', salePrice);

  return li;
}


async function getId(itemID) {
  const apiButton = `https://api.mercadolibre.com/items/${itemID}`;

  await fetch(apiButton)
  .then(response => response.json()
  .then(element => document.querySelector('.cart__items').appendChild(createCartItemElement({ sku: element.id, name: element.title, salePrice: element.price }))));

  localStorage.setItem('último carrinho', document.querySelector('.cart__items').innerHTML);
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


const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

fetch(API_URL)
.then(response => response.json()
.then(data => data.results.forEach((element) => {
  const keysItems = { sku: element.id, name: element.title, image: element.thumbnail };
  document.querySelector('.items').appendChild(createProductItemElement(keysItems));
}))
.then(document.querySelector('.loading').remove()));


function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}


function clearCart() {
  document.querySelector('.cart__items').innerHTML = '';
  localStorage.setItem('último carrinho', document.querySelector('.cart__items').innerHTML);
}
document.querySelector('.empty-cart').addEventListener('click', clearCart);
