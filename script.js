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
  const newTotal = Math.round((Number(localStorage.getItem('Total')) -
    parseFloat(event.target.innerHTML.match(/([0-9.]){1,}$/))) * 100) / 100;
  await event.target.remove();
  await localStorage.setItem('carrinho', document.getElementsByClassName('cart__items')[0].innerHTML);
  document.getElementsByClassName('total-price')[0].innerHTML = newTotal;
  localStorage.setItem('Total', newTotal);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  let total = Number(localStorage.getItem('Total'));
  total = Math.round((total + salePrice) * 100) / 100;
  document.getElementsByClassName('total-price')[0].innerHTML = total;
  localStorage.setItem('Total', total);
  return li;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const btn = (createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  btn.addEventListener('click', async () => {
    await fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(resp => resp.json())
    .then((json) => {
      const item = document.getElementsByClassName('cart__items')[0];
      item.appendChild(
        createCartItemElement({ sku: json.id, name: json.title, salePrice: json.price }));
      console.log('valor do produto: $', json.price);
    });
    await localStorage.setItem('carrinho', document.getElementsByClassName('cart__items')[0].innerHTML);
  });
  section.appendChild(btn);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

window.onload = async function onload() {
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(res => res.json())
    .then((json) => {
      json.results.forEach((products) => {
        document.getElementsByClassName('items')[0]
        .appendChild(
          createProductItemElement(
            { sku: products.id, name: products.title, image: products.thumbnail }));
      });
    });
  document.getElementsByClassName('cart__items')[0].innerHTML = localStorage.getItem('carrinho');
  document.querySelectorAll('li').forEach(item => item.addEventListener('click', cartItemClickListener));

  const btnEmptyCart = document.getElementsByClassName('empty-cart')[0];

  btnEmptyCart.addEventListener('click', () => {
    document.getElementsByClassName('cart__items')[0].innerHTML = '';
    localStorage.setItem('carrinho', document.getElementsByClassName('cart__items')[0].innerHTML);
    localStorage.setItem('Total', 0);
    document.getElementsByClassName('total-price')[0].innerHTML = '0';
  });
  if (!localStorage.getitem('Total')) {
    localStorage.setItem('Total', 0);
  }
  document.getElementsByClassName('total-price')[0].innerHTML = this.localStorage.getItem('Total');
};
