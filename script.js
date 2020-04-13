// window.onload = function onload() { };
// const fetch = require('node-fetch');

// const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
// const myObj = { method: 'GET' };
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

const saveLocalItems = () => {
  localStorage.setItem('cartItems', document.getElementsByClassName('cart__items')[0].innerHTML);
};

const emptyCart = () => {
  document.getElementsByClassName('empty-cart')[0].addEventListener('click', () => {
    document.querySelectorAll('li').forEach((el) => {
      el.remove();
    });
    saveLocalItems();
  });
};

function cartItemClickListener(event) {
  event.target.remove();
  saveLocalItems();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCart = (data) => {
  const obj = {
    sku: data.id,
    name: data.title,
    salePrice: data.price,
  };
  const li = createCartItemElement(obj);
  const ol = document.querySelector('.cart__items');
  ol.appendChild(li);
};

const addToCartFetch = async ({ sku }) => {
  const response = await fetch(`https://api.mercadolibre.com/items/${sku}`);
  const data = await response.json();
  addToCart(data);
  // updatePrices(data.base_price);
  saveLocalItems();
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const addButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  addButton.addEventListener('click', () => {
    addToCartFetch({ sku });
  });
  section.appendChild(addButton);

  return section;
}

const fetchar = async () => {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  const data = await response.json();
  const emptyArr = [];
  data.results.forEach((produto) => {
    emptyArr.push({
      sku: produto.id,
      name: produto.title,
      image: produto.thumbnail,
    });
  });
  const produtos = document.querySelector('.items');
  emptyArr.forEach((el) => {
    produtos.appendChild(createProductItemElement(el));
  });
  document.getElementsByClassName('cart__items')[0].innerHTML = localStorage.getItem('cartItems');
  document.querySelectorAll('li')
    .forEach(el => el.addEventListener('click', cartItemClickListener));
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// Immediately-invoked await async function
(async () => {
  try {
    await fetchar();
    await emptyCart();
  } catch (error) {
    console.log('Something went wrong:\n', error);
  }
})();
