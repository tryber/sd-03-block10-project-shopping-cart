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

async function cartItemClickListener(event) {
  const newtotal = Math.round((Number(localStorage.getItem('cart_total'))
    - parseFloat(event.target.innerHTML.match(/([0-9.]){1,}$/))) * 100) / 100;
  await event.target.remove();
  await localStorage.setItem('cart__items', document.getElementsByClassName('cart__items')[0].innerHTML);
  document.getElementsByClassName('total_value')[0].innerHTML = `${newtotal}`;
  localStorage.setItem('cart_total', newtotal);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  let total = Number(localStorage.getItem('cart_total'));
  total = Math.round((total + salePrice) * 100) / 100;
  li.className = 'cart__items';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  document.getElementsByClassName('total_value')[0].innerHTML = `${total}`;
  localStorage.setItem('cart_total', total);
  return li;
}

const updateList = dados => ({
  sku: dados.id,
  name: dados.title,
  image: dados.thumbnail,
  salePrice: dados.price,
});

async function addItemToCart(sku) {
  await fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(resp => resp.json())
    .then(products => document.getElementsByClassName('cart__items')[0]
      .appendChild(createCartItemElement(updateList(products))));
  await localStorage.setItem('cart__items', document.getElementsByClassName('cart__items')[0].innerHTML);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', () => addItemToCart(sku));

  return section;
}

window.onload = async function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(res => res.json())
    .then(json => json.results.forEach(products => document.getElementsByClassName('items')[0]
      .appendChild(createProductItemElement(updateList(products)))));
  document.getElementsByClassName('cart__items')[0].innerHTML = localStorage.getItem('cart__items');
  document.querySelectorAll('li').forEach(list => list.addEventListener('click', cartItemClickListener));
  document.getElementsByClassName('empty-cart')[0].addEventListener('click', () => {
    document.getElementsByClassName('cart__items')[0].innerHTML = '';
    localStorage.setItem('cart__items', document.getElementsByClassName('cart__items')[0].innerHTML);
    localStorage.setItem('cart_total', 0);
    document.getElementsByClassName('total_value')[0].innerHTML = `0`;
  });
  if (!localStorage.getItem('cart_total')) {
    localStorage.setItem('cart_total', 0);
  }
  document.getElementsByClassName('total_value')[0].innerHTML = localStorage.getItem('cart_total');
  document.getElementsByClassName('loading')[0].innerHTML = '';
};
