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

function setLoading(enable) {
  if (enable) {
    document.getElementsByClassName('items')[0]
      .appendChild(createCustomElement('p', 'loading', 'Loading...'));
  } else {
    document.getElementsByClassName('loading')[0].remove();
  }
}

const priceCart = () => {
  const cartItem = document.querySelectorAll('.cart__item');
  const cartPrice = document.querySelector('.total-price');
  cartPrice.innerText = Math.round(
    [...cartItem]
    .map(item => item.textContent.match(/([0-9.]){1,}$/))
    .reduce((acc, add) => acc + parseFloat(add), 0)
    .toFixed(2) * 100) / 100;
};

const updateCart = () => {
  priceCart();
  localStorage.setItem('Cart_items', document.getElementsByClassName('cart__items')[0].innerHTML);
  localStorage.setItem('Total_price', document.getElementsByClassName('total-price')[0].innerHTML);
};

function cartItemClickListener(event) {
  document.getElementsByClassName('cart__items')[0].removeChild(event.target);
  updateCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const selectCartItemElement = async ({ sku }) => { //
  await fetch(`https://api.mercadolibre.com/items/${sku}`)
  .then(data => data.json())
  .then((product) => {
    document.getElementsByClassName('cart__items')[0].appendChild(createCartItemElement({
      sku: product.id,
      name: product.title,
      salePrice: product.price,
    }));
    updateCart();
  });
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const selectBtn = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  selectBtn.addEventListener('click', () => {
    selectCartItemElement({ sku });
  });
  section.appendChild(selectBtn);
  return section;
}

window.onload = async () => {
  setLoading(true);
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(r => r.json())
  .then((data) => {
    data.results.map(function (res) {
      return document.querySelector('.items').appendChild(createProductItemElement(
        {
          sku: res.id,
          name: res.title,
          image: res.thumbnail,
        },
        ));
    });
    setLoading(false);
  });
  document.getElementsByClassName('empty-cart')[0].addEventListener('click', async () => {
    document.getElementsByClassName('cart__items')[0].innerHTML = '';
    await updateCart();
  });
  document.getElementsByClassName('cart__items')[0].innerHTML = localStorage.getItem('Cart_items');
  document.querySelectorAll('li').forEach(li => li.addEventListener('click', cartItemClickListener));
  await updateCart();
};
