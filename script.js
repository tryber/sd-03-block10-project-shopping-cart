window.onload = function onload() { };

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener() { }
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addToCart(ItemID) {
  fetch(`https://api.mercadolibre.com/items/${ItemID}`)
    .then(e => e.json())
    .then((e) => {
      const objeto = { sku: [e.id], name: [e.title], salePrice: [e.price] };
      const cartElement = createCartItemElement(objeto);
      document.querySelector('.cart__items').appendChild(cartElement);
    });
}

function addEvents() {
  const buttons = document.getElementsByClassName('item__add');
  for (let i = 0; i < buttons.length; i += 1) {
    buttons[i].addEventListener('click', e => addToCart(e.target.parentNode.querySelector('.item__sku').innerText));
  }
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const itens = document.querySelector('.items');
fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(result => result.json())
  .then(result => result.results)
  .then(result => result.forEach((e) => {
    const elementObject = {
      sku: [e.id],
      name: [e.title],
      image: [e.thumbnail],
    };
    const elemento = createProductItemElement(elementObject);
    itens.appendChild(elemento);
  }))
  .then(addEvents);
