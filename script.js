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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const btnAddCart = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  btnAddCart.addEventListener('click', () => {
    fetch(`https://api.mercadolibre.com/items/${sku}`)
      .then(data => data.json())
      .then((product) => {
        const item = document.getElementsByClassName('cart__items')[0];
        item.appendChild(createCartItemElement({
          sku: product.id,
          name: product.title,
          salePrice: product.price,
        }));
      });
  });
  section.appendChild(btnAddCart);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}


// const cart = (data) => {
//   let obj = {
//     sku: data.id,
//     name: data.title,
//     salePrice: data.price,
//   };
//   const li = createCartItemElement(obj);
//   const ol = document.querySelector('.cart__items');
//   ol.appendChild(li);
// };

window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(data => data.json())
    .then((json) => {
      json.results.forEach((product) => {
        document.querySelector('.items')
          .appendChild(createProductItemElement(
            {
              sku: product.id,
              name: product.title,
              image: product.thumbnail,
            },
          ));
      });
    });
};
