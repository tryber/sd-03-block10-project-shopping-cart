window.onload = function onload() {
  getProductData();
};

const productModel = () => {
  return {
    sku: result.id,
    name: result.title,
    price: result.price,
    image: result.thumbnail,
  };
};

async function getProductData() {
  const queryKey = 'computador';
  const API_URL = `https://api.mercadolibre.com/sites/MLB/search?q=${queryKey}`;
  const myObject = { method: 'GET', headers: { Accept: 'application/json' } };
  fetch(API_URL, myObject)
    .then(response => response.json())
    .then(data => {
      const dataBase = data
      console.log(dataBase);
    })
    .then(dataBase => {
      const productData = dataBase.results.map(result => {
        return {
          sku: result.id,
          name: result.title,
          price: result.price,
          image: result.thumbnail,
        };
      });
      return productData;
    })
    .then(() => console.log(productData));
  // .then(data => {
  //   return data.results.map(results => {}
  // })
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
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
