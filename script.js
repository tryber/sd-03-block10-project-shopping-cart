const cartList = document.getElementsByClassName('cart__items');

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

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  if (event.target) cartList[0].removeChild(event.target);
}

async function requestItemById(itemId) {
  return fetch(`https://api.mercadolibre.com/items/${itemId}`)
    .then(itemData => itemData.json())
    .then(data => createCartItemElement({
      sku: data.id,
      name: data.title,
      salePrice: data.price,
    }))
    .then(obj => cartList[0].appendChild(obj).addEventListener('click', cartItemClickListener(obj)));
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

window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(data => data.json())
    .then(obj => obj.results.forEach(item => document.getElementsByClassName('items')[0].appendChild(
      createProductItemElement({
        sku: item.id,
        name: item.title,
        image: item.thumbnail,
      }))));
};
