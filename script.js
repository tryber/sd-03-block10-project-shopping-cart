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

function updateLocalStorage() {
  const ol = document.querySelector('.cart__items');
  localStorage.setItem('list', ol.innerHTML);
}

async function formatedSumOfPricesIn(array) {
  let value = array.reduce((total, li) =>
    total + parseFloat(/PRICE: \$(\d*\.?\d{0,2})$/.exec(li.innerText)[1])
  , 0).toFixed(2);

  while (value[value.length - 1] === '0') {
    value = value.slice(0, -1);
  }

  return (value[value.length - 1] === '.') ? value.slice(0, -1) : value;
}

async function sumCartsItemPrice() {
  try {
    const arrayLis = [...document.querySelector('.cart__items').childNodes];
    const container = document.querySelector('section.total-price');
    container.innerText = await formatedSumOfPricesIn(arrayLis);
  } catch (erro) {
    const container = document.querySelector('section.total-price');
    container.innerText = 'Something wrog in total calculator';
    console.log(erro);
  }
}

function cartItemClickListener(event) {
  event.target.remove();
  updateLocalStorage();
  sumCartsItemPrice();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addItemToCart(event) {
  const id = getSkuFromProductItem(event.target.parentNode);
  const URL = `https://api.mercadolibre.com/items/${id}`;
  const request = {
    method: 'GET',
    Headers: { Accept: 'application/JSON' },
  };

  try {
    const response = await fetch(URL, request);
    const json = await response.json();
    document.getElementById('cart__items')
      .appendChild(createCartItemElement(json));
    updateLocalStorage();
    sumCartsItemPrice();
  } catch (erro) {
    console.log('OPSS we couldn\'t put it in cart, SORRY, try again late');
  }
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));

  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', addItemToCart);
  section.appendChild(button);

  return section;
}

function putLoading() {
  const div = document.createElement('div');
  div.className = 'loading';
  div.innerText = 'loading...';
  document.body.appendChild(div);
}

const removeLoading = () => document.querySelector('.loading').remove();

function fetchInMercadoLivre(elem) {
  const URL = `https://api.mercadolibre.com/sites/MLB/search?q=${elem}`;
  const request = {
    method: 'GET',
    Headers: { Accept: 'application/JSON' },
  };

  putLoading();
  return fetch(URL, request);
}

function resetClickEventOnCartItems() {
  document.querySelector('.cart__items')
    .childNodes.forEach(li =>
      li.addEventListener('click', cartItemClickListener));
}

async function seek(data) {
  try {
    const reponse = await fetchInMercadoLivre(data);
    const json = await reponse.json();
    await json.results.forEach((elem) => {
      document.getElementById('items-container')
      .appendChild(createProductItemElement(elem));
    });
    removeLoading();
  } catch (erro) {
    if (document.querySelector('.loading')) removeLoading();

    const div = document.createElement('div');
    div.innerText = 'OPS something went wrong';
    console.log(erro);
  }
}

window.onload = function onload() {
  seek('computador'); // async

  document.querySelector('.empty-cart')
  .addEventListener('click', () => {
    const lis = [...document.querySelector('.cart__items').childNodes];
    lis.forEach(li => li.remove());
    updateLocalStorage();
    sumCartsItemPrice();
  });

  document.querySelector('.cart__items').innerHTML = localStorage.getItem('list');
  resetClickEventOnCartItems();

  sumCartsItemPrice();
};
