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

const saveCart = () => {
  localStorage.setItem('Cart Items', document.querySelector('.cart__items').innerHTML);
  localStorage.setItem('Total Price', document.querySelector('.total-price').innerHTML);
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

const sumItems = () => {
  const Itens = document.querySelectorAll('.cart__item');
  document.getElementsByClassName('total-price')[0].innerText = Math.round(
    [...Itens].map(item => item.innerHTML.match(/[\d.\d]+$/))
              .reduce((acc, add) => acc + parseFloat(add), 0) * 100) / 100;
};

function cartItemClickListener(event) {
  event.target.remove();
  saveCart();
  sumItems();
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
  const product = await fetchProductData(sku)
    .then(productData =>
      createCartItemElement({
        sku: productData.id, name: productData.title, salePrice: productData.price,
      }),
    );
  ol.appendChild(product);
  sumItems();
  saveCart();
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
  const list = document.getElementsByClassName('cart__items')[0];
  list.innerHTML = '';
  sumItems();
  saveCart();
}

function chargeLocalStorage() {
  const lastTotalPrice = localStorage.getItem('Total Price');
  document.querySelector('.total-price').innerHTML = lastTotalPrice;

  const cartItems = localStorage.getItem('Cart Items');
  document.querySelector('.cart__items').innerHTML = cartItems;
  const array = document.querySelectorAll('.cart__item');
  array.forEach(el => el.addEventListener('click', cartItemClickListener));
}

window.onload = function onload() {
  chargeLocalStorage();

  const clearAll = document.getElementsByClassName('empty-cart')[0];
  clearAll.addEventListener('click', emptyCart);
};
