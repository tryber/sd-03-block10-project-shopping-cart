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
  const element = event.target;
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

function fetchCreateCart() {
  const id = this.parentElement.firstChild.innerText;
  const cartOl = document.querySelector('.cart__items');
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then(response => response.json())
    .then((responseJson) => {
      appendChildOfCreate(cartOl, createCartItemElement, responseJson, 'salePrice', 'price');
    });
}

function returnApiInCreateCartItem(selector = 0) {
  for (let i = 0; i < selector.length; i += 1) {
    selector[i].addEventListener('click', fetchCreateCart);
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

window.onload = function onload() {
  returnApiInCreateItem();
  returnApiInCreateCartItem();
};
