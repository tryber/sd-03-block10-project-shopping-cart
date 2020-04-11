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

function changeTotalValue(textElement) {
  const regexItemPrice = /\$[0-9]{1,10}\.{0,1}[0-9]{0,5}/;
  const itemRegex = regexItemPrice.exec(textElement)[0];
  const regexOnlyNumbers = /[0-9]{1,10}\.{0,1}[0-9]{0,5}/;
  const itemRegexOnlyNumbers = regexOnlyNumbers.exec(itemRegex)[0];
  const totalTagText = document.querySelector('.total-price');
  const totalTagNumber = parseFloat(totalTagText.innerText);
  let totalValue = totalTagNumber;
  totalValue -= itemRegexOnlyNumbers;
  totalTagText.innerText = totalValue.toFixed(2);
}

function cartItemClickListener(event) {
  const regexSkuId = /MLB[0-9]{10}/;
  const element = event.target;
  const textElement = element.innerText;
  const itemRegex = regexSkuId.exec(textElement)[0];
  const resgLocalStorage = localStorage.getItem('cart').split(',');
  const indexResg = resgLocalStorage.findIndex(item => item === itemRegex);
  resgLocalStorage.splice(indexResg, 1);
  const newArrayItemLocalStorage = resgLocalStorage;
  if (newArrayItemLocalStorage.length < 1) {
    localStorage.removeItem('cart');
  } else {
    localStorage.setItem('cart', newArrayItemLocalStorage);
  }
  changeTotalValue(textElement);
  element.parentElement.removeChild(element);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function appendChildOfCreate(elementHtml, functionCreate, json, keyParam, valueParam) {
  const param = { sku: json.id, name: json.title, [keyParam]: json[valueParam] };
  elementHtml.appendChild(functionCreate(param));
}

let arrayItemLocalStorage;

function callItemCart(id) {
  return fetch(`https://api.mercadolibre.com/items/${id}`);
}

async function fetchCreateCartClickListener() {
  const id = this.parentElement.firstChild.innerText;
  const cartOl = document.querySelector('.cart__items');
  const totalTagText = document.querySelector('.total-price');
  const totalTagNumber = parseFloat(totalTagText.innerText);
  let totalValue = totalTagNumber;
  const response = await callItemCart(id);
  const data = await response.json();
  totalValue += data.price;
  totalTagText.innerText = totalValue.toFixed(2);
  appendChildOfCreate(cartOl, createCartItemElement, data, 'salePrice', 'price');
  const resg = localStorage.getItem('cart');
  if (resg === null) {
    arrayItemLocalStorage = [];
    arrayItemLocalStorage.push(id);
    localStorage.setItem('cart', arrayItemLocalStorage);
  } else {
    arrayItemLocalStorage = resg.split(',');
    arrayItemLocalStorage.push(id);
    localStorage.setItem('cart', arrayItemLocalStorage);
  }
}

function returnApiInCreateCartItem(selector = 0) {
  for (let i = 0; i < selector.length; i += 1) {
    selector[i].addEventListener('click', fetchCreateCartClickListener);
  }
}

function returnApiInCreateItem() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const sectionItems = document.querySelector('.items');
  fetch(url)
    .then(response => response.json())
    .then(responseResult => responseResult.results.forEach((item) => {
      appendChildOfCreate(sectionItems, createProductItemElement, item, 'image', 'thumbnail');
    }))
    .then(() => {
      returnApiInCreateCartItem(document.querySelectorAll('.item__add'));
    });
}

function createCartItemsLocalStorage() {
  let resgLocalStorForCart = localStorage.getItem('cart');
  const cartOl = document.querySelector('.cart__items');
  if (resgLocalStorForCart !== null) {
    resgLocalStorForCart = resgLocalStorForCart.split(',');
    for (let i = 0; i < resgLocalStorForCart.length; i += 1) {
      fetch(`https://api.mercadolibre.com/items/${resgLocalStorForCart[i]}`)
        .then(response => response.json())
        .then(responseJson =>
          appendChildOfCreate(cartOl, createCartItemElement, responseJson, 'salePrice', 'price'));
    }
  }
}

window.onload = function onload() {
  returnApiInCreateItem();
  returnApiInCreateCartItem();
  createCartItemsLocalStorage();
};
