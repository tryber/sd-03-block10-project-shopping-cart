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
  li.addEventListener('click', event => cartItemClickListener(event, sku));
  document.querySelector('.cart__items').appendChild(li);
}

function addCart(sku) {
  return fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(response => response.json())
    .then(data =>
      createCartItemElement({
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      }),
    );
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section
    .appendChild(
      createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
    )
    .addEventListener('click', () => addCart(sku));

  return section;
}

async function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function StartApi() {
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(data =>
      data.results.forEach(e =>
        document.getElementsByClassName('items')[0].appendChild(
          createProductItemElement({
            sku: e.id,
            name: e.title,
            image: e.thumbnail,
          }),
        ),
      ),
    );
  document
    .getElementsByClassName('empty-cart')[0]
    .addEventListener('click', () => {
      document.getElementsByClassName('cart__items')[0].innerHTML = '';
    });
}
window.onload = function onload() {
  StartApi();
};
