const naoRepeat = op => ({
  sku: op.id,
  name: op.title,
  salePrice: op.price,
  image: op.thumbnail,
});

const addTotal = () => {
  const Itens = document.querySelectorAll('.cart__item');
  document.getElementsByClassName('total-price')[0].textContent = Math.round(
    [...Itens].map(item => item.textContent.match(/[\d.\d]+$/))
.reduce((acc, add) => acc + parseFloat(add), 0) * 100) / 100;
};

const atualiza = () => {
  addTotal();
  localStorage.setItem('cart list', document.getElementsByClassName('cart__items')[0].innerHTML);
  localStorage.setItem('total price', document.getElementsByClassName('total-price')[0].innerHTML);
};

function cartItemClickListener(event) {
  document.getElementsByClassName('cart__items')[0].removeChild(event.target);
  atualiza();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const URL = url => fetch(url).then(test => test.json());

const addChild = (element, child) => element.appendChild(child);

const addToCart = async (sku) => {
  await URL(`https://api.mercadolibre.com/items/${sku}`)
  .then(aux => addChild(document.getElementsByClassName('cart__items')[0],
  createCartItemElement(naoRepeat(aux))));
  atualiza();
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
  await URL('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(aux => aux.results.map(pc => addChild(
    document.getElementsByClassName('items')[0], createProductItemElement(naoRepeat(pc)))));
  document.getElementsByClassName('cart__items')[0].innerHTML = localStorage.getItem('cart list');
  document.getElementsByClassName('total-price')[0].innerHTML = localStorage.getItem('total price');
  document.querySelectorAll('li').forEach(element => element.addEventListener('click', cartItemClickListener));
  document.getElementsByClassName('empty-cart')[0].addEventListener('click', () => {
    document.getElementsByClassName('cart__items')[0].innerHTML = ''; atualiza();
  });
};
