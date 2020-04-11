window.onload = function onload() {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('loadCart');
  document.querySelectorAll('.cart__item').forEach(el => el.addEventListener('click', this.cartItemClickListener));
};

const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const myObject = {
  method: 'GET',
  headers: { Accept: 'application/json' },
};

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

function cartItemClickListener(li) {
  // coloque seu código aqui
  li.target.remove();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

let totalPrice = 0;

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.querySelector('button').addEventListener('click', () => {
    const load = document.createElement('div');
    load.innerHTML = 'Loading';
    load.className = 'loading';
    document.querySelector('.cart__items').appendChild(load);
    const URL = `https://api.mercadolibre.com/items/${sku}`;
    fetch(URL, myObject)
      .then(data => data.json())
      .then((data) => {
        document.querySelector('.loading').remove();
        const { id, title, price } = data;
        totalPrice += price;
        const newItem = createCartItemElement({ id, title, price });
        console.log(document.querySelector('.cart__item'));
        document.querySelector('.cart__items').appendChild(newItem);
      });
  });
  return section;
}

const cartPrice = document.createElement('div');
cartPrice.className = 'total-price';
cartPrice.innerHTML = totalPrice

const load = document.createElement('div');
load.innerHTML = 'Loading';
load.className = 'loading';
document.querySelector('.empty-cart').appendChild(load);

fetch(API_URL, myObject)
  .then(data => data.json())
  .then((data) => {
    load.innerHTML = '';
    data.results.forEach((el) => {
      const { id: sku, title: name, thumbnail: image } = el;
      const newElement = createProductItemElement({ sku, name, image });
      document.querySelector('.items').appendChild(newElement);
    });
  });

/* function getSkuFromProductItem(item) {
return item.querySelector('span.item__sku').innerText;
} */

document.querySelector('.empty-cart').addEventListener('click', () => {
  document.querySelector('.cart__items').innerHTML = '';
});

window.addEventListener('unload', () => {
  localStorage.setItem('loadCart', document.querySelector('.cart__items').innerHTML);
  console.log(document.querySelector('.cart__items').innerHTML);
});
