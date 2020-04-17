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

async function cartItemClickListener(event) {
  await event.target.remove();
  await localStorage.setItem('cart__items', document.querySelector('.cart__items').innerHTML);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  return li;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', () => addItems(sku));

  return section;
}

const items = product => ({
  sku: product.id,
  name: product.title,
  salePrice: product.price,
  image: product.thumbnail,
});

addItems = async (sku) => {
  await fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(data => data.json())
    .then(products => document.querySelector('.cart__items')
      .appendChild(createCartItemElement(items(products))));
  await localStorage.setItem('cart__items', document.getElementsByClassName('cart__items')[0].innerHTML);
};

window.onload = async function onload() {
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(resp => resp.json())
    .then(json => json.results.forEach(products => document.getElementsByClassName('items')[0]
      .appendChild(createProductItemElement(items(products)))));
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('cart__items');
  document.querySelectorAll('li').forEach(item => item.addEventListener('click', cartItemClickListener));
  document.querySelector('.empty-cart')[0].addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    localStorage.setItem('cart__items', document.querySelector('.cart__items').innerHTML);
  });
};
