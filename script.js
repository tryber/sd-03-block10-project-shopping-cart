
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

function createStorage({ sku, name, salePrice }) {
  if (!localStorage.cart) {
    localStorage.setItem('cart', JSON.stringify([{ sku, name, salePrice }]));
  } else {
    const localCart = JSON.parse(localStorage.cart);
    localCart.push({ sku, name, salePrice });
    const newCart = JSON.stringify(localCart);
    localStorage.setItem('cart', newCart);
  }
}

async function getDetailsToCart(id) {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const respToJson = await response.json();
  const sku = respToJson.id;
  const name = respToJson.title;
  const salePrice = respToJson.price;
  const treatedToCart = { sku, name, salePrice };
  return treatedToCart;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const addButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  // addButton.addEventListener('click', createCartItemElement(detailsToCart))

  section.appendChild(addButton);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => {
    const localParsed = JSON.parse(localStorage.cart);
    const totalPrice = document.querySelector('.total-price');
    const item = localParsed.find(e => e.sku === sku);
    totalPrice.innerHTML = JSON.parse(totalPrice.innerHTML) - JSON.parse(item.salePrice);
    // console.log(item);
    // console.log(localParsed);

    const index = localParsed.findIndex(e => e.sku === item.sku);
    // console.log(index);
    // console.log('localStorage.cart:', localParsed);
    localParsed.splice(index, 1);
    // console.log(localParsed);
    localStorage.cart = JSON.stringify(localParsed);
    cartItemClickListener(event);
  });
  return document.querySelector('.cart__items').appendChild(li);
}

async function getResponse() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const respToJson = await response.json();
  const treatedResp = respToJson.results;
  treatedResp.forEach((e) => {
    const sku = e.id;
    const name = e.title;
    const image = e.thumbnail;
    document.querySelector('.items').appendChild(createProductItemElement({ sku, name, image }));
  });

  document.querySelectorAll('.item').forEach(async (e) => {
    const sku = getSkuFromProductItem(e);
    const getDetails = await getDetailsToCart(sku);
    await e.lastChild.addEventListener('click', () => {
      const totalPrice = document.querySelector('.total-price');
      createStorage(getDetails);
      console.log(totalPrice);
      createCartItemElement(getDetails);
      totalPrice.innerHTML = JSON.parse(getDetails.salePrice) + JSON.parse(totalPrice.innerHTML);
    });
  });

  document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelectorAll('li.cart__item').forEach(e => e.remove());
    localStorage.clear();
    document.querySelector('.total-price').innerText = 0;
  });
}
getResponse()
  .catch((error) => {
    console.log('Error');
    console.error(error);
  });
if (localStorage.cart) {
  const storage = JSON.parse(localStorage.cart);
  storage.forEach(({ sku, name, salePrice }) => {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
    li.addEventListener('click', cartItemClickListener);
    document.querySelector('.cart__items').appendChild(li);
  });
}
window.onload = function onload() {

};
