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
  const products = document.querySelectorAll('.cart__item');
  const priceDisplayed = document.querySelector('.total-price');
  priceDisplayed.innerText = Math.round(
    [...products]
    .map(item => item.textContent.match(/([0-9.]){1,}$/))
    .reduce((total, price) => total + parseFloat(price), 0)
    .toFixed(2) * 100) / 100;
};

const saveItens = () => localStorage.setItem('cart', document.querySelector('.cart__items').innerHTML);

const cartItemClickListener = (event) => {
  event.target.remove();
  sumPrices();
  saveItens();
};

const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

function item2(idReturned) {
  return fetch(`https://api.mercadolibre.com/items/${idReturned}`);
}

const addProduct = async ({ sku }) => {
  const item = await item2(sku)
    .then(response => response.json())
    .then(data =>
      createCartItemElement({
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      }),
    );
  document.querySelector('.cart__items').appendChild(item);
  sumPrices();
  saveItens();
};

const createProductItemElement = ({ sku, name, image }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const buttonAddCart = createCustomElement(
    'button',
    'item__add',
    'Adicionar ao carrinho!',
  );
  buttonAddCart.addEventListener('click', () => {
    addProduct({ sku });
  });
  section.appendChild(buttonAddCart);

  return section;
};

const emptyCart = () => {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = '';
  sumPrices();
  saveItens();
};

const getSkuFromProductItem = item =>
  item.querySelector('span.item__sku').innerText;

function item1(typedSearch) {
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=$${typedSearch}`);
}

const search = 'computer';

window.onload = async () => {
  const itemsSection = document.querySelector('.items');
  const cartItems = document.querySelector('.cart__items');
  const buttonEmpty = document.querySelector('.empty-cart');

  await item1(search)
  .then(response => response.json())
  .then((data) => {
    data.results.forEach(({ id, title, thumbnail }) => {
      itemsSection.appendChild(
        createProductItemElement({
          sku: id,
          name: title,
          image: thumbnail,
        }),
      );
    });
    document.querySelector('.loading').remove();
  });

  buttonEmpty.addEventListener('click', emptyCart);
  cartItems.innerHTML = localStorage.getItem('cart');
  document.querySelectorAll('li').forEach(item => item.addEventListener('click', cartItemClickListener));

  sumPrices();
};
