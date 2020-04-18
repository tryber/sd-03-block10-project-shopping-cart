const fetchAPI = url => fetch(url).then(response => response.json());

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
  const addBtn = section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  addBtn.addEventListener('click', () => cartAdd(sku));
  return section;
}

const cartAdd = async (idSku) => {
  const cartList = document.getElementsByClassName('cart__items')[0];
  const cartItem = await fetchAPI(`https://api.mercadolibre.com/items/${idSku}`);
  cartList.appendChild(createCartItemElement({ sku: cartItem.id,
    name: cartItem.title,
    salePrice: cartItem.price }));
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
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

window.onload = function onload() {
  const itemList = async () => {
    const apiJson = await fetchAPI('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
    const items = this.document.getElementsByClassName('items')[0];
    apiJson.results.forEach((e) => {
      const item = { sku: e.id, name: e.title, image: e.thumbnail };
      items.appendChild(createProductItemElement(item));
    });
  };
  itemList();
};