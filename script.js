// window.onload = function onload() { };
// const fetch = require('node-fetch');

// const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
// const myObj = { method: 'GET' };


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
};


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

const addToCartFetch = async (id) => {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const data = await response.json();
  addToCart(data);
};

const addIdToCart = (event) => {
  const accessSession = event.target.parentNode;
  const access = accessSession.firstChild.innerText;
  addToCartFetch(access);
};

const acessButtons = () => {
  const catchButtons = document.querySelectorAll('.item__add');
  for (let i = 0; i < catchButtons.length; i += 1) {
    catchButtons[i].addEventListener('click', addIdToCart);
  }
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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // add here
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Immediately-invoked await async function
(async () => {
  try {
    const response = await fetchar();
    const accessBtns = await acessButtons();
  } catch (error) {
    console.log("Something went wrong:", error)
  }
})();
