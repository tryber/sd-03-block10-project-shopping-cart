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
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const API = url => fetch(url);

/* const addItem = async ({ sku }) => {
  const ol = document.getElementsByClassName('cart_items')[0];
  const loading = document.createElement('span');
  loading.innerHTML = 'Loading...';
  ol.appendChild(loading);
  const responseAPI = await API(`https://api.mercadolibre.com/items/${sku}`);
  const data = await responseAPI.json();
  const product = await createCartItemElement({
    sku: data.id,
    name: data.title,
    salePrice: data.price,
  });
  ol.removeChild(loading);
  ol.appendChild(product);
}; */


window.onload = function onload() {
  const listItems = async () => {
    const itemSection = document.getElementsByClassName('items')[0];
    const responseAPI = await API('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
    const data = await responseAPI.json();
    console.log(data.results);
    data.results.forEach((e) => {
      const object = { sku: e.id, name: e.title, image: e.thumbnail };
      itemSection.appendChild(createProductItemElement(object));
    });
  };
  listItems();
};
