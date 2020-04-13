// const products = [];
const items = document.querySelector('.items');
const cartItems = document.querySelector('.cart__items');
const removeAllItems = document.querySelector('.empty-cart');
const totalPrice = document.createElement('p');
const cart = document.getElementsByClassName('cart');
totalPrice.setAttribute('class', 'total-price');
totalPrice.innerText = 'Total is : 0';
const itemsAdd = [];

async function priceCaculator(arr) {
  let price = 0;
  arr.forEach((element) => {
    const URL = `https://api.mercadolibre.com/items/${element}`;
    fetch(URL, { method: 'get' })
  .then(resp => resp.json())
  .then((data) => {
    price += data.price;
    totalPrice.innerText = `Total is : ${price}`;
  });
  });
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const indexRemoved = Array.from(event.currentTarget.parentNode.children).indexOf(event.target);
  // itemsAdd = arrayITensListCart.splice(indexRemoved, 1);
  itemsAdd.splice(indexRemoved, 1);
  event.currentTarget.parentNode.removeChild(event.target);
  localStorage.setItem('listItemsAdd', JSON.stringify(itemsAdd));
  priceCaculator(JSON.parse(localStorage.getItem('listItemsAdd')));
  totalPrice.innerText = 'Total is : 0';
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Retorna um unico produto filtrado pelo id.
function loadJsonPerProduct(id) {
  const URL = `https://api.mercadolibre.com/items/${id}`;
  fetch(URL, { method: 'get' })
  .then(resp => resp.json())
  .then((data) => {
    cartItems.appendChild(createCartItemElement(data));
    cart[0].appendChild(totalPrice);
    console.log(data.id);
    itemsAdd.push(data.id);
    localStorage.setItem('listItemsAdd', JSON.stringify(itemsAdd));
    priceCaculator(JSON.parse(localStorage.getItem('listItemsAdd')));
  })
  .catch((err) => {
    console.error(err);
  });
}

function reloadCartList() {
  const itemsForReloadCart = localStorage.getItem('listItemsAdd');
  const itemsTemp = JSON.parse(itemsForReloadCart);
  if (itemsTemp == null) {
    console.log('valor nulo');
  } else {
    itemsTemp.forEach(element => loadJsonPerProduct(element));
  }
}

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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

// Retorna todas a lista de produtos que será utilizada pela aplicação .
function loadJson() {
  const loading = document.createElement('p');
  loading.setAttribute('class', 'loading');
  loading.innerHTML = 'LOADING ..';
  items.appendChild(loading);
  const URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(URL, { method: 'get' })
  .then(resp => resp.json())
  .then(function (data) {
    data.results.forEach((element) => {
      items.appendChild(createProductItemElement(element));
    });
    items.removeChild(loading);
    const buttonAdd = document.querySelectorAll('.item__add');
    buttonAdd.forEach((element) => {
      element.addEventListener('click', function (event) {
        const idProduct = event.currentTarget.parentNode.firstChild.innerText;
        loadJsonPerProduct(idProduct);
      });
    });
  })
  .catch((err) => {
    console.error(err);
  });
}

window.onload = function onload() {};

  // reloadCartList();
(async () => {
  try {
    await reloadCartList();
    await loadJson();
    priceCaculator(JSON.parse(localStorage.getItem('listItemsAdd')));
  } catch (error) {
    console.log('erro durante atualização:', error);
  }
})();

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

removeAllItems.addEventListener('click', function () {
  cartItems.innerHTML = '';
  localStorage.removeItem('listItemsAdd');
  totalPrice.innerText = `Total is : 0`;
  priceCaculator(JSON.parse(localStorage.getItem('listItemsAdd')));
});
