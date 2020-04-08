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

async function sumCartsItemPrice() {
  try {
    const arrayLis = [...document.querySelector('.cart__items').childNodes];
    const container = document.querySelector('section.total-price');
    container.innerText = arrayLis.reduce((total, li) =>
      total + Number(/PRICE: \$(\d*\.?\d{0,2})$/.exec(li.innerText)[1])
    , 0)
    .toFixed(0);
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

function addItemToCart(event) {
  const id = getSkuFromProductItem(event.target.parentNode);
  const URL = `https://api.mercadolibre.com/items/${id}`;
  const request = {
    method: 'GET',
    Headers: { Accept: 'application/JSON' },
  };

  fetch(URL, request)
    .then(data => data.json())
    .then(json =>
      document.getElementById('cart__items')
      .appendChild(createCartItemElement(json)))
    .then(() => updateLocalStorage())
    .then(() => sumCartsItemPrice())
    .catch(erro => erro);
}

function createProductItemElement({ id: sku, title: name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));

  if (image !== undefined) section.appendChild(createProductImageElement(image));

  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', addItemToCart);
  section.appendChild(button);

  return section;
}

function putLoading() {
  const div = document.createElement('.loading');
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
    document.querySelector('.loading').innerText = 'OPS something went wrong';
  }
}

window.onload = function onload() {
  seek('computador'); // async

  document.querySelector('.empty-cart')
  .addEventListener('click', () => {
    const lis = [...document.querySelector('.cart__items').childNodes];
    lis.forEach(li => li.remove());
    updateLocalStorage();
  });

  document.querySelector('.cart__items').innerHTML = localStorage.getItem('list');
  resetClickEventOnCartItems();

  sumCartsItemPrice();
};

// module.exports = {
//   fetchInMercadoLivre,
// };
