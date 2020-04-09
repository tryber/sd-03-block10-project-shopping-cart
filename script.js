window.onload = function onload() {};

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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const createdButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  createdButton.addEventListener('click', () => {
    fetch(`https://api.mercadolibre.com/items/${sku}`)
      .then(data => data.json())
      .then((dataJson) => {
        document.getElementsByClassName('cart__items')[0].appendChild(createCartItemElement({
          sku: dataJson.id,
          name: dataJson.title,
          salePrice: dataJson.price,
        }));
      });
  });
  section.appendChild(createdButton);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const API = url => fetch(url);
API('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
  .then(data => data.json())
  .then((dataJson) => {
    const itemsSec = document.getElementsByClassName('items')[0];
    dataJson.results.forEach((e) => {
      const obj = { sku: e.id, name: e.title, image: e.thumbnail };
      itemsSec.appendChild(createProductItemElement(obj));
    });
  });
