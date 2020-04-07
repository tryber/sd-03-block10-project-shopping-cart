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
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchAPI = api => fetch(api).then(response => response.json());

const appendElement = (parentClass, callback, obj) => document
  .getElementsByClassName(parentClass)[0]
  .appendChild(callback(obj));


function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const btnAddToCart = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  btnAddToCart.addEventListener('click', () => {
    fetchAPI(`https://api.mercadolibre.com/items/${sku}`)
      .then((product) => appendElement('cart__items', createCartItemElement, {
        sku: product.id,
        name: product.title,
        salePrice: product.price,
      }));
  });
  section.appendChild(btnAddToCart);
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

window.onload = function onload() {
  fetchAPI('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((json) => {
      json.results.forEach(item => appendElement('items', createProductItemElement, {
        sku: item.id,
        name: item.title,
        image: item.thumbnail,
      }));
    });
  document.getElementsByClassName('empty-cart')[0].addEventListener('click', () => {
    document.getElementsByClassName('cart__items')[0].innerHTML = '';
  });
};
