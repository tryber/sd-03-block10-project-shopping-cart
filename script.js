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
  const newTotal = Math.round((Number(localStorage.getItem('Total')) -
    parseFloat(event.target.innerHTML.match(/([0-9.]){1,}$/))) * 100) / 100;
  await event.target.remove();
  await localStorage.setItem('cart__items', document.getElementsByClassName('cart__items')[0].innerHTML);
  document.getElementsByClassName('total')[0].innerHTML = `${newTotal}`;
  localStorage.setItem('Total', newTotal);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  let total = Number(localStorage.getItem('Total'));
  total = Math.round((total + salePrice) * 100) / 100;
  li.className = 'item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  document.getElementsByClassName('total')[0].innerHTML = `${total}`;
  localStorage.setItem('Total', total);

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
  loading.innerHTML = '<div class= spinner-border text-primary role= status><span class= sr-only>Loading...</span></div>';
  await fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(respo => respo.json())
    .then(products => document.getElementsByClassName('cart__items')[0]
      .appendChild(createCartItemElement(items(products))));
  await localStorage.setItem('cart__items', document.getElementsByClassName('cart__items')[0].innerHTML);
  loading.innerHTML = '';
};

window.onload = async function onload() {
  const loading1 = document.getElementsByClassName('loading')[0];
  loading1.innerHTML = '<span class= loading class= sr-only>Loading...</span>';
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(resp => resp.json())
    .then(json => json.results.forEach(products => document.getElementsByClassName('items')[0]
      .appendChild(createProductItemElement(items(products)))));
  document.getElementsByClassName('cart__items')[0].innerHTML = localStorage.getItem('cart__items');
  document.querySelectorAll('li').forEach(item => item.addEventListener('click', cartItemClickListener));
  document.getElementsByClassName('empty-cart')[0].addEventListener('click', () => {
    document.getElementsByClassName('cart__items')[0].innerHTML = '';
    localStorage.setItem('cart__items', document.getElementsByClassName('cart__items')[0].innerHTML);
    localStorage.setItem('Total', 0);
    document.getElementsByClassName('total')[0].innerHTML = '0';
  });
  if (!localStorage.getItem('Total')) {
    localStorage.setItem('Total', 0);
  }
  document.getElementsByClassName('total')[0].innerHTML = this.localStorage.getItem('Total');
  loading1.innerHTML = '';
};
