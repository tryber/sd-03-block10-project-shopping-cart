// window.onload = function onload() { };

const fetchSeachResult = async () => {
  const result = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const apiJson = await result.json();
  return apiJson;
};

const fetchProductData = async (itemId) => {
  const product = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const productJson = await product.json();
  return productJson;
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

async function addToCart(sku) {
  const ol = document.getElementsByClassName('cart__items')[0];
  const product = await fetchProductData(sku);
  const productData = { sku: product.id, name: product.title, salePrice: product.price };
  ol.appendChild(createCartItemElement(productData));
}

// id, title, thumbnail
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const btn = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(btn);

  btn.addEventListener('click', () => addToCart(sku));

  return section;
}

function createProductItemList(products) {
  const section = document.getElementsByClassName('items')[0];

  products.forEach((product) => {
    const productData = { sku: product.id, name: product.title, image: product.thumbnail };
    section.appendChild(createProductItemElement(productData));
  });
  return section;
}

async function displayItem() {
  const results = await fetchSeachResult();
  createProductItemList(results.results);
}

displayItem();

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function emptyCart() {
  const list = document.getElementsByTagName('cart__items');
  const productsList = list.child;
  let first = productsList[0];
  while (first) {
    first.remove();
    first = productsList[0];
  }
}

const btnLimparTudo = document.getElementsByTagName('empty-cart');

console.log(btnLimparTudo);

// coisinha.addEventListener('click', emptyCart)
