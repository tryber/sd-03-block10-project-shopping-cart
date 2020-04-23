window.onload = function onload() { };

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

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', (del) => {
    del.target.remove();
  });
  return li;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.querySelector('button').addEventListener('click', () => {
    fetch(`https://api.mercadolibre.com/items/${sku}`, { method: 'get' })
    .then(data => data.json())
    .then((data) => {
      const { id, title, price } = data;
      const addItem = createCartItemElement({ id, title, price });
      document.querySelector('.cart__items').appendChild(addItem);
    });
  });
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

window.onload = async () => {
  const cartIten = document.querySelector('.items');

  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador', { method: 'get' })
  .then(info => info.json())
  .then((data) => {
    data.results.forEach((elemento) => {
      cartIten.appendChild(createProductItemElement(elemento));
    });
  });
};
