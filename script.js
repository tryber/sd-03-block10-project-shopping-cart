const fetchAPI = url => fetch(url).then(response => response.json());

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

const loading = () => {
  document.querySelector('.container').appendChild(
  createCustomElement('p', 'loading', 'loading...'));
};

const notLoading = () => {
  if (document.querySelector('.loading')) {
    document.querySelector('.loading').remove();
  }
};
const storedCart = () => localStorage.setItem('cart-items',
document.getElementsByClassName('cart__items')[0].innerHTML);

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(event) {
  event.target.remove();
  storedCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const cartAdd = async (idSku) => {
  loading();
  const cartList = document.getElementsByClassName('cart__items')[0];
  const cartItem = await fetchAPI(`https://api.mercadolibre.com/items/${idSku}`);
  cartList.appendChild(createCartItemElement({ sku: cartItem.id,
    name: cartItem.title,
    salePrice: cartItem.price }));
  storedCart();
  notLoading();
};

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const clrBtn = document.getElementsByClassName('empty-cart')[0];

clrBtn.addEventListener('click', () => {
  const list = document.getElementsByClassName('cart__items')[0];
  list.innerHTML = '';
  storedCart();
});

const loadCart = () => {
  document.getElementsByClassName('cart__items')[0].innerHTML = localStorage.getItem('cart-items');
};

window.onload = function onload() {
  loadCart();
  document.getElementsByClassName('cart__items')[0].childNodes.forEach(e =>
    e.addEventListener('click', cartItemClickListener));
  const itemList = async () => {
    loading();
    const apiJson = await fetchAPI('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
    const items = this.document.getElementsByClassName('items')[0];
    apiJson.results.forEach((e) => {
      const item = { sku: e.id, name: e.title, image: e.thumbnail };
      items.appendChild(createProductItemElement(item));
    });
    notLoading();
  };
  itemList();
};
