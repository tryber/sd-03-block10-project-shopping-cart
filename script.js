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

const priceUpdate = async () => {
  const totalPrice = document.getElementsByClassName('total-price');
  const cartItemsHTMLcollection = document.getElementsByClassName('cart__item');
  const cartTotal = [...cartItemsHTMLcollection]
    .map(element => element.innerText.match(/([0-9.]){1,}$/))
    .reduce((accumulator, currentValue) => accumulator + parseFloat(currentValue), 0);
  totalPrice[0].innerHTML = cartTotal;
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCart = (sku) => {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(response => response.json())
    .then(data => ({ sku: data.id, name: data.title, salePrice: data.price }))
    .then(product => createCartItemElement(product))
    .then(object => document.querySelector('.cart__items').appendChild(object))
    .then(() => localStorage.setItem('cartItems', document.querySelector('.cart__items').innerHTML))
    .then(() => priceUpdate());
};

const createProductList = () => {
  const productArray = [];
  const itemsSection = document.querySelector('.items');
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json()).then(data => data.results.forEach(product =>
      productArray.push({ sku: product.id, name: product.title, image: product.thumbnail })))
    .then(() => productArray.forEach(obj =>
      itemsSection.appendChild(createProductItemElement(obj))));
};

window.onload = function onload() {
  return createProductList();
};
