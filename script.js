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
          .addEventListener('click', () => addToCart(sku));
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // console.log(event)
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  return li;
}

addToCart = sku => fetch(`https://api.mercadolibre.com/items/${sku}`)
  .then(response => response.json())
  .then(add => document.getElementsByClassName('cart__items')[0].appendChild(createCartItemElement({
    sku: add.id,
    name: add.title,
    salePrice: add.price,
  })));

window.onload = async () => {
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(obj => obj.results.map(e => document.getElementsByClassName('items')[0].appendChild(createProductItemElement({
      sku: e.id,
      image: e.thumbnail,
      name: e.title,
    }))));
};
