window.onload = function onload() { };

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

const storageLocal = async () => {
  const ol = document.getElementsByClassName('cart__items')[0];
  const totalPrice = document.getElementsByClassName('total-price')[0];
  localStorage.setItem('Cart Items', ol.innerHTML);
  localStorage.setItem('Total Price', totalPrice.innerHTML);
};


const finalPrice = () => {
  const cartItem = document.querySelectorAll('.cart__item');
  const price = Math.round([...cartItem].map(e => e.innerText
    .match(/([0-9.]){1,}$/))
    .reduce((acc, e) => (acc + parseFloat(e)), 0) * 100) / 100;
  const spanCartPrice = document.getElementsByClassName('total-price')[0];
  spanCartPrice.innerHTML = price;
};

function cartItemClickListener(event) {
  event.target.remove();
  finalPrice();
  storageLocal();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
