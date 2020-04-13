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

async function cartItemJson() {
  document.querySelectorAll('.item').forEach(
    (element) => {
      const itemId = element.querySelector('.item__sku').innerHTML;
      const button = element.querySelector('.item__add');
      button.addEventListener(
        'click',
        async () => {
          const address = `https://api.mercadolibre.com/items/${itemId}`;
          const item = await fetch(address)
          const itemJson = await item.json();
          const itemCart = await mercadoLivreResults({ results: [itemJson] });
          itemCart.forEach(
            product =>
            document.querySelector('.cart__items').appendChild(createCartItemElement(product)),
          )
        }
      )
    }
  )
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

async function mercadoLivreJson() {
  const api = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  return api.json();
}

async function mercadoLivreResults(funMLJson) {
  const results = await funMLJson.results;
  const objItems = await results.map(
    item => ({
      sku: item.id,
      name: item.title,
      image: item.thumbnail,
      salePrice: item.price,
    }),
  );
  return objItems;
}

async function printProducts(funMLResults) {
  funMLResults.forEach(
    product =>
    document.querySelector('.items').appendChild(createProductItemElement(product)),
  );
}

async function start() {
  const apiJson = await mercadoLivreJson();
  const objItems = await mercadoLivreResults(apiJson);
  await printProducts(objItems);
  const jsonCart = await cartItemJson();
}

window.onload = start;
