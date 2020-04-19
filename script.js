const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
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
  addLoading('cart__items');
  urlApi(`https://api.mercadolibre.com/items/${sku}`)
  .then((product) => {
      appendCart('cart__items', createCartItemElement, {
        sku: product.id,
        name: product.title,
        salePrice: product.price,
      });
  localStorage.setItem('cart_total', product.price + parseFloat(localStorage.getItem('cart_total')));
  removeLoading();
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

const getSkuFromProductItem = item => item.querySelector('span.item__sku').innerText;

window.onload = function onload() { };
