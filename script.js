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

const storageLocal = async () => {
  const ol = document.getElementsByClassName('cart__items')[0];
  const totalPrice = document.getElementsByClassName('total-price')[0];
  localStorage.setItem('Cart Items', ol.innerHTML);
  localStorage.setItem('Total Price', totalPrice.innerHTML);
};


const finalPrice = () => {
  const cartItem = document.querySelectorAll('.cart__item');
  const price = Math.round([...cartItem].map(e => e.innerText
    .match(/([0-9.]){1,}$/))
    .reduce((acc, e) => (acc + parseFloat(e)), 0) * 100) / 100;
  const spanCartPrice = document.getElementsByClassName('total-price')[0];
  spanCartPrice.innerHTML = price;
};

const cartItemClickListener = (event) => {
  event.target.remove();
  finalPrice();
  storageLocal();
};

const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const API = url => fetch(url);

const addItem = async (sku) => {
  const ol = document.getElementsByClassName('cart__items')[0];
  const loading = document.createElement('span');
  loading.innerHTML = 'Loading...';
  ol.appendChild(loading);
  const itemResponse = await API(`https://api.mercadolibre.com/items/${sku}`);
  const dataJson = await itemResponse.json();
  const product = await createCartItemElement({
    sku: dataJson.id,
    name: dataJson.title,
    salePrice: dataJson.price,
  });
  ol.removeChild(loading);
  await ol.appendChild(product);
  await finalPrice();
  await storageLocal();
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const createdButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  createdButton.addEventListener('click', () => addItem(sku));
  section.appendChild(createdButton);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const emptyCart = () => {
  const ol = document.getElementsByClassName('cart__items')[0];
  while (ol.childNodes.length > 0) {
    ol.removeChild(ol.lastElementChild);
  }
  const spanCartPrice = document.getElementsByClassName('total-price')[0];
  spanCartPrice.innerHTML = '';
  storageLocal();
};

window.onload = function onload() {
  if (localStorage.getItem('Cart Items')) {
    document.getElementsByTagName('ol')[0].innerHTML = localStorage.getItem('Cart Items');
    document.getElementsByClassName('total-price')[0].innerHTML = parseFloat(localStorage.getItem('Total Price'));
    document.querySelectorAll('.cart__item').forEach(e => e.addEventListener('click', cartItemClickListener));
  }
  const buttonEmpty = document.getElementsByClassName('empty-cart')[0];
  buttonEmpty.addEventListener('click', emptyCart);

  const sectionItens = async () => {
    const load = document.getElementsByClassName('loading')[0];
    load.innerHTML = 'Loading...';
    const productsResponse = await API('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
    const data = await productsResponse.json();
    const itemsSec = document.getElementsByClassName('items')[0];
    data.results.forEach((e) => {
      const obj = { sku: e.id, name: e.title, image: e.thumbnail };
      itemsSec.appendChild(createProductItemElement(obj));
    });
    load.remove();
  };
  sectionItens();
};


// API('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
//   .then(data => data.json())
//   .then((dataJson) => {
//     const itemsSec = document.getElementsByClassName('items')[0];
//     dataJson.results.forEach((e) => {
//       const obj = { sku: e.id, name: e.title, image: e.thumbnail };
//       itemsSec.appendChild(createProductItemElement(obj));
//     });
//   });

// localStorage.setItem('Cart Items', document.getElementsByTagName('ol')[0].innerHTML);
