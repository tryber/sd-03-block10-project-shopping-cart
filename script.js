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
  updateLocalStorage();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createProductItemElement({ id: sku, title: name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));

  if (image !== undefined) section.appendChild(createProductImageElement(image));

  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', () => {
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
      .catch(erro => erro);
  });

  section.appendChild(button);

  return section;
}

function fetchInMercadoLivre(elem) {
  const URL = `https://api.mercadolibre.com/sites/MLB/search?q=${elem}`;
  const request = {
    method: 'GET',
    Headers: { Accept: 'application/JSON' },
  };

  return fetch(URL, request);
}

function updateLocalStorage() {
  const ol = document.querySelector('.cart__items');
  localStorage.setItem('list', ol.innerHTML);
}

function resetClickEventOnCartItems() {
  const ol = document.querySelector('.cart__items');
  ol.childNodes.forEach(li => li.addEventListener('click', cartItemClickListener));
}

window.onload = function onload() {
  fetchInMercadoLivre('computador')
    .then(data => data.json())
    .then(data => data.results)
    .then((results) => {
      results.forEach((elem) => {
        document.getElementById('items-container')
        .appendChild(createProductItemElement(elem));
      });
    })
    .catch(() => console.log('deu algo errado'));

  document.querySelector('.empty-cart')
  .addEventListener('click', () => {
    const li_s = [...document.querySelector('.cart__items').childNodes];
    li_s.forEach(li => li.remove());
    updateLocalStorage();
  });

  document.querySelector('.cart__items').innerHTML = localStorage.getItem('list');
  resetClickEventOnCartItems();

};

// module.exports = {
//   fetchInMercadoLivre,
// };
