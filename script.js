const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const myObj = { method: 'GET' };
// Pegar Elementos no HTML
const sectionItem = document.querySelector('.items');
// Funções
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
function additemcart(event) {
  event.target.remove();
 }
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', additemcart);
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
  const API_LINK = `https://api.mercadolibre.com/items/${id}`;
  fetch(API_LINK)
    .then(response => response.json())
    .then(data => montarObjCartItem(data));
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

fetch(API_URL, myObj)
  .then(response => response.json())
  .then(jsonResponse => montarObj(jsonResponse))
  .then(arr => criaElementosNaTela(arr))
  .then(queryButtons);

