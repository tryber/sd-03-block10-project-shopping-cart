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

let sum = 0;
const finalPrice = (price) => {
  sum += price;
  const spanCartPrice = document.getElementsByClassName('total-price')[0];
  spanCartPrice.innerHTML = sum.toFixed(2);
};

const cartItemClickListener = async (price) => {
  await finalPrice(-price);
  await storageLocal();
};

window.onload = function onload() {
  if (localStorage.getItem('Cart Items')) {
    document.getElementsByTagName('ol')[0].innerHTML = localStorage.getItem('Cart Items');
    document.getElementsByClassName('total-price')[0].innerHTML = parseInt(localStorage.getItem('Total Price'), 10);
    document.querySelectorAll('.cart__item').forEach(e => e.addEventListener('click', (event) => {
      event.target.remove();
      cartItemClickListener();
    }));
  }
};

const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => {
    event.target.remove();
    cartItemClickListener(salePrice);
  });
  return li;
};

const API = url => fetch(url);

const addItem = async (sku) => {
  const ol = document.getElementsByClassName('cart__items')[0];
  const itemResponse = await API(`https://api.mercadolibre.com/items/${sku}`);
  const dataJson = await itemResponse.json();
  const product = createCartItemElement({
    sku: dataJson.id,
    name: dataJson.title,
    salePrice: dataJson.price,
  });
  await ol.appendChild(product);
  await finalPrice(dataJson.price);
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

const sectionItens = async () => {
  const productsResponse = await API('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  const data = await productsResponse.json();
  const itemsSec = document.getElementsByClassName('items')[0];
  data.results.forEach((e) => {
    const obj = { sku: e.id, name: e.title, image: e.thumbnail };
    itemsSec.appendChild(createProductItemElement(obj));
  });
};
sectionItens();

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
