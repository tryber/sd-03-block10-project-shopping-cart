
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

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = function onload() { };
const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const myObj = { method: 'GET' };

const sectionItem = document.querySelector('.items');
const lStorage = () => localStorage.setItem('cart', document.querySelector('.cart__items').innerHTML);

function allprice(obj) {
  if (document.querySelector('#total-price').innerText) {
    const arrProdutos = document.querySelectorAll('.cart__item');
    const refinando = [];
    arrProdutos.forEach((el) => {
      refinando.push(el.innerHTML.match(/([0-9.]){1,}$/)[0]);
    });
    let resultado = 0;
    for (let i = 0; i < refinando.length; i += 1) {
      const number = parseFloat(refinando[i]);
      resultado += number;
    }
    return transNumber(resultado);
  }
  return obj;
}


function cartItemClickListener(event) {
  event.target.parentNode.removeChild(event.target);
  document.querySelector('#total-price').innerHTML = allprice();
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

function transNumber(num) {
  return (Math.round(num.toFixed(2) * 100) / 100);
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
  const preco = transNumber(objForCartItem.salePrice);
  return preco;
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

const fetchItemPorID = async (id) => {
  const URL = `https://api.mercadolibre.com/items/${id}`;
  const response = await fetch(URL);
  const data = await response.json();
  const obj = await montarObjCartItem(data);
  const prec = allprice(obj);
  document.querySelector('#total-price').innerText = prec;
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

window.onload = function onload() {
  fetch(API_URL, myObj)
    .then(response => response.json())
    .then(jsonResponse => montarObj(jsonResponse))
    .then(arr => criaElementosNaTela(arr))
    .then(loading())
    .then(queryButtons)
    .then(emptcart);
};
