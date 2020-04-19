const rmLoading = () => {
  document.getElementsByClassName('loading')[0].remove();
};

const createCustomElement = (element, className, innerText) => {
  const elem = document.createElement(element);
  elem.className = className;
  elem.innerText = innerText;
  return elem;
};

const loading = (item) => {
  document.getElementsByClassName(item)[0].appendChild(createCustomElement('p', 'loading', ''));
};

const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const cartUp = () => {
  localStorage.setItem('Cart-items', document.getElementsByClassName('cart__items')[0].innerHTML);
  const total = Math.round(localStorage.getItem('cart_total') * 100) / 100;
  document.getElementsByClassName('total-price')[0].textContent = total;
};

const cartItemClickListener = (event) => {
  event.target.remove();
  let totalCart = parseFloat(localStorage.getItem('cart_total'));
  totalCart = parseFloat(totalCart) - parseFloat(event.target.textContent.match(/([0-9.])+$/));
  localStorage.setItem('cart_total', totalCart);
  cartUp();
};

const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const urlApi = api => fetch(api).then(response => response.json());

const appendCart = (parentClass, callback, obj) => document
.getElementsByClassName(parentClass)[0]
.appendChild(callback(obj));

const addCartItem = ({ sku }) => {
  loading('cart__items');
  urlApi(`https://api.mercadolibre.com/items/${sku}`)
  .then((product) => {
    appendCart('cart__items', createCartItemElement, {
      sku: product.id,
      name: product.title,
      salePrice: product.price,
    });
    localStorage.setItem('cart_total', product.price + parseFloat(localStorage.getItem('cart_total')));
    rmLoading();
    cartUp();
  });
};

const createProductItemElement = ({ sku, name, image }) => {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const btnAddToCart = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  btnAddToCart.addEventListener('click', () => {
    addCartItem({ sku });
  });
  section.appendChild(btnAddToCart);
  return section;
};

const pItems = (json) => {
  json.results.forEach(item => appendCart('items', createProductItemElement, {
    sku: item.id,
    name: item.title,
    image: item.thumbnail,
  }));
};

const search = async () => {
  document.getElementsByClassName('items')[0].innerHTML = '';
  await loading('items');
  await urlApi(`https://api.mercadolibre.com/sites/MLB/search?q=${document.getElementsByClassName('input')[0].value}`)
    .then((json) => {
      pItems(json);
      rmLoading();
    });
};

// const getSkuFromProductItem = item => item.querySelector('span.item__sku').innerText;

window.onload = async () => {
  loading('items');
  document.getElementsByClassName('cart__items')[0].innerHTML = localStorage.getItem('Cart-items');
  if (!localStorage.getItem('cart_total')) localStorage.setItem('cart_total', 0);
  await urlApi('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((json) => {
      pItems(json);
      rmLoading();
    });
  document.getElementsByClassName('empty-cart')[0].addEventListener('click', () => {
    document.getElementsByClassName('cart__items')[0].innerHTML = '';
    localStorage.setItem('cart_total', 0);
    cartUp();
  });
  document.querySelectorAll('li').forEach(li => li.addEventListener('click', cartItemClickListener));
  document.getElementsByClassName('input-btn')[0].addEventListener('click', search);
  cartUp();
  document.getElementsByClassName('input')[0].addEventListener('keydown', (event) => {
    if (event.keyCode === 13) search();
  });
};
