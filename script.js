const API_URL = "https://api.mercadolibre.com/sites/MLB/search?q=$computador";

window.onload = async () => {
  const listaDeitens = document.querySelector('.items');

  await fetch(API_URL)
  .then((response) => response.json())
  .then((data) => {
    const results = data.results;
    results.forEach(({id, title, thumbnail}) => {
      console.log(id,title,thumbnail);
      listaDeitens.appendChild(createProductItemElement({ id, name, image }));      
    });
    return data;
  })
  .catch(() => console.log('ERROR Listar listarProdutos'));
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

function createProductItemElement({ sku, name, image }) {
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
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
