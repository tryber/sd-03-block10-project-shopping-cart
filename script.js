
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

window.onload = function onload() { };
const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const myObj = { method: 'GET' };

const sectionItem = document.querySelector('.items');
const lStorage = () => localStorage.setItem('cart', document.querySelector('.cart__items').innerHTML);

function cartItemClickListener(event) {
  event.target.parentNode.removeChild(event.target);
  lStorage();
}

function montarObj(json) {
  const arrResults = [];
  json.results.forEach((el) => {
    arrResults.push(el);
  });

  const arrProducts = [];
  arrResults.forEach((el) => {
    arrProducts.push({
      sku: el.id,
      name: el.title,
      image: el.thumbnail,
    });
  });
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('cart');
  document.querySelectorAll('li')
    .forEach((el) => {
      el.addEventListener('click', cartItemClickListener);
    });
  return arrProducts;
}

function criaElementosNaTela(arr) {
  arr.forEach((el) => {
    sectionItem.appendChild(createProductItemElement(el));
  });
}


function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function montarObjCartItem(data) {
  const objForCartItem = {
    sku: data.id,
    name: data.title,
    salePrice: data.price,
  };
  const li = createCartItemElement(objForCartItem);
  const ol = document.querySelector('.cart__items');
  ol.appendChild(li);
}

const fetchItemPorID = (id) => {
  const URL = `https://api.mercadolibre.com/items/${id}`;
  fetch(URL)
    .then(response => response.json())
    .then(data => montarObjCartItem(data))
    .then(lStorage);
};

const coletarIDsDoElementoClicado = (event) => {
  const acessarSection = event.target.parentNode;
  const idFirstElement = acessarSection.firstChild.innerText;
  fetchItemPorID(idFirstElement);
};

function queryButtons() {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((el) => {
    el.addEventListener('click', coletarIDsDoElementoClicado);
  });
}

function emptcart() {
  const empt = document.querySelector('.empty-cart');
  empt.addEventListener('click', function () {
    document.querySelector('.cart__items').innerHTML = '';
  });
  document.querySelector('.loading').remove();
}

function loading() {
  document.querySelector('.loading').innerHTML = 'loading...';
}

window.onload = function onload() {
  fetch(API_URL, myObj)
    .then(response => response.json())
    .then(jsonResponse => montarObj(jsonResponse))
    .then(arr => criaElementosNaTela(arr))
    .then(loading())
    .then(queryButtons)
    .then(emptcart());
};
