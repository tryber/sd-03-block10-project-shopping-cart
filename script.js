const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computer';

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

const cart = document.getElementsByClassName('cart__items');

async function getSku(sku) {
  return fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(response => response.json())
    .then(data =>
      createCartItemElement({
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      }),
    )
    .then(e => cart[0].appendChild(e));
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
    .addEventListener('click', () => getSku(sku));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function sumPrice(salePrice) {
  const totalPrice = document.querySelector('.total-price');
  const sum = Math.round((JSON.parse(totalPrice.innerHTML) + JSON.parse(salePrice)) * 100) / 100;
  totalPrice.innerHTML = sum;
}

// async function cartItemClickListener(event, sku) {
//   const localParsed = JSON.parse(localStorage.cart);
//   const item = localParsed.find(e => e.sku === sku);
//   await sumPrice(-item.salePrice);
//   const index = localParsed.findIndex(e => e.sku === item.sku);
//   localParsed.splice(index, 1);
//   localStorage.cart = JSON.stringify(localParsed);
//   event.target.remove();
// }

async function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  await sumPrice(salePrice);
  li.addEventListener('click', event => cartItemClickListener(event, sku));
  document.querySelector('.cart__items').appendChild(li);
}

window.onload = async () => {
  await fetch(url)
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
};
