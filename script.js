const cartList = document.getElementsByClassName('cart__items');
const cartEmpty = document.getElementsByClassName('empty-cart');

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

function saveCartItems() {
  localStorage.setItem(
    'cartItemsSave',
    document.getElementsByClassName('cart__items')[0].innerHTML,
  );
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  if (event.target) {
    event.target.remove();
    saveCartItems();
  }
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function requestItemById(itemId) {
  return fetch(`https://api.mercadolibre.com/items/${itemId}`)
    .then(itemData => itemData.json())
    .then(data => createCartItemElement({
      sku: data.id,
      name: data.title,
      salePrice: data.price,
    }))
    .then(obj => cartList[0].appendChild(obj).addEventListener('click', cartItemClickListener(obj)))
    .then(saveCartItems);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', () => requestItemById(sku));

  return section;
}

function eraseCart() {
  const itemList = document.querySelectorAll('li.cart__item');
  if (itemList.length !== 0) {
    itemList.forEach(e => e.remove());
    localStorage.clear();
  }
}


function loadingElem() {
  document.body.appendChild(
    createCustomElement('span', 'loading', 'Loading...')
  );
}

async function fetchPage() {
  loadingElem();
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(data => data.json())
    .then(obj => obj.results.forEach(item => document.getElementsByClassName('items')[0].appendChild(
      createProductItemElement({
        sku: item.id,
        name: item.title,
        image: item.thumbnail,
      }))))
    .then(document.body.removeChild(document.getElementsByClassName('loading')[0]));
}

async function recoverCart() {
  cartList[0].innerHTML = localStorage.getItem('cartItemsSave');
  cartList[0].addEventListener('click', cartItemClickListener);
}

window.onload = function onload() {
  fetchPage();
  if (localStorage) recoverCart();
  cartEmpty[0].addEventListener('click', eraseCart);
};
