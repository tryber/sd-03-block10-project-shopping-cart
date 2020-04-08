update = () => localStorage.setItem('Lista Salva', document.getElementsByClassName('cart__items')[0].innerHTML);

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

cartItemClickListener = async (event) => {
  await event.target.remove();
  await update();
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  update();
  return li;
}

const DontRepeat = add => ({
  sku: add.id,
  name: add.title,
  salePrice: add.price,
  image: add.thumbnail,
});

addToCart = async (sku) => {
  await fetch(`https://api.mercadolibre.com/items/${sku}`)
  .then(response => response.json())
  .then(add => document.getElementsByClassName('cart__items')[0].appendChild(createCartItemElement(DontRepeat(add))));
  await update();
};

window.onload = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(obj => obj.results.map(e => document.getElementsByClassName('items')[0]
          .appendChild(createProductItemElement(DontRepeat(e)))));
  document.getElementsByClassName('cart__items')[0].innerHTML = localStorage.getItem('Lista Salva');
  document.querySelectorAll('li').forEach(inner => inner.addEventListener('click', cartItemClickListener));
  document.getElementsByClassName('empty-cart')[0].addEventListener('click', () => {
    document.getElementsByClassName('cart__items')[0].innerHTML = '';
    update();
  });
};
