const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', () => get(sku));
  
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const cart = document.getElementsByClassName('cart__items');

async function get(sku) {
  return fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(response => response.json())
    .then(data => createCartItemElement({
      sku: data.id,
      name: data.title,
      salePrice: data.price,
    }))
    .then(e => cart[0].appendChild(e));
}

const itens = async () => {
  await fetch(url)
  .then(response => response.json())
  .then(data => data.results.forEach(e => document.getElementsByClassName('items')[0]
    .appendChild(createProductItemElement({
      sku: e.id,
      name: e.title,
      image: e.thumbnail,
      }))));
  };

window.onload = function onload() {
  itens();
};
