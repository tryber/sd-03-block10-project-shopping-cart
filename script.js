
const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const myObj = { method: 'GET' };

// Pegar Elementos no HTML

const sectionItem = document.querySelector('.items');

// Funções

function transNumber(num) {
  (Math.floor(num * 100) / 100).toFixed(1);
  return num;
}

function atualizaLocalStorage() {
  const itens = document.querySelector('.cart__items').innerHTML;
  const total = document.querySelector('#total-price').innerHTML;
  localStorage.removeItem('carrinhoDeCompras');
  localStorage.removeItem('totalCompras');
  localStorage.setItem('carrinhoDeCompras', itens);
  localStorage.setItem('totalCompras', total);
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

  return arrProducts;
}

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

function criaElementosNaTela(arr) {
  arr.forEach((el) => {
    sectionItem.appendChild(createProductItemElement(el));
  });
}

function somaCompras(precoDoNovoItem) {
  if (document.querySelector('#total-price').innerText) {
    const arrProdutos = document.querySelectorAll('.cart__item');
    const refinando = [];
    arrProdutos.forEach((el) => {
      refinando.push(el.innerHTML.match(/([0-9.]){1,}$/)[0]);
    });
    let resultado = 0;
    for (let i = 0; i < refinando.length; i += 1) {
      const number = transNumber(parseFloat(refinando[i]));
      resultado += number;
    }
    // const resultado = refinando.reduce((acc, cur) => {
    //   const number = transNumber(parseFloat(cur));
    //   acc += number;
    //   return acc;
    // }, 0);
    return resultado.toFixed(2);
  }
  return precoDoNovoItem;
}

function atualizarPreco(parametro) {
  document.querySelector('#total-price').innerText = parametro;
}

function cartItemClickListener(event) {
  event.target.remove();
  const preco = somaCompras();
  atualizarPreco(preco);
  atualizaLocalStorage();
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
  const price = transNumber(objForCartItem.salePrice);
  return price;
}

const fetchItemPorID = async (id) => {
  const URL = `https://api.mercadolibre.com/items/${id}`;
  const response = await fetch(URL);
  const data = await response.json();
  const obj = await montarObjCartItem(data);
  const preco = await somaCompras(obj);
  atualizarPreco(preco);
  atualizaLocalStorage();
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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function recuperaLocalStorage() {
  const dadosGravados = localStorage.getItem('carrinhoDeCompras');
  const total = localStorage.getItem('totalCompras');
  document.querySelector('.cart__items').innerHTML = dadosGravados;
  const arr = document.querySelectorAll('.cart__item');
  arr.forEach(el => el.addEventListener('click', cartItemClickListener));
  document.querySelector('#total-price').innerText = total;
}

function emptycart() {
  const empt = document.querySelector('.empty-cart');
  empt.addEventListener('click', function () {
    document.querySelector('.cart__items').innerHTML = '';
    document.querySelector('#total-price').innerHTML = '';
    atualizaLocalStorage();
  });
  document.querySelector('#loading').remove();
}

function loading() {
  document.querySelector('#loading').innerHTML = 'loading...';
}

window.onload = function onload() {
  recuperaLocalStorage();
  fetch(API_URL, myObj)
    .then(response => response.json())
    .then(jsonResponse => montarObj(jsonResponse))
    .then(arr => criaElementosNaTela(arr))
    .then(loading())
    .then(queryButtons)
    .then(emptycart);
};
