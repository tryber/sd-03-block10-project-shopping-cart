window.onload = function onload() {};

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

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addEvent(product) {
  product.lastChild.addEventListener('click', () => {
    const itemID = product.firstChild.innerHTML;
    item2(itemID)
      .then(response => response.json())
      .then((data) => {
        const { id, title, price } = data;
        const cartList = document.querySelector('.cart__items');
        cartList.appendChild(createCartItemElement({ sku: id, name: title, salePrice: price }));
      });
  });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  addEvent(section);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function item1(typedSearch) {
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=$${typedSearch}`);
}

/* function doSubmit() {
  const search = 'computer';
  item1(search)
    .then (response => response.json())
    .then (data => {
      data.results.forEach(element => {
        const {id, title, thumbnail} = element;
        const results = document.querySelector('.results');
        results.appendChild(createProductItemElement({sku: id, name: title, image: thumbnail}));
      });
    })
}*/

async function doSubmit() {
  const search = 'computer';
  const searchResults = await item1(search);
  const data = await searchResults.json();
  data.results.forEach((element) => {
    const { id, title, thumbnail } = element;
    const results = document.querySelector('.results');
    results.appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail }));
  });
}

doSubmit();

function item2(idReturned) {
  return fetch(`https://api.mercadolibre.com/items/${idReturned}`);
}

