const myObject = { method: 'GET', headers: new Headers() };

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

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addElementToCart = async ({ sku }) => {
  await fetch(`https://api.mercadolibre.com/items/${sku}`)
  .then(data => data.json())
  .then((product) => {
    document.getElementsByClassName('cart__items')[0].appendChild(createCartItemElement({
      sku: product.id,
      name: product.title,
      salePrice: product.price,
    }));
  });
  await (localStorage.setItem('itemCart', document.getElementsByClassName('cart__items')[0].innerHTML));
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const btnAddCart = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  btnAddCart.addEventListener('click', () => addElementToCart({ sku }));
  section.appendChild(btnAddCart);
  return section;
}

function apiCreateItem() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador', myObject)
  .then(response => response.json())
  .then((data) => {
    const items = document.querySelector('.items');

    data.results.map(function (res) {
      return items.appendChild(createProductItemElement(
        {
          sku: res.id,
          name: res.title,
          image: res.thumbnail,
        },
        ));
    });
  });
}

window.onload = function onload() {
  apiCreateItem();
  document.getElementsByClassName('empty-cart')[0].addEventListener('click', () => {
    localStorage.setItem('itemCart', '');
    document.getElementsByClassName('cart__items')[0].innerHTML = '';
  });
  document.getElementsByClassName('cart__items')[0].innerHTML = localStorage.getItem('itemCart');
  document.querySelectorAll('li').forEach(li => li.addEventListener('click', cartItemClickListener));
};
