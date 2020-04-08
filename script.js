const proxyUrl = "https://cors-anywhere.herokuapp.com/";

const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const sumPrices = () => {
  const cartItem = document.querySelectorAll('.cart__item');
  document.getElementsByClassName('total-price')[0].textContent = Math.floor([...cartItem].map(e => e.textContent
    .match(/([0-9.]){1,}$/))
    .reduce((acc, price) => acc + parseFloat(price), 0));
};

const updateCart = () => {
  localStorage.setItem('Cart-items', document.getElementsByClassName('cart__items')[0].innerHTML);
  sumPrices();
};

const cartItemClickListener = (event) => {
  event.target.remove();
  updateCart();
};

const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const fetchAPI = api => fetch(api).then(response => response.json());

const appendElement = (parentClass, callback, obj) => document
  .getElementsByClassName(parentClass)[0]
  .appendChild(callback(obj));

const addToCart = async ({ sku }) => {
  await fetchAPI(`${proxyUrl}https://api.mercadolibre.com/items/${sku}`, { mode: 'cors' })
    .then(product => appendElement('cart__items', createCartItemElement, {
      sku: product.id,
      name: product.title,
      salePrice: product.price,
    }));
  await updateCart();
};

const createProductItemElement = ({ sku, name, image }) => {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const btnAddToCart = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  btnAddToCart.addEventListener('click', () => {
    addToCart({ sku });
  });
  section.appendChild(btnAddToCart);
  return section;
};

const loading = () => {
  document.getElementsByClassName('items')[0].appendChild(createCustomElement('p', 'loading', 'loading'));
};

const removeLoading = () => {
  document.getElementsByClassName('loading')[0].remove();
};

window.onload = async () => {
  loading();
  await fetchAPI(`${proxyUrl}https://api.mercadolibre.com/sites/MLB/search?q=computador`, { mode: 'cors' })
    .then((json) => {
      json.results.forEach(item => appendElement('items', createProductItemElement, {
        sku: item.id,
        name: item.title,
        image: item.thumbnail,
      }));
      removeLoading();
    });
  document.getElementsByClassName('empty-cart')[0].addEventListener('click', () => {
    document.getElementsByClassName('cart__items')[0].innerHTML = '';
    updateCart();
  });
  document.getElementsByClassName('cart__items')[0].innerHTML = localStorage.getItem('Cart-items');
  document.querySelectorAll('li').forEach(li => li.addEventListener('click', cartItemClickListener));
  await sumPrices();
};
