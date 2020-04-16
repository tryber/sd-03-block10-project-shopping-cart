const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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
  event.target.parentNode.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function newLocalStorage() {
  const itens = document.querySelector('.cart__items').innerHTML;
  localStorage.removeItem('carrinhoDeCompras');
  localStorage.setItem('carrinhoDeCompras', itens);
};

function recuperaLS() {
  const bdados = localStorage.getItem('carrinhoDeCompras');
  document.querySelector('.cart__items').innerHTML = bdados;
  const arr = document.querySelectorAll('.cart__item');
  arr.forEach(el => el.addEventListener('click', cartItemClickListener));
};

const itemFilho = (data) => {
  const obj = {
    sku: data.id,
    name: data.title,
    salePrice: data.price,
  };
  const li = createCartItemElement(obj);
  const ol = document.querySelector('.cart__items');
  ol.appendChild(li);
};

function chamaId(id) {
  const url = `https://api.mercadolibre.com/items/${id}`;
  fetch(url)
    .then(response => response.json())
    .then(data => itemFilho(data));
  newLocalStorage();
}

function coletaBotao(event) {
  const acessa = event.target.parentNode;
  const priIdEl = acessa.firstChild.innerText;
  chamaId(priIdEl);
}

function botaoAdd() {
  const add = document.querySelectorAll('.item__add');
  add.forEach((param) => {
    param.addEventListener('click', coletaBotao);
  });
  document.querySelector('.loading').remove();
}

function load() {
  return document.querySelector('.loading').innerHTML = 'loading...';
}

fetch(API_URL)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    const a = document.querySelector('.items');
    data.results.forEach((procura) => {
      const all = { sku: procura.id, name: procura.title, image: procura.thumbnail };
      const product = createProductItemElement(all);
      a.appendChild(product);
    });
  })
  .then(load)
  .then(botaoAdd);

window.onload = function onload() {
  const apagaAll = document.getElementById('empty-cart');
  console.log(apagaAll)
  apagaAll.addEventListener('click', function () {
    const lista = document.querySelector('.cart__items');
    lista.innerHTML = '';
    newLocalStorage();
    return lista;
  });
  recuperaLS();
};
