const convert = add => ({
  sku: add.id,
  name: add.title,
  salePrice: add.price,
  image: add.thumbnail,
});

const priceTotal = () => {
  const Itens = document.querySelectorAll('.cart__item');
  document.getElementsByClassName('total-price')[0].textContent = Math.round(
    [...Itens].map(item => item.textContent.match(/[\d.\d]+$/))
.reduce((ac, cv) => ac + parseFloat(cv), 0) * 100) / 100;
};

const storage = () => {
  priceTotal();
  localStorage.setItem('cart list', document.getElementsByClassName('cart__items')[0].innerHTML);
  localStorage.setItem('total price', document.getElementsByClassName('total-price')[0].innerHTML);
};

function cartItemClickListener(event) {
  document.getElementsByClassName('cart__items')[0].removeChild(event.target);
  storage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const request = url => fetch(url).then(resp => resp.json());

const addChild = (element, child) => element.appendChild(child);

const addToCart = async (sku) => {
  await request(`https://api.mercadolibre.com/items/${sku}`)
  .then(res => addChild(document.getElementsByClassName('cart__items')[0],
  createCartItemElement(convert(res))));
  storage();
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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', () => addToCart(sku));
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

window.onload = async () => {
  await request('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(res => res.results.map(pc => addChild(
    document.getElementsByClassName('items')[0], createProductItemElement(convert(pc)))));
  document.getElementsByClassName('cart__items')[0].innerHTML = localStorage.getItem('cart list');
  document.getElementsByClassName('total-price')[0].innerHTML = localStorage.getItem('total price');
  document.querySelectorAll('li').forEach(element => element.addEventListener('click', cartItemClickListener));
  document.getElementsByClassName('empty-cart')[0].addEventListener('click', () => {
    document.getElementsByClassName('cart__items')[0].innerHTML = ''; storage();
  });
};
