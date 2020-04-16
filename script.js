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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function cartItemClickListener(event) {
  await event.target.remove();
  await localStorage.setItem('cart__items', document.getElementsByClassName('cart__items')[0].innerHTML);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  return li;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', () => adicionarItemAoCarrinho(sku));

  return section;
}

const items = dados => ({
  sku: dados.id,
  name: dados.title,
  salePrice: dados.price,
  image: dados.thumbnail,
});

adicionarItemAoCarrinho = async (sku) => {
  const loading = document.getElementsByClassName('cart__item')[0];
loading.innerHTML = `<div class=\spinner-border text-primary\ role=\status\><span class=\sr-only\>Loading...</span></div>`;
  await fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(respo => respo.json())
    .then(products => document.getElementsByClassName('cart__items')[0]
      .appendChild(createCartItemElement(items(products))));
  await localStorage.setItem('cart__items', document.getElementsByClassName('cart__items')[0].innerHTML);
  loading.innerHTML = '';
};

window.onload = async function onload() {
  const loading1 = document.getElementsByClassName('cart__item')[0];
  loading1.innerHTML = `<div class=\spinner-border text-primary\ role=\status\><span class=\sr-only\>Loading.</span></div>`;
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(resp => resp.json())
    .then(json => json.results.forEach(products => document.getElementsByClassName('items')[0]
      .appendChild(createProductItemElement(items(products)))));
  document.getElementsByClassName('cart__items')[0].innerHTML = localStorage.getItem('cart__items');
  document.querySelectorAll('li').forEach(item => item.addEventListener('click', cartItemClickListener));
  document.getElementsByClassName('empty-cart')[0].addEventListener('click', () => {
    document.getElementsByClassName('cart__items')[0].innerHTML = '';
    localStorage.setItem('cart__items', document.getElementsByClassName('cart__items')[0].innerHTML);
  });
  loading1.innerHTML = '';
};
