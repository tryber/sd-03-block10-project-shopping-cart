// const products = [];
const items = document.querySelector('.items');
const cartItems = document.querySelector('.cart__items');
let arrayITensListCart = [];
let itemsAdd = [];
window.onload = function onload() {
  const itemsForReloadCart = localStorage.getItem('listItemsAdd');
  arrayITensListCart = JSON.parse(itemsForReloadCart);
  console.log(arrayITensListCart);
  arrayITensListCart.forEach(element => this.loadJsonPerProduct(element));
};

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const indexRemoved = Array.from(event.currentTarget.parentNode.children).indexOf(event.target);
  // itemsAdd = arrayITensListCart.splice(indexRemoved, 1);
  console.log(itemsAdd.splice(indexRemoved, 1));
  event.currentTarget.parentNode.removeChild(event.target);
  localStorage.setItem('listItemsAdd', JSON.stringify(itemsAdd));
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
    itemsAdd.push(data.id);
    localStorage.setItem('listItemsAdd', JSON.stringify(itemsAdd));
  })
  .catch((err) => {
    console.error(err);
  });  
}

// Retorna todas a lista de produtos que será utilizada pela aplicação .
function loadJson() {
  const URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(URL, { method: 'get' })
  .then(resp => resp.json())
  .then(function (data) {
    data.results.forEach((element) => {
      items.appendChild(createProductItemElement(element));
    });
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

loadJson();
