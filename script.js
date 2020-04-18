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

const addToCart = async (sku) => {
  const getApi = await fetch(`https://api.mercadolibre.com/items/${sku}`);
  const apiWait = await getApi.json();
  const carItens = createCartItemElement({
    sku: apiWait.id,
    name: apiWait.title,
    salePrice: apiWait.price,
  });
  const cart = document.getElementsByClassName('cart__items')[0];
  cart.appendChild(carItens);
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const buttonCart = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  buttonCart.addEventListener('click', () => addToCart(sku));
  section.appendChild(buttonCart);

  return section;
}

window.onload = function onload() {
  const addItems = async () => {
    const openApi = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
    const awaitApi = await openApi.json();
    const itemsHTML = document.getElementsByClassName('items')[0];
    awaitApi.results.forEach((e) => {
      const values = { sku: e.id, name: e.title, image: e.thumbnail };
      itemsHTML.appendChild(createProductItemElement(values));
    });
  };
  addItems();
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
