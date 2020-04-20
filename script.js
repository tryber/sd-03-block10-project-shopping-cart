atualiza = () => localStorage.setItem('Lista Salva', document.getElementsByClassName('Cart__items')[0].innerHTML);

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
  event.remove();
  atualiza();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const naorepete = test => ({
  sku: test.id,
  name: test.title,
  salePrice: test.price,
  image: test.thumbnail,
});

addToCart = sku => fetch(`https://api.mercadolibre.com/items/${sku}`)
  .then(aux => aux.json())
  .then(test => document.getElementsByClassName('cart__items')[0].appendChild(createCartItemElement(naorepete(test))));

window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(aux => aux.json())
    .then(obj => obj.results.map(x => document.getElementsByClassName('items')[0].appendChild(createProductItemElement(naorepete(x)))));
  document.getElementsByClassName('cart__items')[0].innerHTML = localStorage.getItem('Lista Salva');
  document.querySelectorAll('li').forEach(inner => inner.addEventListener('click', () => cartItemClickListener(inner)));
};
